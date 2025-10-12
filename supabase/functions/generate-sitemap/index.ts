import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.56.1';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface PageUpdate {
  page_slug: string;
  last_modified: string;
  change_frequency: string;
  priority: number;
}

interface Product {
  id: string;
  updated_at: string;
}

Deno.serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_ANON_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    console.log('Generating sitemap...');

    // Fetch page updates
    const { data: pages, error: pagesError } = await supabase
      .from('page_updates')
      .select('page_slug, last_modified, change_frequency, priority')
      .order('priority', { ascending: false });

    if (pagesError) {
      console.error('Error fetching pages:', pagesError);
      throw pagesError;
    }

    // Fetch active products
    const { data: products, error: productsError } = await supabase
      .from('products')
      .select('id, updated_at')
      .eq('is_active', true);

    if (productsError) {
      console.error('Error fetching products:', productsError);
      throw productsError;
    }

    // Fetch product images for image sitemap data
    const { data: productImages, error: imagesError } = await supabase
      .from('product_images')
      .select('product_id, image_url, alt_text')
      .eq('is_primary', true);

    if (imagesError) {
      console.error('Error fetching images:', imagesError);
    }

    // Create image map
    const imageMap = new Map();
    if (productImages) {
      productImages.forEach(img => {
        imageMap.set(img.product_id, {
          url: img.image_url,
          alt: img.alt_text || 'Seven Green Product'
        });
      });
    }

    // Generate sitemap XML
    const baseUrl = 'https://sevensgreen.com';
    const languageCodes = ['ar', 'en', ''];

    let xml = '<?xml version="1.0" encoding="UTF-8"?>\n';
    xml += '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"\n';
    xml += '        xmlns:xhtml="http://www.w3.org/1999/xhtml"\n';
    xml += '        xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">\n';

    // Add static pages
    if (pages) {
      pages.forEach((page: PageUpdate) => {
        const lastMod = new Date(page.last_modified).toISOString().split('T')[0];
        
        xml += '  <url>\n';
        xml += `    <loc>${baseUrl}${page.page_slug}</loc>\n`;
        xml += `    <lastmod>${lastMod}</lastmod>\n`;
        xml += `    <changefreq>${page.change_frequency}</changefreq>\n`;
        xml += `    <priority>${page.priority}</priority>\n`;

        // Add language alternates
        languageCodes.forEach(lang => {
          const hreflang = lang || 'x-default';
          const url = lang ? `${baseUrl}${page.page_slug}?lang=${lang}` : `${baseUrl}${page.page_slug}`;
          xml += `    <xhtml:link rel="alternate" hreflang="${hreflang}" href="${url}" />\n`;
        });

        // Add main product image for homepage
        if (page.page_slug === '/' && products && products.length > 0) {
          const mainProduct = products[0];
          const productImage = imageMap.get(mainProduct.id);
          if (productImage) {
            xml += '    <image:image>\n';
            xml += `      <image:loc>${productImage.url}</image:loc>\n`;
            xml += `      <image:title>${productImage.alt}</image:title>\n`;
            xml += '    </image:image>\n';
          }
        }

        xml += '  </url>\n';
      });
    }

    // Add product pages (if needed in the future)
    if (products && products.length > 0) {
      products.forEach((product: Product) => {
        const lastMod = new Date(product.updated_at).toISOString().split('T')[0];
        const productImage = imageMap.get(product.id);
        
        // You can uncomment this if you want individual product pages
        // xml += '  <url>\n';
        // xml += `    <loc>${baseUrl}/product/${product.id}</loc>\n`;
        // xml += `    <lastmod>${lastMod}</lastmod>\n`;
        // xml += '    <changefreq>weekly</changefreq>\n';
        // xml += '    <priority>0.7</priority>\n';
        // if (productImage) {
        //   xml += '    <image:image>\n';
        //   xml += `      <image:loc>${productImage.url}</image:loc>\n`;
        //   xml += `      <image:title>${productImage.alt}</image:title>\n`;
        //   xml += '    </image:image>\n';
        // }
        // xml += '  </url>\n';
      });
    }

    xml += '</urlset>';

    console.log('Sitemap generated successfully');

    return new Response(xml, {
      headers: {
        ...corsHeaders,
        'Content-Type': 'application/xml; charset=utf-8',
        'Cache-Control': 'public, max-age=3600, s-maxage=3600',
      },
    });

  } catch (error) {
    console.error('Error generating sitemap:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});