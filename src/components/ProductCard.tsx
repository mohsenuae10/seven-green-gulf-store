import LangLink from "@/components/LangLink";
import { ShoppingCart, Eye, Star, Zap, Minus, Plus, Trash2, Truck } from "lucide-react";
import { useStoreTheme } from "@/hooks/useStoreTheme";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useCart } from "@/contexts/CartContext";
import { useLanguage, useLangPath } from "@/hooks/useLanguage";
import { useCurrency } from "@/hooks/useCurrency";
import { PriceDisplay } from "@/components/PriceDisplay";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";

interface ProductCardProps {
  id: string;
  name: string;
  nameEn?: string;
  price: number;
  image: string;
  description?: string;
  stockQuantity?: number;
  isActive?: boolean;
}

const ProductCard = ({ id, name, nameEn, price, image, description, stockQuantity }: ProductCardProps) => {
  const { language } = useLanguage();
  const langPath = useLangPath();
  const { getPriceData } = useCurrency();
  const { addItem, items, setItemQuantity, updateQty } = useCart();
  const { toast } = useToast();
  const navigate = useNavigate();
  const { productCard } = useStoreTheme();

  const displayName = language === 'ar' ? name : (nameEn || name);
  const inCart = items.find(i => i.productId === id);
  const inStock = stockQuantity === undefined || stockQuantity === null || stockQuantity > 0;

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addItem({
      productId: id,
      name,
      nameEn: nameEn || name,
      price,
      image,
    });
    toast({
      title: language === 'ar' ? 'تمت الإضافة للسلة ✓' : 'Added to cart ✓',
      description: displayName,
    });
  };

  const handleBuyNow = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setItemQuantity({ productId: id, name, nameEn: nameEn || name, price, image }, inCart ? inCart.quantity : 1);
    navigate(langPath('/order'));
  };

  // ── "Simple" theme: one big action that turns into a quantity stepper ──
  if (productCard === 'simple') {
    const isAr = language === 'ar';
    const add = (e: React.MouseEvent) => {
      e.preventDefault();
      e.stopPropagation();
      addItem({ productId: id, name, nameEn: nameEn || name, price, image });
    };
    const change = (delta: number) => (e: React.MouseEvent) => {
      e.preventDefault();
      e.stopPropagation();
      if (inCart) updateQty(id, inCart.quantity + delta);
    };

    return (
      <div className="bg-white rounded-2xl border border-[#E3EADF] overflow-hidden flex flex-col">
        <LangLink to={`/product/${id}`} className="relative block aspect-square bg-[#E9F0E6]">
          <img
            src={image || "/images/sevengreen-logo.webp"}
            alt={displayName}
            className="w-full h-full object-cover"
            loading="lazy"
            onError={(e) => { e.currentTarget.src = "/images/sevengreen-logo.webp"; }}
          />
          <span className="absolute top-2 start-2 inline-flex items-center gap-1 bg-white/95 text-[#2F6B2A] text-[11px] font-bold px-2 py-0.5 rounded-full">
            <Truck className="w-3 h-3" />
            {isAr ? 'شحن مجاني' : 'Free shipping'}
          </span>
          {!inStock && (
            <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
              <Badge variant="destructive" className="text-sm px-3 py-1">
                {isAr ? 'نفذت الكمية' : 'Out of Stock'}
              </Badge>
            </div>
          )}
        </LangLink>

        <div className="flex flex-col flex-1 p-3 gap-1.5">
          <LangLink to={`/product/${id}`}>
            <h3 className="text-sm font-bold text-gray-900 leading-snug line-clamp-2 min-h-[2.6em]">{displayName}</h3>
          </LangLink>
          {description && <p className="text-xs text-[#5B6656] line-clamp-1">{description}</p>}
          <div className="mt-auto pt-1 text-xl font-extrabold text-primary">
            <PriceDisplay {...getPriceData(price)} />
          </div>

          {inCart ? (
            <div className="h-11 rounded-xl border-[1.5px] border-primary bg-[#E9F0E6] flex items-center justify-between">
              <button
                type="button"
                onClick={change(1)}
                aria-label={isAr ? 'زيادة الكمية' : 'Increase quantity'}
                className="w-11 h-full flex items-center justify-center text-[#2A3D25]"
              >
                <Plus className="w-4 h-4" />
              </button>
              <span className="text-sm font-extrabold text-[#2A3D25]">
                {inCart.quantity} {isAr ? 'في السلة' : 'in cart'}
              </span>
              <button
                type="button"
                onClick={change(-1)}
                aria-label={inCart.quantity === 1 ? (isAr ? 'حذف من السلة' : 'Remove') : (isAr ? 'إنقاص الكمية' : 'Decrease quantity')}
                className="w-11 h-full flex items-center justify-center text-[#2A3D25]"
              >
                {inCart.quantity === 1 ? <Trash2 className="w-4 h-4" /> : <Minus className="w-4 h-4" />}
              </button>
            </div>
          ) : (
            <Button
              onClick={add}
              disabled={!inStock}
              className="h-11 rounded-xl gap-1.5 text-sm font-extrabold bg-primary hover:bg-primary/90 text-white"
            >
              <ShoppingCart className="w-4 h-4" />
              {isAr ? 'أضف للسلة' : 'Add to cart'}
            </Button>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="group relative bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden flex flex-col" onClick={() => {}}>
      {/* Image */}
      <LangLink to={`/product/${id}`} className="block relative overflow-hidden bg-gray-50">
        <div className="aspect-square">
          <img
            src={image || "/images/sevengreen-logo.webp"}
            alt={displayName}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            onError={(e) => { e.currentTarget.src = "/images/sevengreen-logo.webp"; }}
          />
        </div>
        {/* Out of stock badge */}
        {!inStock && (
          <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
            <Badge variant="destructive" className="text-sm px-3 py-1">
              {language === 'ar' ? 'نفذت الكمية' : 'Out of Stock'}
            </Badge>
          </div>
        )}
        {/* Quick view overlay */}
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300 flex items-center justify-center opacity-0 group-hover:opacity-100">
          <LangLink
            to={`/product/${id}`}
            className="bg-white text-primary rounded-full px-4 py-1.5 text-sm font-medium flex items-center gap-1.5 shadow"
            onClick={e => e.stopPropagation()}
          >
            <Eye className="w-3.5 h-3.5" />
            {language === 'ar' ? 'عرض' : 'View'}
          </LangLink>
        </div>
      </LangLink>

      {/* Content */}
      <div className="flex flex-col flex-1 p-4 gap-3">
        {/* Rating */}
        <div className="flex items-center gap-1">
          {[1,2,3,4,5].map(s => (
            <Star key={s} className="w-3.5 h-3.5 fill-yellow-400 text-yellow-400" />
          ))}
          <span className="text-xs text-gray-400 ml-1">5.0</span>
        </div>

        {/* Name */}
        <LangLink to={`/product/${id}`}>
          <h3 className="font-bold text-gray-900 leading-snug hover:text-primary transition-colors line-clamp-2">
            {displayName}
          </h3>
        </LangLink>

        {/* Description */}
        {description && (
          <p className="text-xs text-gray-500 line-clamp-2 leading-relaxed">{description}</p>
        )}

        {/* Price + Buttons */}
        <div className="mt-auto pt-2 border-t border-gray-50 space-y-2">
          <div className="text-xl font-black text-primary">
            <PriceDisplay {...getPriceData(price)} />
          </div>
          <div className="grid grid-cols-2 gap-1.5">
            <Button
              size="sm"
              onClick={handleAddToCart}
              disabled={!inStock}
              className={`rounded-full gap-1 text-xs px-2 ${
                inCart
                  ? 'bg-green-600 hover:bg-green-700 text-white'
                  : 'bg-gray-100 hover:bg-gray-200 text-gray-800'
              }`}
            >
              <ShoppingCart className="w-3.5 h-3.5 shrink-0" />
              <span className="truncate">
                {inCart
                  ? (language === 'ar' ? `السلة (${inCart.quantity})` : `Cart (${inCart.quantity})`)
                  : (language === 'ar' ? 'السلة' : 'Cart')
                }
              </span>
            </Button>
            <Button
              size="sm"
              onClick={handleBuyNow}
              disabled={!inStock}
              className="rounded-full gap-1 text-xs px-2 bg-primary hover:bg-primary/90 text-white"
            >
              <Zap className="w-3.5 h-3.5 shrink-0" />
              <span className="truncate">
                {language === 'ar' ? 'اشتر الآن' : 'Buy Now'}
              </span>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
