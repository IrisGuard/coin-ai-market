
import { analyzePriceConsistency } from './priceAnalysis';
import { validateCoinCategory } from './categoryValidation';
import { assessGradeReliability } from './gradeAssessment';

export const generateMarketplaceInsights = (coinData: any, marketHistory: any) => {
  console.log('🧠 Generating marketplace intelligence insights...');
  
  const insights = [];
  
  // Price insights
  const priceAnalysis = analyzePriceConsistency(coinData.estimated_value || 0, coinData, marketHistory);
  if (priceAnalysis.recommendation !== 'accurate') {
    insights.push({
      type: 'price_insight',
      severity: priceAnalysis.confidence < 0.5 ? 'high' : 'medium',
      message: `Based on similar listings, price may be ${priceAnalysis.recommendation}. Market average: $${priceAnalysis.marketAverage?.toFixed(2)}`,
      data: priceAnalysis
    });
  }
  
  // Category insights
  const categoryAnalysis = validateCoinCategory(coinData.category || 'USA COINS', coinData, marketHistory);
  if (!categoryAnalysis.isConsistent) {
    insights.push({
      type: 'category_insight',
      severity: 'medium',
      message: `${categoryAnalysis.marketPreference}. Consider using category: ${categoryAnalysis.suggestedCategory}`,
      data: categoryAnalysis
    });
  }
  
  // Grade insights
  const gradeAnalysis = assessGradeReliability(coinData.grade, coinData, marketHistory);
  if (gradeAnalysis.warning) {
    insights.push({
      type: 'grade_insight',
      severity: gradeAnalysis.confidence < 0.5 ? 'high' : 'medium',
      message: `Grade analysis warning: ${gradeAnalysis.warning}. This grade represents ${gradeAnalysis.gradeFrequency?.toFixed(1)}% of similar coins.`,
      data: gradeAnalysis
    });
  }
  
  return {
    insights,
    overallConfidence: (priceAnalysis.confidence + categoryAnalysis.confidence + gradeAnalysis.confidence) / 3,
    recommendedAdjustments: insights.length > 0
  };
};

export const learnFromSuccessfulListings = (marketHistory: any) => {
  console.log('📈 Learning from successful listing patterns...');
  
  // Analyze what makes listings successful based on sold vs unsold coins
  const successPatterns = {
    optimalPriceRanges: new Map(),
    bestCategories: new Map(),
    effectiveDescriptions: [],
    timingPatterns: new Map()
  };
  
  // This would analyze the success rates from the coins table
  // identifying patterns in sold vs unsold items
  
  return {
    successFactors: successPatterns,
    recommendations: [
      'Price competitively within market range',
      'Use accurate categories based on community patterns',
      'Include detailed descriptions with technical specifications',
      'Verify grades match community expectations'
    ]
  };
};
