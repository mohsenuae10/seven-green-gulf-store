import { useEffect, useState } from "react";
import { Helmet } from "react-helmet";
import { useLanguage } from "@/hooks/useLanguage";
import { supabase } from "@/integrations/supabase/client";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import MobileNav from "@/components/MobileNav";
import ProductCard from "@/components/ProductCard";
import { Skeleton } from "@/components/ui/skeleton";
import { Package } from "lucide-react";

interface Product {
  id: string;
  name: string;
  price: number;
  description: string | null;
  image_url: string | null;
  stock_quantity: number | null;
  is_active: boolean | null;
}

interface ProductWithImage extends Product {
  primaryImage: string;
}

const Products = () => {
  const { language } = useLanguage();
  const [products, setProducts] = useState<ProductWithImage[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      try {
        const { data: prods } = await supabase
          .from("products")
          .select("*")
          .eq("is_active", true)
          .order("created_at", { ascending: false });

        if (!prods || prods.length === 0) { setProducts([]); return; }

        // Fetch primary images for all products
        const { data: images } = await supabase
          .from("product_images")
          .select("product_id, image_url, is_primary, display_order")
          .in("product_id", prods.map(p => p.id))
          .order("display_order");

        const withImages: ProductWithImage[] = prods.map(p => {
          const imgs = images?.filter(i => i.product_id === p.id) ?? [];
          const primary = imgs.find(i => i.is_primary) ?? imgs[0];
          return {
            ...p,
            primaryImage: primary?.image_url ?? p.image_url ?? "/images/sevengreen-logo.webp",
          };
        });

        setProducts(withImages);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const title = language === 'ar'
    ? "سفن جرين 🌿 صابونة وشامبو بار عشبي | علاج تساقط الشعر الطبيعي"
    : "Seven Green | Herbal Shampoo Bar | Natural Hair Loss Treatment - DHT Blocker";
  const description = language === 'ar'
    ? "متجر سفن جرين الرسمي — صابون شامبو بار عشبي طبيعي 100% بخلاصة السرو والأوسمان والجينسينج. مثبط DHT طبيعي لعلاج تساقط الشعر وتكثيفه. خالي من الكبريتات."
    : "Seven Green Official Store — 100% natural herbal shampoo bar with cypress, usman grass and ginseng. Natural DHT blocker for hair loss treatment. Sulfate-free, for all hair types.";

  return (
    <>
      <Helmet>
        <title>{title}</title>
        <meta name="description" content={description} />
        <meta name="keywords" content={language === 'ar'
          ? "سفن جرين, صابونة سفن جرين, شامبو سفن جرين, صابون شامبو بار, شامبو بار للشعر, صابونة الأعشاب الصينية, مثبط DHT, علاج تساقط الشعر, الصابونة المثلثة, سيفن جرين, سيفن جرين نيتشر, سفن قرين, تقوية جذور الشعر, العناية بفروة الرأس, تكثيف الشعر, صابون عشبي, السرو والأوسمان, خالي من الكبريتات"
          : "seven green, seven green shampoo bar, seven green soap, nature seven green, sevengreen, nature triangle shampoo bar, DHT blocker shampoo, polygonum shampoo, usman grass shampoo, Chinese herbal hair soap, solid shampoo bar, sulfate-free, hair loss treatment, hair growth soap, scalp care, green triangle soap"
        } />
        <link rel="canonical" href="https://sevensgreen.com/products" />
        <link rel="alternate" hreflang="ar" href="https://sevensgreen.com/products" />
        <link rel="alternate" hreflang="en" href="https://sevensgreen.com/en/products" />
      </Helmet>

      <div className="min-h-screen bg-gray-50">
        <Header />
        <MobileNav />

        <main className="container mx-auto px-4 py-10 max-w-6xl">
          {/* Page header */}
          <div className={`mb-8 ${language === 'ar' ? 'text-right' : 'text-left'}`}>
            <h1 className="text-3xl font-black text-gray-900 mb-2">
              {language === 'ar' ? 'منتجاتنا' : 'Our Products'}
            </h1>
            <p className="text-gray-500">
              {language === 'ar'
                ? 'منتجات طبيعية 100% لعناية الشعر'
                : '100% natural products for hair care'}
            </p>
          </div>

          {/* Loading */}
          {loading && (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="bg-white rounded-2xl overflow-hidden">
                  <Skeleton className="aspect-square w-full" />
                  <div className="p-4 space-y-2">
                    <Skeleton className="h-4 w-3/4" />
                    <Skeleton className="h-3 w-full" />
                    <Skeleton className="h-8 w-full mt-2" />
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Empty */}
          {!loading && products.length === 0 && (
            <div className="text-center py-24 text-gray-400">
              <Package className="w-16 h-16 mx-auto mb-4 opacity-30" />
              <p className="text-lg">
                {language === 'ar' ? 'لا توجد منتجات حالياً' : 'No products available'}
              </p>
            </div>
          )}

          {/* Products grid */}
          {!loading && products.length > 0 && (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
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
        </main>

        <Footer />
      </div>
    </>
  );
};

export default Products;
