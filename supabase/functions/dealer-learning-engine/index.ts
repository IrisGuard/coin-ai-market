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
      dealerUploadData,
      coinAnalysisResult,
      learningType = 'comprehensive',
      updateKnowledgeBase = true
    } = await req.json();

    if (!dealerUploadData || !coinAnalysisResult) {
      throw new Error('Dealer upload data and coin analysis result are required');
    }

    console.log('🧠 Dealer Learning Engine Starting...');
    console.log('Learning Type:', learningType);
    console.log('Dealer:', dealerUploadData.dealer_id);
    console.log('Coin:', coinAnalysisResult.name);

    const startTime = Date.now();
    
    // Phase 1: Pattern Recognition from Successful Identifications
    const { patterns } = await recognizeSuccessfulPatterns(dealerUploadData, coinAnalysisResult);
    
    // Phase 2: Error Coin Knowledge Enhancement
    const { errorEnhancements } = await enhanceErrorCoinKnowledge(dealerUploadData, coinAnalysisResult);
    
    // Phase 3: Market Data Integration and Validation
    const { marketValidation } = await integrateAndValidateMarketData(dealerUploadData, coinAnalysisResult);
    
    // Phase 4: AI Model Training Data Generation
    const { trainingData } = await generateAITrainingData(dealerUploadData, coinAnalysisResult, patterns);
    
    // Phase 5: Knowledge Base Update and Enrichment
    const updateResults = updateKnowledgeBase ? 
      await updateGlobalKnowledgeBase(patterns, errorEnhancements, marketValidation, trainingData) :
      { updated: false };
    
    // Phase 6: Performance Analytics and Feedback Loop
    const { analytics } = await generatePerformanceAnalytics(dealerUploadData, coinAnalysisResult, patterns);
    
    const processingTime = Date.now() - startTime;
    
    console.log('✅ Dealer Learning Engine Complete');
    console.log('Patterns Recognized:', patterns.length);
    console.log('Error Enhancements:', errorEnhancements.length);
    console.log('Training Data Generated:', trainingData.length);
    console.log('Processing Time:', processingTime + 'ms');

    return new Response(JSON.stringify({
      success: true,
      learning_results: {
        patterns_recognized: patterns,
        error_enhancements: errorEnhancements,
        market_validation: marketValidation,
        training_data_points: trainingData.length,
        knowledge_base_updated: updateResults.updated,
        performance_analytics: analytics
      },
      metadata: {
        dealer_id: dealerUploadData.dealer_id,
        coin_id: dealerUploadData.coin_id,
        learning_type: learningType,
        processing_time: processingTime,
        confidence_improvement: analytics.confidence_improvement,
        timestamp: new Date().toISOString()
      }
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });

  } catch (error) {
    console.error('💥 Dealer Learning Engine Error:', error);
    return new Response(JSON.stringify({
      success: false,
      error: 'Dealer learning engine failed',
      message: error.message
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  }
});

// Phase 1: Pattern Recognition from Successful Identifications
async function recognizeSuccessfulPatterns(dealerData: any, analysisResult: any) {
  console.log('🔍 Recognizing successful identification patterns...');
  
  const patterns = [];
  
  // Visual Pattern Recognition
  if (dealerData.images && dealerData.images.length > 0) {
    const visualPatterns = await analyzeVisualPatterns(dealerData.images, analysisResult);
    patterns.push(...visualPatterns);
  }
  
  // Text Pattern Recognition (from coin inscriptions)
  if (analysisResult.inscriptions || dealerData.coin_inscriptions) {
    const textPatterns = await analyzeTextPatterns(
      analysisResult.inscriptions || dealerData.coin_inscriptions, 
      analysisResult
    );
    patterns.push(...textPatterns);
  }
  
  // Grading Pattern Recognition
  if (dealerData.grade && analysisResult.grade) {
    const gradingPatterns = await analyzeGradingPatterns(dealerData.grade, analysisResult.grade);
    patterns.push(...gradingPatterns);
  }
  
  // Error Pattern Recognition
  if (analysisResult.error_types && analysisResult.error_types.length > 0) {
    const errorPatterns = await analyzeErrorPatterns(dealerData, analysisResult.error_types);
    patterns.push(...errorPatterns);
  }
  
  // Market Pattern Recognition
  if (dealerData.price && analysisResult.estimated_value) {
    const marketPatterns = await analyzeMarketPatterns(dealerData.price, analysisResult.estimated_value, analysisResult);
    patterns.push(...marketPatterns);
  }
  
  return { patterns };
}

// Phase 2: Error Coin Knowledge Enhancement
async function enhanceErrorCoinKnowledge(dealerData: any, analysisResult: any) {
  console.log('⚠️ Enhancing error coin knowledge...');
  
  const errorEnhancements = [];
  
  if (analysisResult.error_coin_detected && analysisResult.error_types?.length > 0) {
    for (const errorType of analysisResult.error_types) {
      // Check if this error type already exists in knowledge base
      const { data: existingError } = await supabase
        .from('error_coins_knowledge')
        .select('*')
        .eq('error_type', errorType)
        .single();
      
      if (existingError) {
        // Enhance existing error knowledge
        const enhancement = await enhanceExistingErrorKnowledge(existingError, dealerData, analysisResult);
        if (enhancement) {
          errorEnhancements.push(enhancement);
        }
      } else {
        // Create new error knowledge entry
        const newErrorKnowledge = await createNewErrorKnowledge(errorType, dealerData, analysisResult);
        if (newErrorKnowledge) {
          errorEnhancements.push(newErrorKnowledge);
        }
      }
    }
  }
  
  return { errorEnhancements };
}

// Phase 3: Market Data Integration and Validation
async function integrateAndValidateMarketData(dealerData: any, analysisResult: any) {
  console.log('💰 Integrating and validating market data...');
  
  const marketValidation = {
    price_accuracy: 0,
    market_trend_confirmation: false,
    comparable_sales: [],
    valuation_confidence: 0
  };
  
  if (dealerData.price && analysisResult.estimated_value) {
    // Calculate price accuracy
    const priceDifference = Math.abs(dealerData.price - analysisResult.estimated_value);
    const averagePrice = (dealerData.price + analysisResult.estimated_value) / 2;
    marketValidation.price_accuracy = Math.max(0, 1 - (priceDifference / averagePrice));
    
    // Find comparable sales
    const coinIdentifier = `${analysisResult.country}_${analysisResult.year}_${analysisResult.denomination}`.replace(/\s+/g, '_');
    
    const { data: comparableSales } = await supabase
      .from('coin_price_history')
      .select('*')
      .eq('coin_identifier', coinIdentifier)
      .order('date_recorded', { ascending: false })
      .limit(10);
    
    if (comparableSales && comparableSales.length > 0) {
      marketValidation.comparable_sales = comparableSales;
      
      // Validate against historical data
      const recentPrices = comparableSales.slice(0, 5).map(s => s.price);
      const avgRecentPrice = recentPrices.reduce((a, b) => a + b, 0) / recentPrices.length;
      
      const historicalAccuracy = Math.max(0, 1 - Math.abs(dealerData.price - avgRecentPrice) / avgRecentPrice);
      marketValidation.valuation_confidence = (marketValidation.price_accuracy + historicalAccuracy) / 2;
    }
  }
  
  return { marketValidation };
}

// Phase 4: AI Model Training Data Generation
async function generateAITrainingData(dealerData: any, analysisResult: any, patterns: any[]) {
  console.log('🤖 Generating AI training data...');
  
  const trainingData = [];
  
  // Image-based training data
  if (dealerData.images && dealerData.images.length > 0) {
    for (const imageUrl of dealerData.images) {
      const trainingPoint = {
        type: 'image_recognition',
        input_data: {
          image_url: imageUrl,
          image_hash: generateImageHash(imageUrl),
          metadata: {
            dealer_verified: true,
            actual_identification: {
              name: analysisResult.name,
              country: analysisResult.country,
              year: analysisResult.year,
              denomination: analysisResult.denomination,
              grade: analysisResult.grade,
              error_types: analysisResult.error_types || []
            }
          }
        },
        expected_output: analysisResult,
        confidence_score: analysisResult.confidence || 0.8,
        training_quality_score: calculateTrainingQualityScore(dealerData, analysisResult),
        contributed_by: dealerData.dealer_id,
        validation_status: 'dealer_verified'
      };
      
      trainingData.push(trainingPoint);
    }
  }
  
  // Pattern-based training data
  for (const pattern of patterns) {
    if (pattern.training_value > 0.6) {
      const trainingPoint = {
        type: 'pattern_recognition',
        input_data: pattern.input_features,
        expected_output: pattern.expected_result,
        confidence_score: pattern.confidence,
        training_quality_score: pattern.training_value,
        pattern_type: pattern.type,
        contributed_by: dealerData.dealer_id,
        validation_status: 'pattern_derived'
      };
      
      trainingData.push(trainingPoint);
    }
  }
  
  // Error coin specific training data
  if (analysisResult.error_coin_detected) {
    const errorTrainingPoint = {
      type: 'error_detection',
      input_data: {
        visual_markers: analysisResult.visual_markers || {},
        error_types: analysisResult.error_types || [],
        base_coin_info: {
          country: analysisResult.country,
          year: analysisResult.year,
          denomination: analysisResult.denomination
        }
      },
      expected_output: {
        is_error_coin: true,
        error_types: analysisResult.error_types,
        rarity_multiplier: analysisResult.rarity_multiplier || 1.0
      },
      confidence_score: analysisResult.confidence || 0.8,
      training_quality_score: 0.9, // Error coins are high-value training data
      contributed_by: dealerData.dealer_id,
      validation_status: 'expert_verified'
    };
    
    trainingData.push(errorTrainingPoint);
  }
  
  return { trainingData };
}

// Phase 5: Knowledge Base Update and Enrichment
async function updateGlobalKnowledgeBase(patterns: any[], errorEnhancements: any[], marketValidation: any, trainingData: any[]) {
  console.log('📚 Updating global knowledge base...');
  
  let updatedRecords = 0;
  
  // Update AI training data
  for (const trainingPoint of trainingData) {
    try {
      const { error } = await supabase
        .from('ai_training_data')
        .insert({
          image_url: trainingPoint.input_data.image_url || '',
          image_hash: trainingPoint.input_data.image_hash || generateRandomHash(),
          coin_identification: trainingPoint.expected_output,
          error_annotations: trainingPoint.input_data.error_types || {},
          training_quality_score: trainingPoint.training_quality_score,
          contributed_by: trainingPoint.contributed_by,
          validation_status: trainingPoint.validation_status
        });
      
      if (!error) updatedRecords++;
    } catch (error) {
      console.warn('Failed to insert training data:', error);
    }
  }
  
  // Update error coin knowledge
  for (const enhancement of errorEnhancements) {
    try {
      if (enhancement.action === 'update') {
        const { error } = await supabase
          .from('error_coins_knowledge')
          .update(enhancement.data)
          .eq('id', enhancement.id);
        
        if (!error) updatedRecords++;
      } else if (enhancement.action === 'insert') {
        const { error } = await supabase
          .from('error_coins_knowledge')
          .insert(enhancement.data);
        
        if (!error) updatedRecords++;
      }
    } catch (error) {
      console.warn('Failed to update error knowledge:', error);
    }
  }
  
  // Update performance metrics
  try {
    await supabase
      .from('ai_performance_metrics')
      .insert({
        metric_type: 'dealer_learning',
        metric_name: 'knowledge_base_update',
        metric_value: updatedRecords,
        metadata: {
          patterns_count: patterns.length,
          error_enhancements: errorEnhancements.length,
          training_data_points: trainingData.length,
          market_validation_confidence: marketValidation.valuation_confidence
        }
      });
  } catch (error) {
    console.warn('Failed to record performance metrics:', error);
  }
  
  return { updated: updatedRecords > 0, records_updated: updatedRecords };
}

// Phase 6: Performance Analytics and Feedback Loop
async function generatePerformanceAnalytics(dealerData: any, analysisResult: any, patterns: any[]) {
  console.log('📊 Generating performance analytics...');
  
  const analytics = {
    dealer_contribution_score: 0,
    confidence_improvement: 0,
    pattern_discovery_rate: 0,
    knowledge_base_impact: 0,
    recommendations: []
  };
  
  // Calculate dealer contribution score
  analytics.dealer_contribution_score = calculateDealerContributionScore(dealerData, analysisResult, patterns);
  
  // Calculate confidence improvement
  const baseConfidence = 0.5; // Baseline AI confidence
  const enhancedConfidence = analysisResult.confidence || 0.5;
  analytics.confidence_improvement = Math.max(0, enhancedConfidence - baseConfidence);
  
  // Calculate pattern discovery rate
  analytics.pattern_discovery_rate = patterns.length / Math.max(1, dealerData.images?.length || 1);
  
  // Estimate knowledge base impact
  analytics.knowledge_base_impact = estimateKnowledgeBaseImpact(patterns, analysisResult);
  
  // Generate recommendations
  if (analytics.dealer_contribution_score > 0.8) {
    analytics.recommendations.push('High-quality contribution - consider incentivizing similar uploads');
  }
  
  if (analytics.pattern_discovery_rate > 2.0) {
    analytics.recommendations.push('Excellent pattern diversity - use as training exemplar');
  }
  
  if (analysisResult.error_coin_detected) {
    analytics.recommendations.push('Error coin detected - prioritize for expert validation');
  }
  
  return { analytics };
}

// Helper Functions
async function analyzeVisualPatterns(images: string[], analysisResult: any) {
  // Placeholder for visual pattern analysis
  return [
    {
      type: 'visual_similarity',
      confidence: 0.8,
      input_features: { image_characteristics: 'extracted_features' },
      expected_result: analysisResult,
      training_value: 0.7
    }
  ];
}

async function analyzeTextPatterns(inscriptions: any, analysisResult: any) {
  // Placeholder for text pattern analysis
  return [
    {
      type: 'inscription_pattern',
      confidence: 0.9,
      input_features: { text_patterns: inscriptions },
      expected_result: analysisResult,
      training_value: 0.8
    }
  ];
}

async function analyzeGradingPatterns(dealerGrade: string, analysisGrade: string) {
  const patterns = [];
  
  if (dealerGrade && analysisGrade) {
    const gradingAccuracy = calculateGradingAccuracy(dealerGrade, analysisGrade);
    
    patterns.push({
      type: 'grading_validation',
      confidence: gradingAccuracy,
      input_features: { dealer_grade: dealerGrade, visual_indicators: 'extracted' },
      expected_result: { grade: analysisGrade },
      training_value: gradingAccuracy
    });
  }
  
  return patterns;
}

async function analyzeErrorPatterns(dealerData: any, errorTypes: string[]) {
  const patterns = [];
  
  for (const errorType of errorTypes) {
    patterns.push({
      type: 'error_detection',
      confidence: 0.85,
      input_features: { 
        visual_markers: 'extracted',
        error_type: errorType,
        base_coin: {
          country: dealerData.country,
          year: dealerData.year,
          denomination: dealerData.denomination
        }
      },
      expected_result: { 
        is_error_coin: true, 
        error_types: [errorType] 
      },
      training_value: 0.9
    });
  }
  
  return patterns;
}

async function analyzeMarketPatterns(dealerPrice: number, estimatedValue: number, analysisResult: any) {
  const patterns = [];
  
  const priceAccuracy = Math.max(0, 1 - Math.abs(dealerPrice - estimatedValue) / Math.max(dealerPrice, estimatedValue));
  
  if (priceAccuracy > 0.7) {
    patterns.push({
      type: 'market_valuation',
      confidence: priceAccuracy,
      input_features: {
        coin_characteristics: {
          country: analysisResult.country,
          year: analysisResult.year,
          grade: analysisResult.grade,
          rarity: analysisResult.rarity
        }
      },
      expected_result: { estimated_value: dealerPrice },
      training_value: priceAccuracy
    });
  }
  
  return patterns;
}

async function enhanceExistingErrorKnowledge(existingError: any, dealerData: any, analysisResult: any) {
  // Enhance existing error knowledge
  const updatedData = {
    ...existingError,
    identification_techniques: [
      ...(existingError.identification_techniques || []),
      `Verified by dealer upload: ${analysisResult.confidence > 0.8 ? 'high confidence' : 'standard'} identification`
    ],
    ai_detection_markers: {
      ...existingError.ai_detection_markers,
      dealer_verified_markers: analysisResult.visual_markers || {}
    },
    updated_at: new Date().toISOString()
  };
  
  return {
    action: 'update',
    id: existingError.id,
    data: updatedData
  };
}

async function createNewErrorKnowledge(errorType: string, dealerData: any, analysisResult: any) {
  return {
    action: 'insert',
    data: {
      error_name: `${errorType} - ${analysisResult.country} ${analysisResult.year}`,
      error_type: errorType,
      error_category: categorizeError(errorType),
      description: `${errorType} error identified in ${analysisResult.name}`,
      ai_detection_markers: analysisResult.visual_markers || {},
      detection_difficulty: 3, // Medium difficulty
      rarity_score: analysisResult.rarity === 'Ultra Rare' ? 5 : 3,
      market_premium_multiplier: analysisResult.rarity_multiplier || 1.5,
      identification_techniques: [`AI-detected with ${Math.round((analysisResult.confidence || 0) * 100)}% confidence`],
      technical_specifications: {
        base_coin: {
          country: analysisResult.country,
          year: analysisResult.year,
          denomination: analysisResult.denomination
        },
        error_specifics: analysisResult.error_types
      }
    }
  };
}

function calculateTrainingQualityScore(dealerData: any, analysisResult: any): number {
  let score = 0.5; // Base score
  
  // Image quality bonus
  if (dealerData.images && dealerData.images.length >= 3) score += 0.2;
  
  // Confidence bonus
  if (analysisResult.confidence > 0.8) score += 0.2;
  
  // Error coin bonus (high training value)
  if (analysisResult.error_coin_detected) score += 0.3;
  
  // Dealer reputation bonus (placeholder)
  score += 0.1;
  
  return Math.min(1.0, score);
}

function calculateDealerContributionScore(dealerData: any, analysisResult: any, patterns: any[]): number {
  let score = 0;
  
  // Base contribution for successful identification
  score += 0.3;
  
  // Pattern discovery bonus
  score += Math.min(0.3, patterns.length * 0.1);
  
  // Error coin discovery bonus
  if (analysisResult.error_coin_detected) score += 0.4;
  
  // High confidence bonus
  if (analysisResult.confidence > 0.9) score += 0.2;
  
  // Multiple image bonus
  if (dealerData.images && dealerData.images.length > 2) score += 0.1;
  
  return Math.min(1.0, score);
}

function calculateGradingAccuracy(dealerGrade: string, analysisGrade: string): number {
  // Simplified grading accuracy calculation
  const gradeMap: Record<string, number> = {
    'Poor': 1,
    'Fair': 2,
    'Good': 3,
    'Very Good': 4,
    'Fine': 5,
    'Very Fine': 6,
    'Extremely Fine': 7,
    'About Uncirculated': 8,
    'Uncirculated': 9,
    'Mint State': 10
  };
  
  const dealerScore = gradeMap[dealerGrade] || 5;
  const analysisScore = gradeMap[analysisGrade] || 5;
  
  const difference = Math.abs(dealerScore - analysisScore);
  return Math.max(0, 1 - (difference / 10));
}

function estimateKnowledgeBaseImpact(patterns: any[], analysisResult: any): number {
  let impact = 0;
  
  // Pattern diversity impact
  impact += Math.min(0.4, patterns.length * 0.1);
  
  // Error coin impact (high value)
  if (analysisResult.error_coin_detected) impact += 0.4;
  
  // Confidence impact
  impact += (analysisResult.confidence || 0.5) * 0.3;
  
  // Rarity impact
  if (analysisResult.rarity === 'Ultra Rare') impact += 0.2;
  else if (analysisResult.rarity === 'Rare') impact += 0.1;
  
  return Math.min(1.0, impact);
}

function categorizeError(errorType: string): string {
  const errorCategories: Record<string, string> = {
    'double_die': 'striking_error',
    'off_center': 'striking_error',
    'broadstrike': 'striking_error',
    'clipped_planchet': 'planchet_error',
    'die_crack': 'die_error',
    'struck_through': 'striking_error'
  };
  
  return errorCategories[errorType.toLowerCase().replace(/\s+/g, '_')] || 'other_error';
}

function generateImageHash(imageUrl: string): string {
  return `img_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}

function generateRandomHash(): string {
  return `hash_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}