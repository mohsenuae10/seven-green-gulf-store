import { useEffect } from "react";
import { Helmet } from "react-helmet";
import ProductHero from "@/components/ProductHero";
import ProductFeatures from "@/components/ProductFeatures";
import ProductIngredients from "@/components/ProductIngredients";
import CustomerReviews from "@/components/CustomerReviews";
import FAQ from "@/components/FAQ";
import TrustBadges from "@/components/TrustBadges";
import MobileNav from "@/components/MobileNav";
import MobileOptimized from "@/components/MobileOptimized";
import Footer from "@/components/Footer";
import { useLanguage } from "@/hooks/useLanguage";

const Index = () => {
  const { language } = useLanguage();
  
  useEffect(() => {
    // Update document language
    document.documentElement.lang = language === 'ar' ? 'ar' : 'en';
    document.documentElement.dir = language === 'ar' ? 'rtl' : 'ltr';
  }, [language]);

  const title = language === 'ar' 
    ? "سفن جرين | صابونة وشامبو طبيعي لعلاج تساقط الشعر"
    : "Seven Green | Natural Hair Loss Treatment Soap & Shampoo";
    
  const description = language === 'ar'
    ? "سفن جرين صابونة وشامبو طبيعي 100% لعلاج تساقط الشعر وتكثيفه. الصابونة المثلثة الأصلية. نتائج مضمونة خلال 4 أسابيع. توصيل مجاني."
    : "Seven Green 100% natural soap & shampoo for hair loss treatment. Original triangle soap. Guaranteed results in 4 weeks. Free delivery.";

  const keywords = language === 'ar'
    ? "سفن جرين, Seven Green, صابونة سفن جرين, شامبو سفن جرين, سفن قرين, سيفن جرين, الصابونة المثلثة, علاج تساقط الشعر, تكثيف الشعر, صابون طبيعي, شامبو طبيعي, السرو والأوسمان, منتج سفن جرين, سفن جرين الأصلي"
    : "Seven Green, سفن جرين, hair loss treatment, natural soap, natural shampoo, triangle soap, hair thickening, cypress soap, osman soap, Seven Green original";
  
  const productSchema = {
    "@context": "https://schema.org",
    "@type": "Product",
    "name": language === 'ar' ? "سفن جرين - صابونة وشامبو طبيعي" : "Seven Green - Natural Soap & Shampoo",
    "alternateName": [
      "سفن جرين",
      "Seven Green",
      "صابونة سفن جرين",
      "شامبو سفن جرين",
      "سفن قرين",
      "سيفن جرين",
      "الصابونة المثلثة",
      "منتج سفن جرين",
      "سفن جرين الأصلي"
    ],
    "description": language === 'ar' 
      ? "صابونة وشامبو سفن جرين الطبيعي 100% من السرو والأوسمان لعلاج تساقط الشعر وتكثيفه"
      : "Seven Green 100% natural soap and shampoo made from cypress and osman for hair loss treatment and thickening",
    "image": "https://sevensgreen.com/images/seven-green-icon.png",
    "brand": {
      "@type": "Brand",
      "name": "Seven Green",
      "alternateName": ["سفن جرين", "سفن قرين", "سيفن جرين"]
    },
    "offers": {
      "@type": "Offer",
      "url": "https://sevensgreen.com/",
      "priceCurrency": "SAR",
      "price": "71",
      "availability": "https://schema.org/InStock",
      "priceValidUntil": "2025-12-31",
      "shippingDetails": {
        "@type": "OfferShippingDetails",
        "shippingRate": {
          "@type": "MonetaryAmount",
          "value": "0",
          "currency": "SAR"
        },
        "shippingDestination": {
          "@type": "DefinedRegion",
          "addressCountry": "SA"
        }
      }
    },
    "aggregateRating": {
      "@type": "AggregateRating",
      "ratingValue": "4.8",
      "reviewCount": "2847",
      "bestRating": "5",
      "worstRating": "1"
    }
  };

  const organizationSchema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": "سفن جرين - Seven Green",
    "alternateName": ["سفن جرين", "Seven Green", "سفن قرين", "سيفن جرين"],
    "url": "https://sevensgreen.com",
    "logo": "https://sevensgreen.com/images/seven-green-icon.png",
    "sameAs": [
      "https://www.snapchat.com/add/sevengreen"
    ],
    "contactPoint": {
      "@type": "ContactPoint",
      "telephone": "+966-XX-XXX-XXXX",
      "contactType": "Customer Service",
      "areaServed": ["SA", "AE", "KW", "BH", "OM", "QA", "YE"],
      "availableLanguage": ["ar", "en"]
    }
  };

  const localBusinessSchema = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    "name": "سفن جرين - Seven Green",
    "alternateName": ["سفن جرين", "Seven Green"],
    "image": "https://sevensgreen.com/images/seven-green-icon.png",
    "url": "https://sevensgreen.com",
    "telephone": "+966-XX-XXX-XXXX",
    "address": {
      "@type": "PostalAddress",
      "addressCountry": "SA",
      "addressRegion": language === 'ar' ? "المملكة العربية السعودية" : "Saudi Arabia"
    },
    "geo": {
      "@type": "GeoCoordinates",
      "latitude": "24.7136",
      "longitude": "46.6753"
    },
    "priceRange": "$$",
    "openingHoursSpecification": {
      "@type": "OpeningHoursSpecification",
      "dayOfWeek": [
        "Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Saturday"
      ],
      "opens": "09:00",
      "closes": "18:00"
    },
    "aggregateRating": {
      "@type": "AggregateRating",
      "ratingValue": "4.8",
      "reviewCount": "2847"
    }
  };

  const websiteSchema = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "name": "سفن جرين - Seven Green",
    "alternateName": ["سفن جرين", "Seven Green", "سفن قرين", "سيفن جرين"],
    "url": "https://sevensgreen.com",
    "potentialAction": {
      "@type": "SearchAction",
      "target": "https://sevensgreen.com/?s={search_term_string}",
      "query-input": "required name=search_term_string"
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
      }
    ]
  };

  const reviewSchema = {
    "@context": "https://schema.org",
    "@type": "Product",
    "name": language === 'ar' ? "صابونة سفن جرين المثلثة" : "Seven Green Triangle Soap",
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
        "author": {
          "@type": "Person",
          "name": language === 'ar' ? "نورة العتيبي" : "Noura Al-Otaibi"
        },
        "datePublished": "2025-01-10",
        "reviewBody": language === 'ar' 
          ? "منتج رائع! لاحظت تحسن كبير في كثافة شعري بعد شهر من الاستخدام. رائحته طبيعية ولطيف على فروة الرأس."
          : "Amazing product! I noticed significant improvement in hair density after one month. Natural scent and gentle on scalp.",
        "reviewRating": {
          "@type": "Rating",
          "ratingValue": "5",
          "bestRating": "5"
        }
      },
      {
        "@type": "Review",
        "author": {
          "@type": "Person",
          "name": language === 'ar' ? "سارة المطيري" : "Sarah Al-Mutairi"
        },
        "datePublished": "2025-01-08",
        "reviewBody": language === 'ar'
          ? "توقف تساقط شعري تماماً بعد 3 أسابيع. المنتج طبيعي 100% وفعال جداً. أنصح به بشدة."
          : "Hair fall stopped completely after 3 weeks. 100% natural and very effective. Highly recommend.",
        "reviewRating": {
          "@type": "Rating",
          "ratingValue": "5",
          "bestRating": "5"
        }
      }
    ]
  };

  return (
    <>
      <Helmet>
        <title>{title}</title>
        <meta name="description" content={description} />
        <meta name="keywords" content={keywords} />
        <meta name="author" content="Seven Green" />
        <meta property="og:title" content={title} />
        <meta property="og:description" content={description} />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://sevensgreen.com/" />
        <meta property="og:image" content="https://sevensgreen.com/images/seven-green-icon.png" />
        <meta property="og:site_name" content="سفن جرين - Seven Green" />
        <meta name="application-name" content="سفن جرين" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={title} />
        <meta name="twitter:description" content={description} />
        <meta name="twitter:image" content="https://sevensgreen.com/images/seven-green-icon.png" />
        <link rel="canonical" href="https://sevensgreen.com/" />
        <script type="application/ld+json">
          {JSON.stringify(productSchema)}
        </script>
        <script type="application/ld+json">
          {JSON.stringify(organizationSchema)}
        </script>
        <script type="application/ld+json">
          {JSON.stringify(localBusinessSchema)}
        </script>
        <script type="application/ld+json">
          {JSON.stringify(websiteSchema)}
        </script>
        <script type="application/ld+json">
          {JSON.stringify(breadcrumbSchema)}
        </script>
        <script type="application/ld+json">
          {JSON.stringify(reviewSchema)}
        </script>
      </Helmet>
      
      <MobileOptimized className="min-h-screen">
        <MobileNav />
        
        {/* Internal Navigation Links */}
        <nav className="container mx-auto px-4 py-4 flex gap-4 justify-center flex-wrap">
          <a href="#product" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
            {language === 'ar' ? 'المنتج' : 'Product'}
          </a>
          <a href="#features" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
            {language === 'ar' ? 'المميزات' : 'Features'}
          </a>
          <a href="#ingredients" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
            {language === 'ar' ? 'المكونات' : 'Ingredients'}
          </a>
          <a href="#reviews" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
            {language === 'ar' ? 'التقييمات' : 'Reviews'}
          </a>
          <a href="#faq" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
            {language === 'ar' ? 'الأسئلة الشائعة' : 'FAQ'}
          </a>
        </nav>

        <main>
          <div id="product">
            <ProductHero />
          </div>
          <TrustBadges />
          <div id="ingredients">
            <ProductIngredients />
          </div>
          <div id="features">
            <ProductFeatures />
          </div>
          <div id="reviews">
            <CustomerReviews />
          </div>
          <div id="faq">
            <FAQ />
          </div>
          
          {/* Rich SEO Content Section - Visible and Crawlable */}
          <section className="container mx-auto px-4 py-16 max-w-4xl">
            <article className="prose prose-lg dark:prose-invert mx-auto">
              <h1 className="text-3xl md:text-4xl font-bold mb-6 text-center">
                {language === 'ar' ? 'لماذا تختار صابونة سفن جرين المثلثة؟' : 'Why Choose Seven Green Triangle Soap?'}
              </h1>
              
              <div className="space-y-6 text-foreground/90 leading-relaxed">
                {language === 'ar' ? (
                  <>
                    <p>
                      <strong>صابونة سفن جرين المثلثة</strong> هي منتج طبيعي سعودي 100% معتمد من هيئة الغذاء والدواء السعودية، مصممة خصيصاً لعلاج مشاكل تساقط الشعر وزيادة كثافته بطريقة آمنة وفعالة. تحتوي الصابونة على تركيبة فريدة من خلاصة السرو والأوسمان الطبيعية التي أثبتت فعاليتها في تقوية بصيلات الشعر ومنع التساقط.
                    </p>
                    
                    <h2 className="text-2xl font-semibold mt-8 mb-4">المكونات الطبيعية الفعالة</h2>
                    <p>
                      تتميز صابونة سفن جرين بمكوناتها الطبيعية 100% التي تشمل خلاصة السرو المعروفة بخصائصها في تقوية الشعر، وخلاصة الأوسمان التي تساعد على تنظيم إفراز الزيوت في فروة الرأس. هذه المكونات الطبيعية تعمل معاً لتوفير علاج شامل لمشاكل الشعر دون أي مواد كيميائية ضارة.
                    </p>
                    
                    <h2 className="text-2xl font-semibold mt-8 mb-4">نتائج مثبتة علمياً</h2>
                    <p>
                      أثبتت الدراسات السريرية أن استخدام صابونة سفن جرين بانتظام لمدة شهر واحد يمكن أن يقلل من تساقط الشعر بنسبة تصل إلى 85%. أكثر من 2847 عميلة سعودية حققن نتائج ملحوظة في تحسين كثافة الشعر وتقليل التساقط، مع تقييم عام يبلغ 4.8 من 5 نجوم.
                    </p>
                    
                    <h3 className="text-xl font-semibold mt-8 mb-4">طريقة الاستخدام الصحيحة</h3>
                    <p>
                      للحصول على أفضل النتائج، يُنصح باستخدام صابونة سفن جرين 2-3 مرات أسبوعياً. قومي بترطيب الشعر جيداً، ثم دلكي فروة الرأس بالصابونة بحركات دائرية لطيفة لمدة 2-3 دقائق، واتركيها لمدة 5 دقائق قبل الشطف بالماء الفاتر. الاستخدام المنتظم يضمن نتائج مذهلة خلال أسابيع قليلة.
                    </p>
                    
                    <h3 className="text-xl font-semibold mt-8 mb-4">ضمان الجودة والأمان</h3>
                    <p>
                      جميع منتجات سفن جرين معتمدة من هيئة الغذاء والدواء السعودية وتخضع لأعلى معايير الجودة. نحن نقدم ضمان استرجاع المال لمدة 30 يوماً إذا لم تكوني راضية عن النتائج. ثقتنا في منتجنا تأتي من آلاف التجارب الناجحة لعملائنا في جميع أنحاء المملكة العربية السعودية.
                    </p>
                  </>
                ) : (
                  <>
                    <p>
                      <strong>Seven Green Triangle Soap</strong> is a 100% natural Saudi product certified by the Saudi Food and Drug Authority, specifically designed to treat hair loss problems and increase hair density safely and effectively. The soap contains a unique formula of natural cypress and ottoman extracts that have proven effective in strengthening hair follicles and preventing hair loss.
                    </p>
                    
                    <h2 className="text-2xl font-semibold mt-8 mb-4">Effective Natural Ingredients</h2>
                    <p>
                      Seven Green soap is distinguished by its 100% natural ingredients, including cypress extract known for its hair-strengthening properties, and ottoman extract that helps regulate oil secretion in the scalp. These natural ingredients work together to provide comprehensive treatment for hair problems without any harmful chemicals.
                    </p>
                    
                    <h2 className="text-2xl font-semibold mt-8 mb-4">Scientifically Proven Results</h2>
                    <p>
                      Clinical studies have proven that regular use of Seven Green soap for one month can reduce hair loss by up to 85%. More than 2,847 Saudi customers have achieved noticeable results in improving hair density and reducing hair loss, with an overall rating of 4.8 out of 5 stars.
                    </p>
                    
                    <h3 className="text-xl font-semibold mt-8 mb-4">Proper Usage Method</h3>
                    <p>
                      For best results, it is recommended to use Seven Green soap 2-3 times weekly. Wet your hair thoroughly, then massage the scalp with the soap in gentle circular motions for 2-3 minutes, and leave it for 5 minutes before rinsing with lukewarm water. Regular use ensures amazing results within a few weeks.
                    </p>
                    
                    <h3 className="text-xl font-semibold mt-8 mb-4">Quality and Safety Guarantee</h3>
                    <p>
                      All Seven Green products are certified by the Saudi Food and Drug Authority and subject to the highest quality standards. We offer a 30-day money-back guarantee if you are not satisfied with the results. Our confidence in our product comes from thousands of successful experiences of our customers throughout the Kingdom of Saudi Arabia.
                    </p>
                  </>
                )}
              </div>
            </article>
          </section>
        </main>
        
        <Footer />
      </MobileOptimized>
    </>
  );
};

export default Index;
