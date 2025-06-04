
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"

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
    const { image } = await req.json();

    if (!image) {
      return new Response(
        JSON.stringify({ error: 'No image provided' }),
        { 
          status: 400, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    // For demo purposes, return mock AI analysis results
    // In production, this would call OpenAI Vision API or similar service
    
    const mockResults = {
      success: true,
      name: "Morgan Silver Dollar",
      year: 1921,
      country: "United States",
      rarity: "Common",
      grade: "MS-63",
      estimated_value: 85,
      confidence: 0.92,
      description: "Morgan Silver Dollar minted in 1921, commonly found in good condition. Features Liberty head on obverse and eagle on reverse.",
      composition: "90% Silver, 10% Copper",
      diameter: 38.1,
      weight: 26.73,
      mint: "Philadelphia"
    };

    // Simulate processing time
    await new Promise(resolve => setTimeout(resolve, 2000));

    console.log('AI coin recognition completed for image');

    return new Response(
      JSON.stringify(mockResults),
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
