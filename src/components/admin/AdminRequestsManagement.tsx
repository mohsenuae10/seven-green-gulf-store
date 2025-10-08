import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Check, X, Clock, UserPlus } from "lucide-react";

interface AdminRequest {
  id: string;
  user_id: string;
  email: string;
  status: 'pending' | 'approved' | 'rejected';
  requested_at: string;
  reviewed_at?: string;
  reviewed_by?: string;
  notes?: string;
}

export const AdminRequestsManagement = () => {
  const [requests, setRequests] = useState<AdminRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [processingId, setProcessingId] = useState<string | null>(null);
  const [notes, setNotes] = useState<{ [key: string]: string }>({});
  const { toast } = useToast();

  useEffect(() => {
    fetchRequests();
    setupRealtimeSubscription();
  }, []);

  const fetchRequests = async () => {
    try {
      const { data, error } = await supabase
        .from('admin_requests')
        .select('*')
        .order('requested_at', { ascending: false });

      if (error) throw error;
      setRequests((data || []) as AdminRequest[]);
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

  const setupRealtimeSubscription = () => {
    const channel = supabase
      .channel('admin_requests_changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'admin_requests'
        },
        () => {
          fetchRequests();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  };

  const handleApprove = async (request: AdminRequest) => {
    setProcessingId(request.id);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      // Add admin role
      const { error: roleError } = await supabase
        .from('user_roles')
        .insert({
          user_id: request.user_id,
          role: 'admin',
        });

      if (roleError) throw roleError;

      // Update request status
      const { error: updateError } = await supabase
        .from('admin_requests')
        .update({
          status: 'approved',
          reviewed_at: new Date().toISOString(),
          reviewed_by: user?.id,
          notes: notes[request.id] || null,
        })
        .eq('id', request.id);

      if (updateError) throw updateError;

      toast({
        title: "تمت الموافقة",
        description: `تم منح ${request.email} صلاحيات المسؤول`,
      });
    } catch (error: any) {
      toast({
        title: "خطأ",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setProcessingId(null);
    }
  };

  const handleReject = async (request: AdminRequest) => {
    setProcessingId(request.id);
    try {
      const { data: { user } } = await supabase.auth.getUser();

      const { error } = await supabase
        .from('admin_requests')
        .update({
          status: 'rejected',
          reviewed_at: new Date().toISOString(),
          reviewed_by: user?.id,
          notes: notes[request.id] || null,
        })
        .eq('id', request.id);

      if (error) throw error;

      toast({
        title: "تم الرفض",
        description: `تم رفض طلب ${request.email}`,
      });
    } catch (error: any) {
      toast({
        title: "خطأ",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setProcessingId(null);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pending':
        return <Badge variant="outline" className="gap-1"><Clock className="h-3 w-3" /> قيد الانتظار</Badge>;
      case 'approved':
        return <Badge variant="default" className="gap-1 bg-green-500"><Check className="h-3 w-3" /> موافق عليه</Badge>;
      case 'rejected':
        return <Badge variant="destructive" className="gap-1"><X className="h-3 w-3" /> مرفوض</Badge>;
      default:
        return null;
    }
  };

  const pendingCount = requests.filter(r => r.status === 'pending').length;

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <UserPlus className="h-5 w-5" />
                إدارة طلبات المسؤولين
              </CardTitle>
              <CardDescription>
                مراجعة والموافقة على طلبات الحصول على صلاحيات المسؤول
              </CardDescription>
            </div>
            {pendingCount > 0 && (
              <Badge variant="destructive" className="text-lg px-3 py-1">
                {pendingCount} طلب جديد
              </Badge>
            )}
          </div>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="text-center py-8">جاري التحميل...</div>
          ) : requests.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              لا توجد طلبات حتى الآن
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>البريد الإلكتروني</TableHead>
                  <TableHead>الحالة</TableHead>
                  <TableHead>تاريخ الطلب</TableHead>
                  <TableHead>ملاحظات</TableHead>
                  <TableHead>الإجراءات</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {requests.map((request) => (
                  <TableRow key={request.id}>
                    <TableCell className="font-medium">{request.email}</TableCell>
                    <TableCell>{getStatusBadge(request.status)}</TableCell>
                    <TableCell>
                      {new Date(request.requested_at).toLocaleDateString('ar-SA', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </TableCell>
                    <TableCell>
                      {request.status === 'pending' ? (
                        <Textarea
                          placeholder="أضف ملاحظات (اختياري)"
                          value={notes[request.id] || ''}
                          onChange={(e) => setNotes({ ...notes, [request.id]: e.target.value })}
                          className="min-h-[60px]"
                        />
                      ) : (
                        <span className="text-sm text-muted-foreground">
                          {request.notes || '-'}
                        </span>
                      )}
                    </TableCell>
                    <TableCell>
                      {request.status === 'pending' && (
                        <div className="flex gap-2">
                          <Button
                            size="sm"
                            onClick={() => handleApprove(request)}
                            disabled={processingId === request.id}
                            className="gap-1"
                          >
                            <Check className="h-4 w-4" />
                            موافقة
                          </Button>
                          <Button
                            size="sm"
                            variant="destructive"
                            onClick={() => handleReject(request)}
                            disabled={processingId === request.id}
                            className="gap-1"
                          >
                            <X className="h-4 w-4" />
                            رفض
                          </Button>
                        </div>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
