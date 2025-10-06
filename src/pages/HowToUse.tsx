import { useEffect } from "react";
import { Helmet } from "react-helmet";
import { Link } from "react-router-dom";
import { useLanguage } from "@/hooks/useLanguage";
import MobileNav from "@/components/MobileNav";
import Footer from "@/components/Footer";
import { Card } from "@/components/ui/card";
import { Clock, Droplets, Hand, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

const HowToUse = () => {
  const { language } = useLanguage();
  
  useEffect(() => {
    document.documentElement.lang = language === 'ar' ? 'ar' : 'en';
    document.documentElement.dir = language === 'ar' ? 'rtl' : 'ltr';
  }, [language]);

  const title = language === 'ar' 
    ? "طريقة استخدام سفن جرين | دليل شامل للحصول على أفضل النتائج"
    : "How to Use Seven Green | Complete Guide for Best Results";
    
  const description = language === 'ar'
    ? "دليل شامل خطوة بخطوة لاستخدام صابونة سفن جرين المثلثة. احصلي على أفضل النتائج في علاج تساقط الشعر وتكثيفه خلال 4 أسابيع."
    : "Complete step-by-step guide to use Seven Green Triangle Soap. Get best results in hair loss treatment and thickening within 4 weeks.";

  return (
    <>
      <Helmet>
        <title>{title}</title>
        <meta name="description" content={description} />
        <link rel="canonical" href="https://sevensgreen.com/how-to-use" />
      </Helmet>

      <div className="min-h-screen bg-background">
        <MobileNav />
        
        <main className="container mx-auto px-4 py-8 max-w-4xl">
          <header className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-primary bg-clip-text text-transparent">
              {language === 'ar' ? 'طريقة الاستخدام الصحيحة' : 'Proper Usage Guide'}
            </h1>
          </header>

          <section className="space-y-6 mb-12">
            {[1, 2, 3, 4, 5].map((step) => (
              <Card key={step} className="p-6 border-2 border-primary/20">
                <h3 className="text-2xl font-bold mb-3 text-foreground">
                  {language === 'ar' ? `الخطوة ${step}` : `Step ${step}`}
                </h3>
                <p className="text-muted-foreground">
                  {language === 'ar' 
                    ? 'بللي شعرك بالماء الدافئ واستخدمي الصابونة بحركات دائرية لطيفة'
                    : 'Wet your hair with warm water and use the soap with gentle circular motions'
                  }
                </p>
              </Card>
            ))}
          </section>

          <div className="bg-gradient-to-br from-primary/10 to-secondary/10 rounded-2xl p-8 text-center">
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

export default HowToUse;
