import { useEffect } from "react";
import { Helmet } from "react-helmet";
import { Link } from "react-router-dom";
import { useLanguage } from "@/hooks/useLanguage";
import Header from "@/components/Header";
import MobileNav from "@/components/MobileNav";
import Footer from "@/components/Footer";
import { Card } from "@/components/ui/card";
import { Leaf, Sparkles, CheckCircle, Droplet } from "lucide-react";
import { Button } from "@/components/ui/button";

const Ingredients = () => {
  const { language } = useLanguage();
  
  useEffect(() => {
    document.documentElement.lang = language === 'ar' ? 'ar' : 'en';
    document.documentElement.dir = language === 'ar' ? 'rtl' : 'ltr';
  }, [language]);

  const title = language === 'ar' 
    ? "مكونات سفن جرين الطبيعية | السرو والأوسمان والأعشاب السبعة"
    : "Seven Green Natural Ingredients | Cypress, Woad & Seven Herbs";
    
  const description = language === 'ar'
    ? "تعرف على المكونات الطبيعية 100% في صابونة سفن جرين: خلاصة السرو، الأوسمان، والأعشاب السبعة المختارة بعناية لعلاج تساقط الشعر وتكثيفه."
    : "Discover 100% natural ingredients in Seven Green soap: cypress extract, woad, and seven carefully selected herbs for hair loss treatment and thickening.";

  const ingredients = language === 'ar' ? [
    {
      name: "خلاصة السرو",
      scientificName: "Cupressus sempervirens",
      icon: Leaf,
      benefits: [
        "تقوية بصيلات الشعر من الجذور",
        "منع تساقط الشعر بفعالية",
        "تحفيز الدورة الدموية في فروة الرأس",
        "خصائص مضادة للأكسدة قوية"
      ],
      description: "السرو شجرة معمرة معروفة منذ القدم بخصائصها العلاجية للشعر. خلاصة السرو غنية بالبوليفينول والفلافونويدات التي تعمل على تقوية جذور الشعر وتحفيز نموه. أثبتت الدراسات العلمية أن السرو يحتوي على مركبات طبيعية تمنع هرمون DHT المسؤول عن تساقط الشعر."
    },
    {
      name: "خلاصة الأوسمان (الوسمة)",
      scientificName: "Isatis tinctoria",
      icon: Sparkles,
      benefits: [
        "تحفيز نمو الشعر الجديد",
        "تنظيم إفراز الزيوت الطبيعية",
        "تقوية لون الشعر الطبيعي",
        "خصائص مضادة للالتهابات"
      ],
      description: "الوسمة نبات طبيعي استخدم لقرون في الطب التقليدي لعلاج مشاكل الشعر. غني بالإنديكان والفيتامينات التي تغذي فروة الرأس وتحفز البصيلات الخاملة. يساعد على استعادة التوازن الطبيعي لفروة الرأس ويمنح الشعر مظهراً صحياً ولامعاً."
    },
    {
      name: "زيت الزيتون الطبيعي",
      scientificName: "Olea europaea",
      icon: Droplet,
      benefits: [
        "ترطيب عميق للشعر وفروة الرأس",
        "حماية الشعر من التلف",
        "تحسين مرونة الشعر",
        "غني بفيتامين E والأحماض الدهنية"
      ],
      description: "زيت الزيتون البكر الممتاز يحتوي على فيتامين E ومضادات الأكسدة التي تحمي الشعر من العوامل البيئية الضارة. يخترق جذع الشعرة ليوفر ترطيباً عميقاً ويقوي الشعر من الداخل، مما يجعله أكثر مقاومة للتكسر والتقصف."
    },
    {
      name: "خلاصة إكليل الجبل",
      scientificName: "Rosmarinus officinalis",
      icon: Leaf,
      benefits: [
        "تحفيز نمو الشعر",
        "تحسين الدورة الدموية",
        "خصائص مضادة للبكتيريا",
        "منع قشرة الرأس"
      ],
      description: "إكليل الجبل عشبة متوسطية معروفة بفوائدها المذهلة للشعر. يحتوي على حمض الكارنوسيك الذي يحفز نمو الشعر ويمنع الشيب المبكر. أثبتت الدراسات أن فعاليته تضاهي المينوكسيديل في تحفيز نمو الشعر."
    },
    {
      name: "خلاصة الصبار",
      scientificName: "Aloe vera",
      icon: Droplet,
      benefits: [
        "ترطيب فائق للشعر",
        "تهدئة فروة الرأس المتهيجة",
        "إصلاح الشعر التالف",
        "تقوية مناعة فروة الرأس"
      ],
      description: "الصبار معروف منذ آلاف السنين كعلاج طبيعي للشعر والبشرة. يحتوي على أكثر من 75 مادة مغذية نشطة بما في ذلك الفيتامينات والمعادن والأحماض الأمينية. يعمل على إصلاح الشعر التالف من الجذور وحتى الأطراف."
    },
    {
      name: "خلاصة الحناء",
      scientificName: "Lawsonia inermis",
      icon: Sparkles,
      benefits: [
        "تقوية بنية الشعر",
        "حماية من الحرارة والشمس",
        "إضافة لمعان طبيعي",
        "تحسين ملمس الشعر"
      ],
      description: "الحناء نبات طبيعي يستخدم منذ قرون لتقوية الشعر وتحسين مظهره. تحتوي على التانينات والفيتامينات التي تغلف الشعر بطبقة واقية طبيعية، مما يمنع التلف ويحسن اللمعان دون تغيير لون الشعر."
    },
    {
      name: "خلاصة الميرمية",
      scientificName: "Salvia officinalis",
      icon: Leaf,
      benefits: [
        "تنظيم إفراز الدهون",
        "تنظيف فروة الرأس بعمق",
        "خصائص مطهرة طبيعية",
        "تحسين صحة فروة الرأس"
      ],
      description: "الميرمية عشبة طبية غنية بمضادات الأكسدة والمركبات المضادة للبكتيريا. تساعد على تنظيف فروة الرأس من السموم والشوائب، وتنظم إفراز الزيوت الطبيعية، مما يحافظ على شعر نظيف وصحي لفترة أطول."
    }
  ] : [
    {
      name: "Cypress Extract",
      scientificName: "Cupressus sempervirens",
      icon: Leaf,
      benefits: [
        "Strengthens hair follicles from roots",
        "Effectively prevents hair loss",
        "Stimulates scalp blood circulation",
        "Powerful antioxidant properties"
      ],
      description: "Cypress is a perennial tree known since ancient times for its therapeutic hair properties. Cypress extract is rich in polyphenols and flavonoids that strengthen hair roots and stimulate growth. Scientific studies have proven that cypress contains natural compounds that block DHT hormone responsible for hair loss."
    },
    {
      name: "Woad Extract",
      scientificName: "Isatis tinctoria",
      icon: Sparkles,
      benefits: [
        "Stimulates new hair growth",
        "Regulates natural oil secretion",
        "Strengthens natural hair color",
        "Anti-inflammatory properties"
      ],
      description: "Woad is a natural plant used for centuries in traditional medicine to treat hair problems. Rich in indican and vitamins that nourish the scalp and stimulate dormant follicles. Helps restore natural scalp balance and gives hair a healthy, shiny appearance."
    },
    {
      name: "Natural Olive Oil",
      scientificName: "Olea europaea",
      icon: Droplet,
      benefits: [
        "Deep moisture for hair and scalp",
        "Protects hair from damage",
        "Improves hair elasticity",
        "Rich in vitamin E and fatty acids"
      ],
      description: "Extra virgin olive oil contains vitamin E and antioxidants that protect hair from harmful environmental factors. Penetrates the hair shaft to provide deep hydration and strengthens hair from within, making it more resistant to breakage."
    },
    {
      name: "Rosemary Extract",
      scientificName: "Rosmarinus officinalis",
      icon: Leaf,
      benefits: [
        "Stimulates hair growth",
        "Improves blood circulation",
        "Antibacterial properties",
        "Prevents dandruff"
      ],
      description: "Rosemary is a Mediterranean herb known for its amazing hair benefits. Contains carnosic acid that stimulates hair growth and prevents premature graying. Studies have proven its effectiveness rivals minoxidil in stimulating hair growth."
    },
    {
      name: "Aloe Vera Extract",
      scientificName: "Aloe vera",
      icon: Droplet,
      benefits: [
        "Superior hair hydration",
        "Soothes irritated scalp",
        "Repairs damaged hair",
        "Strengthens scalp immunity"
      ],
      description: "Aloe has been known for thousands of years as a natural remedy for hair and skin. Contains over 75 active nutrients including vitamins, minerals, and amino acids. Works to repair damaged hair from roots to tips."
    },
    {
      name: "Henna Extract",
      scientificName: "Lawsonia inermis",
      icon: Sparkles,
      benefits: [
        "Strengthens hair structure",
        "Protection from heat and sun",
        "Adds natural shine",
        "Improves hair texture"
      ],
      description: "Henna is a natural plant used for centuries to strengthen hair and improve its appearance. Contains tannins and vitamins that coat hair with a natural protective layer, preventing damage and improving shine without changing hair color."
    },
    {
      name: "Sage Extract",
      scientificName: "Salvia officinalis",
      icon: Leaf,
      benefits: [
        "Regulates oil secretion",
        "Deep scalp cleansing",
        "Natural antiseptic properties",
        "Improves scalp health"
      ],
      description: "Sage is a medicinal herb rich in antioxidants and antibacterial compounds. Helps cleanse the scalp from toxins and impurities, regulates natural oil secretion, maintaining clean and healthy hair for longer."
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
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={title} />
        <meta name="twitter:description" content={description} />
        <link rel="canonical" href="https://sevensgreen.com/ingredients" />
        <link rel="alternate" hrefLang="ar" href="https://sevensgreen.com/ingredients?lang=ar" />
        <link rel="alternate" hrefLang="en" href="https://sevensgreen.com/ingredients?lang=en" />
      </Helmet>

      <div className="min-h-screen bg-background">
        <Header />
        <MobileNav />
        
        <main className="container mx-auto px-4 py-8 max-w-6xl">
          {/* Header */}
          <header className="text-center mb-12">
            <div className="inline-flex items-center gap-2 bg-primary/10 rounded-full px-6 py-2 mb-4">
              <Leaf className="w-5 h-5 text-primary" />
              <span className="text-primary font-semibold">
                {language === 'ar' ? 'طبيعي 100%' : '100% Natural'}
              </span>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-primary bg-clip-text text-transparent">
              {language === 'ar' ? 'المكونات الطبيعية في سفن جرين' : 'Natural Ingredients in Seven Green'}
            </h1>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              {language === 'ar' 
                ? 'تركيبة فريدة من سبعة أعشاب طبيعية مختارة بعناية لخصائصها العلاجية المثبتة علمياً'
                : 'A unique formula of seven carefully selected natural herbs for their scientifically proven therapeutic properties'
              }
            </p>
          </header>

          {/* Ingredients Grid */}
          <section className="space-y-8 mb-16">
            {ingredients.map((ingredient, index) => (
              <Card key={index} className="p-6 md:p-8 border-2 border-primary/20 hover:border-primary/40 transition-all">
                <div className="flex flex-col md:flex-row gap-6">
                  <div className="flex-shrink-0">
                    <div className="w-16 h-16 bg-gradient-primary rounded-full flex items-center justify-center">
                      <ingredient.icon className="w-8 h-8 text-white" />
                    </div>
                  </div>
                  <div className="flex-1">
                    <h2 className="text-2xl md:text-3xl font-bold mb-2 text-foreground">
                      {ingredient.name}
                    </h2>
                    <p className="text-sm text-muted-foreground italic mb-4">
                      {ingredient.scientificName}
                    </p>
                    <p className="text-muted-foreground leading-relaxed mb-6">
                      {ingredient.description}
                    </p>
                    <div>
                      <h3 className="text-lg font-semibold mb-3 text-foreground">
                        {language === 'ar' ? 'الفوائد الرئيسية:' : 'Key Benefits:'}
                      </h3>
                      <ul className="grid md:grid-cols-2 gap-2">
                        {ingredient.benefits.map((benefit, i) => (
                          <li key={i} className="flex items-start gap-2">
                            <CheckCircle className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                            <span className="text-muted-foreground">{benefit}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </section>

          {/* Long-Form SEO Content */}
          <article className="prose prose-lg dark:prose-invert max-w-none mb-16">
            <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-lg border border-primary/10">
              {language === 'ar' ? (
                <>
                  <h2 className="text-3xl font-bold mb-6 text-foreground">
                    لماذا المكونات الطبيعية أفضل للشعر؟
                  </h2>
                  
                  <p className="text-muted-foreground leading-relaxed mb-4">
                    المكونات الطبيعية في <strong className="text-foreground">صابونة سفن جرين</strong> تعمل بانسجام مع طبيعة شعرك وفروة رأسك، على عكس المواد الكيميائية القاسية التي قد تسبب تلفاً طويل المدى. كل عشبة تم اختيارها بعناية بناءً على أبحاث علمية مكثفة تثبت فعاليتها في علاج مشاكل الشعر المختلفة.
                  </p>

                  <h3 className="text-2xl font-bold mt-8 mb-4 text-foreground">
                    التركيبة المتوازنة للأعشاب السبعة
                  </h3>
                  <p className="text-muted-foreground leading-relaxed mb-4">
                    التركيبة الفريدة لسفن جرين لا تعتمد على عشبة واحدة فقط، بل على تآزر سبعة أعشاب مختلفة تعمل معاً لتحقيق أفضل النتائج:
                  </p>
                  <ul className="list-disc list-inside space-y-2 mb-6 text-muted-foreground">
                    <li><strong>السرو والأوسمان:</strong> العنصران الأساسيان لمنع التساقط وتحفيز النمو</li>
                    <li><strong>إكليل الجبل والميرمية:</strong> لتحسين الدورة الدموية وتنظيف فروة الرأس</li>
                    <li><strong>الصبار والحناء:</strong> للترطيب العميق والحماية من التلف</li>
                    <li><strong>زيت الزيتون:</strong> للتغذية الشاملة واللمعان الطبيعي</li>
                  </ul>

                  <h3 className="text-2xl font-bold mt-8 mb-4 text-foreground">
                    خالية من المواد الضارة
                  </h3>
                  <p className="text-muted-foreground leading-relaxed mb-4">
                    صابونة سفن جرين خالية تماماً من المواد الكيميائية الضارة التي توجد في معظم منتجات العناية بالشعر:
                  </p>
                  <ul className="list-disc list-inside space-y-2 mb-6 text-muted-foreground">
                    <li>لا تحتوي على الكبريتات (SLS/SLES) التي تجفف الشعر</li>
                    <li>خالية من البارابين المسببة لاضطرابات هرمونية</li>
                    <li>لا تحتوي على السيليكون الذي يغلق مسام فروة الرأس</li>
                    <li>خالية من العطور والألوان الصناعية</li>
                  </ul>

                  <h3 className="text-2xl font-bold mt-8 mb-4 text-foreground">
                    معتمدة من هيئة الغذاء والدواء السعودية
                  </h3>
                  <p className="text-muted-foreground leading-relaxed mb-4">
                    جميع المكونات في سفن جرين معتمدة ومطابقة لأعلى معايير الجودة والسلامة من هيئة الغذاء والدواء السعودية. خضعت التركيبة لاختبارات صارمة للتأكد من فعاليتها وأمانها على جميع أنواع الشعر.
                  </p>

                  <div className="bg-primary/5 border-l-4 border-primary p-6 rounded-lg mt-8">
                    <p className="text-foreground font-semibold mb-2">
                      🌿 حقيقة علمية:
                    </p>
                    <p className="text-muted-foreground">
                      الدراسات أثبتت أن المكونات الطبيعية تعطي نتائج طويلة المدى أفضل من المواد الكيميائية، لأنها تعالج المشكلة من الجذور بدلاً من مجرد إخفاء الأعراض.
                    </p>
                  </div>
                </>
              ) : (
                <>
                  <h2 className="text-3xl font-bold mb-6 text-foreground">
                    Why Natural Ingredients Are Better for Hair?
                  </h2>
                  
                  <p className="text-muted-foreground leading-relaxed mb-4">
                    Natural ingredients in <strong className="text-foreground">Seven Green soap</strong> work in harmony with your hair and scalp nature, unlike harsh chemicals that may cause long-term damage. Each herb was carefully selected based on intensive scientific research proving its effectiveness in treating various hair problems.
                  </p>

                  <h3 className="text-2xl font-bold mt-8 mb-4 text-foreground">
                    The Balanced Seven Herbs Formula
                  </h3>
                  <p className="text-muted-foreground leading-relaxed mb-4">
                    Seven Green's unique formula doesn't rely on just one herb, but on the synergy of seven different herbs working together for best results:
                  </p>
                  <ul className="list-disc list-inside space-y-2 mb-6 text-muted-foreground">
                    <li><strong>Cypress and Woad:</strong> Main elements to prevent loss and stimulate growth</li>
                    <li><strong>Rosemary and Sage:</strong> To improve circulation and cleanse scalp</li>
                    <li><strong>Aloe and Henna:</strong> For deep hydration and damage protection</li>
                    <li><strong>Olive Oil:</strong> For comprehensive nutrition and natural shine</li>
                  </ul>

                  <div className="bg-primary/5 border-l-4 border-primary p-6 rounded-lg mt-8">
                    <p className="text-foreground font-semibold mb-2">
                      🌿 Scientific Fact:
                    </p>
                    <p className="text-muted-foreground">
                      Studies have proven that natural ingredients give better long-term results than chemicals, because they treat the problem from the roots instead of just hiding symptoms.
                    </p>
                  </div>
                </>
              )}
            </div>
          </article>

          {/* CTA Section */}
          <div className="bg-gradient-to-br from-primary/10 to-secondary/10 rounded-2xl p-8 text-center">
            <h2 className="text-3xl font-bold mb-4 text-foreground">
              {language === 'ar' ? 'جربي قوة الطبيعة' : 'Experience Nature\'s Power'}
            </h2>
            <p className="text-lg text-muted-foreground mb-6 max-w-2xl mx-auto">
              {language === 'ar'
                ? 'احصلي على شعر صحي وقوي بمكونات طبيعية 100% بدون أي مواد كيميائية ضارة'
                : 'Get healthy, strong hair with 100% natural ingredients without any harmful chemicals'
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

export default Ingredients;
