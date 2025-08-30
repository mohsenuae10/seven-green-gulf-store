import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { ShoppingCart, MapPin, User, Crown, Shield, Truck, CreditCard, ArrowRight } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Link } from "react-router-dom";

const Order = () => {
  const [formData, setFormData] = useState({
    customerName: "",
    customerPhone: "",
    customerEmail: "",
    country: "",
    city: "",
    address: ""
  });
  const [quantity, setQuantity] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const price = 299;
  const shipping = 0;
  const total = price * quantity + shipping;

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validation
    if (!formData.customerName || !formData.customerPhone || !formData.country || !formData.city || !formData.address) {
      toast({
        title: "خطأ في البيانات",
        description: "يرجى ملء جميع الحقول المطلوبة",
        variant: "destructive"
      });
      return;
    }

    setIsLoading(true);

    try {
      const { data, error } = await supabase.functions.invoke('create-ziina-payment', {
        body: {
          customerName: formData.customerName,
          customerPhone: formData.customerPhone,
          customerEmail: formData.customerEmail,
          country: formData.country,
          city: formData.city,
          address: formData.address,
          quantity,
          totalAmount: total
        }
      });

      if (error) {
        console.error("Payment error:", error);
        throw new Error(error.message);
      }

      if (data?.success && data?.payment_url) {
        // Redirect to Ziina payment page
        window.location.href = data.payment_url;
      } else {
        throw new Error(data?.error || "فشل في إنشاء رابط الدفع");
      }

    } catch (error) {
      console.error("Order submission error:", error);
      toast({
        title: "خطأ في معالجة الطلب",
        description: error.message || "حدث خطأ أثناء معالجة طلبك. يرجى المحاولة مرة أخرى.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-primary/5" dir="rtl">
      
      {/* Header */}
      <div className="bg-background/80 backdrop-blur-sm border-b border-border/50 sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link to="/" className="flex items-center gap-2 text-primary hover:text-primary/80 transition-colors">
              <ArrowRight className="w-5 h-5" />
              <span>العودة للمتجر</span>
            </Link>
            <h1 className="text-xl font-bold text-foreground">إتمام الطلب</h1>
            <div></div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        
        {/* Section Header */}
        <div className="text-center mb-12 animate-slide-up">
          <div className="inline-flex items-center gap-2 bg-primary/10 rounded-full px-6 py-2 mb-6">
            <ShoppingCart className="w-5 h-5 text-primary" />
            <span className="text-primary font-medium">اطلب الآن</span>
          </div>
          
          <h2 className="text-4xl lg:text-5xl font-bold text-foreground mb-6">
            احصل على سيفن جرين اليوم
          </h2>
          
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            اطلب الآن واستمتع بشحن مجاني لجميع دول الخليج مع ضمان الجودة
          </p>
        </div>

        <form onSubmit={handleSubmit} className="grid lg:grid-cols-3 gap-12 max-w-6xl mx-auto">
          
          {/* Order Form */}
          <div className="lg:col-span-2">
            <Card className="bg-gradient-card border-border/50 shadow-medium">
              <div className="p-8">
                <h3 className="text-2xl font-bold text-foreground mb-8 flex items-center gap-3">
                  <User className="w-6 h-6 text-primary" />
                  معلومات الطلب
                </h3>

                <div className="space-y-6">
                  {/* Personal Information */}
                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="name" className="text-foreground font-medium">الاسم الكامل *</Label>
                      <Input 
                        id="name" 
                        placeholder="أدخل اسمك الكامل"
                        value={formData.customerName}
                        onChange={(e) => handleInputChange("customerName", e.target.value)}
                        className="bg-background/50 border-border/50 focus:border-primary"
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="phone" className="text-foreground font-medium">رقم الهاتف *</Label>
                      <Input 
                        id="phone" 
                        placeholder="+966 50 123 4567"
                        value={formData.customerPhone}
                        onChange={(e) => handleInputChange("customerPhone", e.target.value)}
                        className="bg-background/50 border-border/50 focus:border-primary"
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="email" className="text-foreground font-medium">البريد الإلكتروني (اختياري)</Label>
                    <Input 
                      id="email" 
                      type="email"
                      placeholder="example@email.com"
                      value={formData.customerEmail}
                      onChange={(e) => handleInputChange("customerEmail", e.target.value)}
                      className="bg-background/50 border-border/50 focus:border-primary"
                    />
                  </div>

                  {/* Shipping Information */}
                  <div className="border-t border-border/50 pt-6">
                    <h4 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
                      <MapPin className="w-5 h-5 text-primary" />
                      معلومات الشحن
                    </h4>
                    
                    <div className="grid md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <Label htmlFor="country" className="text-foreground font-medium">الدولة *</Label>
                        <Select value={formData.country} onValueChange={(value) => handleInputChange("country", value)} required>
                          <SelectTrigger className="bg-background/50 border-border/50 focus:border-primary">
                            <SelectValue placeholder="اختر الدولة" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="sa">السعودية</SelectItem>
                            <SelectItem value="ae">الإمارات</SelectItem>
                            <SelectItem value="kw">الكويت</SelectItem>
                            <SelectItem value="qa">قطر</SelectItem>
                            <SelectItem value="bh">البحرين</SelectItem>
                            <SelectItem value="om">عُمان</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="city" className="text-foreground font-medium">المدينة *</Label>
                        <Input 
                          id="city" 
                          placeholder="أدخل اسم المدينة"
                          value={formData.city}
                          onChange={(e) => handleInputChange("city", e.target.value)}
                          className="bg-background/50 border-border/50 focus:border-primary"
                          required
                        />
                      </div>
                    </div>

                    <div className="space-y-2 mt-4">
                      <Label htmlFor="address" className="text-foreground font-medium">العنوان التفصيلي *</Label>
                      <Textarea 
                        id="address" 
                        placeholder="أدخل العنوان الكامل (الحي، اسم الشارع، رقم المبنى)"
                        rows={3}
                        value={formData.address}
                        onChange={(e) => handleInputChange("address", e.target.value)}
                        className="bg-background/50 border-border/50 focus:border-primary resize-none"
                        required
                      />
                    </div>
                  </div>

                  {/* Quantity Selection */}
                  <div className="border-t border-border/50 pt-6">
                    <Label className="text-foreground font-medium mb-4 block">الكمية</Label>
                    <div className="flex items-center gap-4">
                      <Button 
                        type="button"
                        variant="outline" 
                        size="sm"
                        onClick={() => setQuantity(Math.max(1, quantity - 1))}
                        className="w-10 h-10 rounded-full"
                      >
                        -
                      </Button>
                      <span className="text-xl font-semibold text-foreground min-w-[3rem] text-center">{quantity}</span>
                      <Button 
                        type="button"
                        variant="outline" 
                        size="sm"
                        onClick={() => setQuantity(quantity + 1)}
                        className="w-10 h-10 rounded-full"
                      >
                        +
                      </Button>
                      <span className="text-muted-foreground">× {price} ريال</span>
                    </div>
                  </div>
                </div>
              </div>
            </Card>
          </div>

          {/* Order Summary */}
          <div className="space-y-6">
            
            {/* Product Card */}
            <Card className="bg-gradient-card border-border/50 shadow-medium overflow-hidden">
              <div className="p-6">
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-20 h-20 bg-gradient-primary rounded-xl flex items-center justify-center">
                    <Crown className="w-10 h-10 text-primary-foreground" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-foreground">سيفن جرين</h3>
                    <p className="text-muted-foreground text-sm">للعناية المتقدمة بالشعر</p>
                    <div className="flex items-center gap-1 mt-1">
                      {[1,2,3,4,5].map((star) => (
                        <div key={star} className="w-3 h-3 bg-secondary rounded-full"></div>
                      ))}
                      <span className="text-xs text-muted-foreground mr-2">4.9 (2,847)</span>
                    </div>
                  </div>
                </div>

                {/* Price Breakdown */}
                <div className="space-y-3 border-t border-border/50 pt-4">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">السعر ({quantity} قطعة)</span>
                    <span className="font-medium">{price * quantity} ريال</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">الشحن</span>
                    <span className="font-medium text-secondary">مجاني</span>
                  </div>
                  <div className="flex justify-between text-lg font-bold border-t border-border/50 pt-3">
                    <span>المجموع</span>
                    <span className="text-primary">{total} ريال</span>
                  </div>
                </div>

                {/* Trust Badges */}
                <div className="grid grid-cols-3 gap-2 mt-6 pt-4 border-t border-border/50">
                  <div className="text-center">
                    <Shield className="w-6 h-6 text-primary mx-auto mb-1" />
                    <span className="text-xs text-muted-foreground">آمن</span>
                  </div>
                  <div className="text-center">
                    <Truck className="w-6 h-6 text-primary mx-auto mb-1" />
                    <span className="text-xs text-muted-foreground">شحن سريع</span>
                  </div>
                  <div className="text-center">
                    <CreditCard className="w-6 h-6 text-primary mx-auto mb-1" />
                    <span className="text-xs text-muted-foreground">دفع آمن</span>
                  </div>
                </div>
              </div>
            </Card>

            {/* Order Button */}
            <Button 
              type="submit" 
              size="lg" 
              disabled={isLoading}
              className="w-full bg-gradient-secondary hover:scale-105 transition-all duration-300 shadow-glow text-lg py-6 rounded-2xl"
            >
              <ShoppingCart className="w-5 h-5 ml-2" />
              {isLoading ? "جاري المعالجة..." : "تأكيد الطلب والدفع"}
            </Button>

            {/* Payment Methods */}
            <Card className="bg-gradient-card border-border/50 p-4">
              <h4 className="font-semibold text-foreground mb-3 text-center">طرق الدفع المتاحة</h4>
              <div className="grid grid-cols-2 gap-2 text-center">
                <div className="bg-background/30 rounded-lg p-2">
                  <CreditCard className="w-6 h-6 mx-auto mb-1 text-primary" />
                  <span className="text-xs text-muted-foreground">بطاقة ائتمان</span>
                </div>
                <div className="bg-background/30 rounded-lg p-2">
                  <div className="w-6 h-6 mx-auto mb-1 bg-secondary rounded"></div>
                  <span className="text-xs text-muted-foreground">محافظ رقمية</span>
                </div>
              </div>
            </Card>

            {/* Guarantee */}
            <div className="text-center bg-secondary/10 rounded-xl p-4">
              <Shield className="w-8 h-8 text-secondary mx-auto mb-2" />
              <div className="font-semibold text-secondary">ضمان 30 يوم</div>
              <div className="text-sm text-muted-foreground">أو استرداد كامل للمبلغ</div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Order;