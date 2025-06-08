
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const { image, analysis_type = 'comprehensive', include_valuation = true, include_errors = true } = await req.json();

    if (!image) {
      return new Response(
        JSON.stringify({ 
          success: false, 
          error: 'No image provided' 
        }),
        { 
          status: 400, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    const anthropicApiKey = Deno.env.get('ANTHROPIC_API_KEY');
    if (!anthropicApiKey) {
      console.error('Anthropic API key not found');
      return new Response(
        JSON.stringify({ 
          success: false, 
          error: 'AI service not configured' 
        }),
        { 
          status: 500, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    const startTime = Date.now();

    // Enhanced AI prompt for comprehensive coin analysis
    const analysisPrompt = `
You are an expert numismatist and coin authentication specialist with decades of experience. Analyze this coin image with meticulous attention to detail.

Provide your analysis in this exact JSON format:
{
  "success": true,
  "analysis": {
    "name": "Complete coin name with series and variety",
    "year": 1921,
    "country": "Country of origin",
    "denomination": "Face value and unit",
    "composition": "Metal composition (e.g., 90% Silver, 10% Copper)",
    "grade": "Professional grade assessment (MS-65, AU-50, etc.)",
    "estimated_value": 125.50,
    "rarity": "Common|Uncommon|Rare|Very Rare|Extremely Rare",
    "mint": "Mint facility (if identifiable)",
    "diameter": 38.1,
    "weight": 26.73,
    "confidence": 0.85,
    "errors": ["Any mint errors detected"],
    "varieties": ["Special varieties or types"],
    "authentication_notes": "Key authentication markers",
    "market_trend": "Current market direction",
    "historical_significance": "Historical context if notable"
  }
}

Focus on:
1. Precise identification using visible design elements
2. Accurate condition assessment based on wear patterns
3. Detection of any mint errors (doubled dies, off-center strikes, etc.)
4. Authentication concerns (alterations, counterfeits)
5. Current market value based on grade and rarity
6. Historical and numismatic significance

Be thorough but concise. If uncertain about specific details, indicate lower confidence scores.`;

    // Call Anthropic Claude API
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': anthropicApiKey,
        'anthropic-version': '2023-06-01'
      },
      body: JSON.stringify({
        model: 'claude-3-5-sonnet-20241022',
        max_tokens: 2000,
        messages: [
          {
            role: 'user',
            content: [
              {
                type: 'text',
                text: analysisPrompt
              },
              {
                type: 'image',
                source: {
                  type: 'base64',
                  media_type: 'image/jpeg',
                  data: image.includes('base64,') ? image.split('base64,')[1] : image
                }
              }
            ]
          }
        ]
      })
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Anthropic API Error:', errorText);
      throw new Error(`AI service error: ${response.status}`);
    }

    const aiResponse = await response.json();
    const content = aiResponse.content[0]?.text;

    console.log('Anthropic raw response:', content);

    // Parse the AI response
    let analysisResult;
    try {
      // Extract JSON from the response
      const jsonMatch = content.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        analysisResult = JSON.parse(jsonMatch[0]);
      } else {
        analysisResult = JSON.parse(content);
      }
    } catch (parseError) {
      console.error('Failed to parse AI response:', content);
      // Fallback structured response
      analysisResult = {
        success: false,
        analysis: {
          name: 'Analysis Failed',
          year: new Date().getFullYear(),
          country: 'Unknown',
          denomination: 'Unknown',
          composition: 'Unknown',
          grade: 'Ungraded',
          estimated_value: 0,
          rarity: 'Unknown',
          confidence: 0.1,
          errors: [],
          varieties: [],
          authentication_notes: 'Unable to complete analysis',
          market_trend: 'unknown'
        }
      };
    }

    const processingTime = Date.now() - startTime;

    // Ensure required fields and data validation
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
        confidence: Math.min(1, Math.max(0, analysisResult.analysis?.confidence || 0.5)),
        errors: Array.isArray(analysisResult.analysis?.errors) ? analysisResult.analysis.errors : [],
        varieties: Array.isArray(analysisResult.analysis?.varieties) ? analysisResult.analysis.varieties : [],
        authentication_notes: analysisResult.analysis?.authentication_notes || '',
        market_trend: analysisResult.analysis?.market_trend || 'stable',
        historical_significance: analysisResult.analysis?.historical_significance || ''
      },
      processing_time: processingTime,
      ai_provider: 'anthropic',
      model: 'claude-3-5-sonnet',
      timestamp: new Date().toISOString()
    };

    console.log('Enhanced AI coin recognition completed:', finalResult);

    return new Response(
      JSON.stringify(finalResult),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );

  } catch (error) {
    console.error('Error in anthropic-coin-recognition function:', error);
    
    return new Response(
      JSON.stringify({ 
        success: false,
        error: 'AI analysis failed',
        message: error.message,
        processing_time: 0,
        ai_provider: 'anthropic'
      }),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );
  }
});
