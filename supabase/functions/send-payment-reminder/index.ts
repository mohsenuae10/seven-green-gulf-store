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
      from: "Seven Green <noreply@sevensgreen.com>",
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
            .payment-button { 
              display: inline-block; 
              background: linear-gradient(135deg, #10b981 0%, #059669 100%);
              color: white; 
              padding: 15px 40px; 
              text-decoration: none; 
              border-radius: 8px; 
              margin: 20px 0;
              font-size: 18px;
              font-weight: bold;
              text-align: center;
              box-shadow: 0 4px 6px rgba(16, 185, 129, 0.3);
            }
            .payment-button:hover {
              background: linear-gradient(135deg, #059669 0%, #047857 100%);
            }
            .footer { background-color: #f9fafb; padding: 20px; text-align: center; color: #6b7280; font-size: 14px; }
            .urgent-notice { 
              background-color: #fef3c7; 
              border-right: 4px solid #f59e0b; 
              padding: 15px; 
              margin: 20px 0; 
              border-radius: 5px;
            }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>⚠️ تذكير مهم بالدفع</h1>
            </div>
            <div class="content">
              <p>عزيزي/عزيزتي ${customerName}،</p>
              
              <div class="urgent-notice">
                <strong>⏰ طلبك في انتظار الدفع</strong>
                <p style="margin: 5px 0 0 0;">يرجى إتمام عملية الدفع لضمان معالجة طلبك وشحنه في أسرع وقت ممكن.</p>
              </div>
              
              <div class="order-details">
                <h3>📦 تفاصيل الطلب:</h3>
                <div class="detail-row">
                  <span><strong>رقم الطلب:</strong></span>
                  <span>#${orderId.substring(0, 8).toUpperCase()}</span>
                </div>
                <div class="detail-row">
                  <span><strong>تاريخ الطلب:</strong></span>
                  <span>${new Date(orderDate).toLocaleDateString('ar-SA')}</span>
                </div>
                <div class="detail-row" style="border-bottom: none;">
                  <span><strong>المبلغ الإجمالي:</strong></span>
                  <span style="color: #10b981; font-size: 20px; font-weight: bold;">${totalAmount} ريال</span>
                </div>
              </div>

              <div style="text-align: center; margin: 30px 0;">
                <a href="https://sevensgreen.com/order?id=${orderId}" class="payment-button">
                  💳 إتمام الدفع الآن
                </a>
              </div>

              <p style="text-align: center; color: #6b7280; font-size: 14px;">
                أو انسخ الرابط التالي:<br>
                <a href="https://sevensgreen.com/order?id=${orderId}" style="color: #10b981;">
                  https://sevensgreen.com/order?id=${orderId}
                </a>
              </p>

              <p style="margin-top: 30px;">
                إذا كان لديك أي استفسار أو مشكلة في الدفع، لا تتردد في التواصل معنا.
              </p>

              <p style="margin-top: 30px;">
                <strong>شكراً لثقتك بنا،</strong><br>
                فريق Seven Green 🌿
              </p>
            </div>
            <div class="footer">
              <p>هذا البريد الإلكتروني تم إرساله تلقائياً، يرجى عدم الرد عليه.</p>
              <p>Seven Green - منتجات العناية الطبيعية بالشعر</p>
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
