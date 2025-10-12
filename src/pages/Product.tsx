import { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet';
import { Link } from 'react-router-dom';
import { Shield, Truck, Lock, RefreshCw } from 'lucide-react';
import Header from '@/components/Header';
import MobileNav from '@/components/MobileNav';
import Footer from '@/components/Footer';
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from '@/components/ui/breadcrumb';
import { Card } from '@/components/ui/card';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { ProductImageGallery } from '@/components/product/ProductImageGallery';
import { ProductInfo } from '@/components/product/ProductInfo';
import { ProductTabs } from '@/components/product/ProductTabs';
import { useLanguage } from '@/hooks/useLanguage';
import { useProductPrice } from '@/hooks/useProductPrice';
import { supabase } from '@/integrations/supabase/client';
import OptimizedImage from '@/components/OptimizedImage';

interface ProductImage {
  id: string;
  image_url: string;
  alt_text: string | null;
  display_order: number;
  is_primary: boolean;
}

const Product = () => {
  const { language } = useLanguage();
  const { price } = useProductPrice({ fallback: 71 });
  const [productImages, setProductImages] = useState<ProductImage[]>([]);
  const [loading, setLoading] = useState(true);

  const productName = language === 'ar' 
    ? 'صابونة سفن جرين المثلثة'
    : 'Seven Green Triangle Soap';

  useEffect(() => {
    const fetchProductImages = async () => {
      try {
        const { data: products } = await supabase
          .from('products')
          .select('id')
          .eq('is_active', true)
          .order('updated_at', { ascending: false })
          .limit(1)
          .maybeSingle();

        if (products) {
          const { data: images } = await supabase
            .from('product_images')
            .select('*')
            .eq('product_id', products.id)
            .order('display_order', { ascending: true });

          if (images && images.length > 0) {
            setProductImages(images);
          }
        }
      } catch (error) {
        console.error('Error fetching product images:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProductImages();
  }, []);

  // SEO Schemas
  const productSchema = {
    "@context": "https://schema.org",
    "@type": "Product",
    "name": productName,
    "description": language === 'ar'
      ? "صابونة طبيعية 100% لعلاج تساقط الشعر وتكثيفه بمكونات عشبية فريدة"
      : "100% natural soap for hair loss treatment with unique herbal ingredients",
    "image": productImages.map(img => img.image_url),
    "sku": "SG-TRIANGLE-001",
    "brand": {
      "@type": "Brand",
      "name": "Seven Green"
    },
    "offers": {
      "@type": "Offer",
      "url": "https://sevensgreen.com/product",
      "priceCurrency": "SAR",
      "price": price.toString(),
      "availability": "https://schema.org/InStock",
      "itemCondition": "https://schema.org/NewCondition"
    },
    "aggregateRating": {
      "@type": "AggregateRating",
      "ratingValue": "4.8",
      "reviewCount": "2847"
    }
  };

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      {
        "@type": "ListItem",
        "position": 1,
        "name": language === 'ar' ? "الرئيسية" : "Home",
        "item": "https://sevensgreen.com/"
      },
      {
        "@type": "ListItem",
        "position": 2,
        "name": language === 'ar' ? "المنتج" : "Product",
        "item": "https://sevensgreen.com/product"
      }
    ]
  };

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": [
      {
        "@type": "Question",
        "name": language === 'ar' ? "كم مدة ظهور النتائج؟" : "How long until results appear?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": language === 'ar' 
            ? "النتائج تبدأ في الظهور خلال 2-4 أسابيع من الاستخدام المنتظم"
            : "Results begin to appear within 2-4 weeks of regular use"
        }
      },
      {
        "@type": "Question",
        "name": language === 'ar' ? "هل المنتج مناسب لجميع أنواع الشعر؟" : "Is the product suitable for all hair types?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": language === 'ar'
            ? "نعم، صابونة سفن جرين مناسبة لجميع أنواع الشعر"
            : "Yes, Seven Green Soap is suitable for all hair types"
        }
      }
    ]
  };

  return (
    <>
      <Helmet>
        {/* Basic Meta */}
        <title>
          {language === 'ar' 
            ? 'صابونة سفن جرين المثلثة - علاج تساقط الشعر الطبيعي | 71 ريال 🌿'
            : 'Seven Green Triangle Soap - Natural Hair Loss Treatment | 71 SAR 🌿'
          }
        </title>
        <meta name="description" content={
          language === 'ar'
            ? 'اشترِ صابونة سفن جرين الأصلية 🌿 علاج فعّال لتساقط الشعر بمكونات طبيعية 100% ⭐ تقييم 4.8 من 2847 عميلة | شحن مجاني للسعودية | ضمان 30 يوم'
            : 'Buy original Seven Green Soap 🌿 Effective hair loss treatment with 100% natural ingredients ⭐ Rating 4.8 from 2847 customers | Free shipping to Saudi Arabia | 30-day guarantee'
        } />
        <meta name="keywords" content="صابونة سفن جرين, شراء سفن جرين, سعر سفن جرين 71 ريال, سفن جرين الأصلي, علاج تساقط الشعر, شامبو طبيعي, Seven Green Soap" />
        
        {/* Canonical */}
        <link rel="canonical" href="https://sevensgreen.com/product" />
        
        {/* Open Graph */}
        <meta property="og:type" content="product" />
        <meta property="og:title" content={productName} />
        <meta property="og:description" content={language === 'ar' ? "علاج فعّال لتساقط الشعر بمكونات طبيعية 100%" : "Effective hair loss treatment with 100% natural ingredients"} />
        <meta property="og:url" content="https://sevensgreen.com/product" />
        <meta property="product:price:amount" content={price.toString()} />
        <meta property="product:price:currency" content="SAR" />
        
        {/* Schema.org JSON-LD */}
        <script type="application/ld+json">{JSON.stringify(productSchema)}</script>
        <script type="application/ld+json">{JSON.stringify(breadcrumbSchema)}</script>
        <script type="application/ld+json">{JSON.stringify(faqSchema)}</script>
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
                  <BreadcrumbPage>{language === 'ar' ? 'المنتج' : 'Product'}</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </div>

          {/* Product Hero Section */}
          <section className="container mx-auto px-4 py-8">
            <div className="grid lg:grid-cols-2 gap-8 lg:gap-12">
              {/* Image Gallery */}
              <div>
                {loading ? (
                  <div className="aspect-square bg-muted animate-pulse rounded-lg" />
                ) : (
                  <ProductImageGallery images={productImages} productName={productName} />
                )}
              </div>

              {/* Product Info */}
              <div>
                <ProductInfo productName={productName} />
              </div>
            </div>
          </section>

          {/* Product Tabs */}
          <section className="container mx-auto px-4 py-8">
            <ProductTabs />
          </section>

          {/* Trust & Guarantees Section */}
          <section className="bg-accent/30 py-12">
            <div className="container mx-auto px-4">
              <h2 className="text-3xl font-bold text-center mb-8">
                {language === 'ar' ? 'لماذا تثقين بنا؟' : 'Why Trust Us?'}
              </h2>
              
              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                {[
                  {
                    icon: Shield,
                    title: language === 'ar' ? 'منتج أصلي 100%' : '100% Original Product',
                    description: language === 'ar' ? 'منتج أصلي معتمد من الموزع الرسمي' : 'Certified original product from official distributor'
                  },
                  {
                    icon: Truck,
                    title: language === 'ar' ? 'شحن مجاني' : 'Free Shipping',
                    description: language === 'ar' ? 'شحن مجاني لجميع أنحاء السعودية' : 'Free shipping across Saudi Arabia'
                  },
                  {
                    icon: Lock,
                    title: language === 'ar' ? 'دفع آمن' : 'Secure Payment',
                    description: language === 'ar' ? 'بوابة دفع آمنة ومشفرة SSL' : 'Secure SSL encrypted payment gateway'
                  },
                  {
                    icon: RefreshCw,
                    title: language === 'ar' ? 'ضمان استرجاع' : 'Money-Back Guarantee',
                    description: language === 'ar' ? 'ضمان استرجاع المال خلال 30 يوم' : '30-day money-back guarantee'
                  }
                ].map((item, index) => (
                  <Card key={index} className="p-6 text-center">
                    <item.icon className="w-12 h-12 mx-auto mb-4 text-primary" />
                    <h3 className="font-bold mb-2">{item.title}</h3>
                    <p className="text-sm text-muted-foreground">{item.description}</p>
                  </Card>
                ))}
              </div>
            </div>
          </section>

          {/* FAQ Section */}
          <section className="container mx-auto px-4 py-12">
            <h2 className="text-3xl font-bold text-center mb-8">
              {language === 'ar' ? 'أسئلة شائعة عن المنتج' : 'Frequently Asked Questions'}
            </h2>
            
            <div className="max-w-3xl mx-auto">
              <Accordion type="single" collapsible>
                {[
                  {
                    question: language === 'ar' ? 'كم مدة ظهور النتائج؟' : 'How long until results appear?',
                    answer: language === 'ar' 
                      ? 'النتائج تبدأ في الظهور خلال 2-4 أسابيع من الاستخدام المنتظم. للحصول على أفضل النتائج، يُنصح باستخدام الصابونة 2-3 مرات أسبوعياً.'
                      : 'Results begin to appear within 2-4 weeks of regular use. For best results, it is recommended to use the soap 2-3 times per week.'
                  },
                  {
                    question: language === 'ar' ? 'هل المنتج مناسب لجميع أنواع الشعر؟' : 'Is the product suitable for all hair types?',
                    answer: language === 'ar'
                      ? 'نعم، صابونة سفن جرين مناسبة لجميع أنواع الشعر بفضل تركيبتها الطبيعية 100%.'
                      : 'Yes, Seven Green Soap is suitable for all hair types thanks to its 100% natural formula.'
                  },
                  {
                    question: language === 'ar' ? 'كم مرة يجب استخدام المنتج أسبوعياً؟' : 'How often should I use the product per week?',
                    answer: language === 'ar'
                      ? 'يُنصح باستخدام الصابونة 2-3 مرات أسبوعياً للحصول على أفضل النتائج.'
                      : 'It is recommended to use the soap 2-3 times per week for best results.'
                  },
                  {
                    question: language === 'ar' ? 'هل المنتج آمن للحوامل والمرضعات؟' : 'Is the product safe for pregnant and breastfeeding women?',
                    answer: language === 'ar'
                      ? 'نعم، المنتج طبيعي 100% وآمن للاستخدام. ومع ذلك، يُفضل استشارة الطبيب قبل الاستخدام.'
                      : 'Yes, the product is 100% natural and safe to use. However, it is preferable to consult a doctor before use.'
                  },
                  {
                    question: language === 'ar' ? 'ما هي مدة صلاحية المنتج؟' : 'What is the shelf life of the product?',
                    answer: language === 'ar'
                      ? 'مدة صلاحية المنتج 3 سنوات من تاريخ الإنتاج عند حفظه في مكان جاف وبارد.'
                      : 'The product shelf life is 3 years from the production date when stored in a cool, dry place.'
                  },
                  {
                    question: language === 'ar' ? 'هل يمكن استخدامه مع منتجات أخرى؟' : 'Can it be used with other products?',
                    answer: language === 'ar'
                      ? 'نعم، يمكن استخدامه مع أي بلسم أو زيت طبيعي للحصول على نتائج أفضل.'
                      : 'Yes, it can be used with any natural conditioner or oil for better results.'
                  }
                ].map((item, index) => (
                  <AccordionItem key={index} value={`item-${index}`}>
                    <AccordionTrigger className="text-left">{item.question}</AccordionTrigger>
                    <AccordionContent>{item.answer}</AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </div>

            <div className="text-center mt-8">
              <Link to="/faq" className="text-primary hover:underline">
                {language === 'ar' ? 'المزيد من الأسئلة الشائعة ←' : 'More FAQs →'}
              </Link>
            </div>
          </section>
        </main>

        <Footer />

        {/* Sticky Mobile CTA */}
        <div className="lg:hidden fixed bottom-0 left-0 right-0 p-4 bg-background border-t shadow-lg z-50">
          <Link to="/order" className="block">
            <button className="w-full bg-primary text-primary-foreground py-3 rounded-lg font-bold text-lg hover:opacity-90 transition-opacity">
              {language === 'ar' ? '🛒 اشترِ الآن' : '🛒 Buy Now'}
            </button>
          </Link>
        </div>
      </div>
    </>
  );
};

export default Product;
