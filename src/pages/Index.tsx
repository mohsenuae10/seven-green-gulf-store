import { useEffect, useState } from "react";
import { Helmet } from "react-helmet";
import { Link } from "react-router-dom";
import Header from "@/components/Header";
import MobileNav from "@/components/MobileNav";
import Footer from "@/components/Footer";
import HomeBanner from "@/components/HomeBanner";
import ProductCard from "@/components/ProductCard";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/hooks/useLanguage";
import { supabase } from "@/integrations/supabase/client";
import { Shield, Truck, RefreshCw, Leaf, ChevronRight, ChevronLeft } from "lucide-react";

interface ProductWithImage {
  id: string;
  name: string;
  price: number;
  description: string | null;
  stock_quantity: number | null;
  primaryImage: string;
}

const Index = () => {
  const { language } = useLanguage();
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

      setProducts(prods.map(p => {
        const imgs = images?.filter(i => i.product_id === p.id) ?? [];
        const primary = imgs.find(i => i.is_primary) ?? imgs[0];
        return { ...p, primaryImage: primary?.image_url ?? p.image_url ?? "/images/sevengreen-logo.webp" };
      }));
      setLoading(false);
    };
    load();
  }, []);

  const ChevronIcon = language === 'ar' ? ChevronLeft : ChevronRight;

  const trustBadges = [
    { icon: Leaf,      ar: "طبيعي 100%",       en: "100% Natural" },
    { icon: Shield,    ar: "دفع آمن",            en: "Secure Payment" },
    { icon: Truck,     ar: "شحن مجاني",  en: "Free Shipping" },
    { icon: RefreshCw, ar: "ضمان 30 يوم",       en: "30-Day Guarantee" },
  ];

  return (
    <>
      <Helmet>
        <title>
          {language === 'ar'
            ? 'سفن جرين | منتجات طبيعية لعناية الشعر'
            : 'Seven Green | Natural Hair Care Products'}
        </title>
        <meta name="description" content={
          language === 'ar'
            ? 'سفن جرين — منتجات طبيعية 100% لعناية الشعر. صابونة وشامبو عشبي من السرو والأوسمان لعلاج تساقط الشعر. شحن مجاني.'
            : 'Seven Green — 100% natural hair care products. Herbal soap and shampoo from cypress and osman for hair loss treatment. Free worldwide shipping.'
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

      <div className="min-h-screen flex flex-col bg-white">
        <Header />
        <MobileNav />

        <main className="flex-1">

          {/* ── 1. Banner ── */}
          <HomeBanner />

          {/* ── 2. Trust Badges Strip ── */}
          <section className="bg-white border-b border-gray-100">
            <div className="container mx-auto px-4">
              <div className="grid grid-cols-2 md:grid-cols-4 divide-x divide-gray-100 rtl:divide-x-reverse">
                {trustBadges.map((b, i) => (
                  <div key={i} className="flex items-center justify-center gap-2.5 py-4 px-3">
                    <b.icon className="w-5 h-5 text-primary shrink-0" />
                    <span className="text-sm font-medium text-gray-700">
                      {language === 'ar' ? b.ar : b.en}
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
                      price={p.price}
                      image={p.primaryImage}
                      description={p.description ?? undefined}
                      stockQuantity={p.stock_quantity ?? undefined}
                    />
                  ))}
                </div>
              )}
            </div>
          </section>

          {/* ── 4. Bottom promotional strip ── */}
          <section className="py-16 bg-gradient-to-r from-primary via-green-600 to-green-700 text-white relative overflow-hidden">
            {/* Decorative circles */}
            <div className="absolute -top-10 -right-10 w-40 h-40 bg-white/5 rounded-full" />
            <div className="absolute -bottom-10 -left-10 w-56 h-56 bg-white/5 rounded-full" />

            <div className="container mx-auto px-4 text-center relative z-10">
              <p className="text-sm font-semibold tracking-widest uppercase text-white/70 mb-3">
                {language === 'ar' ? 'عرض حصري' : 'Exclusive Offer'}
              </p>
              <h2 className="text-2xl md:text-4xl font-black mb-3">
                🌿 {language === 'ar' ? 'شحن مجاني لجميع الدول' : 'Free Worldwide Shipping'}
              </h2>
              <p className="text-white/85 text-base md:text-lg mb-8 max-w-xl mx-auto">
                {language === 'ar'
                  ? 'اطلب الآن واستلم طلبك مع ضمان الجودة لمدة 30 يوم'
                  : 'Order now and receive with 30-day quality guarantee'}
              </p>
              <Link to="/products">
                <Button
                  size="lg"
                  className="bg-white text-primary hover:bg-white/90 font-bold rounded-full px-10 shadow-lg text-base gap-2"
                >
                  {language === 'ar' ? 'تسوق الآن' : 'Shop Now'}
                  <ChevronIcon className="w-4 h-4" />
                </Button>
              </Link>
            </div>
          </section>

        </main>

        <Footer />
      </div>
    </>
  );
};

export default Index;
