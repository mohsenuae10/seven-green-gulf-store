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
    const { productName, keywords, language, generateFullContent } = await req.json();
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");

    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY is not configured");
    }

    // ── Full content generation mode ──────────────────────────────────────
    if (generateFullContent) {
      const systemPrompt = language === 'ar'
        ? `أنت خبير تسويق منتجات تجميل ورعاية الشعر. مهمتك توليد محتوى منتج كامل ومهيكل بصيغة JSON دقيقة.`
        : `You are a hair care and beauty product marketing expert. Your task is to generate complete structured product content in precise JSON format.`;

      const userPrompt = language === 'ar'
        ? `اكتب محتوى منتج كاملاً لـ "${productName}".
الكلمات المفتاحية: ${keywords || 'منتج عناية بالشعر طبيعي'}

أرجع JSON فقط بالبنية التالية (لا تضف أي نص خارج JSON):
{
  "description": "وصف تسويقي احترافي 2-3 جمل",
  "features": [
    "الفائدة الأولى",
    "الفائدة الثانية",
    "الفائدة الثالثة",
    "الفائدة الرابعة",
    "الفائدة الخامسة",
    "الفائدة السادسة"
  ],
  "ingredients": [
    {"name": "اسم المكون الأول", "benefit": "فائدته"},
    {"name": "اسم المكون الثاني", "benefit": "فائدته"},
    {"name": "اسم المكون الثالث", "benefit": "فائدته"},
    {"name": "اسم المكون الرابع", "benefit": "فائدته"},
    {"name": "اسم المكون الخامس", "benefit": "فائدته"},
    {"name": "اسم المكون السادس", "benefit": "فائدته"},
    {"name": "اسم المكون السابع", "benefit": "فائدته"}
  ],
  "specs": [
    {"label": "الوزن", "value": "القيمة"},
    {"label": "الشكل", "value": "القيمة"},
    {"label": "عدد الاستخدامات", "value": "القيمة"},
    {"label": "الصلاحية", "value": "القيمة"},
    {"label": "مناسب لـ", "value": "القيمة"}
  ],
  "howToUse": [
    "الخطوة الأولى",
    "الخطوة الثانية",
    "الخطوة الثالثة",
    "الخطوة الرابعة",
    "الخطوة الخامسة"
  ],
  "faq": [
    {"q": "سؤال شائع الأول؟", "a": "الإجابة"},
    {"q": "سؤال شائع الثاني؟", "a": "الإجابة"},
    {"q": "سؤال شائع الثالث؟", "a": "الإجابة"}
  ]
}`
        : `Write complete product content for "${productName}".
Keywords: ${keywords || 'natural hair care product'}

Return JSON only with this exact structure (no text outside JSON):
{
  "description": "Professional marketing description 2-3 sentences",
  "features": [
    "First benefit",
    "Second benefit",
    "Third benefit",
    "Fourth benefit",
    "Fifth benefit",
    "Sixth benefit"
  ],
  "ingredients": [
    {"name": "First ingredient name", "benefit": "its benefit"},
    {"name": "Second ingredient name", "benefit": "its benefit"},
    {"name": "Third ingredient name", "benefit": "its benefit"},
    {"name": "Fourth ingredient name", "benefit": "its benefit"},
    {"name": "Fifth ingredient name", "benefit": "its benefit"},
    {"name": "Sixth ingredient name", "benefit": "its benefit"},
    {"name": "Seventh ingredient name", "benefit": "its benefit"}
  ],
  "specs": [
    {"label": "Weight", "value": "value"},
    {"label": "Shape", "value": "value"},
    {"label": "Uses", "value": "value"},
    {"label": "Shelf Life", "value": "value"},
    {"label": "Suitable For", "value": "value"}
  ],
  "howToUse": [
    "Step one",
    "Step two",
    "Step three",
    "Step four",
    "Step five"
  ],
  "faq": [
    {"q": "First common question?", "a": "answer"},
    {"q": "Second common question?", "a": "answer"},
    {"q": "Third common question?", "a": "answer"}
  ]
}`;

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
            { role: 'user', content: userPrompt },
          ],
          temperature: 0.7,
          max_tokens: 2000,
        }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error('AI gateway error:', response.status, errorText);
        if (response.status === 429) {
          return new Response(
            JSON.stringify({ error: 'تم تجاوز حد الطلبات. حاول مجدداً لاحقاً.' }),
            { status: 429, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
          );
        }
        throw new Error(`AI gateway error: ${response.status}`);
      }

      const data = await response.json();
      const raw = data.choices?.[0]?.message?.content || '';

      // Extract JSON from response (strip markdown code fences if any)
      const jsonMatch = raw.match(/\{[\s\S]*\}/);
      if (!jsonMatch) throw new Error('No valid JSON in AI response');

      const parsed = JSON.parse(jsonMatch[0]);

      return new Response(
        JSON.stringify({ fullContent: parsed }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // ── Description-only mode (original) ────────────────────────────────
    const systemPrompt = language === 'ar'
      ? `أنت مساعد متخصص في كتابة أوصاف منتجات تجميل احترافية وجذابة.`
      : `You are an expert in writing professional and attractive beauty product descriptions.`;

    const userPrompt = language === 'ar'
      ? `اكتب وصفاً تسويقياً احترافياً ومقنعاً لمنتج "${productName}".
الكلمات المفتاحية: ${keywords || 'منتج تجميل عالي الجودة'}
المتطلبات: طول 2-3 فقرات، ابدأ بجملة جذابة، اذكر الفوائد، لغة تسويقية احترافية، بدون عناوين.`
      : `Write a professional marketing description for "${productName}".
Keywords: ${keywords || 'high-quality beauty product'}
Requirements: 2-3 paragraphs, start with attention-grabbing sentence, mention benefits, no titles.`;

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
          { role: 'user', content: userPrompt },
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
          JSON.stringify({ error: 'تم تجاوز حد الطلبات.' }),
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

    const data = await response.json();
    const description = data.choices?.[0]?.message?.content;
    if (!description) throw new Error('No description generated');

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
