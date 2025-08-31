-- Fix search path security issue for get_order_secure function
CREATE OR REPLACE FUNCTION public.get_order_secure(order_id_param uuid)
RETURNS TABLE(id uuid, customer_name text, customer_phone text, customer_email text, country text, city text, address text, total_amount numeric, status text, payment_status text, created_at timestamp with time zone, updated_at timestamp with time zone)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $function$
DECLARE
  current_user_id UUID;
  order_user_id UUID;
  is_admin BOOLEAN;
BEGIN
  -- Get current user ID
  current_user_id := auth.uid();
  
  -- Check if user is admin
  is_admin := current_user_has_role('admin'::app_role);
  
  -- Get the order's user_id
  SELECT o.user_id INTO order_user_id 
  FROM orders o 
  WHERE o.id = order_id_param;
  
  -- Security check: Only allow access if:
  -- 1. User is admin, OR
  -- 2. Order belongs to the current user, OR  
  -- 3. Order has no user_id (anonymous order) - this allows payment confirmation
  IF NOT (is_admin OR order_user_id = current_user_id OR order_user_id IS NULL) THEN
    RAISE EXCEPTION 'Access denied: You can only view your own orders';
  END IF;
  
  -- Return order data
  RETURN QUERY
  SELECT 
    o.id,
    o.customer_name,
    o.customer_phone,
    o.customer_email,
    o.country,
    o.city,
    o.address,
    o.total_amount,
    o.status,
    o.payment_status,
    o.created_at,
    o.updated_at
  FROM orders o
  WHERE o.id = order_id_param;
END;
$function$;