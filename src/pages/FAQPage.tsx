import { useEffect } from "react";
import { Helmet } from "react-helmet";
import { useLanguage } from "@/hooks/useLanguage";
import Header from "@/components/Header";
import MobileNav from "@/components/MobileNav";
import Footer from "@/components/Footer";
import FAQ from "@/components/FAQ";

const FAQPage = () => {
  const { language } = useLanguage();
  
  useEffect(() => {
    document.documentElement.lang = language === 'ar' ? 'ar' : 'en';
    document.documentElement.dir = language === 'ar' ? 'rtl' : 'ltr';
  }, [language]);

  const faqPageSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": [
      {
        "@type": "Question",
        "name": language === 'ar' ? "ما هي فوائد سفن جرين للشعر؟" : "What are the benefits of Seven Green for hair?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": language === 'ar' 
            ? "سفن جرين منتج طبيعي 100% يساعد على علاج تساقط الشعر، تكثيف الشعر، تقوية بصيلات الشعر، وتحسين صحة فروة الرأس. يحتوي على مكونات طبيعية من أوراق السرو ونبات الأوسمان."
            : "Seven Green is a 100% natural product that helps treat hair loss, thicken hair, strengthen hair follicles, and improve scalp health. Contains natural ingredients from cypress leaves and rosemary plant."
        }
      },
      {
        "@type": "Question",
        "name": language === 'ar' ? "كم المدة اللازمة لظهور النتائج؟" : "How long does it take to see results?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": language === 'ar'
            ? "النتائج تبدأ بالظهور خلال 2-4 أسابيع من الاستخدام المنتظم. للحصول على أفضل النتائج، يُنصح بالاستخدام المستمر لمدة 3 أشهر."
            : "Results start to appear within 2-4 weeks of regular use. For best results, continuous use for 3 months is recommended."
        }
      },
      {
        "@type": "Question",
        "name": language === 'ar' ? "هل المنتج آمن للاستخدام اليومي؟" : "Is the product safe for daily use?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": language === 'ar'
            ? "نعم، سفن جرين آمن تماماً للاستخدام اليومي. جميع المكونات طبيعية 100% وخالية من المواد الكيميائية الضارة."
            : "Yes, Seven Green is completely safe for daily use. All ingredients are 100% natural and free from harmful chemicals."
        }
      },
      {
        "@type": "Question",
        "name": language === 'ar' ? "ما هو سعر المنتج؟" : "What is the product price?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": language === 'ar'
            ? "سعر سفن جرين 71 ريال سعودي مع شحن مجاني."
            : "Seven Green price is 71 SAR with free shipping."
        }
      },
      {
        "@type": "Question",
        "name": language === 'ar' ? "هل يوجد ضمان على المنتج؟" : "Is there a product guarantee?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": language === 'ar'
            ? "نعم، نقدم ضمان استرجاع المبلغ خلال 30 يوم إذا لم تكن راضياً عن النتائج."
            : "Yes, we offer a 30-day money-back guarantee if you are not satisfied with the results."
        }
      }
    ]
  };

  return (
    <>
      <Helmet>
        <title>{language === 'ar' ? 'الأسئلة الشائعة | سفن جرين 🌿' : 'FAQ | Seven Green 🌿'}</title>
        <meta name="description" content={language === 'ar' 
          ? "الأسئلة الشائعة حول سفن جرين - كل ما تريد معرفته عن الصابونة الطبيعية لعلاج تساقط الشعر | فوائد، استخدام، سعر، ضمان"
          : "Frequently Asked Questions about Seven Green - Everything you need to know about the natural soap for hair loss treatment | Benefits, usage, price, guarantee"} />
        <meta property="og:title" content={language === 'ar' ? 'الأسئلة الشائعة | سفن جرين' : 'FAQ | Seven Green'} />
        <meta property="og:description" content={language === 'ar' 
          ? "الأسئلة الشائعة حول سفن جرين - كل ما تريد معرفته عن الصابونة الطبيعية لعلاج تساقط الشعر"
          : "Frequently Asked Questions about Seven Green - Everything you need to know about the natural soap for hair loss treatment"} />
        <meta property="og:type" content="website" />
        <meta name="twitter:card" content="summary" />
        <meta name="twitter:title" content={language === 'ar' ? 'الأسئلة الشائعة | سفن جرين' : 'FAQ | Seven Green'} />
        <meta name="twitter:description" content={language === 'ar' 
          ? "الأسئلة الشائعة حول سفن جرين - كل ما تريد معرفته عن الصابونة الطبيعية لعلاج تساقط الشعر"
          : "Frequently Asked Questions about Seven Green - Everything you need to know about the natural soap for hair loss treatment"} />
        <link rel="canonical" href="https://sevensgreen.com/faq" />
        <link rel="alternate" hrefLang="ar" href="https://sevensgreen.com/faq?lang=ar" />
        <link rel="alternate" hrefLang="en" href="https://sevensgreen.com/faq?lang=en" />
        <script type="application/ld+json">
          {JSON.stringify(faqPageSchema)}
        </script>
      </Helmet>

      <div className="min-h-screen bg-background">
        <Header />
        <MobileNav />
        <FAQ />
        <Footer />
      </div>
    </>
  );
};

export default FAQPage;
