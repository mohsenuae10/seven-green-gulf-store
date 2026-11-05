// Abandoned-checkout capture for /order.
//
//   action "save": called (debounced) from the order page as soon as the
//                  customer has typed a valid phone number, and again on every
//                  later change. Creates the order once, then keeps updating
//                  the same row (no duplicates). No email is sent here.
//   action "load": resumes an unpaid order from the link in the payment
//                  reminder email (/order?id=<orderId>&t=<checkoutToken>).
// deno-lint-ignore-file no-explicit-any
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.57.2";
import {
  CheckoutError,
  corsHeaders,
  isUuid,
  jsonResponse,
  normalizePhone,
  phoneDigitCount,
  resolveCart,
  upsertCheckoutOrder,
} from "../_shared/checkout.ts";

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const body = await req.json();
    const supabase = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "",
    );

    if (body?.action === "load") {
      if (!isUuid(body.orderId) || !isUuid(body.checkoutToken)) {
        return jsonResponse({ success: false, error: "not_found" });
      }
      const { data: order } = await supabase
        .from("orders")
        .select("id, checkout_token, customer_name, customer_email, customer_phone, country, city, address, payment_status, order_items(product_id, quantity)")
        .eq("id", body.orderId)
        .eq("checkout_token", body.checkoutToken)
        .maybeSingle();

      if (!order) return jsonResponse({ success: false, error: "not_found" });
      if (order.payment_status === "paid") return jsonResponse({ success: true, paid: true });

      const lines: any[] = order.order_items ?? [];
      const ids = lines.map((l) => l.product_id);
      const { data: products } = ids.length
        ? await supabase.from("products").select("id, name, price, image_url").in("id", ids).eq("is_active", true)
        : { data: [] as any[] };

      const items = lines
        .map((l) => {
          const p = (products ?? []).find((row: any) => row.id === l.product_id);
          return p
            ? { productId: p.id, quantity: l.quantity, name: p.name, price: Number(p.price), image: p.image_url ?? null }
            : null;
        })
        .filter(Boolean);

      return jsonResponse({
        success: true,
        paid: false,
        orderId: order.id,
        checkoutToken: order.checkout_token,
        customer: {
          customerName: order.customer_name,
          customerEmail: order.customer_email,
          customerPhone: order.customer_phone,
          country: order.country,
          city: order.city,
          address: order.address,
        },
        items,
      });
    }

    // ── save ────────────────────────────────────────────────────────────────
    const phone = normalizePhone(body?.customerPhone);
    if (phoneDigitCount(phone) < 8) throw new CheckoutError("رقم الجوال غير صحيح", "invalid_phone");

    const items = await resolveCart(supabase, body?.cartItems);
    const order = await upsertCheckoutOrder(supabase, {
      orderId: body?.orderId,
      checkoutToken: body?.checkoutToken,
      customer: { ...body, customerPhone: phone },
      items,
      stage: "details",
    });

    return jsonResponse({
      success: true,
      orderId: order.id,
      checkoutToken: order.checkoutToken,
      total: order.total,
    });
  } catch (error) {
    if (error instanceof CheckoutError) {
      return jsonResponse({ success: false, error: error.message, code: error.code });
    }
    console.error("checkout-session error:", error);
    return jsonResponse({ success: false, error: "server_error" }, 500);
  }
});
