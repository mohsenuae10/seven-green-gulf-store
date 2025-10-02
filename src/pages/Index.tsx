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
    ? "سفن جرين Seven Green | شامبو وصابونة طبيعية لعلاج تساقط الشعر | الصابونة المثلثة الأصلية"
    : "Seven Green | Natural Shampoo & Soap for Hair Loss Treatment | Original Triangle Soap";
    
  const description = language === 'ar'
    ? "صابونة وشامبو سفن جرين الطبيعي 100% من السرو والأوسمان. الحل الأمثل لعلاج تساقط الشعر وتكثيفه. الصابونة المثلثة الأصلية. نتائج مضمونة خلال 4 أسابيع. توصيل مجاني للسعودية والخليج واليمن."
    : "Seven Green 100% natural soap and shampoo made from cypress and osman. The optimal solution for treating hair loss and thickening. Original triangle soap. Guaranteed results within 4 weeks. Free delivery to Saudi Arabia, GCC and Yemen.";

  return (
    <>
      <Helmet>
        <title>{title}</title>
        <meta name="description" content={description} />
        <meta property="og:title" content={title} />
        <meta property="og:description" content={description} />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://sevensgreen.com/" />
        <meta name="twitter:title" content={title} />
        <meta name="twitter:description" content={description} />
        <link rel="canonical" href="https://sevensgreen.com/" />
      </Helmet>
      
      <MobileOptimized className="min-h-screen">
        <MobileNav />
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
