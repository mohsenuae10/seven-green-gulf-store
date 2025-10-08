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
    const { productName, keywords, language } = await req.json();
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");

    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY is not configured");
    }

    const systemPrompt = language === 'ar' 
      ? `أنت مساعد متخصص في كتابة أوصاف منتجات تجميل احترافية وجذابة. اكتب أوصاف تسويقية مقنعة تبرز فوائد المنتج وميزاته الفريدة.`
      : `You are an expert in writing professional and attractive beauty product descriptions. Write compelling marketing descriptions that highlight the product's benefits and unique features.`;

    const userPrompt = language === 'ar'
      ? `اكتب وصفاً تسويقياً احترافياً ومقنعاً لمنتج "${productName}". 
الكلمات المفتاحية: ${keywords || 'منتج تجميل عالي الجودة'}

المتطلبات:
- طول الوصف: 2-3 فقرات (150-250 كلمة)
- ابدأ بجملة جذابة تلفت الانتباه
- اذكر الفوائد الرئيسية والنتائج المتوقعة
- استخدم لغة تسويقية احترافية وجذابة
- اجعل الوصف مناسباً للعملاء في منطقة الخليج
- لا تضف عناوين أو أقسام، فقط النص المباشر`
      : `Write a professional and compelling marketing description for "${productName}".
Keywords: ${keywords || 'high-quality beauty product'}

Requirements:
- Length: 2-3 paragraphs (150-250 words)
- Start with an attention-grabbing sentence
- Mention key benefits and expected results
- Use professional and attractive marketing language
- Make it suitable for Gulf region customers
- Don't add titles or sections, just direct text`;

    console.log('Calling Lovable AI for product description...');
    
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
          { role: 'user', content: userPrompt }
        ],
        temperature: 0.8,
        max_tokens: 500,
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
          JSON.stringify({ error: 'يرجى إضافة رصيد إلى حساب Lovable AI الخاص بك.' }),
          { status: 402, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
      
      throw new Error(`AI gateway error: ${response.status}`);
    }

    const data = await response.json();
    const description = data.choices?.[0]?.message?.content;

    if (!description) {
      throw new Error('No description generated');
    }

    console.log('Successfully generated product description');

    return new Response(
      JSON.stringify({ description: description.trim() }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error in generate-product-description:', error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : 'حدث خطأ غير متوقع' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
