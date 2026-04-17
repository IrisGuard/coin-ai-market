import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { callAIGateway, extractStructuredOutput, AIGatewayError } from "../_shared/aiGateway.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

function toDataUrl(b64OrUrl: string): string {
  if (b64OrUrl.startsWith('data:')) return b64OrUrl;
  const cleaned = String(b64OrUrl).replace(/\s/g, '').replace(/^data:[^,]+,/, '');
  return `data:image/jpeg;base64,${cleaned}`;
}

serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: corsHeaders });

  try {
    const { frontImage, backImage } = await req.json();

    if (!frontImage || !backImage) {
      return new Response(JSON.stringify({ success: false, error: 'Both front and back images are required' }), {
        status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const startTime = Date.now();

    const dualAnalysisPrompt = `You are a world-renowned numismatist with 40+ years of experience. You have access to both the obverse (front) and reverse (back) of this coin. Provide a thorough JSON analysis with this exact structure:
{
  "success": true,
  "analysis": {
    "name": "...", "year": 1921, "country": "...", "denomination": "...", "composition": "...",
    "grade": "...", "estimated_value": 125.5, "rarity": "Common|Uncommon|Rare|Very Rare|Extremely Rare",
    "mint": "...", "diameter": 38.1, "weight": 26.73,
    "obverse_details": "...", "reverse_details": "...", "mint_marks": "...",
    "wear_patterns": "...", "strike_quality": "...", "edge_details": "..."
  },
  "confidence": 0.95,
  "errors": [], "varieties": [],
  "authentication_analysis": {}, "condition_assessment": {}, "market_analysis": {}, "dual_side_observations": {}
}`;

    const aiResponse = await callAIGateway({
      max_tokens: 3000,
      messages: [{
        role: 'user',
        content: [
          { type: 'text', text: dualAnalysisPrompt },
          { type: 'text', text: 'FRONT SIDE (OBVERSE):' },
          { type: 'image_url', image_url: { url: toDataUrl(frontImage) } },
          { type: 'text', text: 'BACK SIDE (REVERSE):' },
          { type: 'image_url', image_url: { url: toDataUrl(backImage) } },
        ],
      }],
    });

    const analysisResult = extractStructuredOutput(aiResponse) || {};
    const processingTime = Date.now() - startTime;

    const finalResult = {
      success: true,
      analysis: {
        name: analysisResult.analysis?.name || 'Unknown Coin',
        year: analysisResult.analysis?.year || new Date().getFullYear(),
        country: analysisResult.analysis?.country || 'Unknown',
        denomination: analysisResult.analysis?.denomination || 'Unknown',
        composition: analysisResult.analysis?.composition || 'Unknown',
        grade: analysisResult.analysis?.grade || 'Ungraded',
        estimated_value: Math.max(0, analysisResult.analysis?.estimated_value || 0),
        rarity: analysisResult.analysis?.rarity || 'Common',
        mint: analysisResult.analysis?.mint,
        diameter: analysisResult.analysis?.diameter,
        weight: analysisResult.analysis?.weight,
        obverse_details: analysisResult.analysis?.obverse_details || '',
        reverse_details: analysisResult.analysis?.reverse_details || '',
        mint_marks: analysisResult.analysis?.mint_marks || '',
        wear_patterns: analysisResult.analysis?.wear_patterns || '',
        strike_quality: analysisResult.analysis?.strike_quality || '',
        edge_details: analysisResult.analysis?.edge_details || '',
      },
      confidence: Math.min(1, Math.max(0, analysisResult.confidence || 0.5)),
      errors: Array.isArray(analysisResult.errors) ? analysisResult.errors : [],
      varieties: Array.isArray(analysisResult.varieties) ? analysisResult.varieties : [],
      authentication_analysis: analysisResult.authentication_analysis || {},
      condition_assessment: analysisResult.condition_assessment || {},
      market_analysis: analysisResult.market_analysis || {},
      dual_side_observations: analysisResult.dual_side_observations || {},
      processing_time: processingTime,
      ai_provider: 'lovable-ai-gemini',
      analysis_type: 'dual_side_comprehensive',
      timestamp: new Date().toISOString(),
    };

    return new Response(JSON.stringify(finalResult), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error: any) {
    const status = error instanceof AIGatewayError ? error.status : 500;
    return new Response(JSON.stringify({
      success: false, error: 'Dual-side AI analysis failed', message: error.message,
      processing_time: 0, ai_provider: 'lovable-ai-gemini',
    }), { status, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
  }
});
