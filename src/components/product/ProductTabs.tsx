import { Star, CheckCircle2, Package, Leaf, Book } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { useLanguage } from '@/hooks/useLanguage';

export const ProductTabs = () => {
  const { language } = useLanguage();

  const ingredients = [
    {
      name: language === 'ar' ? 'خلاصة السرو' : 'Cypress Extract',
      benefit: language === 'ar' ? 'يقوي بصيلات الشعر ويمنع التساقط' : 'Strengthens hair follicles and prevents hair loss',
    },
    {
      name: language === 'ar' ? 'زيت الأوسمان (الآس)' : 'Laurel Oil',
      benefit: language === 'ar' ? 'ينظف فروة الرأس ويعزز نمو الشعر' : 'Cleanses scalp and promotes hair growth',
    },
    {
      name: language === 'ar' ? 'إكليل الجبل (الروزماري)' : 'Rosemary',
      benefit: language === 'ar' ? 'يحفز الدورة الدموية ويزيد الكثافة' : 'Stimulates blood circulation and increases density',
    },
    {
      name: language === 'ar' ? 'القراص' : 'Nettle',
      benefit: language === 'ar' ? 'يغذي الشعر ويمنحه اللمعان' : 'Nourishes hair and gives it shine',
    },
    {
      name: language === 'ar' ? 'الزعتر' : 'Thyme',
      benefit: language === 'ar' ? 'مضاد للبكتيريا والفطريات' : 'Antibacterial and antifungal',
    },
    {
      name: language === 'ar' ? 'البابونج' : 'Chamomile',
      benefit: language === 'ar' ? 'يهدئ فروة الرأس ويخفف الحكة' : 'Soothes scalp and relieves itching',
    },
    {
      name: language === 'ar' ? 'اللافندر' : 'Lavender',
      benefit: language === 'ar' ? 'يعطي رائحة عطرة ويحافظ على صحة الشعر' : 'Gives a pleasant scent and maintains hair health',
    },
  ];

  const specifications = [
    { label: language === 'ar' ? 'الوزن' : 'Weight', value: language === 'ar' ? '130 جرام' : '130 grams' },
    { label: language === 'ar' ? 'الشكل' : 'Shape', value: language === 'ar' ? 'مثلث فريد' : 'Unique Triangle' },
    { label: language === 'ar' ? 'عدد الاستخدامات' : 'Uses', value: language === 'ar' ? '40-50 مرة' : '40-50 times' },
    { label: language === 'ar' ? 'الصلاحية' : 'Shelf Life', value: language === 'ar' ? '3 سنوات' : '3 years' },
    { label: language === 'ar' ? 'بلد المنشأ' : 'Origin', value: language === 'ar' ? 'تركيا' : 'Turkey' },
    { label: language === 'ar' ? 'الرائحة' : 'Scent', value: language === 'ar' ? 'عشبية طبيعية' : 'Natural Herbal' },
    { label: language === 'ar' ? 'مناسب لـ' : 'Suitable For', value: language === 'ar' ? 'جميع أنواع الشعر' : 'All Hair Types' },
    { label: language === 'ar' ? 'الشهادات' : 'Certifications', value: 'ISO 9001, GMP, Halal' },
  ];

  const howToUse = [
    {
      step: 1,
      icon: '💧',
      title: language === 'ar' ? 'ترطيب الشعر' : 'Wet Hair',
      description: language === 'ar' ? 'بلل شعرك بالماء الدافئ بشكل كامل' : 'Completely wet your hair with warm water',
    },
    {
      step: 2,
      icon: '🧼',
      title: language === 'ar' ? 'تطبيق الصابونة' : 'Apply Soap',
      description: language === 'ar' ? 'افرك الصابونة على فروة الرأس حتى تتكون رغوة' : 'Rub the soap on the scalp until it lathers',
    },
    {
      step: 3,
      icon: '💆‍♀️',
      title: language === 'ar' ? 'التدليك' : 'Massage',
      description: language === 'ar' ? 'دلك بحركات دائرية لطيفة لمدة 2-3 دقائق' : 'Massage with gentle circular motions for 2-3 minutes',
    },
    {
      step: 4,
      icon: '⏰',
      title: language === 'ar' ? 'الانتظار' : 'Wait',
      description: language === 'ar' ? 'اترك الصابونة لمدة 5 دقائق' : 'Leave the soap for 5 minutes',
    },
    {
      step: 5,
      icon: '🚿',
      title: language === 'ar' ? 'الشطف' : 'Rinse',
      description: language === 'ar' ? 'اشطف جيداً بالماء الفاتر' : 'Rinse thoroughly with lukewarm water',
    },
  ];

  return (
    <Tabs defaultValue="description" className="w-full" dir={language === 'ar' ? 'rtl' : 'ltr'}>
      <TabsList className="grid w-full grid-cols-5">
        <TabsTrigger value="description">
          {language === 'ar' ? 'الوصف' : 'Description'}
        </TabsTrigger>
        <TabsTrigger value="ingredients">
          {language === 'ar' ? 'المكونات' : 'Ingredients'}
        </TabsTrigger>
        <TabsTrigger value="specifications">
          {language === 'ar' ? 'المواصفات' : 'Specifications'}
        </TabsTrigger>
        <TabsTrigger value="reviews">
          {language === 'ar' ? 'التقييمات' : 'Reviews'}
        </TabsTrigger>
        <TabsTrigger value="howto">
          {language === 'ar' ? 'الاستخدام' : 'How to Use'}
        </TabsTrigger>
      </TabsList>

      {/* Description Tab */}
      <TabsContent value="description" className="space-y-6">
        <div>
          <h3 className="text-2xl font-bold mb-4">
            {language === 'ar' ? 'وصف المنتج التفصيلي' : 'Detailed Product Description'}
          </h3>
          <div className="prose prose-sm dark:prose-invert max-w-none">
            <p>
              {language === 'ar'
                ? 'صابونة سفن جرين المثلثة هي تركيبة فريدة من نوعها تجمع بين 7 أعشاب طبيعية تم اختيارها بعناية لعلاج مشاكل تساقط الشعر وتكثيفه. تتميز الصابونة بشكلها المثلث الفريد الذي يسهل الاستخدام والتطبيق.'
                : 'Seven Green Triangle Soap is a unique formula combining 7 carefully selected natural herbs to treat hair loss and increase density. The soap features a unique triangular shape that makes it easy to use and apply.'
              }
            </p>
          </div>
        </div>

        <div>
          <h4 className="text-lg font-semibold mb-3">
            {language === 'ar' ? 'الفوائد الرئيسية:' : 'Key Benefits:'}
          </h4>
          <div className="grid gap-3">
            {[
              language === 'ar' ? 'يوقف تساقط الشعر بشكل فعّال' : 'Effectively stops hair loss',
              language === 'ar' ? 'يزيد من كثافة الشعر ويملأ الفراغات' : 'Increases hair density and fills gaps',
              language === 'ar' ? 'ينظف فروة الرأس بعمق' : 'Deep cleanses the scalp',
              language === 'ar' ? 'يعطي لمعان طبيعي للشعر' : 'Gives natural shine to hair',
              language === 'ar' ? 'آمن للاستخدام اليومي' : 'Safe for daily use',
              language === 'ar' ? 'خالي من المواد الكيميائية الضارة' : 'Free from harmful chemicals',
            ].map((benefit, index) => (
              <div key={index} className="flex items-start gap-2">
                <CheckCircle2 className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                <span>{benefit}</span>
              </div>
            ))}
          </div>
        </div>
      </TabsContent>

      {/* Ingredients Tab */}
      <TabsContent value="ingredients" className="space-y-6">
        <div>
          <h3 className="text-2xl font-bold mb-4">
            {language === 'ar' ? 'المكونات الطبيعية السبعة' : 'Seven Natural Ingredients'}
          </h3>
          <div className="grid gap-4">
            {ingredients.map((ingredient, index) => (
              <div key={index} className="flex items-start gap-3 p-4 bg-accent/50 rounded-lg">
                <Leaf className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-semibold">{ingredient.name}</h4>
                  <p className="text-sm text-muted-foreground">{ingredient.benefit}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="border-t pt-6">
          <h4 className="text-lg font-semibold mb-3">
            {language === 'ar' ? 'خالي من:' : 'Free From:'}
          </h4>
          <div className="flex flex-wrap gap-2">
            {['Paraben', 'Sulfate', 'Phthalate', 'Silicone', 'Artificial Colors'].map((item) => (
              <Badge key={item} variant="outline">{item}</Badge>
            ))}
          </div>
        </div>
      </TabsContent>

      {/* Specifications Tab */}
      <TabsContent value="specifications" className="space-y-6">
        <div>
          <h3 className="text-2xl font-bold mb-4">
            {language === 'ar' ? 'المواصفات التقنية' : 'Technical Specifications'}
          </h3>
          <div className="divide-y">
            {specifications.map((spec, index) => (
              <div key={index} className="flex justify-between py-3">
                <span className="font-medium">{spec.label}</span>
                <span className="text-muted-foreground">{spec.value}</span>
              </div>
            ))}
          </div>
        </div>
      </TabsContent>

      {/* Reviews Tab */}
      <TabsContent value="reviews" className="space-y-6">
        <div>
          <h3 className="text-2xl font-bold mb-4">
            {language === 'ar' ? 'آراء العملاء (2847 تقييم)' : 'Customer Reviews (2847 Reviews)'}
          </h3>
          
          {/* Rating Summary */}
          <div className="grid grid-cols-5 gap-2 mb-6">
            {[5, 4, 3, 2, 1].map((rating) => (
              <div key={rating} className="flex items-center gap-2">
                <span className="text-sm">{rating}</span>
                <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                <div className="flex-1 h-2 bg-muted rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-yellow-400"
                    style={{ width: rating === 5 ? '85%' : rating === 4 ? '12%' : '3%' }}
                  />
                </div>
                <span className="text-sm text-muted-foreground">
                  {rating === 5 ? '85%' : rating === 4 ? '12%' : '3%'}
                </span>
              </div>
            ))}
          </div>

          {/* Sample Reviews */}
          <div className="space-y-4">
            {[
              {
                name: language === 'ar' ? 'نورة العتيبي' : 'Noura Al-Otaibi',
                rating: 5,
                date: '2025-01-15',
                comment: language === 'ar' 
                  ? 'منتج رائع! شعري أصبح أكثر كثافة ولمعان من أول استخدام. أنصح الجميع بتجربته.'
                  : 'Amazing product! My hair became denser and shinier from the first use. I recommend everyone to try it.',
              },
              {
                name: language === 'ar' ? 'سارة أحمد' : 'Sarah Ahmed',
                rating: 5,
                date: '2025-01-10',
                comment: language === 'ar'
                  ? 'توقف تساقط شعري تماماً بعد أسبوعين من الاستخدام. منتج فعّال جداً!'
                  : 'My hair loss completely stopped after two weeks of use. Very effective product!',
              },
            ].map((review, index) => (
              <div key={index} className="border p-4 rounded-lg space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="font-semibold">{review.name}</span>
                    <div className="flex">
                      {Array(review.rating).fill(0).map((_, i) => (
                        <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                      ))}
                    </div>
                  </div>
                  <span className="text-sm text-muted-foreground">{review.date}</span>
                </div>
                <p className="text-sm">{review.comment}</p>
              </div>
            ))}
          </div>
        </div>
      </TabsContent>

      {/* How to Use Tab */}
      <TabsContent value="howto" className="space-y-6">
        <div>
          <h3 className="text-2xl font-bold mb-4">
            {language === 'ar' ? 'طريقة الاستخدام للحصول على أفضل النتائج' : 'How to Use for Best Results'}
          </h3>
          
          <div className="space-y-6">
            {howToUse.map((step) => (
              <div key={step.step} className="flex gap-4">
                <div className="flex-shrink-0 w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-2xl">
                  {step.icon}
                </div>
                <div className="flex-1">
                  <h4 className="font-semibold text-lg mb-1">
                    {step.step}. {step.title}
                  </h4>
                  <p className="text-muted-foreground">{step.description}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-8 p-4 bg-amber-50 dark:bg-amber-950/20 rounded-lg border border-amber-200 dark:border-amber-800">
            <h4 className="font-semibold mb-2 flex items-center gap-2">
              <Book className="w-5 h-5" />
              {language === 'ar' ? 'نصائح إضافية:' : 'Additional Tips:'}
            </h4>
            <ul className="space-y-1 text-sm">
              <li>• {language === 'ar' ? 'استخدمي 2-3 مرات أسبوعياً' : 'Use 2-3 times per week'}</li>
              <li>• {language === 'ar' ? 'لا تستخدمي ماء ساخن جداً' : 'Do not use very hot water'}</li>
              <li>• {language === 'ar' ? 'جففي الشعر بلطف' : 'Dry hair gently'}</li>
              <li>• {language === 'ar' ? 'النتائج تظهر خلال 2-4 أسابيع' : 'Results appear within 2-4 weeks'}</li>
            </ul>
          </div>
        </div>
      </TabsContent>
    </Tabs>
  );
};
