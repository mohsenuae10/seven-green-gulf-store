import { Link } from "react-router-dom";
import { ShoppingCart, Eye, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useCart } from "@/contexts/CartContext";
import { useLanguage } from "@/hooks/useLanguage";
import { useCurrency } from "@/hooks/useCurrency";
import { PriceDisplay } from "@/components/PriceDisplay";
import { useToast } from "@/hooks/use-toast";

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
  const { getPriceData } = useCurrency();
  const { addItem, items } = useCart();
  const { toast } = useToast();

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

  return (
    <div className="group relative bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden flex flex-col">
      {/* Image */}
      <Link to={`/product/${id}`} className="block relative overflow-hidden bg-gray-50">
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
          <Link
            to={`/product/${id}`}
            className="bg-white text-primary rounded-full px-4 py-1.5 text-sm font-medium flex items-center gap-1.5 shadow"
            onClick={e => e.stopPropagation()}
          >
            <Eye className="w-3.5 h-3.5" />
            {language === 'ar' ? 'عرض' : 'View'}
          </Link>
        </div>
      </Link>

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
        <Link to={`/product/${id}`}>
          <h3 className="font-bold text-gray-900 leading-snug hover:text-primary transition-colors line-clamp-2">
            {displayName}
          </h3>
        </Link>

        {/* Description */}
        {description && (
          <p className="text-xs text-gray-500 line-clamp-2 leading-relaxed">{description}</p>
        )}

        {/* Price + Cart */}
        <div className="flex items-center justify-between mt-auto pt-2 border-t border-gray-50">
          <div className="text-xl font-black text-primary">
            <PriceDisplay {...getPriceData(price)} />
          </div>
          <Button
            size="sm"
            onClick={handleAddToCart}
            disabled={!inStock}
            className={`rounded-full gap-1.5 text-xs px-3 ${
              inCart ? 'bg-green-600 hover:bg-green-700' : 'bg-primary hover:bg-primary/90'
            }`}
          >
            <ShoppingCart className="w-3.5 h-3.5" />
            {inCart
              ? (language === 'ar' ? `في السلة (${inCart.quantity})` : `In Cart (${inCart.quantity})`)
              : (language === 'ar' ? 'أضف للسلة' : 'Add to Cart')
            }
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
