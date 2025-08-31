-- Add user_id column to orders table to link orders with authenticated users
ALTER TABLE public.orders 
ADD COLUMN user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL;

-- Create index for better performance on user_id queries
CREATE INDEX idx_orders_user_id ON public.orders(user_id);

-- Update RLS policies for orders table
-- Drop existing policy first
DROP POLICY IF EXISTS "Admins can manage all orders" ON public.orders;

-- Create new comprehensive policies
-- Policy 1: Admins can manage all orders
CREATE POLICY "Admins can manage all orders" 
ON public.orders 
FOR ALL 
USING (current_user_has_role('admin'::app_role))
WITH CHECK (current_user_has_role('admin'::app_role));

-- Policy 2: Authenticated users can view their own orders
CREATE POLICY "Users can view their own orders" 
ON public.orders 
FOR SELECT 
USING (auth.uid() = user_id);

-- Policy 3: Allow anonymous order creation (for checkout process)
-- This allows the edge function to create orders for anonymous users
CREATE POLICY "Allow order creation" 
ON public.orders 
FOR INSERT 
WITH CHECK (true);

-- Update the get_order_secure function to add proper security
CREATE OR REPLACE FUNCTION public.get_order_secure(order_id_param uuid)
RETURNS TABLE(id uuid, customer_name text, customer_phone text, customer_email text, country text, city text, address text, total_amount numeric, status text, payment_status text, created_at timestamp with time zone, updated_at timestamp with time zone)
LANGUAGE plpgsql
SECURITY DEFINER
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