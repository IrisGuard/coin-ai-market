
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
