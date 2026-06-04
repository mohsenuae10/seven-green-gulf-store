
import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Helmet } from "react-helmet";

// TypeScript declaration for gtag
declare global {
  interface Window {
    dataLayer: any[];
    gtag: (...args: any[]) => void;
  }
}
import { useProductPrice } from "@/hooks/useProductPrice";
import { useCurrency } from "@/hooks/useCurrency";
import { useLanguage } from "@/hooks/useLanguage";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { AlertCircle, Loader2, Phone, Flag, ChevronRight, Shield, Truck, RotateCcw } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import MobileNav from "@/components/MobileNav";
import MobileOptimized from "@/components/MobileOptimized";
import PaymentMethods from "@/components/PaymentMethods";
import OptimizedImage from "@/components/OptimizedImage";
import TrustBadges from "@/components/TrustBadges";
import { CONTACT_INFO } from "@/config/contact";
import { PriceDisplay } from "@/components/PriceDisplay";
import { supabase } from "@/integrations/supabase/client";
import StripePaymentForm from "@/components/checkout/StripePaymentForm";

// Country data with codes and flags
const getCountries = (language: string) => [
  { 
    code: "AE", 
    name: language === 'ar' ? "الإمارات العربية المتحدة" : "United Arab Emirates", 
    flag: "🇦🇪", 
    phoneCode: "+971" 
  },
  { 
    code: "SA", 
    name: language === 'ar' ? "المملكة العربية السعودية" : "Saudi Arabia", 
    flag: "🇸🇦", 
    phoneCode: "+966" 
  },
  { 
    code: "YE", 
    name: language === 'ar' ? "اليمن" : "Yemen", 
    flag: "🇾🇪", 
    phoneCode: "+967" 
  },
  { 
    code: "EG", 
    name: language === 'ar' ? "مصر" : "Egypt", 
    flag: "🇪🇬", 
    phoneCode: "+20" 
  },
  { 
    code: "JO", 
    name: language === 'ar' ? "الأردن" : "Jordan", 
    flag: "🇯🇴", 
    phoneCode: "+962" 
  },
  { 
    code: "MA", 
    name: language === 'ar' ? "المغرب" : "Morocco", 
    flag: "🇲🇦", 
    phoneCode: "+212" 
  },
  { 
    code: "IQ", 
    name: language === 'ar' ? "العراق" : "Iraq", 
    flag: "🇮🇶", 
    phoneCode: "+964" 
  },
  { 
    code: "US", 
    name: language === 'ar' ? "الولايات المتحدة الأمريكية" : "United States", 
    flag: "🇺🇸", 
    phoneCode: "+1" 
  },
  { 
    code: "QA", 
    name: language === 'ar' ? "قطر" : "Qatar", 
    flag: "🇶🇦", 
    phoneCode: "+974" 
  },
  { 
    code: "KW", 
    name: language === 'ar' ? "الكويت" : "Kuwait", 
    flag: "🇰🇼", 
    phoneCode: "+965" 
  },
  { 
    code: "BH", 
    name: language === 'ar' ? "البحرين" : "Bahrain", 
    flag: "🇧🇭", 
    phoneCode: "+973" 
  },
  { 
    code: "OM", 
    name: language === 'ar' ? "عمان" : "Oman", 
    flag: "🇴🇲", 
    phoneCode: "+968" 
  },
];

