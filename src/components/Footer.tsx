import { Link } from "react-router-dom";
import { useLanguage } from "@/hooks/useLanguage";
import { Facebook, Twitter, Video, Camera } from "lucide-react";

const Footer = () => {
  const { language } = useLanguage();
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-card border-t border-border py-12 mt-16">
      <div className="container mx-auto px-4">
        <div className="grid md:grid-cols-3 gap-8 mb-8">
          {/* About */}
          <div>
            <h3 className="font-bold text-lg mb-4">
              {language === 'ar' ? 'سفن جرين' : 'Seven Green'}
            </h3>
            <p className="text-muted-foreground text-sm">
              {language === 'ar'
                ? 'علامة تجارية كورية رائدة في منتجات العناية بالشعر الطبيعية'
                : 'Leading Korean brand in natural hair care products'}
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-bold text-lg mb-4">
              {language === 'ar' ? 'روابط سريعة' : 'Quick Links'}
            </h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/" className="text-muted-foreground hover:text-foreground transition-colors">
                  {language === 'ar' ? 'الرئيسية' : 'Home'}
                </Link>
              </li>
              <li>
                <Link to="/about" className="text-muted-foreground hover:text-foreground transition-colors">
                  {language === 'ar' ? 'من نحن' : 'About Us'}
                </Link>
              </li>
              <li>
                <Link to="/product-details" className="text-muted-foreground hover:text-foreground transition-colors">
                  {language === 'ar' ? 'تفاصيل المنتج' : 'Product Details'}
                </Link>
              </li>
              <li>
                <Link to="/order" className="text-muted-foreground hover:text-foreground transition-colors">
                  {language === 'ar' ? 'اطلب الآن' : 'Order Now'}
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact & Social Media */}
          <div>
            <h3 className="font-bold text-lg mb-4">
              {language === 'ar' ? 'تواصل معنا' : 'Follow Us'}
            </h3>
            <div className="flex gap-4">
              <a 
                href="https://www.snapchat.com/add/sevensgreen" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-muted-foreground hover:text-foreground transition-colors"
                aria-label="Snapchat"
              >
                <Camera className="w-6 h-6" />
              </a>
              <a 
                href="https://www.tiktok.com/@sevensgreen" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-muted-foreground hover:text-foreground transition-colors"
                aria-label="TikTok"
              >
                <Video className="w-6 h-6" />
              </a>
              <a 
                href="https://twitter.com/sevensgreen" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-muted-foreground hover:text-foreground transition-colors"
                aria-label="Twitter/X"
              >
                <Twitter className="w-6 h-6" />
              </a>
              <a 
                href="https://www.facebook.com/sevensgreen" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-muted-foreground hover:text-foreground transition-colors"
                aria-label="Facebook"
              >
                <Facebook className="w-6 h-6" />
              </a>
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div className="pt-8 border-t border-border text-center text-sm text-muted-foreground">
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
