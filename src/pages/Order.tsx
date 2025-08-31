
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useProductPrice } from "@/hooks/useProductPrice";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { AlertCircle, Loader2 } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import MobileNav from "@/components/MobileNav";
import MobileOptimized from "@/components/MobileOptimized";

const Order = () => {
  const [formData, setFormData] = useState({
    customerName: "",
    customerPhone: "",
    customerEmail: "",
    country: "",
    city: "",
    address: "",
    quantity: 1,
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { price: productPrice } = useProductPrice({ fallback: 299 });
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
      
      const response = await fetch('https://dnvchztawygtkdddsiwn.supabase.co/functions/v1/create-ziina-payment', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRudmNoenRhd3lndGtkZGRzaXduIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTY1NjI4MjIsImV4cCI6MjA3MjEzODgyMn0.7Q3xdzggqnYmQicpp6wjfmLlyp40f0sCnr0G6NWQNfM',
        },
        body: JSON.stringify({
          ...formData,
          totalAmount,
        }),
      });

      console.log("Response status:", response.status);
      console.log("Response headers:", response.headers);

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
        console.log("Redirecting to payment URL:", result.payment_url);
        window.location.href = result.payment_url;
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
            <h1 className="mobile-heading font-bold text-gray-900 mb-2">اطلب سيفن جرين الآن</h1>
            <p className="text-gray-600 mobile-text">املأ النموذج أدناه لإتمام طلبك</p>
          </div>

          <Card className="mobile-card shadow-medium border-border/50">
            <CardHeader className="pb-4">
              <CardTitle className="text-right mobile-subheading">معلومات الطلب</CardTitle>
              <CardDescription className="text-right mobile-text">
                سيفن جرين - منتج العناية بالشعر الطبيعي
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
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
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
                    <Label htmlFor="phone" className="text-right block mobile-text font-medium">رقم الهاتف *</Label>
                    <Input
                      id="phone"
                      type="tel"
                      placeholder="+971501234567"
                      value={formData.customerPhone}
                      onChange={(e) => handleInputChange("customerPhone", e.target.value)}
                      className="text-right mobile-input touch-target"
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
                    <Label htmlFor="country" className="text-right block mobile-text font-medium">الدولة *</Label>
                    <Select
                      value={formData.country}
                      onValueChange={(value) => handleInputChange("country", value)}
                      required
                    >
                      <SelectTrigger className="text-right touch-target">
                        <SelectValue placeholder="اختر الدولة" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="UAE">الإمارات العربية المتحدة</SelectItem>
                        <SelectItem value="Saudi Arabia">المملكة العربية السعودية</SelectItem>
                        <SelectItem value="Qatar">قطر</SelectItem>
                        <SelectItem value="Kuwait">الكويت</SelectItem>
                        <SelectItem value="Bahrain">البحرين</SelectItem>
                        <SelectItem value="Oman">عمان</SelectItem>
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
                    <span className="text-primary">المجموع: {totalAmount} درهم</span>
                    <span className="text-muted-foreground text-sm lg:text-base">({productPrice} درهم × {formData.quantity})</span>
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
