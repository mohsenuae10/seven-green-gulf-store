import { useState } from 'react';
import { Star, Shield, Lock, RefreshCw } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { PriceDisplay } from '@/components/PriceDisplay';
import PaymentMethods from '@/components/PaymentMethods';
import { ProductQuantitySelector } from './ProductQuantitySelector';
import { useLanguage } from '@/hooks/useLanguage';
import { useCurrency } from '@/hooks/useCurrency';
import { useProductPrice } from '@/hooks/useProductPrice';

interface ProductInfoProps {
  productId?: string;
  productName: string;
  sku?: string;
}

export const ProductInfo = ({ productName, sku = 'SG-TRIANGLE-001' }: ProductInfoProps) => {
  const { language } = useLanguage();
  const { getPriceData } = useCurrency();
  const { price, stockQuantity, loading } = useProductPrice({ fallback: 71 });
  const navigate = useNavigate();
  const [quantity, setQuantity] = useState(1);

  const handleBuyNow = () => {
    navigate(`/order?qty=${quantity}`);
  };

  const priceData = getPriceData(price);

  return (
    <div className="space-y-6">
      {/* Brand & Title */}
      <div className="space-y-2">
        <div className="flex items-center gap-2">
          <Badge variant="secondary" className="text-xs">
            SEVEN GREEN
          </Badge>
          <span className="text-sm text-muted-foreground">SKU: {sku}</span>
        </div>
        <h1 className="text-3xl lg:text-4xl font-bold">
          {language === 'ar' ? productName : 'Seven Green Triangle Soap'}
        </h1>
      </div>

      {/* Rating */}
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-1">
          {[1, 2, 3, 4, 5].map((star) => (
            <Star key={star} className="w-5 h-5 fill-yellow-400 text-yellow-400" />
          ))}
        </div>
        <span className="font-semibold">4.8/5</span>
        <a href="#reviews" className="text-sm text-primary hover:underline">
          ({language === 'ar' ? '2847 تقييم' : '2847 reviews'})
        </a>
      </div>

      {/* Price */}
      <div className="space-y-1">
        {loading ? (
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

      {/* Short Description */}
      <div className="prose prose-sm dark:prose-invert">
        <p className="text-muted-foreground">
          {language === 'ar' 
            ? 'صابونة طبيعية 100% لعلاج تساقط الشعر وتكثيفه بمكونات عشبية فريدة من السرو والأوسمان. تركيبة فريدة تجمع بين 7 أعشاب طبيعية لنتائج مذهلة.'
            : '100% natural soap for hair loss treatment with unique herbal ingredients from cypress and laurel. A unique formula combining 7 natural herbs for amazing results.'
          }
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
