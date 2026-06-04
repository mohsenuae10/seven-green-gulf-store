import { useEffect } from "react";
import { Helmet } from "react-helmet";
import { Link } from "react-router-dom";
import Header from "@/components/Header";
import ProductHero from "@/components/ProductHero";
import ProductFeatures from "@/components/ProductFeatures";
import ProductIngredients from "@/components/ProductIngredients";
import ProductDetails from "@/components/ProductDetails";
import CustomerReviews from "@/components/CustomerReviews";
import FAQ from "@/components/FAQ";
import TrustBadges from "@/components/TrustBadges";
import MobileNav from "@/components/MobileNav";
import MobileOptimized from "@/components/MobileOptimized";
import Footer from "@/components/Footer";
import { Card } from "@/components/ui/card";
import { useLanguage } from "@/hooks/useLanguage";
import { useProductPrice } from "@/hooks/useProductPrice";
import { CONTACT_INFO } from "@/config/contact";

const Index = () => {
  const { language } = useLanguage();
  const { price } = useProductPrice({ fallback: 71 });
  
  useEffect(() => {
    // Update document language
    document.documentElement.lang = language === 'ar' ? 'ar' : 'en';
    document.documentElement.dir = language === 'ar' ? 'rtl' : 'ltr';
  }, [language]);

  const title = language === 'ar' 
    ? "سفن جرين | علاج طبيعي لتساقط الشعر 🌿 صابونة وشامبو"
    : "Seven Green | Natural Hair Loss Treatment 🌿 Soap & Shampoo";
    
  const description = language === 'ar'
    ? "صابونة سفن جرين الأصلية 🌿 علاج فعال لتساقط الشعر وتكثيفه بمكونات طبيعية 100% | شامبو سفن جرين المثلث من السرو والأوسمان ⭐ نتائج مضمونة | السعر 71 ريال 🚚 شحن مجاني"
    : "Original Seven Green Soap 🌿 Effective hair loss treatment with 100% natural ingredients | Seven Green Triangle Shampoo from Cypress & Osman ⭐ Guaranteed results | Price 71 SAR 🚚 Free shipping";

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
    "image": "https://sevensgreen.com/lovable-uploads/seven-green-icon.png",
    "brand": {
      "@type": "Brand",
      "name": "Seven Green",
      "alternateName": ["سفن جرين", "سفن قرين", "سيفن جرين"]
    },
    "offers": {
      "@type": "Offer",
      "url": "https://sevensgreen.com/",
      "priceCurrency": "SAR",
      "price": price.toString(),
      "availability": "https://schema.org/InStock",
      "priceValidUntil": "2026-12-31",
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
    "logo": "https://sevensgreen.com/lovable-uploads/seven-green-icon.png",
    "sameAs": [
      "https://www.snapchat.com/add/sevengreen"
    ],
    "contactPoint": {
      "@type": "ContactPoint",
      "telephone": CONTACT_INFO.phone,
      "contactType": "Customer Service",
      "email": CONTACT_INFO.email,
      "areaServed": ["SA", "AE", "KW", "BH", "OM", "QA", "YE"],
      "availableLanguage": ["ar", "en"]
    }
  };

  const localBusinessSchema = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    "name": "سفن جرين - Seven Green",
    "alternateName": ["سفن جرين", "Seven Green"],
    "image": "https://sevensgreen.com/lovable-uploads/seven-green-icon.png",
    "url": "https://sevensgreen.com",
    "telephone": CONTACT_INFO.phone,
    "email": CONTACT_INFO.email,
    "address": {
      "@type": "PostalAddress",
      "addressCountry": CONTACT_INFO.country,
      "addressRegion": language === 'ar' ? CONTACT_INFO.countryName.ar : CONTACT_INFO.countryName.en
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

  const howToSchema = {
    "@context": "https://schema.org",
    "@type": "HowTo",
    "name": language === 'ar' 
      ? "طريقة استخدام صابونة سفن جرين المثلثة"
      : "How to Use Seven Green Triangle Soap",
    "description": language === 'ar'
      ? "دليل خطوة بخطوة لاستخدام صابونة سفن جرين لأفضل النتائج في منع تساقط الشعر"
      : "Step-by-step guide to using Seven Green soap for best results in preventing hair loss",
    "totalTime": "PT10M",
    "step": [
      {
        "@type": "HowToStep",
        "position": 1,
        "name": language === 'ar' ? "ترطيب الشعر" : "Wet Hair",
        "text": language === 'ar' 
          ? "بلل شعرك بالماء الدافئ بشكل كامل"
          : "Wet your hair completely with warm water"
      },
      {
        "@type": "HowToStep",
        "position": 2,
        "name": language === 'ar' ? "تطبيق الصابونة" : "Apply Soap",
        "text": language === 'ar'
          ? "افرك الصابونة المثلثة على فروة الرأس والشعر حتى تتكون رغوة غنية"
          : "Rub the triangle soap on scalp and hair until rich lather forms"
      },
      {
        "@type": "HowToStep",
        "position": 3,
        "name": language === 'ar' ? "التدليك" : "Massage",
        "text": language === 'ar'
          ? "دلك فروة الرأس بحركات دائرية لطيفة لمدة 2-3 دقائق"
          : "Massage scalp with gentle circular motions for 2-3 minutes"
      },
      {
        "@type": "HowToStep",
        "position": 4,
        "name": language === 'ar' ? "الانتظار" : "Wait",
        "text": language === 'ar'
          ? "اترك الصابونة على الشعر لمدة 5 دقائق للاستفادة القصوى"
          : "Leave the soap on hair for 5 minutes for maximum benefit"
      },
      {
        "@type": "HowToStep",
        "position": 5,
        "name": language === 'ar' ? "الشطف" : "Rinse",
        "text": language === 'ar'
          ? "اشطف الشعر جيداً بالماء الفاتر حتى إزالة كل الرغوة"
          : "Rinse hair thoroughly with lukewarm water until all lather is removed"
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
        <meta property="og:image" content="https://sevensgreen.com/lovable-uploads/seven-green-icon.png" />
        <meta property="og:site_name" content="سفن جرين - Seven Green" />
        <link rel="alternate" hrefLang="ar" href="https://sevensgreen.com/?lang=ar" />
        <link rel="alternate" hrefLang="en" href="https://sevensgreen.com/?lang=en" />
        <link rel="alternate" hrefLang="x-default" href="https://sevensgreen.com/" />
        <meta name="application-name" content="سفن جرين" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={title} />
        <meta name="twitter:description" content={description} />
        <meta name="twitter:image" content="https://sevensgreen.com/lovable-uploads/seven-green-icon.png" />
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
        <script type="application/ld+json">
          {JSON.stringify(howToSchema)}
        </script>
      </Helmet>
      
      <MobileOptimized className="min-h-screen">
        <Header />
        <MobileNav />

        <main>
          <div id="product">
            <ProductHero />
          </div>
          <TrustBadges />
          <ProductDetails />
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
                {language === 'ar' ? 'سفن جرين - شامبو سفن جرين وصابونة سفن جرين الأصلية' : 'Seven Green - Original Seven Green Shampoo and Soap'}
              </h1>
              
              <div className="space-y-6 text-foreground/90 leading-relaxed">
                {language === 'ar' ? (
                  <>
                    <p>
                      <strong><Link to="/order" className="text-primary hover:underline">صابونة سفن جرين</Link></strong> و<strong>شامبو سفن جرين</strong> هما منتج طبيعي واحد 100% معتمد من هيئة الغذاء والدواء، مصمم خصيصاً لعلاج مشاكل تساقط الشعر وزيادة كثافته بطريقة آمنة وفعالة. تحتوي الصابونة على تركيبة فريدة من خلاصة السرو والأوسمان الطبيعية التي أثبتت فعاليتها في تقوية بصيلات الشعر ومنع التساقط.
                    </p>
                    
                    <h2 className="text-2xl font-semibold mt-8 mb-4">شامبو سفن جرين - شامبو تساقط الشعر العشبي</h2>
                    <p>
                      يُعد <strong>شامبو سفن جرين</strong> الحل الأمثل لمن يعانون من تساقط الشعر. هذا الشامبو العشبي المميز يجمع بين فوائد 7 أعشاب طبيعية لتقوية جذور الشعر ومنع التساقط. <strong>شامبو تساقط الشعر</strong> من سفن جرين يتميز بتركيبته الخالية من المواد الكيميائية الضارة.
                    </p>
                    
                    <h2 className="text-2xl font-semibold mt-8 mb-4">صابونة سفن جرين العشبية - المكونات الطبيعية</h2>
                    <p>
                      تتميز <strong>صابونة سفن جرين العشبية</strong> بمكوناتها الطبيعية 100% التي تشمل خلاصة السرو المعروفة بخصائصها في تقوية الشعر، وخلاصة الأوسمان التي تساعد على تنظيم إفراز الزيوت في فروة الرأس. هذا <strong>الشامبو العشبي</strong> يعمل على توفير علاج شامل لمشاكل الشعر.
                    </p>
                    
                    <h2 className="text-2xl font-semibold mt-8 mb-4">نتائج مثبتة علمياً - شامبو سفن جرين ضد التساقط</h2>
                    <p>
                      أثبتت الدراسات السريرية أن استخدام <strong>شامبو سفن جرين ضد التساقط</strong> بانتظام لمدة شهر واحد يمكن أن يقلل من تساقط الشعر بنسبة تصل إلى 85%. أكثر من 2847 عميل حققوا نتائج ملحوظة في تحسين كثافة الشعر وتقليل التساقط، مع تقييم عام يبلغ 4.8 من 5 نجوم.
                    </p>
                    
                    <h3 className="text-xl font-semibold mt-8 mb-4">طريقة استخدام شامبو سفن جرين</h3>
                    <p>
                      للحصول على أفضل النتائج، يُنصح باستخدام <strong>صابونة سفن جرين</strong> 2-3 مرات أسبوعياً. بلل الشعر جيداً، ثم دلك فروة الرأس بالصابونة بحركات دائرية لطيفة لمدة 2-3 دقائق، واتركها لمدة 5 دقائق قبل الشطف بالماء الفاتر.
                    </p>
                    
                    <h3 className="text-xl font-semibold mt-8 mb-4">ضمان الجودة - سفن جرين الأصلي</h3>
                    <p>
                      جميع منتجات <strong>سفن جرين</strong> معتمدة وتخضع لأعلى معايير الجودة. نحن نقدم ضمان استرجاع المال لمدة 30 يوماً في حال عدم الرضا عن النتائج. ثقتنا في منتجنا تأتي من آلاف التجارب الناجحة لعملائنا. <Link to="/about" className="text-primary hover:underline font-semibold">اقرأ المزيد عن قصتنا</Link>.
                    </p>
                  </>
                ) : (
                  <>
                    <p>
                      <strong>Seven Green Soap</strong> and <strong>Seven Green Shampoo</strong> are a single 100% natural product certified by the Food and Drug Authority, specifically designed to treat hair loss problems and increase hair density safely and effectively. The soap contains a unique formula of natural cypress and osman extracts that have proven effective in strengthening hair follicles and preventing hair loss.
                    </p>
                    
                    <h2 className="text-2xl font-semibold mt-8 mb-4">Seven Green Shampoo - Herbal Hair Loss Treatment</h2>
                    <p>
                      <strong>Seven Green Shampoo</strong> is the perfect solution for those suffering from hair loss. This distinctive herbal shampoo combines the benefits of 7 natural herbs to strengthen hair roots and prevent hair loss. Seven Green hair loss shampoo features a formula free from harmful chemicals.
                    </p>
                    
                    <h2 className="text-2xl font-semibold mt-8 mb-4">Seven Green Herbal Soap - Natural Ingredients</h2>
                    <p>
                      <strong>Seven Green Herbal Soap</strong> is distinguished by its 100% natural ingredients, including cypress extract known for its hair-strengthening properties, and osman extract that helps regulate oil secretion in the scalp. This herbal shampoo provides comprehensive treatment for hair problems.
                    </p>
                    
                    <h2 className="text-2xl font-semibold mt-8 mb-4">Scientifically Proven Results - Anti Hair Fall Shampoo</h2>
                    <p>
                      Clinical studies have proven that regular use of <strong>Seven Green Anti-Hair Fall Shampoo</strong> for one month can reduce hair loss by up to 85%. More than 2,847 customers have achieved noticeable results in improving hair density and reducing hair loss, with an overall rating of 4.8 out of 5 stars.
                    </p>
                    
                    <h3 className="text-xl font-semibold mt-8 mb-4">How to Use Seven Green Shampoo</h3>
                    <p>
                      For best results, it is recommended to use <strong>Seven Green Soap</strong> 2-3 times weekly. Wet your hair thoroughly, then massage the scalp with the soap in gentle circular motions for 2-3 minutes, and leave it for 5 minutes before rinsing with lukewarm water.
                    </p>
                    
                    <h3 className="text-xl font-semibold mt-8 mb-4">Quality Guarantee - Original Seven Green</h3>
                    <p>
                      All <strong>Seven Green</strong> products are certified and subject to the highest quality standards. We offer a 30-day money-back guarantee if you are not satisfied with the results. Our confidence in our product comes from thousands of successful experiences of our customers.
                    </p>
                  </>
                )}
              </div>
            </article>
          </section>

          {/* Related Content Section */}
          <section className="py-12 bg-accent/10">
            <div className="container mx-auto px-4">
              <h2 className="text-3xl font-bold text-center mb-8">
                {language === 'ar' ? 'قد يهمك أيضاً' : 'You May Also Like'}
              </h2>
              <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
                <Link to="/about" className="group">
                  <Card className="p-6 hover:shadow-lg transition-all hover:-translate-y-1 h-full">
                    <div className="text-center">
                      <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-primary/10 flex items-center justify-center">
                        <span className="text-3xl">📖</span>
                      </div>
                      <h3 className="text-xl font-semibold mb-2 group-hover:text-primary transition-colors">
                        {language === 'ar' ? 'قصتنا' : 'Our Story'}
                      </h3>
                      <p className="text-muted-foreground">
                        {language === 'ar' 
                          ? 'تعرفي على رحلة سفن جرين ورؤيتنا'
                          : 'Learn about Seven Green journey and vision'}
                      </p>
                    </div>
                  </Card>
                </Link>
                
                <Link to="/order" className="group">
                  <Card className="p-6 hover:shadow-lg transition-all hover:-translate-y-1 h-full bg-gradient-primary/5">
                    <div className="text-center">
                      <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-primary/10 flex items-center justify-center">
                        <span className="text-3xl">🛒</span>
                      </div>
                      <h3 className="text-xl font-semibold mb-2 group-hover:text-primary transition-colors">
                        {language === 'ar' ? 'اطلبي الآن' : 'Order Now'}
                      </h3>
                      <p className="text-muted-foreground">
                        {language === 'ar' 
                          ? 'احصلي على صابونة سفن جرين الأصلية'
                          : 'Get the original Seven Green soap'}
                      </p>
                    </div>
                  </Card>
                </Link>
                
                <a href="#faq" className="group">
                  <Card className="p-6 hover:shadow-lg transition-all hover:-translate-y-1 h-full">
                    <div className="text-center">
                      <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-primary/10 flex items-center justify-center">
                        <span className="text-3xl">❓</span>
                      </div>
                      <h3 className="text-xl font-semibold mb-2 group-hover:text-primary transition-colors">
                        {language === 'ar' ? 'الأسئلة الشائعة' : 'FAQs'}
                      </h3>
                      <p className="text-muted-foreground">
                        {language === 'ar' 
                          ? 'إجابات لأكثر الأسئلة شيوعاً'
                          : 'Answers to most common questions'}
                      </p>
                    </div>
                  </Card>
                </a>
              </div>
            </div>
          </section>
        </main>
        
        <Footer />
      </MobileOptimized>
    </>
  );
};

export default Index;
