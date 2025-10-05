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
    "name": "Seven Green",
    "alternateName": ["سفن جرين", "سفن قرين", "سيفن جرين"],
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

  const websiteSchema = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "name": "Seven Green",
    "alternateName": ["سفن جرين", "سفن قرين", "سيفن جرين"],
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
        <meta property="og:site_name" content="Seven Green - سفن جرين" />
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
          {JSON.stringify(websiteSchema)}
        </script>
        <script type="application/ld+json">
          {JSON.stringify(breadcrumbSchema)}
        </script>
      </Helmet>
      
      <MobileOptimized className="min-h-screen">
        <MobileNav />
        
        {/* Hidden SEO Content */}
        <div className="sr-only">
          <h1>سفن جرين Seven Green - صابونة وشامبو طبيعي لعلاج تساقط الشعر</h1>
          <p>
            سفن جرين هو منتج طبيعي 100% لعلاج تساقط الشعر وتكثيفه. صابونة وشامبو سفن جرين مصنوع من السرو والأوسمان الطبيعي.
            الصابونة المثلثة الأصلية من سفن جرين تعالج مشاكل الشعر وفروة الرأس. منتج سفن جرين معتمد طبياً ومضمون النتائج.
          </p>
          <p>
            فوائد سفن جرين: علاج تساقط الشعر، تكثيف الشعر، تطويل الشعر، علاج قشرة الرأس، تنظيم الزيوت، تقوية جذور الشعر.
            Seven Green natural soap and shampoo for hair loss treatment and hair thickening.
          </p>
        </div>

        <main>
          <ProductHero />
          <TrustBadges />
          <ProductIngredients />
          <ProductFeatures />
          <CustomerReviews />
          <FAQ />
        </main>
      </MobileOptimized>
    </>
  );
};

export default Index;
