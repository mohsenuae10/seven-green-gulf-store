import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/components/ui/use-toast";
import { User, Session } from '@supabase/supabase-js';

const Auth = () => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    // Set up auth state listener FIRST
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setSession(session);
        setUser(session?.user ?? null);
        
        if (session?.user) {
          // Defer navigation to avoid auth state conflicts
          setTimeout(() => {
            navigate("/admin");
          }, 0);
        }
      }
    );

    // THEN check for existing session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      
      if (session?.user) {
        navigate("/admin");
      }
    });

    return () => subscription.unsubscribe();
  }, [navigate]);

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        if (error.message.includes("Invalid login credentials")) {
          toast({
            title: "خطأ في تسجيل الدخول",
            description: "البريد الإلكتروني أو كلمة المرور غير صحيحة",
            variant: "destructive",
          });
        } else {
          toast({
            title: "خطأ",
            description: error.message,
            variant: "destructive",
          });
        }
      }
    } catch (error) {
      toast({
        title: "خطأ",
        description: "حدث خطأ غير متوقع",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const redirectUrl = `${window.location.origin}/`;
      
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: redirectUrl
        }
      });

      if (error) {
        if (error.message.includes("User already registered")) {
          toast({
            title: "المستخدم موجود مسبقاً",
            description: "هذا البريد الإلكتروني مسجل مسبقاً. يرجى تسجيل الدخول بدلاً من ذلك.",
            variant: "destructive",
          });
        } else {
          toast({
            title: "خطأ",
            description: error.message,
            variant: "destructive",
          });
        }
      } else {
        toast({
          title: "تم إنشاء الحساب",
          description: "تم إنشاء حسابك بنجاح. يمكنك الآن تسجيل الدخول أو طلب صلاحيات المسؤول.",
          variant: "default",
        });
      }
    } catch (error) {
      toast({
        title: "خطأ",
        description: "حدث خطأ غير متوقع",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleRequestAdmin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // First sign in to get the user
      const { data: signInData, error: signInError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (signInError) throw signInError;

      if (!signInData.user) {
        throw new Error("لم يتم العثور على المستخدم");
      }

      // Check if request already exists
      const { data: existingRequest } = await supabase
        .from('admin_requests')
        .select('*')
        .eq('user_id', signInData.user.id)
        .single();

      if (existingRequest) {
        if (existingRequest.status === 'pending') {
          toast({
            title: "طلب قيد المراجعة",
            description: "لديك طلب قيد المراجعة بالفعل. يرجى الانتظار حتى تتم مراجعته.",
          });
        } else if (existingRequest.status === 'approved') {
          toast({
            title: "تم الموافقة",
            description: "لديك بالفعل صلاحيات المسؤول!",
          });
        } else {
          toast({
            title: "طلب مرفوض سابقاً",
            description: "تم رفض طلبك السابق. يرجى التواصل مع الإدارة.",
            variant: "destructive",
          });
        }
        setLoading(false);
        return;
      }

      // Create new admin request
      const { error: requestError } = await supabase
        .from('admin_requests')
        .insert({
          user_id: signInData.user.id,
          email: signInData.user.email,
          status: 'pending',
        });

      if (requestError) throw requestError;

      toast({
        title: "تم إرسال الطلب",
        description: "تم إرسال طلبك للحصول على صلاحيات المسؤول. سيتم مراجعته قريباً.",
      });

      // Sign out after requesting
      await supabase.auth.signOut();
    } catch (error: any) {
      toast({
        title: "خطأ",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background to-muted p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold">لوحة التحكم</CardTitle>
          <CardDescription>
            تسجيل الدخول لإدارة متجر Seven Green
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="signin" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="signin">تسجيل الدخول</TabsTrigger>
              <TabsTrigger value="signup">إنشاء حساب</TabsTrigger>
              <TabsTrigger value="request">طلب صلاحيات</TabsTrigger>
            </TabsList>
            
            <TabsContent value="signin">
              <form onSubmit={handleSignIn} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email">البريد الإلكتروني</Label>
                  <Input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    placeholder="admin@example.com"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="password">كلمة المرور</Label>
                  <Input
                    id="password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    placeholder="••••••••"
                  />
                </div>
                <Button type="submit" className="w-full" disabled={loading}>
                  {loading ? "جاري تسجيل الدخول..." : "تسجيل الدخول"}
                </Button>
              </form>
            </TabsContent>
            
            <TabsContent value="signup">
              <form onSubmit={handleSignUp} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="signup-email">البريد الإلكتروني</Label>
                  <Input
                    id="signup-email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    placeholder="admin@example.com"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="signup-password">كلمة المرور</Label>
                  <Input
                    id="signup-password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    placeholder="••••••••"
                    minLength={6}
                  />
                </div>
                <Button type="submit" className="w-full" disabled={loading}>
                  {loading ? "جاري إنشاء الحساب..." : "إنشاء حساب"}
                </Button>
              </form>
            </TabsContent>

            <TabsContent value="request">
              <form onSubmit={handleRequestAdmin} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="request-email">البريد الإلكتروني</Label>
                  <Input
                    id="request-email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    placeholder="admin@example.com"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="request-password">كلمة المرور</Label>
                  <Input
                    id="request-password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    placeholder="••••••••"
                  />
                </div>
                <div className="text-sm text-muted-foreground bg-muted p-3 rounded">
                  سيتم إرسال طلبك للحصول على صلاحيات المسؤول. سيقوم أحد المسؤولين الحاليين بمراجعة طلبك.
                </div>
                <Button type="submit" className="w-full" disabled={loading}>
                  {loading ? "جاري إرسال الطلب..." : "طلب صلاحيات المسؤول"}
                </Button>
              </form>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default Auth;