import { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { Helmet } from "react-helmet";
import { ChevronRight, ShoppingCart, Star, Package, ChevronLeft, ChevronRight as ChevronRightIcon, Plus, Minus } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useLanguage } from "@/hooks/useLanguage";
import { useCurrency } from "@/hooks/useCurrency";
import { useCart } from "@/contexts/CartContext";
import { useToast } from "@/hooks/use-toast";
import { PriceDisplay } from "@/components/PriceDisplay";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import Header from "@/components/Header";
import MobileNav from "@/components/MobileNav";
import Footer from "@/components/Footer";

interface ProductData {
  id: string;
  name: string;
  price: number;
  description: string | null;
  stock_quantity: number | null;
  image_url: string | null;
}

interface ProductImage {
  id: string;
  image_url: string;
  alt_text: string | null;
  display_order: number;
  is_primary: boolean;
}

const ProductDetail = () => {
  const { id } = useParams<{ id: string }>();
  const { language } = useLanguage();
  const { getPriceData } = useCurrency();
  const { addItem, items, updateQty } = useCart();
  const { toast } = useToast();
  const navigate = useNavigate();

  const [product, setProduct] = useState<ProductData | null>(null);
  const [images, setImages] = useState<ProductImage[]>([]);
  const [selectedImg, setSelectedImg] = useState(0);
  const [qty, setQty] = useState(1);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  const cartItem = items.find(i => i.productId === id);
  const inStock = !product?.stock_quantity || product.stock_quantity > 0;

  useEffect(() => {
    if (!id) { setNotFound(true); return; }
    const load = async () => {
      setLoading(true);
      const { data: prod } = await supabase
        .from("products")
        .select("*")
        .eq("id", id)
        .eq("is_active", true)
        .maybeSingle();

      if (!prod) { setNotFound(true); setLoading(false); return; }
      setProduct(prod);

      const { data: imgs } = await supabase
        .from("product_images")
        .select("*")
        .eq("product_id", id)
        .order("display_order");

      setImages(imgs ?? []);
      setLoading(false);
    };
    load();
  }, [id]);

  const allImages = images.length > 0
    ? images.map(i => ({ url: i.image_url, alt: i.alt_text || product?.name || "" }))
    : [{ url: product?.image_url || "/images/sevengreen-logo.webp", alt: product?.name || "" }];

  const handleAddToCart = () => {
    if (!product) return;
    if (cartItem) {
      updateQty(product.id, cartItem.quantity + qty);
    } else {
      addItem({
        productId: product.id,
        name: product.name,
        nameEn: product.name,
        price: product.price,
        image: allImages[0].url,
      }, qty);
    }
    toast({
      title: language === 'ar' ? 'تمت الإضافة للسلة ✓' : 'Added to cart ✓',
      description: `${product.name} × ${qty}`,
    });
  };

  if (notFound) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="flex flex-col items-center justify-center py-32 text-gray-400">
          <Package className="w-16 h-16 mb-4 opacity-30" />
          <p className="text-lg">{language === 'ar' ? 'المنتج غير موجود' : 'Product not found'}</p>
          <Link to="/products" className="mt-4 text-primary hover:underline text-sm">
            {language === 'ar' ? '← العودة للمنتجات' : '← Back to products'}
          </Link>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <>
      {product && (
        <Helmet>
          <title>{product.name} | سفن جرين Seven Green</title>
          <meta name="description" content={product.description || product.name} />
        </Helmet>
      )}

      <div className="min-h-screen bg-gray-50">
        <Header />
        <MobileNav />

        <main className="container mx-auto px-4 py-8 max-w-5xl">
          {/* Breadcrumb */}
          <nav className={`flex items-center gap-1.5 text-sm text-gray-500 mb-6 ${language === 'ar' ? 'flex-row-reverse justify-end' : ''}`}>
            <Link to="/" className="hover:text-primary">{language === 'ar' ? 'الرئيسية' : 'Home'}</Link>
            {language === 'ar' ? <ChevronLeft className="w-3.5 h-3.5" /> : <ChevronRightIcon className="w-3.5 h-3.5" />}
            <Link to="/products" className="hover:text-primary">{language === 'ar' ? 'المنتجات' : 'Products'}</Link>
            {language === 'ar' ? <ChevronLeft className="w-3.5 h-3.5" /> : <ChevronRightIcon className="w-3.5 h-3.5" />}
            <span className="text-gray-900 font-medium truncate max-w-[180px]">{product?.name}</span>
          </nav>

          {loading ? (
            <div className="grid md:grid-cols-2 gap-8">
              <Skeleton className="aspect-square rounded-2xl" />
              <div className="space-y-4">
                <Skeleton className="h-8 w-3/4" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-5/6" />
                <Skeleton className="h-12 w-1/2 mt-4" />
                <Skeleton className="h-12 w-full mt-2" />
              </div>
            </div>
          ) : product && (
            <div className="grid md:grid-cols-2 gap-8 lg:gap-12">
              {/* Images */}
              <div className="space-y-3">
                <div className="aspect-square bg-white rounded-2xl overflow-hidden border border-gray-100 shadow-sm">
                  <img
                    src={allImages[selectedImg]?.url}
                    alt={allImages[selectedImg]?.alt}
                    className="w-full h-full object-contain p-4"
                    onError={(e) => { e.currentTarget.src = "/images/sevengreen-logo.webp"; }}
                  />
                </div>
                {allImages.length > 1 && (
                  <div className="flex gap-2 overflow-x-auto pb-1">
                    {allImages.map((img, idx) => (
                      <button
                        key={idx}
                        onClick={() => setSelectedImg(idx)}
                        className={`shrink-0 w-16 h-16 rounded-lg overflow-hidden border-2 transition-all ${
                          selectedImg === idx ? 'border-primary' : 'border-gray-100 hover:border-gray-300'
                        }`}
                      >
                        <img src={img.url} alt={img.alt} className="w-full h-full object-cover"
                          onError={(e) => { e.currentTarget.src = "/images/sevengreen-logo.webp"; }} />
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Info */}
              <div className={`space-y-5 ${language === 'ar' ? 'text-right' : 'text-left'}`}>
                {/* Stock badge */}
                <Badge variant={inStock ? "secondary" : "destructive"} className="text-xs">
                  {inStock
                    ? (language === 'ar' ? '✓ متوفر في المخزون' : '✓ In Stock')
                    : (language === 'ar' ? 'نفذت الكمية' : 'Out of Stock')}
                </Badge>

                {/* Name */}
                <h1 className="text-2xl lg:text-3xl font-black text-gray-900 leading-tight">
                  {product.name}
                </h1>

                {/* Stars */}
                <div className={`flex items-center gap-1 ${language === 'ar' ? 'flex-row-reverse justify-end' : ''}`}>
                  {[1,2,3,4,5].map(s => (
                    <Star key={s} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                  ))}
                  <span className="text-sm text-gray-500 ml-2">5.0 (2847+)</span>
                </div>

                {/* Price */}
                <div className="text-3xl font-black text-primary">
                  <PriceDisplay {...getPriceData(product.price)} />
                </div>

                {/* Description */}
                {product.description && (
                  <p className="text-gray-600 leading-relaxed text-sm">{product.description}</p>
                )}

                {/* Quantity */}
                <div className={`flex items-center gap-3 ${language === 'ar' ? 'flex-row-reverse justify-end' : ''}`}>
                  <span className="text-sm font-medium text-gray-700">
                    {language === 'ar' ? 'الكمية:' : 'Quantity:'}
                  </span>
                  <div className="flex items-center border border-gray-200 rounded-full overflow-hidden">
                    <button
                      onClick={() => setQty(q => Math.max(1, q - 1))}
                      className="w-9 h-9 flex items-center justify-center hover:bg-gray-100 transition-colors"
                    >
                      <Minus className="w-3.5 h-3.5" />
                    </button>
                    <span className="w-10 text-center font-bold text-sm">{qty}</span>
                    <button
                      onClick={() => setQty(q => q + 1)}
                      className="w-9 h-9 flex items-center justify-center hover:bg-gray-100 transition-colors"
                    >
                      <Plus className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                {/* Add to cart */}
                <div className="flex flex-col gap-3 pt-2">
                  <Button
                    size="lg"
                    onClick={handleAddToCart}
                    disabled={!inStock}
                    className="w-full rounded-full gap-2 text-base font-bold"
                  >
                    <ShoppingCart className="w-5 h-5" />
                    {cartItem
                      ? (language === 'ar' ? `تحديث السلة (${cartItem.quantity + qty})` : `Update Cart (${cartItem.quantity + qty})`)
                      : (language === 'ar' ? 'أضف إلى السلة' : 'Add to Cart')
                    }
                  </Button>
                  <Button
                    size="lg"
                    variant="outline"
                    className="w-full rounded-full text-base font-bold"
                    onClick={() => { handleAddToCart(); navigate("/order"); }}
                    disabled={!inStock}
                  >
                    {language === 'ar' ? 'اطلب الآن' : 'Buy Now'}
                  </Button>
                </div>

                {/* Trust badges */}
                <div className="grid grid-cols-3 gap-3 pt-2 border-t border-gray-100">
                  {[
                    { icon: '🚚', ar: 'شحن مجاني', en: 'Free Shipping' },
                    { icon: '🔄', ar: 'ضمان 30 يوم', en: '30-Day Guarantee' },
                    { icon: '🌿', ar: 'طبيعي 100%', en: '100% Natural' },
                  ].map(b => (
                    <div key={b.en} className="text-center text-xs text-gray-500">
                      <div className="text-xl mb-1">{b.icon}</div>
                      {language === 'ar' ? b.ar : b.en}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </main>

        <Footer />
      </div>
    </>
  );
};

export default ProductDetail;
