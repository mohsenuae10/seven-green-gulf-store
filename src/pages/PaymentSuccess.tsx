import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Header from "@/components/Header";
import { CheckCircle, Package, Truck, Phone, Home, Loader2 } from "lucide-react";
import { Link, useSearchParams } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { trackPurchase } from "@/lib/metaPixel";

// TypeScript declaration for gtag
declare global {
  interface Window {
    dataLayer: any[];
    gtag: (...args: any[]) => void;
  }
}

interface OrderData {
  id: string;
  customer_name: string;
  customer_phone: string;
  customer_email: string;
  country: string;
  city: string;
  address: string;
  total_amount: number;
  currency: string;
  status: string;
  payment_status: string;
  created_at: string;
  updated_at: string;
}

const PURCHASE_TRACKED_KEY = "sg_meta_purchase_tracked";

const wasPurchaseTracked = (orderId: string) => {
  try {
    return JSON.parse(localStorage.getItem(PURCHASE_TRACKED_KEY) || "[]").includes(orderId);
  } catch {
    return false;
  }
};

const markPurchaseTracked = (orderId: string) => {
  try {
    const tracked = JSON.parse(localStorage.getItem(PURCHASE_TRACKED_KEY) || "[]");
    localStorage.setItem(PURCHASE_TRACKED_KEY, JSON.stringify([...tracked, orderId].slice(-50)));
  } catch {
    // ignore storage errors
  }
};

const PaymentSuccess = () => {
  const [searchParams] = useSearchParams();
  const orderId = searchParams.get('order_id');
  const [orderData, setOrderData] = useState<OrderData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    let cancelled = false;
    let conversionTracked = false;

    // This page is DISPLAY-ONLY. The Stripe webhook is the single source of
    // truth that marks an order paid. Here we just read the status, and poll
    // briefly in case the webhook hasn't landed yet right after the redirect.
    const fetchOrder = async () => {
      const { data, error: orderError } = await supabase
        .rpc('get_order_secure', { order_id_param: orderId });
      if (orderError) throw new Error(orderError.message);
      if (!data || data.length === 0) throw new Error("الطلب غير موجود");
      return data[0] as OrderData;
    };

    const trackConversion = (order: OrderData) => {
      console.log("[PaymentSuccess] trackConversion() called for order:", order.id, "payment_status:", order.payment_status);
      if (conversionTracked) {
        console.log("[PaymentSuccess] SKIPPED — already tracked this mount (conversionTracked=true)");
        return;
      }
      if (wasPurchaseTracked(order.id)) {
        console.log("[PaymentSuccess] SKIPPED — order already in localStorage dedup list:", order.id);
        return;
      }
      conversionTracked = true;
      markPurchaseTracked(order.id);
      console.log("[PaymentSuccess] proceeding to fire Purchase for order:", order.id, "amount:", order.total_amount, order.currency);
      // Google Ads Purchase Conversion Event
      // NOTE: استبدل 'XXXXXX' بالـ Conversion ID من Google Ads
      if (typeof window.gtag !== 'undefined') {
        window.gtag('event', 'conversion', {
          'send_to': 'AW-17646380077/XXXXXX',
          'value': order.total_amount,
          'currency': order.currency,
          'transaction_id': order.id,
        });
      }
      // Meta Pixel Purchase Conversion Event — only fires once the order is
      // confirmed paid, using the order's real settlement amount/currency.
      trackPurchase({
        value: order.total_amount,
        currency: order.currency,
        orderId: order.id,
      });
      console.log("[PaymentSuccess] trackPurchase() call returned for order:", order.id);
    };

    const run = async () => {
      if (!orderId) {
        setError("معرف الطلب غير موجود");
        setLoading(false);
        return;
      }

      try {
        // Poll for the webhook to confirm the payment. Stripe webhooks can lag
        // a few seconds behind the redirect, so we keep retrying for up to ~2
        // minutes rather than giving up after a few seconds and silently
        // missing the Purchase conversion event.
        const maxAttempts = 40;
        for (let attempt = 0; attempt < maxAttempts; attempt++) {
          const order = await fetchOrder();
          console.log(`[PaymentSuccess] poll attempt ${attempt + 1}/${maxAttempts} — order ${order.id} payment_status=${order.payment_status}`);
          if (cancelled) return;
          setOrderData(order);
          // Stop showing the generic loading skeleton as soon as we have any
          // order data — the "pending confirmation" UI takes over from here
          // while polling continues quietly in the background.
          setLoading(false);

          if (order.payment_status === 'paid') {
            trackConversion(order);
            break;
          }
          if (order.payment_status === 'failed') break;

          // Still pending: wait and retry.
          if (attempt < maxAttempts - 1) {
            await new Promise((r) => setTimeout(r, 3000));
          }
        }
      } catch (err: any) {
        console.error("Error fetching order:", err);
        if (cancelled) return;
        setError(err.message || "حدث خطأ في جلب تفاصيل الطلب");
        toast({
          title: "خطأ",
          description: "لم نتمكن من جلب تفاصيل طلبك. يرجى المحاولة مرة أخرى.",
          variant: "destructive",
        });
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    run();
    return () => {
      cancelled = true;
    };
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
              onClick={() => window.open("https://wa.me/971508824227", "_blank")}
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
    <div className="min-h-screen bg-gradient-to-b from-background to-primary/5" dir="rtl">
      <Header />
      <div className="container mx-auto px-4 py-8">
        
        <div className="max-w-2xl mx-auto text-center">
          
          {/* Success Icon */}
          <div className="w-24 h-24 mx-auto mb-8 bg-gradient-primary rounded-full flex items-center justify-center animate-bounce">
            <CheckCircle className="w-12 h-12 text-primary-foreground" />
          </div>

          {/* Success Message */}
          <Card className="bg-gradient-card border-border/50 shadow-medium p-8 mb-8">
            <h1 className="text-3xl font-bold text-foreground mb-4">
              {orderData.payment_status === 'paid'
                ? 'تم تأكيد طلبك بنجاح! 🎉'
                : orderData.payment_status === 'failed'
                ? 'لم يكتمل الدفع'
                : 'جاري تأكيد الدفع...'}
            </h1>

            <p className="text-xl text-muted-foreground mb-6">
              {orderData.payment_status === 'paid'
                ? 'شكراً لك على ثقتك في سيفن جرين. تم استلام طلبك وسيتم معالجته قريباً.'
                : orderData.payment_status === 'failed'
                ? 'تعذّر إتمام عملية الدفع. لم يتم خصم أي مبلغ. يمكنك المحاولة مرة أخرى أو التواصل معنا.'
                : 'نتحقق من عملية الدفع لديك، قد يستغرق ذلك لحظات. لا تغلق الصفحة.'}
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
                  <span className={`font-medium ${
                    orderData.payment_status === 'paid'
                      ? 'text-secondary'
                      : orderData.payment_status === 'failed'
                      ? 'text-destructive'
                      : 'text-yellow-600'
                  }`}>
                    {orderData.payment_status === 'paid'
                      ? 'مؤكد ومدفوع'
                      : orderData.payment_status === 'failed'
                      ? 'فشل الدفع'
                      : 'بانتظار تأكيد الدفع...'}
                  </span>
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
                <p className="text-sm text-muted-foreground">توصيل سريع</p>
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
                <p className="text-muted-foreground">التوصيل سريع</p>
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