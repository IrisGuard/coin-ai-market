
export const generateSearchQueries = (claudeResult: any): string[] => {
  const queries = [];
  
  // Basic identification query
  queries.push(`${claudeResult.name} ${claudeResult.year}`);
  
  // Detailed query with country
  queries.push(`${claudeResult.year} ${claudeResult.country} ${claudeResult.denomination}`);
  
  // Grade-specific query
  if (claudeResult.grade) {
    queries.push(`${claudeResult.name} ${claudeResult.year} ${claudeResult.grade}`);
  }
  
  // Mint mark query
  if (claudeResult.mint) {
    queries.push(`${claudeResult.name} ${claudeResult.year} ${claudeResult.mint} mint`);
  }
  
  // Error coin queries
  if (claudeResult.errors && claudeResult.errors.length > 0) {
    claudeResult.errors.forEach((error: string) => {
      queries.push(`${claudeResult.year} ${claudeResult.denomination} ${error} error`);
    });
  }
  
  return queries;
};

export const determineMarketTrend = (webResults: any[]) => {
  const trendResults = webResults.filter(result => 
    result.extracted_data?.market_trend || result.source_type === 'coinworld'
  );
  
  if (trendResults.length === 0) return 'stable';
  
  const trends = trendResults.map(result => result.extracted_data?.market_trend || 'stable');
  const risingCount = trends.filter(trend => trend === 'rising').length;
  const fallingCount = trends.filter(trend => trend === 'falling').length;
  
  if (risingCount > fallingCount) return 'rising';
  if (fallingCount > risingCount) return 'falling';
  return 'stable';
};

export const confirmAnalysis = (claudeResult: any, webResults: any[]) => {
  let confirmationScore = 0;
  const totalChecks = 3;
  
  // Check name/type confirmation
  const nameMatches = webResults.some(result => 
    result.extracted_data?.title?.toLowerCase().includes(claudeResult.name.toLowerCase())
  );
  if (nameMatches) confirmationScore++;
  
  // Check year confirmation
  const yearMatches = webResults.some(result => 
    result.extracted_data?.title?.includes(claudeResult.year?.toString())
  );
  if (yearMatches) confirmationScore++;
  
  // Check grade/condition confirmation
  const gradeMatches = webResults.some(result => 
    result.extracted_data?.grade === claudeResult.grade
  );
  if (gradeMatches) confirmationScore++;
  
  return confirmationScore / totalChecks >= 0.5;
};

export const calculateEnrichmentScore = (claudeResult: any, webResults: any[]): number => {
  let score = 0.5; // Base score from Claude
  
  if (webResults.length > 0) score += 0.2;
  if (webResults.length > 5) score += 0.1;
  if (webResults.some(r => r.source_type === 'pcgs' || r.source_type === 'ngc')) score += 0.1;
  if (webResults.some(r => r.price_data && r.price_data.current_price)) score += 0.1;
  
  return Math.min(1.0, score);
};

export const getRarityScore = (rarity: string): number => {
  const rarityMap: { [key: string]: number } = {
    'Common': 1,
    'Uncommon': 3,
    'Rare': 6,
    'Very Rare': 8,
    'Ultra Rare': 10,
    'Unknown': 5
  };
  return rarityMap[rarity] || 5;
};
