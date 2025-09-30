import { Card } from "@/components/ui/card";
import { Shield, Truck, RefreshCcw, Award, Lock, Headphones } from "lucide-react";
import { useLanguage } from "@/hooks/useLanguage";
import visaLogo from "@/assets/payment-logos/visa.svg";
import mastercardLogo from "@/assets/payment-logos/mastercard.svg";
import amexLogo from "@/assets/payment-logos/american-express.svg";
import applePayLogo from "@/assets/payment-logos/apple-pay.svg";
import googlePayLogo from "@/assets/payment-logos/google-pay.svg";

const TrustBadges = () => {
  const { language } = useLanguage();

  const badges = language === 'ar' ? [
    {
      icon: Shield,
      title: "دفع آمن 100%",
      description: "تشفير SSL 256-bit",
      color: "from-green-500 to-emerald-600"
    },
    {
      icon: Truck,
      title: "شحن مجاني",
      description: "لجميع دول الخليج",
      color: "from-blue-500 to-cyan-600"
    },
    {
      icon: RefreshCcw,
      title: "ضمان 30 يوم",
      description: "استرداد كامل المبلغ",
      color: "from-purple-500 to-pink-600"
    },
    {
      icon: Award,
      title: "جودة مضمونة",
      description: "منتج أصلي 100%",
      color: "from-amber-500 to-orange-600"
    },
    {
      icon: Lock,
      title: "حماية البيانات",
      description: "معلوماتك آمنة تماماً",
      color: "from-red-500 to-rose-600"
    },
    {
      icon: Headphones,
      title: "دعم 24/7",
      description: "نحن هنا لمساعدتك",
      color: "from-indigo-500 to-violet-600"
    }
  ] : [
    {
      icon: Shield,
      title: "100% Secure Payment",
      description: "256-bit SSL encryption",
      color: "from-green-500 to-emerald-600"
    },
    {
      icon: Truck,
      title: "Free Shipping",
      description: "All GCC countries",
      color: "from-blue-500 to-cyan-600"
    },
    {
      icon: RefreshCcw,
      title: "30-Day Guarantee",
      description: "Full refund",
      color: "from-purple-500 to-pink-600"
    },
    {
      icon: Award,
      title: "Quality Guaranteed",
      description: "100% Original Product",
      color: "from-amber-500 to-orange-600"
    },
    {
      icon: Lock,
      title: "Data Protection",
      description: "Your info is safe",
      color: "from-red-500 to-rose-600"
    },
    {
      icon: Headphones,
      title: "24/7 Support",
      description: "We're here to help",
      color: "from-indigo-500 to-violet-600"
    }
  ];

  const paymentLogos = [
    { src: visaLogo, alt: "Visa" },
    { src: mastercardLogo, alt: "Mastercard" },
    { src: amexLogo, alt: "American Express" },
    { src: applePayLogo, alt: "Apple Pay" },
    { src: googlePayLogo, alt: "Google Pay" }
  ];

  return (
    <section className="py-16 bg-gradient-to-b from-background to-accent/5" dir={language === 'ar' ? 'rtl' : 'ltr'}>
      <div className="container mx-auto px-4">
        
        {/* Trust Badges Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-12">
          {badges.map((badge, index) => (
            <Card
              key={index}
              className="group relative overflow-hidden bg-gradient-card border-border/50 hover:border-primary/30 transition-all duration-500 hover:scale-105 hover:shadow-medium animate-bounce-in p-4 text-center"
              style={{animationDelay: `${index * 0.05}s`}}
            >
              {/* Gradient background */}
              <div className={`absolute inset-0 bg-gradient-to-br ${badge.color} opacity-0 group-hover:opacity-10 transition-opacity duration-500`}></div>
              
              <div className="relative">
                <div className={`w-12 h-12 mx-auto mb-3 bg-gradient-to-br ${badge.color} rounded-xl flex items-center justify-center shadow-soft group-hover:shadow-medium transition-all duration-300 group-hover:scale-110`}>
                  <badge.icon className="w-6 h-6 text-white" />
                </div>
                <h3 className="font-bold text-foreground text-sm mb-1 group-hover:text-primary transition-colors">
                  {badge.title}
                </h3>
                <p className="text-xs text-muted-foreground">
                  {badge.description}
                </p>
              </div>
            </Card>
          ))}
        </div>

        {/* Payment Methods */}
        <div className="text-center">
          <p className="text-sm text-muted-foreground mb-4 font-medium">
            {language === 'ar' ? 'طرق الدفع المتاحة' : 'Payment Methods'}
          </p>
          <div className="flex flex-wrap items-center justify-center gap-6">
            {paymentLogos.map((logo, index) => (
              <div
                key={index}
                className="bg-white rounded-lg p-3 shadow-soft hover:shadow-medium transition-all duration-300 hover:scale-110 animate-fade-in"
                style={{animationDelay: `${index * 0.1}s`}}
              >
                <img
                  src={logo.src}
                  alt={logo.alt}
                  className="h-8 w-auto opacity-80 hover:opacity-100 transition-opacity"
                />
              </div>
            ))}
          </div>
          <p className="text-xs text-muted-foreground mt-4">
            {language === 'ar'
              ? 'جميع المعاملات مؤمنة ومشفرة بتقنية SSL 256-bit'
              : 'All transactions are secured and encrypted with 256-bit SSL'}
          </p>
        </div>
      </div>
    </section>
  );
};

export default TrustBadges;
