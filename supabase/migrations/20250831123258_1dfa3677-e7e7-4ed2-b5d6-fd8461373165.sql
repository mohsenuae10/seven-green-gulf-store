-- Ensure Seven Green product exists for payments
-- Insert if missing
INSERT INTO public.products (name, price, description, image_url, is_active)
SELECT 'سيفن جرين', 299, 'منتج العناية بالشعر من سيفن جرين', NULL, true
WHERE NOT EXISTS (
  SELECT 1 FROM public.products WHERE name = 'سيفن جرين'
);

-- Make sure it has the correct price and is active
UPDATE public.products
SET price = 299, is_active = true, updated_at = now()
WHERE name = 'سيفن جرين';