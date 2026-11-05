// Payment reminder for abandoned checkouts.
//
//   { mode: "batch" }  — called every 15 min by pg_cron. Emails ONE reminder
//                        per unpaid order that has been inactive for 1 hour
//                        (and is less than 48 hours old). Takes no input and
//                        only ever emails qualifying orders once, so it is
//                        safe to expose without a secret.
//   { orderId }        — manual "send reminder" button in the admin panel.
//                        Requires an admin session.
//
// The recipient and order details always come from the database, never from
// the request body. The link resumes the same order with its cart.
// deno-lint-ignore-file no-explicit-any
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.57.2";
import { Resend } from "npm:resend@2.0.0";
import { corsHeaders, isUuid, jsonResponse } from "../_shared/checkout.ts";

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));
const SITE = "https://sevensgreen.com";
const HOUR = 60 * 60 * 1000;

const ARABIC_COUNTRY_CODES = new Set([
  "DZ", "BH", "KM", "DJ", "EG", "IQ", "JO", "KW", "LB", "LY", "MR",
  "MA", "OM", "PS", "QA", "SA", "SO", "SD", "SY", "TN", "AE", "YE",
]);

const ORDER_FIELDS =
  "id, checkout_token, customer_name, customer_email, country, total_amount, created_at, payment_status, order_items(product_name, quantity)";

const escapeHtml = (s: string) =>
  s.replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]!));

async function sendReminderEmail(order: any) {
  const isArabic = ARABIC_COUNTRY_CODES.has(String(order.country ?? "").toUpperCase());
  const resumeUrl = `${SITE}${isArabic ? "/ar" : ""}/order?id=${order.id}&t=${order.checkout_token}`;
  const ref = order.id.slice(-8).toUpperCase();
  const name = escapeHtml(order.customer_name || (isArabic ? "عميلنا العزيز" : "there"));
  const items = (order.order_items ?? [])
    .map((i: any) => `<li>${escapeHtml(i.product_name || "Seven Green")} × ${i.quantity}</li>`)
    .join("");

  const t = isArabic
    ? {
        dir: "rtl", lang: "ar",
        subject: `طلبك #${ref} بانتظارك — أكمل الدفع بخطوة واحدة`,
        title: "🛒 طلبك ما زال محفوظاً",
        hello: `مرحباً ${name}،`,
        body: "لاحظنا أنك لم تكمل عملية الدفع. حفظنا لك طلبك ومنتجاتك، ويمكنك إكماله الآن بضغطة واحدة.",
        orderLabel: "رقم الطلب", totalLabel: "الإجمالي", currency: "ريال",
        button: "💳 أكمل الدفع الآن",
        help: "إذا واجهت مشكلة في الدفع (مثل رفض البطاقة) جرّب Apple Pay أو بطاقة أخرى، أو راسلنا على support@sevensgreen.com",
        footer: "شكراً لاختيارك Seven Green 🌿",
      }
    : {
        dir: "ltr", lang: "en",
        subject: `Your order #${ref} is waiting — complete your payment`,
        title: "🛒 Your order is saved",
        hello: `Hello ${name},`,
        body: "We noticed you didn't finish paying. We've saved your order and items — you can complete it now in one click.",
        orderLabel: "Order number", totalLabel: "Total", currency: "SAR",
        button: "💳 Complete payment",
        help: "Had trouble paying (e.g. card declined)? Try Apple Pay or another card, or email us at support@sevensgreen.com",
        footer: "Thank you for choosing Seven Green 🌿",
      };

  const html = `<!DOCTYPE html>
<html dir="${t.dir}" lang="${t.lang}">
<head><meta charset="UTF-8"></head>
<body style="font-family: Tahoma, Arial, sans-serif; background:#f4f4f4; padding:20px; margin:0;">
  <div style="max-width:600px; margin:0 auto; background:#fff; border-radius:10px; overflow:hidden;">
    <div style="background:linear-gradient(135deg,#10b981,#059669); padding:28px; text-align:center; color:#fff;">
      <h1 style="margin:0; font-size:22px;">${t.title}</h1>
    </div>
    <div style="padding:28px; color:#1f2937; line-height:1.7;">
      <p>${t.hello}</p>
      <p>${t.body}</p>
      <div style="background:#f9fafb; padding:16px 20px; border-radius:8px; margin:20px 0;">
        <p style="margin:0 0 6px;"><strong>${t.orderLabel}:</strong> #${ref}</p>
        <ul style="margin:6px 0; padding-inline-start:20px;">${items}</ul>
        <p style="margin:6px 0 0;"><strong>${t.totalLabel}:</strong>
          <span style="color:#10b981; font-size:20px; font-weight:bold;">${order.total_amount} ${t.currency}</span></p>
      </div>
      <div style="text-align:center; margin:28px 0;">
        <a href="${resumeUrl}" style="display:inline-block; background:#10b981; color:#fff; padding:14px 40px; text-decoration:none; border-radius:8px; font-size:18px; font-weight:bold;">${t.button}</a>
      </div>
      <p style="font-size:14px; color:#6b7280;">${t.help}</p>
    </div>
    <div style="background:#f9fafb; padding:16px; text-align:center; color:#6b7280; font-size:13px;">${t.footer}</div>
  </div>
</body>
</html>`;

  await resend.emails.send({
    from: "Seven Green <noreply@sevensgreen.com>",
    to: [order.customer_email],
    subject: t.subject,
    html,
  });
}

