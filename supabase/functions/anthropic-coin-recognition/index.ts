
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

    // ENHANCED API Key Authentication & Validation
    const anthropicApiKey = Deno.env.get('ANTHROPIC_API_KEY');
    console.log('=== ANTHROPIC API KEY VALIDATION ===');
    console.log('API Key available:', !!anthropicApiKey);
    console.log('API Key length:', anthropicApiKey?.length || 0);
    
    if (anthropicApiKey) {
      const keyEndFragment = anthropicApiKey.slice(-4);
      console.log('API Key ends with: ****' + keyEndFragment);
      
      // Validate API key format (should start with 'sk-ant-')
      if (!anthropicApiKey.startsWith('sk-ant-')) {
        console.error('Invalid API key format - should start with sk-ant-');
        return new Response(
          JSON.stringify({ 
            success: false, 
            error: 'Invalid API key format' 
          }),
          { 
            status: 401, 
            headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
          }
        );
      }
    }
    
    if (!anthropicApiKey) {
      console.error('ANTHROPIC_API_KEY environment variable not set');
      return new Response(
        JSON.stringify({ 
          success: false, 
          error: 'AI service not configured - missing API key' 
        }),
        { 
          status: 401, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    const startTime = Date.now();

    // Clean image data
    let cleanImageData = image;
    if (image.includes('data:image')) {
      cleanImageData = image.split('base64,')[1];
    } else if (image.includes('base64,')) {
      cleanImageData = image.split('base64,')[1];
    }

    console.log('Processing image data, length:', cleanImageData.length);

    // Enhanced Universal Numismatic AI Prompt for Claude 4
    const universalNumismaticPrompt = `
You are a world-class numismatic expert with deep knowledge of coins from all countries, eras, and cultures. Analyze this coin image with maximum precision and provide identification based solely on what you can observe.

CRITICAL: Provide your analysis in this EXACT JSON format:
{
  "success": true,
  "analysis": {
    "name": "Complete coin identification",
    "year": 1980,
    "country": "Country name",
    "denomination": "Face value",
    "composition": "Metal composition",
    "grade": "Condition assessment",
    "estimated_value": 2.50,
    "rarity": "Rarity level",
    "mint": "Mint facility",
    "diameter": 26.0,
    "weight": 6.5,
    "confidence": 0.90,
    "errors": [],
    "authentication_notes": "Authenticity assessment",
    "market_trend": "Current market status"
  }
}

Analysis Guidelines:
1. IDENTIFY all visible text, inscriptions, dates, and numerical values
2. DETERMINE country of origin from text, symbols, or design elements
3. ASSESS year/date from visible markings
4. EVALUATE denomination from face value indicators
5. ESTIMATE condition based on wear patterns and surface quality
6. PROVIDE current market valuation based on condition and rarity
7. NOTE any varieties, errors, or special characteristics
8. AUTHENTICATE based on design elements and manufacturing quality

If ANY element cannot be determined from the image:
- Use "Unknown" for that specific field
- Set confidence score appropriately (0.10-1.00)
- Do NOT guess or fabricate information

Be thorough, accurate, and only report what you can actually observe in the image.`;

    console.log('Calling Anthropic API with Claude 4 Sonnet model...');

    // Call Anthropic Claude API with latest model and enhanced retry logic
    let response;
    let attempt = 1;
    const maxAttempts = 3;
    
    while (attempt <= maxAttempts) {
      try {
        console.log(`Attempt ${attempt}: Calling Claude API with claude-sonnet-4-20250514...`);
        
        response = await fetch('https://api.anthropic.com/v1/messages', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'x-api-key': anthropicApiKey,
            'anthropic-version': '2023-06-01'
          },
          body: JSON.stringify({
            model: 'claude-sonnet-4-20250514', // UPGRADED TO CLAUDE 4 SONNET
            max_tokens: 2000,
            messages: [
              {
                role: 'user',
                content: [
                  {
                    type: 'text',
                    text: universalNumismaticPrompt
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
        
        console.log('Claude API response status:', response.status);
        
        if (response.ok) {
          break; // Success, exit retry loop
        } else {
          const errorText = await response.text();
          console.error(`Attempt ${attempt} failed with status ${response.status}:`, errorText);
          
          if (response.status === 401) {
            // Authentication error - don't retry
            return new Response(
              JSON.stringify({ 
                success: false,
                error: `Claude API authentication failed. Please verify your API key.`,
                details: errorText,
                processing_time: Date.now() - startTime,
                ai_provider: 'anthropic'
              }),
              { 
                status: 401, 
                headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
              }
            );
          }
          
          if (attempt === maxAttempts) {
            throw new Error(`API call failed after ${maxAttempts} attempts: ${errorText}`);
          }
        }
      } catch (error) {
        console.error(`Attempt ${attempt} failed:`, error);
        if (attempt === maxAttempts) {
          throw error;
        }
        attempt++;
        await new Promise(resolve => setTimeout(resolve, 1000 * attempt)); // Exponential backoff
      }
      
      attempt++;
    }

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Claude API Error Details:', {
        status: response.status,
        statusText: response.statusText,
        error: errorText
      });
      
      return new Response(
        JSON.stringify({ 
          success: false,
          error: `Claude AI analysis failed: ${response.status} - ${response.statusText}`,
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
    console.log('Raw Claude 4 response:', JSON.stringify(aiResponse, null, 2));
    
    const content = aiResponse.content[0]?.text;

    // Parse AI response with enhanced fallback handling
    let analysisResult;
    try {
      const jsonMatch = content.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        analysisResult = JSON.parse(jsonMatch[0]);
      } else {
        analysisResult = JSON.parse(content);
      }
    } catch (parseError) {
      console.error('Failed to parse Claude 4 response:', {
        content: content,
        parseError: parseError.message
      });
      // Enhanced fallback response
      analysisResult = {
        success: true,
        analysis: {
          name: 'Unidentified Coin',
          year: null,
          country: 'Unknown',
          denomination: 'Unknown',
          composition: 'Unknown',
          grade: 'Unknown',
          estimated_value: 0,
          rarity: 'Unknown',
          confidence: 0.10,
          errors: ['AI parsing failed'],
          authentication_notes: 'Unable to complete analysis',
          market_trend: 'unknown'
        }
      };
    }

    const processingTime = Date.now() - startTime;

    // Final Result Assembly
    const finalResult = {
      success: true,
      analysis: {
        name: analysisResult.analysis?.name || 'Unidentified Coin',
        year: analysisResult.analysis?.year || null,
        country: analysisResult.analysis?.country || 'Unknown',
        denomination: analysisResult.analysis?.denomination || 'Unknown',
        composition: analysisResult.analysis?.composition || 'Unknown',
        grade: analysisResult.analysis?.grade || 'Unknown',
        estimated_value: Math.max(0, analysisResult.analysis?.estimated_value || 0),
        rarity: analysisResult.analysis?.rarity || 'Unknown',
        mint: analysisResult.analysis?.mint || 'Unknown',
        diameter: analysisResult.analysis?.diameter || null,
        weight: analysisResult.analysis?.weight || null,
        confidence: Math.min(1, Math.max(0.10, analysisResult.analysis?.confidence || 0.10)),
        errors: Array.isArray(analysisResult.analysis?.errors) ? analysisResult.analysis.errors : [],
        authentication_notes: analysisResult.analysis?.authentication_notes || 'Standard analysis',
        market_trend: analysisResult.analysis?.market_trend || 'unknown'
      },
      processing_time: processingTime,
      ai_provider: 'anthropic',
      model: 'claude-sonnet-4-20250514',
      timestamp: new Date().toISOString()
    };

    console.log('=== FINAL CLAUDE 4 ANALYSIS RESULT ===');
    console.log('Coin identified as:', finalResult.analysis.name);
    console.log('Country:', finalResult.analysis.country);
    console.log('Confidence score:', finalResult.analysis.confidence);
    console.log('Processing time:', processingTime + 'ms');

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
        error: 'Claude AI analysis failed',
        message: error.message,
        stack: error.stack,
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
