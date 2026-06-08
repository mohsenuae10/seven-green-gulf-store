import { useEffect, useState } from "react";
import { Helmet } from "react-helmet";
import { Link, useNavigate } from "react-router-dom";
import Header from "@/components/Header";
import MobileNav from "@/components/MobileNav";
import Footer from "@/components/Footer";
import HomeBanner from "@/components/HomeBanner";
import BottomBanner from "@/components/BottomBanner";
import ProductCard from "@/components/ProductCard";
import { useLanguage, useLangPath } from "@/hooks/useLanguage";
import { supabase } from "@/integrations/supabase/client";
import { ChevronRight, ChevronLeft, ShoppingBag } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useCart } from "@/contexts/CartContext";

interface ProductWithImage {
  id: string;
  name: string;
  price: number;
  description: string | null;
  stock_quantity: number | null;
  primaryImage: string;
  nameEn?: string;
  descriptionEn?: string;
}

const Index = () => {
  const { language } = useLanguage();
  const langPath = useLangPath();
  const navigate = useNavigate();
  const { totalItems, totalPrice } = useCart();
  const [products, setProducts] = useState<ProductWithImage[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    document.documentElement.lang = language === 'ar' ? 'ar' : 'en';
    document.documentElement.dir  = language === 'ar' ? 'rtl' : 'ltr';
  }, [language]);

  useEffect(() => {
    const load = async () => {
      const { data: prods } = await supabase
        .from("products").select("*").eq("is_active", true)
        .order("created_at", { ascending: false });
      if (!prods || prods.length === 0) { setLoading(false); return; }

      const { data: images } = await supabase
        .from("product_images").select("product_id, image_url, is_primary, display_order")
        .in("product_id", prods.map(p => p.id)).order("display_order");

      const { data: contentRows } = await supabase
        .from("site_content").select("section, content")
        .in("section", prods.map(p => `product_${p.id}`));

      setProducts(prods.map(p => {
        const imgs = images?.filter(i => i.product_id === p.id) ?? [];
        const primary = imgs.find(i => i.is_primary) ?? imgs[0];
        const c = (contentRows?.find(r => r.section === `product_${p.id}`)?.content as any) ?? {};
        return {
          ...p,
          primaryImage: primary?.image_url ?? p.image_url ?? "/images/sevengreen-logo.webp",
          nameEn:        c.nameEn        || undefined,
          descriptionEn: c.descriptionEn || undefined,
        };
      }));
      setLoading(false);
    };
    load();
  }, []);

  const ChevronIcon = language === 'ar' ? ChevronLeft : ChevronRight;

  const highlights = [
    { emoji: "🌿", ar: "أعشاب طبيعية 100%",        en: "100% Natural Herbs" },
    { emoji: "🧪", ar: "خالي من الكيماويات",        en: "Chemical-Free Formula" },
    { emoji: "💆", ar: "يقوي جذور الشعر",           en: "Strengthens Hair Roots" },
    { emoji: "✨", ar: "نتائج خلال 4 أسابيع",       en: "Results in 4 Weeks" },
  ];

  return (
    <>
      <Helmet>
        <title>
          {language === 'ar'
            ? 'سفن جرين 🌿 صابون شامبو بار عشبي | علاج تساقط الشعر | مثبط DHT طبيعي'
            : 'Seven Green 🌿 Herbal Shampoo Bar | Hair Loss Treatment | Natural DHT Blocker'}
        </title>
        <meta name="description" content={
          language === 'ar'
            ? 'سفن جرين — صابون شامبو بار عشبي طبيعي 100% بالسرو والأوسمان والجينسينج. مثبط DHT طبيعي فعّال لعلاج تساقط الشعر وتكثيفه وتطويله. خالي من الكبريتات. للرجال والنساء. نتائج خلال 4 أسابيع.'
            : 'Seven Green — 100% natural herbal shampoo bar with cypress, usman grass and ginseng. Natural DHT blocker for hair loss treatment, thickening and growth. Sulfate-free. For men and women. Results in 4 weeks.'
        } />
        <meta name="keywords" content={
          language === 'ar'
            ? 'سفن جرين, صابون شامبو بار, شامبو بار للشعر, مثبط DHT, صابونة الأعشاب الصينية, علاج تساقط الشعر, الصابونة المثلثة, سيفن جرين, سيفن جرين نيتشر, سفن قرين, صابونة سفن جرين, شامبو سفن جرين, تقوية جذور الشعر, العناية بفروة الرأس, تكثيف الشعر, السرو والأوسمان, خالي من الكبريتات, جينسينج للشعر'
            : 'seven green, seven green shampoo bar, seven green soap, nature seven green, sevengreen, nature triangle shampoo bar, DHT blocker, polygonum shampoo, usman grass shampoo, Chinese herbal hair soap, solid shampoo, sulfate-free, hair loss treatment, scalp care, green triangle soap, ginseng hair soap'
        } />
        <link rel="canonical" href="https://sevensgreen.com/" />
        <meta property="og:type"  content="website" />
        <meta property="og:title" content="Seven Green | سفن جرين" />
        <meta property="og:url"   content="https://sevensgreen.com/" />
        <meta property="og:image" content="https://sevensgreen.com/images/sevengreen-logo.webp" />
        <script type="application/ld+json">{JSON.stringify({
          "@context": "https://schema.org",
          "@type": "WebSite",
          "name": "Seven Green | سفن جرين",
          "url": "https://sevensgreen.com",
          "potentialAction": {
            "@type": "SearchAction",
            "target": "https://sevensgreen.com/products?q={search_term_string}",
            "query-input": "required name=search_term_string",
          },
        })}</script>
      </Helmet>

      {/* Fixed animated bottom checkout bar */}
      <div
        className={`fixed bottom-0 left-0 right-0 z-50 transition-transform duration-500 ease-in-out ${
          totalItems > 0 ? 'translate-y-0' : 'translate-y-full'
        }`}
      >
        <div className="bg-gradient-to-r from-green-700 to-green-500 shadow-2xl">
          <div className="container mx-auto px-4 py-3 flex items-center justify-between gap-3">
            <div className="flex items-center gap-2 text-white">
              <div className="relative">
                <ShoppingBag className="w-6 h-6" />
                <span className="absolute -top-1.5 -right-1.5 bg-white text-green-700 text-xs font-black rounded-full w-4 h-4 flex items-center justify-center leading-none">
                  {totalItems}
                </span>
              </div>
              <div className={language === 'ar' ? 'text-right' : 'text-left'}>
                <p className="text-xs font-medium opacity-90">
                  {language === 'ar' ? `${totalItems} منتج في السلة` : `${totalItems} item${totalItems > 1 ? 's' : ''} in cart`}
                </p>
                <p className="text-sm font-black">
                  {totalPrice.toFixed(2)} {language === 'ar' ? 'ريال' : 'SAR'}
                </p>
              </div>
            </div>
            <button
              onClick={() => navigate(langPath('/order'))}
              className="flex items-center gap-2 bg-white text-green-700 font-black text-sm px-5 py-2.5 rounded-full shadow-md hover:bg-green-50 active:scale-95 transition-all duration-150 animate-pulse hover:animate-none"
            >
              {language === 'ar' ? 'اتمام الشراء' : 'Complete Purchase'}
              <span className="text-base">{language === 'ar' ? '←' : '→'}</span>
            </button>
          </div>
        </div>
      </div>

      <div className={`min-h-screen flex flex-col bg-white transition-all duration-500 ${totalItems > 0 ? 'pb-16' : ''}`}>
        <Header />
        <MobileNav />

        <main className="flex-1">

          {/* ── 1. Banner ── */}
          <HomeBanner />

          {/* ── 2. Highlights Strip ── */}
          <section className="bg-primary/5 border-b border-primary/10">
            <div className="container mx-auto px-4">
              <div className="grid grid-cols-2 md:grid-cols-4 divide-x divide-primary/10 rtl:divide-x-reverse">
                {highlights.map((h, i) => (
                  <div key={i} className="flex items-center justify-center gap-2.5 py-4 px-3">
                    <span className="text-xl leading-none">{h.emoji}</span>
                    <span className="text-sm font-semibold text-primary">
                      {language === 'ar' ? h.ar : h.en}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* ── 3. Products Grid ── */}
          <section className="py-14 bg-gray-50">
            <div className="container mx-auto px-4">

              {/* Section header */}
              <div className={`flex items-end justify-between mb-8 ${language === 'ar' ? 'flex-row-reverse' : ''}`}>
                <div className={language === 'ar' ? 'text-right' : 'text-left'}>
                  <p className="text-primary text-sm font-semibold tracking-widest uppercase mb-1">
                    {language === 'ar' ? 'تشكيلتنا' : 'Our Collection'}
                  </p>
                  <h2 className="text-3xl md:text-4xl font-black text-gray-900">
                    {language === 'ar' ? 'منتجاتنا الطبيعية' : 'Natural Products'}
                  </h2>
                </div>
                <Link to="/products">
                  <Button variant="outline" className="rounded-full gap-1.5 border-primary/30 hover:border-primary text-primary">
                    {language === 'ar' ? 'عرض الكل' : 'View All'}
                    <ChevronIcon className="w-4 h-4" />
                  </Button>
                </Link>
              </div>

              {/* Skeleton loading */}
              {loading && (
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
                  {[...Array(8)].map((_, i) => (
                    <div key={i} className="bg-white rounded-2xl overflow-hidden animate-pulse">
                      <div className="aspect-square bg-gray-200" />
                      <div className="p-4 space-y-2">
                        <div className="h-4 bg-gray-200 rounded w-3/4" />
                        <div className="h-3 bg-gray-200 rounded w-full" />
                        <div className="h-8 bg-gray-200 rounded-full w-full mt-3" />
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Empty state */}
              {!loading && products.length === 0 && (
                <div className="text-center py-24 text-gray-400">
                  <Leaf className="w-16 h-16 mx-auto mb-4 opacity-20" />
                  <p className="text-lg font-medium">
                    {language === 'ar' ? 'لا توجد منتجات حالياً' : 'No products available'}
                  </p>
                  <p className="text-sm mt-1">
                    {language === 'ar' ? 'يمكنك إضافة منتجات من لوحة التحكم' : 'Add products from the admin panel'}
                  </p>
                </div>
              )}

              {/* Products grid */}
              {!loading && products.length > 0 && (
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
                  {products.map(p => (
                    <ProductCard
                      key={p.id}
                      id={p.id}
                      name={p.name}
                      nameEn={p.nameEn}
                      price={p.price}
                      image={p.primaryImage}
                      description={language === 'en' ? (p.descriptionEn ?? p.description ?? undefined) : (p.description ?? undefined)}
                      stockQuantity={p.stock_quantity ?? undefined}
                    />
                  ))}
                </div>
              )}
            </div>
          </section>

          {/* ── 4. Bottom Banner (from admin) ── */}
          <BottomBanner />

        </main>

        <Footer />
      </div>
    </>
  );
};

export default Index;
