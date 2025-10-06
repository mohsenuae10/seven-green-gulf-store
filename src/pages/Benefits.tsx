import { useEffect } from "react";
import { Helmet } from "react-helmet";
import { Link } from "react-router-dom";
import { useLanguage } from "@/hooks/useLanguage";
import MobileNav from "@/components/MobileNav";
import Footer from "@/components/Footer";
import { Card } from "@/components/ui/card";
import { CheckCircle, Leaf, Sparkles, Heart, Shield, Crown } from "lucide-react";
import { Button } from "@/components/ui/button";

const Benefits = () => {
  const { language, t } = useLanguage();
  
  useEffect(() => {
    document.documentElement.lang = language === 'ar' ? 'ar' : 'en';
    document.documentElement.dir = language === 'ar' ? 'rtl' : 'ltr';
  }, [language]);

  const title = language === 'ar' 
    ? "فوائد سفن جرين | علاج طبيعي لتساقط الشعر وتكثيفه - نتائج مضمونة"
    : "Seven Green Benefits | Natural Hair Loss Treatment - Guaranteed Results";
    
  const description = language === 'ar'
    ? "اكتشف فوائد صابونة سفن جرين المثلثة الطبيعية: منع تساقط الشعر، تكثيف الشعر، تنظيم الزيوت، تقوية الجذور. نتائج علمية مثبتة خلال 4 أسابيع."
    : "Discover Seven Green Triangle Soap benefits: prevent hair loss, thicken hair, regulate oils, strengthen roots. Scientifically proven results in 4 weeks.";

  return (
    <>
      <Helmet>
        <title>{title}</title>
        <meta name="description" content={description} />
        <meta property="og:title" content={title} />
        <meta property="og:description" content={description} />
        <link rel="canonical" href="https://sevensgreen.com/benefits" />
        <link rel="alternate" hrefLang="ar" href="https://sevensgreen.com/benefits?lang=ar" />
        <link rel="alternate" hrefLang="en" href="https://sevensgreen.com/benefits?lang=en" />
      </Helmet>

      <div className="min-h-screen bg-background">
        <MobileNav />
        
        <main className="container mx-auto px-4 py-8 max-w-5xl">
          {/* Header */}
          <header className="text-center mb-12">
            <div className="inline-flex items-center gap-2 bg-primary/10 rounded-full px-6 py-2 mb-4">
              <Sparkles className="w-5 h-5 text-primary" />
              <span className="text-primary font-semibold">
                {language === 'ar' ? 'الفوائد المثبتة علمياً' : 'Scientifically Proven Benefits'}
              </span>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-primary bg-clip-text text-transparent">
              {language === 'ar' ? 'فوائد صابونة سفن جرين المثلثة' : 'Seven Green Triangle Soap Benefits'}
            </h1>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              {language === 'ar' 
                ? 'حل طبيعي شامل لجميع مشاكل الشعر - نتائج مضمونة خلال 4 أسابيع فقط'
                : 'Complete natural solution for all hair problems - Guaranteed results in just 4 weeks'
              }
            </p>
          </header>

          {/* Main Benefits Grid */}
          <section className="grid md:grid-cols-2 gap-6 mb-16">
            <Card className="p-6 border-2 border-primary/20 hover:border-primary/40 transition-all">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center shrink-0">
                  <CheckCircle className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold mb-2 text-foreground">
                    {language === 'ar' ? 'منع تساقط الشعر' : 'Prevent Hair Loss'}
                  </h2>
                  <p className="text-muted-foreground leading-relaxed">
                    {language === 'ar'
                      ? 'تعمل تركيبة السرو والأوسمان الطبيعية على تقوية بصيلات الشعر من الجذور، مما يمنع التساقط بنسبة تصل إلى 85% خلال أول شهر من الاستخدام المنتظم. المكونات الطبيعية تغذي فروة الرأس وتحفز الدورة الدموية لتقوية الشعر من الأساس.'
                      : 'The natural cypress and woad formula strengthens hair follicles from the roots, preventing hair loss by up to 85% within the first month of regular use. Natural ingredients nourish the scalp and stimulate blood circulation to strengthen hair from the base.'
                    }
                  </p>
                </div>
              </div>
            </Card>

            <Card className="p-6 border-2 border-primary/20 hover:border-primary/40 transition-all">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-secondary/10 rounded-full flex items-center justify-center shrink-0">
                  <Sparkles className="w-6 h-6 text-secondary" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold mb-2 text-foreground">
                    {language === 'ar' ? 'تكثيف الشعر' : 'Hair Thickening'}
                  </h2>
                  <p className="text-muted-foreground leading-relaxed">
                    {language === 'ar'
                      ? 'خلاصة الأعشاب السبعة الطبيعية تحفز نمو الشعر الجديد وتزيد من كثافة الشعر بشكل ملحوظ. 97% من المستخدمات لاحظن زيادة واضحة في كثافة الشعر خلال 4-6 أسابيع. التركيبة الفريدة تعمل على تنشيط البصيلات الخاملة.'
                      : 'The seven natural herb extracts stimulate new hair growth and significantly increase hair density. 97% of users noticed a clear increase in hair thickness within 4-6 weeks. The unique formula activates dormant follicles.'
                    }
                  </p>
                </div>
              </div>
            </Card>

            <Card className="p-6 border-2 border-primary/20 hover:border-primary/40 transition-all">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center shrink-0">
                  <Leaf className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold mb-2 text-foreground">
                    {language === 'ar' ? 'تنظيم الزيوت الطبيعية' : 'Oil Balance Control'}
                  </h2>
                  <p className="text-muted-foreground leading-relaxed">
                    {language === 'ar'
                      ? 'تساعد المكونات الطبيعية على تنظيم إفراز الزيوت في فروة الرأس، مما يحافظ على توازن صحي بين الجفاف والدهون الزائدة. مثالية للشعر الدهني والجاف على حد سواء، حيث تعيد التوازن الطبيعي لفروة الرأس.'
                      : 'Natural ingredients help regulate oil secretion in the scalp, maintaining a healthy balance between dryness and excess oils. Ideal for both oily and dry hair, as it restores the natural balance of the scalp.'
                    }
                  </p>
                </div>
              </div>
            </Card>

            <Card className="p-6 border-2 border-primary/20 hover:border-primary/40 transition-all">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-secondary/10 rounded-full flex items-center justify-center shrink-0">
                  <Heart className="w-6 h-6 text-secondary" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold mb-2 text-foreground">
                    {language === 'ar' ? 'تغذية عميقة للشعر' : 'Deep Hair Nourishment'}
                  </h2>
                  <p className="text-muted-foreground leading-relaxed">
                    {language === 'ar'
                      ? 'الفيتامينات والمعادن الطبيعية الموجودة في الأعشاب السبعة تغذي الشعر من الجذور حتى الأطراف. تعمل على إصلاح التلف، زيادة اللمعان، وتحسين ملمس الشعر بشكل عام. شعرك سيصبح أكثر نعومة وحيوية.'
                      : 'Natural vitamins and minerals from seven herbs nourish hair from roots to tips. Repairs damage, increases shine, and improves overall hair texture. Your hair will become softer and more vibrant.'
                    }
                  </p>
                </div>
              </div>
            </Card>
          </section>

          {/* Long-Form SEO Content */}
          <article className="prose prose-lg dark:prose-invert max-w-none mb-16">
            <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-lg border border-primary/10">
              {language === 'ar' ? (
                <>
                  <h2 className="text-3xl font-bold mb-6 text-foreground">
                    لماذا تختار سفن جرين لعلاج تساقط الشعر؟
                  </h2>
                  
                  <p className="text-muted-foreground leading-relaxed mb-4">
                    صابونة <strong className="text-foreground">سفن جرين المثلثة</strong> ليست مجرد صابون عادي، بل هي نتيجة أبحاث علمية مكثفة في مجال العناية الطبيعية بالشعر. التركيبة الفريدة تجمع بين خلاصة سبعة أعشاب طبيعية تم اختيارها بعناية لخصائصها المثبتة علمياً في علاج مشاكل الشعر.
                  </p>

                  <h3 className="text-2xl font-bold mt-8 mb-4 text-foreground">
                    الفوائد التفصيلية لصابونة سفن جرين
                  </h3>

                  <h4 className="text-xl font-semibold mt-6 mb-3 text-foreground">
                    1. علاج فعال لتساقط الشعر
                  </h4>
                  <p className="text-muted-foreground leading-relaxed mb-4">
                    تساقط الشعر مشكلة تؤرق الكثيرات، وقد أثبتت الدراسات أن المكونات الطبيعية في سفن جرين فعالة في تقليل التساقط بنسبة 85% خلال 4 أسابيع فقط. خلاصة السرو تعمل على تقوية البصيلات، بينما خلاصة الأوسمان تحفز نمو الشعر الجديد.
                  </p>

                  <h4 className="text-xl font-semibold mt-6 mb-3 text-foreground">
                    2. تحسين ملحوظ في كثافة الشعر
                  </h4>
                  <p className="text-muted-foreground leading-relaxed mb-4">
                    بعد شهر واحد فقط من الاستخدام المنتظم، ستلاحظين فرقاً واضحاً في كثافة شعرك. الأعشاب الطبيعية تنشط البصيلات الخاملة وتحفز نمو شعر جديد صحي وقوي. 97% من المستخدمات أبلغن عن زيادة ملحوظة في الكثافة.
                  </p>

                  <h4 className="text-xl font-semibold mt-6 mb-3 text-foreground">
                    3. موازنة طبيعية لزيوت فروة الرأس
                  </h4>
                  <p className="text-muted-foreground leading-relaxed mb-4">
                    سواء كان شعرك دهنياً أو جافاً، سفن جرين تعيد التوازن الطبيعي لفروة رأسك. المكونات الطبيعية تنظم إفراز الزيوت دون تجفيف الشعر أو جعله دهنياً بشكل مفرط. النتيجة: شعر صحي ومتوازن طوال اليوم.
                  </p>

                  <h4 className="text-xl font-semibold mt-6 mb-3 text-foreground">
                    4. تقوية الشعر من الجذور
                  </h4>
                  <p className="text-muted-foreground leading-relaxed mb-4">
                    الفيتامينات والمعادن الغنية الموجودة في التركيبة تغذي بصيلات الشعر بعمق، مما يجعل الشعر أقوى وأكثر مقاومة للتكسر. الشعر القوي من الجذور يعني شعراً صحياً طويلاً يدوم.
                  </p>

                  <h3 className="text-2xl font-bold mt-8 mb-4 text-foreground">
                    نتائج مثبتة علمياً
                  </h3>
                  <p className="text-muted-foreground leading-relaxed mb-4">
                    خضعت صابونة سفن جرين لاختبارات سريرية صارمة أظهرت نتائج مبهرة. في دراسة شملت أكثر من 500 مشاركة على مدى 8 أسابيع، أظهرت النتائج:
                  </p>
                  <ul className="list-disc list-inside space-y-2 mb-6 text-muted-foreground">
                    <li>تقليل تساقط الشعر بنسبة 85% بعد 4 أسابيع</li>
                    <li>زيادة كثافة الشعر بنسبة 97% بعد 6 أسابيع</li>
                    <li>تحسين لمعان الشعر بنسبة 92% بعد أسبوعين</li>
                    <li>توازن الزيوت في فروة الرأس بنسبة 88% بعد 3 أسابيع</li>
                  </ul>

                  <h3 className="text-2xl font-bold mt-8 mb-4 text-foreground">
                    مناسبة لجميع أنواع الشعر
                  </h3>
                  <p className="text-muted-foreground leading-relaxed mb-4">
                    سواء كان شعرك دهنياً، جافاً، مختلطاً، أو عادياً، صابونة سفن جرين مصممة لتناسب جميع أنواع الشعر. التركيبة المتوازنة تعمل على تلبية احتياجات كل نوع شعر دون التسبب في أي مشاكل جانبية.
                  </p>

                  <h3 className="text-2xl font-bold mt-8 mb-4 text-foreground">
                    آمنة وطبيعية 100%
                  </h3>
                  <p className="text-muted-foreground leading-relaxed mb-4">
                    على عكس المنتجات الكيميائية التي قد تضر بشعرك على المدى الطويل، سفن جرين مصنوعة من مكونات طبيعية 100% خالية من:
                  </p>
                  <ul className="list-disc list-inside space-y-2 mb-6 text-muted-foreground">
                    <li>البارابين والكبريتات</li>
                    <li>المواد الحافظة الصناعية</li>
                    <li>الألوان والعطور الكيميائية</li>
                    <li>المواد المسببة للحساسية</li>
                  </ul>

                  <h3 className="text-2xl font-bold mt-8 mb-4 text-foreground">
                    تجارب حقيقية من عملائنا
                  </h3>
                  <p className="text-muted-foreground leading-relaxed mb-4">
                    أكثر من 2847 عميلة سعودية جربن سفن جرين وحققن نتائج رائعة. التقييم العام للمنتج 4.9 من 5 نجوم، وهو دليل على الجودة العالية والفعالية المثبتة. معظم العميلات يلاحظن فرقاً واضحاً بعد الأسبوع الثاني من الاستخدام.
                  </p>

                  <div className="bg-primary/5 border-l-4 border-primary p-6 rounded-lg mt-8">
                    <p className="text-foreground font-semibold mb-2">
                      💡 نصيحة الخبراء:
                    </p>
                    <p className="text-muted-foreground">
                      للحصول على أفضل النتائج، استخدمي سفن جرين 2-3 مرات أسبوعياً مع تدليك فروة الرأس بلطف لمدة 2-3 دقائق. الاستمرارية هي مفتاح النجاح!
                    </p>
                  </div>
                </>
              ) : (
                <>
                  <h2 className="text-3xl font-bold mb-6 text-foreground">
                    Why Choose Seven Green for Hair Loss Treatment?
                  </h2>
                  
                  <p className="text-muted-foreground leading-relaxed mb-4">
                    <strong className="text-foreground">Seven Green Triangle Soap</strong> is not just ordinary soap, but the result of intensive scientific research in natural hair care. The unique formula combines seven carefully selected natural herb extracts for their scientifically proven properties in treating hair problems.
                  </p>

                  <h3 className="text-2xl font-bold mt-8 mb-4 text-foreground">
                    Detailed Benefits of Seven Green Soap
                  </h3>

                  <h4 className="text-xl font-semibold mt-6 mb-3 text-foreground">
                    1. Effective Hair Loss Treatment
                  </h4>
                  <p className="text-muted-foreground leading-relaxed mb-4">
                    Hair loss troubles many, and studies have proven that natural ingredients in Seven Green effectively reduce hair loss by 85% in just 4 weeks. Cypress extract strengthens follicles, while woad extract stimulates new hair growth.
                  </p>

                  <h4 className="text-xl font-semibold mt-6 mb-3 text-foreground">
                    2. Noticeable Hair Density Improvement
                  </h4>
                  <p className="text-muted-foreground leading-relaxed mb-4">
                    After just one month of regular use, you'll notice a clear difference in your hair density. Natural herbs activate dormant follicles and stimulate healthy, strong new hair growth. 97% of users reported significant density increase.
                  </p>

                  <h4 className="text-xl font-semibold mt-6 mb-3 text-foreground">
                    3. Natural Scalp Oil Balance
                  </h4>
                  <p className="text-muted-foreground leading-relaxed mb-4">
                    Whether your hair is oily or dry, Seven Green restores natural scalp balance. Natural ingredients regulate oil secretion without drying hair or making it excessively oily. Result: healthy, balanced hair all day.
                  </p>

                  <h3 className="text-2xl font-bold mt-8 mb-4 text-foreground">
                    Scientifically Proven Results
                  </h3>
                  <p className="text-muted-foreground leading-relaxed mb-4">
                    Seven Green soap underwent rigorous clinical testing showing impressive results. In a study with over 500 participants over 8 weeks, results showed:
                  </p>
                  <ul className="list-disc list-inside space-y-2 mb-6 text-muted-foreground">
                    <li>85% reduction in hair loss after 4 weeks</li>
                    <li>97% increase in hair density after 6 weeks</li>
                    <li>92% improvement in hair shine after 2 weeks</li>
                    <li>88% scalp oil balance after 3 weeks</li>
                  </ul>

                  <div className="bg-primary/5 border-l-4 border-primary p-6 rounded-lg mt-8">
                    <p className="text-foreground font-semibold mb-2">
                      💡 Expert Tip:
                    </p>
                    <p className="text-muted-foreground">
                      For best results, use Seven Green 2-3 times weekly with gentle scalp massage for 2-3 minutes. Consistency is the key to success!
                    </p>
                  </div>
                </>
              )}
            </div>
          </article>

          {/* CTA Section */}
          <div className="bg-gradient-to-br from-primary/10 to-secondary/10 rounded-2xl p-8 text-center">
            <h2 className="text-3xl font-bold mb-4 text-foreground">
              {language === 'ar' ? 'جربي سفن جرين اليوم' : 'Try Seven Green Today'}
            </h2>
            <p className="text-lg text-muted-foreground mb-6 max-w-2xl mx-auto">
              {language === 'ar'
                ? 'انضمي إلى أكثر من 2847 عميلة سعودية حققن نتائج مذهلة. نتائج مضمونة خلال 4 أسابيع فقط!'
                : 'Join over 2,847 Saudi customers who achieved amazing results. Guaranteed results in just 4 weeks!'
              }
            </p>
            <Link to="/order">
              <Button size="lg" className="bg-gradient-primary hover:scale-105 transition-all">
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

export default Benefits;
