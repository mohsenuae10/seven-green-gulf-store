import { useState } from 'react';
import { Star, Shield, Lock, RefreshCw, ShoppingCart } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { PriceDisplay } from '@/components/PriceDisplay';
import PaymentMethods from '@/components/PaymentMethods';
import { ProductQuantitySelector } from './ProductQuantitySelector';
import { useLanguage } from '@/hooks/useLanguage';
import { useCurrency } from '@/hooks/useCurrency';
import { useProductPrice } from '@/hooks/useProductPrice';
import { useCart } from '@/contexts/CartContext';
import { useToast } from '@/hooks/use-toast';

interface ProductInfoProps {
  productId?: string;
  productName: string;
  sku?: string;
  // Override hook price with specific product price
  priceOverride?: number;
  stockOverride?: number;
  descriptionOverride?: string;
  imageForCart?: string;
}

export const ProductInfo = ({
  productId,
  productName,
  sku = 'SG-TRIANGLE-001',
  priceOverride,
  stockOverride,
  descriptionOverride,
  imageForCart,
}: ProductInfoProps) => {
  const { language } = useLanguage();
  const { getPriceData } = useCurrency();
  const { price: hookPrice, stockQuantity: hookStock, loading } = useProductPrice({ fallback: 71 });
  const { addItem, items, updateQty } = useCart();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [quantity, setQuantity] = useState(1);

  const price = priceOverride ?? hookPrice;
  const stockQuantity = stockOverride ?? hookStock;
  const priceData = getPriceData(price);

  const cartItem = productId ? items.find(i => i.productId === productId) : undefined;

  const handleAddToCart = () => {
    if (!productId) { navigate(`/order?qty=${quantity}`); return; }
    if (cartItem) {
      updateQty(productId, cartItem.quantity + quantity);
    } else {
      addItem({
        productId,
        name: productName,
        nameEn: productName,
        price,
        image: imageForCart || '/images/sevengreen-logo.webp',
      }, quantity);
    }
    toast({
      title: language === 'ar' ? 'تمت الإضافة للسلة ✓' : 'Added to cart ✓',
      description: `${productName} × ${quantity}`,
    });
  };

  const handleBuyNow = () => {
    handleAddToCart();
    navigate('/order');
  };

  return (
    <div className="space-y-6">
      {/* Brand & Title */}
      <div className="space-y-2">
        <div className="flex items-center gap-2">
          <Badge variant="secondary" className="text-xs">SEVEN GREEN</Badge>
          <span className="text-sm text-muted-foreground">SKU: {sku}</span>
        </div>
        <h1 className="text-3xl lg:text-4xl font-bold">{productName}</h1>
      </div>

      {/* Rating */}
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-1">
          {[1,2,3,4,5].map(s => (
            <Star key={s} className="w-5 h-5 fill-yellow-400 text-yellow-400" />
          ))}
        </div>
        <span className="font-semibold">4.8/5</span>
        <a href="#reviews" className="text-sm text-primary hover:underline">
          ({language === 'ar' ? '2847 تقييم' : '2847 reviews'})
        </a>
      </div>

      {/* Price */}
      <div className="space-y-1">
        {loading && !priceOverride ? (
          <div className="h-10 w-32 bg-muted animate-pulse rounded" />
        ) : (
          <div className="flex items-baseline gap-3">
            <PriceDisplay
              amount={priceData.amount}
              currency={priceData.currency}
              className="text-4xl font-bold text-primary"
            />
          </div>
        )}
      </div>

      {/* Stock Status */}
      <div className="flex items-center gap-2">
        {stockQuantity > 0 ? (
          <Badge variant="default" className="bg-green-600">
            {language === 'ar' ? '✓ متوفر في المخزون' : '✓ In Stock'}
          </Badge>
        ) : (
          <Badge variant="destructive">
            {language === 'ar' ? 'نفذت الكمية' : 'Out of Stock'}
          </Badge>
        )}
      </div>

      {/* Trust Badges */}
      <div className="grid grid-cols-2 gap-3">
        <div className="flex items-center gap-2 text-sm">
          <Shield className="w-4 h-4 text-primary" />
          <span>{language === 'ar' ? 'طبيعي 100%' : '100% Natural'}</span>
        </div>
        <div className="flex items-center gap-2 text-sm">
          <RefreshCw className="w-4 h-4 text-primary" />
          <span>{language === 'ar' ? 'ضمان 30 يوم' : '30-Day Guarantee'}</span>
        </div>
        <div className="flex items-center gap-2 text-sm">
          <Lock className="w-4 h-4 text-primary" />
          <span>{language === 'ar' ? 'دفع آمن' : 'Secure Payment'}</span>
        </div>
      </div>

      {/* Description */}
      <div className="prose prose-sm dark:prose-invert">
        <p className="text-muted-foreground">
          {descriptionOverride || (language === 'ar'
            ? 'صابونة طبيعية 100% لعلاج تساقط الشعر وتكثيفه بمكونات عشبية فريدة من السرو والأوسمان. تركيبة فريدة تجمع بين 7 أعشاب طبيعية لنتائج مذهلة.'
            : '100% natural soap for hair loss treatment with unique herbal ingredients. A unique formula combining 7 natural herbs for amazing results.'
          )}
        </p>
      </div>

      {/* Quantity Selector */}
      <ProductQuantitySelector
        quantity={quantity}
        onQuantityChange={setQuantity}
        maxQuantity={stockQuantity}
        inStock={stockQuantity > 0}
      />

      {/* CTA Buttons */}
      <div className="space-y-3">
        <Button
          onClick={handleAddToCart}
          variant="outline"
          size="lg"
          className="w-full text-lg gap-2"
          disabled={stockQuantity === 0}
        >
          <ShoppingCart className="w-5 h-5" />
          {cartItem
            ? (language === 'ar' ? `في السلة (${cartItem.quantity}) — تحديث` : `In Cart (${cartItem.quantity}) — Update`)
            : (language === 'ar' ? 'أضف إلى السلة' : 'Add to Cart')
          }
        </Button>
        <Button
          onClick={handleBuyNow}
          variant="hero"
          size="lg"
          className="w-full text-lg"
          disabled={stockQuantity === 0}
        >
          {language === 'ar' ? '🛒 اشترِ الآن' : '🛒 Buy Now'}
        </Button>
      </div>

      {/* Payment Methods */}
      <div className="border-t pt-4">
        <p className="text-sm font-semibold mb-2">
          {language === 'ar' ? 'طرق الدفع المتاحة:' : 'Available Payment Methods:'}
        </p>
        <PaymentMethods />
      </div>
    </div>
  );
};
