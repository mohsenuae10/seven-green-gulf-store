import { Card } from "@/components/ui/card";
import { useLanguage } from "@/hooks/useLanguage";
import { Leaf, Sparkles, Shield, CheckCircle, Package, Info } from "lucide-react";

const ProductDetails = () => {
  const { language } = useLanguage();

  const productInfo = {
    ar: {
      definition: {
        title: "تعريف المنتج",
        content: "صابونة سفن جرين المثلثة هي منتج طبيعي 100% للعناية بالشعر، مصنوعة من خلاصة 7 أعشاب طبيعية بتركيبة فريدة تجمع بين أوراق السرو والوسمة المثلثة. تم تطويرها خصيصاً لعلاج مشاكل الشعر المختلفة وتعزيز صحته وجماله بطريقة آمنة وفعالة."
      },
      features: {
        title: "المميزات الرئيسية",
        items: [
          "تمنع تساقط الشعر بنسبة تصل إلى 85% خلال 4 أسابيع",
          "تحفز نمو الشعر وتزيد كثافته بنسبة 97%",
          "تعالج القشرة والحكة بفعالية",
          "تنظم إفراز الزيوت في فروة الرأس",
          "تمنح الشعر لمعاناً طبيعياً بنسبة 92%",
          "خالية من المواد الكيميائية الضارة",
          "مناسبة لجميع أنواع الشعر",
          "نتائج مضمونة خلال 4 أسابيع"
        ]
      },
      ingredients: {
        title: "المكونات الطبيعية",
        items: [
          {
            name: "أوراق السرو",
            benefit: "تقوي جذور الشعر وتمنع التساقط"
          },
          {
            name: "الوسمة المثلثة",
            benefit: "تعزز نمو الشعر وتزيد كثافته"
          },
          {
            name: "إكليل الجبل (الروزماري)",
            benefit: "ينشط الدورة الدموية في فروة الرأس"
          },
          {
            name: "الصبار الطبيعي",
            benefit: "يرطب الشعر ويمنحه النعومة"
          },
          {
            name: "زيت الزيتون البكر",
            benefit: "يغذي الشعر من الجذور"
          },
          {
            name: "الحناء الطبيعية",
            benefit: "تقوي الشعر وتحميه من التلف"
          },
          {
            name: "الخزامى",
            benefit: "يهدئ فروة الرأس ويعالج الحكة"
          }
        ]
      },
      details: {
        title: "تفاصيل المنتج",
        items: [
          { label: "الوزن", value: "125 جرام" },
          { label: "الشكل", value: "مثلث فريد" },
          { label: "المنشأ", value: "منتج طبيعي 100%" },
          { label: "مدة الصلاحية", value: "سنتان من تاريخ الإنتاج" },
          { label: "التخزين", value: "يحفظ في مكان جاف بعيداً عن أشعة الشمس" },
          { label: "الاستخدام", value: "يستخدم 2-3 مرات أسبوعياً للحصول على أفضل النتائج" }
        ]
      }
    },
    en: {
      definition: {
        title: "Product Definition",
        content: "Seven Green Triangle Soap is a 100% natural hair care product, made from 7 natural herbal extracts with a unique formula combining cypress and woad leaves. Specifically developed to treat various hair problems and enhance its health and beauty safely and effectively."
      },
      features: {
        title: "Key Features",
        items: [
          "Prevents hair loss by up to 85% within 4 weeks",
          "Stimulates hair growth and increases density by 97%",
          "Effectively treats dandruff and itching",
          "Regulates oil secretion in the scalp",
          "Gives hair natural shine by 92%",
          "Free from harmful chemicals",
          "Suitable for all hair types",
          "Guaranteed results within 4 weeks"
        ]
      },
      ingredients: {
        title: "Natural Ingredients",
        items: [
          {
            name: "Cypress Leaves",
            benefit: "Strengthens hair roots and prevents loss"
          },
          {
            name: "Triangle Woad",
            benefit: "Enhances hair growth and increases density"
          },
          {
            name: "Rosemary",
            benefit: "Stimulates blood circulation in the scalp"
          },
          {
            name: "Natural Aloe Vera",
            benefit: "Moisturizes hair and provides softness"
          },
          {
            name: "Virgin Olive Oil",
            benefit: "Nourishes hair from the roots"
          },
          {
            name: "Natural Henna",
            benefit: "Strengthens hair and protects from damage"
          },
          {
            name: "Lavender",
            benefit: "Soothes scalp and treats itching"
          }
        ]
      },
      details: {
        title: "Product Details",
        items: [
          { label: "Weight", value: "125 grams" },
          { label: "Shape", value: "Unique triangle" },
          { label: "Origin", value: "100% natural product" },
          { label: "Shelf Life", value: "Two years from production date" },
          { label: "Storage", value: "Keep in a dry place away from sunlight" },
          { label: "Usage", value: "Use 2-3 times weekly for best results" }
        ]
      }
    }
  };

  const content = language === 'ar' ? productInfo.ar : productInfo.en;

  return (
    <section className="py-16 lg:py-24 bg-gradient-to-b from-white to-primary/5" dir={language === 'ar' ? 'rtl' : 'ltr'}>
      <div className="container mx-auto px-4">
        
        {/* Product Definition */}
        <Card className="mb-8 lg:mb-12 p-6 lg:p-8 bg-white border-primary/20 shadow-medium">
          <div className="flex items-start gap-4 mb-4">
            <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0">
              <Info className="w-6 h-6 text-primary" />
            </div>
            <div>
              <h2 className="text-2xl lg:text-3xl font-bold text-foreground mb-4">
                {content.definition.title}
              </h2>
              <p className="text-base lg:text-lg text-muted-foreground leading-relaxed">
                {content.definition.content}
              </p>
            </div>
          </div>
        </Card>

        <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 mb-8 lg:mb-12">
          
          {/* Features */}
          <Card className="p-6 lg:p-8 bg-white border-primary/20 shadow-medium">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 bg-secondary/10 rounded-full flex items-center justify-center">
                <Sparkles className="w-6 h-6 text-secondary" />
              </div>
              <h2 className="text-2xl lg:text-3xl font-bold text-foreground">
                {content.features.title}
              </h2>
            </div>
            <ul className="space-y-3">
              {content.features.items.map((feature, index) => (
                <li key={index} className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                  <span className="text-muted-foreground">{feature}</span>
                </li>
              ))}
            </ul>
          </Card>

          {/* Product Details */}
          <Card className="p-6 lg:p-8 bg-white border-primary/20 shadow-medium">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                <Package className="w-6 h-6 text-primary" />
              </div>
              <h2 className="text-2xl lg:text-3xl font-bold text-foreground">
                {content.details.title}
              </h2>
            </div>
            <div className="space-y-4">
              {content.details.items.map((detail, index) => (
                <div key={index} className="flex justify-between items-center py-3 border-b border-border/50 last:border-0">
                  <span className="font-medium text-foreground">{detail.label}</span>
                  <span className="text-muted-foreground">{detail.value}</span>
                </div>
              ))}
            </div>
          </Card>
        </div>

        {/* Ingredients */}
        <Card className="p-6 lg:p-8 bg-gradient-to-br from-primary/5 to-white border-primary/20 shadow-medium">
          <div className="flex items-center gap-3 mb-8">
            <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
              <Leaf className="w-6 h-6 text-primary" />
            </div>
            <h2 className="text-2xl lg:text-3xl font-bold text-foreground">
              {content.ingredients.title}
            </h2>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-6">
            {content.ingredients.items.map((ingredient, index) => (
              <div key={index} className="bg-white rounded-xl p-4 border border-primary/10 hover:border-primary/30 hover:shadow-soft transition-all duration-300">
                <div className="flex items-start gap-3">
                  <Shield className="w-5 h-5 text-secondary flex-shrink-0 mt-1" />
                  <div>
                    <h3 className="font-bold text-foreground mb-1">{ingredient.name}</h3>
                    <p className="text-sm text-muted-foreground">{ingredient.benefit}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </section>
  );
};

export default ProductDetails;
