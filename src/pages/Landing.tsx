import { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '@/hooks/useLanguage';
import { useCurrency } from '@/hooks/useCurrency';
import { useProductPrice } from '@/hooks/useProductPrice';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import LanguageSwitcher from '@/components/LanguageSwitcher';
import CurrencySwitcher from '@/components/CurrencySwitcher';
import { 
  CheckCircle, 
  Shield, 
  Truck, 
  Clock, 
  Star,
  Sparkles,
  Heart,
  Award,
  ArrowRight,
  X
} from 'lucide-react';
import landingDetail1 from '@/assets/landing-detail-1.jpg';
import landingDetail2 from '@/assets/landing-detail-2.jpg';
import landingDetail3 from '@/assets/landing-detail-3.jpg';
import landingDetail4 from '@/assets/landing-detail-4.jpg';

const Landing = () => {
  const { language, t } = useLanguage();
  const { formatPrice } = useCurrency();
  const { price, loading } = useProductPrice();
  const navigate = useNavigate();
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  const handleOrderNow = () => {
    navigate('/order');
  };

  const productName = language === 'ar' ? 'سفن جرين' : 'Seven Green';
  const originalPrice = price * 2;

  return (
    <>
      <Helmet>
        <html lang={language} dir={language === 'ar' ? 'rtl' : 'ltr'} />
        <title>{language === 'ar' 
          ? 'سفن جرين - الحل الطبيعي الأمثل لإنبات الشعر وتكثيفه في 30 يوماً' 
          : 'Seven Green - Natural Hair Growth & Density Solution in 30 Days'}</title>
        <meta name="description" content={language === 'ar'
          ? 'احصل على شعر كثيف وصحي خلال 30 يوماً مع سفن جرين - المنتج الطبيعي 100٪ المعتمد طبياً لإنبات الشعر وعلاج التساقط. ضمان استرجاع المال. شحن مجاني.'
          : 'Get thick, healthy hair in 30 days with Seven Green - 100% natural, medically approved hair growth solution. Money-back guarantee. Free shipping.'} />
        <meta name="keywords" content={language === 'ar'
          ? 'إنبات الشعر, تكثيف الشعر, علاج تساقط الشعر, منتج طبيعي للشعر, سفن جرين'
          : 'hair growth, hair density, hair loss treatment, natural hair product, seven green'} />
        
        {/* Open Graph */}
        <meta property="og:type" content="product" />
        <meta property="og:title" content={language === 'ar' 
          ? 'سفن جرين - الحل الطبيعي لإنبات الشعر' 
          : 'Seven Green - Natural Hair Growth Solution'} />
        <meta property="og:description" content={language === 'ar'
          ? 'شعر كثيف وصحي خلال 30 يوماً. منتج طبيعي معتمد طبياً'
          : 'Thick, healthy hair in 30 days. Medically approved natural product'} />
        <meta property="og:image" content="/lovable-uploads/seven-green-product-email.png" />
        <meta property="og:url" content="https://yourdomain.com/landing" />
        
        {/* Canonical & Alternate */}
        <link rel="canonical" href="https://yourdomain.com/landing" />
        <link rel="alternate" hrefLang="ar" href="https://yourdomain.com/landing?lang=ar" />
        <link rel="alternate" hrefLang="en" href="https://yourdomain.com/landing?lang=en" />
        
        {/* JSON-LD Structured Data */}
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Product",
            "name": productName,
            "description": language === 'ar' 
              ? "منتج طبيعي لإنبات الشعر وتكثيفه"
              : "Natural hair growth and density product",
            "image": "/lovable-uploads/seven-green-product-email.png",
            "brand": {
              "@type": "Brand",
              "name": "Seven Green"
            },
            "offers": {
              "@type": "Offer",
              "price": price,
              "priceCurrency": "SAR",
              "availability": "https://schema.org/InStock",
              "priceValidUntil": "2025-12-31"
            },
            "aggregateRating": {
              "@type": "AggregateRating",
              "ratingValue": "4.9",
              "reviewCount": "2847"
            }
          })}
        </script>
      </Helmet>

      <div className={`min-h-screen bg-gradient-to-b from-primary/5 via-background to-background ${language === 'ar' ? 'rtl' : 'ltr'}`}>
        
        {/* Header */}
        <header className="fixed top-0 left-0 right-0 z-50 bg-background/95 backdrop-blur-md border-b shadow-sm">
          <div className="container mx-auto px-4 py-3 flex items-center justify-between">
            <img 
              src="/lovable-uploads/seven-green-icon.png" 
              alt="Seven Green Logo" 
              className="h-12 w-auto"
            />
            <div className="flex items-center gap-2">
              <LanguageSwitcher />
              <CurrencySwitcher />
            </div>
          </div>
        </header>

        {/* Hero Section */}
        <section className="pt-24 pb-16 px-4 bg-gradient-to-b from-primary/5 to-background" itemScope itemType="https://schema.org/Product">
          <div className="container mx-auto max-w-6xl">
            <div className="text-center mb-8">
              <Badge className="mb-4 text-sm px-4 py-2 bg-gradient-to-r from-destructive to-destructive/80 text-white border-none shadow-lg animate-pulse">
                {language === 'ar' ? '🔥 عرض محدود - خصم 50%' : '🔥 Limited Offer - 50% Off'}
              </Badge>
              
              <h1 className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-primary via-primary/80 to-primary bg-clip-text text-transparent leading-tight" itemProp="name">
                {language === 'ar' 
                  ? 'سفن جرين - شعر كثيف وصحي وقوي' 
                  : 'Seven Green - Thick, Healthy & Strong Hair'}
              </h1>
              
              <p className="text-xl md:text-2xl text-muted-foreground mb-12 max-w-3xl mx-auto" itemProp="description">
                {language === 'ar'
                  ? 'الحل الطبيعي المعتمد طبياً للعناية بالشعر - نتائج مضمونة أو استرجاع كامل للمبلغ'
                  : 'The Medically Approved Natural Hair Care Solution - Results Guaranteed or Full Refund'}
              </p>
            </div>

            {/* Product Section */}
            <div className="mb-12">
              <div className="flex flex-col md:flex-row items-center justify-center gap-4 mb-8">
                <div className="flex items-baseline gap-2">
                  <span className="text-4xl md:text-5xl font-bold text-primary" itemProp="offers" itemScope itemType="https://schema.org/Offer">
                    <span itemProp="price">{formatPrice(price)}</span>
                  </span>
                  <span className="text-2xl text-muted-foreground line-through">
                    {formatPrice(originalPrice)}
                  </span>
                </div>
                <Badge variant="destructive" className="text-sm px-3 py-1">
                  {language === 'ar' ? 'وفّر 50%' : 'Save 50%'}
                </Badge>
              </div>

              <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
                <Button 
                  size="lg" 
                  className="text-lg px-8 py-6 shadow-lg hover:shadow-xl transition-all"
                  onClick={handleOrderNow}
                >
                  {language === 'ar' ? 'اطلب الآن' : 'Order Now'}
                  <ArrowRight className={language === 'ar' ? 'ml-2' : 'mr-2'} />
                </Button>
              </div>

              <div className="flex flex-wrap items-center justify-center gap-6 text-sm text-muted-foreground mb-12">
                <div className="flex items-center gap-2">
                  <Shield className="w-4 h-4 text-primary" />
                  <span>{language === 'ar' ? 'دفع آمن 100%' : '100% Secure Payment'}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-primary" />
                  <span>{language === 'ar' ? 'توصيل 2-4 أيام' : '2-4 Days Delivery'}</span>
                </div>
              </div>
            </div>

            {/* Product Image */}
            <div className="relative max-w-2xl mx-auto">
              <img 
                src="/lovable-uploads/seven-green-product-email.png" 
                alt={language === 'ar' ? 'منتج سفن جرين لإنبات الشعر' : 'Seven Green hair growth product'}
                className="w-full h-auto rounded-2xl shadow-2xl"
                itemProp="image"
              />
            </div>

            {/* Trust Indicators */}
            <div className="mt-12 flex flex-wrap items-center justify-center gap-8 text-sm">
              <div className="flex items-center gap-2">
                <Star className="w-5 h-5 text-yellow-500 fill-yellow-500" />
                <span className="font-semibold">4.9/5</span>
                <span className="text-muted-foreground">{language === 'ar' ? '(2,847 تقييم)' : '(2,847 reviews)'}</span>
              </div>
              <div className="flex items-center gap-2">
                <Shield className="w-5 h-5 text-primary" />
                <span>{language === 'ar' ? 'دفع آمن 100%' : '100% Secure Payment'}</span>
              </div>
              <div className="flex items-center gap-2">
                <Award className="w-5 h-5 text-primary" />
                <span>{language === 'ar' ? 'معتمد طبياً' : 'Medically Approved'}</span>
              </div>
            </div>
          </div>
        </section>

        {/* Problem Section */}
        <section className="py-16 px-4 bg-muted/30">
          <div className="container mx-auto max-w-4xl text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-8">
              {language === 'ar' 
                ? 'هل تعاني من هذه المشاكل؟' 
                : 'Struggling with These Issues?'}
            </h2>
            
            <div className="grid md:grid-cols-2 gap-4 mb-8">
              {[
                language === 'ar' ? 'تساقط الشعر المستمر' : 'Constant hair loss',
                language === 'ar' ? 'شعر خفيف وضعيف' : 'Thin, weak hair',
                language === 'ar' ? 'فراغات في فروة الرأس' : 'Bald spots on scalp',
                language === 'ar' ? 'نمو بطيء للشعر' : 'Slow hair growth'
              ].map((problem, idx) => (
                <Card key={idx} className="p-4 border-destructive/20">
                  <div className="flex items-center gap-3">
                    <X className="w-5 h-5 text-destructive flex-shrink-0" />
                    <span className="text-lg">{problem}</span>
                  </div>
                </Card>
              ))}
            </div>

            <p className="text-xl text-primary font-semibold">
              {language === 'ar' 
                ? '✨ سفن جرين هو الحل الذي كنت تبحث عنه!' 
                : '✨ Seven Green is the solution you\'ve been looking for!'}
            </p>
          </div>
        </section>

        {/* Benefits Section */}
        <section className="py-16 px-4">
          <div className="container mx-auto max-w-6xl">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                {language === 'ar' 
                  ? 'لماذا سفن جرين؟' 
                  : 'Why Seven Green?'}
              </h2>
              <p className="text-xl text-muted-foreground">
                {language === 'ar'
                  ? 'الحل الطبيعي الكامل لشعر صحي وكثيف'
                  : 'The Complete Natural Solution for Healthy, Thick Hair'}
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-6">
              {[
                {
                  icon: Sparkles,
                  titleAr: 'مكونات طبيعية 100%',
                  titleEn: '100% Natural Ingredients',
                  descAr: 'خالٍ من المواد الكيميائية الضارة',
                  descEn: 'Free from harmful chemicals'
                },
                {
                  icon: Award,
                  titleAr: 'معتمد طبياً',
                  titleEn: 'Medically Approved',
                  descAr: 'حاصل على الموافقات الطبية',
                  descEn: 'Has medical approvals'
                },
                {
                  icon: Heart,
                  titleAr: 'نتائج مضمونة',
                  titleEn: 'Guaranteed Results',
                  descAr: 'نتائج ملحوظة خلال 30 يوم',
                  descEn: 'Visible results within 30 days'
                },
                {
                  icon: Shield,
                  titleAr: 'آمن للاستخدام',
                  titleEn: 'Safe to Use',
                  descAr: 'مناسب لجميع أنواع الشعر',
                  descEn: 'Suitable for all hair types'
                },
                {
                  icon: Star,
                  titleAr: 'تقييم 4.9/5',
                  titleEn: 'Rated 4.9/5',
                  descAr: 'من أكثر من 2,847 عميل',
                  descEn: 'From over 2,847 customers'
                },
                {
                  icon: CheckCircle,
                  titleAr: 'ضمان استرجاع',
                  titleEn: 'Money-back Guarantee',
                  descAr: 'استرجاع كامل خلال 30 يوم',
                  descEn: 'Full refund within 30 days'
                }
              ].map((benefit, idx) => (
                <Card key={idx} className="p-6 hover:shadow-lg transition-shadow">
                  <CardContent className="p-0">
                    <benefit.icon className="w-12 h-12 text-primary mb-4 mx-auto" />
                    <h3 className="text-xl font-semibold mb-2 text-center">
                      {language === 'ar' ? benefit.titleAr : benefit.titleEn}
                    </h3>
                    <p className="text-muted-foreground text-center">
                      {language === 'ar' ? benefit.descAr : benefit.descEn}
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Product Details Gallery */}
        <section className="py-0 px-0 bg-background">
          <div className="max-w-4xl mx-auto">
            <div className="flex flex-col gap-0">
              {[landingDetail1, landingDetail2, landingDetail3, landingDetail4].map((image, idx) => (
                <div key={idx} className="w-full">
                  <img 
                    src={image} 
                    alt={language === 'ar' 
                      ? `تفاصيل منتج سفن جرين ${idx + 1}` 
                      : `Seven Green product details ${idx + 1}`}
                    className="w-full h-auto"
                    loading="lazy"
                  />
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Social Proof */}
        <section className="py-16 px-4 bg-muted/30">
          <div className="container mx-auto max-w-4xl text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-12">
              {language === 'ar' 
                ? 'ماذا يقول عملاؤنا؟' 
                : 'What Our Customers Say?'}
            </h2>

            <div className="grid md:grid-cols-2 gap-6">
              {[
                {
                  nameAr: 'فاطمة أ.',
                  nameEn: 'Fatima A.',
                  reviewAr: 'بعد شهر واحد، لاحظت فرقاً كبيراً! شعري أصبح أكثر كثافة وقوة. منتج رائع!',
                  reviewEn: 'After one month, I noticed a huge difference! My hair became thicker and stronger. Amazing product!',
                  rating: 5
                },
                {
                  nameAr: 'محمد س.',
                  nameEn: 'Mohammed S.',
                  reviewAr: 'كنت أعاني من التساقط لسنوات، سفن جرين غيّر حياتي تماماً. أنصح به بشدة!',
                  reviewEn: 'I suffered from hair loss for years, Seven Green completely changed my life. Highly recommend!',
                  rating: 5
                },
                {
                  nameAr: 'نورة م.',
                  nameEn: 'Noura M.',
                  reviewAr: 'منتج طبيعي وفعال. النتائج ظهرت بسرعة والسعر ممتاز!',
                  reviewEn: 'Natural and effective product. Results appeared quickly and the price is excellent!',
                  rating: 5
                },
                {
                  nameAr: 'أحمد ع.',
                  nameEn: 'Ahmed A.',
                  reviewAr: 'استخدمت منتجات كثيرة لكن سفن جرين هو الوحيد الذي أعطاني نتائج حقيقية.',
                  reviewEn: 'I used many products but Seven Green is the only one that gave me real results.',
                  rating: 5
                }
              ].map((testimonial, idx) => (
                <Card key={idx} className="p-6 text-right">
                  <CardContent className="p-0">
                    <div className="flex gap-1 mb-3 justify-end">
                      {[...Array(testimonial.rating)].map((_, i) => (
                        <Star key={i} className="w-5 h-5 fill-primary text-primary" />
                      ))}
                    </div>
                    <p className="text-lg mb-4 italic">
                      "{language === 'ar' ? testimonial.reviewAr : testimonial.reviewEn}"
                    </p>
                    <p className="font-semibold text-primary">
                      - {language === 'ar' ? testimonial.nameAr : testimonial.nameEn}
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-16 px-4 bg-gradient-to-r from-primary/10 via-primary/5 to-primary/10">
          <div className="container mx-auto max-w-4xl text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              {language === 'ar' 
                ? 'احصل على سفن جرين الآن بخصم 50%!' 
                : 'Get Seven Green Now with 50% Off!'}
            </h2>
            
            <div className="flex items-center justify-center gap-4 mb-8">
              <span className="text-5xl font-bold text-primary">
                {formatPrice(price)}
              </span>
              <span className="text-3xl text-muted-foreground line-through">
                {formatPrice(originalPrice)}
              </span>
            </div>

            <Button 
              size="lg" 
              className="text-xl px-12 py-8 shadow-xl hover:shadow-2xl transition-all mb-6"
              onClick={handleOrderNow}
            >
              {language === 'ar' ? 'اطلب الآن' : 'Order Now'}
              <ArrowRight className="mr-2" />
            </Button>

            <div className="flex flex-col items-center gap-3 text-sm text-muted-foreground">
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-primary" />
                <span>{language === 'ar' ? 'ضمان استرجاع المال خلال 30 يوماً' : '30-Day Money-Back Guarantee'}</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-primary" />
                <span>{language === 'ar' ? 'دفع آمن ومضمون' : 'Secure & Guaranteed Payment'}</span>
              </div>
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="py-8 px-4 border-t bg-background">
          <div className="container mx-auto text-center text-sm text-muted-foreground">
            <p>© 2025 Seven Green. {language === 'ar' ? 'جميع الحقوق محفوظة' : 'All rights reserved'}</p>
          </div>
        </footer>

        {/* Fixed Bottom CTA Button */}
        <div className="fixed bottom-0 left-0 right-0 z-50 p-4 bg-gradient-to-t from-background via-background to-transparent pointer-events-none">
          <div className="container mx-auto max-w-4xl pointer-events-auto">
            <Button 
              size="lg" 
              className="w-full text-lg py-6 shadow-2xl hover:shadow-3xl transition-all bg-primary hover:bg-primary/90"
              onClick={handleOrderNow}
            >
              {language === 'ar' ? 'اطلب الآن' : 'Order Now'}
              <ArrowRight className={language === 'ar' ? 'ml-2' : 'mr-2'} />
            </Button>
          </div>
        </div>
      </div>
    </>
  );
};

export default Landing;