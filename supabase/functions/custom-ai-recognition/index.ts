
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

    // Only support custom AI provider now
    const provider: AIProvider = {
      name: 'Custom AI',
      endpoint: Deno.env.get('CUSTOM_AI_ENDPOINT') || '',
      apiKey: Deno.env.get('CUSTOM_AI_API_KEY') || '',
      model: Deno.env.get('CUSTOM_AI_MODEL') || 'default'
    };
    
    console.log('=== CUSTOM AI PROVIDER VALIDATION ===');
    console.log('Provider:', provider.name);
    console.log('API Key available:', !!provider.apiKey);
    console.log('Endpoint configured:', !!provider.endpoint);
    
    if (!provider.apiKey || !provider.endpoint) {
      console.error('Custom AI provider not configured properly');
      return new Response(
        JSON.stringify({ 
          success: false,
          error: 'Custom AI provider not configured - missing API key or endpoint',
          provider: 'custom'
        }),
        { 
          status: 401, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    console.log('Using Custom AI provider:', provider.name);

    // Custom AI API call
    console.log('Calling custom AI endpoint...');
    const response = await fetch(provider.endpoint, {
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

    console.log('Custom AI Provider response status:', response.status);

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Custom AI Provider Error:', errorText);
      return new Response(
        JSON.stringify({ 
          success: false,
          error: `Custom AI API error: ${response.status} ${response.statusText}`,
          details: errorText,
          provider: provider.name
        }),
        { 
          status: 500, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    const aiResult = await response.json();
    
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
      recognition_results: aiResult,
      confidence_score: aiResult.confidence || 0.5,
      processing_time_ms: Date.now(),
      sources_consulted: [provider.name]
    });

    console.log('=== CUSTOM AI ANALYSIS COMPLETE ===');
    console.log('Provider used:', provider.name);
    console.log('Analysis successful:', !!aiResult);

    return new Response(
      JSON.stringify({
        success: true,
        provider: provider.name,
        ...aiResult
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );

  } catch (error) {
    console.error('Custom AI recognition error:', error);
    return new Response(
      JSON.stringify({
        success: false,
        error: error.message,
        provider: 'custom'
      }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});
