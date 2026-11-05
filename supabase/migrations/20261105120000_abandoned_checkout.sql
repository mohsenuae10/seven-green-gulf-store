-- Abandoned-checkout tracking.
--
-- An order row is now created as soon as the customer types a valid phone
-- number on /order (before paying), and the SAME row is updated on every
-- later change instead of inserting a new one. These columns support that:
--
--   checkout_token      secret that lets the customer's browser (or the link
--                       in a reminder email) update / resume this order. Never
--                       exposed through get_order_secure.
--   checkout_stage      'details' = typed phone/details but never pressed Pay
--                       'payment' = pressed Pay (a PaymentIntent was created)
--   last_payment_error  Stripe decline/error code of the last failed attempt
--                       (e.g. do_not_honor, card_not_supported, insufficient_funds)
--   reminder_sent_at    when the payment-reminder email was sent (one per order)

ALTER TABLE public.orders
  ADD COLUMN IF NOT EXISTS checkout_token uuid NOT NULL DEFAULT gen_random_uuid(),
  ADD COLUMN IF NOT EXISTS checkout_stage text NOT NULL DEFAULT 'details',
  ADD COLUMN IF NOT EXISTS last_payment_error text,
  ADD COLUMN IF NOT EXISTS reminder_sent_at timestamptz;

-- Every order that existed before this change was created by pressing
-- "Continue to payment", i.e. it already reached the payment step.
UPDATE public.orders SET checkout_stage = 'payment';

CREATE INDEX IF NOT EXISTS idx_orders_abandoned_lookup
  ON public.orders (payment_status, created_at)
  WHERE payment_status <> 'paid';
