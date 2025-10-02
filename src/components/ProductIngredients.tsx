import { Card } from "@/components/ui/card";
import { Leaf, Droplets, Sparkles, Shield } from "lucide-react";
import { useLanguage } from "@/hooks/useLanguage";

const ProductIngredients = () => {
  const { language, t } = useLanguage();
  
  const ingredients = language === 'ar' ? [
    {
      icon: Leaf,
      name: "أوراق السرو الطبيعية",
      description: "غنية بمضادات الأكسدة، تساعد في تقوية جذور الشعر وتحسين الدورة الدموية في فروة الرأس",
      benefit: "يقلل التساقط بنسبة 85%",
      gradient: "from-green-500 to-emerald-600"
    },
    {
      icon: Sparkles,
      name: "نبات الأوسمان",
      description: "يحتوي على زيوت أساسية طبيعية تغذي الشعر من الجذور وتعالج التقصف والجفاف",
      benefit: "يزيد اللمعان بنسبة 92%",
      gradient: "from-amber-500 to-orange-600"
    },
    {
      icon: Droplets,
      name: "زيوت طبيعية مركزة",
      description: "مزيج من الزيوت الطبيعية المرطبة التي تحافظ على توازن الزيوت في فروة الرأس",
      benefit: "يتحكم في الزيوت الزائدة",
      gradient: "from-blue-500 to-cyan-600"
    },
    {
      icon: Shield,
      name: "مستخلصات عشبية صينية",
      description: "تركيبة قديمة من 7 أعشاب صينية تقليدية تحمي الشعر وتحافظ على صحته",
      benefit: "آمن ومختبر طبياً",
      gradient: "from-purple-500 to-pink-600"
    }
  ] : [
    {
      icon: Leaf,
      name: "Natural Cypress Leaves",
      description: "Rich in antioxidants, helps strengthen hair roots and improve blood circulation in the scalp",
      benefit: "Reduces hair loss by 85%",
      gradient: "from-green-500 to-emerald-600"
    },
    {
      icon: Sparkles,
      name: "Rosemary Plant",
      description: "Contains natural essential oils that nourish hair from the roots and treat split ends and dryness",
      benefit: "Increases shine by 92%",
      gradient: "from-amber-500 to-orange-600"
    },
    {
      icon: Droplets,
      name: "Concentrated Natural Oils",
      description: "A blend of natural moisturizing oils that maintain oil balance in the scalp",
      benefit: "Controls excess oils",
      gradient: "from-blue-500 to-cyan-600"
    },
    {
      icon: Shield,
      name: "Chinese Herbal Extracts",
      description: "Ancient formula of 7 traditional Chinese herbs that protect and maintain hair health",
      benefit: "Safe and medically tested",
      gradient: "from-purple-500 to-pink-600"
    }
  ];

  return (
    <section className="py-20 bg-gradient-to-b from-background to-accent/10" dir={language === 'ar' ? 'rtl' : 'ltr'}>
      <div className="container mx-auto px-4">
        
        {/* Section Header */}
        <div className="text-center mb-16 animate-slide-up">
          <div className="inline-flex items-center gap-2 bg-primary/10 rounded-full px-6 py-2 mb-6">
            <Leaf className="w-5 h-5 text-primary" />
            <span className="text-primary font-medium">
              {language === 'ar' ? 'مكونات طبيعية 100%' : '100% Natural Ingredients'}
            </span>
          </div>
          
          <h2 className="text-4xl lg:text-5xl font-bold text-foreground mb-6">
            {language === 'ar' ? 'المكونات الطبيعية السبعة' : 'The Seven Natural Ingredients'}
          </h2>
          
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            {language === 'ar' 
              ? 'صابونة سفن جرين تحتوي على تركيبة فريدة من 7 مكونات طبيعية صينية قديمة، تم اختبار شامبو سفن جرين علمياً لضمان أفضل النتائج لصحة شعرك'
              : 'Seven Green soap contains a unique formula of 7 ancient Chinese natural ingredients, scientifically tested to ensure the best results for your hair health'}
          </p>
        </div>

        {/* Ingredients Grid */}
        <div className="grid md:grid-cols-2 gap-8 mb-12">
          {ingredients.map((ingredient, index) => (
            <Card 
              key={index}
              className="group relative overflow-hidden bg-gradient-card border-border/50 hover:border-primary/30 transition-all duration-500 hover:scale-105 hover:shadow-medium animate-bounce-in"
              style={{animationDelay: `${index * 0.1}s`}}
            >
              {/* Gradient background */}
              <div className={`absolute inset-0 bg-gradient-to-br ${ingredient.gradient} opacity-0 group-hover:opacity-5 transition-opacity duration-500`}></div>
              
              <div className="relative p-8">
                {/* Icon */}
                <div className="relative mb-6">
                  <div className={`w-16 h-16 bg-gradient-to-br ${ingredient.gradient} rounded-2xl flex items-center justify-center shadow-soft group-hover:shadow-medium transition-all duration-300 group-hover:scale-110`}>
                    <ingredient.icon className="w-8 h-8 text-white" />
                  </div>
                  <div className={`absolute inset-0 bg-gradient-to-br ${ingredient.gradient} rounded-2xl blur-lg opacity-30 group-hover:opacity-50 transition-opacity duration-300`}></div>
                </div>

                {/* Content */}
                <h3 className="text-2xl font-bold text-foreground mb-3 group-hover:text-primary transition-colors">
                  {ingredient.name}
                </h3>
                
                <p className="text-muted-foreground leading-relaxed mb-4">
                  {ingredient.description}
                </p>

                {/* Benefit Badge */}
                <div className={`inline-flex items-center gap-2 bg-gradient-to-r ${ingredient.gradient} text-white px-4 py-2 rounded-full text-sm font-semibold shadow-soft`}>
                  <Sparkles className="w-4 h-4" />
                  {ingredient.benefit}
                </div>
              </div>
            </Card>
          ))}
        </div>

        {/* Clinical Studies */}
        <Card className="bg-gradient-to-br from-primary/5 to-secondary/5 border-primary/20 p-8 animate-fade-in">
          <div className="text-center max-w-4xl mx-auto">
            <Shield className="w-12 h-12 text-primary mx-auto mb-4" />
            <h3 className="text-2xl font-bold text-foreground mb-4">
              {language === 'ar' ? 'مختبر طبياً ومعتمد عالمياً' : 'Medically Tested & Globally Certified'}
            </h3>
            <p className="text-muted-foreground leading-relaxed mb-6">
              {language === 'ar'
                ? 'جميع المكونات خضعت لاختبارات سريرية صارمة وحصلت على شهادات دولية للجودة والسلامة. منتجنا خالٍ من المواد الكيميائية الضارة ومناسب لجميع أنواع الشعر.'
                : 'All ingredients have undergone rigorous clinical testing and received international quality and safety certifications. Our product is free from harmful chemicals and suitable for all hair types.'}
            </p>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              <div className="text-center">
                <div className="text-3xl font-bold text-primary mb-1">100%</div>
                <div className="text-sm text-muted-foreground">{language === 'ar' ? 'طبيعي' : 'Natural'}</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-primary mb-1">0%</div>
                <div className="text-sm text-muted-foreground">{language === 'ar' ? 'كيماويات' : 'Chemicals'}</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-primary mb-1">7</div>
                <div className="text-sm text-muted-foreground">{language === 'ar' ? 'أعشاب طبيعية' : 'Natural Herbs'}</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-primary mb-1">✓</div>
                <div className="text-sm text-muted-foreground">{language === 'ar' ? 'معتمد طبياً' : 'Medically Approved'}</div>
              </div>
            </div>
          </div>
        </Card>
      </div>
    </section>
  );
};

export default ProductIngredients;
