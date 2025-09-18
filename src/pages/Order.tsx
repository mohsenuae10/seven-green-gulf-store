
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useProductPrice } from "@/hooks/useProductPrice";
import { useCurrency } from "@/hooks/useCurrency";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { AlertCircle, Loader2, Phone, Flag } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import MobileNav from "@/components/MobileNav";
import MobileOptimized from "@/components/MobileOptimized";

// Country data with codes and flags
const countries = [
  { code: "AE", name: "الإمارات العربية المتحدة", flag: "🇦🇪", phoneCode: "+971" },
  { code: "SA", name: "المملكة العربية السعودية", flag: "🇸🇦", phoneCode: "+966" },
  { code: "QA", name: "قطر", flag: "🇶🇦", phoneCode: "+974" },
  { code: "KW", name: "الكويت", flag: "🇰🇼", phoneCode: "+965" },
  { code: "BH", name: "البحرين", flag: "🇧🇭", phoneCode: "+973" },
  { code: "OM", name: "عمان", flag: "🇴🇲", phoneCode: "+968" },
];

const Order = () => {
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
  const { price: productPrice } = useProductPrice({ fallback: 299 });
  const { formatPrice } = useCurrency();
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleInputChange = (field: string, value: string | number) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (error) setError(null);
  };

  const validateForm = () => {
    if (!formData.customerName.trim()) {
      setError("يرجى إدخال الاسم");
      return false;
    }
    if (!formData.customerPhone.trim()) {
      setError("يرجى إدخال رقم الهاتف");
      return false;
    }
    if (!formData.country) {
      setError("يرجى اختيار الدولة");
      return false;
    }
    if (!formData.city.trim()) {
      setError("يرجى إدخال المدينة");
      return false;
    }
    if (!formData.address.trim()) {
      setError("يرجى إدخال العنوان");
      return false;
    }
    if (formData.quantity < 1) {
      setError("يجب أن تكون الكمية أكبر من صفر");
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
      const totalAmount = productPrice * formData.quantity;
      
      console.log("Submitting order with data:", { ...formData, totalAmount });
      
      const response = await fetch('https://dnvchztawygtkdddsiwn.supabase.co/functions/v1/create-stripe-payment', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRudmNoenRhd3lndGtkZGRzaXduIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTY1NjI4MjIsImV4cCI6MjA3MjEzODgyMn0.7Q3xdzggqnYmQicpp6wjfmLlyp40f0sCnr0G6NWQNfM',
        },
        body: JSON.stringify({
          customerName: formData.customerName,
          customerEmail: formData.customerEmail,
          customerPhone: formData.customerPhone,
          country: formData.country,
          city: formData.city,
          address: formData.address,
          quantity: formData.quantity,
          totalAmount,
          currency: 'AED',
        }),
      });

      console.log("Response status:", response.status);

      // Check if response is ok
      if (!response.ok) {
        const errorText = await response.text();
        console.error("Error response:", errorText);
        throw new Error(`خطأ في الخادم: ${response.status}`);
      }

      // Try to parse JSON response
      let result;
      try {
        const responseText = await response.text();
        console.log("Raw response:", responseText);
        result = JSON.parse(responseText);
      } catch (parseError) {
        console.error("Failed to parse JSON:", parseError);
        throw new Error("استجابة غير صحيحة من الخادم");
      }

      console.log("Payment response:", result);

      if (!result.success) {
        throw new Error(result.error || "فشل في معالجة الطلب");
      }

      if (result.payment_url) {
        console.log("Opening Stripe checkout in new tab:", result.payment_url);
        window.open(result.payment_url, '_blank');
        
        toast({
          title: "تم إنشاء الطلب بنجاح",
          description: "تم فتح صفحة الدفع في نافذة جديدة",
        });
      } else {
        throw new Error("لم يتم إنشاء رابط الدفع");
      }

    } catch (error) {
      console.error("Order submission error:", error);
      const errorMessage = error instanceof Error ? error.message : "حدث خطأ غير متوقع";
      setError(errorMessage);
      
      toast({
        title: "خطأ في الطلب",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const totalAmount = productPrice * formData.quantity;

  return (
    <MobileOptimized className="min-h-screen bg-gradient-to-br from-green-50 to-white">
      <MobileNav />
      <div className="mobile-container py-4 sm:py-8">
        <div className="max-w-2xl mx-auto">
          <div className="text-center mb-6 lg:mb-8 px-4">
            <h1 className="mobile-heading font-bold text-gray-900 mb-2">
              اطلب سيفن جرين الآن
              <span className="block text-base font-medium text-primary mt-1">SEVEN GREEN</span>
            </h1>
            <p className="text-gray-600 mobile-text">املأ النموذج أدناه لإتمام طلبك</p>
          </div>

          <Card className="mobile-card shadow-medium border-border/50">
            <CardHeader className="pb-4">
              <CardTitle className="text-right mobile-subheading">معلومات الطلب</CardTitle>
              <CardDescription className="text-right mobile-text">
                <div className="flex items-center gap-3 mt-3 p-3 bg-accent/20 rounded-lg">
                  <img 
                    src="/lovable-uploads/8d004a44-148f-471d-949f-6cc6b414bd1d.png" 
                    alt="سيفن جرين - منتج العناية بالشعر" 
                    className="w-16 h-16 object-cover rounded-lg shadow-sm"
                  />
                  <div className="flex-1">
                    <h3 className="font-bold text-foreground text-lg">سيفن جرين</h3>
                    <p className="font-semibold text-primary text-sm">SEVEN GREEN</p>
                    <p className="text-muted-foreground text-sm">منتج العناية بالشعر الطبيعي</p>
                    <div className="flex items-center gap-1 mt-1">
                      <span className="text-secondary text-sm">★★★★★</span>
                      <span className="text-xs text-muted-foreground">(4.9)</span>
                    </div>
                  </div>
                  <div className="text-left">
                    <span className="text-xl font-bold text-primary">{formatPrice(productPrice)}</span>
                  </div>
                </div>
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

              <form onSubmit={handleSubmit} className="space-y-4 lg:space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="name" className="text-right block mobile-text font-medium">الاسم الكامل *</Label>
                  <Input
                    id="name"
                    type="text"
                    placeholder="أدخل اسمك الكامل"
                    value={formData.customerName}
                    onChange={(e) => handleInputChange("customerName", e.target.value)}
                    className="text-right mobile-input touch-target"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="phone" className="text-right block mobile-text font-medium flex items-center gap-2">
                    <Phone className="w-4 h-4" />
                    رقم الهاتف *
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
                      placeholder="501234567"
                      value={formData.customerPhone}
                      onChange={(e) => handleInputChange("customerPhone", e.target.value)}
                      className="text-right mobile-input touch-target flex-1"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email" className="text-right block mobile-text font-medium">البريد الإلكتروني (اختياري)</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="example@email.com"
                    value={formData.customerEmail}
                    onChange={(e) => handleInputChange("customerEmail", e.target.value)}
                    className="text-right mobile-input touch-target"
                  />
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="country" className="text-right block mobile-text font-medium flex items-center gap-2">
                      <Flag className="w-4 h-4" />
                      الدولة *
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
                      <SelectTrigger className="text-right touch-target">
                        <SelectValue placeholder="اختر الدولة">
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
                    <Label htmlFor="city" className="text-right block mobile-text font-medium">المدينة *</Label>
                    <Input
                      id="city"
                      type="text"
                      placeholder="أدخل المدينة"
                      value={formData.city}
                      onChange={(e) => handleInputChange("city", e.target.value)}
                      className="text-right mobile-input touch-target"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="address" className="text-right block mobile-text font-medium">العنوان الكامل *</Label>
                  <Input
                    id="address"
                    type="text"
                    placeholder="أدخل العنوان التفصيلي"
                    value={formData.address}
                    onChange={(e) => handleInputChange("address", e.target.value)}
                    className="text-right mobile-input touch-target"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="quantity" className="text-right block mobile-text font-medium">الكمية</Label>
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
                    <span className="text-primary">المجموع: {formatPrice(totalAmount)}</span>
                    <span className="text-muted-foreground text-sm lg:text-base">({formatPrice(productPrice)} × {formData.quantity})</span>
                  </div>
                </div>

                <Button
                  type="submit"
                  className="w-full bg-gradient-secondary hover:bg-gradient-primary text-white mobile-button touch-target rounded-full shadow-glow hover:scale-105 transition-all duration-300"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      جاري المعالجة...
                    </>
                  ) : (
                    "تأكيد الطلب والدفع"
                  )}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </MobileOptimized>
  );
};

export default Order;
