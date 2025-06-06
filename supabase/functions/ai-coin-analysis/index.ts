
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"

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

    if (!image) {
      return new Response(
        JSON.stringify({ error: 'No image provided' }),
        { 
          status: 400, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      )
    }

    const anthropicApiKey = Deno.env.get('ANTHROPIC_API_KEY')
    if (!anthropicApiKey) {
      console.error('ANTHROPIC_API_KEY not found in environment variables')
      return new Response(
        JSON.stringify({ error: 'AI service not configured' }),
        { 
          status: 500, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      )
    }

    console.log('Analyzing coin image with Anthropic Claude...')

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
                text: `Analyze this coin image and provide detailed information. Return ONLY a valid JSON object with this exact structure:

{
  "identification": {
    "name": "Full coin name",
    "year": 2023,
    "country": "Country name",
    "denomination": "Denomination",
    "mint": "Mint location"
  },
  "grading": {
    "condition": "Grade abbreviation (e.g., MS-65, AU-50)",
    "grade": "Full grade description",
    "details": "Detailed condition assessment"
  },
  "valuation": {
    "current_value": 25.50,
    "low_estimate": 20.00,
    "high_estimate": 30.00,
    "market_trend": "stable"
  },
  "specifications": {
    "composition": "Metal composition",
    "diameter": 24.3,
    "weight": 6.25
  },
  "rarity": "Common/Uncommon/Rare/Very Rare",
  "confidence": 0.85,
  "pcgs_number": "PCGS catalog number if known",
  "ngc_number": "NGC catalog number if known"
}

Provide realistic values. If you cannot determine specific information, use reasonable estimates or "Unknown" for strings and null for numbers.`
              },
              {
                type: 'image',
                source: {
                  type: 'base64',
                  media_type: 'image/jpeg',
                  data: image
                }
              }
            ]
          }
        ]
      })
    })

    if (!response.ok) {
      const errorText = await response.text()
      console.error('Anthropic API error:', response.status, errorText)
      throw new Error(`Anthropic API error: ${response.status}`)
    }

    const data = await response.json()
    console.log('Anthropic response received')

    if (!data.content || !data.content[0] || !data.content[0].text) {
      throw new Error('Invalid response format from Anthropic')
    }

    let analysisResult
    try {
      // Extract JSON from the response text
      const responseText = data.content[0].text
      const jsonMatch = responseText.match(/\{[\s\S]*\}/)
      
      if (!jsonMatch) {
        throw new Error('No JSON found in response')
      }

      analysisResult = JSON.parse(jsonMatch[0])
    } catch (parseError) {
      console.error('Failed to parse AI response as JSON:', parseError)
      
      // Fallback response if parsing fails
      analysisResult = {
        identification: {
          name: "Coin Analysis",
          year: new Date().getFullYear(),
          country: "Unknown",
          denomination: "Unknown",
          mint: "Unknown"
        },
        grading: {
          condition: "Good",
          grade: "Good condition",
          details: "Unable to determine specific grade from image"
        },
        valuation: {
          current_value: 5.00,
          low_estimate: 2.00,
          high_estimate: 10.00,
          market_trend: "stable"
        },
        specifications: {
          composition: "Unknown",
          diameter: null,
          weight: null
        },
        rarity: "Common",
        confidence: 0.3,
        pcgs_number: null,
        ngc_number: null
      }
    }

    // Validate and ensure all required fields are present
    const validatedResult = {
      identification: {
        name: analysisResult.identification?.name || "Unknown Coin",
        year: analysisResult.identification?.year || new Date().getFullYear(),
        country: analysisResult.identification?.country || "Unknown",
        denomination: analysisResult.identification?.denomination || "Unknown",
        mint: analysisResult.identification?.mint || "Unknown"
      },
      grading: {
        condition: analysisResult.grading?.condition || "Good",
        grade: analysisResult.grading?.grade || "Good condition",
        details: analysisResult.grading?.details || "Condition assessment based on image analysis"
      },
      valuation: {
        current_value: parseFloat(analysisResult.valuation?.current_value) || 5.00,
        low_estimate: parseFloat(analysisResult.valuation?.low_estimate) || 2.00,
        high_estimate: parseFloat(analysisResult.valuation?.high_estimate) || 10.00,
        market_trend: analysisResult.valuation?.market_trend || "stable"
      },
      specifications: {
        composition: analysisResult.specifications?.composition || "Unknown",
        diameter: analysisResult.specifications?.diameter || null,
        weight: analysisResult.specifications?.weight || null
      },
      rarity: analysisResult.rarity || "Common",
      confidence: Math.min(Math.max(parseFloat(analysisResult.confidence) || 0.5, 0), 1),
      pcgs_number: analysisResult.pcgs_number || null,
      ngc_number: analysisResult.ngc_number || null
    }

    console.log('Analysis complete:', validatedResult.identification.name)

    return new Response(
      JSON.stringify(validatedResult),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    )

  } catch (error) {
    console.error('Error in ai-coin-analysis function:', error)
    
    return new Response(
      JSON.stringify({ 
        error: 'Analysis failed',
        details: error.message 
      }),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    )
  }
})
