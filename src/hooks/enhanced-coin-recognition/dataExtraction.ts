import { 
  extractUserStoreData, 
  analyzePriceConsistency, 
  validateCoinCategory, 
  assessGradeReliability,
  generateMarketplaceInsights 
} from './marketplaceIntelligence';

export const extractMarketPrices = (webResults: any[]) => {
  const prices = webResults
    .filter(result => result.price_data && result.price_data.current_price)
    .map(result => parseFloat(result.price_data.current_price))
    .filter(price => price > 0);
  
  if (prices.length === 0) return { average: 0, range: { low: 0, high: 0 } };
  
  return {
    average: prices.reduce((sum, price) => sum + price, 0) / prices.length,
    range: {
      low: Math.min(...prices),
      high: Math.max(...prices)
    }
  };
};

export const extractTechnicalSpecs = (webResults: any[]) => {
  const specs = {
    weight: null as number | null,
    diameter: null as number | null,
    composition: null as string | null
  };
  
  for (const result of webResults) {
    if (result.extracted_data) {
      if (result.extracted_data.weight && !specs.weight) {
        specs.weight = parseFloat(result.extracted_data.weight);
      }
      if (result.extracted_data.diameter && !specs.diameter) {
        specs.diameter = parseFloat(result.extracted_data.diameter);
      }
      if (result.extracted_data.composition && !specs.composition) {
        specs.composition = result.extracted_data.composition;
      }
    }
  }
  
  return specs;
};

export const extractGradingData = (webResults: any[]) => {
  const gradingData = {
    pcgs_number: null as string | null,
    ngc_number: null as string | null
  };
  
  for (const result of webResults) {
    if (result.source_type === 'pcgs' && result.extracted_data?.certification) {
      gradingData.pcgs_number = result.extracted_data.certification;
    }
    if (result.source_type === 'ngc' && result.extracted_data?.grade) {
      gradingData.ngc_number = result.extracted_data.grade;
    }
  }
  
  return gradingData;
};

export const extractPopulationData = (webResults: any[]) => {
  return webResults
    .filter(result => result.extracted_data?.population_higher !== undefined)
    .map(result => ({
      grade: result.extracted_data.grade,
      population_higher: result.extracted_data.population_higher,
      population_same: result.extracted_data.population_same,
      total_graded: result.extracted_data.total_graded
    }));
};

export const extractRecentSales = (webResults: any[]) => {
  return webResults
    .filter(result => result.price_data && result.auction_data)
    .map(result => ({
      price: result.price_data.current_price || result.price_data.realized_price,
      date: result.auction_data.sale_date || result.auction_data.end_time,
      source: result.source_type,
      grade: result.extracted_data?.grade
    }))
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 10);
};

export const extractDataSources = (webResults: any[]): string[] => {
  return [...new Set(webResults.map(result => result.source_type))];
};

export const calculateEnrichmentScore = (claudeResult: any, webResults: any[]): number => {
  let score = 0.5; // Base score from Claude
  
  if (webResults.length > 0) score += 0.2;
  if (webResults.length > 5) score += 0.1;
  if (webResults.some(r => r.source_type === 'pcgs' || r.source_type === 'ngc')) score += 0.1;
  if (webResults.some(r => r.price_data && r.price_data.current_price)) score += 0.1;
  
  return Math.min(1.0, score);
};

export const extractMarketplaceIntelligence = async (coinData: any) => {
  console.log('🏪 Extracting marketplace intelligence from user stores...');
  
  try {
    // Get marketplace data from existing user stores
    const marketHistory = await extractUserStoreData();
    
    // Analyze the coin against marketplace patterns
    const insights = generateMarketplaceInsights(coinData, marketHistory);
    
    return {
      marketplaceData: marketHistory,
      priceIntelligence: analyzePriceConsistency(coinData.estimated_value || 0, coinData, marketHistory),
      categoryValidation: validateCoinCategory(coinData.category || 'USA COINS', coinData, marketHistory),
      gradeAssessment: assessGradeReliability(coinData.grade, coinData, marketHistory),
      insights: insights.insights,
      overallConfidence: insights.overallConfidence,
      hasAdjustments: insights.recommendedAdjustments
    };
  } catch (error) {
    console.error('❌ Marketplace intelligence extraction failed:', error);
    return {
      marketplaceData: null,
      priceIntelligence: { confidence: 0.5, recommendation: 'no_data' },
      categoryValidation: { confidence: 0.5, isConsistent: true },
      gradeAssessment: { confidence: 0.5, isRealistic: true },
      insights: [],
      overallConfidence: 0.5,
      hasAdjustments: false
    };
  }
};

export const enhanceWithMarketplaceData = (claudeResult: any, webResults: any[], marketplaceIntelligence: any) => {
  console.log('🧠 Enhancing analysis with marketplace intelligence...');
  
  const enhanced = { ...claudeResult };
  
  // Price enhancement with marketplace intelligence
  if (marketplaceIntelligence.priceIntelligence?.marketAverage) {
    const marketPrice = marketplaceIntelligence.priceIntelligence.marketAverage;
    const webPrice = extractMarketPrices(webResults).average;
    
    // Weighted average: 40% Claude, 30% Web, 30% Marketplace
    enhanced.estimated_value = Math.round(
      (claudeResult.estimatedValue * 0.4) + 
      (webPrice * 0.3) + 
      (marketPrice * 0.3)
    );
    
    enhanced.price_sources = {
      claude: claudeResult.estimatedValue,
      web_discovery: webPrice,
      marketplace_intelligence: marketPrice,
      final_weighted: enhanced.estimated_value
    };
  }
  
  // Category enhancement
  if (marketplaceIntelligence.categoryValidation?.suggestedCategory && 
      !marketplaceIntelligence.categoryValidation.isConsistent) {
    enhanced.suggested_category = marketplaceIntelligence.categoryValidation.suggestedCategory;
    enhanced.category_confidence = marketplaceIntelligence.categoryValidation.confidence;
  }
  
  // Grade validation
  if (marketplaceIntelligence.gradeAssessment?.warning) {
    enhanced.grade_warnings = [marketplaceIntelligence.gradeAssessment.warning];
    enhanced.grade_reliability = marketplaceIntelligence.gradeAssessment.confidence;
  }
  
  // Add marketplace insights
  enhanced.marketplace_insights = marketplaceIntelligence.insights;
  enhanced.marketplace_confidence = marketplaceIntelligence.overallConfidence;
  
  return enhanced;
};
