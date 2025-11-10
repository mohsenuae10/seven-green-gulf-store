import { Link, useLocation } from "react-router-dom";
import { useEffect } from "react";
import { useLanguage } from "@/hooks/useLanguage";
import { Home, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Helmet } from "react-helmet";

const NotFound = () => {
  const location = useLocation();
  const { language } = useLanguage();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <>
      <Helmet>
        <title>{language === 'ar' ? 'صفحة غير موجودة - سفن جرين' : '404 - Page Not Found | Seven Green'}</title>
        <meta name="description" content={language === 'ar' ? 'الصفحة التي تبحث عنها غير موجودة' : 'The page you are looking for does not exist'} />
        <meta name="robots" content="noindex, follow" />
        <link rel="canonical" href="https://sevensgreen.com/404" />
      </Helmet>
      
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-background to-muted/20">
        <div className="container mx-auto px-4 text-center">
          <div className="max-w-2xl mx-auto">
            {/* 404 Number */}
            <h1 className="text-[120px] md:text-[180px] font-bold text-primary/20 leading-none mb-4">
              404
            </h1>
            
            {/* Error Message */}
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              {language === 'ar' ? 'عذراً، الصفحة غير موجودة' : 'Oops! Page Not Found'}
            </h2>
            
            <p className="text-lg text-muted-foreground mb-8 max-w-md mx-auto">
              {language === 'ar' 
                ? 'الصفحة التي تبحث عنها قد تم نقلها أو حذفها أو لم تكن موجودة من الأساس'
                : 'The page you are looking for might have been removed, had its name changed, or is temporarily unavailable'}
            </p>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Button asChild size="lg" className="gap-2">
                <Link to="/">
                  <Home className="w-5 h-5" />
                  {language === 'ar' ? 'العودة للرئيسية' : 'Back to Home'}
                </Link>
              </Button>
              
              <Button asChild variant="outline" size="lg" className="gap-2">
                <Link to="/product">
                  <Search className="w-5 h-5" />
                  {language === 'ar' ? 'تصفح المنتجات' : 'Browse Products'}
                </Link>
              </Button>
            </div>

            {/* Helpful Links */}
            <div className="mt-12 pt-8 border-t border-border">
              <p className="text-sm text-muted-foreground mb-4">
                {language === 'ar' ? 'روابط مفيدة:' : 'Helpful Links:'}
              </p>
              <div className="flex flex-wrap gap-4 justify-center text-sm">
                <Link to="/" className="text-primary hover:underline">
                  {language === 'ar' ? 'الرئيسية' : 'Home'}
                </Link>
                <Link to="/about" className="text-primary hover:underline">
                  {language === 'ar' ? 'من نحن' : 'About Us'}
                </Link>
                <Link to="/product" className="text-primary hover:underline">
                  {language === 'ar' ? 'المنتجات' : 'Products'}
                </Link>
                <Link to="/order" className="text-primary hover:underline">
                  {language === 'ar' ? 'اطلب الآن' : 'Order Now'}
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default NotFound;
