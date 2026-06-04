-- Link orders to their Stripe PaymentIntent so the webhook can confirm payment securely.
ALTER TABLE public.orders
  ADD COLUMN IF NOT EXISTS payment_intent_id TEXT;

CREATE INDEX IF NOT EXISTS idx_orders_payment_intent_id
  ON public.orders (payment_intent_id);

-- Mark an order as paid ONLY from a verified Stripe webhook event.
-- SECURITY DEFINER so the service role inside the Edge Function can update
-- regardless of RLS, while no client can call it without the service key.
CREATE OR REPLACE FUNCTION public.mark_order_paid_by_intent(
  payment_intent_id_param TEXT
)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $function$
BEGIN
  UPDATE public.orders
  SET
    payment_status = 'paid',
    status = 'confirmed',
    updated_at = now()
  WHERE payment_intent_id = payment_intent_id_param
    AND payment_status = 'pending';
END;
$function$;

-- Mark an order as failed from a verified Stripe webhook event.
CREATE OR REPLACE FUNCTION public.mark_order_failed_by_intent(
  payment_intent_id_param TEXT
)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $function$
BEGIN
  UPDATE public.orders
  SET
    payment_status = 'failed',
    updated_at = now()
  WHERE payment_intent_id = payment_intent_id_param
    AND payment_status = 'pending';
END;
$function$;
