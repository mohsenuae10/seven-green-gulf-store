import { ArrowRight, Leaf, Shield, Star, CheckCircle, ChevronLeft } from "lucide-react";
import { Link } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import OrderSection from "@/components/OrderSection";
import { useProductPrice } from "@/hooks/useProductPrice";
import heroImage from "@/assets/seven-green-product-main.jpg";

const ProductDetails = () => {
  const { price, loading } = useProductPrice();

  const ingredients = [
    {
      name: "زيت الأرغان المغربي",
      description: "يغذي الشعر ويمنحه لمعاناً طبيعياً ونعومة فائقة",
      benefits: ["ترطيب عمي", "لمعان طبيعي", "حماية من التلف"]
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
  ];

  const usageSteps = [
    {
      step: 1,
      title: "التحضير",
      description: "اغسلي شعرك بالشامبو المناسب وجففيه بلطف بالمنشفة"
    },
    {
      step: 2,
      title: "التطبيق",
      description: "ضعي كمية مناسبة من Seven Green على راحة يدك ووزعيها على الشعر من الجذور حتى الأطراف"
    },
    {
      step: 3,
      title: "التدليك",
      description: "دلكي فروة الرأس بلطف بحركات دائرية لمدة 2-3 دقائق لتحفيز الدورة الدموية"
    },
    {
      step: 4,
      title: "الانتظار",
      description: "اتركي المنتج على شعرك لمدة 15-20 دقيقة ليتغلغل بعمق في خصلات الشعر"
    },
    {
      step: 5,
      title: "الشطف",
      description: "اشطفي شعرك بالماء الفاتر جيداً حتى إزالة المنتج بالكامل"
    }
  ];

  const benefits = [
    "يقوي الشعر من الجذور حتى الأطراف",
    "يمنع تساقط الشعر بفعالية مثبتة علمياً",
    "يحفز نمو شعر جديد وصحي",
    "يمنح لمعاناً طبيعياً وإشراقاً واضحاً",
    "يرطب الشعر الجاف ويغذيه بعمق",
    "يحمي من تأثير العوامل البيئية الضارة",
    "يقلل من تجعد الشعر ويسهل تصفيفه",
    "آمن للاستخدام اليومي، خالٍ من الكيماويات الضارة"
  ];

  const certifications = [
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
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-background/80">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link to="/" className="flex items-center gap-2 text-primary hover:text-primary/80 transition-colors">
              <ChevronLeft className="h-5 w-5" />
              <span className="font-medium">العودة للصفحة الرئيسية</span>
            </Link>
            <h1 className="text-2xl font-bold text-primary">Seven Green</h1>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-6">
            <div className="space-y-4">
              <Badge variant="secondary" className="text-sm">
                منتج طبيعي 100%
              </Badge>
              <h1 className="text-4xl md:text-5xl font-bold text-foreground leading-tight">
                Seven Green
                <span className="block text-primary">لشعر قوي وصحي</span>
              </h1>
              <p className="text-lg text-muted-foreground leading-relaxed">
                علاج طبيعي متقدم للشعر، مُصمم خصيصاً لتقوية الشعر ومنع تساقطه وتحفيز نموه بمكونات طبيعية خالصة ومختبرة علمياً.
              </p>
            </div>
            
            <div className="flex items-center gap-2">
              <div className="flex text-yellow-400">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="h-5 w-5 fill-current" />
                ))}
              </div>
              <span className="text-muted-foreground">(2,847 تقييم)</span>
            </div>

            <div className="flex items-center gap-4">
              <div className="text-3xl font-bold text-primary">
                {loading ? "..." : `${price} د.إ`}
              </div>
              <Badge variant="destructive">وفر 40%</Badge>
            </div>
          </div>

          <div className="relative">
            <div className="relative rounded-2xl overflow-hidden shadow-2xl">
              <img 
                src={heroImage} 
                alt="Seven Green منتج العناية بالشعر الطبيعي"
                className="w-full h-auto"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
            </div>
            <div className="absolute -top-4 -right-4 bg-green-500 text-white px-4 py-2 rounded-full font-bold shadow-lg">
              جديد!
            </div>
          </div>
        </div>
      </section>

      {/* Certifications */}
      <section className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {certifications.map((cert, index) => (
            <Card key={index} className="text-center p-6 border-primary/20">
              <div className="flex justify-center mb-4 text-primary">
                {cert.icon}
              </div>
              <h3 className="font-bold text-foreground mb-2">{cert.title}</h3>
              <p className="text-sm text-muted-foreground">{cert.description}</p>
            </Card>
          ))}
        </div>
      </section>

      {/* Benefits */}
      <section className="container mx-auto px-4 py-12">
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl text-center">فوائد Seven Green المذهلة</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {benefits.map((benefit, index) => (
                <div key={index} className="flex items-start gap-3">
                  <CheckCircle className="h-5 w-5 text-green-500 mt-1 flex-shrink-0" />
                  <span className="text-foreground">{benefit}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </section>

      {/* Ingredients */}
      <section className="container mx-auto px-4 py-12">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-foreground mb-4">المكونات الطبيعية الفعالة</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            كل مكون مختار بعناية من أجود المصادر الطبيعية لضمان أقصى فائدة لشعرك
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {ingredients.map((ingredient, index) => (
            <Card key={index} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <CardTitle className="text-lg text-primary">{ingredient.name}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-muted-foreground text-sm">{ingredient.description}</p>
                <div className="space-y-2">
                  <h4 className="font-semibold text-foreground text-sm">الفوائد:</h4>
                  <ul className="space-y-1">
                    {ingredient.benefits.map((benefit, benefitIndex) => (
                      <li key={benefitIndex} className="flex items-center gap-2 text-sm">
                        <div className="w-1.5 h-1.5 bg-primary rounded-full" />
                        <span className="text-muted-foreground">{benefit}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Usage Instructions */}
      <section className="container mx-auto px-4 py-12">
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl text-center">طريقة الاستخدام الصحيحة</CardTitle>
            <p className="text-center text-muted-foreground">
              اتبعي هذه الخطوات البسيطة للحصول على أفضل النتائج
            </p>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {usageSteps.map((step) => (
                <div key={step.step} className="relative">
                  <div className="flex items-start gap-4">
                    <div className="bg-primary text-primary-foreground w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm flex-shrink-0">
                      {step.step}
                    </div>
                    <div className="space-y-2">
                      <h3 className="font-semibold text-foreground">{step.title}</h3>
                      <p className="text-sm text-muted-foreground leading-relaxed">{step.description}</p>
                    </div>
                  </div>
                  {step.step < usageSteps.length && (
                    <div className="hidden lg:block absolute top-4 left-full w-8 h-0.5 bg-border -translate-x-4" />
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </section>

      {/* Order Section */}
      <section className="container mx-auto px-4 py-12">
        <OrderSection />
      </section>

      {/* FAQ */}
      <section className="container mx-auto px-4 py-12">
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
    </div>
  );
};

export default ProductDetails;