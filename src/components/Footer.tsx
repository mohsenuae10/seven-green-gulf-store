import { Link } from "react-router-dom";
import { Facebook, Twitter, Mail, Instagram, Leaf } from "lucide-react";
import { useLanguage } from "@/hooks/useLanguage";

const Footer = () => {
  const { language } = useLanguage();
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-secondary border-t border-border mt-20">
      <div className="container mx-auto px-4 py-12 lg:py-16">
        <div className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12 ${language === 'ar' ? 'text-right' : 'text-left'}`}>
          
          {/* Logo & About Section */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <Leaf className="w-6 h-6 text-primary" />
              <span className="text-xl font-bold bg-gradient-primary bg-clip-text text-transparent font-english">
                Seven Green
              </span>
            </div>
            <p className="text-muted-foreground text-sm leading-relaxed">
              {language === 'ar' 
                ? 'صابونة طبيعية 100% من أوراق السرو ونبات الأوسمان. الحل الطبيعي الأمثل لعلاج تساقط الشعر وتعزيز نموه.'
                : '100% natural soap from cypress leaves and rosemary plant. The perfect natural solution for treating hair loss and promoting growth.'}
            </p>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h3 className="text-lg font-bold text-foreground">{language === 'ar' ? 'روابط سريعة' : 'Quick Links'}</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/" className="text-muted-foreground hover:text-primary transition-all duration-300 text-sm relative group">
                  {language === 'ar' ? 'الرئيسية' : 'Home'}
                  <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-primary transition-all duration-300 group-hover:w-full"></span>
                </Link>
              </li>
              <li>
                <Link to="/benefits" className="text-muted-foreground hover:text-primary transition-all duration-300 text-sm relative group">
                  {language === 'ar' ? 'الفوائد' : 'Benefits'}
                  <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-primary transition-all duration-300 group-hover:w-full"></span>
                </Link>
              </li>
              <li>
                <Link to="/ingredients" className="text-muted-foreground hover:text-primary transition-all duration-300 text-sm relative group">
                  {language === 'ar' ? 'المكونات' : 'Ingredients'}
                  <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-primary transition-all duration-300 group-hover:w-full"></span>
                </Link>
              </li>
              <li>
                <Link to="/how-to-use" className="text-muted-foreground hover:text-primary transition-all duration-300 text-sm relative group">
                  {language === 'ar' ? 'طريقة الاستخدام' : 'How to Use'}
                  <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-primary transition-all duration-300 group-hover:w-full"></span>
                </Link>
              </li>
              <li>
                <Link to="/faq" className="text-muted-foreground hover:text-primary transition-all duration-300 text-sm relative group">
                  {language === 'ar' ? 'الأسئلة الشائعة' : 'FAQ'}
                  <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-primary transition-all duration-300 group-hover:w-full"></span>
                </Link>
              </li>
              <li>
                <Link to="/about" className="text-muted-foreground hover:text-primary transition-all duration-300 text-sm relative group">
                  {language === 'ar' ? 'من نحن' : 'About'}
                  <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-primary transition-all duration-300 group-hover:w-full"></span>
                </Link>
              </li>
              <li>
                <Link to="/reviews" className="text-muted-foreground hover:text-primary transition-all duration-300 text-sm relative group">
                  {language === 'ar' ? 'آراء العملاء' : 'Reviews'}
                  <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-primary transition-all duration-300 group-hover:w-full"></span>
                </Link>
              </li>
              <li>
                <Link to="/compare" className="text-muted-foreground hover:text-primary transition-all duration-300 text-sm relative group">
                  {language === 'ar' ? 'المقارنة' : 'Compare'}
                  <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-primary transition-all duration-300 group-hover:w-full"></span>
                </Link>
              </li>
            </ul>
          </div>

          {/* Customer Service */}
          <div className="space-y-4">
            <h3 className="text-lg font-bold text-foreground">{language === 'ar' ? 'خدمة العملاء' : 'Customer Service'}</h3>
            <ul className="space-y-3">
              <li className="flex items-center gap-2 text-muted-foreground text-sm">
                <Mail className="w-4 h-4 text-primary flex-shrink-0" />
                <a href="mailto:info@sevengreen.com" className="hover:text-primary transition-colors duration-300">
                  info@sevengreen.com
                </a>
              </li>
            </ul>
          </div>

          {/* Social Media */}
          <div className="space-y-4">
            <h3 className="text-lg font-bold text-foreground">{language === 'ar' ? 'تابعنا' : 'Follow Us'}</h3>
            <div className="flex gap-4">
              <a 
                href="https://www.instagram.com/sevengreen" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-muted-foreground hover:text-primary transition-all duration-300 hover:scale-110"
                aria-label="Instagram"
              >
                <Instagram className="w-6 h-6" />
              </a>
              <a 
                href="https://www.facebook.com/sevengreen" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-muted-foreground hover:text-primary transition-all duration-300 hover:scale-110"
                aria-label="Facebook"
              >
                <Facebook className="w-6 h-6" />
              </a>
              <a 
                href="https://twitter.com/sevengreen" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-muted-foreground hover:text-primary transition-all duration-300 hover:scale-110"
                aria-label="Twitter"
              >
                <Twitter className="w-6 h-6" />
              </a>
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div className="pt-8 border-t border-border text-center text-sm text-muted-foreground mt-8">
          <p>
            {language === 'ar' 
              ? `© ${currentYear} سفن جرين. جميع الحقوق محفوظة.`
              : `© ${currentYear} Seven Green. All rights reserved.`}
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
