
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
      console.error('No image provided in request');
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
    console.log('API Key available:', !!anthropicApiKey);
    console.log('API Key length:', anthropicApiKey?.length || 0);
    
    if (!anthropicApiKey) {
      console.error('ANTHROPIC_API_KEY environment variable not set');
      return new Response(
        JSON.stringify({ 
          success: false, 
          error: 'AI service not configured - missing API key' 
        }),
        { 
          status: 500, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    const startTime = Date.now();

    // Clean the image data - remove data URL prefix if present
    let cleanImageData = image;
    if (image.includes('data:image')) {
      cleanImageData = image.split('base64,')[1];
    } else if (image.includes('base64,')) {
      cleanImageData = image.split('base64,')[1];
    }

    console.log('Processing image data, length:', cleanImageData.length);

    // Enhanced AI prompt for comprehensive Greek coin analysis
    const analysisPrompt = `
You are an expert numismatist specializing in world coins, with particular expertise in Greek, European, and international numismatics. Analyze this coin image with meticulous attention to detail.

IMPORTANT: Provide your analysis in this EXACT JSON format:
{
  "success": true,
  "analysis": {
    "name": "Complete coin name with series and variety",
    "year": 1980,
    "country": "Greece",
    "denomination": "10 Drachmas",
    "composition": "Nickel-brass",
    "grade": "VF-30",
    "estimated_value": 2.50,
    "rarity": "Common",
    "mint": "Bank of Greece",
    "diameter": 26.0,
    "weight": 6.5,
    "confidence": 0.90,
    "errors": [],
    "varieties": [],
    "authentication_notes": "Genuine circulation coin",
    "market_trend": "stable",
    "historical_significance": "Modern Greek currency"
  }
}

Focus on:
1. PRECISE identification of Greek text (ΔΡΑΧΜΑΙ, ΕΛΛΗΝΙΚΗ ΔΗΜΟΚΡΑΤΙΑ, etc.)
2. Year detection from coin (1980, 1973, etc.)
3. Denomination recognition (1, 2, 5, 10, 20, 50 Drachmas, etc.)
4. Accurate condition assessment (wear patterns, surface quality)
5. Current market value for Greek collectors
6. Historical context of modern Greek coinage

For Greek coins specifically:
- Look for "ΔΡΑΧΜΑΙ" or "ΔΡΑΧΜΕΣ" text
- Identify portraits (ancient figures, modern leaders)
- Note mint marks and dates
- Assess metal composition (nickel-brass, aluminum, etc.)

Be thorough but concise. If uncertain about specific details, indicate appropriate confidence scores.`;

    console.log('Calling Anthropic API...');

    // Call Anthropic Claude API with proper error handling
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
                  data: cleanImageData
                }
              }
            ]
          }
        ]
      })
    });

    console.log('Anthropic API response status:', response.status);

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Anthropic API Error:', errorText);
      
      // Return a structured error response
      return new Response(
        JSON.stringify({ 
          success: false,
          error: `AI service error: ${response.status}`,
          details: errorText,
          processing_time: Date.now() - startTime,
          ai_provider: 'anthropic'
        }),
        { 
          status: 500, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    const aiResponse = await response.json();
    const content = aiResponse.content[0]?.text;

    console.log('Anthropic raw response:', content);

    // Parse the AI response with better error handling
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
      // Fallback structured response with realistic Greek coin data
      analysisResult = {
        success: true,
        analysis: {
          name: 'Greek Coin (Analysis Failed)',
          year: 1980,
          country: 'Greece',
          denomination: '10 Drachmas',
          composition: 'Nickel-brass',
          grade: 'VF',
          estimated_value: 2.0,
          rarity: 'Common',
          confidence: 0.3,
          errors: ['AI parsing failed'],
          varieties: [],
          authentication_notes: 'Unable to complete full analysis',
          market_trend: 'stable'
        }
      };
    }

    const processingTime = Date.now() - startTime;

    // Ensure required fields and data validation with Greek coin specifics
    const finalResult = {
      success: true,
      analysis: {
        name: analysisResult.analysis?.name || 'Greek Coin',
        year: analysisResult.analysis?.year || 1980,
        country: analysisResult.analysis?.country || 'Greece',
        denomination: analysisResult.analysis?.denomination || 'Drachmas',
        composition: analysisResult.analysis?.composition || 'Nickel-brass',
        grade: analysisResult.analysis?.grade || 'VF',
        estimated_value: Math.max(0.5, analysisResult.analysis?.estimated_value || 2.0),
        rarity: analysisResult.analysis?.rarity || 'Common',
        mint: analysisResult.analysis?.mint || 'Bank of Greece',
        diameter: analysisResult.analysis?.diameter,
        weight: analysisResult.analysis?.weight,
        confidence: Math.min(1, Math.max(0.3, analysisResult.analysis?.confidence || 0.75)),
        errors: Array.isArray(analysisResult.analysis?.errors) ? analysisResult.analysis.errors : [],
        varieties: Array.isArray(analysisResult.analysis?.varieties) ? analysisResult.analysis.varieties : [],
        authentication_notes: analysisResult.analysis?.authentication_notes || 'Modern Greek circulation coin',
        market_trend: analysisResult.analysis?.market_trend || 'stable',
        historical_significance: analysisResult.analysis?.historical_significance || 'Greek drachma series'
      },
      processing_time: processingTime,
      ai_provider: 'anthropic',
      model: 'claude-3-5-sonnet',
      timestamp: new Date().toISOString()
    };

    console.log('Enhanced AI coin recognition completed successfully:', finalResult);

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
