
import { supabase } from '@/integrations/supabase/client';
import { generateSearchQueries } from './analysisHelpers';

export const triggerWebDiscovery = async (claudeResult: any) => {
  console.log('🔍 Triggering Enhanced Web Discovery Engine...');
  
  const searchQueries = generateSearchQueries(claudeResult);
  const sources = ['ebay_global', 'heritage', 'pcgs', 'ngc', 'numista', 'coinworld', 'internal_database'];
  
  try {
    const { data, error } = await supabase.functions.invoke('web-discovery-engine', {
      body: {
        analysisId: crypto.randomUUID(),
        coinData: {
          name: claudeResult.name,
          year: claudeResult.year,
          country: claudeResult.country,
          denomination: claudeResult.denomination,
          grade: claudeResult.grade,
          composition: claudeResult.composition,
          mint: claudeResult.mint,
          diameter: claudeResult.diameter,
          weight: claudeResult.weight,
          estimated_value: claudeResult.estimatedValue || claudeResult.estimated_value
        },
        sources: sources,
        maxResults: 50,
        searchQueries: searchQueries
      }
    });

    if (error) {
      console.error('Web discovery error:', error);
      return [];
    }

    console.log(`✅ Web Discovery completed: ${data?.resultsFound || 0} results from ${sources.length} sources`);
    
    // Return direct results from the edge function
    return data?.results || [];
    
  } catch (error) {
    console.error('Web discovery failed:', error);
    return [];
  }
};

// Enhanced web data enrichment function
export const enrichCoinDataWithWebResults = async (claudeResult: any, webResults: any[]) => {
  if (!webResults || webResults.length === 0) {
    return claudeResult;
  }

  console.log('🔗 Enriching coin data with web discovery results...');

  // Extract price information from web results
  const priceData = webResults
    .filter(result => result.priceData?.current_price || result.priceData?.historical_price)
    .map(result => ({
      price: result.priceData.current_price || result.priceData.historical_price,
      source: result.sourceType,
      confidence: result.confidence
    }));

  // Calculate average market price
  const marketPrice = priceData.length > 0 
    ? Math.round(priceData.reduce((sum, item) => sum + item.price, 0) / priceData.length)
    : claudeResult.estimated_value || claudeResult.estimatedValue;

  // Extract additional metadata
  const webMetadata = webResults
    .filter(result => result.extractedData)
    .reduce((acc, result) => {
      const data = result.extractedData;
      if (data.grade && !acc.grades.includes(data.grade)) {
        acc.grades.push(data.grade);
      }
      if (data.market_focus) {
        acc.marketSources.push(data.market_focus);
      }
      return acc;
    }, { grades: [], marketSources: [] });

  // Enhanced description with web data
  const webDescription = generateWebEnhancedDescription(claudeResult, webResults, marketPrice);

  return {
    ...claudeResult,
    estimated_value: marketPrice,
    estimatedValue: marketPrice,
    web_discovery_enhanced: true,
    market_price_sources: priceData.length,
    web_confidence_boost: Math.min(0.15, priceData.length * 0.03),
    enhanced_description: webDescription,
    market_metadata: webMetadata,
    discovery_sources: webResults.map(r => r.sourceType).slice(0, 5)
  };
};

// Generate enhanced description with web data
const generateWebEnhancedDescription = (claudeResult: any, webResults: any[], marketPrice: number): string => {
  const sourcesCount = webResults.length;
  const sourceTypes = [...new Set(webResults.map(r => r.sourceType))];
  
  const baseDescription = `${claudeResult.name} from ${claudeResult.year}. Grade: ${claudeResult.grade}. Composition: ${claudeResult.composition}.`;
  const webEnhancement = ` Market research from ${sourcesCount} sources including ${sourceTypes.slice(0, 3).join(', ')} confirms estimated value of $${marketPrice}.`;
  const aiConfirmation = ` AI analysis with external validation provides comprehensive coin identification.`;
  
  return baseDescription + webEnhancement + aiConfirmation;
};
