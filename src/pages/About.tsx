import { useEffect } from "react";
import { Helmet } from "react-helmet";
import { Link } from "react-router-dom";
import { useLanguage } from "@/hooks/useLanguage";
import { ChevronRight, Award, Shield, Leaf, Users } from "lucide-react";
import MobileOptimized from "@/components/MobileOptimized";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

const About = () => {
  const { language, t } = useLanguage();

  useEffect(() => {
    document.documentElement.lang = language === 'ar' ? 'ar' : 'en';
    document.documentElement.dir = language === 'ar' ? 'rtl' : 'ltr';
  }, [language]);

  const title = language === 'ar' 
    ? "من نحن | سفن جرين - قصتنا ورؤيتنا"
    : "About Us | Seven Green - Our Story & Vision";
    
  const description = language === 'ar'
    ? "تعرف على قصة سفن جرين، علامة تجارية كورية رائدة في منتجات العناية بالشعر الطبيعية. رؤيتنا، قيمنا، والتزامنا بالجودة."
    : "Learn about Seven Green, a leading Korean brand in natural hair care products. Our vision, values, and commitment to quality.";

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      {
        "@type": "ListItem",
        "position": 1,
        "name": language === 'ar' ? "الرئيسية" : "Home",
        "item": "https://sevensgreen.com"
      },
      {
        "@type": "ListItem",
        "position": 2,
        "name": language === 'ar' ? "من نحن" : "About Us",
        "item": "https://sevensgreen.com/about"
      }
    ]
  };

  const organizationSchema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": "سفن جرين - Seven Green",
    "alternateName": ["سفن جرين", "Seven Green", "سفن قرين", "سيفن جرين"],
    "url": "https://sevensgreen.com",
    "logo": "https://sevensgreen.com/images/seven-green-icon.png",
    "description": language === 'ar'
      ? "سفن جرين هي علامة تجارية كورية رائدة متخصصة في منتجات العناية بالشعر الطبيعية. نقدم حلولاً فعالة لعلاج تساقط الشعر وتكثيفه باستخدام مكونات طبيعية 100%."
      : "Seven Green is a leading Korean brand specializing in natural hair care products. We provide effective solutions for hair loss treatment and thickening using 100% natural ingredients.",
    "foundingDate": "2024",
    "foundingLocation": {
      "@type": "Place",
      "address": {
        "@type": "PostalAddress",
        "addressCountry": "KR",
        "addressRegion": language === 'ar' ? "كوريا الجنوبية" : "South Korea"
      }
    },
    "sameAs": [
      "https://www.snapchat.com/add/sevengreen"
    ]
  };

  const values = [
    {
      icon: Leaf,
      titleAr: "طبيعي 100%",
      titleEn: "100% Natural",
      descAr: "نستخدم فقط المكونات الطبيعية الخالصة من السرو والأوسمان دون أي مواد كيميائية ضارة",
      descEn: "We use only pure natural ingredients from cypress and ottoman without any harmful chemicals"
    },
    {
      icon: Shield,
      titleAr: "معتمد طبياً",
      titleEn: "Medically Certified",
      descAr: "جميع منتجاتنا معتمدة من هيئة الغذاء والدواء السعودية وتخضع لأعلى معايير الجودة",
      descEn: "All our products are certified by Saudi FDA and subject to the highest quality standards"
    },
    {
      icon: Award,
      titleAr: "نتائج مضمونة",
      titleEn: "Guaranteed Results",
      descAr: "نقدم ضمان استرجاع المال لمدة 30 يوماً لثقتنا الكاملة بفعالية منتجاتنا",
      descEn: "We offer a 30-day money-back guarantee for our complete confidence in product effectiveness"
    },
    {
      icon: Users,
      titleAr: "+2800 عميلة سعيدة",
      titleEn: "+2800 Happy Customers",
      descAr: "أكثر من 2800 عميلة حققن نتائج ملحوظة مع منتجات سفن جرين",
      descEn: "More than 2,800 customers achieved remarkable results with Seven Green products"
    }
  ];

  return (
    <>
      <Helmet>
        <title>{title}</title>
        <meta name="description" content={description} />
        <meta property="og:title" content={title} />
        <meta property="og:description" content={description} />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://sevensgreen.com/about" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={title} />
        <meta name="twitter:description" content={description} />
        <link rel="canonical" href="https://sevensgreen.com/about" />
        <link rel="alternate" hrefLang="ar" href="https://sevensgreen.com/about?lang=ar" />
        <link rel="alternate" hrefLang="en" href="https://sevensgreen.com/about?lang=en" />
        <script type="application/ld+json">
          {JSON.stringify(breadcrumbSchema)}
        </script>
        <script type="application/ld+json">
          {JSON.stringify(organizationSchema)}
        </script>
      </Helmet>

      <MobileOptimized className="min-h-screen bg-gradient-subtle">
        {/* Breadcrumb Navigation */}
        <nav className="container mx-auto px-4 py-4" aria-label="breadcrumb">
          <ol className="flex items-center gap-2 text-sm">
            <li>
              <Link to="/" className="text-muted-foreground hover:text-foreground transition-colors">
                {language === 'ar' ? 'الرئيسية' : 'Home'}
              </Link>
            </li>
            <ChevronRight className="w-4 h-4 text-muted-foreground" />
            <li>
              <span className="text-foreground font-medium">
                {language === 'ar' ? 'من نحن' : 'About Us'}
              </span>
            </li>
          </ol>
        </nav>

        <main className="container mx-auto px-4 py-12 max-w-6xl">
          {/* Hero Section */}
          <div className="text-center mb-16">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              {language === 'ar' ? 'من نحن' : 'About Us'}
            </h1>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
              {language === 'ar'
                ? 'سفن جرين هي علامة تجارية كورية رائدة متخصصة في منتجات العناية بالشعر الطبيعية، تأسست برؤية واضحة: توفير حلول فعالة وآمنة لمشاكل الشعر باستخدام مكونات طبيعية 100%.'
                : 'Seven Green is a leading Korean brand specializing in natural hair care products, founded with a clear vision: providing effective and safe solutions for hair problems using 100% natural ingredients.'}
            </p>
          </div>

          {/* Story Section */}
          <Card className="p-8 md:p-12 mb-16">
            <h2 className="text-3xl font-bold mb-6">
              {language === 'ar' ? 'قصتنا' : 'Our Story'}
            </h2>
            <div className="prose prose-lg dark:prose-invert max-w-none">
              {language === 'ar' ? (
                <>
                   <p className="mb-4 leading-relaxed">
                    بدأت رحلة سفن جرين في عام 2020 من قلب كوريا الجنوبية، عندما لاحظنا حاجة ملحة لمنتجات عناية بالشعر طبيعية وفعالة في السوق. كانت معظم المنتجات المتوفرة إما محملة بمواد كيميائية ضارة أو غير فعالة في معالجة مشاكل تساقط الشعر. يمكنك الآن <Link to="/order" className="text-primary hover:underline font-semibold">طلب المنتج الأصلي</Link> بكل سهولة.
                  </p>
                  <p className="mb-4 leading-relaxed">
                    قررنا أن نغير ذلك من خلال تطوير تركيبة فريدة تجمع بين خلاصة السرو والأوسمان الطبيعية، مكونين معروفين بخصائصهما العلاجية لتقوية الشعر ومنع التساقط. بعد سنوات من البحث والتطوير، ولدت صابونة سفن جرين المثلثة الشهيرة.
                  </p>
                  <p className="leading-relaxed">
                    اليوم، نفخر بخدمة أكثر من 2800 عميلة حققن نتائج مذهلة مع منتجاتنا. كل قصة نجاح تحفزنا على الاستمرار في مسيرتنا نحو توفير أفضل حلول العناية بالشعر الطبيعية.
                  </p>
                </>
              ) : (
                <>
                  <p className="mb-4 leading-relaxed">
                    Seven Green's journey began in 2020 from the heart of South Korea, when we noticed an urgent need for natural and effective hair care products in the market. Most available products were either loaded with harmful chemicals or ineffective in treating hair loss problems.
                  </p>
                  <p className="mb-4 leading-relaxed">
                    We decided to change that by developing a unique formula combining natural cypress and ottoman extracts, two ingredients known for their therapeutic properties in strengthening hair and preventing hair loss. After years of research and development, the famous Seven Green Triangle Soap was born.
                  </p>
                  <p className="leading-relaxed">
                    Today, we are proud to serve more than 2,800 customers who have achieved amazing results with our products. Every success story motivates us to continue our journey towards providing the best natural hair care solutions.
                  </p>
                </>
              )}
            </div>
          </Card>

          {/* Values Grid */}
          <div className="mb-16">
            <h2 className="text-3xl font-bold mb-8 text-center">
              {language === 'ar' ? 'قيمنا ومبادئنا' : 'Our Values & Principles'}
            </h2>
            <div className="grid md:grid-cols-2 gap-6">
              {values.map((value, index) => {
                const Icon = value.icon;
                return (
                  <Card key={index} className="p-6 hover:shadow-lg transition-shadow">
                    <div className="flex items-start gap-4">
                      <div className="p-3 rounded-lg bg-primary/10">
                        <Icon className="w-6 h-6 text-primary" />
                      </div>
                      <div>
                        <h3 className="text-xl font-semibold mb-2">
                          {language === 'ar' ? value.titleAr : value.titleEn}
                        </h3>
                        <p className="text-muted-foreground">
                          {language === 'ar' ? value.descAr : value.descEn}
                        </p>
                      </div>
                    </div>
                  </Card>
                );
              })}
            </div>
          </div>

          {/* Mission & Vision */}
          <div className="grid md:grid-cols-2 gap-8 mb-16">
            <Card className="p-8">
              <h2 className="text-2xl font-bold mb-4">
                {language === 'ar' ? 'رؤيتنا' : 'Our Vision'}
              </h2>
              <p className="text-muted-foreground leading-relaxed">
                {language === 'ar'
                  ? 'أن نكون العلامة التجارية الأولى في منطقة الخليج العربي للعناية بالشعر الطبيعي، ونساهم في تحسين جودة حياة ملايين النساء من خلال منتجات طبيعية آمنة وفعالة.'
                  : 'To be the first brand in the Gulf region for natural hair care, and contribute to improving the quality of life for millions of women through safe and effective natural products.'}
              </p>
            </Card>

            <Card className="p-8">
              <h2 className="text-2xl font-bold mb-4">
                {language === 'ar' ? 'رسالتنا' : 'Our Mission'}
              </h2>
              <p className="text-muted-foreground leading-relaxed">
                {language === 'ar'
                  ? 'تطوير وتقديم منتجات عناية بالشعر طبيعية 100% بأعلى معايير الجودة، مع التركيز على حل مشاكل تساقط الشعر وتكثيفه بطرق آمنة ومثبتة علمياً.'
                  : 'Develop and provide 100% natural hair care products with the highest quality standards, focusing on solving hair loss and thickening problems in safe and scientifically proven ways.'}
              </p>
            </Card>
          </div>

          {/* CTA Section */}
          <div className="text-center bg-gradient-primary rounded-2xl p-12">
            <h2 className="text-3xl font-bold mb-4 text-white">
              {language === 'ar' ? 'جربي سفن جرين اليوم' : 'Try Seven Green Today'}
            </h2>
            <p className="text-white/90 mb-8 text-lg max-w-2xl mx-auto">
              {language === 'ar'
                ? 'انضمي إلى آلاف العميلات اللواتي حققن نتائج مذهلة مع صابونة سفن جرين المثلثة'
                : 'Join thousands of customers who achieved amazing results with Seven Green Triangle Soap'}
            </p>
            <Link to="/order">
              <Button size="lg" variant="secondary" className="text-lg px-8 py-6">
                {language === 'ar' ? 'اطلبي الآن' : 'Order Now'}
              </Button>
            </Link>
          </div>
        </main>
      </MobileOptimized>
    </>
  );
};

export default About;
