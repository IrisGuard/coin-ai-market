
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
    const { 
      frontImage, 
      backImage, 
      analysisType = 'comprehensive',
      includeErrorDetection = true,
      includeVisualComparison = true 
    } = await req.json();

    if (!frontImage || !backImage) {
      return new Response(
        JSON.stringify({ 
          success: false, 
          error: 'Both front and back images are required' 
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

    // Enhanced dual-side analysis prompt
    const dualAnalysisPrompt = `
You are a world-renowned numismatist and coin authentication expert with over 40 years of experience. You have access to both the obverse (front) and reverse (back) of this coin for complete analysis.

Analyze both sides comprehensively and provide your expert assessment in this exact JSON format:
{
  "success": true,
  "analysis": {
    "name": "Complete coin name with series, variety, and all details",
    "year": 1921,
    "country": "Country of origin",
    "denomination": "Face value and unit",
    "composition": "Exact metal composition (e.g., 90% Silver, 10% Copper)",
    "grade": "Professional grade assessment (MS-65, AU-50, etc.)",
    "estimated_value": 125.50,
    "rarity": "Common|Uncommon|Rare|Very Rare|Extremely Rare",
    "mint": "Mint facility and mint mark if visible",
    "diameter": 38.1,
    "weight": 26.73,
    "obverse_details": "Detailed description of front side design elements",
    "reverse_details": "Detailed description of back side design elements",
    "mint_marks": "Any visible mint marks and their locations",
    "wear_patterns": "Detailed wear analysis from both sides",
    "strike_quality": "Quality of the striking process",
    "edge_details": "Edge type and condition if visible"
  },
  "confidence": 0.95,
  "errors": ["Any mint errors detected from both sides"],
  "varieties": ["Special varieties or die states"],
  "authentication_analysis": {
    "authenticity_confidence": 0.95,
    "potential_issues": ["Any concerns about authenticity"],
    "key_authentication_points": ["Critical features that confirm authenticity"],
    "comparison_notes": "How this compares to known examples"
  },
  "condition_assessment": {
    "obverse_grade": "Grade specific to front side",
    "reverse_grade": "Grade specific to back side",
    "overall_condition": "Combined condition assessment",
    "problem_areas": ["Any condition issues"],
    "preservation_quality": "How well preserved the coin is"
  },
  "market_analysis": {
    "current_market_range": {"min": 100, "max": 150},
    "recent_auction_results": "Recent comparable sales",
    "market_trend": "Current market direction",
    "collector_demand": "Level of collector interest"
  },
  "dual_side_observations": {
    "design_consistency": "How well both sides match in terms of wear and quality",
    "strike_alignment": "Alignment between obverse and reverse",
    "overall_assessment": "Combined analysis using both sides"
  }
}

Critical Analysis Points:
1. Use BOTH images to cross-reference and verify identification
2. Look for mint errors that may only be visible on one side
3. Assess wear patterns that appear on both sides
4. Check for any inconsistencies between front and back
5. Provide the most accurate identification possible using both views
6. Pay special attention to any errors, varieties, or unusual features
7. Consider the rarity and value implications of what you observe

Be extremely thorough and precise. This dual-side analysis should be significantly more accurate than single-side identification.`;

    // Call Anthropic Claude API with both images
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': anthropicApiKey,
        'anthropic-version': '2023-06-01'
      },
      body: JSON.stringify({
        model: 'claude-3-5-sonnet-20241022',
        max_tokens: 3000,
        messages: [
          {
            role: 'user',
            content: [
              {
                type: 'text',
                text: dualAnalysisPrompt
              },
              {
                type: 'text',
                text: 'FRONT SIDE (OBVERSE):'
              },
              {
                type: 'image',
                source: {
                  type: 'base64',
                  media_type: 'image/jpeg',
                  data: frontImage.includes('base64,') ? frontImage.split('base64,')[1] : frontImage
                }
              },
              {
                type: 'text',
                text: 'BACK SIDE (REVERSE):'
              },
              {
                type: 'image',
                source: {
                  type: 'base64',
                  media_type: 'image/jpeg',
                  data: backImage.includes('base64,') ? backImage.split('base64,')[1] : backImage
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

    console.log('Dual-side AI analysis response:', content);

    // Parse the AI response
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
          obverse_details: 'Unable to analyze front side',
          reverse_details: 'Unable to analyze back side'
        },
        confidence: 0.1,
        errors: [],
        varieties: []
      };
    }

    const processingTime = Date.now() - startTime;

    // Ensure comprehensive results structure
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
        edge_details: analysisResult.analysis?.edge_details || ''
      },
      confidence: Math.min(1, Math.max(0, analysisResult.confidence || 0.5)),
      errors: Array.isArray(analysisResult.errors) ? analysisResult.errors : [],
      varieties: Array.isArray(analysisResult.varieties) ? analysisResult.varieties : [],
      authentication_analysis: analysisResult.authentication_analysis || {},
      condition_assessment: analysisResult.condition_assessment || {},
      market_analysis: analysisResult.market_analysis || {},
      dual_side_observations: analysisResult.dual_side_observations || {},
      processing_time: processingTime,
      ai_provider: 'anthropic',
      model: 'claude-3-5-sonnet',
      analysis_type: 'dual_side_comprehensive',
      timestamp: new Date().toISOString()
    };

    console.log('Enhanced dual-side AI analysis completed:', finalResult);

    return new Response(
      JSON.stringify(finalResult),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );

  } catch (error) {
    console.error('Error in enhanced-dual-recognition function:', error);
    
    return new Response(
      JSON.stringify({ 
        success: false,
        error: 'Dual-side AI analysis failed',
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
