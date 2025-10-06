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

  return (
    <>
      <Helmet>
        <title>{language === 'ar' ? 'تقييمات العملاء | سفن جرين' : 'Customer Reviews | Seven Green'}</title>
        <link rel="canonical" href="https://sevensgreen.com/reviews" />
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
