
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { image, imageUrl } = await req.json()
    
    // Initialize Supabase client
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      {
        global: {
          headers: { Authorization: req.headers.get('Authorization')! },
        },
      }
    )

    // Get user from auth header
    const { data: { user }, error: authError } = await supabaseClient.auth.getUser()
    if (authError || !user) {
      return new Response('Unauthorized', { status: 401, headers: corsHeaders })
    }

    // Check if we have Anthropic API key configured
    const anthropicApiKey = Deno.env.get('ANTHROPIC_API_KEY')
    if (!anthropicApiKey) {
      return new Response(
        JSON.stringify({ error: 'AI service not configured' }), 
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Call Anthropic Claude API for coin analysis
    const anthropicResponse = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${anthropicApiKey}`,
        'anthropic-version': '2023-06-01'
      },
      body: JSON.stringify({
        model: 'claude-3-sonnet-20240229',
        max_tokens: 1000,
        messages: [{
          role: 'user',
          content: [
            {
              type: 'text',
              text: `Analyze this coin image and provide detailed information in the following JSON format:
              {
                "identification": {
                  "name": "coin name",
                  "year": year,
                  "country": "country",
                  "denomination": "denomination",
                  "mint": "mint mark"
                },
                "grading": {
                  "condition": "grade (MS-70, AU-58, etc)",
                  "grade": "condition description",
                  "details": "detailed condition notes"
                },
                "valuation": {
                  "current_value": estimated_value_number,
                  "low_estimate": low_value,
                  "high_estimate": high_value,
                  "market_trend": "trend description"
                },
                "specifications": {
                  "composition": "metal composition",
                  "weight": "weight in grams",
                  "diameter": "diameter in mm",
                  "edge": "edge type"
                },
                "rarity": "rarity level",
                "confidence": confidence_score_0_to_1,
                "pcgs_number": "PCGS number if known",
                "ngc_number": "NGC number if known"
              }
              
              Be as accurate as possible based on visible features.`
            },
            {
              type: 'image',
              source: {
                type: 'base64',
                media_type: 'image/jpeg',
                data: image.replace(/^data:image\/[a-z]+;base64,/, '')
              }
            }
          ]
        }]
      })
    })

    if (!anthropicResponse.ok) {
      throw new Error(`Anthropic API error: ${anthropicResponse.statusText}`)
    }

    const anthropicResult = await anthropicResponse.json()
    const analysisText = anthropicResult.content[0].text
    
    // Parse the JSON response from Claude
    let analysisResult
    try {
      analysisResult = JSON.parse(analysisText)
    } catch (parseError) {
      // If parsing fails, create a structured response from the text
      analysisResult = {
        identification: {
          name: "Unknown Coin",
          year: new Date().getFullYear(),
          country: "Unknown",
          denomination: "Unknown",
          mint: "Unknown"
        },
        grading: {
          condition: "Good",
          grade: "Needs professional grading",
          details: analysisText.substring(0, 200)
        },
        valuation: {
          current_value: 1.00,
          low_estimate: 0.50,
          high_estimate: 2.00,
          market_trend: "Stable"
        },
        specifications: {
          composition: "Unknown",
          weight: "Unknown",
          diameter: "Unknown",
          edge: "Unknown"
        },
        rarity: "Common",
        confidence: 0.5
      }
    }

    // Cache the analysis result
    await supabaseClient
      .from('ai_recognition_cache')
      .insert({
        image_hash: btoa(image).substring(0, 64),
        recognition_results: analysisResult,
        confidence_score: analysisResult.confidence || 0.5,
        sources_consulted: ['anthropic-claude'],
        processing_time_ms: Date.now()
      })

    return new Response(
      JSON.stringify(analysisResult),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )

  } catch (error) {
    console.error('AI analysis error:', error)
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }
})
