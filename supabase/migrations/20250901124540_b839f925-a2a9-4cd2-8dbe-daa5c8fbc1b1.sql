-- Create storage bucket for product images
INSERT INTO storage.buckets (id, name, public) VALUES ('product-images', 'product-images', true);

-- Create storage policies for product images
CREATE POLICY "Product images are publicly accessible" 
ON storage.objects 
FOR SELECT 
USING (bucket_id = 'product-images');

CREATE POLICY "Admins can upload product images" 
ON storage.objects 
FOR INSERT 
WITH CHECK (bucket_id = 'product-images' AND current_user_has_role('admin'::app_role));

CREATE POLICY "Admins can update product images" 
ON storage.objects 
FOR UPDATE 
USING (bucket_id = 'product-images' AND current_user_has_role('admin'::app_role));

CREATE POLICY "Admins can delete product images" 
ON storage.objects 
FOR DELETE 
USING (bucket_id = 'product-images' AND current_user_has_role('admin'::app_role));

-- Create site_content table for managing website content
CREATE TABLE public.site_content (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  section VARCHAR(100) NOT NULL UNIQUE,
  title TEXT,
  description TEXT,
  content JSONB,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on site_content
ALTER TABLE public.site_content ENABLE ROW LEVEL SECURITY;

-- Create policies for site_content
CREATE POLICY "Site content is viewable by everyone" 
ON public.site_content 
FOR SELECT 
USING (true);

CREATE POLICY "Admins can manage site content" 
ON public.site_content 
FOR ALL 
USING (current_user_has_role('admin'::app_role))
WITH CHECK (current_user_has_role('admin'::app_role));

-- Add trigger for updated_at
CREATE TRIGGER update_site_content_updated_at
BEFORE UPDATE ON public.site_content
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Add product_images table to store multiple images per product
CREATE TABLE public.product_images (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  product_id UUID NOT NULL,
  image_url TEXT NOT NULL,
  alt_text TEXT,
  display_order INTEGER DEFAULT 0,
  is_primary BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on product_images
ALTER TABLE public.product_images ENABLE ROW LEVEL SECURITY;

-- Create policies for product_images
CREATE POLICY "Product images are viewable by everyone" 
ON public.product_images 
FOR SELECT 
USING (true);

CREATE POLICY "Admins can manage product images" 
ON public.product_images 
FOR ALL 
USING (current_user_has_role('admin'::app_role))
WITH CHECK (current_user_has_role('admin'::app_role));

-- Add trigger for updated_at
CREATE TRIGGER update_product_images_updated_at
BEFORE UPDATE ON public.product_images
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Insert default site content
INSERT INTO public.site_content (section, title, description, content) VALUES 
('hero', 'سيفن جرين', 'صابون السرو والأوسمان الطبيعي', '{"subtitle": "SEVEN GREEN", "features": ["طبيعي 100%", "آمن ومُختبر", "فاخر"], "description": "تركيبة طبيعية متقدمة من أوراق السرو ونبات الأوسمان، مُصممة لمنع تساقط الشعر والتحكم في الزيوت"}'),
('features', 'مميزات المنتج', 'الفوائد الرئيسية لسيفن جرين', '{"benefits": ["97% تحسن في كثافة الشعر", "85% تقليل التساقط", "92% زيادة اللمعان", "4 أسابيع لظهور النتائج"]}'),
('about', 'عن المنتج', 'معلومات تفصيلية عن سيفن جرين', '{"ingredients": "12 عشب طبيعي مختار بعناية", "certification": "منتج آمن ومُعتمد رسمياً", "origin": "تقنية صينية متقدمة"}');