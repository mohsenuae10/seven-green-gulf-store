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

  const title = language === 'ar' 
    ? 'مقارنة المنتجات | سفن جرين مقابل المنتجات الأخرى'
    : 'Product Comparison | Seven Green vs Other Products';
    
  const description = language === 'ar'
    ? 'قارن صابونة سفن جرين الطبيعية مع المنتجات الأخرى. اكتشف لماذا سفن جرين الخيار الأفضل لعلاج تساقط الشعر بمكونات طبيعية 100%.'
    : 'Compare Seven Green natural soap with other products. Discover why Seven Green is the best choice for hair loss treatment with 100% natural ingredients.';

  return (
    <>
      <Helmet>
        <title>{title}</title>
        <meta name="description" content={description} />
        <meta property="og:title" content={title} />
        <meta property="og:description" content={description} />
        <meta property="og:type" content="website" />
        <meta name="twitter:card" content="summary" />
        <meta name="twitter:title" content={title} />
        <meta name="twitter:description" content={description} />
        <link rel="canonical" href="https://sevensgreen.com/compare" />
        <link rel="alternate" hrefLang="ar" href="https://sevensgreen.com/compare?lang=ar" />
        <link rel="alternate" hrefLang="en" href="https://sevensgreen.com/compare?lang=en" />
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
