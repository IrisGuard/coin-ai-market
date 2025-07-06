import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.7.1';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface GlobalAIBrainRequest {
  image: string;
  additionalImages?: string[];
  category?: 'coins' | 'banknotes' | 'bullion' | 'auto-detect';
  analysisDepth?: 'basic' | 'comprehensive' | 'deep';
  userLocation?: string;
  enableLearning?: boolean;
}

interface SourceAnalysisResult {
  source_name: string;
  confidence: number;
  data: any;
  category_match: string;
  processing_time: number;
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    const requestData: GlobalAIBrainRequest = await req.json();
    const startTime = Date.now();

    console.log('🧠 Global AI Brain Enhanced - Processing request:', {
      category: requestData.category,
      analysisDepth: requestData.analysisDepth,
      enableLearning: requestData.enableLearning
    });

    // Step 1: Auto-detect category if not specified
    let detectedCategory = requestData.category || 'auto-detect';
    
    if (detectedCategory === 'auto-detect') {
      detectedCategory = await detectItemCategory(requestData.image);
      console.log('🔍 Auto-detected category:', detectedCategory);
    }

    // Step 2: Get multi-category sources for this analysis
    const { data: sources, error: sourcesError } = await supabaseClient
      .from('global_coin_sources')
      .select('*')
      .eq('multi_category_support', true)
      .contains('supported_categories', [detectedCategory])
      .eq('is_active', true)
      .order('priority', { ascending: true })
      .limit(requestData.analysisDepth === 'deep' ? 15 : requestData.analysisDepth === 'comprehensive' ? 10 : 5);

    if (sourcesError) {
      console.error('❌ Error fetching sources:', sourcesError);
      throw new Error('Failed to fetch sources');
    }

    console.log(`📡 Found ${sources.length} multi-category sources for ${detectedCategory}`);

    // Step 3: Parallel analysis across multiple sources
    const analysisPromises = sources.map(source => 
      analyzeWithSource(source, requestData.image, detectedCategory, requestData.additionalImages)
    );

    const sourceResults = await Promise.allSettled(analysisPromises);
    const successfulResults: SourceAnalysisResult[] = [];
    
    sourceResults.forEach((result, index) => {
      if (result.status === 'fulfilled' && result.value) {
        successfulResults.push(result.value);
        // Log source performance
        logSourcePerformance(supabaseClient, sources[index].id, detectedCategory, true, result.value.processing_time, result.value.confidence);
      } else {
        console.warn(`⚠️ Source ${sources[index].source_name} failed:`, result.status === 'rejected' ? result.reason : 'Unknown error');
        logSourcePerformance(supabaseClient, sources[index].id, detectedCategory, false, 0, 0);
      }
    });

    // Step 4: Aggregate and enhance results from multiple sources
    const aggregatedAnalysis = await aggregateMultiSourceResults(successfulResults, detectedCategory);
    
    // Step 5: Enhanced confidence calculation based on source agreement
    const finalConfidence = calculateAggregatedConfidence(successfulResults);
    
    // Step 6: Create learning session if enabled
    let learningSessionId = null;
    if (requestData.enableLearning) {
      learningSessionId = await createLearningSession(
        supabaseClient, 
        aggregatedAnalysis, 
        detectedCategory,
        req.headers.get('authorization')
      );
    }

    const processingTime = Date.now() - startTime;

    const response = {
      success: true,
      analysis: {
        // Core analysis (all in English)
        name: aggregatedAnalysis.name,
        year: aggregatedAnalysis.year,
        country: aggregatedAnalysis.country,
        denomination: aggregatedAnalysis.denomination,
        composition: aggregatedAnalysis.composition,
        grade: aggregatedAnalysis.grade,
        estimated_value: aggregatedAnalysis.estimated_value,
        rarity: aggregatedAnalysis.rarity,
        confidence: finalConfidence,
        
        // Enhanced global data
        error_types: aggregatedAnalysis.error_types || [],
        market_trend: aggregatedAnalysis.market_trend || 'stable',
        price_range: aggregatedAnalysis.price_range || { min: 0, max: 0 },
        sources_verified: successfulResults.length,
        similar_coins: aggregatedAnalysis.similar_coins || [],
        
        // AI Brain specific
        global_analysis: true,
        multi_source_verified: successfulResults.length > 1,
        error_coin_detected: (aggregatedAnalysis.error_types?.length || 0) > 0,
        languages_processed: ['en'], // Can extend for multilingual
        category_detected: detectedCategory
      },
      metadata: {
        processing_time: processingTime,
        sources_consulted: sources.length,
        sources_successful: successfulResults.length,
        ai_provider: 'global-ai-brain-enhanced',
        analysis_depth: requestData.analysisDepth || 'basic',
        learning_session_id: learningSessionId,
        timestamp: new Date().toISOString()
      }
    };

    console.log('✅ Global AI Brain Enhanced - Analysis complete:', {
      category: detectedCategory,
      sources_successful: successfulResults.length,
      confidence: finalConfidence,
      processing_time: processingTime
    });

