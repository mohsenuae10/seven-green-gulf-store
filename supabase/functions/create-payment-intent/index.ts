import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import Stripe from "https://esm.sh/stripe@18.5.0";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.57.2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface CartItem {
  productId: string;
  quantity: number;
}

interface PaymentRequest {
  customerName: string;
  customerEmail?: string;
  customerPhone: string;
  country: string;
  city: string;
  address: string;
  // Multi-product cart (new)
  cartItems?: CartItem[];
  // Legacy single-product fallback
  quantity?: number;
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const body: PaymentRequest = await req.json();
    const {
      customerName,
      customerEmail,
      customerPhone,
      country,
      city,
      address,
      cartItems,
      quantity,
    } = body;

    if (!customerName?.trim() || !customerPhone?.trim() || !country?.trim() || !city?.trim() || !address?.trim()) {
      throw new Error("بيانات الطلب غير مكتملة");
    }

    const stripe = new Stripe(Deno.env.get("STRIPE_SECRET_KEY") || "", {
      apiVersion: "2025-08-27.basil",
    });

    const supabase = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? ""
    );

    // ── Resolve cart items ──────────────────────────────────────────────────
    let resolvedItems: { productId: string; quantity: number; unitPrice: number; name: string }[] = [];

    if (cartItems && cartItems.length > 0) {
      // Multi-product path: fetch all products by ID from DB
      const productIds = cartItems.map(i => i.productId);
      const { data: products, error: productError } = await supabase
        .from("products")
        .select("id, name, price")
        .in("id", productIds)
        .eq("is_active", true);

      if (productError || !products || products.length === 0) {
        throw new Error("بعض المنتجات غير متوفرة");
      }

      for (const item of cartItems) {
        const qty = Number(item.quantity);
        if (!Number.isInteger(qty) || qty < 1 || qty > 100) {
          throw new Error("كمية غير صحيحة");
        }
        const prod = products.find(p => p.id === item.productId);
        if (!prod) throw new Error(`المنتج ${item.productId} غير موجود`);
        resolvedItems.push({
          productId: prod.id,
          quantity: qty,
          unitPrice: Number(prod.price),
          name: prod.name,
        });
      }
    } else {
      // Legacy single-product fallback
      const qty = Number(quantity ?? 1);
      if (!Number.isInteger(qty) || qty < 1 || qty > 100) {
        throw new Error("الكمية غير صحيحة");
      }
      const { data: products, error: productError } = await supabase
        .from("products")
        .select("id, name, price")
        .eq("is_active", true)
        .order("updated_at", { ascending: false })
        .limit(1);

      if (productError || !products || products.length === 0) {
        throw new Error("المنتج غير متوفر حالياً");
      }
      resolvedItems.push({
        productId: products[0].id,
        quantity: qty,
        unitPrice: Number(products[0].price),
        name: products[0].name,
      });
    }

    // ── Compute total ───────────────────────────────────────────────────────
    const totalAmount = Math.round(
      resolvedItems.reduce((s, i) => s + i.unitPrice * i.quantity, 0) * 100
    ) / 100;

    if (!(totalAmount > 0)) throw new Error("المبلغ الإجمالي غير صالح");

    const amountInMinorUnits = Math.round(totalAmount * 100);
    const currency = "sar";

    // ── Stripe customer ─────────────────────────────────────────────────────
    let customerId: string | undefined;
    if (customerEmail) {
      const customers = await stripe.customers.list({ email: customerEmail, limit: 1 });
      if (customers.data.length > 0) customerId = customers.data[0].id;
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

    // ── Create order ────────────────────────────────────────────────────────
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
      throw new Error("فشل في إنشاء الطلب");
    }

    // ── Create order_items (one row per product) ────────────────────────────
    const orderItemsPayload = resolvedItems.map(i => ({
      order_id: orderData.id,
      product_id: i.productId,
      quantity: i.quantity,
      unit_price: i.unitPrice,
      total_price: Math.round(i.unitPrice * i.quantity * 100) / 100,
    }));

    const { error: itemError } = await supabase.from("order_items").insert(orderItemsPayload);
    if (itemError) {
      console.error("Order items creation failed:", itemError);
    }

    // ── Stripe PaymentIntent ────────────────────────────────────────────────
    const paymentIntent = await stripe.paymentIntents.create({
      amount: amountInMinorUnits,
      currency,
      customer: customerId,
      automatic_payment_methods: { enabled: true },
      metadata: {
        order_id: orderData.id,
        customer_name: customerName,
        customer_phone: customerPhone,
        items_count: String(resolvedItems.length),
        total_qty: String(resolvedItems.reduce((s, i) => s + i.quantity, 0)),
      },
    });

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
