
// Define proper Source interface for GeographicSourceMap
export interface GeographicSource {
  id: string;
  name: string;
  location: {
    lat: number;
    lng: number;
  };
  type: string;
  reliability_score?: number;
}

export const calculateSourceStats = (sources: any[] | undefined) => {
  const activeSources = sources?.filter(s => s.is_active)?.length || 0;
  const avgReliability = sources?.length ? 
    (sources.reduce((sum: number, s) => sum + (s.reliability_score || 0), 0) / sources.length * 100) : 0;
  
  return { activeSources, avgReliability };
};

export const getSourceTypeBreakdown = (sources: any[] | undefined) => {
  return {
    auction_house: sources?.filter(s => s.source_type === 'auction_house').length || 0,
    grading_service: sources?.filter(s => s.source_type === 'grading_service').length || 0,
    price_guide: sources?.filter(s => s.source_type === 'price_guide').length || 0
  };
};

export const transformSourcesForGeographic = (sources: any[] | undefined): GeographicSource[] => {
  return sources?.map(source => ({
    id: source.id,
    name: source.source_name,
    location: {
      lat: 40.7128, // Default to NYC coordinates
      lng: -74.0060
    },
    type: source.source_type,
    reliability_score: source.reliability_score
  })) || [];
};
