import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";
import { User, Session } from '@supabase/supabase-js';
import { AdminSidebar, AdminBottomNav, menuItems } from "@/components/admin/AdminSidebar";
import { OrdersManagement } from "@/components/admin/OrdersManagement";
import { ProductsManagement } from "@/components/admin/ProductsManagement";
import BannerManagement from "@/components/admin/BannerManagement";
import { AnalyticsDashboard } from "@/components/admin/AnalyticsDashboard";
import { ShippingManagement } from "@/components/admin/ShippingManagement";
import { AdminRequestsManagement } from "@/components/admin/AdminRequestsManagement";

const Admin = () => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const [activeSection, setActiveSection] = useState("dashboard");
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    // Set up auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setSession(session);
        setUser(session?.user ?? null);
        
        if (!session?.user) {
          navigate("/auth");
        } else {
          // Check admin role after setting user
          setTimeout(() => {
            checkAdminRole(session.user.id);
          }, 0);
        }
      }
    );

    // Check for existing session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      
      if (!session?.user) {
        navigate("/auth");
      } else {
        checkAdminRole(session.user.id);
      }
    });

    return () => subscription.unsubscribe();
  }, [navigate]);

  const checkAdminRole = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from('user_roles')
        .select('role')
        .eq('user_id', userId)
        .eq('role', 'admin')
        .single();

      if (error && error.code !== 'PGRST116') {
        console.error('Error checking admin role:', error);
        toast({
          title: "خطأ",
          description: "فشل في التحقق من صلاحيات المستخدم",
          variant: "destructive",
        });
        return;
      }

      if (!data) {
        setIsAdmin(false);
        return;
      }

      setIsAdmin(true);
    } catch (error) {
      console.error('Error checking admin role:', error);
      navigate("/");
    } finally {
      setLoading(false);
    }
  };

  const promoteToAdmin = async () => {
    try {
      const { error } = await supabase.rpc('make_current_user_admin');
      if (error) {
        toast({
          title: "خطأ",
          description: `تعذر ترقية الحساب: ${error.message}`,
          variant: "destructive",
        });
        return;
      }
      toast({ title: "تمت الترقية", description: "تمت إضافة صلاحية المشرف لحسابك." });
      setIsAdmin(true);
    } catch (e) {
      toast({ title: "خطأ", description: "حدث خطأ غير متوقع", variant: "destructive" });
    }
  };

  const handleSignOut = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      toast({
        title: "خطأ",
        description: "فشل في تسجيل الخروج",
        variant: "destructive",
      });
    } else {
      navigate("/auth");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
          <p className="mt-2 text-muted-foreground">جاري التحميل...</p>
        </div>
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle>غير مصرح بالدخول</CardTitle>
            <CardDescription>
              الحساب الحالي ({user?.email}) لا يملك صلاحيات الوصول لصفحة الإدارة.
              يرجى تسجيل الخروج والدخول بحساب مسؤول، أو التواصل مع الإدارة للحصول على الصلاحيات.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <Button 
              onClick={handleSignOut} 
              className="w-full"
            >
              تسجيل الخروج والعودة لتسجيل الدخول
            </Button>
            <Button 
              variant="outline"
              onClick={() => navigate("/")} 
              className="w-full"
            >
              العودة للصفحة الرئيسية
            </Button>
            <Button 
              variant="outline" 
              onClick={() => window.open("https://wa.me/971508824227", "_blank")}
              className="w-full"
            >
              تواصل مع الإدارة للحصول على صلاحيات
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const renderActiveSection = () => {
    switch (activeSection) {
      case "orders":
        return <OrdersManagement />;
      case "shipping":
        return <ShippingManagement />;
      case "products":
        return <ProductsManagement />;
      case "banner":
        return <BannerManagement />;
      case "admin-requests":
        return <AdminRequestsManagement />;
      case "dashboard":
      default:
        return <AnalyticsDashboard />;
    }
  };

  const activeItem = menuItems.find(m => m.id === activeSection);
  const ActiveIcon = activeItem?.icon;

  return (
    /* Fixed full-screen layout — no page scroll, like a native app */
    <div className="fixed inset-0 flex flex-col bg-gray-50 overflow-hidden" dir="rtl">

      {/* ── Top Header (fixed) ── */}
      <header className="flex items-center justify-between px-4 h-14 bg-white border-b border-gray-100 shrink-0 z-40">
        <div className="flex items-center gap-2.5">
          <img
            src="/images/sevengreen-logo.webp"
            alt="Seven Green"
            className="h-8 w-auto object-contain lg:hidden"
            onError={e => { e.currentTarget.style.display = 'none'; }}
          />
          <div className="flex items-center gap-2">
            {ActiveIcon && <ActiveIcon className="w-4 h-4 text-primary" />}
            <h1 className="text-sm font-bold text-gray-900">
              {activeItem?.label || 'لوحة التحكم'}
            </h1>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs text-gray-400 hidden sm:block">{user?.email}</span>
          <button
            onClick={handleSignOut}
            className="text-xs text-red-500 hover:text-red-700 px-2 py-1 rounded-lg hover:bg-red-50 transition-colors"
          >
            خروج
          </button>
        </div>
      </header>

      {/* ── Body: sidebar + content ── */}
      <div className="flex flex-1 overflow-hidden">

        {/* Desktop sidebar */}
        <AdminSidebar
          activeSection={activeSection}
          setActiveSection={setActiveSection}
          user={user}
          onSignOut={handleSignOut}
        />

        {/* Scrollable content */}
        <main className="flex-1 overflow-y-auto">
          <div className="p-4 pb-24 lg:pb-6 lg:p-6 max-w-7xl mx-auto">
            {renderActiveSection()}
          </div>
        </main>
      </div>

      {/* Mobile bottom nav */}
      <AdminBottomNav
        activeSection={activeSection}
        setActiveSection={setActiveSection}
      />
    </div>
  );
};

export default Admin;