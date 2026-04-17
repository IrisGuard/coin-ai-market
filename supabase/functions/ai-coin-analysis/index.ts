import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { callAIGateway, buildImageMessage, extractStructuredOutput, AIGatewayError } from "../_shared/aiGateway.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: corsHeaders });

  try {
    const { image } = await req.json();
    if (!image) {
      return new Response(JSON.stringify({ error: 'No image provided' }), {
        status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const prompt = `Analyze this coin image and provide detailed information.
Return a JSON object with this exact structure:
{
  "identification": { "name": "...", "year": 2023, "country": "...", "denomination": "...", "mint": "..." },
  "grading": { "condition": "MS-65", "grade": "...", "details": "..." },
  "valuation": { "current_value": 25.5, "low_estimate": 20, "high_estimate": 30, "market_trend": "stable" },
  "specifications": { "composition": "...", "diameter": 24.3, "weight": 6.25 },
  "rarity": "Common|Uncommon|Rare|Very Rare",
  "confidence": 0.85,
  "pcgs_number": null,
  "ngc_number": null
}
Use realistic values; "Unknown" for unknown strings, null for unknown numbers.`;

    const aiResponse = await callAIGateway({
      messages: [buildImageMessage(prompt, image)],
      max_tokens: 2000,
    });
    const parsed = extractStructuredOutput(aiResponse) || {};

    const validatedResult = {
      identification: {
        name: parsed.identification?.name || "Unknown Coin",
        year: parsed.identification?.year || new Date().getFullYear(),
        country: parsed.identification?.country || "Unknown",
        denomination: parsed.identification?.denomination || "Unknown",
        mint: parsed.identification?.mint || "Unknown",
      },
      grading: {
        condition: parsed.grading?.condition || "Good",
        grade: parsed.grading?.grade || "Good condition",
        details: parsed.grading?.details || "Condition assessment based on image analysis",
      },
      valuation: {
        current_value: parseFloat(parsed.valuation?.current_value) || 5.0,
        low_estimate: parseFloat(parsed.valuation?.low_estimate) || 2.0,
        high_estimate: parseFloat(parsed.valuation?.high_estimate) || 10.0,
        market_trend: parsed.valuation?.market_trend || "stable",
      },
      specifications: {
        composition: parsed.specifications?.composition || "Unknown",
        diameter: parsed.specifications?.diameter || null,
        weight: parsed.specifications?.weight || null,
      },
      rarity: parsed.rarity || "Common",
      confidence: Math.min(Math.max(parseFloat(parsed.confidence) || 0.5, 0), 1),
      pcgs_number: parsed.pcgs_number || null,
      ngc_number: parsed.ngc_number || null,
      ai_provider: 'lovable-ai-gemini',
    };

    return new Response(JSON.stringify(validatedResult), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error: any) {
    const status = error instanceof AIGatewayError ? error.status : 500;
    return new Response(JSON.stringify({ error: 'Analysis failed', details: error.message }), {
      status, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