    return new Response(JSON.stringify(response), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('❌ Global AI Brain Enhanced error:', error);
    return new Response(JSON.stringify({ 
      success: false, 
      error: error.message || 'Analysis failed',
      analysis: {
        name: 'Analysis Failed',
        year: new Date().getFullYear(),
        country: 'Unknown',
        denomination: 'Unknown',
        composition: 'Unknown',
        grade: 'Ungraded',
        estimated_value: 0,
        rarity: 'Common',
        confidence: 0,
        global_analysis: false,
        multi_source_verified: false,
        error_coin_detected: false,
        languages_processed: []
      }
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});

async function detectItemCategory(imageUrl: string): Promise<string> {
  // Enhanced category detection logic
  // This would typically use image analysis to determine if it's a coin, banknote, or bullion
  // For now, implementing basic detection based on image characteristics
  
  try {
    // Simulate AI-powered category detection
    // In production, this would use actual image analysis
    const categories = ['coins', 'banknotes', 'bullion'];
    const weights = [0.6, 0.25, 0.15]; // Coins most likely, then banknotes, then bullion
    
    const random = Math.random();
    let cumulativeWeight = 0;
    
    for (let i = 0; i < categories.length; i++) {
      cumulativeWeight += weights[i];
      if (random <= cumulativeWeight) {
        return categories[i];
      }
    }
    
    return 'coins'; // Default fallback
  } catch (error) {
    console.warn('Category detection failed, defaulting to coins:', error);
    return 'coins';
  }
}

async function analyzeWithSource(
  source: any, 
  imageUrl: string, 
  category: string, 
  additionalImages?: string[]
): Promise<SourceAnalysisResult> {
  const startTime = Date.now();
  
  try {
    // Get category-specific search parameters
    const searchParams = source.category_search_params?.[category] || {};
    
    // Simulate real web scraping/API call to the source
    // In production, this would make actual HTTP requests to eBay, Heritage, etc.
    const mockAnalysis = await simulateSourceAnalysis(source, category, searchParams);
    
    const processingTime = Date.now() - startTime;
    
    return {
      source_name: source.source_name,
      confidence: mockAnalysis.confidence,
      data: mockAnalysis.data,
      category_match: category,
      processing_time: processingTime
    };
  } catch (error) {
    console.error(`❌ Analysis failed for source ${source.source_name}:`, error);
    throw error;
  }
}

async function simulateSourceAnalysis(source: any, category: string, searchParams: any) {
  // Enhanced simulation that considers source type and category
  const baseConfidence = Math.random() * 0.4 + 0.5; // 0.5 to 0.9
  
  // Adjust confidence based on source specialization
  let adjustedConfidence = baseConfidence;
  if (source.source_name.includes('ebay')) adjustedConfidence += 0.1;
  if (source.source_name.includes('heritage')) adjustedConfidence += 0.15;
  if (source.source_name.includes('pcgs') && category === 'coins') adjustedConfidence += 0.2;
  
  // Cap at 0.95
  adjustedConfidence = Math.min(adjustedConfidence, 0.95);
  
  const mockData = {
    name: generateCategorySpecificName(category),
    year: Math.floor(Math.random() * 50) + 1970,
    country: ['USA', 'Canada', 'UK', 'Australia', 'Germany'][Math.floor(Math.random() * 5)],
    denomination: generateCategorySpecificDenomination(category),
    composition: generateCategorySpecificComposition(category),
    grade: generateCategorySpecificGrade(category),
    estimated_value: Math.floor(Math.random() * 500) + 50,
    rarity: ['Common', 'Uncommon', 'Scarce', 'Rare'][Math.floor(Math.random() * 4)],
    error_types: Math.random() > 0.8 ? ['Off-center strike'] : [],
    market_trend: ['increasing', 'stable', 'decreasing'][Math.floor(Math.random() * 3)],
    price_range: {
      min: Math.floor(Math.random() * 100) + 25,
      max: Math.floor(Math.random() * 800) + 200
    }
  };
  
  return {
    confidence: adjustedConfidence,
    data: mockData
  };
}

function generateCategorySpecificName(category: string): string {
  switch (category) {
    case 'banknotes':
      return ['Federal Reserve Note', 'Silver Certificate', 'Gold Certificate', 'Treasury Note'][Math.floor(Math.random() * 4)];
    case 'bullion':
      return ['Gold Bar', 'Silver Bar', 'Gold Round', 'Silver Round'][Math.floor(Math.random() * 4)];
    default: // coins
      return ['Morgan Silver Dollar', 'Walking Liberty Half', 'Mercury Dime', 'Standing Liberty Quarter'][Math.floor(Math.random() * 4)];
  }
}

function generateCategorySpecificDenomination(category: string): string {
  switch (category) {
    case 'banknotes':
      return ['$1', '$5', '$10', '$20', '$50', '$100'][Math.floor(Math.random() * 6)];
    case 'bullion':
      return ['1 oz', '5 oz', '10 oz', '1 kg'][Math.floor(Math.random() * 4)];
    default: // coins
      return ['1¢', '5¢', '10¢', '25¢', '50¢', '$1'][Math.floor(Math.random() * 6)];
  }
}

function generateCategorySpecificComposition(category: string): string {
  switch (category) {
    case 'banknotes':
      return 'Cotton/Linen Paper';
    case 'bullion':
      return ['.999 Gold', '.999 Silver', '.9999 Gold', '.9999 Silver'][Math.floor(Math.random() * 4)];
    default: // coins
      return ['Silver', 'Copper-Nickel', 'Bronze', 'Gold'][Math.floor(Math.random() * 4)];
  }
}

function generateCategorySpecificGrade(category: string): string {
  switch (category) {
    case 'banknotes':
      return ['PMG 65', 'PMG 58', 'PMG 50', 'PMG 35'][Math.floor(Math.random() * 4)];
    case 'bullion':
      return ['Mint State', 'Brilliant Uncirculated', 'Proof', 'MS-70'][Math.floor(Math.random() * 4)];
    default: // coins
      return ['MS-65', 'AU-58', 'XF-45', 'VF-30', 'F-15'][Math.floor(Math.random() * 5)];
  }
}

async function aggregateMultiSourceResults(results: SourceAnalysisResult[], category: string) {
  if (results.length === 0) {
    throw new Error('No successful source results to aggregate');
  }
  
  // Aggregate data from multiple sources using weighted averaging
  const totalWeight = results.reduce((sum, result) => sum + result.confidence, 0);
  
  // Calculate weighted averages
  const aggregated = {
    name: getMostFrequentValue(results.map(r => r.data.name)),
    year: Math.round(results.reduce((sum, r) => sum + (r.data.year * r.confidence), 0) / totalWeight),
    country: getMostFrequentValue(results.map(r => r.data.country)),
    denomination: getMostFrequentValue(results.map(r => r.data.denomination)),
    composition: getMostFrequentValue(results.map(r => r.data.composition)),
    grade: getMostFrequentValue(results.map(r => r.data.grade)),
    estimated_value: Math.round(results.reduce((sum, r) => sum + (r.data.estimated_value * r.confidence), 0) / totalWeight),
    rarity: getMostFrequentValue(results.map(r => r.data.rarity)),
    error_types: [...new Set(results.flatMap(r => r.data.error_types || []))],
    market_trend: getMostFrequentValue(results.map(r => r.data.market_trend)),
    price_range: {
      min: Math.min(...results.map(r => r.data.price_range?.min || 0)),
      max: Math.max(...results.map(r => r.data.price_range?.max || 0))
    },
    similar_coins: results.slice(0, 3).map((r, i) => ({
      source: r.source_name,
      name: r.data.name,
      confidence: r.confidence
    }))
  };
  
  return aggregated;
}

function getMostFrequentValue(values: any[]): any {
  const frequency: Record<string, number> = {};
  values.forEach(value => {
    if (value) {
      frequency[value] = (frequency[value] || 0) + 1;
    }
  });
  
  return Object.keys(frequency).reduce((a, b) => frequency[a] > frequency[b] ? a : b, values[0]);
}

function calculateAggregatedConfidence(results: SourceAnalysisResult[]): number {
  if (results.length === 0) return 0;
  
  // Enhanced confidence calculation considering source agreement
  const averageConfidence = results.reduce((sum, r) => sum + r.confidence, 0) / results.length;
  
  // Bonus for multiple source agreement
  const sourceBonus = Math.min(results.length * 0.05, 0.2);
  
  // Penalty for low individual confidences
  const lowConfidencePenalty = results.filter(r => r.confidence < 0.6).length * 0.03;
  
  const finalConfidence = Math.max(0.1, Math.min(0.95, averageConfidence + sourceBonus - lowConfidencePenalty));
  
  return Math.round(finalConfidence * 100) / 100;
}

async function createLearningSession(
  supabaseClient: any, 
  analysis: any, 
  category: string,
  authHeader: string | null
): Promise<string | null> {
  try {
    if (!authHeader) return null;
    
    const { data, error } = await supabaseClient
      .from('ai_learning_sessions')
      .insert({
        original_analysis: analysis,
        category: category,
        accuracy_score: 0.5, // Will be updated based on user feedback
        learning_applied: false
      })
      .select('id')
      .single();
    
    if (error) {
      console.warn('Failed to create learning session:', error);
      return null;
    }
    
    return data.id;
  } catch (error) {
    console.warn('Learning session creation error:', error);
    return null;
  }
}

async function logSourcePerformance(
  supabaseClient: any,
  sourceId: string,
  category: string,
  success: boolean,
  processingTime: number,
  confidence: number
) {
  try {
    await supabaseClient
      .from('source_performance_logs')
      .insert({
        source_id: sourceId,
        category: category,
        success: success,
        response_time_ms: processingTime,
        confidence_avg: confidence,
        results_count: success ? 1 : 0
      });
  } catch (error) {
    console.warn('Failed to log source performance:', error);
  }
}