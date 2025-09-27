import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";
import { useCurrency } from "@/hooks/useCurrency";
import { 
  ShoppingCart, 
  Package, 
  DollarSign, 
  Users,
  TrendingUp,
  Calendar
} from "lucide-react";

interface AnalyticsData {
  totalOrders: number;
  totalRevenue: number;
  totalProducts: number;
  pendingOrders: number;
  completedOrders: number;
  paidOrders: number;
  confirmedOrders: number;
  shippedOrders: number;
  recentOrders: any[];
  monthlyRevenue: number;
  paidRevenue: number;
}

export function AnalyticsDashboard() {
  const { formatPrice } = useCurrency();
  const [analytics, setAnalytics] = useState<AnalyticsData>({
    totalOrders: 0,
    totalRevenue: 0,
    totalProducts: 0,
    pendingOrders: 0,
    completedOrders: 0,
    paidOrders: 0,
    confirmedOrders: 0,
    shippedOrders: 0,
    recentOrders: [],
    monthlyRevenue: 0,
    paidRevenue: 0,
  });
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    fetchAnalytics();
  }, []);

  const fetchAnalytics = async () => {
    try {
      // Fetch orders data
      const { data: orders, error: ordersError } = await supabase
        .from('orders')
        .select('*');

      // Fetch products data
      const { data: products, error: productsError } = await supabase
        .from('products')
        .select('*');

      if (ordersError) {
        console.error('Error fetching orders:', ordersError);
        toast({
          title: "خطأ",
          description: "فشل في تحميل بيانات الطلبات",
          variant: "destructive",
        });
        return;
      }

      if (productsError) {
        console.error('Error fetching products:', productsError);
        toast({
          title: "خطأ",
          description: "فشل في تحميل بيانات المنتجات",
          variant: "destructive",
        });
        return;
      }

      // Calculate analytics
      const totalOrders = orders?.length || 0;
      const paidOrders = orders?.filter(order => order.payment_status === 'paid')?.length || 0;
      const confirmedOrders = orders?.filter(order => order.status === 'confirmed')?.length || 0;
      const shippedOrders = orders?.filter(order => order.status === 'shipped')?.length || 0;
      const pendingOrders = orders?.filter(order => order.status === 'pending')?.length || 0;
      const completedOrders = orders?.filter(order => order.status === 'delivered')?.length || 0;
      
      // Calculate revenues - total and only from paid orders
      const totalRevenue = orders?.reduce((sum, order) => sum + (order.total_amount || 0), 0) || 0;
      const paidRevenue = orders?.filter(order => order.payment_status === 'paid')
        .reduce((sum, order) => sum + (order.total_amount || 0), 0) || 0;
      
      // Calculate monthly revenue (current month)
      const currentMonth = new Date().getMonth();
      const currentYear = new Date().getFullYear();
      const monthlyRevenue = orders?.filter(order => {
        const orderDate = new Date(order.created_at);
        return order.payment_status === 'paid' && 
               orderDate.getMonth() === currentMonth && 
               orderDate.getFullYear() === currentYear;
      }).reduce((sum, order) => sum + (order.total_amount || 0), 0) || 0;
      
      const totalProducts = products?.length || 0;
      const recentOrders = orders?.slice(0, 5) || [];

      setAnalytics({
        totalOrders,
        totalRevenue,
        paidRevenue,
        monthlyRevenue,
        totalProducts,
        pendingOrders,
        completedOrders,
        paidOrders,
        confirmedOrders,
        shippedOrders,
        recentOrders,
      });
    } catch (error) {
      console.error('Error fetching analytics:', error);
      toast({
        title: "خطأ",
        description: "حدث خطأ أثناء تحميل البيانات",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  const statCards = [
    {
      title: "إجمالي الطلبات",
      value: analytics.totalOrders,
      icon: ShoppingCart,
      description: "جميع الطلبات",
      color: "text-blue-600",
    },
    {
      title: "الإيرادات المدفوعة",
      value: formatPrice(analytics.paidRevenue),
      icon: DollarSign,
      description: "من الطلبات المدفوعة",
      color: "text-green-600",
    },
    {
      title: "طلبات مدفوعة",
      value: analytics.paidOrders,
      icon: TrendingUp,
      description: "طلبات تم دفعها",
      color: "text-emerald-600",
    },
    {
      title: "طلبات في الانتظار",
      value: analytics.pendingOrders,
      icon: Calendar,
      description: "تحتاج معالجة",
      color: "text-orange-600",
    },
  ];

  return (
    <div className="space-y-6">
      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((stat) => (
          <Card key={stat.title}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                {stat.title}
              </CardTitle>
              <stat.icon className={`h-4 w-4 ${stat.color}`} />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
              <p className="text-xs text-muted-foreground">
                {stat.description}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Recent Orders */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5" />
              الطلبات الأخيرة
            </CardTitle>
            <CardDescription>
              آخر 5 طلبات تم استلامها
            </CardDescription>
          </CardHeader>
          <CardContent>
            {analytics.recentOrders.length === 0 ? (
              <p className="text-muted-foreground text-center py-4">
                لا توجد طلبات حتى الآن
              </p>
            ) : (
              <div className="space-y-4">
                {analytics.recentOrders.map((order) => (
                  <div key={order.id} className="flex items-center justify-between border-b pb-2">
                    <div>
                      <p className="font-medium">{order.customer_name}</p>
                      <p className="text-sm text-muted-foreground">
                        {new Date(order.created_at).toLocaleDateString('ar-AE')}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-medium">{formatPrice(order.total_amount)}</p>
                      <p className={`text-xs ${
                        order.status === 'delivered' ? 'text-green-600' : 
                        order.status === 'pending' ? 'text-orange-600' : 'text-blue-600'
                      }`}>
                        {order.status === 'delivered' ? 'تم التسليم' : 
                         order.status === 'pending' ? 'في الانتظار' : 
                         order.status === 'confirmed' ? 'مؤكد' : 
                         order.status === 'shipped' ? 'تم الشحن' : order.status}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              ملخص سريع
            </CardTitle>
            <CardDescription>
              إحصائيات سريعة عن المتجر
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span>طلبات مؤكدة</span>
                <span className="font-bold text-blue-600">{analytics.confirmedOrders}</span>
              </div>
              <div className="flex justify-between items-center">
                <span>طلبات مشحونة</span>
                <span className="font-bold text-purple-600">{analytics.shippedOrders}</span>
              </div>
              <div className="flex justify-between items-center">
                <span>طلبات مكتملة</span>
                <span className="font-bold text-green-600">{analytics.completedOrders}</span>
              </div>
              <div className="flex justify-between items-center">
                <span>معدل الدفع</span>
                <span className="font-bold text-emerald-600">
                  {analytics.totalOrders > 0 
                    ? Math.round((analytics.paidOrders / analytics.totalOrders) * 100)
                    : 0}%
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span>إيرادات هذا الشهر</span>
                <span className="font-bold text-green-600">
                  {formatPrice(analytics.monthlyRevenue)}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span>متوسط الطلب المدفوع</span>
                <span className="font-bold">
                  {analytics.paidOrders > 0 
                    ? formatPrice(Math.round(analytics.paidRevenue / analytics.paidOrders))
                    : formatPrice(0)}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}