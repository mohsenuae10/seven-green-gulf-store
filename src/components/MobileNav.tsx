import { Link, useLocation } from "react-router-dom";
import { ShoppingCart, Plus, Minus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/hooks/useLanguage";
import { useProductPrice } from "@/hooks/useProductPrice";
import { useCurrency } from "@/hooks/useCurrency";
import { Skeleton } from "@/components/ui/skeleton";
import { PriceDisplay } from "@/components/PriceDisplay";
import { useState } from "react";

const MobileNav = () => {
  const location = useLocation();
  const isOrderPage = location.pathname === "/order";
  const isHomePage = location.pathname === "/";
  const { t, language } = useLanguage();
  const { price: productPrice, loading: priceLoading } = useProductPrice({ fallback: 85 });
  const { getPriceData, selectedCurrency } = useCurrency();
  const [quantity, setQuantity] = useState(1);

  const handleIncrement = () => setQuantity(prev => prev + 1);
  const handleDecrement = () => setQuantity(prev => Math.max(1, prev - 1));
  const totalPrice = productPrice * quantity;

  // Don't show on order page or home page
  if (isOrderPage || isHomePage) {
    return null;
  }

  return (
    <>
      {/* Mobile Buy Now Button - Fixed Bottom */}
      <div className="fixed bottom-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-md border-t border-border shadow-strong sm:hidden">
        <div className="p-3 space-y-2">
          {/* Quantity Selector */}
          <div className="flex items-center justify-center gap-3 mb-2">
            <Button
              onClick={handleDecrement}
              variant="outline"
              size="sm"
              className="h-9 w-9 rounded-full p-0 touch-target"
              disabled={quantity === 1}
            >
              <Minus className="w-4 h-4" />
            </Button>
            <div className="flex flex-col items-center min-w-[60px]">
              <span className="text-xs text-muted-foreground">{language === 'ar' ? 'الكمية' : 'Quantity'}</span>
              <span className="text-xl font-bold text-foreground">{quantity}</span>
            </div>
            <Button
              onClick={handleIncrement}
              variant="outline"
              size="sm"
              className="h-9 w-9 rounded-full p-0 touch-target"
            >
              <Plus className="w-4 h-4" />
            </Button>
          </div>

          {/* Buy Now Button */}
          <Link to="/order" className="block">
            <Button 
              size="lg" 
              className="w-full bg-gradient-primary hover:scale-105 transition-all duration-300 shadow-elegant hover:shadow-glow text-base py-5 rounded-full touch-target"
            >
              <ShoppingCart className={`w-5 h-5 ${language === 'ar' ? 'ml-2' : 'mr-2'}`} />
              {t('hero.buy.now')} - {priceLoading ? <Skeleton className="inline w-16 h-4" /> : (
                <span className="flex items-center gap-2">
                  <span className="text-white/90">{language === 'ar' ? 'السعر:' : 'Price:'}</span>
                  <PriceDisplay {...getPriceData(totalPrice)} className="text-white font-bold" />
                </span>
              )}
            </Button>
          </Link>
        </div>
      </div>

    </>
  );
};

export default MobileNav;