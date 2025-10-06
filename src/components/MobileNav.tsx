import { Link, useLocation } from "react-router-dom";
import { ShoppingCart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/hooks/useLanguage";
import { useProductPrice } from "@/hooks/useProductPrice";
import { useCurrency } from "@/hooks/useCurrency";
import { Skeleton } from "@/components/ui/skeleton";
import { PriceDisplay } from "@/components/PriceDisplay";

const MobileNav = () => {
  const location = useLocation();
  const isOrderPage = location.pathname === "/order";
  const { t, language } = useLanguage();
  const { price: productPrice, loading: priceLoading } = useProductPrice({ fallback: 85 });
  const { getPriceData, selectedCurrency } = useCurrency();

  if (isOrderPage) {
    return null;
  }

  return (
    <>
      {/* Mobile Buy Now Button - Fixed Bottom */}
      <div className="fixed bottom-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-md border-t border-border shadow-strong sm:hidden">
        <div className="p-4">
          <Link to="/order" className="block">
            <Button 
              size="lg" 
              className="w-full bg-gradient-primary hover:scale-105 transition-all duration-300 shadow-elegant hover:shadow-glow text-base py-5 rounded-full touch-target"
            >
              <ShoppingCart className={`w-5 h-5 ${language === 'ar' ? 'ml-2' : 'mr-2'}`} />
              {t('hero.buy.now')} - {priceLoading ? <Skeleton className="inline w-16 h-4" /> : (
                <span className="flex items-center gap-2">
                  <PriceDisplay {...getPriceData(115)} className="text-white/70 text-sm" showStrikethrough />
                  <PriceDisplay {...getPriceData(productPrice)} className="text-white font-bold" />
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