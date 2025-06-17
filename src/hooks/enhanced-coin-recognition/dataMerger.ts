
import { 
  extractMarketPrices, 
  extractTechnicalSpecs, 
  extractGradingData, 
  extractPopulationData, 
  extractRecentSales,
  extractMarketplaceIntelligence,
  enhanceWithMarketplaceData
} from './dataExtraction';
import { determineMarketTrend, confirmAnalysis } from './analysisHelpers';
import { generateStructuredDescription } from './autoDescriptionGenerator';

export const mergeAnalysisData = async (claudeResult: any, webResults: any[]) => {
  console.log('🔗 Merging Claude + Web Discovery + Marketplace Intelligence for complete auto-fill...');
  
  // Start with Claude's base analysis
  let mergedData = { ...claudeResult };
  
  // Step 1: Extract marketplace intelligence from user stores
  console.log('🏪 Analyzing marketplace intelligence...');
  const marketplaceIntelligence = await extractMarketplaceIntelligence(claudeResult);
  
  if (webResults.length > 0) {
    // Extract market data from web results
    const marketPrices = extractMarketPrices(webResults);
    const technicalSpecs = extractTechnicalSpecs(webResults);
    const gradingData = extractGradingData(webResults);
    const populationData = extractPopulationData(webResults);
    
    // Enhance with real market data (prioritize over AI estimates)
    if (marketPrices.average > 0) {
      mergedData.market_value = marketPrices.average;
      mergedData.estimated_value = Math.max(mergedData.estimated_value, marketPrices.average);
      mergedData.price_range = {
        low: marketPrices.range.low,
        high: marketPrices.range.high,
        average: marketPrices.average
      };
    }
    
    // Enhance technical specifications
    if (technicalSpecs.weight && !mergedData.weight) {
      mergedData.weight = technicalSpecs.weight;
    }
    if (technicalSpecs.diameter && !mergedData.diameter) {
      mergedData.diameter = technicalSpecs.diameter;
    }
    if (technicalSpecs.composition && mergedData.composition === 'Unknown') {
      mergedData.composition = technicalSpecs.composition;
    }
    
    // Enhance grading data
    if (gradingData.pcgs_number) {
      mergedData.pcgs_number = gradingData.pcgs_number;
    }
    if (gradingData.ngc_number) {
      mergedData.ngc_number = gradingData.ngc_number;
    }
    
    // Add population and market trend data
    mergedData.population_data = populationData;
    mergedData.recent_sales = extractRecentSales(webResults);
    mergedData.market_trend = determineMarketTrend(webResults);
    
    // Boost confidence if external data confirms Claude's analysis
    if (confirmAnalysis(claudeResult, webResults)) {
      mergedData.confidence = Math.min(1.0, mergedData.confidence + 0.15);
    }
    
    // Generate comprehensive auto-description
    mergedData.auto_description = generateStructuredDescription(mergedData, webResults);
    
    // Extract error information if available
    const errorData = webResults.filter(r => 
      r.extracted_data?.errors || 
      r.extracted_data?.title?.toLowerCase().includes('error') ||
      r.extracted_data?.description?.toLowerCase().includes('error')
    );
    
    if (errorData.length > 0) {
      const detectedErrors = [];
      errorData.forEach(item => {
        if (item.extracted_data?.errors) {
          detectedErrors.push(...item.extracted_data.errors);
        }
        const errorKeywords = ['double die', 'off center', 'blank planchet', 'clipped', 'broadstrike'];
        errorKeywords.forEach(keyword => {
          if (item.extracted_data?.title?.toLowerCase().includes(keyword) ||
              item.extracted_data?.description?.toLowerCase().includes(keyword)) {
            detectedErrors.push(keyword);
          }
        });
      });
      
      if (detectedErrors.length > 0) {
        mergedData.errors = [...new Set([...(mergedData.errors || []), ...detectedErrors])];
      }
    }
  }
  
  // Step 2: Enhance with marketplace intelligence
  console.log('🧠 Applying marketplace intelligence enhancements...');
  mergedData = enhanceWithMarketplaceData(claudeResult, webResults, marketplaceIntelligence);
  
  // Add marketplace intelligence data
  mergedData.marketplace_analysis = {
    price_intelligence: marketplaceIntelligence.priceIntelligence,
    category_validation: marketplaceIntelligence.categoryValidation,
    grade_assessment: marketplaceIntelligence.gradeAssessment,
    insights: marketplaceIntelligence.insights,
    confidence: marketplaceIntelligence.overallConfidence
  };
  
  // Final confidence adjustment based on all sources
  const sources = [claudeResult.confidence];
  if (webResults.length > 0) sources.push(0.8);
  if (marketplaceIntelligence.overallConfidence > 0.5) sources.push(marketplaceIntelligence.overallConfidence);
  
  mergedData.final_confidence = sources.reduce((sum, conf) => sum + conf, 0) / sources.length;
  
  // Generate comprehensive auto-description with marketplace insights
  mergedData.auto_description = generateStructuredDescription(mergedData, webResults, marketplaceIntelligence);
  
  console.log('✅ Enhanced data merge complete with marketplace intelligence auto-fill ready data');
  return mergedData;
};
