import { useEffect } from "react";
import { Helmet } from "react-helmet";
import { useLanguage } from "@/hooks/useLanguage";
import MobileNav from "@/components/MobileNav";
import Footer from "@/components/Footer";
import CustomerReviews from "@/components/CustomerReviews";

const Reviews = () => {
  const { language } = useLanguage();
  
  useEffect(() => {
    document.documentElement.lang = language === 'ar' ? 'ar' : 'en';
    document.documentElement.dir = language === 'ar' ? 'rtl' : 'ltr';
  }, [language]);

  const title = language === 'ar' 
    ? 'تقييمات العملاء | سفن جرين - آراء حقيقية من 2800+ عميلة'
    : 'Customer Reviews | Seven Green - Real Feedback from 2800+ Customers';
    
  const description = language === 'ar'
    ? 'اقرأ تجارب وتقييمات أكثر من 2800 عميلة مع صابونة سفن جرين الطبيعية. نتائج حقيقية وآراء صادقة حول علاج تساقط الشعر وتكثيفه.'
    : 'Read experiences and reviews from over 2,800 customers with Seven Green natural soap. Real results and honest opinions about hair loss treatment and thickening.';

  return (
    <>
      <Helmet>
        <title>{title}</title>
        <meta name="description" content={description} />
        <meta property="og:title" content={title} />
        <meta property="og:description" content={description} />
        <meta property="og:type" content="website" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={title} />
        <meta name="twitter:description" content={description} />
        <link rel="canonical" href="https://sevensgreen.com/reviews" />
        <link rel="alternate" hrefLang="ar" href="https://sevensgreen.com/reviews?lang=ar" />
        <link rel="alternate" hrefLang="en" href="https://sevensgreen.com/reviews?lang=en" />
      </Helmet>

      <div className="min-h-screen bg-background">
        <MobileNav />
        <CustomerReviews />
        <Footer />
      </div>
    </>
  );
};

export default Reviews;
