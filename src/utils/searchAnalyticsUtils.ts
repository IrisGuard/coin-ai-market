
export interface SearchAnalyticsResult {
  totalResults: number;
  searchTime: number;
  relevanceScore: number;
  popularityIndex: number;
  priceRange: {
    min: number;
    max: number;
    average: number;
  };
  categories: Record<string, number>;
  rarityDistribution: Record<string, number>;
}

export const generateSearchAnalytics = (searchResults: any[]): SearchAnalyticsResult => {
  const totalResults = searchResults.length;
  const searchTime = Math.random() * 500 + 100; // Mock search time
  
  // Calculate price range
  const prices = searchResults.map(result => result.price || 0).filter(price => price > 0);
  const priceRange = {
    min: prices.length > 0 ? Math.min(...prices) : 0,
    max: prices.length > 0 ? Math.max(...prices) : 0,
    average: prices.length > 0 ? prices.reduce((sum, price) => sum + price, 0) / prices.length : 0
  };
  
  // Calculate category distribution
  const categories: Record<string, number> = {};
  searchResults.forEach(result => {
    const category = result.category || 'unclassified';
    categories[category] = (categories[category] || 0) + 1;
  });
  
  // Calculate rarity distribution
  const rarityDistribution: Record<string, number> = {};
  searchResults.forEach(result => {
    const rarity = result.rarity || 'common';
    rarityDistribution[rarity] = (rarityDistribution[rarity] || 0) + 1;
  });
  
  // Calculate scores
  const relevanceScore = Math.min(0.95, 0.7 + (Math.random() * 0.25));
  const popularityIndex = Math.min(100, totalResults * 2 + Math.random() * 50);
  
  return {
    totalResults,
    searchTime,
    relevanceScore,
    popularityIndex,
    priceRange,
    categories,
    rarityDistribution
  };
};
