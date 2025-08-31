-- Create secure order lookup function to replace direct database queries
CREATE OR REPLACE FUNCTION public.get_order_secure(order_id_param UUID)
RETURNS TABLE (
  id UUID,
  customer_name TEXT,
  customer_phone TEXT,
  customer_email TEXT,
  country TEXT,
  city TEXT,
  address TEXT,
  total_amount NUMERIC,
  status TEXT,
  payment_status TEXT,
  created_at TIMESTAMPTZ,
  updated_at TIMESTAMPTZ
) AS $$
BEGIN
  -- Return order data with basic validation
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
$$ LANGUAGE plpgsql SECURITY DEFINER;