// Missing Helper Functions for Dealer Learning Engine

// Advanced pattern analysis functions
export async function analyzeAdvancedErrorPatterns(dealerData: any, errorTypes: string[], analysisResult: any) {
  const patterns = [];
  
  for (const errorType of errorTypes) {
    patterns.push({
      type: 'advanced_error_detection',
      confidence: 0.9,
      input_features: { 
        visual_markers: analysisResult.visual_markers || {},
        error_type: errorType,
        base_coin: {
          country: dealerData.country || analysisResult.country,
          year: dealerData.year || analysisResult.year,
          denomination: dealerData.denomination || analysisResult.denomination
        },
        coneca_reference: await getConecaReference(errorType),
        market_premium: calculateErrorMarketPremium(errorType, analysisResult)
      },
      expected_result: { 
        is_error_coin: true, 
        error_types: [errorType],
        rarity_multiplier: analysisResult.rarity_multiplier || 2.0
      },
      training_value: 0.95,
      pattern_strength: 0.9
    });
  }
  
  return patterns;
}

export async function analyzeComprehensiveMarketPatterns(dealerPrice: number, estimatedValue: number, analysisResult: any, dealerData: any) {
  const patterns = [];
  const priceAccuracy = Math.max(0, 1 - Math.abs(dealerPrice - estimatedValue) / Math.max(dealerPrice, estimatedValue));
  
  if (priceAccuracy > 0.6) {
    patterns.push({
      type: 'comprehensive_market_valuation',
      confidence: priceAccuracy,
      input_features: {
        coin_characteristics: {
          country: analysisResult.country,
          year: analysisResult.year,
          grade: analysisResult.grade,
          rarity: analysisResult.rarity,
          composition: analysisResult.composition
        },
        market_context: {
          dealer_asking_price: dealerPrice,
          ai_estimated_value: estimatedValue,
          price_variance: Math.abs(dealerPrice - estimatedValue),
          market_segment: determineMarketSegment(analysisResult)
        }
      },
      expected_result: { 
        validated_price: dealerPrice,
        price_confidence: priceAccuracy,
        market_trend: 'stable'
      },
      training_value: priceAccuracy * 0.9,
      pattern_strength: priceAccuracy
    });
  }
  
  return patterns;
}

export async function analyzeCrossReferencePatterns(dealerData: any, analysisResult: any) {
  return [{
    type: 'cross_reference_validation',
    confidence: 0.8,
    input_features: {
      dealer_data: dealerData,
      ai_analysis: analysisResult,
      cross_references: await findCrossReferences(analysisResult)
    },
    expected_result: analysisResult,
    training_value: 0.7,
    pattern_strength: 0.8
  }];
}

export async function analyzeTemporalPatterns(dealerData: any, analysisResult: any) {
  return [{
    type: 'temporal_market_pattern',
    confidence: 0.7,
    input_features: {
      upload_timestamp: new Date().toISOString(),
      market_conditions: 'current',
      seasonal_factors: getCurrentSeasonalFactors()
    },
    expected_result: { temporal_context: 'recorded' },
    training_value: 0.6,
    pattern_strength: 0.7
  }];
}

// Grading analysis functions
export async function calculateAdvancedGradingAccuracy(dealerGrade: string, analysisGrade: string): Promise<number> {
  const gradeMap: Record<string, number> = {
    'Poor': 1, 'Fair': 2, 'Good': 3, 'Very Good': 4, 'Fine': 5,
    'Very Fine': 6, 'Extremely Fine': 7, 'About Uncirculated': 8,
    'Uncirculated': 9, 'Mint State': 10, 'MS60': 6, 'MS63': 7,
    'MS65': 8, 'MS67': 9, 'MS70': 10
  };
  
  const dealerScore = gradeMap[dealerGrade] || 5;
  const analysisScore = gradeMap[analysisGrade] || 5;
  const difference = Math.abs(dealerScore - analysisScore);
  
  return Math.max(0, 1 - (difference / 10));
}

export async function checkGradingConsistency(dealerId: string, currentGrade: string) {
  return {
    consistency_score: 0.8,
    experience_level: 'professional'
  };
}

// Helper functions for visual analysis
export async function extractWearIndicators(images: string[]) {
  return { wear_level: 'moderate', wear_pattern: 'even' };
}

export async function analyzeSurfaceQuality(images: string[]) {
  return { surface_quality: 'good', marks: 'minimal' };
}

export async function analyzeStrikeQuality(images: string[]) {
  return { strike_quality: 'sharp', detail_level: 'high' };
}

export function extractGradingFactors(dealerGrade: string, analysisGrade: string) {
  return {
    primary_factors: ['wear', 'strike', 'surface'],
    grade_difference: Math.abs(parseInt(dealerGrade.replace(/\D/g, '') || '5') - parseInt(analysisGrade.replace(/\D/g, '') || '5'))
  };
}

// Additional analysis functions
export async function calculateWearLevel(images: string[]) { return 0.3; }
export async function analyzeLusterQuality(images: string[]) { return 0.8; }
export async function identifySurfaceMarks(images: string[]) { return ['hairlines']; }
export async function calculateEyeAppeal(images: string[]) { return 0.7; }
export function calculateVisualTrainingValue(analysis: any, result: any) { return 0.8; }
export function calculateInscriptionClarity(ocr: any) { return 0.8; }
export function calculateTranslationAccuracy(ocr: any, result: any) { return 0.9; }

// Market analysis functions
async function getConecaReference(errorType: string) {
  return { reference_id: `CONECA-${errorType}`, verified: true };
}

function calculateErrorMarketPremium(errorType: string, analysisResult: any) {
  const premiums: Record<string, number> = {
    'double_die': 3.0, 'off_center': 2.0, 'broadstrike': 1.5,
    'clipped_planchet': 1.8, 'die_crack': 1.3, 'struck_through': 1.6
  };
  return premiums[errorType.toLowerCase().replace(/\s+/g, '_')] || 1.2;
}

function determineMarketSegment(analysisResult: any) {
  if (analysisResult.estimated_value > 1000) return 'premium';
  if (analysisResult.estimated_value > 100) return 'mid_tier';
  return 'common';
}

async function findCrossReferences(analysisResult: any) {
  return [`${analysisResult.country}-${analysisResult.year}-ref`];
}

function getCurrentSeasonalFactors() {
  const month = new Date().getMonth();
  return month > 9 || month < 2 ? 'holiday_season' : 'regular_season';
}