const Order = () => {
  const { language, t } = useLanguage();
  const countries = getCountries(language);
  
  const [formData, setFormData] = useState({
    customerName: "",
    customerPhone: "",
    customerEmail: "",
    country: "",
    countryCode: "+971", // Default to UAE
    city: "",
    address: "",
    quantity: 1,
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  // Two-step checkout: collect shipping details, then pay inline (no redirect).
  const [step, setStep] = useState<"form" | "payment">("form");
  const [clientSecret, setClientSecret] = useState<string | null>(null);
  const [orderId, setOrderId] = useState<string | null>(null);
  const { price: productPrice } = useProductPrice();
  const { getPriceData, selectedCurrency } = useCurrency();
  const { toast } = useToast();
  const navigate = useNavigate();

  // Google Ads Begin Checkout Conversion Event
  // NOTE: يحتاج Conversion ID منفصل للـ Begin Checkout - استبدل 'YYYYYY' بالـ ID من Google Ads
  useEffect(() => {
    if (typeof window.gtag !== 'undefined') {
      window.gtag('event', 'conversion', {
        'send_to': 'AW-17646380077/YYYYYY' // ⚠️ Replace with your Begin Checkout Conversion ID
      });
      console.log('Google Ads Begin Checkout tracked');
    }
  }, []);

  const handleInputChange = (field: string, value: string | number) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (error) setError(null);
  };

  const validateForm = () => {
    if (!formData.customerName.trim()) {
      setError(t('order.validation.name'));
      return false;
    }
    if (!formData.customerPhone.trim()) {
      setError(t('order.validation.phone'));
      return false;
    }
    if (!formData.country) {
      setError(t('order.validation.country'));
      return false;
    }
    if (!formData.city.trim()) {
      setError(t('order.validation.city'));
      return false;
    }
    if (!formData.address.trim()) {
      setError(t('order.validation.address'));
      return false;
    }
    if (formData.quantity < 1) {
      setError(t('order.validation.quantity'));
      return false;
    }
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      // The server computes the authoritative amount from the DB product price.
      const { data, error: fnError } = await supabase.functions.invoke('create-payment-intent', {
        body: {
          customerName: formData.customerName,
          customerEmail: formData.customerEmail,
          customerPhone: `${formData.countryCode}${formData.customerPhone}`,
          country: formData.country,
          city: formData.city,
          address: formData.address,
          quantity: formData.quantity,
        },
      });

      if (fnError) {
        throw new Error(fnError.message || (language === 'ar' ? "تعذّر الاتصال بالخادم" : "Could not reach the server"));
      }

      if (!data?.success || !data?.clientSecret) {
        throw new Error(data?.error || (language === 'ar' ? "فشل في تجهيز الدفع" : "Failed to prepare payment"));
      }

      // Show the inline Stripe payment form (no redirect to Stripe).
      setClientSecret(data.clientSecret);
      setOrderId(data.order_id);
      setStep("payment");
    } catch (error) {
      console.error("Order submission error:", error);
      const errorMessage = error instanceof Error ? error.message : (language === 'ar' ? "حدث خطأ غير متوقع" : "An unexpected error occurred");
      setError(errorMessage);
      
      toast({
        title: t('order.error.title'),
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const totalAmount = productPrice * formData.quantity;

  const title = language === 'ar' 
    ? "اطلب سفن جرين الآن - توصيل سريع لجميع دول الخليج"
    : "Order Seven Green Now - Fast Delivery to All GCC Countries";
    
  const description = language === 'ar'
    ? "اطلب صابونة سفن جرين المثلثة الأصلية الآن. توصيل سريع لجميع دول الخليج خلال 2-5 أيام. ضمان استرجاع المال 30 يوم. دفع آمن 100%."
    : "Order the original Seven Green Triangle Soap now. Fast delivery to all GCC countries in 2-5 days. 30-day money-back guarantee. 100% secure payment.";

  const offerSchema = {
    "@context": "https://schema.org",
    "@type": "Offer",
    "url": "https://sevensgreen.com/order",
    "priceCurrency": "SAR",
    "price": productPrice.toString(),
    "availability": "https://schema.org/InStock",
    "itemOffered": {
      "@type": "Product",
      "name": language === 'ar' ? "صابونة سفن جرين المثلثة" : "Seven Green Triangle Soap"
    },
    "seller": {
      "@type": "Organization",
      "name": "Seven Green"
    },
    "shippingDetails": {
      "@type": "OfferShippingDetails",
      "shippingRate": {
        "@type": "MonetaryAmount",
        "value": "0",
        "currency": "SAR"
      },
      "deliveryTime": {
        "@type": "ShippingDeliveryTime",
        "handlingTime": {
          "@type": "QuantitativeValue",
          "minValue": 1,
          "maxValue": 2,
          "unitCode": "DAY"
        },
        "transitTime": {
          "@type": "QuantitativeValue",
          "minValue": 2,
          "maxValue": 5,
          "unitCode": "DAY"
        }
      }
    }
  };

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      {
        "@type": "ListItem",
        "position": 1,
        "name": language === 'ar' ? "الرئيسية" : "Home",
        "item": "https://sevensgreen.com/"
      },
      {
        "@type": "ListItem",
        "position": 2,
        "name": language === 'ar' ? "اطلب الآن" : "Order Now",
        "item": "https://sevensgreen.com/order"
      }
    ]
  };

  return (
    <>
      <Helmet>
        <title>{title}</title>
        <meta name="description" content={description} />
        <meta property="og:title" content={title} />
        <meta property="og:description" content={description} />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://sevensgreen.com/order" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={title} />
        <meta name="twitter:description" content={description} />
        <link rel="canonical" href="https://sevensgreen.com/order" />
        <link rel="alternate" hrefLang="ar" href="https://sevensgreen.com/order?lang=ar" />
        <link rel="alternate" hrefLang="en" href="https://sevensgreen.com/order?lang=en" />
        <script type="application/ld+json">
          {JSON.stringify(offerSchema)}
        </script>
        <script type="application/ld+json">
          {JSON.stringify(breadcrumbSchema)}
        </script>
      </Helmet>
      
      <MobileOptimized className="min-h-screen bg-gradient-to-br from-green-50 to-white" dir={language === 'ar' ? 'rtl' : 'ltr'}>
        <MobileNav />
        
        {/* Breadcrumb */}
        <nav className="container mx-auto px-4 py-4" aria-label="breadcrumb">
          <ol className="flex items-center gap-2 text-sm">
            <li>
              <Link to="/" className="text-muted-foreground hover:text-foreground transition-colors">
                {language === 'ar' ? 'الرئيسية' : 'Home'}
              </Link>
            </li>
            <ChevronRight className="w-4 h-4 text-muted-foreground" />
            <li>
              <span className="text-foreground font-medium">
                {language === 'ar' ? 'اطلب الآن' : 'Order Now'}
              </span>
            </li>
          </ol>
        </nav>
      <div className="mobile-container py-4 sm:py-8">
        <div className="max-w-2xl mx-auto">
          <div className="text-center mb-6 lg:mb-8 px-4">
            <h1 className="mobile-heading font-bold text-gray-900 mb-2">
              {t('order.title')}
              <span className="block text-base font-medium text-primary mt-1">SEVEN GREEN</span>
            </h1>
            <p className="text-gray-600 mobile-text">{t('order.subtitle')}</p>
          </div>

          <Card className="mobile-card shadow-medium border-border/50">
            <CardHeader className="pb-4">
              <CardTitle className={`mobile-subheading ${language === 'ar' ? 'text-right' : 'text-left'}`}>{t('order.form.title')}</CardTitle>
              <CardDescription className={`${language === 'ar' ? 'text-right' : 'text-left'} mobile-text`}>
                <span className="flex items-center gap-3 mt-3 p-3 bg-accent/20 rounded-lg">
                  <OptimizedImage 
                    src="/lovable-uploads/8d004a44-148f-471d-949f-6cc6b414bd1d.png" 
                    alt="سيفن جرين - منتج العناية بالشعر" 
                    className="w-16 h-16 object-cover rounded-lg shadow-sm"
                    width={64}
                    height={64}
                    priority
                  />
                  <span className="flex-1">
                    <span className="block font-bold text-foreground text-lg">{language === 'ar' ? 'سيفن جرين' : 'Seven Green'}</span>
                    <span className="block font-semibold text-primary text-sm">SEVEN GREEN</span>
                    <span className="block text-muted-foreground text-sm">{language === 'ar' ? 'منتج العناية بالشعر الطبيعي' : 'Natural Hair Care Product'}</span>
                    <span className="flex items-center gap-1 mt-1">
                      <span className="text-yellow-500 text-sm">★★★★★</span>
                      <span className="text-xs text-muted-foreground">(5.0)</span>
                    </span>
                  </span>
                  <span className="text-left">
                    <span className="block text-xs text-muted-foreground mb-1">{language === 'ar' ? 'السعر' : 'Price'}</span>
                    <span className="text-xl font-bold text-primary"><PriceDisplay {...getPriceData(productPrice)} /></span>
                  </span>
                </span>
              </CardDescription>
            </CardHeader>
            <CardContent className="p-4 sm:p-6">
              {error && (
                <Alert variant="destructive" className="mb-6">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription className="text-right">
                    {error}
                  </AlertDescription>
                </Alert>
              )}

              {step === "payment" && clientSecret && orderId ? (
                <div className="space-y-4">
                  <div className="border-t pt-4 bg-accent/30 -mx-4 px-4 py-4 lg:-mx-6 lg:px-6 rounded-lg">
                    <div className="flex justify-between items-center text-lg font-semibold">
                      <span className="text-primary">{t('order.total')}:</span>
                      <PriceDisplay {...getPriceData(totalAmount)} />
                    </div>
                  </div>
                  <StripePaymentForm
                    clientSecret={clientSecret}
                    orderId={orderId}
                    onBack={() => {
                      setStep("form");
                      setClientSecret(null);
                      setOrderId(null);
                      setError(null);
                    }}
                  />
                </div>
              ) : (
              <form onSubmit={handleSubmit} className="space-y-4 lg:space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="name" className={`block mobile-text font-medium ${language === 'ar' ? 'text-right' : 'text-left'}`}>{t('order.name')} *</Label>
                  <Input
                    id="name"
                    type="text"
                    placeholder={t('order.name.placeholder')}
                    value={formData.customerName}
                    onChange={(e) => handleInputChange("customerName", e.target.value)}
                    className={`mobile-input touch-target ${language === 'ar' ? 'text-right' : 'text-left'}`}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="phone" className={`block mobile-text font-medium flex items-center gap-2 ${language === 'ar' ? 'text-right' : 'text-left'}`}>
                    <Phone className="w-4 h-4" />
                    {t('order.phone')} *
                  </Label>
                  <div className="flex gap-2">
                    <Select
                      value={formData.countryCode}
                      onValueChange={(value) => {
                        handleInputChange("countryCode", value);
                        // Also set the country based on phone code
                        const country = countries.find(c => c.phoneCode === value);
                        if (country) {
                          handleInputChange("country", country.code);
                        }
                      }}
                    >
                      <SelectTrigger className="w-[140px] text-right touch-target">
                        <SelectValue>
                          <div className="flex items-center gap-2">
                            <span>{countries.find(c => c.phoneCode === formData.countryCode)?.flag}</span>
                            <span>{formData.countryCode}</span>
                          </div>
                        </SelectValue>
                      </SelectTrigger>
                      <SelectContent className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 shadow-lg z-50">
                        {countries.map((country) => (
                          <SelectItem key={country.code} value={country.phoneCode} className="hover:bg-gray-100 dark:hover:bg-gray-700">
                            <div className="flex items-center gap-2">
                              <span>{country.flag}</span>
                              <span>{country.phoneCode}</span>
                              <span className="text-sm text-muted-foreground">{country.name}</span>
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <Input
                      id="phone"
                      type="tel"
                      placeholder={t('order.phone.placeholder')}
                      value={formData.customerPhone}
                      onChange={(e) => handleInputChange("customerPhone", e.target.value)}
                      className={`mobile-input touch-target flex-1 ${language === 'ar' ? 'text-right' : 'text-left'}`}
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email" className={`block mobile-text font-medium ${language === 'ar' ? 'text-right' : 'text-left'}`}>{t('order.email')}</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder={t('order.email.placeholder')}
                    value={formData.customerEmail}
                    onChange={(e) => handleInputChange("customerEmail", e.target.value)}
                    className={`mobile-input touch-target ${language === 'ar' ? 'text-right' : 'text-left'}`}
                  />
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="country" className={`block mobile-text font-medium flex items-center gap-2 ${language === 'ar' ? 'text-right' : 'text-left'}`}>
                      <Flag className="w-4 h-4" />
                      {t('order.country')} *
                    </Label>
                    <Select
                      value={formData.country}
                      onValueChange={(value) => {
                        handleInputChange("country", value);
                        // Update country code based on selected country
                        const country = countries.find(c => c.code === value);
                        if (country) {
                          handleInputChange("countryCode", country.phoneCode);
                        }
                      }}
                      required
                    >
                      <SelectTrigger className={`touch-target ${language === 'ar' ? 'text-right' : 'text-left'}`}>
                        <SelectValue placeholder={t('order.country.placeholder')}>
                          {formData.country && (
                            <div className="flex items-center gap-2">
                              <span>{countries.find(c => c.code === formData.country)?.flag}</span>
                              <span>{countries.find(c => c.code === formData.country)?.name}</span>
                            </div>
                          )}
                        </SelectValue>
                      </SelectTrigger>
                      <SelectContent className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 shadow-lg z-50">
                        {countries.map((country) => (
                          <SelectItem key={country.code} value={country.code} className="hover:bg-gray-100 dark:hover:bg-gray-700">
                            <div className="flex items-center gap-2">
                              <span>{country.flag}</span>
                              <span>{country.name}</span>
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="city" className={`block mobile-text font-medium ${language === 'ar' ? 'text-right' : 'text-left'}`}>{t('order.city')} *</Label>
                    <Input
                      id="city"
                      type="text"
                      placeholder={t('order.city.placeholder')}
                      value={formData.city}
                      onChange={(e) => handleInputChange("city", e.target.value)}
                      className={`mobile-input touch-target ${language === 'ar' ? 'text-right' : 'text-left'}`}
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="address" className={`block mobile-text font-medium ${language === 'ar' ? 'text-right' : 'text-left'}`}>{t('order.address')} *</Label>
                  <Input
                    id="address"
                    type="text"
                    placeholder={t('order.address.placeholder')}
                    value={formData.address}
                    onChange={(e) => handleInputChange("address", e.target.value)}
                    className={`mobile-input touch-target ${language === 'ar' ? 'text-right' : 'text-left'}`}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="quantity" className={`block mobile-text font-medium ${language === 'ar' ? 'text-right' : 'text-left'}`}>{t('order.quantity')}</Label>
                  <div className="flex items-center justify-center gap-4">
                    <Button
                      type="button"
                      variant="outline"
                      size="lg"
                      onClick={() => handleInputChange("quantity", Math.max(1, formData.quantity - 1))}
                      disabled={formData.quantity <= 1}
                      className="touch-target w-12 h-12 rounded-full"
                    >
                      -
                    </Button>
                    <span className="text-xl lg:text-2xl font-semibold w-12 text-center">{formData.quantity}</span>
                    <Button
                      type="button"
                      variant="outline"
                      size="lg"
                      onClick={() => handleInputChange("quantity", formData.quantity + 1)}
                      className="touch-target w-12 h-12 rounded-full"
                    >
                      +
                    </Button>
                  </div>
                </div>

                <div className="border-t pt-4 bg-accent/30 -mx-4 px-4 py-4 lg:-mx-6 lg:px-6 rounded-lg">
                  <div className="flex flex-col sm:flex-row justify-between items-center gap-2 text-lg lg:text-xl font-semibold">
                    <span className="text-primary">{t('order.total')}: <PriceDisplay {...getPriceData(totalAmount)} /></span>
                    <span className="text-muted-foreground text-sm lg:text-base">(<PriceDisplay {...getPriceData(productPrice)} /> × {formData.quantity})</span>
                  </div>
                </div>

                <PaymentMethods />

                <Button
                  type="submit"
                  variant="hero"
                  size="lg"
                  className="w-full mobile-button touch-target"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      {t('order.processing')}
                    </>
                  ) : (
                    language === 'ar' ? "متابعة للدفع" : "Continue to payment"
                  )}
                </Button>
              </form>
              )}
            </CardContent>
          </Card>

          {/* Trust Signals */}
          <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card className="p-4 text-center">
              <Shield className="w-8 h-8 mx-auto mb-2 text-primary" />
              <h3 className="font-semibold text-sm">{language === 'ar' ? 'دفع آمن 100%' : '100% Secure Payment'}</h3>
            </Card>
            <Card className="p-4 text-center">
              <Truck className="w-8 h-8 mx-auto mb-2 text-primary" />
              <h3 className="font-semibold text-sm">{language === 'ar' ? 'توصيل سريع' : 'Fast Delivery'}</h3>
            </Card>
            <Card className="p-4 text-center">
              <RotateCcw className="w-8 h-8 mx-auto mb-2 text-primary" />
              <h3 className="font-semibold text-sm">{language === 'ar' ? 'ضمان 30 يوم' : '30-Day Guarantee'}</h3>
            </Card>
          </div>

          {/* SEO Content */}
          <section className="mt-12 prose prose-lg dark:prose-invert mx-auto max-w-3xl px-4">
            <h2 className="text-2xl font-bold mb-4">
              {language === 'ar' ? 'لماذا تطلب من سفن جرين؟' : 'Why Order from Seven Green?'}
            </h2>
            <ul className="space-y-2">
              <li>✅ {language === 'ar' ? 'توصيل سريع لجميع دول الخليج' : 'Fast delivery to all GCC countries'}</li>
              <li>✅ {language === 'ar' ? 'ضمان استرجاع المال 30 يوم' : '30-day money-back guarantee'}</li>
              <li>✅ {language === 'ar' ? 'منتج أصلي 100% معتمد من هيئة الغذاء والدواء' : '100% original product certified by FDA'}</li>
              <li>✅ {language === 'ar' ? 'دعم عملاء على مدار الساعة' : '24/7 customer support'}</li>
              <li>✅ {language === 'ar' ? 'دفع آمن ومشفر' : 'Secure encrypted payment'}</li>
            </ul>
          </section>

          <TrustBadges />
        </div>
      </div>
    </MobileOptimized>
    </>
  );
};

export default Order;
