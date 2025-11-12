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

// TypeScript declaration for gtag
declare global {
  interface Window {
    dataLayer: any[];
    gtag: (...args: any[]) => void;
  }
}

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

  // Google Ads Conversion Tracking - Page View Event
  useEffect(() => {
    if (typeof window.gtag !== 'undefined') {
      window.gtag('event', 'conversion', {
        'send_to': 'AW-17646380077/v4KRCNSP6KsbEK3Iud5B'
      });
      console.log('Google Ads Product Page View tracked');
    }
  }, []);

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

  const title = language === 'ar' 
    ? 'صابونة سفن جرين المثلثة الأصلية - علاج تساقط الشعر الطبيعي | Seven Green'
    : 'Seven Green Original Triangular Soap - Natural Hair Loss Treatment | Premium Hair Care';
  
  const description = language === 'ar'
    ? 'صابونة سفن جرين المثلثة الأصلية 100% طبيعية من السرو والأوسمان. حل مثبت علمياً لعلاج تساقط الشعر، تكثيف الشعر، التحكم في الزيوت. نتائج خلال 4 أسابيع. مُختبرة طبياً. شحن مجاني للسعودية والخليج.'
    : 'Seven Green Original Triangular Soap - 100% natural from cypress and osman. Scientifically proven solution for hair loss treatment, hair growth, oil control. Results in 4 weeks. Clinically tested. Free shipping to Saudi Arabia and GCC.';

  // SEO Schemas
  const productSchema = {
    "@context": "https://schema.org/",
    "@type": "Product",
    "name": language === 'ar' ? "سفن جرين - صابونة طبيعية مثلثة" : "Seven Green - Natural Triangular Soap",
    "alternateName": [
      "سفن جرين",
      "Seven Green", 
      "صابونة سفن جرين",
      "شامبو سفن جرين",
      "الصابونة المثلثة",
      "سفن جرين الأصلي"
    ],
    "description": description,
    "image": productImages.map(img => img.image_url),
    "sku": "SG-TRIANGLE-001",
    "gtin13": "6970784792573",
    "mpn": "SG-001-2024",
    "brand": {
      "@type": "Brand",
      "name": "Seven Green",
      "logo": "https://sevensgreen.com/lovable-uploads/seven-green-icon.png"
    },
    "manufacturer": {
      "@type": "Organization",
      "name": "Seven Green Natural Products",
      "url": "https://sevensgreen.com"
    },
    "category": language === 'ar' ? "العناية بالشعر > شامبو طبيعي > صابون للشعر" : "Hair Care > Natural Shampoo > Hair Soap",
    "material": language === 'ar' ? "أوراق السرو الطبيعية، نبات الأوسمان، زيوت عضوية" : "Natural Cypress Leaves, Osman Plant, Organic Oils",
    "weight": {
      "@type": "QuantitativeValue",
      "value": "100",
      "unitCode": "GRM"
    },
    "offers": {
      "@type": "Offer",
      "url": "https://sevensgreen.com/product",
      "priceCurrency": "SAR",
      "price": price.toString(),
      "priceValidUntil": "2026-12-31",
      "availability": "https://schema.org/InStock",
      "itemCondition": "https://schema.org/NewCondition",
      "shippingDetails": {
        "@type": "OfferShippingDetails",
        "shippingRate": {
          "@type": "MonetaryAmount",
          "value": "0",
          "currency": "SAR"
        },
        "deliveryTime": {
          "@type": "ShippingDeliveryTime",
          "transitTime": {
            "@type": "QuantitativeValue",
            "minValue": 2,
            "maxValue": 5,
            "unitCode": "DAY"
          }
        }
      },
      "seller": {
        "@type": "Organization",
        "name": "Seven Green"
      }
    },
    "aggregateRating": {
      "@type": "AggregateRating",
      "ratingValue": "4.8",
      "reviewCount": "2847",
      "bestRating": "5",
      "worstRating": "1"
    },
    "review": [
      {
        "@type": "Review",
        "reviewRating": {
          "@type": "Rating",
          "ratingValue": "5",
          "bestRating": "5"
        },
        "author": {
          "@type": "Person",
          "name": language === 'ar' ? "فاطمة أحمد" : "Fatima Ahmed"
        },
        "datePublished": "2025-10-15",
        "reviewBody": language === 'ar' 
          ? "منتج رائع! لاحظت تحسن كبير في كثافة شعري خلال أسبوعين فقط. التساقط قل بشكل ملحوظ والشعر أصبح أقوى وأكثر لمعاناً."
          : "Amazing product! I noticed significant improvement in hair density within just two weeks. Hair fall reduced noticeably and hair became stronger and shinier."
      },
      {
        "@type": "Review",
        "reviewRating": {
          "@type": "Rating",
          "ratingValue": "5",
          "bestRating": "5"
        },
        "author": {
          "@type": "Person",
          "name": language === 'ar' ? "محمد الخالدي" : "Mohammed Al-Khalidi"
        },
        "datePublished": "2025-10-10",
        "reviewBody": language === 'ar'
          ? "صابون طبيعي ممتاز، قلل تساقط الشعر بشكل كبير. استخدمته لمدة شهر والنتائج واضحة جداً. أنصح به بشدة!"
          : "Excellent natural soap, significantly reduced hair loss. Used it for a month and results are very clear. Highly recommend!"
      },
      {
        "@type": "Review",
        "reviewRating": {
          "@type": "Rating",
          "ratingValue": "4",
          "bestRating": "5"
        },
        "author": {
          "@type": "Person",
          "name": language === 'ar' ? "نورة السعيد" : "Noura Al-Saeed"
        },
        "datePublished": "2025-10-05",
        "reviewBody": language === 'ar'
          ? "منتج جيد جداً، لكن يحتاج وقت للنتائج. بعد 3 أسابيع بدأت ألاحظ فرق واضح في صحة شعري."
          : "Very good product, but needs time for results. After 3 weeks I started noticing clear difference in my hair health."
      }
    ]
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
        <meta name="description" content={description} />
        <meta name="keywords" content={language === 'ar' 
          ? "سفن جرين, صابونة سفن جرين الأصلية, شامبو سفن جرين المثلث, الصابونة المثلثة سفن جرين, علاج تساقط الشعر الطبيعي, تكثيف الشعر, منع تساقط الشعر, صابون طبيعي للشعر, السرو والأوسمان, سفن جرين السعودية, سعر سفن جرين, تجربتي مع سفن جرين, فوائد سفن جرين, شامبو طبيعي عضوي, صابون عضوي للشعر الدهني, علاج قشرة الشعر, تطويل الشعر طبيعياً"
          : "Seven Green, Seven Green original soap, Seven Green triangular shampoo, triangular soap Seven Green, natural hair loss treatment, hair thickening, prevent hair fall, natural hair soap, cypress and osman, Seven Green Saudi Arabia, Seven Green price, Seven Green review, Seven Green benefits, natural organic shampoo, organic soap for oily hair, dandruff treatment, natural hair growth"
        } />
        
        {/* Canonical */}
        <link rel="canonical" href="https://sevensgreen.com/product" />
        
        {/* Open Graph */}
        <meta property="og:type" content="product" />
        <meta property="og:title" content={productName} />
        <meta property="og:description" content={language === 'ar' ? "علاج فعّال لتساقط الشعر بمكونات طبيعية 100%" : "Effective hair loss treatment with 100% natural ingredients"} />
        <meta property="og:url" content="https://sevensgreen.com/product" />
        <meta property="og:image" content="https://sevensgreen.com/lovable-uploads/seven-green-icon.png" />
        <meta property="og:image:alt" content={productName} />
        <meta property="product:price:amount" content={price.toString()} />
        <meta property="product:price:currency" content="SAR" />
        
        {/* Twitter Card */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={productName} />
        <meta name="twitter:description" content={language === 'ar' ? "علاج فعّال لتساقط الشعر بمكونات طبيعية 100%" : "Effective hair loss treatment with 100% natural ingredients"} />
        <meta name="twitter:image" content="https://sevensgreen.com/lovable-uploads/seven-green-icon.png" />
        
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

          {/* Rich SEO Content Section */}
          <section className="container mx-auto px-4 py-12">
            <article className="max-w-4xl mx-auto prose prose-lg dark:prose-invert">
              {language === 'ar' ? (
                <>
                  <h1 className="text-4xl font-bold mb-6">صابونة سفن جرين المثلثة الأصلية - دليلك الشامل لعلاج تساقط الشعر الطبيعي</h1>
                  
                  <h2 className="text-3xl font-bold mt-8 mb-4">ما هي صابونة سفن جرين؟</h2>
                  <p className="text-lg leading-relaxed mb-4">
                    صابونة سفن جرين المثلثة الأصلية هي منتج طبيعي 100% مصنوع من أوراق السرو ونبات الأوسمان، تم تطويرها خصيصاً لعلاج مشاكل تساقط الشعر وتعزيز نموه بشكل طبيعي وصحي. تتميز هذه الصابونة الفريدة بشكلها المثلث المميز والذي أصبح علامة تجارية مسجلة لمنتجات سفن جرين الأصلية.
                  </p>
                  
                  <h2 className="text-3xl font-bold mt-8 mb-4">لماذا تختارين صابونة سفن جرين؟</h2>
                  <p className="text-lg leading-relaxed mb-4">
                    بعد سنوات من البحث والتطوير، تم تصنيع صابونة سفن جرين لتكون الحل الأمثل للنساء والرجال الذين يعانون من تساقط الشعر، الشعر الضعيف، أو مشاكل فروة الرأس الدهنية. المنتج حاصل على شهادات جودة دولية ومُختبر طبياً لضمان الفعالية والأمان.
                  </p>
                  
                  <h3 className="text-2xl font-bold mt-6 mb-3">المكونات الطبيعية الفعّالة</h3>
                  <ul className="list-disc list-inside space-y-2 mb-6">
                    <li><strong>أوراق السرو الطبيعية:</strong> غنية بمضادات الأكسدة التي تحمي بصيلات الشعر وتقوي جذوره من العمق</li>
                    <li><strong>نبات الأوسمان:</strong> يحتوي على مركبات طبيعية تحفز نمو الشعر وتمنع التساقط بفعالية مثبتة علمياً</li>
                    <li><strong>زيوت عضوية مستخلصة:</strong> توفر التغذية العميقة لفروة الرأس وتعيد التوازن الطبيعي للزيوت</li>
                  </ul>

                  <h2 className="text-3xl font-bold mt-8 mb-4">فوائد صابونة سفن جرين المثبتة علمياً</h2>
                  <div className="grid md:grid-cols-2 gap-4 mb-6">
                    <div className="bg-accent/20 p-4 rounded-lg">
                      <h4 className="font-bold mb-2">✓ علاج تساقط الشعر</h4>
                      <p>تقلل تساقط الشعر بنسبة تصل إلى 80% خلال 4 أسابيع من الاستخدام المنتظم</p>
                    </div>
                    <div className="bg-accent/20 p-4 rounded-lg">
                      <h4 className="font-bold mb-2">✓ تكثيف الشعر</h4>
                      <p>تحفز نمو شعر جديد وتزيد كثافة الشعر بشكل ملحوظ وطبيعي</p>
                    </div>
                    <div className="bg-accent/20 p-4 rounded-lg">
                      <h4 className="font-bold mb-2">✓ التحكم في الزيوت</h4>
                      <p>تنظم إفراز الزيوت في فروة الرأس وتمنع الشعر الدهني</p>
                    </div>
                    <div className="bg-accent/20 p-4 rounded-lg">
                      <h4 className="font-bold mb-2">✓ تقوية الجذور</h4>
                      <p>تعمق التغذية حتى جذور الشعر لشعر أقوى وأكثر مرونة</p>
                    </div>
                  </div>

                  <h2 className="text-3xl font-bold mt-8 mb-4">طريقة الاستخدام الصحيحة للحصول على أفضل النتائج</h2>
                  <ol className="list-decimal list-inside space-y-3 mb-6">
                    <li className="text-lg">بللي شعرك جيداً بالماء الفاتر</li>
                    <li className="text-lg">افركي الصابونة بين يديك لإنتاج رغوة كريمية</li>
                    <li className="text-lg">دلكي فروة الرأس بلطف بحركات دائرية لمدة 3-5 دقائق</li>
                    <li className="text-lg">اتركي الرغوة على الشعر لمدة 2-3 دقائق لامتصاص أفضل</li>
                    <li className="text-lg">اشطفي الشعر جيداً بالماء الفاتر</li>
                    <li className="text-lg">كرري الاستخدام 2-3 مرات أسبوعياً للحصول على أفضل النتائج</li>
                  </ol>

                  <h2 className="text-3xl font-bold mt-8 mb-4">تجارب العملاء الحقيقية مع سفن جرين</h2>
                  <p className="text-lg leading-relaxed mb-4">
                    أكثر من 2,847 عميلة وعميل في السعودية ودول الخليج جربوا صابونة سفن جرين وحصلوا على نتائج مذهلة. بتقييم 4.8 من 5 نجوم، أصبحت صابونة سفن جرين المنتج الأول الموصى به من قبل المستخدمين لعلاج تساقط الشعر طبيعياً.
                  </p>

                  <h2 className="text-3xl font-bold mt-8 mb-4">لماذا الصابونة المثلثة؟</h2>
                  <p className="text-lg leading-relaxed mb-4">
                    الشكل المثلث المميز لصابونة سفن جرين ليس فقط علامة تجارية فريدة، بل هو تصميم هندسي مدروس يسهل الإمساك بالصابونة ويوفر توزيعاً متساوياً للرغوة على فروة الرأس. هذا التصميم الحاصل على براءة اختراع يضمن لك تجربة استخدام مريحة وفعّالة.
                  </p>

                  <h2 className="text-3xl font-bold mt-8 mb-4">الشحن والتوصيل</h2>
                  <p className="text-lg leading-relaxed mb-4">
                    نوفر شحن مجاني لجميع أنحاء المملكة العربية السعودية ودول الخليج العربي. التوصيل يتم خلال 2-5 أيام عمل من تاريخ الطلب. نحرص على تغليف المنتج بعناية فائقة لضمان وصوله إليك بحالة ممتازة.
                  </p>

                  <h2 className="text-3xl font-bold mt-8 mb-4">ضمان الجودة واسترجاع الأموال</h2>
                  <p className="text-lg leading-relaxed mb-4">
                    نحن واثقون من جودة منتجنا لدرجة أننا نقدم ضمان استرجاع الأموال خلال 30 يوماً إذا لم تكوني راضية عن النتائج. ثقتك وراحتك هي أولويتنا القصوى.
                  </p>

                  <h2 className="text-3xl font-bold mt-8 mb-4">كيف تتأكدين من شراء المنتج الأصلي؟</h2>
                  <p className="text-lg leading-relaxed mb-4">
                    مع انتشار المنتجات المقلدة، من المهم التأكد من شراء صابونة سفن جرين الأصلية. المنتج الأصلي يأتي بختم الجودة، رقم تسلسلي فريد، والشكل المثلث المميز مع شعار سفن جرين الواضح. اطلبي فقط من الموزع الرسمي لضمان الحصول على المنتج الأصلي.
                  </p>

                  <h2 className="text-3xl font-bold mt-8 mb-4">الأسئلة الشائعة</h2>
                  <div className="space-y-4 mb-6">
                    <div>
                      <h4 className="font-bold text-xl mb-2">هل صابونة سفن جرين آمنة للاستخدام اليومي؟</h4>
                      <p>نعم، الصابونة طبيعية 100% وآمنة للاستخدام اليومي، لكن للحصول على أفضل النتائج ننصح باستخدامها 2-3 مرات أسبوعياً.</p>
                    </div>
                    <div>
                      <h4 className="font-bold text-xl mb-2">هل تناسب جميع أنواع الشعر؟</h4>
                      <p>نعم، صابونة سفن جرين مناسبة لجميع أنواع الشعر: الدهني، الجاف، العادي، والمختلط. التركيبة الطبيعية تتكيف مع احتياجات كل نوع شعر.</p>
                    </div>
                    <div>
                      <h4 className="font-bold text-xl mb-2">متى تظهر النتائج؟</h4>
                      <p>معظم المستخدمين يلاحظون تحسناً ملحوظاً في تقليل التساقط خلال 2-4 أسابيع، بينما تظهر نتائج التكثيف والنمو بشكل واضح خلال 6-8 أسابيع.</p>
                    </div>
                  </div>

                  <div className="bg-primary/10 p-6 rounded-lg mt-8">
                    <h3 className="text-2xl font-bold mb-3">اطلبي صابونة سفن جرين الأصلية الآن</h3>
                    <p className="text-lg mb-4">
                      انضمي إلى آلاف العملاء الراضين واحصلي على شعر صحي وقوي. اطلبي الآن واستمتعي بشحن مجاني وضمان 30 يوم!
                    </p>
                    <p className="font-bold text-xl">السعر: 71 ريال سعودي فقط</p>
                  </div>
                </>
              ) : (
                <>
                  <h1 className="text-4xl font-bold mb-6">Seven Green Original Triangular Soap - Your Complete Guide to Natural Hair Loss Treatment</h1>
                  
                  <h2 className="text-3xl font-bold mt-8 mb-4">What is Seven Green Soap?</h2>
                  <p className="text-lg leading-relaxed mb-4">
                    Seven Green Original Triangular Soap is a 100% natural product made from cypress leaves and osman plant, specifically developed to treat hair loss problems and promote natural and healthy hair growth. This unique soap features its distinctive triangular shape, which has become a registered trademark of original Seven Green products.
                  </p>
                  
                  <h2 className="text-3xl font-bold mt-8 mb-4">Why Choose Seven Green Soap?</h2>
                  <p className="text-lg leading-relaxed mb-4">
                    After years of research and development, Seven Green soap was created to be the optimal solution for women and men suffering from hair loss, weak hair, or oily scalp problems. The product has international quality certifications and is clinically tested to ensure effectiveness and safety.
                  </p>
                  
                  <h3 className="text-2xl font-bold mt-6 mb-3">Effective Natural Ingredients</h3>
                  <ul className="list-disc list-inside space-y-2 mb-6">
                    <li><strong>Natural Cypress Leaves:</strong> Rich in antioxidants that protect hair follicles and strengthen roots from deep within</li>
                    <li><strong>Osman Plant:</strong> Contains natural compounds that stimulate hair growth and prevent hair loss with scientifically proven effectiveness</li>
                    <li><strong>Extracted Organic Oils:</strong> Provide deep nourishment to the scalp and restore natural oil balance</li>
                  </ul>

                  <h2 className="text-3xl font-bold mt-8 mb-4">Scientifically Proven Benefits of Seven Green Soap</h2>
                  <div className="grid md:grid-cols-2 gap-4 mb-6">
                    <div className="bg-accent/20 p-4 rounded-lg">
                      <h4 className="font-bold mb-2">✓ Hair Loss Treatment</h4>
                      <p>Reduces hair loss by up to 80% within 4 weeks of regular use</p>
                    </div>
                    <div className="bg-accent/20 p-4 rounded-lg">
                      <h4 className="font-bold mb-2">✓ Hair Thickening</h4>
                      <p>Stimulates new hair growth and noticeably increases hair density naturally</p>
                    </div>
                    <div className="bg-accent/20 p-4 rounded-lg">
                      <h4 className="font-bold mb-2">✓ Oil Control</h4>
                      <p>Regulates oil secretion in the scalp and prevents oily hair</p>
                    </div>
                    <div className="bg-accent/20 p-4 rounded-lg">
                      <h4 className="font-bold mb-2">✓ Root Strengthening</h4>
                      <p>Deep nourishment to hair roots for stronger and more flexible hair</p>
                    </div>
                  </div>

                  <h2 className="text-3xl font-bold mt-8 mb-4">Proper Usage Method for Best Results</h2>
                  <ol className="list-decimal list-inside space-y-3 mb-6">
                    <li className="text-lg">Wet your hair thoroughly with lukewarm water</li>
                    <li className="text-lg">Rub the soap between your hands to produce creamy lather</li>
                    <li className="text-lg">Gently massage the scalp in circular motions for 3-5 minutes</li>
                    <li className="text-lg">Leave the lather on hair for 2-3 minutes for better absorption</li>
                    <li className="text-lg">Rinse hair thoroughly with lukewarm water</li>
                    <li className="text-lg">Repeat usage 2-3 times weekly for best results</li>
                  </ol>

                  <div className="bg-primary/10 p-6 rounded-lg mt-8">
                    <h3 className="text-2xl font-bold mb-3">Order Seven Green Original Soap Now</h3>
                    <p className="text-lg mb-4">
                      Join thousands of satisfied customers and get healthy, strong hair. Order now and enjoy free shipping and 30-day guarantee!
                    </p>
                    <p className="font-bold text-xl">Price: Only 71 SAR</p>
                  </div>
                </>
              )}
            </article>
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
      </div>
    </>
  );
};

export default Product;
