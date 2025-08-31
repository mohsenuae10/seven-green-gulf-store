import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Home, Package, ShoppingCart, User, Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger, SheetHeader, SheetTitle } from "@/components/ui/sheet";

const MobileNav = () => {
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(false);

  const navItems = [
    { icon: Home, label: "الرئيسية", href: "/", id: "home" },
    { icon: Package, label: "المنتج", href: "/product-details", id: "product" },
    { icon: User, label: "الإدارة", href: "/auth", id: "admin" },
  ];

  const isActive = (href: string) => location.pathname === href;

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

      {/* Mobile Header with Menu */}
      <div className="fixed top-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-b border-border shadow-soft sm:hidden">
        <div className="flex items-center justify-between p-4">
          <Link to="/" className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-gradient-primary flex items-center justify-center">
              <span className="text-white font-bold text-sm">S</span>
            </div>
            <span className="font-bold text-primary">سيفن جرين</span>
          </Link>

          <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="sm" className="touch-target">
                <Menu className="w-5 h-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-80">
              <SheetHeader>
                <SheetTitle className="text-right" dir="rtl">قائمة التنقل</SheetTitle>
              </SheetHeader>
              
              <div className="mt-8 space-y-4" dir="rtl">
                {navItems.map((item) => (
                  <Link
                    key={item.id}
                    to={item.href}
                    onClick={() => setIsOpen(false)}
                    className={`flex items-center gap-3 p-4 rounded-lg transition-all duration-200 ${
                      isActive(item.href)
                        ? "bg-primary text-primary-foreground"
                        : "hover:bg-accent"
                    }`}
                  >
                    <item.icon className="w-5 h-5" />
                    <span className="font-medium">{item.label}</span>
                  </Link>
                ))}
                
                <div className="pt-4 border-t border-border">
                  <div className="p-4 bg-gradient-card rounded-lg">
                    <h3 className="font-semibold text-primary mb-2">معلومات التواصل</h3>
                    <p className="text-sm text-muted-foreground">
                      للاستفسارات والطلبات المخصصة
                    </p>
                  </div>
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>

      {/* Spacer for fixed header on mobile */}
      <div className="h-20 sm:hidden" />
    </>
  );
};

export default MobileNav;