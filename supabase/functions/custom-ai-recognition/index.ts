
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface AIProvider {
  name: string;
  endpoint: string;
  apiKey: string;
  model?: string;
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const { image, additionalImages = [], aiProvider = 'custom' } = await req.json();

    // Get AI provider configuration from environment or database
    const providers: Record<string, AIProvider> = {
      custom: {
        name: 'Custom AI',
        endpoint: Deno.env.get('CUSTOM_AI_ENDPOINT') || '',
        apiKey: Deno.env.get('CUSTOM_AI_API_KEY') || '',
        model: Deno.env.get('CUSTOM_AI_MODEL') || 'default'
      },
      openai: {
        name: 'OpenAI',
        endpoint: 'https://api.openai.com/v1/chat/completions',
        apiKey: Deno.env.get('OPENAI_API_KEY') || '',
        model: 'gpt-4-vision-preview'
      }
    };

    const provider = providers[aiProvider];
    if (!provider || !provider.apiKey) {
      throw new Error(`AI provider ${aiProvider} not configured`);
    }

    console.log(`Using AI provider: ${provider.name}`);

    let response;
    
    if (aiProvider === 'custom') {
      // Custom AI API call
      response = await fetch(provider.endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${provider.apiKey}`,
        },
        body: JSON.stringify({
          model: provider.model,
          image: image,
          additional_images: additionalImages,
          task: 'coin_recognition',
          instructions: 'Analyze this coin image and provide identification, grade estimation, and value assessment.'
        }),
      });
    } else {
      // OpenAI API call (fallback)
      response = await fetch(provider.endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${provider.apiKey}`,
        },
        body: JSON.stringify({
          model: provider.model,
          messages: [
            {
              role: "user",
              content: [
                {
                  type: "text",
                  text: "Analyze this coin image and provide: 1) Coin identification (name, year, country), 2) Grade estimation, 3) Estimated value range, 4) Confidence score (0-1). Respond in JSON format."
                },
                {
                  type: "image_url",
                  image_url: { url: `data:image/jpeg;base64,${image}` }
                }
              ]
            }
          ],
          max_tokens: 1000
        }),
      });
    }

    if (!response.ok) {
      throw new Error(`AI API error: ${response.status} ${response.statusText}`);
    }

    const aiResult = await response.json();
    
    // Normalize response format
    let normalizedResult;
    if (aiProvider === 'custom') {
      normalizedResult = aiResult;
    } else {
      // Parse OpenAI response
      const content = aiResult.choices[0]?.message?.content;
      try {
        normalizedResult = JSON.parse(content);
      } catch (e) {
        normalizedResult = {
          name: 'Unknown Coin',
          confidence: 0.5,
          grade: 'Ungraded',
          estimated_value: 'Unable to determine',
          provider: provider.name
        };
      }
    }

    // Cache the result
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    const imageHash = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(image));
    const hashArray = Array.from(new Uint8Array(imageHash));
    const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');

    await supabase.from('ai_recognition_cache').upsert({
      image_hash: hashHex,
      recognition_results: normalizedResult,
      confidence_score: normalizedResult.confidence || 0.5,
      processing_time_ms: Date.now(),
      sources_consulted: [provider.name]
    });

    return new Response(
      JSON.stringify({
        success: true,
        provider: provider.name,
        ...normalizedResult
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );

  } catch (error) {
    console.error('AI recognition error:', error);
    return new Response(
      JSON.stringify({
        success: false,
        error: error.message,
        provider: 'unknown'
      }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});