async function runBatch(supabase: any) {
  const now = Date.now();
  const { data: candidates, error } = await supabase
    .from("orders")
    .select(ORDER_FIELDS)
    .neq("payment_status", "paid")
    .or("status.is.null,status.neq.cancelled")
    .is("reminder_sent_at", null)
    .not("customer_email", "is", null)
    .neq("customer_email", "")
    .lt("updated_at", new Date(now - HOUR).toISOString())
    .gt("created_at", new Date(now - 48 * HOUR).toISOString())
    .order("created_at", { ascending: false })
    .limit(100);
  if (error) throw error;

  const list: any[] = candidates ?? [];
  const emails = [...new Set(list.map((o) => o.customer_email.toLowerCase()))];

  // Customers who bought anyway (with another order) must not get a reminder.
  const { data: paid } = emails.length
    ? await supabase
        .from("orders")
        .select("customer_email, created_at")
        .eq("payment_status", "paid")
        .in("customer_email", list.map((o) => o.customer_email))
        .gt("created_at", new Date(now - 72 * HOUR).toISOString())
    : { data: [] as any[] };

  const seen = new Set<string>();
  let sent = 0;
  for (const order of list) {
    const email = order.customer_email.toLowerCase();
    if (seen.has(email)) continue; // one reminder per customer (latest order)
    seen.add(email);

    const boughtLater = (paid ?? []).some(
      (p: any) => p.customer_email?.toLowerCase() === email && p.created_at >= order.created_at,
    );
    if (boughtLater) continue;

    // Claim the order first so concurrent runs can never double-send.
    const { data: claimed } = await supabase
      .from("orders")
      .update({ reminder_sent_at: new Date().toISOString() })
      .eq("id", order.id)
      .is("reminder_sent_at", null)
      .select("id");
    if (!claimed?.length) continue;

    try {
      await sendReminderEmail(order);
      sent++;
    } catch (e) {
      console.error("Reminder email failed for order", order.id, e);
      await supabase.from("orders").update({ reminder_sent_at: null }).eq("id", order.id);
    }
  }
  return { candidates: list.length, sent };
}

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const body = await req.json().catch(() => ({}));
    const supabase = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "",
    );

    if (body?.mode === "batch") {
      const result = await runBatch(supabase);
      console.log("Abandoned-cart reminder batch:", result);
      return jsonResponse({ success: true, ...result });
    }

    // ── Manual send from the admin panel ───────────────────────────────────
    const userClient = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_ANON_KEY") ?? "",
      { global: { headers: { Authorization: req.headers.get("Authorization") ?? "" } } },
    );
    const { data: isAdmin } = await userClient.rpc("current_user_has_role", { _role: "admin" });
    if (isAdmin !== true) return jsonResponse({ success: false, error: "forbidden" }, 403);

    if (!isUuid(body?.orderId)) return jsonResponse({ success: false, error: "invalid_order" }, 400);
    const { data: order } = await supabase.from("orders").select(ORDER_FIELDS).eq("id", body.orderId).maybeSingle();
    if (!order) return jsonResponse({ success: false, error: "not_found" }, 404);
    if (order.payment_status === "paid") return jsonResponse({ success: false, error: "already_paid" }, 400);
    if (!order.customer_email) return jsonResponse({ success: false, error: "no_email" }, 400);

    await sendReminderEmail(order);
    await supabase.from("orders").update({ reminder_sent_at: new Date().toISOString() }).eq("id", order.id);
    return jsonResponse({ success: true });
  } catch (error: any) {
    console.error("Error sending payment reminder:", error);
    return jsonResponse({ success: false, error: error?.message ?? "server_error" }, 500);
  }
});
