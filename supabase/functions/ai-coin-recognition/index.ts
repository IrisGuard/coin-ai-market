
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

    const openAIApiKey = Deno.env.get('OPENAI_API_KEY');
    if (!openAIApiKey) {
      console.error('OpenAI API key not found');
      return new Response(
        JSON.stringify({ error: 'OpenAI API key not configured' }),
        { 
          status: 500, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    // Prepare messages for OpenAI Vision API
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

Focus on:
1. Accurate identification of the coin type, year, and mint mark
2. Professional grading assessment
3. Detection of any mint errors (doubled dies, off-center strikes, clipped planchets, etc.)
4. Authentication concerns (counterfeits, alterations)
5. Current market value estimation
6. Condition assessment based on visible wear`
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

    // Call OpenAI Vision API
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
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

    if (!response.ok) {
      const errorText = await response.text();
      console.error('OpenAI API Error:', errorText);
      throw new Error(`OpenAI API error: ${response.status}`);
    }

    const aiResponse = await response.json();
    const content = aiResponse.choices[0].message.content;

    console.log('OpenAI raw response:', content);

    // Parse JSON response
    let analysisResult;
    try {
      // Extract JSON from the response (in case there's extra text)
      const jsonMatch = content.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        analysisResult = JSON.parse(jsonMatch[0]);
      } else {
        analysisResult = JSON.parse(content);
      }
    } catch (parseError) {
      console.error('Failed to parse AI response:', content);
      // Fallback to structured response
      analysisResult = {
        success: false,
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
        errors: [],
        varieties: [],
        authentication_notes: 'Requires manual authentication',
        market_trend: 'stable'
      };
    }

    // Ensure all required fields are present
    const finalResult = {
      success: true,
      name: analysisResult.name || 'Unidentified Coin',
      year: analysisResult.year || new Date().getFullYear(),
      country: analysisResult.country || 'Unknown',
      rarity: analysisResult.rarity || 'Common',
      grade: analysisResult.grade || 'Ungraded',
      estimated_value: analysisResult.estimated_value || 10,
      confidence: analysisResult.confidence || 0.7,
      description: analysisResult.description || 'Coin analysis completed.',
      composition: analysisResult.composition || 'Unknown',
      diameter: analysisResult.diameter,
      weight: analysisResult.weight,
      mint: analysisResult.mint || 'Unknown',
      condition: analysisResult.condition || 'Good',
      errors: analysisResult.errors || [],
      varieties: analysisResult.varieties || [],
      authentication_notes: analysisResult.authentication_notes || '',
      market_trend: analysisResult.market_trend || 'stable'
    };

    console.log('AI coin recognition completed:', finalResult);

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
        error: 'Internal server error',
        message: error.message 
      }),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );
  }
});
