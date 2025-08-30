import { Card } from "@/components/ui/card";
import { Droplets, Heart, Sparkles, Users, Clock, Award } from "lucide-react";

const ProductFeatures = () => {
  const features = [
    {
      icon: Droplets,
      title: "ترطيب عميق",
      description: "يوفر ترطيب عميق ومستدام للشعر الجاف والتالف",
      gradient: "from-blue-500 to-cyan-500"
    },
    {
      icon: Heart,
      title: "مكونات طبيعية",
      description: "تركيبة من الزيوت الطبيعية والخلاصات النباتية المغذية",
      gradient: "from-green-500 to-emerald-500"
    },
    {
      icon: Sparkles,
      title: "لمعان طبيعي",
      description: "يمنح الشعر لمعان صحي وطبيعي بدون مواد كيميائية ضارة",
      gradient: "from-yellow-500 to-amber-500"
    },
    {
      icon: Users,
      title: "مناسب لجميع الأنواع",
      description: "يناسب جميع أنواع الشعر من العادي إلى المصبوغ والمعالج",
      gradient: "from-purple-500 to-pink-500"
    },
    {
      icon: Clock,
      title: "نتائج سريعة",
      description: "تظهر النتائج من الاستخدام الأول مع تحسن مستمر",
      gradient: "from-orange-500 to-red-500"
    },
    {
      icon: Award,
      title: "معتمد عالمياً",
      description: "حاصل على شهادات الجودة العالمية وموثوق من الخبراء",
      gradient: "from-indigo-500 to-purple-500"
    }
  ];

  return (
    <section className="py-20 bg-gradient-to-b from-background to-accent/20" dir="rtl">
      <div className="container mx-auto px-4">
        
        {/* Section Header */}
        <div className="text-center mb-16 animate-slide-up">
          <div className="inline-flex items-center gap-2 bg-primary/10 rounded-full px-6 py-2 mb-6">
            <Sparkles className="w-5 h-5 text-primary" />
            <span className="text-primary font-medium">مميزات المنتج</span>
          </div>
          
          <h2 className="text-4xl lg:text-5xl font-bold text-foreground mb-6">
            لماذا سيفن جرين؟
          </h2>
          
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            اكتشف الفرق مع تركيبتنا الفريدة التي تجمع بين أفضل المكونات الطبيعية 
            لتحقيق النتائج التي تحلم بها لشعرك
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <Card 
              key={index}
              className="group relative overflow-hidden bg-gradient-card border-border/50 hover:border-primary/30 transition-all duration-500 hover:scale-105 hover:shadow-medium animate-bounce-in"
              style={{animationDelay: `${index * 0.1}s`}}
            >
              {/* Gradient background */}
              <div className={`absolute inset-0 bg-gradient-to-br ${feature.gradient} opacity-0 group-hover:opacity-5 transition-opacity duration-500`}></div>
              
              <div className="relative p-8 text-center">
                {/* Icon */}
                <div className="relative mb-6">
                  <div className="w-16 h-16 mx-auto bg-gradient-primary rounded-2xl flex items-center justify-center shadow-soft group-hover:shadow-medium transition-all duration-300 group-hover:scale-110">
                    <feature.icon className="w-8 h-8 text-primary-foreground" />
                  </div>
                  <div className="absolute inset-0 bg-gradient-primary rounded-2xl blur-lg opacity-30 group-hover:opacity-50 transition-opacity duration-300"></div>
                </div>

                {/* Content */}
                <h3 className="text-xl font-bold text-foreground mb-4 group-hover:text-primary transition-colors">
                  {feature.title}
                </h3>
                
                <p className="text-muted-foreground leading-relaxed">
                  {feature.description}
                </p>

                {/* Decorative line */}
                <div className="mt-6 h-1 w-12 bg-gradient-primary mx-auto rounded-full opacity-50 group-hover:opacity-100 group-hover:w-20 transition-all duration-300"></div>
              </div>
            </Card>
          ))}
        </div>

        {/* Bottom CTA */}
        <div className="text-center mt-16 animate-fade-in">
          <div className="inline-flex items-center gap-3 bg-gradient-primary text-primary-foreground rounded-full px-8 py-4 shadow-glow hover:scale-105 transition-transform cursor-pointer">
            <Award className="w-6 h-6" />
            <span className="font-semibold text-lg">جرب المنتج الآن واستمتع بالفرق</span>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ProductFeatures;