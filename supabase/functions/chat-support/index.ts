import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { messages, language = 'ar' } = await req.json();
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");

    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY is not configured");
    }

    const systemPrompt = language === 'ar' 
      ? `أنت مساعد ذكي لمتجر Seven Green المتخصص في منتجات العناية بالشعر الكورية الطبيعية.

معلومات عن المتجر:
- منتجات طبيعية عالية الجودة من كوريا
- متخصصون في العناية بالشعر
- شحن سريع وموثوق
- دعم عملاء ممتاز على مدار الساعة
- أسعار تنافسية

مهامك:
- الرد على استفسارات العملاء بطريقة ودية واحترافية
- مساعدة العملاء في اختيار المنتجات المناسبة
- الإجابة على أسئلة حول المنتجات والشحن والدفع
- تقديم توصيات مخصصة بناءً على احتياجات العميل
- استخدام لغة عربية واضحة ومهذبة

إذا لم تعرف إجابة سؤال معين، اعترف بذلك واقترح التواصل مع فريق الدعم عبر واتساب: 971508824227`
      : `You are an intelligent assistant for Seven Green store, specializing in natural Korean hair care products.

Store Information:
- High-quality natural products from Korea
- Specialized in hair care
- Fast and reliable shipping
- Excellent 24/7 customer support
- Competitive pricing

Your Tasks:
- Answer customer inquiries in a friendly and professional manner
- Help customers choose suitable products
- Answer questions about products, shipping, and payment
- Provide personalized recommendations based on customer needs
- Use clear and polite language

If you don't know the answer to a specific question, acknowledge it and suggest contacting support via WhatsApp: 971508824227`;

    console.log('Starting chat stream with Lovable AI...');

    const response = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${LOVABLE_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'google/gemini-2.5-flash',
        messages: [
          { role: 'system', content: systemPrompt },
          ...messages
        ],
        stream: true,
        temperature: 0.7,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('AI gateway error:', response.status, errorText);
      
      if (response.status === 429) {
        return new Response(
          JSON.stringify({ error: 'تم تجاوز حد الطلبات. يرجى المحاولة مرة أخرى لاحقاً.' }),
          { status: 429, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
      
      if (response.status === 402) {
        return new Response(
          JSON.stringify({ error: 'يرجى إضافة رصيد إلى حساب Lovable AI.' }),
          { status: 402, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
      
      throw new Error(`AI gateway error: ${response.status}`);
    }

    // Return the streaming response
    return new Response(response.body, {
      headers: {
        ...corsHeaders,
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        'Connection': 'keep-alive',
      },
    });

  } catch (error) {
    console.error('Error in chat-support:', error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : 'حدث خطأ غير متوقع' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
