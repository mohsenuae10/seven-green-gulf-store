import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import Stripe from "https://esm.sh/stripe@18.5.0";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.57.2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface PaymentRequest {
  customerName: string;
  customerEmail?: string;
  customerPhone: string;
  country: string;
  city: string;
  address: string;
  quantity: number;
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const {
      customerName,
      customerEmail,
      customerPhone,
      country,
      city,
      address,
      quantity,
    }: PaymentRequest = await req.json();

    // ---- Validate input ----
    if (!customerName?.trim() || !customerPhone?.trim() || !country?.trim() || !city?.trim() || !address?.trim()) {
      throw new Error("بيانات الطلب غير مكتملة");
    }
    const qty = Number(quantity);
    if (!Number.isInteger(qty) || qty < 1 || qty > 100) {
      throw new Error("الكمية غير صحيحة");
    }

    const stripe = new Stripe(Deno.env.get("STRIPE_SECRET_KEY") || "", {
      apiVersion: "2025-08-27.basil",
    });

    const supabase = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? ""
    );

    // ---- Get the active product & price from the DB (never trust the client) ----
    const { data: products, error: productError } = await supabase
      .from("products")
      .select("id, name, price")
      .eq("is_active", true)
      .order("updated_at", { ascending: false })
      .limit(1);

    if (productError || !products || products.length === 0) {
      console.error("Product lookup failed:", productError);
      throw new Error("المنتج غير متوفر حالياً");
    }

    const product = products[0];
    const unitPrice = Number(product.price);
    if (!(unitPrice > 0)) {
      throw new Error("سعر المنتج غير صالح");
    }

    // ---- Compute the authoritative amount on the server ----
    const totalAmount = Math.round(unitPrice * qty * 100) / 100; // 2 decimals
    const amountInMinorUnits = Math.round(totalAmount * 100); // SAR -> halalas
    const currency = "sar";

    // ---- Find or create the Stripe customer ----
    let customerId: string | undefined;
    if (customerEmail) {
      const customers = await stripe.customers.list({ email: customerEmail, limit: 1 });
      if (customers.data.length > 0) {
        customerId = customers.data[0].id;
      }
    }
    if (!customerId) {
      const customer = await stripe.customers.create({
        email: customerEmail || undefined,
        name: customerName,
        phone: customerPhone,
        address: { line1: address, city, country },
      });
      customerId = customer.id;
    }

    // ---- Create the order (pending) ----
    const { data: orderData, error: orderError } = await supabase
      .from("orders")
      .insert({
        customer_name: customerName,
        customer_email: customerEmail || "",
        customer_phone: customerPhone,
        country,
        city,
        address,
        total_amount: totalAmount,
        status: "pending",
        payment_status: "pending",
      })
      .select()
      .single();

    if (orderError || !orderData) {
      console.error("Order creation failed:", orderError);
      throw new Error("فشل في إنشاء الطلب");
    }

    // ---- Create the order item ----
    const { error: itemError } = await supabase.from("order_items").insert({
      order_id: orderData.id,
      product_id: product.id,
      quantity: qty,
      unit_price: unitPrice,
      total_price: totalAmount,
    });
    if (itemError) {
      console.error("Order item creation failed:", itemError);
    }

    // ---- Create the PaymentIntent ----
    const paymentIntent = await stripe.paymentIntents.create({
      amount: amountInMinorUnits,
      currency,
      customer: customerId,
      payment_method_types: ["card"],
      metadata: {
        order_id: orderData.id,
        customer_name: customerName,
        customer_phone: customerPhone,
        quantity: String(qty),
      },
    });

    // ---- Link the PaymentIntent to the order for the webhook ----
    await supabase
      .from("orders")
      .update({ payment_intent_id: paymentIntent.id })
      .eq("id", orderData.id);

    return new Response(
      JSON.stringify({
        success: true,
        clientSecret: paymentIntent.client_secret,
        order_id: orderData.id,
        amount: totalAmount,
        currency,
      }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 200 }
    );
  } catch (error) {
    console.error("Error in create-payment-intent:", error);
    return new Response(
      JSON.stringify({
        success: false,
        error: error instanceof Error ? error.message : String(error),
      }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 500 }
    );
  }
});
