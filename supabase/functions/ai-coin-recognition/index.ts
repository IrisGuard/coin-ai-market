
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import "https://deno.land/x/xhr@0.1.0/mod.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { image, additionalImages } = await req.json();

    if (!image) {
      return new Response(
        JSON.stringify({ error: 'No image provided' }),
        { 
          status: 400, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    // Use the configured OpenAI API key from Supabase secrets
    const openAIApiKey = Deno.env.get('OPENAI_API_KEY');
    console.log('=== OPENAI API KEY VALIDATION ===');
    console.log('API Key available:', !!openAIApiKey);
    console.log('API Key length:', openAIApiKey?.length || 0);
    
    if (openAIApiKey) {
      const keyFragment = openAIApiKey.slice(-4);
      console.log('API Key ends with: ****' + keyFragment);
    }
    
    if (!openAIApiKey) {
      console.error('OPENAI_API_KEY environment variable not set');
      return new Response(
        JSON.stringify({ 
          success: false, 
          error: 'AI service not configured - missing OpenAI API key' 
        }),
        { 
          status: 401, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    const startTime = Date.now();

    // Prepare messages for OpenAI Vision API with enhanced numismatic analysis
    const messages = [
      {
        role: "system",
        content: `You are an expert numismatist and coin authentication specialist. Analyze the coin image(s) and provide detailed information in JSON format.

Your response must be valid JSON with these exact fields:
{
  "success": true,
  "name": "Full coin name",
  "year": 1921,
  "country": "Country name",
  "rarity": "Common|Uncommon|Rare|Ultra Rare",
  "grade": "Professional grade (MS-65, AU-50, etc)",
  "estimated_value": 85,
  "confidence": 0.92,
  "description": "Detailed description",
  "composition": "Metal composition",
  "diameter": 38.1,
  "weight": 26.73,
  "mint": "Mint location",
  "condition": "Mint|Near Mint|Excellent|Good|Fair|Poor",
  "errors": ["List any mint errors detected"],
  "varieties": ["List any known varieties"],
  "authentication_notes": "Any authenticity concerns",
  "market_trend": "stable|rising|declining"
}

Focus on accurate identification, professional grading, error detection, and current market value estimation.`
      },
      {
        role: "user",
        content: [
          {
            type: "text",
            text: "Please analyze this coin image and provide detailed numismatic information. Pay special attention to any mint errors, varieties, or authentication concerns."
          },
          {
            type: "image_url",
            image_url: {
              url: image
            }
          }
        ]
      }
    ];

    // Add additional images if provided
    if (additionalImages && additionalImages.length > 0) {
      additionalImages.forEach((additionalImage: string, index: number) => {
        messages[1].content.push({
          type: "text",
          text: `Additional image ${index + 1}:`
        });
        messages[1].content.push({
          type: "image_url",
          image_url: {
            url: additionalImage
          }
        });
      });
    }

    console.log('Calling OpenAI Vision API with enhanced analysis...');

    // Call OpenAI Vision API with retry logic
    let response;
    let attempt = 1;
    const maxAttempts = 2;
    
    while (attempt <= maxAttempts) {
      try {
        console.log(`Attempt ${attempt}: Calling OpenAI Vision API...`);
        
        response = await fetch('https://api.openai.com/v1/chat/completions', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${openAIApiKey}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            model: 'gpt-4o',
            messages: messages,
            max_tokens: 1500,
            temperature: 0.1
          }),
        });
        
        break; // Success, exit retry loop
      } catch (error) {
        console.error(`Attempt ${attempt} failed:`, error);
        if (attempt === maxAttempts) {
          throw error;
        }
        attempt++;
        await new Promise(resolve => setTimeout(resolve, 1000)); // Wait 1 second before retry
      }
    }

    console.log('OpenAI API response status:', response.status);

    if (!response.ok) {
      const errorText = await response.text();
      console.error('OpenAI API Error:', errorText);
      
      return new Response(
        JSON.stringify({ 
          success: false,
          error: `OpenAI API error: ${response.status}`,
          details: errorText,
          processing_time: Date.now() - startTime,
          ai_provider: 'openai'
        }),
        { 
          status: 500, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    const aiResponse = await response.json();
    const content = aiResponse.choices[0].message.content;

    console.log('OpenAI raw response:', content);

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
      console.error('Failed to parse AI response:', content);
      // Enhanced fallback response
      analysisResult = {
        success: true,
        name: 'Unidentified Coin',
        year: new Date().getFullYear(),
        country: 'Unknown',
        rarity: 'Common',
        grade: 'Ungraded',
        estimated_value: 10,
        confidence: 0.5,
        description: 'Unable to fully analyze coin image. Manual review recommended.',
        composition: 'Unknown',
        diameter: null,
        weight: null,
        mint: 'Unknown',
        condition: 'Good',
        errors: ['AI parsing failed'],
        varieties: [],
        authentication_notes: 'Requires manual authentication',
        market_trend: 'stable'
      };
    }

    const processingTime = Date.now() - startTime;

    // Final Result Assembly
    const finalResult = {
      success: true,
      name: analysisResult.name || 'Unidentified Coin',
      year: analysisResult.year || new Date().getFullYear(),
      country: analysisResult.country || 'Unknown',
      rarity: analysisResult.rarity || 'Common',
      grade: analysisResult.grade || 'Ungraded',
      estimated_value: Math.max(0, analysisResult.estimated_value || 10),
      confidence: Math.min(1, Math.max(0.5, analysisResult.confidence || 0.7)),
      description: analysisResult.description || 'Coin analysis completed.',
      composition: analysisResult.composition || 'Unknown',
      diameter: analysisResult.diameter,
      weight: analysisResult.weight,
      mint: analysisResult.mint || 'Unknown',
      condition: analysisResult.condition || 'Good',
      errors: analysisResult.errors || [],
      varieties: analysisResult.varieties || [],
      authentication_notes: analysisResult.authentication_notes || '',
      market_trend: analysisResult.market_trend || 'stable',
      processing_time: processingTime,
      ai_provider: 'openai',
      model: 'gpt-4o',
      timestamp: new Date().toISOString()
    };

    console.log('=== FINAL OPENAI ANALYSIS RESULT ===');
    console.log('Coin identified as:', finalResult.name);
    console.log('Country:', finalResult.country);
    console.log('Confidence score:', finalResult.confidence);
    console.log('Processing time:', processingTime + 'ms');

    return new Response(
      JSON.stringify(finalResult),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );

  } catch (error) {
    console.error('Error in ai-coin-recognition function:', error);
    
    return new Response(
      JSON.stringify({ 
        success: false,
        error: 'AI analysis failed',
        message: error.message,
        processing_time: 0,
        ai_provider: 'openai'
      }),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );
  }
});
