import { Facebook, Twitter, Mail, Instagram } from "lucide-react";
import { useLanguage } from "@/hooks/useLanguage";
import LangLink from "@/components/LangLink";

const Footer = () => {
  const { language } = useLanguage();
  const currentYear = new Date().getFullYear();

  const quickLinks = [
    { to: "/",           labelAr: "الرئيسية",        labelEn: "Home" },
    { to: "/products",   labelAr: "المنتجات",         labelEn: "Products" },
    { to: "/benefits",   labelAr: "الفوائد",          labelEn: "Benefits" },
    { to: "/ingredients",labelAr: "المكونات",         labelEn: "Ingredients" },
    { to: "/how-to-use", labelAr: "طريقة الاستخدام", labelEn: "How to Use" },
    { to: "/faq",        labelAr: "الأسئلة الشائعة", labelEn: "FAQ" },
    { to: "/about",      labelAr: "من نحن",           labelEn: "About" },
    { to: "/reviews",    labelAr: "آراء العملاء",     labelEn: "Reviews" },
    { to: "/compare",    labelAr: "المقارنة",         labelEn: "Compare" },
  ];

  return (
    <footer className="bg-secondary border-t border-border mt-20">
      <div className="container mx-auto px-4 py-12 lg:py-16">
        <div className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12 ${language === 'ar' ? 'text-right' : 'text-left'}`}>

          {/* Logo */}
          <div className="space-y-4">
            <LangLink to="/" className="flex items-center gap-3 group">
              <img
                src="/images/sevengreen-logo.webp"
                alt="Seven Green"
                className="h-16 w-auto object-contain transition-transform duration-300 group-hover:scale-105"
                onError={e => { e.currentTarget.style.display = 'none'; }}
              />
              <div className="flex flex-col leading-tight">
                <span className="text-lg font-black tracking-widest text-primary font-english uppercase">
                  SEVEN GREEN
                </span>
                <span className="text-sm font-semibold tracking-wider text-green-700"
                  style={{ fontFamily: "'Noto Sans SC', 'PingFang SC', sans-serif" }}>
                  七绿 · Qī Lǜ
                </span>
              </div>
            </LangLink>
            <p className="text-muted-foreground text-sm leading-relaxed">
              {language === 'ar'
                ? 'صابونة طبيعية 100% من أوراق السرو ونبات الأوسمان. الحل الطبيعي لعلاج تساقط الشعر.'
                : '100% natural soap from cypress and rosemary. The natural solution for hair loss.'}
            </p>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h3 className="text-lg font-bold text-foreground">
              {language === 'ar' ? 'روابط سريعة' : 'Quick Links'}
            </h3>
            <ul className="space-y-2">
              {quickLinks.map(link => (
                <li key={link.to}>
                  <LangLink
                    to={link.to}
                    className="text-muted-foreground hover:text-primary transition-all duration-300 text-sm relative group"
                  >
                    {language === 'ar' ? link.labelAr : link.labelEn}
                    <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-primary transition-all duration-300 group-hover:w-full" />
                  </LangLink>
                </li>
              ))}
            </ul>
          </div>

          {/* Customer Service */}
          <div className="space-y-4">
            <h3 className="text-lg font-bold text-foreground">
              {language === 'ar' ? 'خدمة العملاء' : 'Customer Service'}
            </h3>
            <ul className="space-y-3">
              <li className="flex items-center gap-2 text-muted-foreground text-sm">
                <Mail className="w-4 h-4 text-primary flex-shrink-0" />
                <a href="mailto:support@sevensgreen.com"
                  className="hover:text-primary transition-colors duration-300">
                  support@sevensgreen.com
                </a>
              </li>
            </ul>
          </div>

          {/* Social Media */}
          <div className="space-y-4">
            <h3 className="text-lg font-bold text-foreground">
              {language === 'ar' ? 'تابعنا' : 'Follow Us'}
            </h3>
            <div className="flex gap-4">
              {[
                { href: "https://www.instagram.com/sevengreen", icon: Instagram, label: "Instagram" },
                { href: "https://www.facebook.com/sevengreen",  icon: Facebook,  label: "Facebook" },
                { href: "https://twitter.com/sevengreen",       icon: Twitter,   label: "Twitter" },
              ].map(s => (
                <a key={s.label} href={s.href} target="_blank" rel="noopener noreferrer"
                  className="text-muted-foreground hover:text-primary transition-all duration-300 hover:scale-110"
                  aria-label={s.label}>
                  <s.icon className="w-6 h-6" />
                </a>
              ))}
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
          <p className="mt-2">
            <LangLink to="/privacy" className="hover:text-primary transition-colors duration-300">
              {language === 'ar' ? 'سياسة الخصوصية' : 'Privacy Policy'}
            </LangLink>
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
