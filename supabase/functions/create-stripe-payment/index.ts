import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import Stripe from "https://esm.sh/stripe@18.5.0";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.57.2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface PaymentRequest {
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  country: string;
  city: string;
  address: string;
  quantity: number;
  totalAmount: number;
  currency: string;
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    console.log("Creating Stripe payment session...");
    
    const { 
      customerName, 
      customerEmail, 
      customerPhone, 
      country, 
      city, 
      address, 
      quantity,
      totalAmount,
      currency
    }: PaymentRequest = await req.json();

    console.log("Payment request:", { customerName, customerEmail, quantity, totalAmount, currency });

    // Initialize Stripe
    const stripe = new Stripe(Deno.env.get("STRIPE_SECRET_KEY") || "", {
      apiVersion: "2025-08-27.basil",
    });

    // Initialize Supabase client
    const supabase = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? ""
    );

    // Check if customer exists in Stripe
    const customers = await stripe.customers.list({ 
      email: customerEmail, 
      limit: 1 
    });
    
    let customerId;
    if (customers.data.length > 0) {
      customerId = customers.data[0].id;
      console.log("Found existing customer:", customerId);
    } else {
      // Create new customer
      const customer = await stripe.customers.create({
        email: customerEmail,
        name: customerName,
        phone: customerPhone,
        address: {
          line1: address,
          city: city,
          country: country,
        },
      });
      customerId = customer.id;
      console.log("Created new customer:", customerId);
    }

    // Create order in database
    const { data: orderData, error: orderError } = await supabase
      .from('orders')
      .insert({
        customer_name: customerName,
        customer_email: customerEmail,
        customer_phone: customerPhone,
        country: country,
        city: city,
        address: address,
        total_amount: totalAmount,
        status: 'pending',
        payment_status: 'pending'
      })
      .select()
      .single();

    if (orderError) {
      console.error("Error creating order:", orderError);
      throw new Error("Failed to create order");
    }

    console.log("Created order:", orderData.id);

    // Get product ID from Supabase
    const { data: products, error: productError } = await supabase
      .from('products')
      .select('id')
      .eq('is_active', true)
      .limit(1)
      .single();

    if (productError || !products) {
      console.error("Error fetching product:", productError);
      throw new Error("Product not found");
    }

    // Create order item
    const { error: itemError } = await supabase
      .from('order_items')
      .insert({
        order_id: orderData.id,
        product_id: products.id,
        quantity: quantity,
        unit_price: totalAmount / quantity,
        total_price: totalAmount
      });

    if (itemError) {
      console.error("Error creating order item:", itemError);
      throw new Error("Failed to create order item");
    }

    // Create Stripe checkout session
    const session = await stripe.checkout.sessions.create({
      customer: customerId,
      line_items: [
        {
          price: "price_1S8m9g9IHXjyx3CsYX4juB8y", // Updated Stripe price ID for 5 AED
          quantity: quantity,
        },
      ],
      mode: "payment",
      success_url: `${req.headers.get("origin")}/payment-success?order_id=${orderData.id}`,
      cancel_url: `${req.headers.get("origin")}/order`,
      metadata: {
        order_id: orderData.id,
        customer_name: customerName,
        customer_phone: customerPhone,
      },
    });

    console.log("Created Stripe session:", session.id);

    return new Response(JSON.stringify({ 
      success: true,
      payment_url: session.url,
      order_id: orderData.id 
    }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 200,
    });

  } catch (error) {
    console.error("Error in create-stripe-payment:", error);
    return new Response(JSON.stringify({ 
      success: false,
      error: error.message 
    }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 500,
    });
  }
});