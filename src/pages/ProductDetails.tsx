import { useEffect } from "react";
import { Helmet } from "react-helmet";
import { ArrowRight, Leaf, Shield, Star, CheckCircle, ChevronLeft } from "lucide-react";
import { Link } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import OptimizedImage from "@/components/OptimizedImage";

import { useProductPrice } from "@/hooks/useProductPrice";
import { useCurrency } from "@/hooks/useCurrency";
import { useLanguage } from "@/hooks/useLanguage";

const ProductDetails = () => {
  const { language, t } = useLanguage();
  const { formatPrice } = useCurrency();
  const { price, loading } = useProductPrice();
  
  useEffect(() => {
    document.documentElement.lang = language === 'ar' ? 'ar' : 'en';
    document.documentElement.dir = language === 'ar' ? 'rtl' : 'ltr';
  }, [language]);
  
  const title = language === 'ar'
    ? "سفن جرين Seven Green | شامبو وصابونة طبيعية 100% لعلاج تساقط الشعر"
    : "Seven Green | 100% Natural Shampoo & Soap for Hair Loss Treatment";
    
  const description = language === 'ar'
    ? "اكتشف سفن جرين - شامبو وصابونة طبيعية 100% بمكونات كورية مميزة: زيت الأرغان، الجينسنغ، فيتامين E. علاج فعال لتساقط الشعر وتكثيفه مع نتائج مضمونة."
    : "Discover Seven Green - 100% natural shampoo & soap with premium Korean ingredients: Argan Oil, Ginseng, Vitamin E. Effective treatment for hair loss and thickening with guaranteed results.";

  const getIngredients = () => language === 'ar' ? [
    {
      name: "زيت الأرغان الكوري",
      description: "يغذي الشعر ويمنحه لمعاناً طبيعياً ونعومة فائقة",
      benefits: ["ترطيب عميق", "لمعان طبيعي", "حماية من التلف"]
    },
    {
      name: "خلاصة الجينسنغ",
      description: "ينشط الدورة الدموية في فروة الرأس ويحفز نمو الشعر",
      benefits: ["تحفيز النمو", "تقوية الجذور", "منع التساقط"]
    },
    {
      name: "فيتامين E الطبيعي",
      description: "مضاد أكسدة قوي يحمي الشعر من العوامل البيئية الضارة",
      benefits: ["حماية من الأشعة", "مقاومة الجذور الحرة", "تأخير الشيب"]
    },
    {
      name: "زيت جوز الهند البكر",
      description: "يرطب الشعر بعمق ويمنع تكسره ويمنحه ملمساً حريرياً",
      benefits: ["ترطيب مكثف", "منع التكسر", "نعومة حريرية"]
    },
    {
      name: "بروتين الكيراتين النباتي",
      description: "يعيد بناء هيكل الشعر التالف ويقويه من الداخل",
      benefits: ["إعادة البناء", "تقوية الهيكل", "مرونة طبيعية"]
    },
    {
      name: "خلاصة الشاي الأخضر",
      description: "ينظف فروة الرأس ويوازن إفراز الزيوت الطبيعية",
      benefits: ["تنظيف عميق", "توازن الزيوت", "تهدئة الالتهابات"]
    }
  ] : [
    {
      name: "Korean Argan Oil",
      description: "Nourishes hair and gives it natural shine and exceptional softness",
      benefits: ["Deep moisturizing", "Natural shine", "Protection from damage"]
    },
    {
      name: "Ginseng Extract",
      description: "Stimulates blood circulation in the scalp and promotes hair growth",
      benefits: ["Growth stimulation", "Root strengthening", "Prevents hair loss"]
    },
    {
      name: "Natural Vitamin E",
      description: "Powerful antioxidant that protects hair from harmful environmental factors",
      benefits: ["UV protection", "Free radical resistance", "Delays graying"]
    },
    {
      name: "Virgin Coconut Oil",
      description: "Deeply moisturizes hair, prevents breakage and gives it a silky texture",
      benefits: ["Intensive moisturizing", "Prevents breakage", "Silky smoothness"]
    },
    {
      name: "Plant Keratin Protein",
      description: "Rebuilds damaged hair structure and strengthens it from within",
      benefits: ["Structure rebuilding", "Structural strengthening", "Natural flexibility"]
    },
    {
      name: "Green Tea Extract",
      description: "Cleanses the scalp and balances natural oil secretion",
      benefits: ["Deep cleansing", "Oil balance", "Inflammation relief"]
    }
  ];

  const ingredients = getIngredients();

  const getUsageSteps = () => language === 'ar' ? [
    {
      step: 1,
      title: t('usage.step1.title'),
      description: t('usage.step1.desc')
    },
    {
      step: 2,
      title: t('usage.step2.title'),
      description: t('usage.step2.desc')
    },
    {
      step: 3,
      title: t('usage.step3.title'),
      description: t('usage.step3.desc')
    },
    {
      step: 4,
      title: t('usage.step4.title'),
      description: t('usage.step4.desc')
    },
    {
      step: 5,
      title: t('usage.step5.title'),
      description: t('usage.step5.desc')
    }
  ] : [
    {
      step: 1,
      title: t('usage.step1.title'),
      description: t('usage.step1.desc')
    },
    {
      step: 2,
      title: t('usage.step2.title'),
      description: t('usage.step2.desc')
    },
    {
      step: 3,
      title: t('usage.step3.title'),
      description: t('usage.step3.desc')
    },
    {
      step: 4,
      title: t('usage.step4.title'),
      description: t('usage.step4.desc')
    },
    {
      step: 5,
      title: t('usage.step5.title'),
      description: t('usage.step5.desc')
    }
  ];

  const usageSteps = getUsageSteps();

  const getBenefits = () => language === 'ar' ? [
    t('benefits.1'),
    t('benefits.2'),
    t('benefits.3'),
    t('benefits.4'),
    t('benefits.5'),
    t('benefits.6'),
    t('benefits.7'),
    t('benefits.8')
  ] : [
    t('benefits.1'),
    t('benefits.2'),
    t('benefits.3'),
    t('benefits.4'),
    t('benefits.5'),
    t('benefits.6'),
    t('benefits.7'),
    t('benefits.8')
  ];

  const benefits = getBenefits();

  const getCertifications = () => language === 'ar' ? [
    {
      icon: <Leaf className="h-8 w-8" />,
      title: "100% طبيعي",
      description: "مكونات طبيعية خالصة"
    },
    {
      icon: <Shield className="h-8 w-8" />,
      title: "آمن ومُختبر",
      description: "اختبارات سلامة وجودة"
    },
    {
      icon: <Star className="h-8 w-8" />,
      title: "تقييم ممتاز",
      description: "رضا العملاء 98%"
    }
  ] : [
    {
      icon: <Leaf className="h-8 w-8" />,
      title: "100% Natural",
      description: "Pure natural ingredients"
    },
    {
      icon: <Shield className="h-8 w-8" />,
      title: "Safe & Tested",
      description: "Safety and quality tests"
    },
    {
      icon: <Star className="h-8 w-8" />,
      title: "Excellent Rating",
      description: "98% customer satisfaction"
    }
  ];

  const certifications = getCertifications();

  return (
    <>
      <Helmet>
        <title>{title}</title>
        <meta name="description" content={description} />
        <meta name="keywords" content={language === 'ar' 
          ? "سفن جرين, شامبو طبيعي, علاج تساقط الشعر, زيت الأرغان, الجينسنغ, شامبو كوري, صابونة طبيعية, تكثيف الشعر"
          : "Seven Green, natural shampoo, hair loss treatment, argan oil, ginseng, Korean shampoo, natural soap, hair thickening"} />
        
        {/* Open Graph */}
        <meta property="og:title" content={title} />
        <meta property="og:description" content={description} />
        <meta property="og:type" content="product" />
        <meta property="og:url" content="https://sevensgreen.com/product-details" />
        <meta property="og:image" content="https://sevensgreen.com/lovable-uploads/e7fefeeb-a395-4a12-b8a9-4dd8b1099ecb.png" />
        <meta property="og:image:width" content="800" />
        <meta property="og:image:height" content="600" />
        <meta property="og:image:alt" content={language === 'ar' ? "صابونة سفن جرين الطبيعية" : "Seven Green Natural Soap"} />
        <meta property="product:price:amount" content={price?.toString() || "25"} />
        <meta property="product:price:currency" content="AED" />
        
        {/* Twitter Card */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={title} />
        <meta name="twitter:description" content={description} />
        <meta name="twitter:image" content="https://sevensgreen.com/lovable-uploads/e7fefeeb-a395-4a12-b8a9-4dd8b1099ecb.png" />
        
        {/* Canonical */}
        <link rel="canonical" href="https://sevensgreen.com/product-details" />
        
        {/* Alternate Languages */}
        <link rel="alternate" hrefLang="ar" href="https://sevensgreen.com/product-details?lang=ar" />
        <link rel="alternate" hrefLang="en" href="https://sevensgreen.com/product-details?lang=en" />
        <link rel="alternate" hrefLang="x-default" href="https://sevensgreen.com/product-details" />
        
        {/* Product Schema */}
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org/",
            "@type": "Product",
            "name": language === 'ar' ? "سفن جرين Seven Green - شامبو وصابونة طبيعية" : "Seven Green - Natural Shampoo & Soap",
            "description": description,
            "image": "https://sevensgreen.com/lovable-uploads/e7fefeeb-a395-4a12-b8a9-4dd8b1099ecb.png",
            "brand": {
              "@type": "Brand",
              "name": "Seven Green"
            },
            "offers": {
              "@type": "Offer",
              "url": "https://sevensgreen.com/product-details",
              "price": price || "25",
              "priceCurrency": "AED",
              "availability": "https://schema.org/InStock",
              "priceValidUntil": new Date(Date.now() + 90 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
              "itemCondition": "https://schema.org/NewCondition"
            },
            "aggregateRating": {
              "@type": "AggregateRating",
              "ratingValue": "4.8",
              "bestRating": "5",
              "worstRating": "1",
              "ratingCount": "2847",
              "reviewCount": "2847"
            },
            "review": {
              "@type": "Review",
              "reviewRating": {
                "@type": "Rating",
                "ratingValue": "5",
                "bestRating": "5"
              },
              "author": {
                "@type": "Person",
                "name": language === 'ar' ? "عميل موثق" : "Verified Customer"
              },
              "reviewBody": language === 'ar' 
                ? "منتج رائع! لاحظت تحسن كبير في شعري بعد استخدامه" 
                : "Amazing product! Noticed significant improvement in my hair after using it"
            }
          })}
        </script>
        
        {/* Breadcrumb Schema */}
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org/",
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
                "name": language === 'ar' ? "تفاصيل المنتج" : "Product Details",
                "item": "https://sevensgreen.com/product-details"
              }
            ]
          })}
        </script>
      </Helmet>
      
      <div className="min-h-screen bg-gradient-to-br from-background to-background/80" dir={language === 'ar' ? 'rtl' : 'ltr'}>
        {/* Header */}
        <header className="sticky top-0 z-50 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b">
          <nav className="container mx-auto px-4 py-4" aria-label="Main Navigation">
            <div className="flex items-center justify-between">
              <Link 
                to="/" 
                className="flex items-center gap-2 text-primary hover:text-primary/80 transition-colors"
                aria-label={language === 'ar' ? 'العودة للصفحة الرئيسية' : 'Back to Home'}
              >
                <ChevronLeft className="h-5 w-5" aria-hidden="true" />
                <span className="font-medium">{t('product.back')}</span>
              </Link>
              <div className="text-2xl font-bold text-primary">
                {language === 'ar' ? 'سيفن جرين' : 'Seven Green'}
              </div>
            </div>
          </nav>
        </header>

        {/* Hero Section */}
        <section className="container mx-auto px-4 py-12">
          <article className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <div className="space-y-4">
                <Badge variant="secondary" className="text-sm">
                  {t('hero.badge')}
                </Badge>
                <h1 className="text-4xl md:text-5xl font-bold text-foreground leading-tight">
                  {language === 'ar' ? 'سفن جرين Seven Green' : 'Seven Green'}
                  <span className="block text-primary mt-2">{language === 'ar' ? 'شامبو وصابونة طبيعية 100%' : '100% Natural Shampoo & Soap'}</span>
                </h1>
                <p className="text-lg text-muted-foreground leading-relaxed">
                  {t('product.description')}
                </p>
              </div>
              
              <div className="flex items-center gap-2" itemScope itemType="https://schema.org/AggregateRating">
                <meta itemProp="ratingValue" content="4.8" />
                <meta itemProp="bestRating" content="5" />
                <meta itemProp="ratingCount" content="2847" />
                <div className="flex text-yellow-400" role="img" aria-label={language === 'ar' ? '4.8 من 5 نجوم' : '4.8 out of 5 stars'}>
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="h-5 w-5 fill-current" aria-hidden="true" />
                  ))}
                </div>
                <span className="text-muted-foreground">
                  {language === 'ar' ? '(2,847 تقييم)' : '(2,847 reviews)'}
                </span>
              </div>

              <div className="flex items-center gap-4" itemScope itemType="https://schema.org/Offer">
                <meta itemProp="priceCurrency" content="AED" />
                <meta itemProp="price" content={price?.toString() || "25"} />
                <meta itemProp="availability" content="https://schema.org/InStock" />
                <div className="text-3xl font-bold text-primary" itemProp="price">
                  {loading ? "..." : formatPrice(price)}
                </div>
                <Badge variant="destructive" aria-label={language === 'ar' ? 'وفر 40%' : 'Save 40%'}>
                  {language === 'ar' ? 'وفر 40%' : 'Save 40%'}
                </Badge>
              </div>
            </div>

            <figure className="relative">
              <div className="relative rounded-2xl overflow-hidden shadow-2xl">
                <OptimizedImage 
                  src="/lovable-uploads/e7fefeeb-a395-4a12-b8a9-4dd8b1099ecb.png" 
                  alt={language === 'ar' 
                    ? "صابونة سفن جرين الطبيعية المثلثة الأصلية بمكونات كورية طبيعية لعلاج تساقط الشعر وتكثيفه - تحتوي على زيت الأرغان والجينسنغ" 
                    : "Seven Green Original Triangle Natural Soap with Korean natural ingredients for hair loss treatment and thickening - Contains Argan Oil and Ginseng"}
                  className="w-full h-auto"
                  sizes="(max-width: 768px) 100vw, 50vw"
                  priority
                  width={800}
                  height={600}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" aria-hidden="true" />
              </div>
              <div className="absolute -top-4 -right-4 bg-green-500 text-white px-4 py-2 rounded-full font-bold shadow-lg" role="status" aria-label={language === 'ar' ? 'منتج جديد' : 'New product'}>
                {language === 'ar' ? 'جديد!' : 'New!'}
              </div>
            </figure>
          </article>
        </section>

        {/* Certifications */}
        <section className="container mx-auto px-4 py-8" aria-labelledby="certifications-heading">
          <h2 id="certifications-heading" className="sr-only">
            {language === 'ar' ? 'الشهادات والمميزات' : 'Certifications and Features'}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {certifications.map((cert, index) => (
              <Card key={index} className="text-center p-6 border-primary/20">
                <div className="flex justify-center mb-4 text-primary" aria-hidden="true">
                  {cert.icon}
                </div>
                <h3 className="font-bold text-foreground mb-2">{cert.title}</h3>
                <p className="text-sm text-muted-foreground">{cert.description}</p>
              </Card>
            ))}
          </div>
        </section>

        {/* Benefits */}
        <section className="container mx-auto px-4 py-12" aria-labelledby="benefits-heading">
          <Card>
            <CardHeader>
              <CardTitle id="benefits-heading" className="text-2xl text-center" itemProp="description">
                {t('benefits.title')}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="grid grid-cols-1 md:grid-cols-2 gap-4" role="list">
                {benefits.map((benefit, index) => (
                  <li key={index} className="flex items-start gap-3">
                    <CheckCircle className="h-5 w-5 text-green-500 mt-1 flex-shrink-0" aria-hidden="true" />
                    <span className="text-foreground">{benefit}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        </section>

        {/* Ingredients */}
        <section className="container mx-auto px-4 py-12" aria-labelledby="ingredients-heading">
          <header className="text-center mb-12">
            <h2 id="ingredients-heading" className="text-3xl font-bold text-foreground mb-4">
              {t('ingredients.title')}
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              {t('ingredients.description')}
            </p>
          </header>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" role="list">
            {ingredients.map((ingredient, index) => (
              <article key={index} className="hover:shadow-lg transition-shadow" role="listitem">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg text-primary" itemProp="name">
                      {ingredient.name}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <p className="text-muted-foreground text-sm" itemProp="description">
                      {ingredient.description}
                    </p>
                    <div className="space-y-2">
                      <h3 className="font-semibold text-foreground text-sm">
                        {t('ingredients.benefits')}
                      </h3>
                      <ul className="space-y-1" role="list">
                        {ingredient.benefits.map((benefit, benefitIndex) => (
                          <li key={benefitIndex} className="flex items-center gap-2 text-sm">
                            <div className="w-1.5 h-1.5 bg-primary rounded-full" aria-hidden="true" />
                            <span className="text-muted-foreground">{benefit}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </CardContent>
                </Card>
              </article>
            ))}
          </div>
        </section>

        {/* Usage Instructions */}
        <section className="container mx-auto px-4 py-12" aria-labelledby="usage-heading" itemScope itemType="https://schema.org/HowTo">
          <Card>
            <CardHeader>
              <CardTitle id="usage-heading" className="text-2xl text-center" itemProp="name">
                {language === 'ar' ? 'طريقة الاستخدام الصحيحة' : 'Proper Usage Instructions'}
              </CardTitle>
              <p className="text-center text-muted-foreground" itemProp="description">
                {language === 'ar' 
                  ? 'اتبعي هذه الخطوات البسيطة للحصول على أفضل النتائج' 
                  : 'Follow these simple steps for best results'}
              </p>
            </CardHeader>
            <CardContent>
              <ol className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" role="list">
                {usageSteps.map((step) => (
                  <li key={step.step} className="relative" itemProp="step" itemScope itemType="https://schema.org/HowToStep">
                    <meta itemProp="position" content={step.step.toString()} />
                    <div className="flex items-start gap-4">
                      <div className="bg-primary text-primary-foreground w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm flex-shrink-0" aria-hidden="true">
                        {step.step}
                      </div>
                      <div className="space-y-2">
                        <h3 className="font-semibold text-foreground" itemProp="name">
                          {step.title}
                        </h3>
                        <p className="text-sm text-muted-foreground leading-relaxed" itemProp="text">
                          {step.description}
                        </p>
                      </div>
                    </div>
                    {step.step < usageSteps.length && (
                      <div className="hidden lg:block absolute top-4 left-full w-8 h-0.5 bg-border -translate-x-4" aria-hidden="true" />
                    )}
                  </li>
                ))}
              </ol>
            </CardContent>
          </Card>
        </section>

        {/* Buy Now Section */}
        <section className="container mx-auto px-4 py-12" aria-label="Purchase">
        <div className="text-center">
          <Link to="/order">
            <Button 
              size="lg" 
              className="group relative bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 text-white px-12 py-6 text-xl font-bold rounded-full shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 animate-fade-in overflow-hidden"
            >
              {/* Background Animation */}
              <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
              
              {/* Pulse Ring */}
              <div className="absolute inset-0 rounded-full border-2 border-white/30 scale-110 opacity-0 group-hover:opacity-100 group-hover:scale-125 transition-all duration-500"></div>
              
              {/* Button Text */}
              <span className="relative z-10 flex items-center gap-2">
                {t('hero.buy.now')} - {loading ? "..." : formatPrice(price)}
                <ArrowRight className="w-5 h-5 transition-transform duration-300 group-hover:translate-x-1" />
              </span>
            </Button>
          </Link>
          
          {/* Floating Elements */}
          <div className="relative mt-8">
            <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 w-2 h-2 bg-primary rounded-full animate-bounce delay-0"></div>
            <div className="absolute -top-6 left-1/2 transform -translate-x-8 w-1.5 h-1.5 bg-secondary rounded-full animate-bounce delay-150"></div>
            <div className="absolute -top-6 left-1/2 transform translate-x-8 w-1.5 h-1.5 bg-secondary rounded-full animate-bounce delay-300"></div>
          </div>
        </div>
        </section>

        {/* FAQ */}
        <section className="container mx-auto px-4 py-12" aria-label="Frequently Asked Questions">
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl text-center">الأسئلة الشائعة</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-4">
              <div>
                <h3 className="font-semibold text-foreground mb-2">كم مرة يُستخدم Seven Green في الأسبوع؟</h3>
                <p className="text-muted-foreground text-sm">
                  يُنصح باستخدامه 2-3 مرات في الأسبوع للشعر العادي، ويمكن زيادة التكرار للشعر التالف جداً.
                </p>
              </div>
              
              <div>
                <h3 className="font-semibold text-foreground mb-2">متى تظهر النتائج؟</h3>
                <p className="text-muted-foreground text-sm">
                  النتائج الأولى تظهر خلال أسبوعين من الاستخدام المنتظم، والنتائج المكتملة خلال 4-6 أسابيع.
                </p>
              </div>
              
              <div>
                <h3 className="font-semibold text-foreground mb-2">هل المنتج مناسب لجميع أنواع الشعر؟</h3>
                <p className="text-muted-foreground text-sm">
                  نعم، Seven Green مُصمم ليناسب جميع أنواع الشعر: الدهني، الجاف، المختلط، والمصبوغ.
                </p>
              </div>
              
              <div>
                <h3 className="font-semibold text-foreground mb-2">هل يمكن استخدامه مع منتجات أخرى؟</h3>
                <p className="text-muted-foreground text-sm">
                  يمكن دمجه بأمان مع روتين العناية بالشعر الحالي، لكن يُنصح بتجربة بسيطة أولاً.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </section>

      {/* Fixed Buy Button */}
      <div className="fixed bottom-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-sm border-t shadow-lg p-4">
        <div className="container mx-auto">
          <Link to="/order" className="block">
            <Button 
              size="lg" 
              className="w-full bg-yellow-500 hover:bg-yellow-600 text-black font-bold text-lg py-4 rounded-xl shadow-lg transition-all duration-300 hover:shadow-xl"
            >
              {t('hero.buy.now')} - {loading ? "..." : formatPrice(price)}
            </Button>
          </Link>
        </div>
      </div>
      </div>
    </>
  );
};

export default ProductDetails;