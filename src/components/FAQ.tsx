import { useState } from "react";
import { Card } from "@/components/ui/card";
import { ChevronDown, HelpCircle } from "lucide-react";
import { useLanguage } from "@/hooks/useLanguage";

const FAQ = () => {
  const { language } = useLanguage();
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const faqs = language === 'ar' ? [
    {
      question: "ما هي فوائد صابون سيفن جرين للشعر؟",
      answer: "صابون سيفن جرين يحتوي على 7 أعشاب طبيعية صينية تعمل على منع تساقط الشعر بنسبة 85%، زيادة كثافة الشعر بنسبة 97%، التحكم في الزيوت الزائدة، وزيادة اللمعان الطبيعي بنسبة 92%. المنتج مناسب لجميع أنواع الشعر وآمن للاستخدام اليومي."
    },
    {
      question: "كم من الوقت حتى أرى النتائج؟",
      answer: "معظم العملاء يلاحظون تحسناً ملحوظاً في صحة شعرهم خلال 2-3 أسابيع من الاستخدام المنتظم. النتائج الكاملة تظهر عادة بعد 4 أسابيع من الاستخدام المستمر. للحصول على أفضل النتائج، ننصح بالاستخدام مرتين يومياً."
    },
    {
      question: "هل المنتج آمن ومناسب لجميع أنواع الشعر؟",
      answer: "نعم، صابون سيفن جرين مصنوع من مكونات طبيعية 100% وخالٍ تماماً من المواد الكيميائية الضارة. تم اختباره طبياً وهو آمن للاستخدام على جميع أنواع الشعر بما في ذلك الشعر المصبوغ والمعالج كيميائياً."
    },
    {
      question: "كيف أستخدم صابون سيفن جرين؟",
      answer: "بلل شعرك بالماء الدافئ، ثم افرك الصابون بلطف على فروة الرأس والشعر حتى يتكون رغوة غنية. دلك فروة الرأس بحركات دائرية لمدة 2-3 دقائق لتحفيز الدورة الدموية، ثم اشطفه جيداً بالماء. للحصول على أفضل النتائج، استخدمه مرتين يومياً."
    },
    {
      question: "ما هي سياسة الإرجاع والضمان؟",
      answer: "نحن واثقون من جودة منتجنا، لذا نقدم ضمان استرداد المال خلال 30 يوماً. إذا لم تكن راضياً عن النتائج، يمكنك إرجاع المنتج واسترداد كامل المبلغ دون أي أسئلة."
    },
    {
      question: "هل توفرون الشحن المجاني؟",
      answer: "نعم، نوفر شحن مجاني لجميع الطلبات إلى السعودية والإمارات والكويت وقطر والبحرين وعمان واليمن. يستغرق التوصيل عادة 2-5 أيام عمل حسب موقعك."
    },
    {
      question: "ما الذي يجعل سيفن جرين مختلفاً عن المنتجات الأخرى؟",
      answer: "سيفن جرين يتميز بتركيبة فريدة من 7 أعشاب صينية طبيعية عمرها أكثر من 2000 عام. المنتج طبيعي 100%، خالٍ من المواد الكيميائية، ومختبر طبياً. كما حقق نتائج مثبتة علمياً: 97% تحسن في الكثافة، 85% تقليل التساقط، و92% زيادة في اللمعان."
    },
    {
      question: "هل يمكن استخدام المنتج للأطفال؟",
      answer: "نعم، المنتج آمن للأطفال فوق 5 سنوات. نظراً لمكوناته الطبيعية 100%، يمكن استخدامه بأمان على شعر الأطفال. ومع ذلك، ننصح دائماً باستشارة طبيب الأطفال قبل استخدام أي منتج جديد على الأطفال."
    }
  ] : [
    {
      question: "What are the benefits of Seven Green soap for hair?",
      answer: "Seven Green soap contains 7 natural Chinese herbs that work to prevent hair loss by 85%, increase hair density by 97%, control excess oils, and increase natural shine by 92%. The product is suitable for all hair types and safe for daily use."
    },
    {
      question: "How long until I see results?",
      answer: "Most customers notice a significant improvement in their hair health within 2-3 weeks of regular use. Full results typically appear after 4 weeks of continuous use. For best results, we recommend using it twice daily."
    },
    {
      question: "Is the product safe for all hair types?",
      answer: "Yes, Seven Green soap is made from 100% natural ingredients and is completely free of harmful chemicals. It has been medically tested and is safe for use on all hair types including dyed and chemically treated hair."
    },
    {
      question: "How do I use Seven Green soap?",
      answer: "Wet your hair with warm water, then gently rub the soap on your scalp and hair until a rich lather forms. Massage the scalp in circular motions for 2-3 minutes to stimulate blood circulation, then rinse thoroughly with water. For best results, use twice daily."
    },
    {
      question: "What is your return and guarantee policy?",
      answer: "We are confident in the quality of our product, so we offer a 30-day money-back guarantee. If you are not satisfied with the results, you can return the product and receive a full refund with no questions asked."
    },
    {
      question: "Do you offer free shipping?",
      answer: "Yes, we offer free shipping for all orders to Saudi Arabia, UAE, Kuwait, Qatar, Bahrain, Oman, and Yemen. Delivery usually takes 2-5 business days depending on your location."
    },
    {
      question: "What makes Seven Green different from other products?",
      answer: "Seven Green features a unique formula of 7 natural Chinese herbs over 2000 years old. The product is 100% natural, free of chemicals, and medically tested. It has also achieved scientifically proven results: 97% improvement in density, 85% reduction in hair loss, and 92% increase in shine."
    },
    {
      question: "Can the product be used for children?",
      answer: "Yes, the product is safe for children over 5 years old. Due to its 100% natural ingredients, it can be safely used on children's hair. However, we always recommend consulting a pediatrician before using any new product on children."
    }
  ];

  return (
    <section className="py-20 bg-gradient-to-b from-accent/10 to-background" dir={language === 'ar' ? 'rtl' : 'ltr'}>
      <div className="container mx-auto px-4">
        
        {/* Section Header */}
        <div className="text-center mb-16 animate-slide-up">
          <div className="inline-flex items-center gap-2 bg-primary/10 rounded-full px-6 py-2 mb-6">
            <HelpCircle className="w-5 h-5 text-primary" />
            <span className="text-primary font-medium">
              {language === 'ar' ? 'أسئلة شائعة' : 'FAQ'}
            </span>
          </div>
          
          <h2 className="text-4xl lg:text-5xl font-bold text-foreground mb-6">
            {language === 'ar' ? 'الأسئلة الشائعة' : 'Frequently Asked Questions'}
          </h2>
          
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            {language === 'ar'
              ? 'إجابات على الأسئلة الأكثر شيوعاً حول صابون سيفن جرين'
              : 'Answers to the most common questions about Seven Green soap'}
          </p>
        </div>

        {/* FAQ Accordion */}
        <div className="max-w-4xl mx-auto space-y-4">
          {faqs.map((faq, index) => (
            <Card
              key={index}
              className="overflow-hidden bg-gradient-card border-border/50 hover:border-primary/30 transition-all duration-300 animate-bounce-in"
              style={{animationDelay: `${index * 0.05}s`}}
            >
              <button
                className="w-full p-6 text-left flex items-start justify-between gap-4 group"
                onClick={() => setOpenIndex(openIndex === index ? null : index)}
              >
                <div className="flex-1">
                  <h3 className="text-lg font-bold text-foreground group-hover:text-primary transition-colors">
                    {faq.question}
                  </h3>
                  {openIndex === index && (
                    <p className="mt-4 text-muted-foreground leading-relaxed animate-fade-in">
                      {faq.answer}
                    </p>
                  )}
                </div>
                <ChevronDown
                  className={`w-5 h-5 text-primary flex-shrink-0 transition-transform duration-300 ${
                    openIndex === index ? 'rotate-180' : ''
                  }`}
                />
              </button>
            </Card>
          ))}
        </div>

        {/* JSON-LD Structured Data */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "FAQPage",
              "mainEntity": faqs.map(faq => ({
                "@type": "Question",
                "name": faq.question,
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": faq.answer
                }
              }))
            })
          }}
        />
      </div>
    </section>
  );
};

export default FAQ;
