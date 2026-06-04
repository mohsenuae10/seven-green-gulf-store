import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import Stripe from "https://esm.sh/stripe@18.5.0";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.57.2";

// Stripe must reach this endpoint without a Supabase JWT, so verify_jwt = false
// is set in config.toml. Authenticity is enforced via the Stripe signature below.

serve(async (req) => {
  if (req.method !== "POST") {
    return new Response("Method not allowed", { status: 405 });
  }

  const stripe = new Stripe(Deno.env.get("STRIPE_SECRET_KEY") || "", {
    apiVersion: "2025-08-27.basil",
  });

  const webhookSecret = Deno.env.get("STRIPE_WEBHOOK_SECRET");
  if (!webhookSecret) {
    console.error("Missing STRIPE_WEBHOOK_SECRET");
    return new Response("Webhook not configured", { status: 500 });
  }

  const signature = req.headers.get("stripe-signature");
  if (!signature) {
    return new Response("Missing stripe-signature header", { status: 400 });
  }

  // The raw body is required for signature verification.
  const body = await req.text();

  let event: Stripe.Event;
  try {
    event = await stripe.webhooks.constructEventAsync(body, signature, webhookSecret);
  } catch (err) {
    console.error("Webhook signature verification failed:", err instanceof Error ? err.message : err);
    return new Response("Invalid signature", { status: 400 });
  }

  const supabase = createClient(
    Deno.env.get("SUPABASE_URL") ?? "",
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? ""
  );

  try {
    switch (event.type) {
      case "payment_intent.succeeded": {
        const pi = event.data.object as Stripe.PaymentIntent;
        console.log("PaymentIntent succeeded:", pi.id);

        const { error } = await supabase.rpc("mark_order_paid_by_intent", {
          payment_intent_id_param: pi.id,
        });
        if (error) {
          console.error("Failed to mark order paid:", error);
          return new Response("DB update failed", { status: 500 });
        }

        // Send the payment confirmation email from the trusted server side.
        const orderId = pi.metadata?.order_id;
        if (orderId) {
          try {
            const { data: orders } = await supabase
              .from("orders")
              .select("customer_name, customer_email, total_amount")
              .eq("id", orderId)
              .limit(1);
            const order = orders?.[0];
            if (order?.customer_email) {
              await supabase.functions.invoke("send-payment-confirmation", {
                body: {
                  customerName: order.customer_name,
                  customerEmail: order.customer_email,
                  orderId,
                  totalAmount: order.total_amount,
                  productName: "منتج Seven Green للعناية بالشعر",
                },
              });
            }
          } catch (emailError) {
            console.error("Confirmation email failed (non-fatal):", emailError);
          }
        }
        break;
      }

      case "payment_intent.payment_failed": {
        const pi = event.data.object as Stripe.PaymentIntent;
        console.log("PaymentIntent failed:", pi.id);
        const { error } = await supabase.rpc("mark_order_failed_by_intent", {
          payment_intent_id_param: pi.id,
        });
        if (error) console.error("Failed to mark order failed:", error);
        break;
      }

      default:
        console.log("Unhandled event type:", event.type);
    }

    return new Response(JSON.stringify({ received: true }), {
      headers: { "Content-Type": "application/json" },
      status: 200,
    });
  } catch (error) {
    console.error("Webhook handler error:", error);
    return new Response("Webhook handler error", { status: 500 });
  }
});
