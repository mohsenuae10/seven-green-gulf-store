import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";
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
  recentOrders: any[];
}

export function AnalyticsDashboard() {
  const [analytics, setAnalytics] = useState<AnalyticsData>({
    totalOrders: 0,
    totalRevenue: 0,
    totalProducts: 0,
    pendingOrders: 0,
    completedOrders: 0,
    recentOrders: [],
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
      const totalRevenue = orders?.reduce((sum, order) => sum + (order.total_amount || 0), 0) || 0;
      const totalProducts = products?.length || 0;
      const pendingOrders = orders?.filter(order => order.status === 'pending')?.length || 0;
      const completedOrders = orders?.filter(order => order.status === 'delivered')?.length || 0;
      const recentOrders = orders?.slice(0, 5) || [];

      setAnalytics({
        totalOrders,
        totalRevenue,
        totalProducts,
        pendingOrders,
        completedOrders,
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
      title: "إجمالي الإيرادات",
      value: `${analytics.totalRevenue} درهم`,
      icon: DollarSign,
      description: "المبيعات الإجمالية",
      color: "text-green-600",
    },
    {
      title: "عدد المنتجات",
      value: analytics.totalProducts,
      icon: Package,
      description: "منتجات في المتجر",
      color: "text-purple-600",
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
                      <p className="font-medium">{order.total_amount} درهم</p>
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
                <span>الطلبات المكتملة</span>
                <span className="font-bold text-green-600">{analytics.completedOrders}</span>
              </div>
              <div className="flex justify-between items-center">
                <span>الطلبات قيد المعالجة</span>
                <span className="font-bold text-orange-600">{analytics.pendingOrders}</span>
              </div>
              <div className="flex justify-between items-center">
                <span>معدل النجاح</span>
                <span className="font-bold text-blue-600">
                  {analytics.totalOrders > 0 
                    ? Math.round((analytics.completedOrders / analytics.totalOrders) * 100)
                    : 0}%
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span>متوسط قيمة الطلب</span>
                <span className="font-bold">
                  {analytics.totalOrders > 0 
                    ? Math.round(analytics.totalRevenue / analytics.totalOrders)
                    : 0} درهم
                </span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}