import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { Resend } from "https://esm.sh/resend@2.0.0";

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface OrderCreatedRequest {
  customerName: string;
  customerEmail: string;
  orderId: string;
  totalAmount: number;
  productName: string;
  customerPhone: string;
  address: string;
  city: string;
  country: string;
}

const handler = async (req: Request): Promise<Response> => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const {
      customerName,
      customerEmail,
      orderId,
      totalAmount,
      productName,
      customerPhone,
      address,
      city,
      country,
    }: OrderCreatedRequest = await req.json();

    console.log('Sending order created notification to:', customerEmail);

    const emailResponse = await resend.emails.send({
      from: "Seven Green Store <orders@sevensgreen.com>",
      to: [customerEmail],
      subject: `تم استلام طلبك #${orderId.slice(-8)} بنجاح`,
      html: `
        <!DOCTYPE html>
        <html dir="rtl" lang="ar">
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>تم استلام طلبك</title>
          <style>
            body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; margin: 0; padding: 0; background-color: #f5f5f5; }
            .container { max-width: 600px; margin: 0 auto; background-color: white; }
            .header { background: linear-gradient(135deg, #10b981, #059669); color: white; padding: 30px; text-align: center; }
            .content { padding: 30px; }
            .order-info { background: #f8fafc; padding: 20px; border-radius: 8px; margin: 20px 0; }
            .success-box { background: #dbeafe; border: 2px solid #3b82f6; padding: 20px; border-radius: 8px; text-align: center; margin: 20px 0; }
            .footer { background: #f1f5f9; padding: 20px; text-align: center; color: #64748b; }
            .btn { display: inline-block; background: #10b981; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; margin: 10px 0; }
            .price { font-size: 24px; font-weight: bold; color: #10b981; }
            .pending { color: #f59e0b; font-weight: bold; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>📦 تم استلام طلبك!</h1>
              <p>مرحباً ${customerName}</p>
            </div>
            
            <div class="content">
              <div class="success-box">
                <h2>✅ تم إنشاء طلبك بنجاح!</h2>
                <p>شكراً لك على طلبك. تم استلام طلبك وهو الآن قيد المراجعة والمعالجة.</p>
              </div>
              
              <div class="order-info">
                <h3>تفاصيل الطلب:</h3>
                <p><strong>رقم الطلب:</strong> #${orderId.slice(-8)}</p>
                <p><strong>المنتج:</strong> ${productName}</p>
                <p><strong>المبلغ الإجمالي:</strong> <span class="price">${totalAmount} درهم</span></p>
                <p><strong>حالة الطلب:</strong> <span class="pending">قيد المراجعة ⏳</span></p>
                
                <h4>معلومات الشحن:</h4>
                <p><strong>الاسم:</strong> ${customerName}</p>
                <p><strong>رقم الهاتف:</strong> ${customerPhone}</p>
                <p><strong>العنوان:</strong> ${address}</p>
                <p><strong>المدينة:</strong> ${city}</p>
                <p><strong>الدولة:</strong> ${country}</p>
              </div>

              <h3>الخطوات التالية:</h3>
              <ul style="text-align: right;">
                <li>سيتم مراجعة طلبك خلال 24 ساعة</li>
                <li>بعد قبول الطلب، ستتلقى رسالة تأكيد بالدفع</li>
                <li>سيتم تجهيز طلبك خلال 1-2 يوم عمل بعد الدفع</li>
                <li>ستتلقى إشعار آخر مع رقم التتبع عند الشحن</li>
              </ul>

              <div style="background: #fef3c7; border: 1px solid #f59e0b; padding: 15px; border-radius: 8px; margin: 20px 0;">
                <h4 style="color: #92400e; margin-top: 0;">ملاحظة هامة:</h4>
                <p style="color: #92400e; margin-bottom: 0;">هذا إشعار بإنشاء الطلب فقط. ستتلقى إشعار منفصل عند تأكيد الدفع وإشعار آخر عند الشحن مع رقم التتبع.</p>
              </div>
              
              <div style="text-align: center;">
                <a href="https://wa.me/971508824227" class="btn">تواصل معنا عبر واتساب</a>
              </div>
            </div>
            
            <div class="footer">
              <p>شكراً لاختيارك متجر Seven Green</p>
              <p>Seven Green Store - منتجات طبيعية عالية الجودة</p>
              <p>هذه رسالة تلقائية، يرجى عدم الرد عليها مباشرة</p>
            </div>
          </div>
        </body>
        </html>
      `,
    });

    console.log("Order created notification sent successfully:", emailResponse);

    return new Response(JSON.stringify(emailResponse), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        ...corsHeaders,
      },
    });
  } catch (error: any) {
    console.error("Error in send-order-created function:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  }
};

serve(handler);