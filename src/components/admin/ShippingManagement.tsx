import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";
import { useCurrency } from "@/hooks/useCurrency";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Truck, Package, User, MapPin, Phone, Mail, Calendar, CreditCard, Send } from "lucide-react";

interface Order {
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
  tracking_number?: string;
  shipping_company?: string;
  seller_notes?: string;
  shipped_at?: string;
  created_at: string;
  updated_at: string;
  total_items?: number;
}

interface ShippingFormData {
  tracking_number: string;
  shipping_company: string;
  seller_notes: string;
}

export function ShippingManagement() {
  const { formatPrice } = useCurrency();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [processingOrder, setProcessingOrder] = useState<string | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    fetchPaidOrders();
  }, []);

  const fetchPaidOrders = async () => {
    try {
      const { data, error } = await supabase
        .from('orders')
        .select(`
          *,
          order_items(quantity)
        `)
        .eq('payment_status', 'paid')
        .in('status', ['confirmed', 'shipped'])
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching paid orders:', error);
        toast({
          title: "خطأ",
          description: "فشل في تحميل الطلبات المدفوعة",
          variant: "destructive",
        });
        return;
      }

      // Calculate total items for each order
      const ordersWithTotals = (data || []).map((order: any) => ({
        ...order,
        total_items: order.order_items?.reduce((sum: number, item: any) => sum + item.quantity, 0) || 0
      }));

      setOrders(ordersWithTotals);
    } catch (error) {
      console.error('Error fetching paid orders:', error);
      toast({
        title: "خطأ",
        description: "حدث خطأ أثناء تحميل الطلبات",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleShipping = async (orderId: string, formData: ShippingFormData) => {
    if (!formData.tracking_number || !formData.shipping_company) {
      toast({
        title: "خطأ",
        description: "يرجى إدخال رقم التتبع واسم شركة الشحن",
        variant: "destructive",
      });
      return;
    }

    setProcessingOrder(orderId);

    try {
      // Update order with shipping information
      const { error: updateError } = await supabase
        .from('orders')
        .update({
          status: 'shipped',
          tracking_number: formData.tracking_number,
          shipping_company: formData.shipping_company,
          seller_notes: formData.seller_notes || null,
          shipped_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        })
        .eq('id', orderId);

      if (updateError) {
        throw updateError;
      }

      // Find the order to get customer details
      const order = orders.find(o => o.id === orderId);
      if (!order || !order.customer_email) {
        toast({
          title: "تم تحديث الطلب",
          description: "تم تحديث معلومات الشحن بنجاح",
        });
        fetchPaidOrders();
        return;
      }

      // Send email notification
      const { error: emailError } = await supabase.functions.invoke('send-shipping-notification', {
        body: {
          customerName: order.customer_name,
          customerEmail: order.customer_email,
          orderId: order.id,
          trackingNumber: formData.tracking_number,
          shippingCompany: formData.shipping_company,
          sellerNotes: formData.seller_notes,
        }
      });

      if (emailError) {
        console.error('Error sending email:', emailError);
        toast({
          title: "تم تحديث الطلب",
          description: "تم تحديث معلومات الشحن لكن فشل في إرسال الإيميل",
          variant: "destructive",
        });
      } else {
        toast({
          title: "تم الشحن بنجاح",
          description: "تم تأكيد الشحن وإرسال إشعار للعميل",
        });
      }

      fetchPaidOrders(); // Refresh orders
    } catch (error) {
      console.error('Error processing shipping:', error);
      toast({
        title: "خطأ",
        description: "حدث خطأ أثناء معالجة الشحن",
        variant: "destructive",
      });
    } finally {
      setProcessingOrder(null);
    }
  };

  const getStatusBadge = (status: string) => {
    const statusMap = {
      confirmed: { label: "جاهز للشحن", variant: "secondary" as const },
      shipped: { label: "تم الشحن", variant: "default" as const },
    };
    
    const statusInfo = statusMap[status as keyof typeof statusMap] || statusMap.confirmed;
    return <Badge variant={statusInfo.variant}>{statusInfo.label}</Badge>;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  // Separate orders into ready to ship and shipped
  const readyToShip = orders.filter(order => order.status === 'confirmed');
  const shipped = orders.filter(order => order.status === 'shipped');

  return (
    <div className="space-y-6">
      {/* Ready to Ship Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Package className="h-5 w-5" />
            طلبات جاهزة للشحن
          </CardTitle>
          <CardDescription>
            الطلبات المدفوعة والجاهزة للشحن ({readyToShip.length})
          </CardDescription>
        </CardHeader>
        <CardContent>
          {readyToShip.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-muted-foreground">لا توجد طلبات جاهزة للشحن</p>
            </div>
          ) : (
            <div className="grid gap-4">
              {readyToShip.map((order) => (
                <OrderShippingCard 
                  key={order.id} 
                  order={order} 
                  onShipping={handleShipping}
                  processing={processingOrder === order.id}
                  formatPrice={formatPrice}
                />
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Shipped Orders Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Truck className="h-5 w-5" />
            الطلبات المشحونة
          </CardTitle>
          <CardDescription>
            الطلبات التي تم شحنها ({shipped.length})
          </CardDescription>
        </CardHeader>
        <CardContent>
          {shipped.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-muted-foreground">لا توجد طلبات مشحونة</p>
            </div>
          ) : (
            <div className="grid gap-4">
              {shipped.map((order) => (
                <ShippedOrderCard 
                  key={order.id} 
                  order={order} 
                  formatPrice={formatPrice}
                />
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

// Component for orders ready to ship
function OrderShippingCard({ 
  order, 
  onShipping, 
  processing, 
  formatPrice 
}: { 
  order: Order; 
  onShipping: (orderId: string, formData: ShippingFormData) => void;
  processing: boolean;
  formatPrice: (amount: number) => string;
}) {
  const [formData, setFormData] = useState<ShippingFormData>({
    tracking_number: '',
    shipping_company: '',
    seller_notes: ''
  });
  const [dialogOpen, setDialogOpen] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onShipping(order.id, formData);
    setDialogOpen(false);
    setFormData({ tracking_number: '', shipping_company: '', seller_notes: '' });
  };

  return (
    <Card className="relative border-amber-200 bg-amber-50">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Package className="h-4 w-4 text-primary" />
            <CardTitle className="text-lg font-mono">
              #{order.id.slice(-8)}
            </CardTitle>
          </div>
          <Badge variant="secondary">جاهز للشحن</Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Customer Info */}
        <div className="grid md:grid-cols-2 gap-4">
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <User className="h-4 w-4 text-muted-foreground" />
              <span className="font-medium">{order.customer_name}</span>
            </div>
            <div className="flex items-center gap-2">
              <Phone className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm">{order.customer_phone}</span>
            </div>
            {order.customer_email && (
              <div className="flex items-center gap-2">
                <Mail className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm">{order.customer_email}</span>
              </div>
            )}
          </div>
          
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <MapPin className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm">{order.country}, {order.city}</span>
            </div>
            <div className="flex items-start gap-2">
              <MapPin className="h-4 w-4 text-muted-foreground mt-0.5" />
              <span className="text-sm text-muted-foreground">{order.address}</span>
            </div>
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm">
                {new Date(order.created_at).toLocaleDateString('ar-AE')}
              </span>
            </div>
          </div>
        </div>

        {/* Order Summary */}
        <div className="border-t pt-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Badge variant="outline" className="bg-primary/10">
                <Package className="h-3 w-3 mr-1" />
                {order.total_items || 0} قطعة
              </Badge>
              <div className="flex items-center gap-2">
                <CreditCard className="h-4 w-4 text-muted-foreground" />
                <span className="text-lg font-semibold">{formatPrice(order.total_amount)}</span>
              </div>
            </div>
            
            <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
              <DialogTrigger asChild>
                <Button disabled={processing}>
                  <Send className="h-4 w-4 mr-1" />
                  تأكيد الشحن
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-md">
                <DialogHeader>
                  <DialogTitle>تأكيد شحن الطلب #{order.id.slice(-8)}</DialogTitle>
                  <DialogDescription>
                    أدخل معلومات الشحن لتأكيد إرسال الطلب
                  </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="tracking_number">رقم التتبع *</Label>
                    <Input
                      id="tracking_number"
                      value={formData.tracking_number}
                      onChange={(e) => setFormData({...formData, tracking_number: e.target.value})}
                      placeholder="أدخل رقم التتبع"
                      required
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="shipping_company">شركة الشحن *</Label>
                    <Input
                      id="shipping_company"
                      value={formData.shipping_company}
                      onChange={(e) => setFormData({...formData, shipping_company: e.target.value})}
                      placeholder="مثال: أرامكس، DHL، فيدكس"
                      required
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="seller_notes">ملاحظات خاصة</Label>
                    <Textarea
                      id="seller_notes"
                      value={formData.seller_notes}
                      onChange={(e) => setFormData({...formData, seller_notes: e.target.value})}
                      placeholder="ملاحظات إضافية للعميل (اختياري)"
                      rows={3}
                    />
                  </div>
                  
                  <div className="flex gap-2 pt-4">
                    <Button type="submit" disabled={processing} className="flex-1">
                      {processing ? "جاري المعالجة..." : "تأكيد الشحن"}
                    </Button>
                    <Button type="button" variant="outline" onClick={() => setDialogOpen(false)}>
                      إلغاء
                    </Button>
                  </div>
                </form>
              </DialogContent>
            </Dialog>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

// Component for shipped orders
function ShippedOrderCard({ order, formatPrice }: { order: Order; formatPrice: (amount: number) => string }) {
  return (
    <Card className="relative border-green-200 bg-green-50">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Truck className="h-4 w-4 text-green-600" />
            <CardTitle className="text-lg font-mono">
              #{order.id.slice(-8)}
            </CardTitle>
          </div>
          <Badge className="bg-green-100 text-green-800">تم الشحن</Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Customer Info */}
        <div className="grid md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <User className="h-4 w-4 text-muted-foreground" />
              <span className="font-medium">{order.customer_name}</span>
            </div>
            <div className="flex items-center gap-2">
              <Phone className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm">{order.customer_phone}</span>
            </div>
          </div>
          
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Package className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm">{order.total_items || 0} قطعة</span>
            </div>
            <div className="flex items-center gap-2">
              <CreditCard className="h-4 w-4 text-muted-foreground" />
              <span className="font-semibold">{formatPrice(order.total_amount)}</span>
            </div>
          </div>
        </div>

        {/* Shipping Info */}
        <div className="border-t pt-4 space-y-2">
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <Label className="text-xs text-muted-foreground">شركة الشحن</Label>
              <p className="text-sm font-medium">{order.shipping_company}</p>
            </div>
            <div>
              <Label className="text-xs text-muted-foreground">رقم التتبع</Label>
              <p className="text-sm font-mono bg-muted px-2 py-1 rounded">{order.tracking_number}</p>
            </div>
          </div>
          
          {order.seller_notes && (
            <div>
              <Label className="text-xs text-muted-foreground">ملاحظات</Label>
              <p className="text-sm">{order.seller_notes}</p>
            </div>
          )}
          
          <div>
            <Label className="text-xs text-muted-foreground">تاريخ الشحن</Label>
            <p className="text-sm">
              {order.shipped_at ? new Date(order.shipped_at).toLocaleDateString('ar-AE') : 'غير محدد'}
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}