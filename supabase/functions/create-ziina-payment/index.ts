
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
    console.log("Received order data:", orderData);
    
    // Create Supabase client with service role for bypassing RLS
    const supabaseAdmin = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? ""
    );

    // Get product info - use order + limit instead of single to avoid errors
    const { data: products, error: productError } = await supabaseAdmin
      .from("products")
      .select("*")
      .eq("name", "سيفن جرين")
      .eq("is_active", true)
      .order("updated_at", { ascending: false })
      .limit(1);

    console.log("Product query result:", { products, productError });

    if (productError) {
      console.error("Product query error:", productError);
      throw new Error(`Database error: ${productError.message}`);
    }

    if (!products || products.length === 0) {
      console.error("No active Seven Green product found");
      throw new Error("المنتج غير متوفر حالياً");
    }

    const product = products[0];
    console.log("Using product:", product);

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
      throw new Error(`فشل في إنشاء الطلب: ${orderError.message}`);
    }

    console.log("Created order:", order);

    // Create order item
    const { error: orderItemError } = await supabaseAdmin
      .from("order_items")
      .insert({
        order_id: order.id,
        product_id: product.id,
        quantity: orderData.quantity,
        unit_price: product.price,
        total_price: orderData.totalAmount
      });

    if (orderItemError) {
      console.error("Order item creation error:", orderItemError);
      // Don't fail the whole process for this, but log it
    }

    // Determine app origin for redirect URLs
    const originHeader = req.headers.get("origin") || undefined;
    const refererHeader = req.headers.get("referer") || undefined;
    const appOrigin = originHeader || (refererHeader ? new URL(refererHeader).origin : undefined);
    const finalOrigin = appOrigin || new URL(req.url).origin;

    // Create Ziina payment request
    const ziinaPayload = {
      amount: Math.round(orderData.totalAmount * 100), // Convert AED to halalas (100 halalas = 1 AED)
      currency_code: "AED",
      message: `طلب Seven Green - ${orderData.quantity} قطعة من ${orderData.customerName}`,
      success_url: `${finalOrigin}/payment-success?order_id=${order.id}`,
      cancel_url: `${finalOrigin}/order`,
      failure_url: `${finalOrigin}/order`,
      allow_tips: false
    };

    console.log("Creating Ziina payment with payload:", ziinaPayload);

    // Prepare Ziina API call for production
    const ziinaApiKey = Deno.env.get("ZIINA_API_KEY");
    if (!ziinaApiKey) {
      console.error("Missing Ziina API key");
      throw new Error("إعدادات الدفع غير مكتملة");
    }
    
    const ziinaBase = Deno.env.get("ZIINA_API_BASE") || "https://api.ziina.com";
    console.log("Using Ziina Production API:", ziinaBase);

    // Call Ziina Production API
    const ziinaResponse = await fetch(`${ziinaBase}/api/payment_intent`, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${ziinaApiKey}`,
        "Content-Type": "application/json",
        "Accept": "application/json",
      },
      body: JSON.stringify(ziinaPayload),
    });

    const ziinaData = await ziinaResponse.json();
    console.log("Ziina Production API response (status " + ziinaResponse.status + "):", ziinaData);

    if (!ziinaResponse.ok) {
      console.error("Ziina Production API error:", ziinaData);
      throw new Error(`خطأ في معالج الدفع: ${ziinaData.message || "خطأ غير معروف"}`);
    }

    // Production payment processing complete
    console.log("Payment creation successful, redirecting to:", ziinaData.redirect_url);

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
        error: error instanceof Error ? error.message : "حدث خطأ غير متوقع"
      }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 500,
      }
    );
  }
});
