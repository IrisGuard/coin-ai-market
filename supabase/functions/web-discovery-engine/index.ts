
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

    console.log('Starting web discovery for:', coinData.name);

    // Generate search queries for different platforms
    const searchQueries = generateSearchQueries(coinData);
    const discoveryResults = [];

    // eBay Global Search
    if (sources.includes('ebay_global')) {
      const ebayResults = await searchEbayGlobal(searchQueries, coinData);
      discoveryResults.push(...ebayResults);
    }

    // Heritage Auctions Search
    if (sources.includes('heritage')) {
      const heritageResults = await searchHeritage(searchQueries, coinData);
      discoveryResults.push(...heritageResults);
    }

    // Numista Search
    if (sources.includes('numista')) {
      const numistaResults = await searchNumista(searchQueries, coinData);
      discoveryResults.push(...numistaResults);
    }

    // PCGS/NGC Population Data
    if (sources.includes('pcgs') || sources.includes('ngc')) {
      const populationResults = await searchPopulationData(searchQueries, coinData);
      discoveryResults.push(...populationResults);
    }

    // CoinWorld and other numismatic sites
    if (sources.includes('coinworld')) {
      const coinworldResults = await searchCoinWorld(searchQueries, coinData);
      discoveryResults.push(...coinworldResults);
    }

    // Save results to database
    for (const result of discoveryResults.slice(0, maxResults)) {
      await supabase
        .from('web_discovery_results')
        .insert({
          analysis_id: analysisId,
          source_url: result.sourceUrl,
          source_type: result.sourceType,
          coin_match_confidence: result.confidence,
          price_data: result.priceData,
          auction_data: result.auctionData,
          image_urls: result.imageUrls,
          extracted_data: result.extractedData
        });
    }

    console.log(`Web discovery completed: ${discoveryResults.length} results found`);

    return new Response(
      JSON.stringify({
        success: true,
        resultsFound: discoveryResults.length,
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

function generateSearchQueries(coinData: any): string[] {
  const queries = [];
  
  // Basic query
  queries.push(`${coinData.name} ${coinData.year}`);
  
  // Detailed query
  queries.push(`${coinData.year} ${coinData.country} ${coinData.denomination}`);
  
  // Grade-specific query
  if (coinData.grade) {
    queries.push(`${coinData.name} ${coinData.year} ${coinData.grade}`);
  }
  
  // Error coin queries
  if (coinData.errors && coinData.errors.length > 0) {
    for (const error of coinData.errors) {
      queries.push(`${coinData.year} ${coinData.denomination} ${error}`);
    }
  }
  
  // Mint mark query
  if (coinData.mint) {
    queries.push(`${coinData.name} ${coinData.year} ${coinData.mint}`);
  }

  return queries;
}

async function searchEbayGlobal(queries: string[], coinData: any) {
  const results = [];
  const ebayDomains = [
    'ebay.com', 'ebay.co.uk', 'ebay.de', 'ebay.fr', 'ebay.it', 
    'ebay.es', 'ebay.ca', 'ebay.com.au', 'ebay.co.jp'
  ];

  for (const domain of ebayDomains) {
    for (const query of queries.slice(0, 2)) { // Limit queries per domain
      try {
        const searchUrl = `https://www.${domain}/sch/i.html?_nkw=${encodeURIComponent(query)}&_sacat=11116`;
        
        // Note: In production, you'd use a proper web scraping service
        // For now, we'll simulate the search
        const mockResult = {
          sourceUrl: searchUrl,
          sourceType: 'ebay',
          confidence: Math.random() * 0.3 + 0.7, // 0.7-1.0
          priceData: {
            current_price: Math.round(coinData.estimated_value * (0.8 + Math.random() * 0.4)),
            currency: getDomainCurrency(domain)
          },
          auctionData: {
            type: Math.random() > 0.5 ? 'auction' : 'buy_it_now',
            end_time: new Date(Date.now() + Math.random() * 7 * 24 * 60 * 60 * 1000).toISOString()
          },
          imageUrls: [],
          extractedData: {
            title: `${coinData.name} ${coinData.year}`,
            seller_location: getDomainCountry(domain),
            condition: coinData.grade
          }
        };
        
        results.push(mockResult);
      } catch (error) {
        console.warn(`Failed to search ${domain}:`, error);
      }
    }
  }

  return results;
}

async function searchHeritage(queries: string[], coinData: any) {
  const results = [];
  
  for (const query of queries.slice(0, 3)) {
    try {
      // Simulate Heritage Auctions search
      const mockResult = {
        sourceUrl: `https://coins.ha.com/c/search-results.zx?N=0&Nty=1&Ntt=${encodeURIComponent(query)}`,
        sourceType: 'heritage',
        confidence: Math.random() * 0.2 + 0.8, // 0.8-1.0 (Heritage is very reliable)
        priceData: {
          realized_price: Math.round(coinData.estimated_value * (1.1 + Math.random() * 0.3)),
          currency: 'USD'
        },
        auctionData: {
          type: 'auction',
          lot_number: Math.floor(Math.random() * 10000),
          sale_date: new Date(Date.now() - Math.random() * 365 * 24 * 60 * 60 * 1000).toISOString()
        },
        imageUrls: [],
        extractedData: {
          title: `${coinData.name} ${coinData.year}`,
          grade: coinData.grade,
          certification: Math.random() > 0.5 ? 'PCGS' : 'NGC'
        }
      };
      
      results.push(mockResult);
    } catch (error) {
      console.warn('Failed to search Heritage:', error);
    }
  }

  return results;
}

async function searchNumista(queries: string[], coinData: any) {
  const results = [];
  
  try {
    // Simulate Numista search for reference data
    const mockResult = {
      sourceUrl: `https://en.numista.com/catalogue/pieces.php?co=&cn=${encodeURIComponent(coinData.country)}&y=${coinData.year}`,
      sourceType: 'numista',
      confidence: 0.95, // Very high confidence for reference data
      priceData: {
        reference_value: coinData.estimated_value,
        currency: 'USD'
      },
      auctionData: {},
      imageUrls: [],
      extractedData: {
        title: coinData.name,
        composition: coinData.composition,
        diameter: coinData.diameter,
        weight: coinData.weight,
        mintage: Math.floor(Math.random() * 1000000),
        reference_notes: 'Numista reference entry'
      }
    };
    
    results.push(mockResult);
  } catch (error) {
    console.warn('Failed to search Numista:', error);
  }

  return results;
}

async function searchPopulationData(queries: string[], coinData: any) {
  const results = [];
  
  if (coinData.grade && (coinData.grade.includes('MS') || coinData.grade.includes('PF'))) {
    try {
      // Simulate PCGS/NGC population data
      const mockResult = {
        sourceUrl: `https://www.pcgs.com/population`,
        sourceType: 'pcgs',
        confidence: 0.9,
        priceData: {
          price_guide: coinData.estimated_value,
          currency: 'USD'
        },
        auctionData: {},
        imageUrls: [],
        extractedData: {
          title: `${coinData.name} ${coinData.year}`,
          grade: coinData.grade,
          population_higher: Math.floor(Math.random() * 100),
          population_same: Math.floor(Math.random() * 500),
          total_graded: Math.floor(Math.random() * 10000)
        }
      };
      
      results.push(mockResult);
    } catch (error) {
      console.warn('Failed to search population data:', error);
    }
  }

  return results;
}

async function searchCoinWorld(queries: string[], coinData: any) {
  const results = [];
  
  try {
    // Simulate CoinWorld search for market news and trends
    const mockResult = {
      sourceUrl: `https://www.coinworld.com/search?q=${encodeURIComponent(queries[0])}`,
      sourceType: 'coinworld',
      confidence: 0.7,
      priceData: {},
      auctionData: {},
      imageUrls: [],
      extractedData: {
        title: `Market analysis: ${coinData.name}`,
        market_trend: Math.random() > 0.5 ? 'rising' : 'stable',
        article_date: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString(),
        content_type: 'market_analysis'
      }
    };
    
    results.push(mockResult);
  } catch (error) {
    console.warn('Failed to search CoinWorld:', error);
  }

  return results;
}

function getDomainCurrency(domain: string): string {
  const currencyMap: Record<string, string> = {
    'ebay.com': 'USD',
    'ebay.co.uk': 'GBP',
    'ebay.de': 'EUR',
    'ebay.fr': 'EUR',
    'ebay.it': 'EUR',
    'ebay.es': 'EUR',
    'ebay.ca': 'CAD',
    'ebay.com.au': 'AUD',
    'ebay.co.jp': 'JPY'
  };
  return currencyMap[domain] || 'USD';
}

function getDomainCountry(domain: string): string {
  const countryMap: Record<string, string> = {
    'ebay.com': 'United States',
    'ebay.co.uk': 'United Kingdom',
    'ebay.de': 'Germany',
    'ebay.fr': 'France',
    'ebay.it': 'Italy',
    'ebay.es': 'Spain',
    'ebay.ca': 'Canada',
    'ebay.com.au': 'Australia',
    'ebay.co.jp': 'Japan'
  };
  return countryMap[domain] || 'Unknown';
}
