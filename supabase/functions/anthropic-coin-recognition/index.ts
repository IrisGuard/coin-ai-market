import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Migrated to Lovable AI Gateway (Gemini). No external Anthropic key required.
serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  const startTime = Date.now();

  try {
    const { image, image_format = 'jpeg' } = await req.json();

    if (!image) {
      return new Response(
        JSON.stringify({ success: false, error: 'No image provided' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const LOVABLE_API_KEY = Deno.env.get('LOVABLE_API_KEY');
    if (!LOVABLE_API_KEY) {
      return new Response(
        JSON.stringify({ success: false, error: 'AI gateway not configured' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Normalize image into a data URL the gateway accepts
    let dataUrl: string;
    if (typeof image === 'string' && image.startsWith('data:image')) {
      dataUrl = image;
    } else {
      const cleaned = String(image).replace(/\s/g, '').replace(/^data:[^,]+,/, '');
      dataUrl = `data:image/${image_format};base64,${cleaned}`;
    }

    const systemPrompt = `You are the world's most advanced numismatic AI expert with comprehensive knowledge of coins from ALL countries, cultures, and historical periods.

CRITICAL RULES:
- NEVER assume a coin is American unless clearly identified as such
- NEVER return template/default coin information
- ONLY report what you can actually observe in the image
- Identify visible text, scripts (Greek, Arabic, Chinese, Cyrillic, Latin), symbols, year, denomination, metal, condition`;

    const tool = {
      type: 'function',
      function: {
        name: 'report_coin_analysis',
        description: 'Return structured numismatic analysis of the coin in the image',
        parameters: {
          type: 'object',
          properties: {
            name: { type: 'string' },
            year: { type: ['integer', 'null'] },
            country: { type: 'string' },
            denomination: { type: 'string' },
            composition: { type: 'string' },
            grade: { type: 'string' },
            estimated_value: { type: 'number' },
            rarity: { type: 'string' },
            mint: { type: 'string' },
            diameter: { type: ['number', 'null'] },
            weight: { type: ['number', 'null'] },
            confidence: { type: 'number', minimum: 0, maximum: 1 },
            errors: { type: 'array', items: { type: 'string' } },
            authentication_notes: { type: 'string' },
            market_trend: { type: 'string' }
          },
          required: ['name', 'country', 'denomination', 'composition', 'grade', 'estimated_value', 'rarity', 'confidence'],
          additionalProperties: false
        }
      }
    };

    const response = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${LOVABLE_API_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: 'google/gemini-2.5-flash',
        messages: [
          { role: 'system', content: systemPrompt },
          {
            role: 'user',
            content: [
              { type: 'text', text: 'Analyze this coin and return the structured report via the tool.' },
              { type: 'image_url', image_url: { url: dataUrl } }
            ]
          }
        ],
        tools: [tool],
        tool_choice: { type: 'function', function: { name: 'report_coin_analysis' } }
      })
    });

    if (!response.ok) {
      const errText = await response.text();
      console.error('AI gateway error:', response.status, errText);
      if (response.status === 429) {
        return new Response(
          JSON.stringify({ success: false, error: 'Rate limit exceeded, please try again shortly.' }),
          { status: 429, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
      if (response.status === 402) {
        return new Response(
          JSON.stringify({ success: false, error: 'AI credits exhausted. Please add credits in Workspace Usage.' }),
          { status: 402, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
      return new Response(
        JSON.stringify({ success: false, error: `AI analysis failed (${response.status})` }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const aiResponse = await response.json();
    const toolCall = aiResponse.choices?.[0]?.message?.tool_calls?.[0];
    let parsed: any = {};
    if (toolCall?.function?.arguments) {
      try { parsed = JSON.parse(toolCall.function.arguments); } catch { parsed = {}; }
    } else {
      const content = aiResponse.choices?.[0]?.message?.content || '';
      const match = content.match(/\{[\s\S]*\}/);
      if (match) { try { parsed = JSON.parse(match[0]); } catch { parsed = {}; } }
    }

    const finalResult = {
      success: true,
      analysis: {
        name: parsed.name || 'Unidentified Coin',
        year: parsed.year ?? null,
        country: parsed.country || 'Unknown',
        denomination: parsed.denomination || 'Unknown',
        composition: parsed.composition || 'Unknown',
        grade: parsed.grade || 'Unknown',
        estimated_value: Math.max(0, Number(parsed.estimated_value) || 0),
        rarity: parsed.rarity || 'Unknown',
        mint: parsed.mint || 'Unknown',
        diameter: parsed.diameter ?? null,
        weight: parsed.weight ?? null,
        confidence: Math.min(1, Math.max(0.1, Number(parsed.confidence) || 0.5)),
        errors: Array.isArray(parsed.errors) ? parsed.errors : [],
        authentication_notes: parsed.authentication_notes || 'Standard analysis completed',
        market_trend: parsed.market_trend || 'unknown'
      },
      processing_time: Date.now() - startTime,
      ai_provider: 'lovable-ai-gemini',
      model: 'google/gemini-2.5-flash',
      timestamp: new Date().toISOString()
    };

    return new Response(JSON.stringify(finalResult), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  } catch (error: any) {
    console.error('coin-recognition error:', error);
    return new Response(
      JSON.stringify({
        success: false,
        error: 'AI analysis failed',
        message: error?.message,
        processing_time: Date.now() - startTime,
        ai_provider: 'lovable-ai-gemini'
      }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
