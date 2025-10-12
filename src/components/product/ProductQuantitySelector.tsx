import { Minus, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useLanguage } from '@/hooks/useLanguage';

interface ProductQuantitySelectorProps {
  quantity: number;
  onQuantityChange: (qty: number) => void;
  maxQuantity: number;
  inStock: boolean;
}

export const ProductQuantitySelector = ({
  quantity,
  onQuantityChange,
  maxQuantity,
  inStock,
}: ProductQuantitySelectorProps) => {
  const { language } = useLanguage();

  const handleDecrease = () => {
    if (quantity > 1) {
      onQuantityChange(quantity - 1);
    }
  };

  const handleIncrease = () => {
    if (quantity < maxQuantity) {
      onQuantityChange(quantity + 1);
    }
  };

  if (!inStock) {
    return (
      <div className="text-destructive font-semibold">
        {language === 'ar' ? 'نفذت الكمية' : 'Out of Stock'}
      </div>
    );
  }

  return (
    <div className="space-y-2">
      <div className="flex items-center gap-3">
        <span className="text-sm font-medium">
          {language === 'ar' ? 'الكمية:' : 'Quantity:'}
        </span>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="icon"
            onClick={handleDecrease}
            disabled={quantity <= 1}
            className="h-10 w-10"
          >
            <Minus className="w-4 h-4" />
          </Button>
          <span className="w-12 text-center font-semibold text-lg">{quantity}</span>
          <Button
            variant="outline"
            size="icon"
            onClick={handleIncrease}
            disabled={quantity >= maxQuantity}
            className="h-10 w-10"
          >
            <Plus className="w-4 h-4" />
          </Button>
        </div>
      </div>
      
      {maxQuantity < 10 && (
        <p className="text-sm text-amber-600 dark:text-amber-500">
          {language === 'ar' 
            ? `${maxQuantity} قطع فقط متبقية!`
            : `Only ${maxQuantity} items left!`
          }
        </p>
      )}
      
      <p className="text-xs text-muted-foreground">
        {language === 'ar' 
          ? `متوفر في المخزون: ${maxQuantity} قطعة`
          : `Available in stock: ${maxQuantity} items`
        }
      </p>
    </div>
  );
};
