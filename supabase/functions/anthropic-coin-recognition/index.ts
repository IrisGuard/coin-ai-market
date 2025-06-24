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
    const { image, analysis_type = 'comprehensive', include_valuation = true, include_errors = true, image_format = 'jpeg' } = await req.json();

    if (!image) {
      console.error('❌ No image provided in request');
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

    // Enhanced API Key Authentication & Validation
    const anthropicApiKey = Deno.env.get('ANTHROPIC_API_KEY');
    console.log('🔑 ANTHROPIC API KEY VALIDATION');
    console.log('API Key available:', !!anthropicApiKey);
    console.log('API Key length:', anthropicApiKey?.length || 0);
    
    if (anthropicApiKey) {
      const keyEndFragment = anthropicApiKey.slice(-4);
      console.log('API Key ends with: ****' + keyEndFragment);
      
      // Validate API key format (should start with 'sk-ant-')
      if (!anthropicApiKey.startsWith('sk-ant-')) {
        console.error('❌ Invalid API key format - should start with sk-ant-');
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
      console.error('❌ ANTHROPIC_API_KEY environment variable not set');
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

    // Enhanced image data cleaning and validation
    let cleanImageData = image;
    if (typeof image === 'string') {
      // Remove any data URL prefixes
      if (image.includes('data:image')) {
        cleanImageData = image.split('base64,')[1];
      } else if (image.includes('base64,')) {
        cleanImageData = image.split('base64,')[1];
      }
      
      // Clean whitespace
      cleanImageData = cleanImageData.replace(/\s/g, '');
      
      // Validate base64
      if (!/^[A-Za-z0-9+/]*={0,2}$/.test(cleanImageData)) {
        console.error('❌ Invalid base64 format');
        return new Response(
          JSON.stringify({ 
            success: false, 
            error: 'Invalid image format - corrupted base64' 
          }),
          { 
            status: 400, 
            headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
          }
        );
      }
    }

    console.log('🖼️ Processing image data, length:', cleanImageData.length);

    // Enhanced Universal Numismatic AI Prompt for Claude 4 - GLOBAL RECOGNITION
    const universalNumismaticPrompt = `
You are the world's most advanced numismatic AI expert with comprehensive knowledge of coins from ALL countries, cultures, and historical periods. Your task is to identify this coin with maximum precision.

🚫 CRITICAL RESTRICTIONS:
- NEVER assume a coin is American unless clearly identified as such
- NEVER return "Lincoln Cent" or any US coin data unless the coin is definitively American
- NEVER use hardcoded or default coin information
- ONLY report what you can actually observe in the image

🔍 ANALYSIS METHODOLOGY:
1. FIRST: Identify visible text, inscriptions, scripts, and symbols
2. SECOND: Determine country/region from text, alphabet, or cultural symbols
3. THIRD: Extract year/date if visible
4. FOURTH: Assess denomination from numerical values or text
5. FIFTH: Evaluate metal composition from color and appearance
6. SIXTH: Determine condition and grade from wear patterns
7. SEVENTH: Estimate value based on identification and condition

🌍 GLOBAL RECOGNITION PRIORITIES:
- Greek coins: Look for "ΕΛΛΗΝΙΚΗ", "ΔΡΑΧΜΗ", "ΛΕΠΤΑ", or Greek symbols
- Arabic/Islamic coins: Look for Arabic script, crescents, or Islamic symbols
- Chinese coins: Look for Chinese characters, yuan symbols
- European coins: Look for country names in local languages
- Asian coins: Identify regional scripts and symbols
- African coins: Look for local languages and symbols

RESPOND IN THIS EXACT JSON FORMAT:
{
  "success": true,
  "analysis": {
    "name": "SPECIFIC coin identification based on visible elements",
    "year": 1980,
    "country": "EXACT country name (Greece, China, Morocco, etc.)",
    "denomination": "Face value with currency",
    "composition": "Metal composition based on appearance",
    "grade": "Condition assessment",
    "estimated_value": 2.50,
    "rarity": "Common/Uncommon/Rare/Very Rare",
    "mint": "Mint facility if identifiable",
    "diameter": 26.0,
    "weight": 6.5,
    "confidence": 0.90,
    "errors": ["List any visible errors or varieties"],
    "authentication_notes": "Authenticity assessment",
    "market_trend": "Current market status"
  }
}

🎯 IDENTIFICATION GUIDELINES:
- If text is in Greek alphabet → Country: "Greece"
- If text is in Arabic script → Country: "Islamic/Arabic Region" or specific country
- If text is in Chinese characters → Country: "China"
- If text is in Cyrillic → Country: "Russia" or specific country
- If text shows "UNITED STATES" or "AMERICA" → Country: "United States"
- If text shows European language → Identify specific European country

⚠️ UNKNOWN DATA HANDLING:
- If country cannot be determined: "Unknown"
- If year cannot be read: Use current year with low confidence
- If denomination unclear: "Unknown denomination"
- If metal uncertain: "Unknown metal - appears [color description]"
- Set confidence score between 0.10-1.00 based on certainty

IMPORTANT: Base your analysis ONLY on what you can actually see in the image. Do not use template responses or default to American coins.`;

    console.log('📞 Calling Anthropic API with enhanced global recognition prompt...');

    // Enhanced API call with better error handling
    let response;
    let attempt = 1;
    const maxAttempts = 3;
    
    while (attempt <= maxAttempts) {
      try {
        console.log(`🔄 Attempt ${attempt}: Calling Claude API with claude-sonnet-4-20250514...`);
        
        response = await fetch('https://api.anthropic.com/v1/messages', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'x-api-key': anthropicApiKey,
            'anthropic-version': '2023-06-01'
          },
          body: JSON.stringify({
            model: 'claude-sonnet-4-20250514',
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
                      media_type: `image/${image_format}`,
                      data: cleanImageData
                    }
                  }
                ]
              }
            ]
          })
        });
        
        console.log('📡 Claude API response status:', response.status);
        
        if (response.ok) {
          break; // Success, exit retry loop
        } else {
          const errorText = await response.text();
          console.error(`❌ Attempt ${attempt} failed with status ${response.status}:`, errorText);
          
          // Enhanced error categorization
          if (response.status === 401) {
            return new Response(
              JSON.stringify({ 
                success: false,
                error: `Claude API authentication failed. Please verify your API key has sufficient credits.`,
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
          
          if (response.status === 400 && errorText.includes('credit balance')) {
            return new Response(
              JSON.stringify({ 
                success: false,
                error: `Insufficient API credits. Please add credits to your Anthropic account.`,
                details: errorText,
                processing_time: Date.now() - startTime,
                ai_provider: 'anthropic'
              }),
              { 
                status: 400, 
                headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
              }
            );
          }
          
          if (response.status === 400 && errorText.includes('Image does not match')) {
            return new Response(
              JSON.stringify({ 
                success: false,
                error: `Image format error. Please ensure the image is a valid ${image_format.toUpperCase()} file.`,
                details: errorText,
                processing_time: Date.now() - startTime,
                ai_provider: 'anthropic'
              }),
              { 
                status: 400, 
                headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
              }
            );
          }
          
          if (attempt === maxAttempts) {
            throw new Error(`API call failed after ${maxAttempts} attempts: ${errorText}`);
          }
        }
      } catch (error) {
        console.error(`❌ Attempt ${attempt} failed:`, error);
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
      console.error('❌ Claude API Error Details:', {
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
    console.log('📋 Raw Claude 4 response:', JSON.stringify(aiResponse, null, 2));
    
    const content = aiResponse.content[0]?.text;

    // Enhanced AI response parsing with better fallback handling
    let analysisResult;
    try {
      const jsonMatch = content.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        analysisResult = JSON.parse(jsonMatch[0]);
      } else {
        analysisResult = JSON.parse(content);
      }
    } catch (parseError) {
      console.error('❌ Failed to parse Claude 4 response:', {
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
          errors: ['AI parsing failed - please try with a clearer image'],
          authentication_notes: 'Unable to complete analysis due to parsing error',
          market_trend: 'unknown'
        }
      };
    }

    const processingTime = Date.now() - startTime;

    // Enhanced Final Result Assembly
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
        authentication_notes: analysisResult.analysis?.authentication_notes || 'Standard analysis completed',
        market_trend: analysisResult.analysis?.market_trend || 'unknown'
      },
      processing_time: processingTime,
      ai_provider: 'anthropic',
      model: 'claude-sonnet-4-20250514',
      timestamp: new Date().toISOString()
    };

    console.log('✅ FINAL CLAUDE 4 ANALYSIS RESULT');
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
    console.error('💥 Error in anthropic-coin-recognition function:', error);
    
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
