-- Track the actual settlement currency per order, so reporting (Meta Pixel
-- Purchase, etc.) reflects what was really charged instead of assuming SAR.
ALTER TABLE public.orders
  ADD COLUMN IF NOT EXISTS currency TEXT NOT NULL DEFAULT 'SAR';

-- Re-create get_order_secure to expose the new currency column.
-- The return row type is changing (new column), so the old signature must be
-- dropped first — CREATE OR REPLACE cannot alter OUT-parameter types.
DROP FUNCTION IF EXISTS public.get_order_secure(uuid);

CREATE FUNCTION public.get_order_secure(order_id_param uuid)
RETURNS TABLE(id uuid, customer_name text, customer_phone text, customer_email text, country text, city text, address text, total_amount numeric, currency text, status text, payment_status text, created_at timestamp with time zone, updated_at timestamp with time zone)
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
    o.currency,
    o.status,
    o.payment_status,
    o.created_at,
    o.updated_at
  FROM orders o
  WHERE o.id = order_id_param;
END;
$function$;

-- Preserve the grants the previous version had (PUBLIC already covers these
-- by default, but keep them explicit to match prior state exactly).
GRANT EXECUTE ON FUNCTION public.get_order_secure(uuid) TO anon, authenticated, service_role;
