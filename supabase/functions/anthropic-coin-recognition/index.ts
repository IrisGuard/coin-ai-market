import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { callAIGateway, buildImageMessage, extractStructuredOutput, AIGatewayError, FLASH_MODEL } from "../_shared/aiGateway.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Coin recognition via Google Gemini (FLASH for solid vision quality on single coin).
serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: corsHeaders });

  const startTime = Date.now();

  try {
    const { image, image_format = 'jpeg' } = await req.json();

    if (!image) {
      return new Response(
        JSON.stringify({ success: false, error: 'No image provided' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const systemPrompt = `You are the world's most advanced numismatic AI expert with comprehensive knowledge of coins from ALL countries, cultures, and historical periods.

CRITICAL RULES:
- NEVER assume a coin is American unless clearly identified as such
- NEVER return template/default coin information
- ONLY report what you can actually observe in the image
- Identify visible text, scripts (Greek, Arabic, Chinese, Cyrillic, Latin), symbols, year, denomination, metal, condition

Respond with a JSON object using this exact structure:
{
  "name": "...", "year": 1980, "country": "...", "denomination": "...", "composition": "...",
  "grade": "...", "estimated_value": 2.5, "rarity": "Common|Uncommon|Rare|Very Rare",
  "mint": "...", "diameter": 26.0, "weight": 6.5, "confidence": 0.9,
  "errors": [], "authentication_notes": "...", "market_trend": "..."
}`;

    const aiResponse = await callAIGateway({
      model: FLASH_MODEL,
      max_tokens: 2000,
      messages: [
        { role: 'system', content: systemPrompt },
        buildImageMessage('Analyze this coin and return the structured JSON report.', image, `image/${image_format}`),
      ],
    });

    const parsed: any = extractStructuredOutput(aiResponse) || {};

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
        market_trend: parsed.market_trend || 'unknown',
      },
      processing_time: Date.now() - startTime,
      ai_provider: 'google-gemini',
      model: FLASH_MODEL,
      timestamp: new Date().toISOString(),
    };

    return new Response(JSON.stringify(finalResult), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error: any) {
    const status = error instanceof AIGatewayError ? error.status : 500;
    return new Response(
      JSON.stringify({
        success: false,
        error: 'AI analysis failed',
        message: error?.message,
        processing_time: Date.now() - startTime,
        ai_provider: 'google-gemini',
      }),
      { status, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
