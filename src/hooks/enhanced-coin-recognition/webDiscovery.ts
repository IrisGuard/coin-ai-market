
import { supabase } from '@/integrations/supabase/client';
import { generateSearchQueries } from './analysisHelpers';

export const triggerWebDiscovery = async (claudeResult: any) => {
  console.log('🔍 Triggering Web Discovery Engine...');
  
  const searchQueries = generateSearchQueries(claudeResult);
  const sources = ['ebay_global', 'heritage', 'pcgs', 'ngc', 'numista', 'coinworld'];
  
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
        estimated_value: claudeResult.estimatedValue
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

  // Get the actual results from the database
  const { data: results } = await supabase
    .from('web_discovery_results')
    .select('*')
    .eq('analysis_id', data.analysisId)
    .order('coin_match_confidence', { ascending: false });

  return results || [];
};
