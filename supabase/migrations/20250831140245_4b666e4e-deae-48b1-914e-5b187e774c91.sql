-- Create a secure function to update order payment status
CREATE OR REPLACE FUNCTION public.update_order_payment_status(order_id_param uuid)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $function$
BEGIN
  -- Update order payment status to paid and status to confirmed
  UPDATE orders 
  SET 
    payment_status = 'paid',
    status = 'confirmed',
    updated_at = now()
  WHERE id = order_id_param
    AND payment_status = 'pending';
END;
$function$;