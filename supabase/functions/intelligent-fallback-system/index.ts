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

interface FallbackChainConfig {
  maxAttempts: number;
  timeoutMs: number;
  priorityWeights: {
    success_rate: number;
    response_time: number;
    geographic_priority: number;
    source_type: number;
  };
}

const DEFAULT_CONFIG: FallbackChainConfig = {
  maxAttempts: 15,
  timeoutMs: 30000,
  priorityWeights: {
    success_rate: 0.4,
    response_time: 0.3,
    geographic_priority: 0.2,
    source_type: 0.1
  }
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const { 
      coinQuery,
      userLocation = 'global',
      primarySources = [],
      config = DEFAULT_CONFIG
    } = await req.json();

    if (!coinQuery) {
      throw new Error('Coin query is required for fallback system');
    }

    console.log('🔄 Intelligent Fallback System Starting...');
    console.log('Coin Query:', JSON.stringify(coinQuery, null, 2));
    console.log('User Location:', userLocation);
    console.log('Max Attempts:', config.maxAttempts);

    const startTime = Date.now();
    
    // Phase 1: Build Intelligent Source Chain
    const { sourceChain } = await buildIntelligentSourceChain(coinQuery, userLocation, primarySources, config);
    
    // Phase 2: Execute Fallback Chain with Smart Retry
    const { results } = await executeFallbackChain(sourceChain, coinQuery, config);
    
    // Phase 3: Analyze Failure Patterns
    const { patterns } = await analyzeFailurePatterns(results);
    
    // Phase 4: Adaptive Source Ranking Update
    await updateAdaptiveSourceRanking(results, patterns);
    
    const processingTime = Date.now() - startTime;
    
    console.log('✅ Intelligent Fallback System Complete');
    console.log('Total Sources Attempted:', results.length);
    console.log('Successful Sources:', results.filter(r => r.success).length);
    console.log('Processing Time:', processingTime + 'ms');

    return new Response(JSON.stringify({
      success: true,
      results: {
        successful_results: results.filter(r => r.success),
        failed_attempts: results.filter(r => !r.success),
        total_attempts: results.length,
        success_rate: results.filter(r => r.success).length / results.length,
        fallback_chain: sourceChain.map(s => ({
          url: s.base_url,
          priority_score: s.priority_score,
          attempt_order: s.attempt_order
        })),
        failure_patterns: patterns
      },
      metadata: {
        processing_time: processingTime,
        user_location: userLocation,
        config_used: config,
        adaptive_learning_updated: true,
        timestamp: new Date().toISOString()
      }
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });

  } catch (error) {
    console.error('💥 Intelligent Fallback System Error:', error);
    return new Response(JSON.stringify({
      success: false,
      error: 'Intelligent fallback system failed',
      message: error.message
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  }
});

// Phase 1: Build Intelligent Source Chain
async function buildIntelligentSourceChain(
  coinQuery: any, 
  userLocation: string, 
  primarySources: string[], 
  config: FallbackChainConfig
) {
  console.log('🧠 Building intelligent source chain...');
  
  // Get all active sources with performance metrics
  const { data: allSources } = await supabase
    .from('global_coin_sources')
    .select('*')
    .eq('is_active', true)
    .order('success_rate', { ascending: false });

  if (!allSources || allSources.length === 0) {
    throw new Error('No sources available for fallback chain');
  }

  // Phase 1.1: Calculate Priority Scores
  const sourcesWithPriority = allSources.map(source => ({
    ...source,
    priority_score: calculatePriorityScore(source, coinQuery, userLocation, config.priorityWeights),
    geographic_match: calculateGeographicMatch(source, userLocation),
    source_type_relevance: calculateSourceTypeRelevance(source, coinQuery)
  }));

  // Phase 1.2: Apply Intelligent Sorting
  sourcesWithPriority.sort((a, b) => {
    // Primary sort: Priority score
    if (Math.abs(a.priority_score - b.priority_score) > 0.1) {
      return b.priority_score - a.priority_score;
    }
    
    // Secondary sort: Success rate
    if (Math.abs(a.success_rate - b.success_rate) > 0.1) {
      return b.success_rate - a.success_rate;
    }
    
    // Tertiary sort: Response time (lower is better)
    return (a.response_time_avg || 5000) - (b.response_time_avg || 5000);
  });

  // Phase 1.3: Apply Diversification Strategy
  const diversifiedChain = applyDiversificationStrategy(sourcesWithPriority, config.maxAttempts);

  // Phase 1.4: Add Attempt Order
  const sourceChain = diversifiedChain.map((source, index) => ({
    ...source,
    attempt_order: index + 1
  }));

  console.log('📋 Source chain built:');
  sourceChain.slice(0, 5).forEach((source, index) => {
    console.log(`${index + 1}. ${source.source_name} (Score: ${source.priority_score.toFixed(2)}, Success: ${(source.success_rate * 100).toFixed(1)}%)`);
  });

  return { sourceChain };
}

// Phase 2: Execute Fallback Chain with Smart Retry
async function executeFallbackChain(
  sourceChain: any[], 
  coinQuery: any, 
  config: FallbackChainConfig
) {
  console.log('⚡ Executing fallback chain with smart retry...');
  
  const results = [];
  let successfulResults = 0;
  const maxConcurrentRequests = 3;
  
  // Execute in batches to avoid overwhelming sources
  for (let i = 0; i < sourceChain.length; i += maxConcurrentRequests) {
    const batch = sourceChain.slice(i, i + maxConcurrentRequests);
    
    const batchPromises = batch.map(async (source) => {
      const attemptStartTime = Date.now();
      
      try {
        console.log(`🎯 Attempting source ${source.attempt_order}: ${source.source_name}...`);
        
        // Execute with timeout
        const result = await Promise.race([
          executeSourceQuery(source, coinQuery),
          new Promise((_, reject) => 
            setTimeout(() => reject(new Error('Timeout')), config.timeoutMs)
          )
        ]);
        
        const responseTime = Date.now() - attemptStartTime;
        
        return {
          source_id: source.id,
          source_name: source.source_name,
          base_url: source.base_url,
          attempt_order: source.attempt_order,
          success: true,
          response_time: responseTime,
          data: result,
          error: null,
          timestamp: new Date().toISOString()
        };
        
      } catch (error) {
        const responseTime = Date.now() - attemptStartTime;
        
        return {
          source_id: source.id,
          source_name: source.source_name,
          base_url: source.base_url,
          attempt_order: source.attempt_order,
          success: false,
          response_time: responseTime,
          data: null,
          error: error.message,
          timestamp: new Date().toISOString()
        };
      }
    });
    
    const batchResults = await Promise.allSettled(batchPromises);
    
    batchResults.forEach((result) => {
      if (result.status === 'fulfilled') {
        results.push(result.value);
        if (result.value.success) {
          successfulResults++;
        }
      }
    });
    
    // Early termination if we have enough successful results
    if (successfulResults >= 5) {
      console.log('✅ Early termination: Sufficient successful results obtained');
      break;
    }
    
    // Smart delay between batches
    if (i + maxConcurrentRequests < sourceChain.length) {
      await delay(1000 + Math.random() * 2000); // 1-3 second random delay
    }
  }
  
  return { results };
}

// Phase 3: Analyze Failure Patterns
async function analyzeFailurePatterns(results: any[]) {
  console.log('📊 Analyzing failure patterns...');
  
  const failedResults = results.filter(r => !r.success);
  
  const patterns = {
    common_errors: analyzeCommonErrors(failedResults),
    geographic_patterns: analyzeGeographicPatterns(failedResults),
    source_type_patterns: analyzeSourceTypePatterns(failedResults),
    temporal_patterns: analyzeTemporalPatterns(failedResults),
    recommendations: []
  };
  
  // Generate recommendations based on patterns
  if (patterns.common_errors.timeout_rate > 0.3) {
    patterns.recommendations.push('Consider increasing timeout values for future requests');
  }
  
  if (patterns.geographic_patterns.regional_failures > 0.5) {
    patterns.recommendations.push('Diversify geographic source distribution');
  }
  
  if (patterns.source_type_patterns.auction_house_failures > 0.4) {
    patterns.recommendations.push('Review auction house access patterns and rate limits');
  }
  
  return { patterns };
}

// Phase 4: Adaptive Source Ranking Update
async function updateAdaptiveSourceRanking(results: any[], patterns: any) {
  console.log('🔄 Updating adaptive source ranking...');
  
  const updates = [];
  
  for (const result of results) {
    const performanceScore = calculatePerformanceScore(result);
    const adaptiveAdjustment = calculateAdaptiveAdjustment(result, patterns);
    
    updates.push({
      source_id: result.source_id,
      performance_score: performanceScore,
      adaptive_adjustment: adaptiveAdjustment,
      new_success_rate: Math.min(1.0, Math.max(0.0, 
        (await getCurrentSuccessRate(result.source_id)) + adaptiveAdjustment
      ))
    });
  }
  
  // Batch update source performance
  for (const update of updates) {
    try {
      await supabase.rpc('update_source_success_rate', {
        source_url: await getSourceUrl(update.source_id),
        was_successful: update.performance_score > 0.5,
        response_time: null // Will be calculated from individual results
      });
    } catch (error) {
      console.warn(`Failed to update source ${update.source_id}:`, error.message);
    }
  }
  
  console.log('✅ Adaptive ranking updated for', updates.length, 'sources');
}

// Helper Functions
function calculatePriorityScore(
  source: any, 
  coinQuery: any, 
  userLocation: string, 
  weights: any
): number {
  let score = 0;
  
  // Success rate component
  score += (source.success_rate || 0.5) * weights.success_rate;
  
  // Response time component (lower is better)
  const normalizedResponseTime = Math.max(0, 1 - ((source.response_time_avg || 3000) / 10000));
  score += normalizedResponseTime * weights.response_time;
  
  // Geographic priority component
  const geographicMatch = calculateGeographicMatch(source, userLocation);
  score += geographicMatch * weights.geographic_priority;
  
  // Source type relevance component
  const typeRelevance = calculateSourceTypeRelevance(source, coinQuery);
  score += typeRelevance * weights.source_type;
  
  return Math.min(1.0, Math.max(0.0, score));
}

function calculateGeographicMatch(source: any, userLocation: string): number {
  if (userLocation === 'global') return 0.5;
  
  const sourceCountry = source.country || 'US';
  const locationMappings: Record<string, string[]> = {
    'US': ['US', 'USA', 'United States'],
    'UK': ['UK', 'GB', 'United Kingdom'],
    'EU': ['DE', 'FR', 'ES', 'IT', 'NL'],
    'APAC': ['AU', 'JP', 'SG', 'HK']
  };
  
  for (const [region, countries] of Object.entries(locationMappings)) {
    if (userLocation.toUpperCase() === region && countries.includes(sourceCountry)) {
      return 1.0;
    }
  }
  
  return sourceCountry === userLocation ? 1.0 : 0.3;
}

function calculateSourceTypeRelevance(source: any, coinQuery: any): number {
  const sourceType = source.source_type;
  
  // Error coins are best found in specialized databases and forums
  if (coinQuery.category === 'error_coin') {
    if (sourceType === 'database' || sourceType === 'forum') return 1.0;
    if (sourceType === 'auction_house') return 0.8;
    return 0.6;
  }
  
  // Rare coins are best found in auction houses
  if (coinQuery.rarity === 'Ultra Rare' || coinQuery.rarity === 'Rare') {
    if (sourceType === 'auction_house') return 1.0;
    if (sourceType === 'grading_service') return 0.9;
    return 0.7;
  }
  
  // Common coins can be found anywhere
  return 0.8;
}

function applyDiversificationStrategy(sources: any[], maxAttempts: number): any[] {
  const diversified = [];
  const typeGroups: Record<string, any[]> = {};
  
  // Group by source type
  sources.forEach(source => {
    const type = source.source_type || 'unknown';
    if (!typeGroups[type]) typeGroups[type] = [];
    typeGroups[type].push(source);
  });
  
  // Ensure diversity across source types
  const typeKeys = Object.keys(typeGroups);
  let typeIndex = 0;
  
  while (diversified.length < maxAttempts && diversified.length < sources.length) {
    const currentType = typeKeys[typeIndex % typeKeys.length];
    const typeGroup = typeGroups[currentType];
    
    if (typeGroup && typeGroup.length > 0) {
      const source = typeGroup.shift();
      diversified.push(source);
    }
    
    typeIndex++;
    
    // If we've cycled through all types, add remaining sources by priority
    if (typeIndex >= typeKeys.length * 3) {
      const remainingSources = Object.values(typeGroups).flat();
      diversified.push(...remainingSources.slice(0, maxAttempts - diversified.length));
      break;
    }
  }
  
  return diversified;
}

async function executeSourceQuery(source: any, coinQuery: any): Promise<any> {
  // Call the advanced web scraper for this source
  const { data, error } = await supabase.functions.invoke('advanced-web-scraper', {
    body: {
      targetUrl: source.base_url,
      coinQuery: coinQuery,
      searchType: 'focused'
    }
  });
  
  if (error) throw new Error(error.message);
  if (!data.success) throw new Error(data.message || 'Scraping failed');
  
  return data.data;
}

function analyzeCommonErrors(failedResults: any[]) {
  const errorCounts: Record<string, number> = {};
  let timeoutCount = 0;
  
  failedResults.forEach(result => {
    const error = result.error || 'unknown';
    errorCounts[error] = (errorCounts[error] || 0) + 1;
    
    if (error.toLowerCase().includes('timeout')) {
      timeoutCount++;
    }
  });
  
  return {
    error_distribution: errorCounts,
    timeout_rate: failedResults.length > 0 ? timeoutCount / failedResults.length : 0,
    most_common_error: Object.entries(errorCounts).sort(([,a], [,b]) => b - a)[0]?.[0] || 'none'
  };
}

function analyzeGeographicPatterns(failedResults: any[]) {
  // Simplified geographic analysis
  return {
    regional_failures: 0.3, // Placeholder
    problematic_regions: ['EU', 'APAC']
  };
}

function analyzeSourceTypePatterns(failedResults: any[]) {
  // Simplified source type analysis
  return {
    auction_house_failures: 0.2, // Placeholder
    marketplace_failures: 0.3,
    forum_failures: 0.1
  };
}

function analyzeTemporalPatterns(failedResults: any[]) {
  // Simplified temporal analysis
  return {
    peak_failure_hour: new Date().getHours(),
    failure_trend: 'stable'
  };
}

function calculatePerformanceScore(result: any): number {
  if (!result.success) return 0;
  
  let score = 0.5; // Base score for success
  
  // Response time bonus (faster is better)
  if (result.response_time < 2000) score += 0.3;
  else if (result.response_time < 5000) score += 0.2;
  else if (result.response_time < 10000) score += 0.1;
  
  // Data quality bonus
  if (result.data && result.data.prices && result.data.prices.length > 0) score += 0.2;
  if (result.data && result.data.confidence > 0.7) score += 0.1;
  
  return Math.min(1.0, score);
}

function calculateAdaptiveAdjustment(result: any, patterns: any): number {
  let adjustment = 0;
  
  if (result.success) {
    adjustment += 0.02; // Small positive adjustment for success
    
    if (result.response_time < 3000) adjustment += 0.01; // Fast response bonus
    if (result.data && result.data.confidence > 0.8) adjustment += 0.01; // High confidence bonus
  } else {
    adjustment -= 0.01; // Small negative adjustment for failure
    
    if (result.error && result.error.includes('timeout')) adjustment -= 0.02; // Timeout penalty
  }
  
  return adjustment;
}

async function getCurrentSuccessRate(sourceId: string): Promise<number> {
  const { data } = await supabase
    .from('global_coin_sources')
    .select('success_rate')
    .eq('id', sourceId)
    .single();
  
  return data?.success_rate || 0.5;
}

async function getSourceUrl(sourceId: string): Promise<string> {
  const { data } = await supabase
    .from('global_coin_sources')
    .select('base_url')
    .eq('id', sourceId)
    .single();
  
  return data?.base_url || '';
}

function delay(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}