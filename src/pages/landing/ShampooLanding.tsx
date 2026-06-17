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
const PRODUCT_ID    = '6d3e3733-cd60-4b38-b907-a896844f0ed3';
const PRODUCT_PRICE = 49;
const NAME_AR = 'شامبو سفن جرين الجديد';
const NAME_EN = 'Seven Green New Shampoo';

const IMAGES = [
  'https://dnvchztawygtkdddsiwn.supabase.co/storage/v1/object/public/product-images/6d3e3733-cd60-4b38-b907-a896844f0ed3/1780677327803-0.jpeg',
  'https://dnvchztawygtkdddsiwn.supabase.co/storage/v1/object/public/product-images/6d3e3733-cd60-4b38-b907-a896844f0ed3/1780677329859-1.jpeg',
  'https://dnvchztawygtkdddsiwn.supabase.co/storage/v1/object/public/product-images/6d3e3733-cd60-4b38-b907-a896844f0ed3/1780677331722-2.jpeg',
  'https://dnvchztawygtkdddsiwn.supabase.co/storage/v1/object/public/product-images/6d3e3733-cd60-4b38-b907-a896844f0ed3/1780677380750-3.jpeg',
  'https://dnvchztawygtkdddsiwn.supabase.co/storage/v1/object/public/product-images/6d3e3733-cd60-4b38-b907-a896844f0ed3/1780677382507-4.jpeg',
  'https://dnvchztawygtkdddsiwn.supabase.co/storage/v1/object/public/product-images/6d3e3733-cd60-4b38-b907-a896844f0ed3/1780677383614-5.jpeg',
];

