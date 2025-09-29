import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckCircle, Package, Truck, Phone, Home, Loader2 } from "lucide-react";
import { Link, useSearchParams } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface OrderData {
  id: string;
  customer_name: string;
  customer_phone: string;
  customer_email: string;
  country: string;
  city: string;
  address: string;
  total_amount: number;
  status: string;
  payment_status: string;
  created_at: string;
  updated_at: string;
}

const PaymentSuccess = () => {
  const [searchParams] = useSearchParams();
  const orderId = searchParams.get('order_id');
  const [orderData, setOrderData] = useState<OrderData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    const fetchOrderDetails = async () => {
      if (!orderId) {
        setError("معرف الطلب غير موجود");
        setLoading(false);
        return;
      }

      try {
        // Use secure function instead of direct database query
        const { data, error: orderError } = await supabase
          .rpc('get_order_secure', { order_id_param: orderId });

        if (orderError) {
          throw new Error(orderError.message);
        }

        if (data && data.length > 0) {
          const order = data[0];
          setOrderData(order);
          
          // Update payment status if still pending using secure function
          if (order.payment_status === 'pending') {
            await supabase.rpc('update_order_payment_status', {
              order_id_param: orderId
            });
            
            // Send payment confirmation email
            try {
              await supabase.functions.invoke('send-payment-confirmation', {
                body: {
                  customerName: order.customer_name,
                  customerEmail: order.customer_email,
                  orderId: orderId,
                  totalAmount: order.total_amount,
                  productName: 'منتج Seven Green للعناية بالشعر'
                }
              });
              console.log('Payment confirmation email sent successfully');
            } catch (emailError) {
              console.error('Error sending payment confirmation email:', emailError);
              // Don't fail the whole process if email fails
            }
            
            // Update local state to reflect the change
            setOrderData({
              ...order,
              payment_status: 'paid',
              status: 'confirmed'
            });
          }
        } else {
          throw new Error("الطلب غير موجود");
        }
      } catch (err: any) {
        console.error("Error fetching order:", err);
        setError(err.message || "حدث خطأ في جلب تفاصيل الطلب");
        toast({
          title: "خطأ",
          description: "لم نتمكن من جلب تفاصيل طلبك. يرجى المحاولة مرة أخرى.",
          variant: "destructive"
        });
      } finally {
        setLoading(false);
      }
    };

    fetchOrderDetails();
  }, [orderId, toast]);

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-background to-primary/5 flex items-center justify-center" dir="rtl">
        <div className="text-center">
          <Loader2 className="w-12 h-12 text-primary mx-auto mb-4 animate-spin" />
          <p className="text-lg text-muted-foreground">جاري تحميل تفاصيل طلبك...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (error || !orderData) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-background to-primary/5 flex items-center justify-center" dir="rtl">
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-lg mx-auto text-center">
            <Card className="bg-gradient-card border-border/50 shadow-medium p-8">
              <h1 className="text-2xl font-bold text-foreground mb-4">عذراً، حدث خطأ</h1>
              <p className="text-muted-foreground mb-6">
                {error || "لم نتمكن من العثور على طلبك. يرجى التحقق من رقم الطلب والمحاولة مرة أخرى."}
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link to="/">
                  <Button size="lg" className="bg-gradient-primary">
                    <Home className="w-5 h-5 ml-2" />
                    العودة للمتجر
                  </Button>
                </Link>
                <Button 
                  variant="outline" 
                  size="lg"
                  onClick={() => window.open("https://wa.me/966503093939", "_blank")}
                >
                  <Phone className="w-5 h-5 ml-2" />
                  تواصل معنا
                </Button>
              </div>
            </Card>
          </div>
        </div>
      </div>
    );
  }

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

            {/* Order Details */}
            <div className="bg-primary/10 rounded-lg p-6 mb-6 text-right">
              <h3 className="text-lg font-bold text-foreground mb-4">تفاصيل الطلب</h3>
              
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">رقم الطلب:</span>
                  <span className="font-mono text-primary">#{orderId?.slice(-8)}</span>
                </div>
                
                <div className="flex justify-between">
                  <span className="text-muted-foreground">اسم العميل:</span>
                  <span className="font-medium text-foreground">{orderData.customer_name}</span>
                </div>
                
                <div className="flex justify-between">
                  <span className="text-muted-foreground">رقم الهاتف:</span>
                  <span className="font-medium text-foreground">
                    {orderData.customer_phone.replace(/(\d{3})\d{4}(\d{4})/, '$1****$2')}
                  </span>
                </div>
                
                <div className="flex justify-between">
                  <span className="text-muted-foreground">العنوان:</span>
                  <span className="font-medium text-foreground">{orderData.city}, {orderData.country}</span>
                </div>
                
                <div className="flex justify-between">
                  <span className="text-muted-foreground">المبلغ الإجمالي:</span>
                  <span className="font-bold text-primary">{orderData.total_amount} ريال</span>
                </div>
                
                <div className="flex justify-between">
                  <span className="text-muted-foreground">حالة الطلب:</span>
                  <span className="font-medium text-secondary">مؤكد ومدفوع</span>
                </div>
              </div>
            </div>

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
              onClick={() => window.open("https://wa.me/971508824227", "_blank")}
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