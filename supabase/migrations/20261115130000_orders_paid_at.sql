-- When an order was paid.
--
-- created_at is when the checkout order was opened (the moment the customer
-- typed their phone number). A customer can come back and pay that same order
-- hours or days later, so created_at is not the purchase date. The admin panel
-- sorted and dated orders by created_at: on 2026-11-15 the owner paid an order
-- opened on 2026-11-14, and it showed under 14/11, below newer unpaid orders,
-- so the owner could not find it. (Another paid order was opened on 05/11.)
ALTER TABLE public.orders ADD COLUMN IF NOT EXISTS paid_at timestamptz;

-- Backfill. For a paid order that is still "confirmed" and was last touched
-- after the 2026-11-05 bulk update, updated_at is the moment it was marked
-- paid. Older paid orders keep paid_at NULL, because that bulk update
-- overwrote their updated_at; the panel falls back to created_at for them.
-- The updated_at trigger is disabled so this backfill does not change it.
ALTER TABLE public.orders DISABLE TRIGGER update_orders_updated_at;
UPDATE public.orders
SET paid_at = updated_at
WHERE payment_status = 'paid'
  AND status = 'confirmed'
  AND paid_at IS NULL
  AND updated_at > '2026-11-05 19:00:00+00';
ALTER TABLE public.orders ENABLE TRIGGER update_orders_updated_at;

-- Set paid_at on every path that marks an order paid: the Stripe webhook's
-- mark_order_paid_by_intent, and the admin panel's manual "paid" button.
-- Cleared again if the order stops being paid (e.g. the admin corrects it).
CREATE OR REPLACE FUNCTION public.set_order_paid_at()
RETURNS trigger
LANGUAGE plpgsql
SET search_path TO 'public'
AS $function$
BEGIN
  IF NEW.payment_status = 'paid' THEN
    IF TG_OP = 'INSERT' OR OLD.payment_status IS DISTINCT FROM 'paid' THEN
      NEW.paid_at := COALESCE(NEW.paid_at, now());
    END IF;
  ELSE
    NEW.paid_at := NULL;
  END IF;
  RETURN NEW;
END;
$function$;

DROP TRIGGER IF EXISTS set_order_paid_at ON public.orders;
CREATE TRIGGER set_order_paid_at
BEFORE INSERT OR UPDATE OF payment_status ON public.orders
FOR EACH ROW EXECUTE FUNCTION public.set_order_paid_at();