/* ─── Static bilingual content ───────────────────────────────── */
const content = {
  ar: {
    metaTitle: 'شامبو سفن جرين الجديد | تركيبة سائلة نباتية متطورة – شعر صحي يومياً',
    metaDesc: 'شامبو سفن جرين السائل الجديد – تركيبة نباتية سائلة متطورة تنظف فروة الرأس بعمق وتغذي الشعر من الجذور حتى الأطراف. مناسب لجميع أنواع الشعر للاستخدام اليومي.',
    badge: '✨ الإصدار الجديد – تركيبة سائلة متطورة',
    headline: 'شعر صحي لامع',
    subheadline: 'من أول استخدام!',
    desc: 'شامبو سفن جرين الجديد بتركيبته السائلة المطورة من مكونات نباتية مختارة لتنظيف فروة الرأس بعمق والعناية بالشعر من الجذور حتى الأطراف – مناسب للاستخدام اليومي.',
    reviews: '1,240 تقييم موثق',
    freeShip: 'شحن مجاني',
    buyNow: 'اشترِ الآن',
    addCart: 'أضف للسلة',
    guarantee: 'ضمان استرداد 30 يوم',
    securePayment: 'دفع آمن ومشفر',
    origPrice: 'السعر الأصلي',
    nowPrice: 'سعرك الآن',
    stockWarn: '⚠️ طلب مرتفع – أكثر من 150 طلب هذا الأسبوع!',
    trustBadges: [
      { icon: Shield,    label: 'تركيبة نباتية 100%' },
      { icon: Truck,     label: 'شحن مجاني سريع' },
      { icon: Lock,      label: 'دفع آمن ومشفر' },
      { icon: RefreshCw, label: 'ضمان 30 يوم' },
    ],
    stats: [
      { num: '+1,240', label: 'عميل راضٍ' },
      { num: '4.8/5',  label: 'تقييم المنتج' },
      { num: '96%',    label: 'نسبة الرضا' },
      { num: '30 يوم', label: 'ضمان استرداد' },
    ],
    problemTitle: 'هل شعرك يعاني من هذا؟',
    problems: [
      'فروة رأس تشعرين بأنها متسخة أو ثقيلة بسرعة',
      'شعر جاف وخشن يفتقر للنعومة واللمعان',
      'زيوت مفرطة تضطرك لغسل شعرك يومياً بمنتجات قاسية',
      'شامبو كيميائي يجفف شعرك ويضر بفروة رأسك',
    ],
    solutionTitle: 'الحل: شامبو سفن جرين السائل المتطور',
    benefits: [
      { icon: Droplet,     title: 'تنظيف عميق ولطيف',       desc: 'يزيل الشوائب والتراكمات بفعالية مع الحفاظ على الزيوت الطبيعية للشعر' },
      { icon: Sparkles,    title: 'نعومة ولمعان فوري',        desc: 'مكونات نباتية مختارة تمنح شعرك نعومة وبريقاً يدوم طوال اليوم' },
      { icon: Leaf,        title: 'مناسب للاستخدام اليومي',   desc: 'تركيبة لطيفة وآمنة للاستخدام اليومي على جميع أنواع الشعر' },
      { icon: CheckCircle, title: 'يغذي من الجذور للأطراف',  desc: 'مكونات نباتية تتغلغل في الشعرة لتغذيتها وتقويتها من الداخل' },
    ],
    howToUseTitle: 'كيفية الاستخدام – خطوات بسيطة',
    steps: [
      { n: '1', title: 'بلل شعرك بالماء الدافئ', desc: 'تأكدي من بلل الشعر جيداً لفتح مسام الشعرة' },
      { n: '2', title: 'ضعي كمية مناسبة على راحة اليد', desc: 'وزعيها على الشعر من الجذور حتى الأطراف ودلكي بلطف لمدة دقيقتين' },
      { n: '3', title: 'اشطفي جيداً وكرري إن لزم', desc: 'اشطفي بماء فاتر. يمكن تكراره للحصول على رغوة أفضل. للاستخدام يومياً أو حسب الحاجة' },
    ],
    ingredientsTitle: 'مكونات نباتية فعّالة',
    ingredients: [
      { name: 'خلاصة الصبار',      sci: 'Aloe Barbadensis',       desc: 'ترطيب فائق وتهدئة فروة الرأس المتهيجة' },
      { name: 'زيت الأرغان',       sci: 'Argania Spinosa',        desc: 'يمنح الشعر لمعاناً صحياً وحماية من التلف' },
      { name: 'خلاصة إكليل الجبل', sci: 'Rosmarinus officinalis', desc: 'يحفز الدورة الدموية وينشط نمو الشعر' },
      { name: 'بروتين الحرير',     sci: 'Hydrolyzed Silk Protein', desc: 'يقوي الشعرة ويحميها من التقصف والتكسر' },
    ],
    reviewsTitle: 'تجارب عملائنا الحقيقية',
    reviews3: [
      { name: 'مريم الكندري',  loc: 'الكويت',            text: 'شعري أصبح أكثر نعومة ولمعاناً من أول استخدام! الرائحة رائعة والتركيبة السائلة سهلة الاستخدام. سعيدة جداً بالنتيجة.' },
      { name: 'هند البحريني', loc: 'المنامة، البحرين',    text: 'أفضل شامبو جربته! يصنع فرقاً واضحاً في ملمس الشعر. شعري أصبح أكثر انتعاشاً وخفة. أنصح به للجميع.' },
      { name: 'علياء القطري', loc: 'الدوحة، قطر',         text: 'استخدمته أسبوعاً كاملاً يومياً ولم يجفف شعري إطلاقاً. بالعكس، شعري صار أكثر حيوية ونظافة أطول. رائع!' },
    ],
    faqTitle: 'أسئلة شائعة',
    faqs: [
      { q: 'هل يمكن استخدامه يومياً؟',              a: 'نعم، تركيبة شامبو سفن جرين الجديد لطيفة بما يكفي للاستخدام اليومي على جميع أنواع الشعر.' },
      { q: 'هل هو مناسب للشعر الدهني؟',             a: 'بالتأكيد! ينظف فروة الرأس الدهنية بعمق مع الحفاظ على التوازن الطبيعي دون تجفيف الشعر.' },
      { q: 'هل هو خالٍ من الكبريتات (SLS)؟',       a: 'نعم، الشامبو خالٍ من الكبريتات الضارة (SLS/SLES) والبارابين وجميع المواد الكيميائية القاسية.' },
      { q: 'هل يناسب الأطفال؟',                    a: 'التركيبة النباتية اللطيفة مناسبة للبالغين ويمكن استشارة الطبيب للأطفال دون السنتين.' },
      { q: 'كم يدوم الزجاج الواحد؟',               a: 'يدوم الزجاج الواحد في المتوسط 4-6 أسابيع عند الاستخدام 3-4 مرات أسبوعياً.' },
    ],
    ctaTitle: 'جربي شامبو سفن جرين اليوم!',
    ctaDesc: 'انضمي لأكثر من 1,240 عميل سعيد يعيشون تجربة شعر صحي يومياً – نتائج مضمونة أو استرداد كامل!',
    copyright: '© 2025 سفن جرين. جميع الحقوق محفوظة.',
  },
  en: {
    metaTitle: 'Seven Green New Shampoo | Advanced Plant-Based Formula – Healthy Hair Every Day',
    metaDesc: 'Seven Green new liquid shampoo – advanced plant-based formula that deeply cleanses the scalp and nourishes hair from root to tip. Suitable for all hair types for daily use.',
    badge: '✨ New Formula – Advanced Liquid Shampoo',
    headline: 'Healthy, Shiny Hair',
    subheadline: 'From the Very First Use!',
    desc: 'Seven Green new shampoo with its advanced liquid formula of carefully selected plant ingredients deeply cleanses the scalp and nourishes hair from root to tip – perfect for daily use.',
    reviews: '1,240 verified reviews',
    freeShip: 'Free Shipping',
    buyNow: 'Buy Now',
    addCart: 'Add to Cart',
    guarantee: '30-Day Money-Back Guarantee',
    securePayment: 'Secure & Encrypted Payment',
    origPrice: 'Original Price',
    nowPrice: 'Your Price Now',
    stockWarn: '⚠️ High demand – 150+ orders this week!',
    trustBadges: [
      { icon: Shield,    label: '100% Plant-Based Formula' },
      { icon: Truck,     label: 'Free Fast Shipping' },
      { icon: Lock,      label: 'Secure Encrypted Payment' },
      { icon: RefreshCw, label: '30-Day Guarantee' },
    ],
    stats: [
      { num: '1,240+', label: 'Happy Customers' },
      { num: '4.8/5',  label: 'Product Rating' },
      { num: '96%',    label: 'Satisfaction Rate' },
      { num: '30 Days', label: 'Money-Back Guarantee' },
    ],
    problemTitle: 'Is Your Hair Experiencing This?',
    problems: [
      'Scalp that feels dirty or heavy too quickly',
      'Dry, rough hair lacking softness and shine',
      'Excess oils forcing you to wash daily with harsh products',
      'Chemical shampoos that dry out hair and harm the scalp',
    ],
    solutionTitle: 'The Solution: Seven Green Advanced Liquid Shampoo',
    benefits: [
      { icon: Droplet,     title: 'Deep Yet Gentle Cleansing',  desc: 'Effectively removes buildup and impurities while preserving hair\'s natural oils' },
      { icon: Sparkles,    title: 'Instant Softness & Shine',   desc: 'Carefully selected plant ingredients give your hair softness and brilliance that lasts all day' },
      { icon: Leaf,        title: 'Safe for Daily Use',          desc: 'Gentle, safe formula for everyday use on all hair types' },
      { icon: CheckCircle, title: 'Nourishes Root to Tip',      desc: 'Plant-based ingredients penetrate the hair shaft to nourish and strengthen from within' },
    ],
    howToUseTitle: 'How to Use – Simple Steps',
    steps: [
      { n: '1', title: 'Wet Your Hair with Warm Water', desc: 'Make sure hair is thoroughly wet to open the hair cuticle' },
      { n: '2', title: 'Apply an Appropriate Amount',   desc: 'Distribute over hair from roots to tips and gently massage for 2 minutes' },
      { n: '3', title: 'Rinse Well & Repeat if Needed', desc: 'Rinse with lukewarm water. Can be repeated for better lather. Use daily or as needed' },
    ],
    ingredientsTitle: 'Powerful Plant Ingredients',
    ingredients: [
      { name: 'Aloe Vera Extract',    sci: 'Aloe Barbadensis',       desc: 'Superior hydration and soothes irritated scalp' },
      { name: 'Argan Oil',            sci: 'Argania Spinosa',        desc: 'Gives hair a healthy shine and protection from damage' },
      { name: 'Rosemary Extract',     sci: 'Rosmarinus officinalis', desc: 'Stimulates blood circulation and activates hair growth' },
      { name: 'Silk Protein',         sci: 'Hydrolyzed Silk Protein', desc: 'Strengthens hair strands and protects against breakage' },
    ],
    reviewsTitle: 'Real Customer Experiences',
    reviews3: [
      { name: 'Maryam Al-Kandari', loc: 'Kuwait',          text: 'My hair became softer and shinier from the very first use! Amazing scent and the liquid formula is so easy to use. Incredibly happy with the result.' },
      { name: 'Hind Al-Bahraini', loc: 'Manama, Bahrain',  text: 'Best shampoo I\'ve ever tried! It makes a noticeable difference in hair texture. My hair feels fresher and lighter. I recommend it to everyone.' },
      { name: 'Alia Al-Qatari',   loc: 'Doha, Qatar',      text: 'Used it daily for a whole week and it didn\'t dry out my hair at all. In fact, my hair became more vibrant and stays clean longer. Wonderful!' },
    ],
    faqTitle: 'Frequently Asked Questions',
    faqs: [
      { q: 'Can it be used daily?',              a: 'Yes, Seven Green new shampoo\'s formula is gentle enough for daily use on all hair types.' },
      { q: 'Is it suitable for oily hair?',      a: 'Absolutely! It deeply cleanses oily scalp while maintaining natural balance without over-drying.' },
      { q: 'Is it SLS/Sulfate-free?',            a: 'Yes, this shampoo is completely free from harmful sulfates (SLS/SLES), parabens, and harsh chemicals.' },
      { q: 'Is it suitable for children?',       a: 'The gentle plant-based formula is suitable for adults; consult a doctor for children under 2 years.' },
      { q: 'How long does one bottle last?',     a: 'One bottle typically lasts 4-6 weeks when used 3-4 times per week.' },
    ],
    ctaTitle: 'Try Seven Green Shampoo Today!',
    ctaDesc: 'Join 1,240+ happy customers enjoying healthy hair every day – guaranteed results or your money back!',
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
const ShampooLanding = () => {
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
  const origPriceData = getPriceData(89);

  return (
    <>
      <Helmet>
        <title>{c.metaTitle}</title>
        <meta name="description" content={c.metaDesc} />
        <meta property="og:title" content={c.metaTitle} />
        <meta property="og:description" content={c.metaDesc} />
        <meta property="og:image" content={IMAGES[0]} />
        <meta property="og:type" content="product" />
        <meta property="og:url" content={`https://sevensgreen.com${langPath('/lp/shampoo')}`} />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={c.metaTitle} />
        <meta name="twitter:description" content={c.metaDesc} />
        <meta name="twitter:image" content={IMAGES[0]} />
        <meta property="product:price:amount" content={String(PRODUCT_PRICE)} />
        <meta property="product:price:currency" content="SAR" />
        <link rel="canonical" href="https://sevensgreen.com/lp/shampoo" />
        <link rel="alternate" hrefLang="ar" href="https://sevensgreen.com/ar/lp/shampoo" />
        <link rel="alternate" hrefLang="en" href="https://sevensgreen.com/lp/shampoo" />
        <script type="application/ld+json">{JSON.stringify({
          '@context': 'https://schema.org/',
          '@type': 'Product',
          name: NAME_EN,
          description: 'Seven Green new advanced liquid shampoo with plant-based ingredients for deep scalp cleansing and daily hair care.',
          image: IMAGES,
          brand: { '@type': 'Brand', name: 'Seven Green' },
          offers: { '@type': 'Offer', priceCurrency: 'SAR', price: PRODUCT_PRICE, availability: 'https://schema.org/InStock' },
          aggregateRating: { '@type': 'AggregateRating', ratingValue: '4.8', reviewCount: '1240' },
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
        <section className="bg-gradient-to-b from-primary/5 via-white to-white pt-6 pb-10">
          <div className="container mx-auto px-4">
            <div className={`flex flex-col lg:flex-row gap-8 items-center ${isAr ? 'lg:flex-row-reverse' : ''}`}>

              {/* Image gallery */}
              <div className="w-full lg:w-1/2">
                {/* Badge */}
                <div className="inline-flex items-center gap-2 bg-primary text-white text-xs font-bold rounded-full px-4 py-1.5 mb-4">
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
                  {/* New badge overlay */}
                  <div className="absolute top-3 right-3 bg-primary text-white text-xs font-black px-3 py-1 rounded-full shadow">
                    {isAr ? 'جديد' : 'NEW'}
                  </div>
                </div>
                {/* Thumbnails */}
                <div className="flex gap-2 justify-center flex-wrap">
                  {IMAGES.slice(0, 5).map((img, i) => (
                    <button
                      key={i}
                      onClick={() => setActiveImg(i)}
                      className={`w-12 h-12 rounded-lg overflow-hidden border-2 transition-all ${activeImg === i ? 'border-primary scale-105' : 'border-gray-200 opacity-60 hover:opacity-100'}`}
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
                  <Stars n={5} />
                  <span className="font-bold text-gray-900">4.8</span>
                  <span className="text-sm text-gray-500">({c.reviews})</span>
                </div>

                {/* Price block */}
                <div className={`flex items-end gap-4 mb-2 ${isAr ? 'flex-row-reverse' : ''}`}>
                  <div>
                    <p className="text-xs text-gray-400 line-through mb-0.5">
                      {c.origPrice}: <PriceDisplay {...getPriceData(89)} />
                    </p>
                    <div className="text-4xl font-black text-primary">
                      <PriceDisplay {...getPriceData(PRODUCT_PRICE)} />
                    </div>
                  </div>
                  <div className="bg-green-100 text-green-700 text-sm font-bold px-3 py-1.5 rounded-full mb-1">
                    {isAr ? 'وفري 45%!' : 'Save 45%!'}
                  </div>
                </div>

                {/* Stock warning */}
                <p className="text-sm text-amber-600 font-semibold mb-5">{c.stockWarn}</p>

                {/* Qty + CTA */}
                <div className={`flex flex-col sm:flex-row gap-3 mb-5 ${isAr ? 'sm:flex-row-reverse' : ''}`}>
                  <div className="flex items-center border border-gray-200 rounded-full bg-gray-50 overflow-hidden">
                    <button onClick={() => setQty(q => Math.max(1, q - 1))} className="w-11 h-11 flex items-center justify-center hover:bg-gray-100 transition-colors text-gray-600">
                      <Minus className="w-4 h-4" />
                    </button>
                    <span className="w-10 text-center font-bold text-gray-900">{qty}</span>
                    <button onClick={() => setQty(q => q + 1)} className="w-11 h-11 flex items-center justify-center hover:bg-gray-100 transition-colors text-gray-600">
                      <Plus className="w-4 h-4" />
                    </button>
                  </div>
                  <Button
                    size="lg"
                    className="flex-1 h-11 rounded-full bg-primary hover:bg-primary/90 text-white font-black text-lg shadow-lg hover:scale-105 transition-all gap-2"
                    onClick={handleBuyNow}
                  >
                    <Zap className="w-5 h-5" />
                    {c.buyNow}
                  </Button>
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
            <h2 className="text-2xl sm:text-3xl font-black text-gray-900 mb-10 text-center">
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
                    <Stars n={5} />
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
                    <Droplet className="w-5 h-5 text-white" />
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
            <div className="flex flex-wrap justify-center gap-4 mb-3">
              <Link to={langPath('/lp/shampoo')} className="hover:text-white transition-colors">{isAr ? 'الشامبو السائل' : 'Liquid Shampoo'}</Link>
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

export default ShampooLanding;
