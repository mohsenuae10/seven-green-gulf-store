import { useEffect } from "react";
import { Helmet } from "react-helmet";
import { Link } from "react-router-dom";
import { useLanguage } from "@/hooks/useLanguage";
import MobileNav from "@/components/MobileNav";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";

const Compare = () => {
  const { language } = useLanguage();
  
  useEffect(() => {
    document.documentElement.lang = language === 'ar' ? 'ar' : 'en';
    document.documentElement.dir = language === 'ar' ? 'rtl' : 'ltr';
  }, [language]);

  return (
    <>
      <Helmet>
        <title>{language === 'ar' ? 'مقارنة المنتجات | سفن جرين' : 'Product Comparison | Seven Green'}</title>
        <link rel="canonical" href="https://sevensgreen.com/compare" />
      </Helmet>

      <div className="min-h-screen bg-background">
        <MobileNav />
        <main className="container mx-auto px-4 py-8">
          <h1 className="text-4xl font-bold text-center mb-8">{language === 'ar' ? 'مقارنة المنتجات' : 'Product Comparison'}</h1>
          <div className="text-center">
            <Link to="/order">
              <Button size="lg" className="bg-gradient-primary">
                {language === 'ar' ? 'اطلبي الآن' : 'Order Now'}
              </Button>
            </Link>
          </div>
        </main>
        <Footer />
      </div>
    </>
  );
};

export default Compare;
