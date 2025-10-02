import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { Resend } from "npm:resend@2.0.0";

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface PaymentReminderRequest {
  orderId: string;
  customerName: string;
  customerEmail: string;
  totalAmount: number;
  orderDate: string;
}

const handler = async (req: Request): Promise<Response> => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { orderId, customerName, customerEmail, totalAmount, orderDate }: PaymentReminderRequest = await req.json();

    console.log("Sending payment reminder to:", customerEmail);

    const emailResponse = await resend.emails.send({
      from: "Seven Green <onboarding@resend.dev>",
      to: [customerEmail],
      subject: "تذكير بالدفع - Seven Green",
      html: `
        <!DOCTYPE html>
        <html dir="rtl" lang="ar">
        <head>
          <meta charset="UTF-8">
          <style>
            body { font-family: Arial, sans-serif; direction: rtl; background-color: #f4f4f4; padding: 20px; }
            .container { max-width: 600px; margin: 0 auto; background-color: white; border-radius: 10px; overflow: hidden; box-shadow: 0 2px 10px rgba(0,0,0,0.1); }
            .header { background: linear-gradient(135deg, #10b981 0%, #059669 100%); padding: 30px; text-align: center; color: white; }
            .content { padding: 30px; }
            .order-details { background-color: #f9fafb; padding: 20px; border-radius: 8px; margin: 20px 0; }
            .detail-row { display: flex; justify-content: space-between; padding: 10px 0; border-bottom: 1px solid #e5e7eb; }
            .button { display: inline-block; background-color: #10b981; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; margin-top: 20px; }
            .footer { background-color: #f9fafb; padding: 20px; text-align: center; color: #6b7280; font-size: 14px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>تذكير بالدفع</h1>
            </div>
            <div class="content">
              <p>عزيزي/عزيزتي ${customerName}،</p>
              <p>نود تذكيرك بأن طلبك ما زال في انتظار الدفع.</p>
              
              <div class="order-details">
                <h3>تفاصيل الطلب:</h3>
                <div class="detail-row">
                  <span><strong>رقم الطلب:</strong></span>
                  <span>${orderId.substring(0, 8)}</span>
                </div>
                <div class="detail-row">
                  <span><strong>تاريخ الطلب:</strong></span>
                  <span>${new Date(orderDate).toLocaleDateString('ar-SA')}</span>
                </div>
                <div class="detail-row">
                  <span><strong>المبلغ الإجمالي:</strong></span>
                  <span>${totalAmount} ريال</span>
                </div>
              </div>

              <p>لإكمال طلبك، يرجى إتمام عملية الدفع في أقرب وقت ممكن.</p>
              <p>إذا كان لديك أي استفسار، لا تتردد في التواصل معنا.</p>

              <p style="margin-top: 30px;">
                <strong>شكراً لك،</strong><br>
                فريق Seven Green
              </p>
            </div>
            <div class="footer">
              <p>هذا البريد الإلكتروني تم إرساله تلقائياً، يرجى عدم الرد عليه.</p>
            </div>
          </div>
        </body>
        </html>
      `,
    });

    console.log("Payment reminder sent successfully:", emailResponse);

    return new Response(JSON.stringify({ success: true, data: emailResponse }), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        ...corsHeaders,
      },
    });
  } catch (error: any) {
    console.error("Error sending payment reminder:", error);
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
