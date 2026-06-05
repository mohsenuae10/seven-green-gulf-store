import { Link, useLocation } from "react-router-dom";
import { useLanguage } from "@/hooks/useLanguage";
import LanguageSwitcher from "@/components/LanguageSwitcher";
import CurrencySwitcher from "@/components/CurrencySwitcher";
import { Button } from "@/components/ui/button";
import { ShoppingCart, Menu, X } from "lucide-react";
import { useState } from "react";

const Header = () => {
  const { language } = useLanguage();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks = [
    { name: language === 'ar' ? 'الرئيسية' : 'Home', path: '/' },
    { name: language === 'ar' ? 'المنتج' : 'Product', path: '/product' },
    { name: language === 'ar' ? 'الفوائد' : 'Benefits', path: '/benefits' },
    { name: language === 'ar' ? 'المكونات' : 'Ingredients', path: '/ingredients' },
    { name: language === 'ar' ? 'من نحن' : 'About', path: '/about' },
  ];

  const isActive = (path: string) => location.pathname === path;

  return (
    <header className="sticky top-0 z-50 bg-white border-b border-gray-100 shadow-sm">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">

          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 shrink-0">
            <img
              src="/images/sevengreen-logo.webp"
              alt="Seven Green"
              className="h-10 w-auto object-contain"
              onError={(e) => {
                const target = e.currentTarget;
                target.style.display = 'none';
                const fallback = target.nextElementSibling as HTMLElement;
                if (fallback) fallback.style.display = 'flex';
              }}
            />
            {/* Fallback if image missing */}
            <span
              className="items-center gap-1.5 hidden"
              style={{ display: 'none' }}
            >
              <span className="text-xl font-black tracking-tight text-primary font-english">SEVEN</span>
              <span className="text-xl font-black tracking-tight text-green-700 font-english">GREEN</span>
            </span>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden lg:flex items-center gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`
                  px-3 py-1.5 rounded-full text-sm font-medium transition-all duration-200
                  ${isActive(link.path)
                    ? 'bg-primary text-white'
                    : 'text-gray-600 hover:text-primary hover:bg-primary/8'
                  }
                `}
              >
                {link.name}
              </Link>
            ))}
          </nav>

          {/* Right Controls */}
          <div className="flex items-center gap-2">
            {/* Language + Currency */}
            <div className="hidden sm:flex items-center gap-1.5 bg-gray-50 rounded-full px-2 py-1 border border-gray-200">
              <LanguageSwitcher />
              <div className="w-px h-4 bg-gray-300" />
              <CurrencySwitcher variant="header" />
            </div>

            {/* Order CTA */}
            <Link to="/order" className="hidden sm:block">
              <Button
                size="sm"
                className="bg-primary hover:bg-primary/90 text-white rounded-full px-4 gap-1.5 shadow-sm"
              >
                <ShoppingCart className="w-3.5 h-3.5" />
                {language === 'ar' ? 'اطلب الآن' : 'Order Now'}
              </Button>
            </Link>

            {/* Mobile menu toggle */}
            <button
              className="lg:hidden p-2 rounded-full hover:bg-gray-100 transition-colors"
              onClick={() => setMobileMenuOpen(prev => !prev)}
              aria-label="Toggle menu"
            >
              {mobileMenuOpen
                ? <X className="w-5 h-5 text-gray-600" />
                : <Menu className="w-5 h-5 text-gray-600" />
              }
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="lg:hidden border-t border-gray-100 py-3 space-y-1">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                onClick={() => setMobileMenuOpen(false)}
                className={`
                  block px-4 py-2 rounded-lg text-sm font-medium transition-colors
                  ${isActive(link.path)
                    ? 'bg-primary/10 text-primary'
                    : 'text-gray-600 hover:bg-gray-50 hover:text-primary'
                  }
                `}
              >
                {link.name}
              </Link>
            ))}
            {/* Mobile: Language + Currency + Order */}
            <div className="flex items-center gap-2 px-4 pt-2 flex-wrap">
              <LanguageSwitcher />
              <CurrencySwitcher variant="header" />
              <Link to="/order" onClick={() => setMobileMenuOpen(false)}>
                <Button size="sm" className="bg-primary text-white rounded-full px-4">
                  {language === 'ar' ? 'اطلب الآن' : 'Order Now'}
                </Button>
              </Link>
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
