import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { Resend } from "https://esm.sh/resend@2.0.0";

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface ShippingNotificationRequest {
  customerName: string;
  customerEmail: string;
  orderId: string;
  trackingNumber: string;
  shippingCompany: string;
  sellerNotes?: string;
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
      trackingNumber,
      shippingCompany,
      sellerNotes,
    }: ShippingNotificationRequest = await req.json();

    console.log('Sending shipping notification to:', customerEmail);

    const emailResponse = await resend.emails.send({
      from: "Seven Green Store <orders@sevensgreen.com>",
      to: [customerEmail],
      subject: `تم شحن طلبك #${orderId.slice(-8)} - رقم التتبع: ${trackingNumber}`,
      html: `
        <!DOCTYPE html>
        <html dir="rtl" lang="ar">
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>تم شحن طلبك</title>
          <style>
            body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; margin: 0; padding: 0; background-color: #f5f5f5; }
            .container { max-width: 600px; margin: 0 auto; background-color: white; }
            .header { background: linear-gradient(135deg, #10b981, #059669); color: white; padding: 30px; text-align: center; }
            .content { padding: 30px; }
            .order-info { background: #f8fafc; padding: 20px; border-radius: 8px; margin: 20px 0; }
            .tracking-box { background: #e0f2fe; border: 2px solid #0891b2; padding: 20px; border-radius: 8px; text-align: center; margin: 20px 0; }
            .footer { background: #f1f5f9; padding: 20px; text-align: center; color: #64748b; }
            .btn { display: inline-block; background: #10b981; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; margin: 10px 0; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>🚚 تم شحن طلبك!</h1>
              <p>مرحباً ${customerName}</p>
            </div>
            
            <div class="content">
              <p>نحن سعداء لإعلامك بأن طلبك قد تم شحنه بنجاح!</p>
              
              <div class="order-info">
                <h3>تفاصيل الطلب:</h3>
                <p><strong>رقم الطلب:</strong> #${orderId.slice(-8)}</p>
                <p><strong>شركة الشحن:</strong> ${shippingCompany}</p>
                <p><strong>رقم التتبع:</strong> <code style="background: #f1f5f9; padding: 4px 8px; border-radius: 4px;">${trackingNumber}</code></p>
              </div>

              <div class="tracking-box">
                <h3>📦 تتبع شحنتك</h3>
                <p>يمكنك تتبع حالة شحنتك باستخدام رقم التتبع أعلاه</p>
                <p><strong>رقم التتبع:</strong> ${trackingNumber}</p>
              </div>

              <p>سيصل طلبك خلال 3-7 أيام عمل. في حال وجود أي استفسار، لا تتردد في التواصل معنا.</p>
              
            </div>
            
            <div class="footer">
              <p>شكراً لاختيارك متجر Seven Green</p>
              <p>Seven Green Store - منتجات طبيعية عالية الجودة</p>
            </div>
          </div>
        </body>
        </html>
      `,
    });

    console.log("Shipping notification sent successfully:", emailResponse);

    return new Response(JSON.stringify(emailResponse), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        ...corsHeaders,
      },
    });
  } catch (error: any) {
    console.error("Error in send-shipping-notification function:", error);
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