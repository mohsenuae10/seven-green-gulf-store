import { Link, useLocation } from "react-router-dom";
import { ShoppingCart } from "lucide-react";
import { Button } from "@/components/ui/button";

const MobileNav = () => {
  const location = useLocation();
  const isOrderPage = location.pathname === "/order";

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
              className="w-full bg-gradient-secondary hover:scale-105 transition-all duration-300 shadow-glow text-lg py-4 rounded-full touch-target"
            >
              <ShoppingCart className="w-6 h-6 ml-2" />
              اشتر الآن
            </Button>
          </Link>
        </div>
      </div>

    </>
  );
};

export default MobileNav;