-- Create page_updates table to track last modification dates
CREATE TABLE IF NOT EXISTS public.page_updates (
  page_slug TEXT PRIMARY KEY,
  last_modified TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  change_frequency TEXT NOT NULL DEFAULT 'weekly',
  priority NUMERIC(2,1) NOT NULL DEFAULT 0.8,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.page_updates ENABLE ROW LEVEL SECURITY;

-- Allow everyone to read page updates (needed for sitemap generation)
CREATE POLICY "Page updates are viewable by everyone"
  ON public.page_updates
  FOR SELECT
  USING (true);

-- Only admins can manage page updates
CREATE POLICY "Admins can manage page updates"
  ON public.page_updates
  FOR ALL
  USING (current_user_has_role('admin'::app_role))
  WITH CHECK (current_user_has_role('admin'::app_role));

-- Create trigger to update updated_at column
CREATE TRIGGER update_page_updates_updated_at
  BEFORE UPDATE ON public.page_updates
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Insert initial page data
INSERT INTO public.page_updates (page_slug, change_frequency, priority, last_modified) VALUES
  ('/', 'daily', 1.0, now()),
  ('/about', 'monthly', 0.8, now()),
  ('/order', 'daily', 0.9, now()),
  ('/benefits', 'weekly', 0.8, now()),
  ('/ingredients', 'monthly', 0.7, now()),
  ('/how-to-use', 'monthly', 0.7, now()),
  ('/reviews', 'weekly', 0.8, now()),
  ('/faq', 'weekly', 0.8, now()),
  ('/compare', 'monthly', 0.7, now())
ON CONFLICT (page_slug) DO NOTHING;

-- Create function to update page modification time
CREATE OR REPLACE FUNCTION public.update_page_modification(slug TEXT)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  UPDATE public.page_updates
  SET last_modified = now(),
      updated_at = now()
  WHERE page_slug = slug;
END;
$$;

-- Create trigger to auto-update homepage when site_content changes
CREATE OR REPLACE FUNCTION public.trigger_homepage_update()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- Update homepage modification time when hero or features content changes
  IF NEW.section IN ('hero', 'features') THEN
    PERFORM update_page_modification('/');
  END IF;
  RETURN NEW;
END;
$$;

CREATE TRIGGER update_homepage_on_content_change
  AFTER INSERT OR UPDATE ON public.site_content
  FOR EACH ROW
  EXECUTE FUNCTION public.trigger_homepage_update();

-- Create trigger to auto-update product pages when products change
CREATE OR REPLACE FUNCTION public.trigger_product_pages_update()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- Update order page when products change
  PERFORM update_page_modification('/order');
  RETURN NEW;
END;
$$;

CREATE TRIGGER update_product_pages_on_product_change
  AFTER INSERT OR UPDATE ON public.products
  FOR EACH ROW
  EXECUTE FUNCTION public.trigger_product_pages_update();