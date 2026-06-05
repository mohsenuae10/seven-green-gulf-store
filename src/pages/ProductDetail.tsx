import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import { Shield, Truck, Lock, RefreshCw, Package } from 'lucide-react';
import Header from '@/components/Header';
import MobileNav from '@/components/MobileNav';
import Footer from '@/components/Footer';
import {
  Breadcrumb, BreadcrumbItem, BreadcrumbLink,
  BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator,
} from '@/components/ui/breadcrumb';
import { Card } from '@/components/ui/card';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Skeleton } from '@/components/ui/skeleton';
import { ProductImageGallery } from '@/components/product/ProductImageGallery';
import { ProductInfo } from '@/components/product/ProductInfo';
import { ProductTabs, ProductIngredient, ProductSpec, ProductFaq } from '@/components/product/ProductTabs';
import { useLanguage } from '@/hooks/useLanguage';
import { supabase } from '@/integrations/supabase/client';

interface ProductData {
  id: string;
  name: string;
  price: number;
  description: string | null;
  stock_quantity: number | null;
  image_url: string | null;
}

interface ProductImage {
  id: string;
  image_url: string;
  alt_text: string | null;
  display_order: number;
  is_primary: boolean;
}

const ProductDetail = () => {
  const { id } = useParams<{ id: string }>();
  const { language } = useLanguage();

  const [product, setProduct] = useState<ProductData | null>(null);
  const [productImages, setProductImages] = useState<ProductImage[]>([]);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  // Per-product content from site_content table
  const [productContent, setProductContent] = useState<{
    features: string[];
    ingredients: ProductIngredient[];
    specs: ProductSpec[];
    howToUse: string[];
    faq: ProductFaq[];
  }>({ features: [], ingredients: [], specs: [], howToUse: [], faq: [] });

  useEffect(() => {
    if (!id) { setNotFound(true); return; }
    const load = async () => {
      setLoading(true);
      const { data: prod } = await supabase
        .from('products').select('*').eq('id', id).eq('is_active', true).maybeSingle();

      if (!prod) { setNotFound(true); setLoading(false); return; }
      setProduct(prod);

      const { data: imgs } = await supabase
        .from('product_images').select('*').eq('product_id', id).order('display_order');
      setProductImages(imgs || []);

      // Fetch per-product content
      const { data: contentRow } = await supabase
        .from('site_content')
        .select('content')
        .eq('section', `product_${id}`)
        .maybeSingle();

      if (contentRow?.content) {
        const c = contentRow.content as any;
        setProductContent({
          features:    Array.isArray(c.features)    ? c.features    : [],
          ingredients: Array.isArray(c.ingredients) ? c.ingredients : [],
          specs:       Array.isArray(c.specs)       ? c.specs       : [],
          howToUse:    Array.isArray(c.howToUse)    ? c.howToUse    : [],
          faq:         Array.isArray(c.faq)         ? c.faq         : [],
        });
      }

      setLoading(false);
    };
    load();
  }, [id]);

  if (notFound) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="flex flex-col items-center justify-center py-32 text-gray-400">
          <Package className="w-16 h-16 mb-4 opacity-30" />
          <p className="text-lg">{language === 'ar' ? 'المنتج غير موجود' : 'Product not found'}</p>
          <Link to="/products" className="mt-4 text-primary hover:underline text-sm">
            {language === 'ar' ? '← العودة للمنتجات' : '← Back to products'}
          </Link>
        </div>
        <Footer />
      </div>
    );
  }

  const productName = product?.name || (language === 'ar' ? 'جاري التحميل...' : 'Loading...');
  const primaryImage = productImages.find(i => i.is_primary)?.image_url
    || productImages[0]?.image_url
    || product?.image_url
    || '/images/sevengreen-logo.webp';


  return (
    <>
      <Helmet>
        <title>
          {product
            ? `${productName} | سفن جرين Seven Green`
            : 'سفن جرين | Seven Green'
          }
        </title>
        <meta
          name="description"
          content={product?.description || (language === 'ar'
            ? 'منتج طبيعي 100% لعناية الشعر من سفن جرين'
            : '100% natural hair care product from Seven Green'
          )}
        />
        {product && (
          <>
            <link rel="canonical" href={`https://sevensgreen.com/product/${product.id}`} />
            <meta property="og:type" content="product" />
            <meta property="og:title" content={productName} />
            <meta property="og:image" content={primaryImage} />
            <meta property="product:price:amount" content={product.price.toString()} />
            <meta property="product:price:currency" content="SAR" />
            <script type="application/ld+json">{JSON.stringify({
              "@context": "https://schema.org/",
              "@type": "Product",
              "name": productName,
              "description": product.description,
              "image": productImages.map(i => i.image_url),
              "offers": {
                "@type": "Offer",
                "priceCurrency": "SAR",
                "price": product.price.toString(),
                "availability": "https://schema.org/InStock",
              },
              "aggregateRating": {
                "@type": "AggregateRating",
                "ratingValue": "4.8",
                "reviewCount": "2847",
              },
            })}</script>
          </>
        )}
      </Helmet>

      <div className="min-h-screen flex flex-col" dir={language === 'ar' ? 'rtl' : 'ltr'}>
        <Header />
        <MobileNav />

        <main className="flex-grow">
          {/* Breadcrumb */}
          <div className="container mx-auto px-4 py-4">
            <Breadcrumb>
              <BreadcrumbList>
                <BreadcrumbItem>
                  <BreadcrumbLink asChild>
                    <Link to="/">{language === 'ar' ? 'الرئيسية' : 'Home'}</Link>
                  </BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator />
                <BreadcrumbItem>
                  <BreadcrumbLink asChild>
                    <Link to="/products">{language === 'ar' ? 'المنتجات' : 'Products'}</Link>
                  </BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator />
                <BreadcrumbItem>
                  <BreadcrumbPage className="max-w-[200px] truncate">{productName}</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </div>

          {/* Product Hero */}
          <section className="container mx-auto px-4 py-8">
            <div className="grid lg:grid-cols-2 gap-8 lg:gap-12">
              {/* Image Gallery */}
              <div>
                {loading ? (
                  <Skeleton className="aspect-square rounded-xl" />
                ) : (
                  <ProductImageGallery
                    images={productImages}
                    productName={productName}
                  />
                )}
              </div>

              {/* Product Info */}
              <div>
                {loading ? (
                  <div className="space-y-4">
                    <Skeleton className="h-8 w-3/4" />
                    <Skeleton className="h-6 w-1/2" />
                    <Skeleton className="h-10 w-1/3" />
                    <Skeleton className="h-24 w-full" />
                    <Skeleton className="h-12 w-full" />
                    <Skeleton className="h-12 w-full" />
                  </div>
                ) : product && (
                  <ProductInfo
                    productId={product.id}
                    productName={productName}
                    priceOverride={product.price}
                    stockOverride={product.stock_quantity ?? 999}
                    descriptionOverride={product.description ?? undefined}
                    imageForCart={primaryImage}
                  />
                )}
              </div>
            </div>
          </section>

          {/* Trust Badges */}
          <section className="container mx-auto px-4 py-8 border-t">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[
                { icon: Shield, ar: 'منتج طبيعي 100%', en: '100% Natural Product' },
                { icon: Truck, ar: 'شحن مجاني', en: 'Free Shipping' },
                { icon: Lock, ar: 'دفع آمن ومشفر', en: 'Secure Payment' },
                { icon: RefreshCw, ar: 'ضمان 30 يوم', en: '30-Day Guarantee' },
              ].map((b, i) => (
                <Card key={i} className="p-4 text-center hover:shadow-md transition-shadow">
                  <b.icon className="w-8 h-8 mx-auto mb-2 text-primary" />
                  <h3 className="font-semibold text-sm">{language === 'ar' ? b.ar : b.en}</h3>
                </Card>
              ))}
            </div>
          </section>

          {/* Product Tabs */}
          <section className="container mx-auto px-4 py-8">
            <ProductTabs
              productDescription={product?.description ?? undefined}
              features={productContent.features}
              ingredients={productContent.ingredients}
              specs={productContent.specs}
              howToUse={productContent.howToUse}
              faq={productContent.faq}
            />
          </section>

          {/* FAQ Section (from product content) */}
          {productContent.faq.filter(f => f?.q?.trim()).length > 0 && (
            <section className="container mx-auto px-4 py-8 max-w-3xl" id="faq">
              <h2 className="text-2xl font-bold mb-6">
                {language === 'ar' ? 'الأسئلة الشائعة' : 'Frequently Asked Questions'}
              </h2>
              <Accordion type="single" collapsible className="w-full">
                {productContent.faq.filter(f => f?.q?.trim()).map((item, i) => (
                  <AccordionItem key={i} value={`item-${i}`}>
                    <AccordionTrigger className="text-right font-medium">{item.q}</AccordionTrigger>
                    <AccordionContent className="text-muted-foreground">{item.a}</AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </section>
          )}

          {/* SEO Rich Content */}
          <section className="container mx-auto px-4 py-12 max-w-4xl border-t">
            <article className="prose prose-lg dark:prose-invert mx-auto">
              <h2 className="text-2xl font-bold mb-4">
                {language === 'ar' ? `${productName} - علاج طبيعي لتساقط الشعر` : `${productName} - Natural Hair Loss Treatment`}
              </h2>
              {language === 'ar' ? (
                <p className="text-muted-foreground leading-relaxed">
                  {product?.description || 'منتج سفن جرين الطبيعي 100% لعناية الشعر. تركيبة فريدة من الأعشاب الطبيعية لعلاج تساقط الشعر وتكثيفه. نتائج مضمونة خلال 4 أسابيع من الاستخدام المنتظم.'}
                </p>
              ) : (
                <p className="text-muted-foreground leading-relaxed">
                  {product?.description || 'Seven Green 100% natural hair care product. Unique formula of natural herbs to treat hair loss and increase density. Guaranteed results within 4 weeks of regular use.'}
                </p>
              )}
            </article>
          </section>
        </main>

        <Footer />
      </div>
    </>
  );
};

export default ProductDetail;
