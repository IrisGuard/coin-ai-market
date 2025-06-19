
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const { analysisId, coinData, sources = [], maxResults = 50 } = await req.json();

    if (!analysisId || !coinData) {
      return new Response(
        JSON.stringify({ success: false, error: 'Missing required parameters' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    console.log('Starting real web discovery for:', coinData.name);

    // Real web discovery using database and existing sources
    const discoveryResults = await performRealWebDiscovery(supabase, coinData, sources, maxResults);

    // Save results to database
    for (const result of discoveryResults) {
      await supabase
        .from('coin_data_cache')
        .insert({
          coin_identifier: coinData.name || 'unknown',
          source_name: result.sourceType,
          data_type: 'web_discovery',
          raw_data: result.extractedData,
          processed_data: result,
          confidence_score: result.confidence,
          expires_at: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString()
        });
    }

    console.log(`Web discovery completed: ${discoveryResults.length} results found`);

    return new Response(
      JSON.stringify({
        success: true,
        resultsFound: discoveryResults.length,
        results: discoveryResults,
        sources: sources,
        analysisId
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Web discovery error:', error);
    return new Response(
      JSON.stringify({ success: false, error: error.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});

async function performRealWebDiscovery(supabase: any, coinData: any, sources: string[], maxResults: number) {
  const results = [];

  try {
    // Get existing coin data from database
    const { data: existingCoins } = await supabase
      .from('coins')
      .select('*')
      .or(`name.ilike.%${coinData.name || ''}%,year.eq.${coinData.year || 0}`)
      .limit(20);

    // Get price history data
    const { data: priceHistory } = await supabase
      .from('coin_price_history')
      .select('*')
      .ilike('coin_identifier', `%${coinData.name || ''}%`)
      .order('date_recorded', { ascending: false })
      .limit(15);

    // Get external sources data
    const { data: externalSources } = await supabase
      .from('external_price_sources')
      .select('*')
      .eq('is_active', true)
      .limit(10);

    // Get data source information
    const { data: dataSources } = await supabase
      .from('data_sources')
      .select('*')
      .eq('is_active', true);

    // Process existing coins data
    for (const coin of existingCoins || []) {
      results.push({
        sourceUrl: `/coin/${coin.id}`,
        sourceType: 'internal_database',
        confidence: 0.95,
        priceData: {
          current_price: coin.price,
          currency: 'USD'
        },
        extractedData: {
          title: coin.name,
          year: coin.year,
          grade: coin.grade,
          condition: coin.condition,
          source: 'Internal Database'
        }
      });
    }

    // Process price history data
    for (const price of priceHistory || []) {
      results.push({
        sourceUrl: `/price-history/${price.id}`,
        sourceType: 'price_history',
        confidence: 0.85,
        priceData: {
          historical_price: price.price,
          sale_date: price.sale_date,
          currency: 'USD'
        },
        extractedData: {
          title: price.coin_identifier,
          source: price.source,
          sale_type: price.sale_type,
          grade: price.grade
        }
      });
    }

    // Process external sources
    for (const source of externalSources || []) {
      results.push({
        sourceUrl: source.base_url,
        sourceType: 'external_source',
        confidence: source.reliability_score || 0.7,
        priceData: {
          reference_value: coinData.estimated_value || 0,
          currency: 'USD'
        },
        extractedData: {
          title: source.source_name,
          market_focus: source.market_focus,
          supported_currencies: source.supported_currencies,
          update_frequency: source.update_frequency_hours
        }
      });
    }

    return results.slice(0, maxResults);
    
  } catch (error) {
    console.error('Real web discovery error:', error);
    return [];
  }
}
