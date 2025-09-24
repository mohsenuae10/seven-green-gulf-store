import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/components/ui/use-toast";
import { useCurrency } from "@/hooks/useCurrency";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Eye, Package, User, MapPin, Phone, Mail, Calendar, CreditCard } from "lucide-react";

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
  created_at: string;
  updated_at: string;
  total_items?: number;
}

export function OrdersManagement() {
  const { formatPrice } = useCurrency();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const { data, error } = await supabase
        .from('orders')
        .select(`
          *,
          order_items(quantity)
        `)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching orders:', error);
        toast({
          title: "خطأ",
          description: "فشل في تحميل الطلبات",
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
      console.error('Error fetching orders:', error);
      toast({
        title: "خطأ",
        description: "حدث خطأ أثناء تحميل الطلبات",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const updateOrderStatus = async (orderId: string, status: string) => {
    try {
      const { error } = await supabase
        .from('orders')
        .update({ status, updated_at: new Date().toISOString() })
        .eq('id', orderId);

      if (error) {
        console.error('Error updating order status:', error);
        toast({
          title: "خطأ",
          description: "فشل في تحديث حالة الطلب",
          variant: "destructive",
        });
        return;
      }

      toast({
        title: "تم التحديث",
        description: "تم تحديث حالة الطلب بنجاح",
      });

      fetchOrders(); // Refresh orders
    } catch (error) {
      console.error('Error updating order status:', error);
      toast({
        title: "خطأ",
        description: "حدث خطأ أثناء تحديث الطلب",
        variant: "destructive",
      });
    }
  };

  const updatePaymentStatus = async (orderId: string, paymentStatus: string) => {
    try {
      const { error } = await supabase
        .from('orders')
        .update({ payment_status: paymentStatus, updated_at: new Date().toISOString() })
        .eq('id', orderId);

      if (error) {
        console.error('Error updating payment status:', error);
        toast({
          title: "خطأ",
          description: "فشل في تحديث حالة الدفع",
          variant: "destructive",
        });
        return;
      }

      toast({
        title: "تم التحديث",
        description: "تم تحديث حالة الدفع بنجاح",
      });

      fetchOrders(); // Refresh orders
    } catch (error) {
      console.error('Error updating payment status:', error);
      toast({
        title: "خطأ",
        description: "حدث خطأ أثناء تحديث حالة الدفع",
        variant: "destructive",
      });
    }
  };

  const getStatusBadge = (status: string) => {
    const statusMap = {
      pending: { label: "في الانتظار", variant: "secondary" as const },
      confirmed: { label: "مؤكد", variant: "default" as const },
      shipped: { label: "تم الشحن", variant: "default" as const },
      delivered: { label: "تم التسليم", variant: "default" as const },
      cancelled: { label: "ملغي", variant: "destructive" as const },
    };
    
    const statusInfo = statusMap[status as keyof typeof statusMap] || statusMap.pending;
    return <Badge variant={statusInfo.variant}>{statusInfo.label}</Badge>;
  };

  const getPaymentStatusBadge = (status: string) => {
    const statusMap = {
      pending: { label: "في الانتظار", variant: "secondary" as const },
      paid: { label: "مدفوع", variant: "default" as const },
      failed: { label: "فشل", variant: "destructive" as const },
    };
    
    const statusInfo = statusMap[status as keyof typeof statusMap] || statusMap.pending;
    return <Badge variant={statusInfo.variant}>{statusInfo.label}</Badge>;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>إدارة الطلبات</CardTitle>
          <CardDescription>
            عرض وإدارة جميع الطلبات في المتجر
          </CardDescription>
        </CardHeader>
        <CardContent>
          {orders.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-muted-foreground">لا توجد طلبات حتى الآن</p>
            </div>
          ) : (
            <div className="grid gap-6">
              {orders.map((order) => (
                <Card key={order.id} className="relative">
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Package className="h-4 w-4 text-primary" />
                        <CardTitle className="text-lg font-mono">
                          #{order.id.slice(-8)}
                        </CardTitle>
                      </div>
                      <div className="flex gap-2">
                        {getStatusBadge(order.status)}
                        {getPaymentStatusBadge(order.payment_status)}
                      </div>
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
                          <div className="text-sm">
                            <div>{new Date(order.created_at).toLocaleDateString('ar-AE')}</div>
                            <div className="text-muted-foreground text-xs">
                              {new Date(order.created_at).toLocaleTimeString('ar-AE', { 
                                hour: '2-digit', 
                                minute: '2-digit',
                                hour12: true 
                              })}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Order Summary */}
                    <div className="border-t pt-4">
                      <div className="flex items-center justify-between mb-4">
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
                        <Button size="sm" variant="outline">
                          <Eye className="h-4 w-4 mr-1" />
                          عرض التفاصيل
                        </Button>
                      </div>

                      {/* Status Controls */}
                      <div className="grid md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <label className="text-sm font-medium">حالة الطلب</label>
                          <Select
                            value={order.status}
                            onValueChange={(value) => updateOrderStatus(order.id, value)}
                          >
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="pending">في الانتظار</SelectItem>
                              <SelectItem value="confirmed">مؤكد</SelectItem>
                              <SelectItem value="shipped">تم الشحن</SelectItem>
                              <SelectItem value="delivered">تم التسليم</SelectItem>
                              <SelectItem value="cancelled">ملغي</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        
                        <div className="space-y-2">
                          <label className="text-sm font-medium">حالة الدفع</label>
                          <Select
                            value={order.payment_status}
                            onValueChange={(value) => updatePaymentStatus(order.id, value)}
                          >
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="pending">في الانتظار</SelectItem>
                              <SelectItem value="paid">مدفوع</SelectItem>
                              <SelectItem value="failed">فشل</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}