import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckCircle, Package, Truck, Phone, Home } from "lucide-react";
import { Link, useSearchParams } from "react-router-dom";

const PaymentSuccess = () => {
  const [searchParams] = useSearchParams();
  const orderId = searchParams.get('order_id');
  const [orderData, setOrderData] = useState(null);

  useEffect(() => {
    // Here you could fetch order details using the order_id
    // For now, we'll show a success message
    console.log("Order ID:", orderId);
  }, [orderId]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-primary/5 flex items-center justify-center" dir="rtl">
      <div className="container mx-auto px-4 py-8">
        
        <div className="max-w-2xl mx-auto text-center">
          
          {/* Success Icon */}
          <div className="w-24 h-24 mx-auto mb-8 bg-gradient-primary rounded-full flex items-center justify-center animate-bounce">
            <CheckCircle className="w-12 h-12 text-primary-foreground" />
          </div>

          {/* Success Message */}
          <Card className="bg-gradient-card border-border/50 shadow-medium p-8 mb-8">
            <h1 className="text-3xl font-bold text-foreground mb-4">
              تم تأكيد طلبك بنجاح! 🎉
            </h1>
            
            <p className="text-xl text-muted-foreground mb-6">
              شكراً لك على ثقتك في سيفن جرين. تم استلام طلبك وسيتم معالجته قريباً.
            </p>

            {orderId && (
              <div className="bg-primary/10 rounded-lg p-4 mb-6">
                <p className="text-foreground font-medium">
                  رقم الطلب: <span className="font-mono text-primary">#{orderId.slice(-8)}</span>
                </p>
              </div>
            )}

            {/* Next Steps */}
            <div className="grid md:grid-cols-3 gap-4 mt-8">
              <div className="text-center p-4 bg-background/30 rounded-lg">
                <Package className="w-8 h-8 text-primary mx-auto mb-2" />
                <h3 className="font-semibold text-foreground mb-1">تحضير الطلب</h3>
                <p className="text-sm text-muted-foreground">سيتم تحضير طلبك خلال 24 ساعة</p>
              </div>
              
              <div className="text-center p-4 bg-background/30 rounded-lg">
                <Truck className="w-8 h-8 text-primary mx-auto mb-2" />
                <h3 className="font-semibold text-foreground mb-1">الشحن</h3>
                <p className="text-sm text-muted-foreground">شحن مجاني لجميع دول الخليج</p>
              </div>
              
              <div className="text-center p-4 bg-background/30 rounded-lg">
                <Phone className="w-8 h-8 text-primary mx-auto mb-2" />
                <h3 className="font-semibold text-foreground mb-1">التواصل</h3>
                <p className="text-sm text-muted-foreground">سنتواصل معك قريباً لتأكيد التفاصيل</p>
              </div>
            </div>
          </Card>

          {/* Important Notes */}
          <Card className="bg-gradient-card border-border/50 shadow-medium p-6 mb-8">
            <h2 className="text-xl font-bold text-foreground mb-4">معلومات مهمة</h2>
            <div className="space-y-3 text-right">
              <div className="flex items-start gap-3">
                <CheckCircle className="w-5 h-5 text-secondary mt-0.5 flex-shrink-0" />
                <p className="text-muted-foreground">سيتم التواصل معك خلال 24 ساعة لتأكيد الطلب وموعد التسليم</p>
              </div>
              <div className="flex items-start gap-3">
                <CheckCircle className="w-5 h-5 text-secondary mt-0.5 flex-shrink-0" />
                <p className="text-muted-foreground">الشحن مجاني لجميع دول الخليج</p>
              </div>
              <div className="flex items-start gap-3">
                <CheckCircle className="w-5 h-5 text-secondary mt-0.5 flex-shrink-0" />
                <p className="text-muted-foreground">ضمان 30 يوم أو استرداد كامل للمبلغ</p>
              </div>
              <div className="flex items-start gap-3">
                <CheckCircle className="w-5 h-5 text-secondary mt-0.5 flex-shrink-0" />
                <p className="text-muted-foreground">يمكنك التواصل معنا في أي وقت لمتابعة طلبك</p>
              </div>
            </div>
          </Card>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/">
              <Button size="lg" className="bg-gradient-primary hover:scale-105 transition-all duration-300">
                <Home className="w-5 h-5 ml-2" />
                العودة للمتجر
              </Button>
            </Link>
            
            <Button 
              variant="outline" 
              size="lg"
              onClick={() => window.open("https://wa.me/966500000000", "_blank")}
              className="hover:scale-105 transition-all duration-300"
            >
              <Phone className="w-5 h-5 ml-2" />
              تواصل معنا عبر واتساب
            </Button>
          </div>

          {/* Contact Info */}
          <div className="mt-8 p-4 bg-primary/5 rounded-lg">
            <p className="text-sm text-muted-foreground">
              في حالة وجود أي استفسارات، يمكنك التواصل معنا عبر الواتساب أو البريد الإلكتروني
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentSuccess;