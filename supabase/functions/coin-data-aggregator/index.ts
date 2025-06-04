
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    const { coin_identifier, include_sources } = await req.json();

    console.log(`Aggregating data for coin: ${coin_identifier}`);

    // Get data from multiple sources
    const sources = ['static_db', 'coinapi', 'numista', 'scraping_cache'];
    const aggregatedData: any = {
      coin_identifier,
      sources_used: [],
      confidence_score: 0,
      data: {}
    };

    // 1. Check static database first
    if (sources.includes('static_db')) {
      const { data: staticData } = await supabase
        .from('static_coins_db')
        .select('*')
        .ilike('name', `%${coin_identifier}%`)
        .limit(1)
        .single();

      if (staticData) {
        aggregatedData.sources_used.push('static_database');
        aggregatedData.data.static = staticData;
        aggregatedData.confidence_score += 0.3;
      }
    }

    // 2. Check cached scraping data
    if (sources.includes('scraping_cache')) {
      const { data: cachedData } = await supabase
        .from('coin_data_cache')
        .select('*')
        .ilike('coin_identifier', `%${coin_identifier}%`)
        .order('last_updated', { ascending: false })
        .limit(3);

      if (cachedData && cachedData.length > 0) {
        aggregatedData.sources_used.push('web_scraping');
        aggregatedData.data.scraped = cachedData;
        aggregatedData.confidence_score += 0.2 * cachedData.length;
      }
    }

    // 3. Try CoinAPI (if API key available)
    const coinApiKey = Deno.env.get('COINAPI_KEY');
    if (sources.includes('coinapi') && coinApiKey) {
      try {
        const coinApiResponse = await fetch(`https://rest.coinapi.io/v1/exchangerate/USD/USD`, {
          headers: {
            'X-CoinAPI-Key': coinApiKey
          }
        });
        
        if (coinApiResponse.ok) {
          const coinApiData = await coinApiResponse.json();
          aggregatedData.sources_used.push('coinapi');
          aggregatedData.data.market = coinApiData;
          aggregatedData.confidence_score += 0.25;
        }
      } catch (error) {
        console.log('CoinAPI error:', error.message);
      }
    }

    // 4. Try Numista API
    if (sources.includes('numista')) {
      try {
        const numistaResponse = await fetch(`https://api.numista.com/v3/coins?q=${encodeURIComponent(coin_identifier)}&limit=1`, {
          headers: {
            'User-Agent': 'CoinVision-AI/1.0'
          }
        });
        
        if (numistaResponse.ok) {
          const numistaData = await numistaResponse.json();
          if (numistaData.count > 0) {
            aggregatedData.sources_used.push('numista');
            aggregatedData.data.specifications = numistaData.coins[0];
            aggregatedData.confidence_score += 0.2;
          }
        }
      } catch (error) {
        console.log('Numista API error:', error.message);
      }
    }

    // Calculate final confidence score
    aggregatedData.confidence_score = Math.min(aggregatedData.confidence_score, 1.0);

    // Merge and process data
    const processedData = mergeAndProcessData(aggregatedData.data);
    
    console.log(`Data aggregation completed for ${coin_identifier}. Sources used: ${aggregatedData.sources_used.join(', ')}`);

    return new Response(JSON.stringify({
      success: true,
      coin_identifier,
      sources_used: aggregatedData.sources_used,
      confidence_score: aggregatedData.confidence_score,
      data: processedData,
      raw_data: aggregatedData.data
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Data aggregation error:', error);
    
    return new Response(JSON.stringify({ 
      error: 'Data aggregation failed', 
      details: error.message 
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});

function mergeAndProcessData(sourceData: any): any {
  const merged: any = {
    name: null,
    year: null,
    country: null,
    denomination: null,
    composition: null,
    diameter: null,
    weight: null,
    estimated_value: null,
    current_market_price: null,
    grade: null,
    rarity: null,
    mintage: null
  };

  // Priority: static DB > numista > scraped data > market data
  
  // From static database
  if (sourceData.static) {
    merged.name = sourceData.static.name;
    merged.country = sourceData.static.country;
    merged.denomination = sourceData.static.denomination;
    merged.composition = sourceData.static.composition;
    merged.diameter = sourceData.static.diameter;
    merged.weight = sourceData.static.weight;
    merged.year = sourceData.static.year_start;
    merged.estimated_value = sourceData.static.base_value;
    merged.mintage = sourceData.static.mintage;
  }

  // From Numista (override if more specific)
  if (sourceData.specifications) {
    const spec = sourceData.specifications;
    if (spec.title) merged.name = spec.title;
    if (spec.min_year) merged.year = spec.min_year;
    if (spec.country) merged.country = spec.country.name;
    if (spec.value) merged.denomination = `${spec.value} ${spec.currency}`;
  }

  // From scraped data (fill gaps)
  if (sourceData.scraped && sourceData.scraped.length > 0) {
    const scrapeData = sourceData.scraped[0].processed_data;
    if (!merged.name && scrapeData.name) merged.name = scrapeData.name;
    if (!merged.year && scrapeData.year) merged.year = scrapeData.year;
    if (!merged.estimated_value && scrapeData.estimated_value) merged.estimated_value = scrapeData.estimated_value;
    if (scrapeData.grade) merged.grade = scrapeData.grade;
  }

  // From market data
  if (sourceData.market) {
    merged.current_market_price = sourceData.market.rate || merged.estimated_value;
  }

  return merged;
}
