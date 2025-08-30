-- Insert the Seven Green product into products table
INSERT INTO public.products (name, description, price, stock_quantity, is_active, image_url)
VALUES (
  'سيفن جرين',
  'للعناية المتقدمة بالشعر',
  299.00,
  1000,
  true,
  null
)
ON CONFLICT (name) DO UPDATE SET
  price = EXCLUDED.price,
  description = EXCLUDED.description,
  stock_quantity = EXCLUDED.stock_quantity,
  is_active = EXCLUDED.is_active;