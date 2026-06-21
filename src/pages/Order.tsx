
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
import { useCurrency } from "@/hooks/useCurrency";
import { useLanguage } from "@/hooks/useLanguage";
import { useCart } from "@/contexts/CartContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { AlertCircle, Loader2, Phone, Flag, ChevronRight, Shield, Truck, RotateCcw } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import MobileNav from "@/components/MobileNav";
import MobileOptimized from "@/components/MobileOptimized";
import PaymentMethods from "@/components/PaymentMethods";
import TrustBadges from "@/components/TrustBadges";
import { CONTACT_INFO } from "@/config/contact";
import { PriceDisplay } from "@/components/PriceDisplay";
import { supabase } from "@/integrations/supabase/client";
import StripePaymentForm from "@/components/checkout/StripePaymentForm";
import { trackInitiateCheckout } from "@/lib/metaPixel";
import Header from "@/components/Header";
import CountrySelect from "@/components/CountrySelect";
import { countries } from "@/data/countries";

const Order = () => {
  const { language, t } = useLanguage();
  const { items, updateQty, removeItem, totalPrice, clearCart } = useCart();

  const [formData, setFormData] = useState({
    customerName: "",
    customerPhone: "",
    customerEmail: "",
    country: "",
    countryCode: "",
    city: "",
    address: "",
  });
  const [detectingCountry, setDetectingCountry] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [step, setStep] = useState<"form" | "payment">("form");
  const [clientSecret, setClientSecret] = useState<string | null>(null);
  const [orderId, setOrderId] = useState<string | null>(null);
  const { getPriceData, selectedCurrency } = useCurrency();
  const { toast } = useToast();
  const navigate = useNavigate();

  // Auto-detect user country via IP geolocation
  useEffect(() => {
    const detect = async () => {
      try {
        const res = await fetch("https://ipwho.is/", { signal: AbortSignal.timeout(4000) });
        const data = await res.json();
        if (data?.success && data.country_code) {
          const matched = countries.find(c => c.code === data.country_code);
          if (matched) {
            setFormData(prev => ({
              ...prev,
              country: matched.code,
              countryCode: matched.phoneCode,
            }));
          }
        }
      } catch {
        // silent — user can pick manually
      } finally {
        setDetectingCountry(false);
      }
    };
    detect();
  }, []);

  // Google Ads Begin Checkout Conversion Event
  // NOTE: يحتاج Conversion ID منفصل للـ Begin Checkout - استبدل 'YYYYYY' بالـ ID من Google Ads
  useEffect(() => {
    if (typeof window.gtag !== 'undefined') {
      window.gtag('event', 'conversion', {
        'send_to': 'AW-17646380077/YYYYYY' // ⚠️ Replace with your Begin Checkout Conversion ID
      });
    }
  }, []);

  // Meta Pixel InitiateCheckout
  useEffect(() => {
    if (items.length === 0) return;
    trackInitiateCheckout({
      contentIds: items.map(i => i.productId),
      value: totalPrice,
      numItems: items.reduce((s, i) => s + i.quantity, 0),
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleInputChange = (field: string, value: string | number) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (error) setError(null);
  };

  const validateForm = () => {
    if (items.length === 0) {
      setError(language === 'ar' ? 'السلة فارغة، أضف منتجاً أولاً' : 'Cart is empty, add a product first');
      return false;
    }
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
      const { data, error: fnError } = await supabase.functions.invoke('create-payment-intent', {
        body: {
          customerName: formData.customerName,
          customerEmail: formData.customerEmail,
          customerPhone: `${formData.countryCode}${formData.customerPhone}`,
          country: formData.country,
          city: formData.city,
          address: formData.address,
          // Multi-product cart
          cartItems: items.map(i => ({
            productId: i.productId,
            quantity: i.quantity,
          })),
          // Fallback single-product for legacy compatibility
          quantity: items.reduce((s, i) => s + i.quantity, 0),
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

  const title = language === 'ar' 
    ? "اطلب سفن جرين الآن - توصيل سريع"
    : "Order Seven Green Now - Fast Delivery";
    
  const description = language === 'ar'
    ? "اطلب صابونة سفن جرين المثلثة الأصلية الآن. ضمان استرجاع المال 30 يوم. دفع آمن 100%."
    : "Order the original Seven Green Triangle Soap now. 30-day money-back guarantee. 100% secure payment.";

  const offerSchema = {
    "@context": "https://schema.org",
    "@type": "Offer",
    "url": "https://sevensgreen.com/order",
    "priceCurrency": "SAR",
    "price": totalPrice.toString(),
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
        <Header />
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

          {/* Cart summary */}
          {items.length === 0 ? (
            <Card className="p-8 text-center">
              <p className="text-muted-foreground mb-4">
                {language === 'ar' ? 'سلتك فارغة' : 'Your cart is empty'}
              </p>
              <Link to="/products">
                <Button variant="outline" className="rounded-full">
                  {language === 'ar' ? 'تصفح المنتجات' : 'Browse Products'}
                </Button>
              </Link>
            </Card>
          ) : (
          <Card className="mobile-card shadow-medium border-border/50">
            <CardHeader className="pb-2">
              <CardTitle className={`mobile-subheading ${language === 'ar' ? 'text-right' : 'text-left'}`}>
                {language === 'ar' ? 'منتجاتك' : 'Your Items'}
              </CardTitle>

              {/* Cart items list */}
              <div className="space-y-2 mt-3">
                {items.map(item => (
                  <div key={item.productId} className="flex items-center gap-3 p-2 bg-accent/10 rounded-lg">
                    <img src={item.image} alt={language === 'ar' ? item.name : item.nameEn}
                      className="w-12 h-12 object-cover rounded-lg shrink-0"
                      onError={(e) => { e.currentTarget.src = "/images/sevengreen-logo.webp"; }} />
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-sm truncate">{language === 'ar' ? item.name : item.nameEn}</p>
                      <p className="text-primary text-sm font-bold">
                        <PriceDisplay {...getPriceData(item.price)} />
                      </p>
                    </div>
                    <div className="flex items-center border border-gray-200 rounded-full overflow-hidden bg-white">
                      <button type="button" onClick={() => updateQty(item.productId, item.quantity - 1)}
                        className="w-7 h-7 flex items-center justify-center hover:bg-gray-100 text-sm">−</button>
                      <span className="w-8 text-center text-sm font-bold">{item.quantity}</span>
                      <button type="button" onClick={() => updateQty(item.productId, item.quantity + 1)}
                        className="w-7 h-7 flex items-center justify-center hover:bg-gray-100 text-sm">+</button>
                    </div>
                    <button type="button" onClick={() => removeItem(item.productId)}
                      className="text-red-400 hover:text-red-600 text-lg px-1">×</button>
                  </div>
                ))}
              </div>
            </CardHeader>
            <CardContent className="p-4 sm:p-6">
              {error && (
                <Alert variant="destructive" className="mb-6">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription className={language === 'ar' ? 'text-right' : 'text-left'}>
                    {error}
                  </AlertDescription>
                </Alert>
              )}

              {step === "payment" && clientSecret && orderId ? (
                <div className="space-y-4">
                  <div className="border-t pt-4 bg-accent/30 -mx-4 px-4 py-4 lg:-mx-6 lg:px-6 rounded-lg">
                    <div className="flex justify-between items-center text-lg font-semibold">
                      <span className="text-primary">{t('order.total')}:</span>
                      <PriceDisplay {...getPriceData(totalPrice)} className="text-2xl md:text-3xl font-black text-primary" />
                    </div>
                  </div>
                  <StripePaymentForm
                    clientSecret={clientSecret}
                    orderId={orderId}
                    shippingCountry={formData.country}
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
                {/* 1. الاسم */}
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

                {/* 2. الدولة */}
                <div className="space-y-2">
                  <Label className={`block mobile-text font-medium flex items-center gap-2 ${language === 'ar' ? 'text-right' : 'text-left'}`}>
                    <Flag className="w-4 h-4" />
                    {t('order.country')} *
                    {detectingCountry && (
                      <span className="text-xs text-muted-foreground font-normal flex items-center gap-1">
                        <Loader2 className="w-3 h-3 animate-spin" />
                        {language === 'ar' ? 'جاري الاكتشاف...' : 'Detecting...'}
                      </span>
                    )}
                  </Label>
                  <CountrySelect
                    value={formData.country}
                    onChange={(country) => {
                      handleInputChange("country", country.code);
                      handleInputChange("countryCode", country.phoneCode);
                    }}
                    placeholder={
                      detectingCountry
                        ? (language === 'ar' ? 'جاري اكتشاف دولتك...' : 'Detecting your country...')
                        : t('order.country.placeholder')
                    }
                  />
                </div>

                {/* 3. رقم الهاتف */}
                <div className="space-y-2">
                  <Label htmlFor="phone" className={`block mobile-text font-medium flex items-center gap-2 ${language === 'ar' ? 'text-right' : 'text-left'}`}>
                    <Phone className="w-4 h-4" />
                    {t('order.phone')} *
                  </Label>
                  <div className="flex gap-2">
                    <div className="w-[130px] shrink-0">
                      <CountrySelect
                        value={formData.country}
                        onChange={(country) => {
                          handleInputChange("country", country.code);
                          handleInputChange("countryCode", country.phoneCode);
                        }}
                        phoneCodeOnly
                      />
                    </div>
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

                {/* 4. البريد الإلكتروني */}
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

                {/* 5. المدينة */}
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

                <div className="border-t pt-4 bg-accent/30 -mx-4 px-4 py-4 lg:-mx-6 lg:px-6 rounded-lg">
                  <div className="flex justify-between items-center text-lg font-semibold">
                    <span className="text-gray-700">{t('order.total')}:</span>
                    <PriceDisplay {...getPriceData(totalPrice)} className="text-2xl md:text-3xl font-black text-primary" />
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
          )}

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
              <li>✅ {language === 'ar' ? 'توصيل سريع' : 'Fast delivery'}</li>
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
