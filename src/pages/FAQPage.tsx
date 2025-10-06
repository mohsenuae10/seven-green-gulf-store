import { useEffect } from "react";
import { Helmet } from "react-helmet";
import { useLanguage } from "@/hooks/useLanguage";
import MobileNav from "@/components/MobileNav";
import Footer from "@/components/Footer";
import FAQ from "@/components/FAQ";

const FAQPage = () => {
  const { language } = useLanguage();
  
  useEffect(() => {
    document.documentElement.lang = language === 'ar' ? 'ar' : 'en';
    document.documentElement.dir = language === 'ar' ? 'rtl' : 'ltr';
  }, [language]);

  return (
    <>
      <Helmet>
        <title>{language === 'ar' ? 'الأسئلة الشائعة | سفن جرين' : 'FAQ | Seven Green'}</title>
        <link rel="canonical" href="https://sevensgreen.com/faq" />
      </Helmet>

      <div className="min-h-screen bg-background">
        <MobileNav />
        <FAQ />
        <Footer />
      </div>
    </>
  );
};

export default FAQPage;
