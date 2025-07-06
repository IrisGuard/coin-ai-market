import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.7.1';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_KEY')!;
const supabase = createClient(supabaseUrl, supabaseServiceKey);

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const { 
      coinData, 
      maxSources = 50, 
      timeout = 30000,
      includeForums = true,
      includeMarketplaces = true 
    } = await req.json();
    
    if (!coinData) {
      throw new Error('No coin data provided for web discovery');
    }

    console.log('🕷️ Web Discovery Engine Starting');
    console.log('Coin Data:', coinData);
    console.log('Max Sources:', maxSources);

    const startTime = Date.now();
    const sessionId = generateSessionId();
    
    // Phase 1: Get Active Sources from Database
    const activeSources = await getActiveSources(maxSources);
    
    // Phase 2: Parallel Web Discovery
    const discoveryResults = await performParallelDiscovery(
      activeSources, 
      coinData, 
      timeout
    );
    
    // Phase 3: Auto-Discovery of New Sources
    const newSources = await autoDiscoverNewSources(coinData, discoveryResults);
    
    // Phase 4: Aggregate and Analyze Results
    const analysis = await analyzeDiscoveryResults(discoveryResults);
    
    // Phase 5: Update Source Performance
    await updateSourcePerformance(discoveryResults);
    
    // Phase 6: Save Discovery Session
    await saveDiscoverySession(sessionId, coinData, discoveryResults, analysis);
    
    const processingTime = Date.now() - startTime;
    
    console.log('✅ Web Discovery Complete');
    console.log('Sources Attempted:', activeSources.length);
    console.log('Successful Sources:', discoveryResults.filter(r => r.success).length);
    console.log('New Sources Found:', newSources.length);
    console.log('Processing Time:', processingTime + 'ms');

    return new Response(JSON.stringify({
      success: true,
      discovery_results: {
        session_id: sessionId,
        sources_attempted: activeSources.length,
        sources_successful: discoveryResults.filter(r => r.success).length,
        new_sources_discovered: newSources.length,
        price_data: analysis.priceData,
        similar_coins: analysis.similarCoins,
        market_trends: analysis.marketTrends,
        processing_time: processingTime
      },
      raw_results: discoveryResults.filter(r => r.success).slice(0, 10), // Top 10 for debugging
      new_sources: newSources
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });

  } catch (error) {
    console.error('💥 Web Discovery Engine Error:', error);
    return new Response(JSON.stringify({
      success: false,
      error: 'Web Discovery Engine failed',
      message: error.message
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  }
});

// Phase 3 Enhanced: Get active sources with comprehensive prioritization
async function getActiveSources(maxSources: number) {
  const { data: sources } = await supabase
    .from('global_coin_sources')
    .select('*')
    .eq('is_active', true)
    .order('priority', { ascending: true })
    .order('success_rate', { ascending: false })
    .limit(maxSources);

  console.log(`🎯 Phase 3 Enhanced: Retrieved ${sources?.length || 0} active sources from 139+ comprehensive database`);
  console.log(`Sources breakdown: Tier 1: ${sources?.filter(s => s.priority === 1).length || 0}, Tier 2: ${sources?.filter(s => s.priority === 2).length || 0}, Specialized: ${sources?.filter(s => s.priority >= 3).length || 0}`);
  
  return sources || [];
}

// Perform parallel web discovery across all sources
async function performParallelDiscovery(sources: any[], coinData: any, timeout: number) {
  const discoveries = sources.map(source => 
    performSingleSourceDiscovery(source, coinData, timeout)
  );

  // Execute all discoveries in parallel with timeout
  const results = await Promise.allSettled(discoveries);
  
  return results.map((result, index) => ({
    source: sources[index],
    success: result.status === 'fulfilled' && result.value.success,
    data: result.status === 'fulfilled' ? result.value.data : null,
    error: result.status === 'rejected' ? result.reason.message : null,
    response_time: result.status === 'fulfilled' ? result.value.response_time : timeout
  }));
}

// Discover data from a single source
async function performSingleSourceDiscovery(source: any, coinData: any, timeout: number) {
  const startTime = Date.now();
  
  try {
    // Build search queries based on coin data
    const searchQueries = buildSearchQueries(coinData);
    
    // Try different search strategies
    for (const query of searchQueries) {
      const result = await searchSource(source, query, timeout);
      
      if (result.found) {
        return {
          success: true,
          data: result.data,
          response_time: Date.now() - startTime,
          query_used: query
        };
      }
    }
    
    // No results found with any query
    return {
      success: false,
      data: null,
      response_time: Date.now() - startTime,
      error: 'No matching coins found'
    };
    
  } catch (error) {
    return {
      success: false,
      data: null,
      response_time: Date.now() - startTime,
      error: error.message
    };
  }
}

// Build multiple search queries for better discovery
function buildSearchQueries(coinData: any) {
  const queries = [];
  
  // Primary query with all known data
  if (coinData.country && coinData.year && coinData.denomination) {
    queries.push(`${coinData.country} ${coinData.year} ${coinData.denomination}`);
  }
  
  // Secondary queries with partial data
  if (coinData.year && coinData.denomination) {
    queries.push(`${coinData.year} ${coinData.denomination} coin`);
  }
  
  if (coinData.name) {
    queries.push(coinData.name);
  }
  
  // Error coin specific queries
  if (coinData.error_types && coinData.error_types.length > 0) {
    queries.push(`${coinData.country} ${coinData.year} error coin ${coinData.error_types[0]}`);
  }
  
  // Fallback query
  if (coinData.country) {
    queries.push(`${coinData.country} coin ${coinData.year || ''}`);
  }
  
  return queries.filter(q => q.trim().length > 0);
}

// Search a specific source with anti-detection
async function searchSource(source: any, query: string, timeout: number) {
  // Use url-reader function for basic web scraping
  const searchUrl = buildSourceSearchUrl(source, query);
  
  if (!searchUrl) {
    throw new Error(`Cannot build search URL for ${source.source_name}`);
  }

  try {
    // Call url-reader function to get page content
    const response = await fetch(`${supabaseUrl}/functions/v1/url-reader`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${supabaseServiceKey}`
      },
      body: JSON.stringify({ url: searchUrl }),
      signal: AbortSignal.timeout(timeout)
    });

    if (!response.ok) {
      throw new Error(`Failed to read ${source.source_name}: ${response.status}`);
    }

    const pageData = await response.json();
    
    if (!pageData.success) {
      throw new Error(`Failed to scrape ${source.source_name}: ${pageData.error}`);
    }

    // Extract coin data from page content
    const extractedData = await extractCoinDataFromContent(pageData.content, query);
    
    return {
      found: extractedData.coins.length > 0,
      data: extractedData
    };
    
  } catch (error) {
    throw new Error(`Source discovery failed for ${source.source_name}: ${error.message}`);
  }
}

// Phase 3 Enhanced: Build search URLs for 139+ comprehensive source types
function buildSourceSearchUrl(source: any, query: string) {
  const encodedQuery = encodeURIComponent(query);
  
  // Enhanced URL patterns for comprehensive source types
  switch (source.source_type) {
    case 'auction_house':
      if (source.base_url.includes('heritage.com')) {
        return `${source.base_url}/search?query=${encodedQuery}`;
      }
      if (source.base_url.includes('stacksbowers.com')) {
        return `${source.base_url}/search?q=${encodedQuery}`;
      }
      if (source.base_url.includes('liveauctioneers.com')) {
        return `${source.base_url}/search/?keyword=${encodedQuery}`;
      }
      if (source.base_url.includes('invaluable.com')) {
        return `${source.base_url}/search/?q=${encodedQuery}`;
      }
      break;
      
    case 'marketplace':
      if (source.base_url.includes('ebay.com')) {
        return `${source.base_url}/sch/i.html?_nkw=${encodedQuery}`;
      }
      if (source.base_url.includes('tradera.com')) {
        return `${source.base_url}/search?q=${encodedQuery}`;
      }
      if (source.base_url.includes('bonanza.com')) {
        return `${source.base_url}/search?q=${encodedQuery}`;
      }
      if (source.base_url.includes('vinted.com')) {
        return `${source.base_url}/catalog?search_text=${encodedQuery}`;
      }
      break;
      
    case 'dealer':
      if (source.base_url.includes('apmex.com')) {
        return `${source.base_url}/search?q=${encodedQuery}`;
      }
      if (source.base_url.includes('moderncoinmart.com')) {
        return `${source.base_url}/search/?query=${encodedQuery}`;
      }
      if (source.base_url.includes('jmbullion.com')) {
        return `${source.base_url}/search?q=${encodedQuery}`;
      }
      break;
      
    case 'grading_service':
      if (source.base_url.includes('pcgs.com')) {
        return `${source.base_url}/coinfacts/search/?searchtype=basic&searchtext=${encodedQuery}`;
      }
      if (source.base_url.includes('ngccoin.com')) {
        return `${source.base_url}/coin-explorer/search?q=${encodedQuery}`;
      }
      if (source.base_url.includes('anacs.com')) {
        return `${source.base_url}/search?q=${encodedQuery}`;
      }
      break;
      
    case 'mint':
      if (source.base_url.includes('royalmint.com')) {
        return `${source.base_url}/search?q=${encodedQuery}`;
      }
      if (source.base_url.includes('perthmint.com')) {
        return `${source.base_url}/search?searchTerm=${encodedQuery}`;
      }
      if (source.base_url.includes('mint.ca')) {
        return `${source.base_url}/en/search?q=${encodedQuery}`;
      }
      break;
      
    case 'database':
      if (source.base_url.includes('numista.com')) {
        return `${source.base_url}/catalogue/index.php?mode=simplifie&p=1&l=&r=&e=&d=&ca=3&no=&i=&b=&v=&m=&a=&t=&dg=&w=&u=&f=&g=&c=${encodedQuery}`;
      }
      break;
      
    case 'forum':
      return `${source.base_url}/search/?q=${encodedQuery}`;
      
    default:
      return `${source.base_url}/search?q=${encodedQuery}`;
  }
  
  return null;
}

// Extract coin data from web page content using AI
async function extractCoinDataFromContent(content: string, originalQuery: string) {
  const anthropicApiKey = Deno.env.get('ANTHROPIC_API_KEY');
  
  if (!anthropicApiKey || content.length < 100) {
    return { coins: [], prices: [], similar_coins: [] };
  }

  const extractionPrompt = `
Analyze this webpage content for coin-related information. The original search was for: "${originalQuery}"

Extract:
1. Coin prices (any monetary values associated with coins)
2. Coin descriptions (names, dates, conditions, grades)
3. Similar or related coins mentioned
4. Market trends or pricing information

Respond in JSON format:
{
  "coins": [{"name": "coin name", "price": 123.50, "grade": "MS65", "year": 1975}],
  "prices": [123.50, 200.00, 89.99],
  "similar_coins": ["similar coin 1", "similar coin 2"],
  "market_trends": ["trend 1", "trend 2"]
}

Content to analyze: ${content.substring(0, 2000)}...
`;

  try {
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': anthropicApiKey,
        'anthropic-version': '2023-06-01'
      },
      body: JSON.stringify({
        model: 'claude-sonnet-4-20250514',
        max_tokens: 1000,
        messages: [{
          role: 'user',
          content: extractionPrompt
        }]
      })
    });

    if (response.ok) {
      const result = await response.json();
      const extractedContent = result.content[0]?.text;
      
      try {
        const jsonMatch = extractedContent.match(/\{[\s\S]*\}/);
        const extractedData = jsonMatch ? JSON.parse(jsonMatch[0]) : JSON.parse(extractedContent);
        return extractedData;
      } catch {
        // Fallback to basic extraction
        return extractBasicData(content, originalQuery);
      }
    }
  } catch (error) {
    console.warn('AI extraction failed, using basic extraction:', error);
  }

  return extractBasicData(content, originalQuery);
}

// Basic data extraction fallback
function extractBasicData(content: string, query: string) {
  const priceRegex = /\$[\d,]+\.?\d*/g;
  const prices = content.match(priceRegex)?.map(p => parseFloat(p.replace(/[$,]/g, ''))) || [];
  
  return {
    coins: [],
    prices: prices.filter(p => p > 0 && p < 100000), // Reasonable price range
    similar_coins: [],
    market_trends: []
  };
}

// Auto-discover new coin sources
async function autoDiscoverNewSources(coinData: any, discoveryResults: any[]) {
  // This would implement automatic discovery of new coin-related websites
  // For now, returning empty array as placeholder
  return [];
}

// Analyze all discovery results
async function analyzeDiscoveryResults(discoveryResults: any[]) {
  const successfulResults = discoveryResults.filter(r => r.success && r.data);
  
  // Aggregate price data
  const allPrices: number[] = [];
  const similarCoins: string[] = [];
  const marketTrends: string[] = [];
  
  for (const result of successfulResults) {
    if (result.data.prices) {
      allPrices.push(...result.data.prices);
    }
    if (result.data.similar_coins) {
      similarCoins.push(...result.data.similar_coins);
    }
    if (result.data.market_trends) {
      marketTrends.push(...result.data.market_trends);
    }
  }
  
  const priceData = allPrices.length > 0 ? {
    average: allPrices.reduce((a, b) => a + b, 0) / allPrices.length,
    min: Math.min(...allPrices),
    max: Math.max(...allPrices),
    count: allPrices.length
  } : null;
  
  return {
    priceData,
    similarCoins: [...new Set(similarCoins)].slice(0, 10),
    marketTrends: [...new Set(marketTrends)].slice(0, 5)
  };
}

// Update source performance metrics
async function updateSourcePerformance(discoveryResults: any[]) {
  for (const result of discoveryResults) {
    const { source, success, response_time } = result;
    
    try {
      await supabase.rpc('update_source_success_rate', {
        source_url: source.base_url,
        was_successful: success,
        response_time: response_time
      });
    } catch (error) {
      console.warn(`Failed to update performance for ${source.source_name}:`, error);
    }
  }
}

// Save discovery session to database
async function saveDiscoverySession(
  sessionId: string, 
  coinData: any, 
  discoveryResults: any[], 
  analysis: any
) {
  try {
    await supabase
      .from('web_discovery_sessions')
      .insert({
        session_id: sessionId,
        coin_query: coinData,
        sources_attempted: discoveryResults.length,
        sources_successful: discoveryResults.filter(r => r.success).length,
        results_found: analysis,
        processing_time_ms: Date.now()
      });

    console.log('✅ Discovery session saved');
  } catch (error) {
    console.warn('⚠️ Failed to save discovery session:', error);
  }
}

function generateSessionId(): string {
  return `discovery_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}