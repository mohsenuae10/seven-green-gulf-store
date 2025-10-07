import { Link } from "react-router-dom";
import { Leaf } from "lucide-react";
import { useLanguage } from "@/hooks/useLanguage";
import LanguageSwitcher from "@/components/LanguageSwitcher";
import CurrencySwitcher from "@/components/CurrencySwitcher";
import { Button } from "@/components/ui/button";

const Header = () => {
  const { language, t } = useLanguage();

  const navLinks = [
    { name: language === 'ar' ? 'الرئيسية' : 'Home', path: '/' },
    { name: language === 'ar' ? 'المتجر' : 'Shop', path: '/order' },
    { name: language === 'ar' ? 'عن سفن جرين' : 'About Seven Green', path: '/about' },
    { name: language === 'ar' ? 'اتصل بنا' : 'Contact Us', path: '/contact' },
  ];

  return (
    <header 
      className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-border"
      style={{ 
        boxShadow: '0 4px 20px -4px hsl(100 28% 36% / 0.1)',
        height: '64px'
      }}
    >
      <div className="container mx-auto px-4 h-full">
        <div className="flex items-center justify-between h-full">
          
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 group">
            <Leaf className="w-8 h-8 text-primary transition-transform duration-300 group-hover:scale-110" />
            <span className="text-2xl font-bold bg-gradient-primary bg-clip-text text-transparent font-english">
              Seven Green
            </span>
          </Link>

          {/* Navigation - Hidden on mobile */}
          <nav className="hidden lg:flex items-center gap-8">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className="text-foreground hover:text-primary transition-colors duration-300 font-medium relative group"
              >
                {link.name}
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-primary transition-all duration-300 group-hover:w-full"></span>
              </Link>
            ))}
          </nav>

          {/* Right Section */}
          <div className="flex items-center gap-4">
            {/* Language & Currency - Always visible */}
            <div className="flex items-center gap-2 bg-accent/50 backdrop-blur-sm rounded-full px-3 py-1.5 border border-border">
              <LanguageSwitcher />
              <div className="w-px h-4 bg-border"></div>
              <CurrencySwitcher variant="header" />
            </div>

            {/* CTA Button */}
            <Link to="/order" className="hidden sm:block">
              <Button variant="default" className="shadow-soft">
                {language === 'ar' ? 'اطلب الآن' : 'Order Now'}
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
