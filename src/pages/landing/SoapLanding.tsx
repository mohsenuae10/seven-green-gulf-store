import { useState } from 'react';
import { Helmet } from 'react-helmet';
import { useNavigate, Link } from 'react-router-dom';
import {
  Star, Shield, Truck, Lock, RefreshCw, CheckCircle, Leaf,
  Sparkles, ShoppingCart, Zap, Plus, Minus, Quote,
  Award, Droplet, ChevronRight, ChevronLeft,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { useCart } from '@/contexts/CartContext';
import { useLanguage, useLangPath } from '@/hooks/useLanguage';
import { useCurrency } from '@/hooks/useCurrency';
import { PriceDisplay } from '@/components/PriceDisplay';
import { useToast } from '@/hooks/use-toast';

/* ─── Product constants ─────────────────────────────────────── */
const PRODUCT_ID    = '47a281f0-2e17-4e15-831d-df124462c924';
const PRODUCT_PRICE = 33;
const NAME_AR = 'صابونة الشعر سفن جرين';
const NAME_EN = 'Seven Green Hair Soap';

const IMAGES = [
  'https://dnvchztawygtkdddsiwn.supabase.co/storage/v1/object/public/product-images/47a281f0-2e17-4e15-831d-df124462c924/1760018043164.webp',
  'https://dnvchztawygtkdddsiwn.supabase.co/storage/v1/object/public/product-images/47a281f0-2e17-4e15-831d-df124462c924/1760018030739.webp',
  'https://dnvchztawygtkdddsiwn.supabase.co/storage/v1/object/public/product-images/47a281f0-2e17-4e15-831d-df124462c924/1760018036216.webp',
  'https://dnvchztawygtkdddsiwn.supabase.co/storage/v1/object/public/product-images/47a281f0-2e17-4e15-831d-df124462c924/1760018200532.jpeg',
];

/* ─── Static content ─────────────────────────────────────────── */
const content = {
  ar: {
    metaTitle: 'صابونة الشعر سفن جرين | علاج تساقط الشعر طبيعياً – نتائج مضمونة خلال 4 أسابيع',
    metaDesc: 'صابونة شعر سفن جرين الطبيعية – تركيبة من 7 أعشاب صينية لمنع تساقط الشعر وتكثيفه وتقويته. نتائج مضمونة خلال 4 أسابيع. شحن مجاني وضمان 30 يوم.',
    badge: '🔥 عرض محدود – وفري 50%',
    headline: 'أوقفي تساقط شعرك نهائياً',
    subheadline: 'في 4 أسابيع فقط!',
    desc: 'صابونة شعر سفن جرين الطبيعية 100% من خلاصة 7 أعشاب صينية مختارة علمياً لمنع التساقط، تكثيف الشعر، وإعادة الحيوية لفروة رأسك.',
    reviews: '2,847 تقييم موثق',
    freeShip: 'شحن مجاني',
    buyNow: 'اشترِ الآن',
    addCart: 'أضف للسلة',
    guarantee: 'ضمان استرداد 30 يوم',
    securePayment: 'دفع آمن ومشفر',
    origPrice: 'السعر الأصلي',
    nowPrice: 'سعرك الآن',
    stockWarn: '⚠️ كمية محدودة – أكثر من 200 طلب هذا الأسبوع!',
    trustBadges: [
      { icon: Shield,    label: 'منتج طبيعي 100%' },
      { icon: Truck,     label: 'شحن مجاني سريع' },
      { icon: Lock,      label: 'دفع آمن ومشفر' },
      { icon: RefreshCw, label: 'ضمان 30 يوم' },
    ],
    stats: [
      { num: '+2,847', label: 'عميلة راضية' },
      { num: '4.9/5',  label: 'تقييم المنتج' },
      { num: '98%',    label: 'نسبة الرضا' },
      { num: '30 يوم', label: 'ضمان استرداد' },
    ],
    problemTitle: 'هل تعانين من هذه المشاكل؟',
    problems: [
      'تساقط الشعر بكثرة عند التمشيط أو الاستحمام',
      'شعر خفيف وغير كثيف يفتقر للحيوية',
      'فروة رأس دهنية أو جافة ومتهيجة',
      'شعر تالف من الصبغة والحرارة',
    ],
    solutionTitle: 'الحل الطبيعي: صابونة سفن جرين',
    benefits: [
      { icon: CheckCircle, title: 'تمنع التساقط بنسبة 85%', desc: 'خلاصة السرو والأوسمان تقوي البصيلات وتمنع هرمون DHT المسبب للتساقط' },
      { icon: Sparkles,   title: 'تكثيف الشعر 97%',        desc: 'تنشط البصيلات الخاملة وتحفز نمو شعر جديد صحي كثيف وقوي' },
      { icon: Leaf,       title: 'ترطيب عميق ودائم',       desc: 'زيت الزيتون والصبار يرطبان الشعر من الجذور حتى الأطراف' },
      { icon: Droplet,    title: 'تنظيف فروة الرأس',       desc: 'تزيل الشوائب وتوازن الزيوت الطبيعية دون تجفيف أو إضرار' },
    ],
    howToUseTitle: 'طريقة الاستخدام – 3 خطوات بسيطة',
    steps: [
      { n: '1', title: 'بللي شعرك',    desc: 'بللي شعرك بالماء الدافئ جيداً' },
      { n: '2', title: 'طبقي الصابونة', desc: 'افردي الصابونة على الشعر ودلكي فروة الرأس بلطف لمدة 2-3 دقائق' },
      { n: '3', title: 'اشطفي',        desc: 'اشطفي جيداً بالماء البارد. كرري 2-3 مرات أسبوعياً' },
    ],
    ingredientsTitle: 'المكونات الطبيعية الفعّالة',
    ingredients: [
      { name: 'خلاصة السرو',         sci: 'Cupressus sempervirens', desc: 'تقوي البصيلات وتمنع هرمون DHT' },
      { name: 'خلاصة الأوسمان (الوسمة)', sci: 'Isatis tinctoria',    desc: 'تحفز نمو شعر جديد وصحي' },
      { name: 'زيت الزيتون البكر',   sci: 'Olea europaea',          desc: 'ترطيب عميق وحماية من التلف' },
      { name: 'خلاصة إكليل الجبل',   sci: 'Rosmarinus officinalis', desc: 'يحسن الدورة الدموية ويمنع القشرة' },
    ],
    reviewsTitle: 'ماذا قالت عميلاتنا؟',
    reviews3: [
      { name: 'سارة أحمد',   loc: 'الرياض، السعودية',  text: 'شعري كان يتساقط بشدة وجربت كل شيء! بعد شهر مع سفن جرين، التساقط توقف تقريباً وشعري صار أكثيف. منتج رائع جداً.' },
      { name: 'فاطمة العلي', loc: 'دبي، الإمارات',      text: 'استخدمته 4 أسابيع وشفت فرق واضح. شعري أصبح أقوى وأكثر لمعاناً. السعر ممتاز مقارنة بالنتيجة!' },
      { name: 'نورا الزهراني', loc: 'جدة، السعودية',   text: 'أنصح به بشدة! طبيعي 100% وآمن. شعري تحسن من الأسبوع الأول. وربيت وشعري صار أكثيف وأجمل.' },
    ],
    faqTitle: 'الأسئلة الشائعة',
    faqs: [
      { q: 'متى تظهر النتائج؟',                       a: 'تبدأ النتائج بالظهور خلال 2-4 أسابيع من الاستخدام المنتظم. للنتائج الكاملة يُنصح بالاستمرار 3 أشهر.' },
      { q: 'كم مرة أستخدمه في الأسبوع؟',              a: 'يُستخدم 2-3 مرات أسبوعياً. يمكن الاستخدام اليومي للشعر الدهني.' },
      { q: 'هل هو آمن للشعر المصبوغ؟',                a: 'نعم، سفن جرين خالٍ من الكبريتات والبارابين وآمن تماماً للشعر المصبوغ والمعالج.' },
      { q: 'هل هو مناسب للرجال والنساء؟',              a: 'نعم، مناسب لجميع أنواع الشعر للرجال والنساء.' },
      { q: 'ما هو سياسة الإرجاع؟',                    a: 'نقدم ضمان استرداد كامل المبلغ خلال 30 يوماً إذا لم تكوني راضية عن النتائج.' },
    ],
    ctaTitle: 'اطلبي الآن قبل نفاد الكمية!',
    ctaDesc: 'انضمي لأكثر من 2,847 عميلة حققن نتائج مذهلة – نتائج مضمونة خلال 4 أسابيع أو استرداد كامل!',
    footerLinks: 'صابون الشعر | المتجر | الخصوصية',
    copyright: '© 2025 سفن جرين. جميع الحقوق محفوظة.',
  },
  en: {
    metaTitle: 'Seven Green Hair Soap | Natural Hair Loss Treatment – Guaranteed Results in 4 Weeks',
    metaDesc: 'Seven Green natural hair soap – 7-herb Chinese formula to stop hair loss, thicken and strengthen hair. Guaranteed results in 4 weeks. Free shipping & 30-day money-back.',
    badge: '🔥 Limited Offer – Save 50%',
    headline: 'Stop Your Hair Loss for Good',
    subheadline: 'In Just 4 Weeks!',
    desc: '100% natural Seven Green hair soap from an extract of 7 scientifically selected Chinese herbs to prevent hair loss, thicken hair, and restore scalp vitality.',
    reviews: '2,847 verified reviews',
    freeShip: 'Free Shipping',
    buyNow: 'Buy Now',
    addCart: 'Add to Cart',
    guarantee: '30-Day Money-Back Guarantee',
    securePayment: 'Secure & Encrypted Payment',
    origPrice: 'Original Price',
    nowPrice: 'Your Price Now',
    stockWarn: '⚠️ Limited stock – 200+ orders this week!',
    trustBadges: [
      { icon: Shield,    label: '100% Natural Product' },
      { icon: Truck,     label: 'Free Fast Shipping' },
      { icon: Lock,      label: 'Secure Encrypted Payment' },
      { icon: RefreshCw, label: '30-Day Guarantee' },
    ],
    stats: [
      { num: '2,847+', label: 'Happy Customers' },
      { num: '4.9/5',  label: 'Product Rating' },
      { num: '98%',    label: 'Satisfaction Rate' },
      { num: '30 Days', label: 'Money-Back Guarantee' },
    ],
    problemTitle: 'Are you experiencing these issues?',
    problems: [
      'Excessive hair loss when combing or showering',
      'Thin, flat hair lacking volume and vitality',
      'Oily or dry, irritated scalp',
      'Hair damaged from coloring or heat styling',
    ],
    solutionTitle: 'The Natural Solution: Seven Green Hair Soap',
    benefits: [
      { icon: CheckCircle, title: 'Reduces Hair Loss by 85%', desc: 'Cypress and woad extract strengthen follicles and block DHT, the hormone behind hair loss' },
      { icon: Sparkles,   title: 'Thickens Hair by 97%',     desc: 'Activates dormant follicles and stimulates growth of new, healthy, dense hair' },
      { icon: Leaf,       title: 'Deep & Lasting Moisture',  desc: 'Olive oil and aloe vera hydrate hair from roots to tips for lasting softness' },
      { icon: Droplet,    title: 'Deep Scalp Cleansing',     desc: 'Removes buildup and balances natural oils without drying or damaging' },
    ],
    howToUseTitle: 'How to Use – 3 Simple Steps',
    steps: [
      { n: '1', title: 'Wet Your Hair',   desc: 'Thoroughly wet your hair with warm water' },
      { n: '2', title: 'Apply the Soap',  desc: 'Spread soap on hair and gently massage scalp for 2-3 minutes' },
      { n: '3', title: 'Rinse Well',      desc: 'Rinse thoroughly with cool water. Repeat 2-3 times weekly' },
    ],
    ingredientsTitle: 'Powerful Natural Ingredients',
    ingredients: [
      { name: 'Cypress Extract',    sci: 'Cupressus sempervirens', desc: 'Strengthens follicles and blocks DHT hormone' },
      { name: 'Woad Extract',       sci: 'Isatis tinctoria',       desc: 'Stimulates new, healthy hair growth' },
      { name: 'Extra Virgin Olive Oil', sci: 'Olea europaea',     desc: 'Deep hydration and damage protection' },
      { name: 'Rosemary Extract',   sci: 'Rosmarinus officinalis', desc: 'Improves blood circulation and prevents dandruff' },
    ],
    reviewsTitle: 'What Our Customers Say',
    reviews3: [
      { name: 'Sarah Ahmed',     loc: 'Riyadh, Saudi Arabia', text: 'My hair was falling out badly and I tried everything! After one month with Seven Green, the loss almost stopped and my hair got much thicker. Amazing product!' },
      { name: 'Fatima Al-Ali',  loc: 'Dubai, UAE',           text: 'Used it for 4 weeks and saw a clear difference. My hair is stronger and shinier. Excellent value for the results!' },
      { name: 'Nora Al-Zahrani', loc: 'Jeddah, Saudi Arabia', text: 'Highly recommend! 100% natural and safe. My hair improved from the first week. More volume and beautiful shine.' },
    ],
    faqTitle: 'Frequently Asked Questions',
    faqs: [
      { q: 'When will I see results?',              a: 'Results begin to appear within 2-4 weeks of regular use. For full results, 3 months of continuous use is recommended.' },
      { q: 'How many times per week should I use it?', a: 'Use it 2-3 times weekly. Daily use is fine for oily hair.' },
      { q: 'Is it safe for color-treated hair?',    a: 'Yes, Seven Green is sulfate-free and paraben-free, making it completely safe for colored and chemically treated hair.' },
      { q: 'Is it suitable for men and women?',     a: 'Yes, Seven Green suits all hair types for both men and women.' },
      { q: 'What is your return policy?',           a: 'We offer a full 30-day money-back guarantee if you are not satisfied with the results.' },
    ],
    ctaTitle: 'Order Now Before Stock Runs Out!',
    ctaDesc: 'Join 2,847+ customers who achieved amazing results – guaranteed results in 4 weeks or your money back!',
    footerLinks: 'Hair Soap | Shop | Privacy',
    copyright: '© 2025 Seven Green. All Rights Reserved.',
  },
};

/* ─── Stars helper ──────────────────────────────────────────── */
const Stars = ({ n = 5 }: { n?: number }) => (
  <span className="flex gap-0.5">
    {[1, 2, 3, 4, 5].map(s => (
      <Star key={s} className={`w-4 h-4 ${s <= n ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`} />
    ))}
  </span>
);

/* ═══════════════════════════════════════════════════════════ */
const SoapLanding = () => {
  const { language } = useLanguage();
  const langPath = useLangPath();
  const navigate = useNavigate();
  const { addItem, items, updateQty } = useCart();
  const { getPriceData } = useCurrency();
  const { toast } = useToast();
  const [qty, setQty] = useState(1);
  const [activeImg, setActiveImg] = useState(0);
  const isAr = language === 'ar';
  const c = isAr ? content.ar : content.en;
  const dir = isAr ? 'rtl' : 'ltr';
  const productName = isAr ? NAME_AR : NAME_EN;

  const handleAddToCart = () => {
    const existing = items.find(i => i.productId === PRODUCT_ID);
    if (existing) {
      updateQty(PRODUCT_ID, existing.quantity + qty);
    } else {
      addItem({ productId: PRODUCT_ID, name: NAME_AR, nameEn: NAME_EN, price: PRODUCT_PRICE, image: IMAGES[0] }, qty);
    }
    toast({ title: isAr ? `✓ تمت الإضافة (${qty})` : `✓ Added (${qty})`, description: productName });
  };

  const handleBuyNow = () => {
    handleAddToCart();
    navigate(langPath('/order'));
  };

  const priceData = getPriceData(PRODUCT_PRICE * qty);
  const origPriceData = getPriceData(65); // crossed-out anchor price

  return (
    <>
      <Helmet>
        <title>{c.metaTitle}</title>
        <meta name="description" content={c.metaDesc} />
        <meta property="og:title" content={c.metaTitle} />
        <meta property="og:description" content={c.metaDesc} />
        <meta property="og:image" content={IMAGES[0]} />
        <meta property="og:type" content="product" />
        <meta property="og:url" content={`https://sevensgreen.com${langPath('/lp/soap')}`} />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={c.metaTitle} />
        <meta name="twitter:description" content={c.metaDesc} />
        <meta name="twitter:image" content={IMAGES[0]} />
        <meta property="product:price:amount" content={String(PRODUCT_PRICE)} />
        <meta property="product:price:currency" content="SAR" />
        <link rel="canonical" href={`https://sevensgreen.com/lp/soap`} />
        <link rel="alternate" hrefLang="ar" href="https://sevensgreen.com/ar/lp/soap" />
        <link rel="alternate" hrefLang="en" href="https://sevensgreen.com/lp/soap" />
        <script type="application/ld+json">{JSON.stringify({
          '@context': 'https://schema.org/',
          '@type': 'Product',
          name: NAME_EN,
          description: 'Seven Green natural hair soap with 7 Chinese herbs for hair loss treatment and thickening.',
          image: IMAGES,
          brand: { '@type': 'Brand', name: 'Seven Green' },
          offers: { '@type': 'Offer', priceCurrency: 'SAR', price: PRODUCT_PRICE, availability: 'https://schema.org/InStock' },
          aggregateRating: { '@type': 'AggregateRating', ratingValue: '4.9', reviewCount: '2847' },
        })}</script>
      </Helmet>

      <div className="min-h-screen bg-white" dir={dir}>

        {/* ── TOP BAR ─────────────────────────────────────────── */}
        <header className="sticky top-0 z-50 bg-white/95 backdrop-blur border-b border-gray-100 shadow-sm">
          <div className="container mx-auto px-4 py-3 flex items-center justify-between">
            <Link to={langPath('/')} className="font-black text-primary text-xl tracking-tight">
              سفن جرين <span className="text-xs font-light text-gray-400 hidden sm:inline">七绿</span>
            </Link>
            <div className="flex items-center gap-3">
              <Link to={langPath('/products')} className="text-sm text-gray-500 hover:text-primary transition-colors hidden sm:inline">
                {isAr ? '← المتجر' : '← Shop'}
              </Link>
              <Button size="sm" className="rounded-full bg-primary hover:bg-primary/90 text-white font-bold px-4 text-sm" onClick={handleBuyNow}>
                {c.buyNow}
              </Button>
            </div>
          </div>
        </header>

        {/* ── HERO SECTION ──────────────────────────────────── */}
        <section className="bg-gradient-to-b from-primary/5 to-white pt-6 pb-10">
          <div className="container mx-auto px-4">
            <div className={`flex flex-col lg:flex-row gap-8 items-center ${isAr ? 'lg:flex-row-reverse' : ''}`}>

              {/* Image gallery */}
              <div className="w-full lg:w-1/2">
                {/* Badge */}
                <div className="inline-flex items-center gap-2 bg-red-500 text-white text-xs font-bold rounded-full px-4 py-1.5 mb-4 animate-pulse">
                  {c.badge}
                </div>
                {/* Main image */}
                <div className="relative aspect-square rounded-2xl overflow-hidden shadow-xl bg-gray-50 mb-3">
                  <img
                    src={IMAGES[activeImg]}
                    alt={productName}
                    className="w-full h-full object-cover transition-opacity duration-300"
                    loading="eager"
                  />
                  {/* Nav arrows */}
                  {IMAGES.length > 1 && (
                    <>
                      <button
                        onClick={() => setActiveImg(i => (i - 1 + IMAGES.length) % IMAGES.length)}
                        className="absolute left-2 top-1/2 -translate-y-1/2 w-8 h-8 bg-white/80 rounded-full flex items-center justify-center shadow hover:bg-white transition-colors"
                        aria-label="Previous"
                      >
                        <ChevronLeft className="w-4 h-4 text-gray-700" />
                      </button>
                      <button
                        onClick={() => setActiveImg(i => (i + 1) % IMAGES.length)}
                        className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 bg-white/80 rounded-full flex items-center justify-center shadow hover:bg-white transition-colors"
                        aria-label="Next"
                      >
                        <ChevronRight className="w-4 h-4 text-gray-700" />
                      </button>
                    </>
                  )}
                </div>
                {/* Thumbnails */}
                <div className="flex gap-2 justify-center">
                  {IMAGES.map((img, i) => (
                    <button
                      key={i}
                      onClick={() => setActiveImg(i)}
                      className={`w-14 h-14 rounded-lg overflow-hidden border-2 transition-all ${activeImg === i ? 'border-primary scale-105' : 'border-gray-200 opacity-70 hover:opacity-100'}`}
                    >
                      <img src={img} alt="" className="w-full h-full object-cover" loading="lazy" />
                    </button>
                  ))}
                </div>
              </div>

              {/* Product info */}
              <div className={`w-full lg:w-1/2 ${isAr ? 'text-right' : 'text-left'}`}>
                <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-gray-900 leading-tight mb-2">
                  {c.headline}
                </h1>
                <p className="text-2xl sm:text-3xl font-bold text-primary mb-4">{c.subheadline}</p>
                <p className="text-base text-gray-600 leading-relaxed mb-5 max-w-md">{c.desc}</p>

                {/* Rating */}
                <div className={`flex items-center gap-2 mb-5 ${isAr ? 'justify-end' : ''}`}>
                  <Stars />
                  <span className="font-bold text-gray-900">4.9</span>
                  <span className="text-sm text-gray-500">({c.reviews})</span>
                </div>

                {/* Price block */}
                <div className={`flex items-end gap-4 mb-2 ${isAr ? 'flex-row-reverse' : ''}`}>
                  <div>
                    <p className="text-xs text-gray-400 line-through mb-0.5">
                      {c.origPrice}: <PriceDisplay {...getPriceData(65)} />
                    </p>
                    <div className="text-4xl font-black text-primary">
                      <PriceDisplay {...getPriceData(PRODUCT_PRICE)} />
                    </div>
                  </div>
                  <div className="bg-red-100 text-red-600 text-sm font-bold px-3 py-1.5 rounded-full mb-1">
                    {isAr ? 'وفري 50%!' : 'Save 50%!'}
                  </div>
                </div>

                {/* Stock warning */}
                <p className="text-sm text-amber-600 font-semibold mb-5">{c.stockWarn}</p>

                {/* Qty + CTA */}
                <div className={`flex flex-col sm:flex-row gap-3 mb-5 ${isAr ? 'sm:flex-row-reverse' : ''}`}>
                  {/* Qty selector */}
                  <div className="flex items-center border border-gray-200 rounded-full bg-gray-50 overflow-hidden">
                    <button onClick={() => setQty(q => Math.max(1, q - 1))} className="w-11 h-11 flex items-center justify-center hover:bg-gray-100 transition-colors text-gray-600">
                      <Minus className="w-4 h-4" />
                    </button>
                    <span className="w-10 text-center font-bold text-gray-900">{qty}</span>
                    <button onClick={() => setQty(q => q + 1)} className="w-11 h-11 flex items-center justify-center hover:bg-gray-100 transition-colors text-gray-600">
                      <Plus className="w-4 h-4" />
                    </button>
                  </div>
                  {/* Buy Now */}
                  <Button
                    size="lg"
                    className="flex-1 h-11 rounded-full bg-primary hover:bg-primary/90 text-white font-black text-lg shadow-lg hover:scale-105 transition-all gap-2"
                    onClick={handleBuyNow}
                  >
                    <Zap className="w-5 h-5" />
                    {c.buyNow}
                  </Button>
                  {/* Add to Cart */}
                  <Button
                    size="lg"
                    variant="outline"
                    className="flex-1 h-11 rounded-full border-primary text-primary hover:bg-primary hover:text-white transition-all font-bold gap-2"
                    onClick={handleAddToCart}
                  >
                    <ShoppingCart className="w-5 h-5" />
                    {c.addCart}
                  </Button>
                </div>

                {/* Mini trust */}
                <div className={`flex flex-wrap gap-3 text-sm text-gray-500 ${isAr ? 'justify-end' : ''}`}>
                  <span className="flex items-center gap-1"><Truck className="w-4 h-4 text-primary" />{c.freeShip}</span>
                  <span className="flex items-center gap-1"><RefreshCw className="w-4 h-4 text-primary" />{c.guarantee}</span>
                  <span className="flex items-center gap-1"><Lock className="w-4 h-4 text-primary" />{c.securePayment}</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ── STATS STRIP ────────────────────────────────────── */}
        <section className="bg-primary text-white py-6">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
              {c.stats.map((s, i) => (
                <div key={i}>
                  <div className="text-2xl sm:text-3xl font-black">{s.num}</div>
                  <div className="text-xs sm:text-sm opacity-80 mt-0.5">{s.label}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── TRUST BADGES ──────────────────────────────────── */}
        <section className="py-10 bg-gray-50">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {c.trustBadges.map((b, i) => (
                <Card key={i} className="p-5 text-center hover:shadow-md transition-shadow border-primary/10">
                  <b.icon className="w-8 h-8 mx-auto mb-2 text-primary" />
                  <p className="font-semibold text-sm text-gray-800">{b.label}</p>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* ── PROBLEM SECTION ───────────────────────────────── */}
        <section className="py-14 bg-white">
          <div className="container mx-auto px-4 max-w-3xl">
            <h2 className={`text-2xl sm:text-3xl font-black text-gray-900 mb-8 ${isAr ? 'text-right' : 'text-left'}`}>
              {c.problemTitle}
            </h2>
            <div className="space-y-3">
              {c.problems.map((p, i) => (
                <div key={i} className={`flex items-start gap-3 ${isAr ? 'flex-row-reverse text-right' : ''}`}>
                  <div className="w-6 h-6 rounded-full bg-red-100 flex items-center justify-center shrink-0 mt-0.5">
                    <span className="text-red-500 text-xs font-bold">✗</span>
                  </div>
                  <p className="text-gray-700">{p}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── BENEFITS SECTION ──────────────────────────────── */}
        <section className="py-14 bg-gradient-to-b from-primary/5 to-white">
          <div className="container mx-auto px-4">
            <h2 className={`text-2xl sm:text-3xl font-black text-gray-900 mb-10 text-center`}>
              {c.solutionTitle}
            </h2>
            <div className="grid sm:grid-cols-2 gap-6 max-w-3xl mx-auto">
              {c.benefits.map((b, i) => (
                <Card key={i} className="p-6 border-2 border-primary/15 hover:border-primary/40 transition-all hover:shadow-lg">
                  <div className={`flex items-start gap-4 ${isAr ? 'flex-row-reverse text-right' : ''}`}>
                    <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center shrink-0">
                      <b.icon className="w-6 h-6 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-bold text-gray-900 mb-1">{b.title}</h3>
                      <p className="text-sm text-gray-600 leading-relaxed">{b.desc}</p>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
            <div className="text-center mt-10">
              <Button size="lg" className="rounded-full bg-primary hover:bg-primary/90 text-white font-black px-10 shadow-lg hover:scale-105 transition-all gap-2" onClick={handleBuyNow}>
                <Zap className="w-5 h-5" />{c.buyNow}
              </Button>
            </div>
          </div>
        </section>

        {/* ── HOW TO USE ────────────────────────────────────── */}
        <section className="py-14 bg-white">
          <div className="container mx-auto px-4 max-w-2xl">
            <h2 className="text-2xl sm:text-3xl font-black text-gray-900 mb-10 text-center">{c.howToUseTitle}</h2>
            <div className="space-y-6">
              {c.steps.map((s, i) => (
                <div key={i} className={`flex items-start gap-5 ${isAr ? 'flex-row-reverse text-right' : ''}`}>
                  <div className="w-12 h-12 rounded-full bg-primary text-white font-black text-xl flex items-center justify-center shrink-0 shadow-md">
                    {s.n}
                  </div>
                  <div className="flex-1 pt-1">
                    <h3 className="font-bold text-gray-900 text-lg mb-1">{s.title}</h3>
                    <p className="text-gray-600">{s.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── TESTIMONIALS ──────────────────────────────────── */}
        <section className="py-14 bg-gray-50">
          <div className="container mx-auto px-4">
            <h2 className="text-2xl sm:text-3xl font-black text-gray-900 mb-10 text-center">{c.reviewsTitle}</h2>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-4xl mx-auto">
              {c.reviews3.map((r, i) => (
                <Card key={i} className="p-6 relative border-primary/10 hover:shadow-lg transition-shadow">
                  <Quote className="w-8 h-8 text-primary/20 absolute top-4 left-4" />
                  <div className="pt-4">
                    <Stars />
                    <p className={`text-gray-700 text-sm leading-relaxed my-4 ${isAr ? 'text-right' : ''}`}>"{r.text}"</p>
                    <div className={`flex items-center gap-3 ${isAr ? 'flex-row-reverse' : ''}`}>
                      <div className="w-10 h-10 rounded-full bg-primary text-white font-bold flex items-center justify-center text-sm">
                        {r.name.slice(0, 2)}
                      </div>
                      <div className={isAr ? 'text-right' : ''}>
                        <p className="font-semibold text-gray-900 text-sm">{r.name}</p>
                        <p className="text-xs text-gray-500">{r.loc}</p>
                      </div>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* ── INGREDIENTS ───────────────────────────────────── */}
        <section className="py-14 bg-white">
          <div className="container mx-auto px-4 max-w-3xl">
            <h2 className="text-2xl sm:text-3xl font-black text-gray-900 mb-10 text-center">{c.ingredientsTitle}</h2>
            <div className="grid sm:grid-cols-2 gap-4">
              {c.ingredients.map((ing, i) => (
                <div key={i} className={`flex items-start gap-4 p-4 rounded-xl bg-primary/5 border border-primary/10 ${isAr ? 'flex-row-reverse text-right' : ''}`}>
                  <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center shrink-0">
                    <Leaf className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <p className="font-bold text-gray-900 text-sm">{ing.name}</p>
                    <p className="text-xs text-gray-400 italic mb-1">{ing.sci}</p>
                    <p className="text-xs text-gray-600">{ing.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── FAQ ───────────────────────────────────────────── */}
        <section className="py-14 bg-gray-50">
          <div className="container mx-auto px-4 max-w-2xl">
            <h2 className="text-2xl sm:text-3xl font-black text-gray-900 mb-10 text-center">{c.faqTitle}</h2>
            <Accordion type="single" collapsible className="space-y-2">
              {c.faqs.map((f, i) => (
                <AccordionItem key={i} value={`f-${i}`} className="bg-white rounded-xl px-4 border border-gray-100 shadow-sm">
                  <AccordionTrigger className={`font-semibold text-gray-900 hover:no-underline ${isAr ? 'text-right' : ''}`}>
                    {f.q}
                  </AccordionTrigger>
                  <AccordionContent className={`text-gray-600 pb-4 ${isAr ? 'text-right' : ''}`}>{f.a}</AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        </section>

        {/* ── FINAL CTA ─────────────────────────────────────── */}
        <section className="py-16 bg-gradient-to-br from-primary to-primary-dark text-white">
          <div className="container mx-auto px-4 text-center max-w-2xl">
            <Award className="w-14 h-14 mx-auto mb-4 opacity-80" />
            <h2 className="text-3xl sm:text-4xl font-black mb-4">{c.ctaTitle}</h2>
            <p className="text-white/80 text-lg mb-8 max-w-xl mx-auto leading-relaxed">{c.ctaDesc}</p>

            {/* Price + qty */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-8">
              <div className="flex items-center border-2 border-white/30 rounded-full bg-white/10 overflow-hidden">
                <button onClick={() => setQty(q => Math.max(1, q - 1))} className="w-11 h-11 flex items-center justify-center hover:bg-white/20 transition-colors">
                  <Minus className="w-4 h-4" />
                </button>
                <span className="w-10 text-center font-bold">{qty}</span>
                <button onClick={() => setQty(q => q + 1)} className="w-11 h-11 flex items-center justify-center hover:bg-white/20 transition-colors">
                  <Plus className="w-4 h-4" />
                </button>
              </div>
              <Button
                size="lg"
                className="rounded-full bg-white text-primary hover:bg-white/90 font-black text-lg px-12 shadow-xl hover:scale-105 transition-all gap-2"
                onClick={handleBuyNow}
              >
                <Zap className="w-5 h-5" />
                {c.buyNow} – <PriceDisplay {...getPriceData(PRODUCT_PRICE * qty)} />
              </Button>
            </div>

            {/* Trust row */}
            <div className="flex flex-wrap items-center justify-center gap-4 text-sm text-white/70">
              <span className="flex items-center gap-1"><Truck className="w-4 h-4" />{c.freeShip}</span>
              <span className="flex items-center gap-1"><RefreshCw className="w-4 h-4" />{c.guarantee}</span>
              <span className="flex items-center gap-1"><Lock className="w-4 h-4" />{c.securePayment}</span>
            </div>
          </div>
        </section>

        {/* ── MINIMAL FOOTER ────────────────────────────────── */}
        <footer className="py-6 bg-gray-900 text-gray-400 text-center text-sm">
          <div className="container mx-auto px-4">
            <div className={`flex flex-wrap justify-center gap-4 mb-3`}>
              <Link to={langPath('/lp/soap')} className="hover:text-white transition-colors">{isAr ? 'صابون الشعر' : 'Hair Soap'}</Link>
              <Link to={langPath('/products')} className="hover:text-white transition-colors">{isAr ? 'المتجر' : 'Shop'}</Link>
              <Link to={langPath('/privacy')} className="hover:text-white transition-colors">{isAr ? 'الخصوصية' : 'Privacy'}</Link>
              <Link to={langPath('/faq')} className="hover:text-white transition-colors">{isAr ? 'الأسئلة الشائعة' : 'FAQ'}</Link>
            </div>
            <p>{c.copyright}</p>
          </div>
        </footer>

        {/* ── STICKY BOTTOM BAR ─────────────────────────────── */}
        <div className="fixed bottom-0 left-0 right-0 z-50 bg-white/97 backdrop-blur-md border-t border-gray-100 shadow-2xl">
          <div className="container mx-auto px-3 py-2.5 max-w-2xl">
            <div className={`flex items-center gap-2 ${isAr ? 'flex-row-reverse' : ''}`}>
              <div className={`flex-1 ${isAr ? 'text-right' : ''}`}>
                <p className="text-xs text-gray-500 line-through leading-none">
                  <PriceDisplay {...origPriceData} />
                </p>
                <p className="text-base font-black text-primary leading-tight">
                  <PriceDisplay {...priceData} />
                </p>
              </div>
              <Button
                variant="outline"
                className="h-10 gap-1.5 rounded-full border-primary text-primary hover:bg-primary hover:text-white transition-all text-sm font-semibold px-4"
                onClick={handleAddToCart}
              >
                <ShoppingCart className="w-4 h-4" />
                {c.addCart}
              </Button>
              <Button
                className="h-10 gap-1.5 rounded-full bg-primary hover:bg-primary/90 text-white font-black shadow-sm text-sm px-5"
                onClick={handleBuyNow}
              >
                <Zap className="w-4 h-4" />
                {c.buyNow}
              </Button>
            </div>
          </div>
        </div>

        {/* Spacer for sticky bar */}
        <div className="h-16" />
      </div>
    </>
  );
};

export default SoapLanding;
