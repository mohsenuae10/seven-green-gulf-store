import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface OrderRequest {
  customerName: string;
  customerPhone: string;
  customerEmail?: string;
  country: string;
  city: string;
  address: string;
  quantity: number;
  totalAmount: number;
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const orderData: OrderRequest = await req.json();
    
    // Create Supabase client with service role for bypassing RLS
    const supabaseAdmin = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? ""
    );

    // Get product info
    const { data: product } = await supabaseAdmin
      .from("products")
      .select("*")
      .eq("name", "سيفن جرين")
      .single();

    if (!product) {
      throw new Error("Product not found");
    }

    // Create order in database
    const { data: order, error: orderError } = await supabaseAdmin
      .from("orders")
      .insert({
        customer_name: orderData.customerName,
        customer_phone: orderData.customerPhone,
        customer_email: orderData.customerEmail || "",
        country: orderData.country,
        city: orderData.city,
        address: orderData.address,
        total_amount: orderData.totalAmount,
        status: "pending",
        payment_status: "pending"
      })
      .select()
      .single();

    if (orderError) {
      console.error("Order creation error:", orderError);
      throw new Error("Failed to create order");
    }

    // Create order item
    await supabaseAdmin
      .from("order_items")
      .insert({
        order_id: order.id,
        product_id: product.id,
        quantity: orderData.quantity,
        unit_price: product.price,
        total_price: orderData.totalAmount
      });

    // Determine app origin for redirect URLs
    const originHeader = req.headers.get("origin") || undefined;
    const refererHeader = req.headers.get("referer") || undefined;
    const appOrigin = originHeader || (refererHeader ? new URL(refererHeader).origin : undefined);
    const finalOrigin = appOrigin || new URL(req.url).origin;

    // Create Ziina payment request
    const ziinaPayload = {
      amount: Math.round(orderData.totalAmount), // Amount in AED
      currency_code: "AED",
      message: `طلب Seven Green - ${orderData.quantity} قطعة من ${orderData.customerName}`,
      success_url: `${finalOrigin}/payment-success?order_id=${order.id}`,
      cancel_url: `${finalOrigin}/order`,
      failure_url: `${finalOrigin}/order`,
      test: true, // Set to false for production
      allow_tips: false
    };

    console.log("Creating Ziina payment with payload:", ziinaPayload);

    // Prepare Ziina API call (use base from secrets if provided; fallback to sandbox)
    const ziinaApiKey = Deno.env.get("ZIINA_API_KEY");
    if (!ziinaApiKey) {
      throw new Error("Missing Ziina API key");
    }
    const configuredBase = Deno.env.get("ZIINA_API_BASE") || "https://api.sandbox.ziina.com";
    const ziinaBase = configuredBase.replace(/\/+$/, "");
    console.log("Using Ziina API base:", ziinaBase);

    // Call Ziina API with correct endpoint and retry with fallback base on network failure
    let ziinaResponse: Response;
    try {
      ziinaResponse = await fetch(`${ziinaBase}/api/payment_intent`, {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${ziinaApiKey}`,
          "Content-Type": "application/json",
          "Accept": "application/json",
        },
        body: JSON.stringify(ziinaPayload),
      });
    } catch (fetchErr) {
      console.error("Primary Ziina base failed:", fetchErr);
      const fallbackBase = ziinaBase.includes("sandbox") ? "https://api-v2.ziina.com" : "https://api.sandbox.ziina.com";
      console.log("Retrying Ziina API with fallback base:", fallbackBase);
      ziinaResponse = await fetch(`${fallbackBase.replace(/\/+$/, "")}/api/payment_intent`, {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${ziinaApiKey}`,
          "Content-Type": "application/json",
          "Accept": "application/json",
        },
        body: JSON.stringify(ziinaPayload),
      });
    }

    const ziinaData = await ziinaResponse.json();
    console.log("Ziina API response (status " + ziinaResponse.status + "):", ziinaData);

    if (!ziinaResponse.ok) {
      console.error("Ziina API error:", ziinaData);
      throw new Error(`Ziina API error (${ziinaResponse.status}): ${ziinaData.message || "Unknown error"}`);
    }

    // Optionally store the payment intent ID in your orders table if a column exists (e.g., payment_intent_id)
    // Skipping update here because the current schema doesn't include such a column.

    return new Response(
      JSON.stringify({ 
        success: true, 
        payment_url: ziinaData.redirect_url,
        order_id: order.id 
      }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 200,
      }
    );

  } catch (error) {
    console.error("Payment creation error:", error);
    return new Response(
      JSON.stringify({ 
        success: false, 
        error: error.message 
      }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 500,
      }
    );
  }
});