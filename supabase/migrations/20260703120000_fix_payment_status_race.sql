-- Fix a race condition where a retried payment on the same PaymentIntent
-- (e.g. first card declined, second card succeeds) could get stuck showing
-- "failed" even though Stripe charged the card successfully.
--
-- Root cause: mark_order_paid_by_intent only updated rows WHERE
-- payment_status = 'pending'. If the "payment_intent.payment_failed"
-- webhook from the first (declined) attempt landed AFTER the
-- "payment_intent.succeeded" webhook's row was already marked pending->paid
-- it was harmless, but if it landed BEFORE the succeeded webhook (a very
-- common ordering, since Stripe does not guarantee webhook delivery order),
-- it flipped the order to 'failed' first. When the succeeded webhook then
-- ran, its WHERE payment_status = 'pending' clause no longer matched (status
-- was already 'failed'), so the UPDATE silently affected 0 rows and the
-- order stayed 'failed' forever — even though the confirmation email had
-- already been sent, because the edge function doesn't check affected row
-- count before emailing.
--
-- Fix: allow the paid transition from any non-paid state, so a late/early
-- failed-webhook can never block the true final "succeeded" state from
-- being recorded. 'paid' remains a terminal state (mark_order_failed_by_intent
-- still only fires from 'pending', so it can never downgrade a paid order).
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
    AND payment_status <> 'paid';
END;
$function$;
