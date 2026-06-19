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
import { useCart } from '@/contexts/CartContext';
import { useCurrency } from '@/hooks/useCurrency';
import { PriceDisplay } from '@/components/PriceDisplay';
import { Button } from '@/components/ui/button';
import { ShoppingCart, Zap, Plus, Minus } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { trackViewContent } from '@/lib/metaPixel';

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
  const { addItem, items, updateQty } = useCart();
  const { getPriceData } = useCurrency();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [qty, setQty] = useState(1);

  const [product, setProduct] = useState<ProductData | null>(null);
  const [productImages, setProductImages] = useState<ProductImage[]>([]);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  // Per-product content from site_content table
  const [productContent, setProductContent] = useState<{
    nameEn: string;
    descriptionEn: string;
    contentImages: string[];
    features: string[];
    ingredients: ProductIngredient[];
    specs: ProductSpec[];
    howToUse: string[];
    faq: ProductFaq[];
  }>({ nameEn: '', descriptionEn: '', contentImages: [], features: [], ingredients: [], specs: [], howToUse: [], faq: [] });

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
          nameEn:        c.nameEn        || '',
          descriptionEn: c.descriptionEn || '',
          contentImages: Array.isArray(c.contentImages) ? c.contentImages : [],
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

  useEffect(() => {
    if (!product) return;
    trackViewContent({
      contentId: product.id,
      contentName: product.name,
      value: product.price,
    });
  }, [product]);

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

  // Show English name/description if available and language is English
  const productName = language === 'en' && productContent.nameEn
    ? productContent.nameEn
    : product?.name || (language === 'ar' ? 'جاري التحميل...' : 'Loading...');

  const productDescription = language === 'en' && productContent.descriptionEn
    ? productContent.descriptionEn
    : product?.description ?? undefined;

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
                    descriptionOverride={productDescription}
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
              productDescription={productDescription}
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

          {/* ── Content Images (full-width, below description) ── */}
          {productContent.contentImages.length > 0 && (
            <section className="container mx-auto px-4 py-8 max-w-3xl">
              <div className="space-y-4">
                {productContent.contentImages.map((url, i) => (
                  <img
                    key={i}
                    src={url}
                    alt={`${productName} - ${i + 1}`}
                    className="w-full h-auto rounded-2xl shadow-sm object-cover"
                    loading="lazy"
                    onError={e => { e.currentTarget.style.display = 'none'; }}
                  />
                ))}
              </div>
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

        {/* Spacer so footer isn't hidden behind sticky bar */}
        <div className="h-20" />

        <Footer />
      </div>

      {/* ── Sticky Bottom CTA Bar ── */}
      {product && (
        <div className="fixed bottom-0 left-0 right-0 z-50 bg-white/97 backdrop-blur-md border-t border-gray-100 shadow-2xl">
          <div className="container mx-auto px-3 py-2.5 max-w-2xl">
            <div className={`flex items-center gap-2 ${language === 'ar' ? 'flex-row-reverse' : ''}`}>

              {/* Qty control */}
              <div className="flex items-center border border-gray-200 rounded-full overflow-hidden bg-gray-50 shrink-0">
                <button
                  type="button"
                  onClick={() => setQty(q => Math.max(1, q - 1))}
                  className="w-9 h-9 flex items-center justify-center hover:bg-gray-100 transition-colors text-gray-600"
                >
                  <Minus className="w-3.5 h-3.5" />
                </button>
                <span className="w-8 text-center text-sm font-bold text-gray-900">{qty}</span>
                <button
                  type="button"
                  onClick={() => setQty(q => q + 1)}
                  className="w-9 h-9 flex items-center justify-center hover:bg-gray-100 transition-colors text-gray-600"
                >
                  <Plus className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* Add to Cart */}
              <Button
                variant="outline"
                className="flex-1 h-10 gap-1.5 rounded-full border-primary text-primary hover:bg-primary hover:text-white transition-all text-sm font-semibold"
                onClick={() => {
                  const cartItem = items.find(i => i.productId === product.id);
                  if (cartItem) {
                    updateQty(product.id, cartItem.quantity + qty);
                  } else {
                    addItem({
                      productId: product.id,
                      name: productName,
                      nameEn: productContent.nameEn || productName,
                      price: product.price,
                      image: primaryImage,
                    }, qty);
                  }
                  toast({
                    title: language === 'ar' ? `تمت الإضافة ✓ (${qty})` : `Added to cart ✓ (${qty})`,
                    description: productName,
                  });
                }}
                disabled={!!(product.stock_quantity !== null && product.stock_quantity <= 0)}
              >
                <ShoppingCart className="w-4 h-4" />
                {language === 'ar' ? 'السلة' : 'Cart'}
              </Button>

              {/* Buy Now */}
              <Button
                className="flex-1 h-10 gap-1.5 rounded-full bg-primary hover:bg-primary/90 text-white font-bold shadow-sm text-sm"
                onClick={() => {
                  const cartItem = items.find(i => i.productId === product.id);
                  if (cartItem) {
                    updateQty(product.id, cartItem.quantity + qty);
                  } else {
                    addItem({
                      productId: product.id,
                      name: productName,
                      nameEn: productContent.nameEn || productName,
                      price: product.price,
                      image: primaryImage,
                    }, qty);
                  }
                  navigate(language === 'ar' ? '/ar/order' : '/order');
                }}
                disabled={!!(product.stock_quantity !== null && product.stock_quantity <= 0)}
              >
                <Zap className="w-4 h-4" />
                {language === 'ar' ? 'اشترِ الآن' : 'Buy Now'}
              </Button>

              {/* Price pill */}
              <div className="shrink-0 bg-primary/8 rounded-full px-3 py-1.5 text-center">
                <p className="text-xs font-black text-primary leading-none">
                  <PriceDisplay {...getPriceData(product.price * qty)} />
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default ProductDetail;
