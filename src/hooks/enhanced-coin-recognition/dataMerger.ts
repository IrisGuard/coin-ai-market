
import { 
  extractMarketPrices, 
  extractTechnicalSpecs, 
  extractGradingData, 
  extractPopulationData, 
  extractRecentSales 
} from './dataExtraction';
import { determineMarketTrend, confirmAnalysis } from './analysisHelpers';

export const mergeAnalysisData = async (claudeResult: any, webResults: any[]) => {
  console.log('🔗 Merging Claude + Web Discovery data...');
  
  // Start with Claude's base analysis
  const mergedData = { ...claudeResult };
  
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
  }
  
  return mergedData;
};
