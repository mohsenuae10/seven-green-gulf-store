import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";
import { User, Session } from '@supabase/supabase-js';
import { AdminSidebar } from "@/components/admin/AdminSidebar";
import { SidebarProvider } from "@/components/ui/sidebar";
import { OrdersManagement } from "@/components/admin/OrdersManagement";
import { ProductsManagement } from "@/components/admin/ProductsManagement";
import { AnalyticsDashboard } from "@/components/admin/AnalyticsDashboard";

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
            <CardTitle>غير مصرح</CardTitle>
            <CardDescription>
              ليس لديك صلاحيات للوصول إلى هذه الصفحة. يرجى التواصل مع المدير لمنحك صلاحيات الوصول.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <Button onClick={() => navigate("/")} className="w-full">
              العودة للصفحة الرئيسية
            </Button>
            <Button 
              variant="outline" 
              onClick={() => window.open("https://wa.me/966503093939", "_blank")}
              className="w-full"
            >
              تواصل مع الإدارة
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
      case "products":
        return <ProductsManagement />;
      case "dashboard":
      default:
        return <AnalyticsDashboard />;
    }
  };

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full">
        <AdminSidebar 
          activeSection={activeSection}
          setActiveSection={setActiveSection}
          user={user}
          onSignOut={handleSignOut}
        />
        
        <main className="flex-1 p-6 bg-muted/50">
          <div className="max-w-7xl mx-auto">
            <header className="mb-6">
              <h1 className="text-3xl font-bold">لوحة تحكم المسؤول</h1>
              <p className="text-muted-foreground">إدارة متجر Seven Green</p>
            </header>
            
            {renderActiveSection()}
          </div>
        </main>
      </div>
    </SidebarProvider>
  );
};

export default Admin;