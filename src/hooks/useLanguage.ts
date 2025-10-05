import { useState, useEffect, createContext, useContext } from 'react';

export type Language = 'ar' | 'en';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

export const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

const translations = {
  ar: {
    // Header
    "currency.switcher": "تبديل العملة",
    "language.arabic": "العربية",
    "language.english": "English",
    
    // Hero Section
    "hero.badge": "منتج طبيعي 100%",
    "hero.subtitle": "صابون السرو والأوسمان الطبيعي",
    "hero.description": "تركيبة طبيعية متقدمة من أوراق السرو ونبات الأوسمان، مُصممة لمنع تساقط الشعر والتحكم في الزيوت",
    "hero.feature.natural": "طبيعي 100%",
    "hero.feature.natural.desc": "مكونات عضوية صينية",
    "hero.feature.safe": "آمن ومُختبر",
    "hero.feature.safe.desc": "معايير جودة عالمية",
    "hero.feature.luxury": "فاخر",
    "hero.feature.luxury.desc": "تقنية صينية متقدمة",
    "hero.rating": "تقييم",
    "hero.reviews": "تقييم",
    "hero.success.title": "نتائج مُثبتة علمياً",
    "hero.stat.density": "تحسن في كثافة الشعر",
    "hero.stat.reduction": "تقليل التساقط",
    "hero.stat.shine": "زيادة اللمعان",
    "hero.stat.weeks": "أسابيع",
    "hero.stat.weeks.desc": "لظهور النتائج",
    "hero.buy.now": "اشتر الآن",
    "hero.product.details": "تفاصيل المنتج",
    "hero.guarantee": "ضمان الجودة",
    "hero.free.shipping": "شحن مجاني",
    "hero.exclusive": "منتج حصري",
    "hero.was": "كان",
    "hero.now": "الآن",
    "hero.special.price": "عرض خاص",
    "hero.limited.offer": "عرض محدود",
    "hero.gallery.title": "معرض المنتج",
    "hero.gallery.description": "اكتشف جمال وفعالية سيفن جرين من خلال هذه المجموعة المتميزة من الصور",
    "hero.certificates": "الشهادات والأمان",
    "hero.certificates.desc": "منتج آمن ومُعتمد رسمياً",
    "hero.new": "جديد",
    "hero.price": "سعر المنتج",
    "hero.swipe": "اسحب للتنقل",
    
    // Features Section
    "features.badge": "مميزات المنتج",
    "features.title": "لماذا سيفن جرين؟",
    "features.description": "اكتشف الفرق مع تركيبتنا الفريدة التي تجمع بين أفضل المكونات الطبيعية لتحقيق النتائج التي تحلم بها لشعرك",
    "features.cta": "جرب المنتج الآن واستمتع بالفرق",
    "features.deep.hydration": "ترطيب عميق",
    "features.deep.hydration.desc": "يوفر ترطيب عميق ومستدام للشعر الجاف والتالف",
    "features.natural.ingredients": "مكونات طبيعية",
    "features.natural.ingredients.desc": "تركيبة من الزيوت الطبيعية والخلاصات النباتية المغذية",
    "features.natural.shine": "لمعان طبيعي",
    "features.natural.shine.desc": "يمنح الشعر لمعان صحي وطبيعي بدون مواد كيميائية ضارة",
    "features.all.types": "مناسب لجميع الأنواع",
    "features.all.types.desc": "يناسب جميع أنواع الشعر من العادي إلى المصبوغ والمعالج",
    "features.fast.results": "نتائج سريعة",
    "features.fast.results.desc": "تظهر النتائج من الاستخدام الأول مع تحسن مستمر",
    "features.globally.certified": "معتمد عالمياً",
    "features.globally.certified.desc": "حاصل على شهادات الجودة العالمية وموثوق من الخبراء",
    
    // Reviews Section
    "reviews.badge": "آراء العملاء",
    "reviews.title": "ماذا يقول عملاؤنا؟",
    "reviews.description": "أكثر من 10,000 عميلة راضية في دول الخليج يؤكدن فعالية المنتج",
    "reviews.stats.customers": "عميلة راضية",
    "reviews.stats.rating": "تقييم العملاء",
    "reviews.stats.satisfaction": "نسبة الرضا",
    "reviews.stats.guarantee": "ضمان الاسترداد",
    
    // Navigation
    "nav.image.alt": "الانتقال إلى الصورة",
    
    // English Reviews (Sample translations for reviews section)
    "reviews.english.1": "Amazing product! My hair became much softer and shinier from first use. I highly recommend it for anyone suffering from dry hair.",
    "reviews.english.2": "I've used many products but Seven Green is completely different. My hair became stronger and denser and hair loss stopped completely.",
    "reviews.english.3": "The product is 100% natural and safe. I use it for my teenage daughter and saw amazing results in improving her hair health.",
    "reviews.english.4": "My hair was very damaged from coloring, but after a month of using Seven Green, my hair returned to its natural vitality.",
    "reviews.english.5": "Best investment for my hair beauty! Natural scent and immediate results. I will definitely continue using it.",
    "reviews.english.6": "Luxury product with high quality. Really worth the price and more. My hair became like advertisement hair!",
    
    // Countries
    "country.uae": "الإمارات العربية المتحدة",
    "country.saudi": "المملكة العربية السعودية", 
    "country.usa": "الولايات المتحدة الأمريكية",
    "country.qatar": "قطر",
    "country.kuwait": "الكويت",
    "country.bahrain": "البحرين",
    "country.oman": "عمان",
    
    // Ingredients
    "ingredients.title": "المكونات الطبيعية الفعالة",
    "ingredients.description": "كل مكون مختار بعناية من أجود المصادر الطبيعية لضمان أقصى فائدة لشعرك",
    "ingredients.benefits": "الفوائد:",
    
    // Usage Steps
    "usage.step1.title": "التحضير",
    "usage.step1.desc": "اغسلي شعرك بالشامبو المناسب وجففيه بلطف بالمنشفة",
    "usage.step2.title": "التطبيق",
    "usage.step2.desc": "ضعي كمية مناسبة من Seven Green على راحة يدك ووزعيها على الشعر من الجذور حتى الأطراف",
    "usage.step3.title": "التدليك",
    "usage.step3.desc": "دلكي فروة الرأس بلطف بحركات دائرية لمدة 2-3 دقائق لتحفيز الدورة الدموية",
    "usage.step4.title": "الانتظار",
    "usage.step4.desc": "اتركي المنتج على شعرك لمدة 15-20 دقيقة ليتغلغل بعمق في خصلات الشعر",
    "usage.step5.title": "الشطف",
    "usage.step5.desc": "اشطفي شعرك بالماء الفاتر جيداً حتى إزالة المنتج بالكامل",
    
    // Product Benefits
    "benefits.title": "فوائد Seven Green المذهلة",
    "benefits.1": "يقوي الشعر من الجذور حتى الأطراف",
    "benefits.2": "يمنع تساقط الشعر بفعالية مثبتة علمياً",
    "benefits.3": "يحفز نمو شعر جديد وصحي",
    "benefits.4": "يمنح لمعاناً طبيعياً وإشراقاً واضحاً",
    "benefits.5": "يرطب الشعر الجاف ويغذيه بعمق",
    "benefits.6": "يحمي من تأثير العوامل البيئية الضارة",
    "benefits.7": "يقلل من تجعد الشعر ويسهل تصفيفه",
    "benefits.8": "آمن للاستخدام اليومي، خالٍ من الكيماويات الضارة",
    
    // Gallery Section
    "gallery.certificates.title": "الشهادات والأمان",
    "gallery.certificates.desc": "منتج آمن ومُعتمد رسمياً",
    "gallery.effectiveness.title": "الفعالية المُثبتة",
    "gallery.effectiveness.desc": "نتائج علمية مُوثقة",
    "gallery.hair.problems.title": "مشاكل الشعر",
    "gallery.hair.problems.desc": "حلول لجميع مشاكل الشعر",
    "gallery.natural.ingredients.title": "المكونات الطبيعية",
    "gallery.natural.ingredients.desc": "12 عشب طبيعي مختار بعناية",
    "gallery.comprehensive.benefits.title": "الفوائد الشاملة",
    "gallery.comprehensive.benefits.desc": "عناية متكاملة للشعر",
    "gallery.natural.excellence.title": "التميز الطبيعي",
    "gallery.natural.excellence.desc": "أفضل من المنتجات الكيميائية",
    "gallery.usage.instructions.title": "طريقة الاستخدام السهلة",
    "gallery.usage.instructions.desc": "استخدام بسيط وفعال مع نتائج سريعة ومضمونة",
    "gallery.special.offer.title": "عرض خاص محدود",
    "gallery.special.offer.desc": "اطلب الآن واحصل على هدايا مجانية مع المنتج",
    
    // Order Page
    "order.title": "اطلب سيفن جرين الآن",
    "order.subtitle": "املأ النموذج أدناه لإتمام طلبك",
    "order.form.title": "معلومات الطلب",
    "order.name": "الاسم الكامل",
    "order.name.placeholder": "أدخل اسمك الكامل",
    "order.phone": "رقم الهاتف",
    "order.phone.placeholder": "501234567",
    "order.email": "البريد الإلكتروني (اختياري)",
    "order.email.placeholder": "example@email.com",
    "order.country": "الدولة",
    "order.country.placeholder": "اختر الدولة",
    "order.city": "المدينة",
    "order.city.placeholder": "أدخل اسم المدينة",
    "order.address": "العنوان الكامل",
    "order.address.placeholder": "أدخل العنوان التفصيلي",
    "order.quantity": "الكمية",
    "order.total": "المجموع",
    "order.submit": "إتمام الطلب",
    "order.processing": "جاري المعالجة...",
    "order.success.title": "تم إنشاء الطلب بنجاح",
    "order.success.desc": "تم فتح صفحة الدفع في نافذة جديدة",
    "order.error.title": "خطأ في الطلب",
    "order.validation.name": "يرجى إدخال الاسم",
    "order.validation.phone": "يرجى إدخال رقم الهاتف",
    "order.validation.country": "يرجى اختيار الدولة",
    "order.validation.city": "يرجى إدخال المدينة",
    "order.validation.address": "يرجى إدخال العنوان",
    "order.validation.quantity": "يجب أن تكون الكمية أكبر من صفر",
    
    // Order Section
    "order.section.title": "احصل على سيفن جرين اليوم",
    "order.section.desc": "اطلب الآن واستمتع بالشحن المجاني لجميع دول الخليج مع ضمان الجودة",
    "order.section.badge": "اطلب الآن",
    "order.info": "معلومات الطلب",
    "order.shipping": "معلومات الشحن",
    "order.payment.methods": "طرق الدفع المتاحة",
    "order.payment.credit": "بطاقة ائتمان",
    "order.payment.cod": "الدفع عند الاستلام",
    "order.guarantee": "ضمان 30 يوم",
    "order.guarantee.desc": "أو استرداد كامل للأموال",
    "order.price.breakdown": "السعر",
    "order.shipping.free": "مجاني",
     "order.trust.safe": "آمن",
     "order.trust.fast": "شحن سريع",
     "order.trust.secure": "دفع آمن",
     
     // Product Details  
     "product.title": "سيفن جرين",
     "product.subtitle": "SEVEN GREEN",
     "product.description": "شامبو طبيعي متقدم للشعر، مُصمم خصيصاً لتقوية الشعر ومنع تساقطه وتحفيز نموه بمكونات طبيعية خالصة مُختبرة علمياً.",
     "product.rating": "تقييم",
     "product.save": "وفر 40%",
     "product.new": "جديد!",
     "product.back": "العودة للرئيسية",
     "product.benefits.title": "فوائد سيفن جرين المذهلة",
     "product.ingredients.title": "المكونات الطبيعية الفعالة",
     "product.ingredients.desc": "كل مكون مختار بعناية من أجود المصادر الطبيعية لضمان أقصى فائدة لشعرك",
  },
  en: {
    // Header
    "currency.switcher": "Currency Switcher",
    "language.arabic": "العربية",
    "language.english": "English",
    
    // Hero Section
    "hero.badge": "100% Natural Product",
    "hero.subtitle": "Natural Cypress & Rosemary Soap",
    "hero.description": "Advanced natural formula from cypress leaves and rosemary plant, designed to prevent hair loss and control oils",
    "hero.feature.natural": "100% Natural",
    "hero.feature.natural.desc": "Chinese organic ingredients",
    "hero.feature.safe": "Safe & Tested",
    "hero.feature.safe.desc": "International quality standards",
    "hero.feature.luxury": "Premium",
    "hero.feature.luxury.desc": "Advanced Chinese technology",
    "hero.rating": "rating",
    "hero.reviews": "reviews",
    "hero.success.title": "Scientifically Proven Results",
    "hero.stat.density": "improvement in hair density",
    "hero.stat.reduction": "reduction in hair loss",
    "hero.stat.shine": "increase in shine",
    "hero.stat.weeks": "weeks",
    "hero.stat.weeks.desc": "to see results",
    "hero.buy.now": "Buy Now",
    "hero.product.details": "Product Details",
    "hero.guarantee": "Quality Guarantee",
    "hero.free.shipping": "Free Shipping",
    "hero.exclusive": "Exclusive Product",
    "hero.gallery.title": "Product Gallery",
    "hero.gallery.description": "Discover the beauty and effectiveness of Seven Green through this distinctive collection of images",
    "hero.certificates": "Certificates & Safety",
    "hero.certificates.desc": "Safe and officially certified product",
    "hero.new": "New",
    "hero.price": "Product Price",
    "hero.swipe": "Swipe to navigate",
    
    // Features Section
    "features.badge": "Product Features",
    "features.title": "Why Seven Green?",
    "features.description": "Discover the difference with our unique formula that combines the best natural ingredients to achieve the results you dream of for your hair",
    "features.cta": "Try the product now and enjoy the difference",
    "features.deep.hydration": "Deep Hydration",
    "features.deep.hydration.desc": "Provides deep and lasting hydration for dry and damaged hair",
    "features.natural.ingredients": "Natural Ingredients",
    "features.natural.ingredients.desc": "Formula of natural oils and nourishing plant extracts",
    "features.natural.shine": "Natural Shine",
    "features.natural.shine.desc": "Gives hair healthy and natural shine without harmful chemicals",
    "features.all.types": "Suitable for All Types",
    "features.all.types.desc": "Suitable for all hair types from normal to colored and treated",
    "features.fast.results": "Fast Results",
    "features.fast.results.desc": "Results appear from first use with continuous improvement",
    "features.globally.certified": "Globally Certified",
    "features.globally.certified.desc": "Certified by international quality standards and trusted by experts",
    
    // Reviews Section
    "reviews.badge": "Customer Reviews",
    "reviews.title": "What do our customers say?",
    "reviews.description": "More than 10,000 satisfied customers in the Gulf countries confirm the product's effectiveness",
    "reviews.stats.customers": "satisfied customers",
    "reviews.stats.rating": "customer rating",
    "reviews.stats.satisfaction": "satisfaction rate",
    "reviews.stats.guarantee": "money-back guarantee",
    
    // Navigation
    "nav.image.alt": "Go to image",
    
    // English Reviews (Sample translations for reviews section)
    "reviews.english.1": "Amazing product! My hair became much softer and shinier from first use. I highly recommend it for anyone suffering from dry hair.",
    "reviews.english.2": "I've used many products but Seven Green is completely different. My hair became stronger and denser and hair loss stopped completely.",
    "reviews.english.3": "The product is 100% natural and safe. I use it for my teenage daughter and saw amazing results in improving her hair health.",
    "reviews.english.4": "My hair was very damaged from coloring, but after a month of using Seven Green, my hair returned to its natural vitality.",
    "reviews.english.5": "Best investment for my hair beauty! Natural scent and immediate results. I will definitely continue using it.",
    "reviews.english.6": "Luxury product with high quality. Really worth the price and more. My hair became like advertisement hair!",
    
    // Gallery Section
    "gallery.certificates.title": "Certificates & Safety",
    "gallery.certificates.desc": "Safe and officially certified product",
    "gallery.effectiveness.title": "Proven Effectiveness",
    "gallery.effectiveness.desc": "Documented scientific results",
    "gallery.hair.problems.title": "Hair Problems",
    "gallery.hair.problems.desc": "Solutions for all hair problems",
    "gallery.natural.ingredients.title": "Natural Ingredients",
    "gallery.natural.ingredients.desc": "12 carefully selected natural herbs",
    "gallery.comprehensive.benefits.title": "Comprehensive Benefits",
    "gallery.comprehensive.benefits.desc": "Complete hair care",
    "gallery.natural.excellence.title": "Natural Excellence",
    "gallery.natural.excellence.desc": "Better than chemical products",
    "gallery.usage.instructions.title": "Easy Usage Instructions",
    "gallery.usage.instructions.desc": "Simple and effective use with fast and guaranteed results",
    "gallery.special.offer.title": "Limited Special Offer",
    "gallery.special.offer.desc": "Order now and get free gifts with the product",
    
    // Order Page
    "order.title": "Order Seven Green Now",
    "order.subtitle": "Fill out the form below to complete your order",
    "order.form.title": "Order Information",
    "order.name": "Full Name",
    "order.name.placeholder": "Enter your full name",
    "order.phone": "Phone Number",
    "order.phone.placeholder": "501234567",
    "order.email": "Email (Optional)",
    "order.email.placeholder": "example@email.com",
    "order.country": "Country",
    "order.country.placeholder": "Choose country",
    "order.city": "City",
    "order.city.placeholder": "Enter city name",
    "order.address": "Full Address",
    "order.address.placeholder": "Enter detailed address",
    "order.quantity": "Quantity",
    "order.total": "Total",
    "order.submit": "Complete Order",
    "order.processing": "Processing...",
    "order.success.title": "Order created successfully",
    "order.success.desc": "Payment page opened in new window",
    "order.error.title": "Order Error",
    "order.validation.name": "Please enter your name",
    "order.validation.phone": "Please enter phone number",
    "order.validation.country": "Please choose country",
    "order.validation.city": "Please enter city",
    "order.validation.address": "Please enter address",
    "order.validation.quantity": "Quantity must be greater than zero",
    
    // Order Section
    "order.section.title": "Get Seven Green Today",
    "order.section.desc": "Order now and enjoy free shipping to all Gulf countries with quality guarantee",
    "order.section.badge": "Order Now",
    "order.info": "Order Information",
    "order.shipping": "Shipping Information",
    "order.payment.methods": "Available Payment Methods",
    "order.payment.credit": "Credit Card",
    "order.payment.cod": "Cash on Delivery",
    "order.guarantee": "30 Day Guarantee",
    "order.guarantee.desc": "or full money back",
    "order.price.breakdown": "Price",
    "order.shipping.free": "Free",
    "order.trust.safe": "Safe",
    "order.trust.fast": "Fast Shipping",
    "order.trust.secure": "Secure Payment",
    
    // Product Details
    "product.title": "Seven Green",
    "product.subtitle": "SEVEN GREEN",
    "product.description": "Advanced natural hair shampoo, specially designed to strengthen hair, prevent hair loss, and stimulate growth with pure natural ingredients scientifically tested.",
    "product.rating": "reviews",
    "product.save": "Save 40%",
    "product.new": "New!",
    "product.back": "Back to Home",
    "product.benefits.title": "Amazing Benefits of Seven Green",
    "product.ingredients.title": "Effective Natural Ingredients",
    "product.ingredients.desc": "Each ingredient carefully selected from the finest natural sources to ensure maximum benefit for your hair",
    "product.usage.title": "Proper Usage Instructions",
    "product.usage.desc": "Follow these simple steps to get the best results",
    "product.faq.title": "Frequently Asked Questions",
    "product.faq.1.q": "How often should Seven Green be used per week?",
    "product.faq.1.a": "It is recommended to use it 2-3 times a week for normal hair, and the frequency can be increased for very damaged hair.",
    "product.faq.2.q": "When do results appear?",
    "product.faq.2.a": "First results appear within two weeks of regular use, and complete results within 4-6 weeks.",
    "product.faq.3.q": "Is the product suitable for all hair types?",
    "product.faq.3.a": "Yes, Seven Green is designed to suit all hair types: oily, dry, mixed, and colored.",
    "product.faq.4.q": "Can it be used with other products?",
    "product.faq.4.a": "It can be safely combined with your current hair care routine, but a simple test is recommended first.",
    
    // Countries
    "country.uae": "United Arab Emirates",
    "country.saudi": "Saudi Arabia", 
    "country.usa": "United States",
    "country.qatar": "Qatar",
    "country.kuwait": "Kuwait",
    "country.bahrain": "Bahrain",
    "country.oman": "Oman",
    
    // Ingredients
    "ingredients.title": "Effective Natural Ingredients",
    "ingredients.description": "Each ingredient carefully selected from the finest natural sources to ensure maximum benefit for your hair",
    "ingredients.benefits": "Benefits:",
    
    // Usage Steps
    "usage.step1.title": "Preparation",
    "usage.step1.desc": "Wash your hair with suitable shampoo and gently dry with a towel",
    "usage.step2.title": "Application", 
    "usage.step2.desc": "Apply an appropriate amount of Seven Green to your palm and distribute on hair from roots to tips",
    "usage.step3.title": "Massage",
    "usage.step3.desc": "Gently massage the scalp in circular motions for 2-3 minutes to stimulate blood circulation",
    "usage.step4.title": "Wait",
    "usage.step4.desc": "Leave the product on your hair for 15-20 minutes to penetrate deeply into hair strands",
    "usage.step5.title": "Rinse",
    "usage.step5.desc": "Rinse your hair thoroughly with lukewarm water until the product is completely removed",
    
    // Product Benefits
    "benefits.title": "Amazing Benefits of Seven Green",
    "benefits.1": "Strengthens hair from roots to tips",
    "benefits.2": "Prevents hair loss with scientifically proven effectiveness",
    "benefits.3": "Stimulates new healthy hair growth",
    "benefits.4": "Gives natural shine and clear radiance",
    "benefits.5": "Moisturizes dry hair and nourishes it deeply",
    "benefits.6": "Protects from harmful environmental factors",
    "benefits.7": "Reduces hair frizz and makes styling easier",
    "benefits.8": "Safe for daily use, free from harmful chemicals",
  }
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};

export const useLanguageHook = () => {
  const [language, setLanguageState] = useState<Language>('en');

  useEffect(() => {
    const savedLanguage = localStorage.getItem('language') as Language;
    if (savedLanguage && ['ar', 'en'].includes(savedLanguage)) {
      setLanguageState(savedLanguage);
    }
  }, []);

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    localStorage.setItem('language', lang);
  };

  const t = (key: string): string => {
    return translations[language][key] || key;
  };

  return { language, setLanguage, t };
};