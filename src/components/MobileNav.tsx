import { Link, useLocation } from "react-router-dom";
import { ShoppingCart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/hooks/useLanguage";

const MobileNav = () => {
  const location = useLocation();
  const isOrderPage = location.pathname === "/order";
  const { t } = useLanguage();

  if (isOrderPage) {
    return null;
  }

  return (
    <>
      {/* Header with Logo */}
      <header className="bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50 w-full border-b border-border/40">
        <div className="container flex h-16 items-center justify-center">
          <Link to="/" className="flex items-center">
            <img 
              src="/images/seven-green-icon.png" 
              alt="Seven Green Logo - سفن جرين" 
              className="h-10 w-auto"
              loading="eager"
            />
          </Link>
        </div>
      </header>

      {/* Mobile Buy Now Button - Fixed Bottom */}
      <div className="fixed bottom-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-md border-t border-border shadow-strong sm:hidden">
        <div className="p-4">
          <Link to="/order" className="block">
            <Button 
              size="lg" 
              className="w-full bg-gradient-secondary hover:scale-105 transition-all duration-300 shadow-glow text-lg py-4 rounded-full touch-target"
            >
              <ShoppingCart className="w-6 h-6 ml-2" />
              {t('hero.buy.now')}
            </Button>
          </Link>
        </div>
      </div>

    </>
  );
};

export default MobileNav;