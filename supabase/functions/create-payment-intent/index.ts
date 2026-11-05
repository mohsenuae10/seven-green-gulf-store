// Called when the customer presses "Pay" (card) or confirms Apple Pay /
// Google Pay on /order. Updates the customer's existing checkout order (the
// one created by checkout-session) — or creates it if the customer paid
// straight away with a wallet — then creates or reuses a Stripe
// PaymentIntent for the current cart total and returns its client secret.
// deno-lint-ignore-file no-explicit-any
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import Stripe from "https://esm.sh/stripe@18.5.0";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.57.2";
import {
  CheckoutError,
  corsHeaders,
  jsonResponse,
  normalizePhone,
  phoneDigitCount,
  resolveCart,
  upsertCheckoutOrder,
} from "../_shared/checkout.ts";

// A PaymentIntent in one of these states can still be paid with a new amount.
const REUSABLE = new Set(["requires_payment_method", "requires_confirmation"]);

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const body = await req.json();
    const customerName = String(body?.customerName ?? "").trim();
    const customerPhone = normalizePhone(body?.customerPhone);
    const country = String(body?.country ?? "").trim().toUpperCase();
    const city = String(body?.city ?? "").trim();
    const address = String(body?.address ?? "").trim();

    if (!customerName || !country || !city || !address) {
      throw new CheckoutError("بيانات الطلب غير مكتملة", "incomplete_details");
    }
    if (phoneDigitCount(customerPhone) < 8) throw new CheckoutError("رقم الجوال غير صحيح", "invalid_phone");

    const stripe = new Stripe(Deno.env.get("STRIPE_SECRET_KEY") || "", {
      apiVersion: "2025-08-27.basil",
    });
    const supabase = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "",
    );

    const items = await resolveCart(supabase, body?.cartItems);
    const order = await upsertCheckoutOrder(supabase, {
      orderId: body?.orderId,
      checkoutToken: body?.checkoutToken,
      customer: { ...body, customerName, customerPhone, country, city, address },
      items,
      stage: "payment",
    });

    const amount = Math.round(order.total * 100);
    if (!(amount > 0)) throw new CheckoutError("المبلغ الإجمالي غير صالح", "invalid_amount");

    const shipping = {
      name: customerName,
      phone: customerPhone,
      address: { line1: address, city, country },
    };
    const metadata = {
      order_id: order.id,
      customer_name: customerName,
      customer_phone: customerPhone,
      items_count: String(items.length),
      total_qty: String(items.reduce((s, i) => s + i.quantity, 0)),
    };

    // ── Reuse the order's PaymentIntent when possible ───────────────────────
    let paymentIntent: Stripe.PaymentIntent | null = null;
    if (order.paymentIntentId) {
      const existing = await stripe.paymentIntents.retrieve(order.paymentIntentId);
      if (existing.status === "succeeded" || existing.status === "processing") {
        throw new CheckoutError("تمت معالجة الدفع لهذا الطلب مسبقاً", "already_paid");
      }
      if (REUSABLE.has(existing.status)) {
        paymentIntent = await stripe.paymentIntents.update(existing.id, { amount, shipping, metadata });
      } else if (existing.status !== "canceled") {
        // e.g. requires_action: a 3-D Secure step the customer abandoned.
        // Cancel it so it can never complete later against a stale amount.
        try {
          await stripe.paymentIntents.cancel(existing.id);
        } catch (cancelError) {
          console.error("Could not cancel previous PaymentIntent:", cancelError);
          throw new CheckoutError("عملية دفع سابقة قيد المعالجة، انتظر قليلاً ثم حاول مرة أخرى", "previous_payment_in_progress");
        }
      }
    }

    if (!paymentIntent) {
      paymentIntent = await stripe.paymentIntents.create({
        amount,
        currency: "sar",
        automatic_payment_methods: { enabled: true },
        description: `Seven Green order #${order.id.slice(-8)}`,
        shipping,
        metadata,
      });
      await supabase.from("orders").update({ payment_intent_id: paymentIntent.id }).eq("id", order.id);
    }

    return jsonResponse({
      success: true,
      clientSecret: paymentIntent.client_secret,
      order_id: order.id,
      checkout_token: order.checkoutToken,
      amount: order.total,
      amountMinor: amount,
      currency: "sar",
      items: items.map((i) => ({ productId: i.productId, unitPrice: i.unitPrice })),
    });
  } catch (error) {
    if (error instanceof CheckoutError) {
      return jsonResponse({ success: false, error: error.message, code: error.code });
    }
    console.error("Error in create-payment-intent:", error);
    return jsonResponse({ success: false, error: "تعذّر تجهيز الدفع، حاول مرة أخرى", code: "server_error" }, 500);
  }
});
