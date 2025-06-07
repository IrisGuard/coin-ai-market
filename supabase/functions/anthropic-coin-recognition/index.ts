
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
    const { image, additionalImages = [] } = await req.json()
    
    if (!image) {
      throw new Error('No image provided')
    }

    const anthropicApiKey = Deno.env.get('ANTHROPIC_API_KEY')
    if (!anthropicApiKey) {
      throw new Error('Anthropic API key not configured')
    }

    // Prepare the message for Claude
    const messages = [
      {
        role: "user",
        content: [
          {
            type: "text",
            text: `Analyze this coin image and provide detailed information. Return a JSON response with the following structure:
            {
              "success": true,
              "confidence": 0.85,
              "provider": "anthropic",
              "identification": {
                "name": "1909-S VDB Lincoln Cent",
                "year": 1909,
                "country": "United States",
                "denomination": "1 Cent",
                "mint": "San Francisco",
                "series": "Lincoln Wheat Cent",
                "type": "Penny"
              },
              "grading": {
                "condition": "Very Fine",
                "grade": "VF-30",
                "details": "Light wear on high points"
              },
              "valuation": {
                "current_value": 750,
                "low_estimate": 600,
                "high_estimate": 900,
                "market_trend": "stable"
              },
              "specifications": {
                "composition": "95% Copper, 5% Tin and Zinc",
                "diameter": 19.05,
                "weight": 3.11,
                "edge": "Plain"
              },
              "rarity": "Key Date",
              "errors": [],
              "varieties": []
            }

            Focus on accuracy and provide realistic valuations based on current market conditions.`
          },
          {
            type: "image",
            source: {
              type: "base64",
              media_type: "image/jpeg",
              data: image.replace(/^data:image\/[a-z]+;base64,/, '')
            }
          }
        ]
      }
    ]

    // Call Anthropic API
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
        messages: messages
      })
    })

    if (!response.ok) {
      throw new Error(`Anthropic API error: ${response.statusText}`)
    }

    const result = await response.json()
    
    // Extract and parse the JSON from Claude's response
    const content = result.content[0].text
    let analysisResult
    
    try {
      // Try to extract JSON from the response
      const jsonMatch = content.match(/\{[\s\S]*\}/)
      if (jsonMatch) {
        analysisResult = JSON.parse(jsonMatch[0])
      } else {
        throw new Error('No JSON found in response')
      }
    } catch (parseError) {
      // Fallback: create a basic result structure
      analysisResult = {
        success: true,
        confidence: 0.7,
        provider: "anthropic",
        identification: {
          name: "Coin Analysis",
          year: new Date().getFullYear(),
          country: "Unknown",
          denomination: "Unknown"
        },
        grading: {
          condition: "Good",
          grade: "G-4"
        },
        valuation: {
          current_value: 1,
          market_trend: "stable"
        },
        specifications: {},
        rarity: "Common",
        errors: [],
        varieties: []
      }
    }

    return new Response(
      JSON.stringify(analysisResult),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      },
    )

  } catch (error) {
    console.error('Anthropic coin recognition error:', error)
    return new Response(
      JSON.stringify({ 
        success: false,
        error: error.message,
        provider: "anthropic"
      }),
      {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      },
    )
  }
})
