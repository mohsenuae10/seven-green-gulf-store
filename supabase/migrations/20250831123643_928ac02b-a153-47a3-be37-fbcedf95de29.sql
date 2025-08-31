
-- 1) حذف أي تكرارات في جدول المنتجات والإبقاء على أحدث سجل لكل اسم
WITH ranked AS (
  SELECT
    id,
    name,
    ROW_NUMBER() OVER (PARTITION BY name ORDER BY updated_at DESC, created_at DESC, id DESC) AS rn
  FROM public.products
)
DELETE FROM public.products p
USING ranked r
WHERE p.id = r.id
  AND r.rn > 1;

-- 2) ضمان وجود "سيفن جرين" بالسعر والحالة الصحيحة (إن لم يوجد يتم إدخاله)
INSERT INTO public.products (name, price, description, image_url, is_active)
SELECT 'سيفن جرين', 299, 'منتج العناية بالشعر من سيفن جرين', NULL, true
WHERE NOT EXISTS (SELECT 1 FROM public.products WHERE name = 'سيفن جرين');

-- 3) توحيد بيانات "سيفن جرين" الحالية
UPDATE public.products
SET price = 299, is_active = true, updated_at = now()
WHERE name = 'سيفن جرين';

-- 4) إضافة فهرس فريد لمنع تكرار الأسماء مستقبلاً
CREATE UNIQUE INDEX IF NOT EXISTS products_name_unique ON public.products (name);
