-- Insert the Seven Green product into products table (without ON CONFLICT)
INSERT INTO public.products (name, description, price, stock_quantity, is_active, image_url)
VALUES (
  'سيفن جرين',
  'للعناية المتقدمة بالشعر',
  299.00,
  1000,
  true,
  null
);