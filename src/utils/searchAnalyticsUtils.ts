
export const generateSearchAnalytics = (searchResults: any[]) => {
  return {
    totalResults: searchResults.length,
    searchTime: Math.round((Math.random() * 0.5 + 0.1) * 100) / 100, // 0.1-0.6 seconds
    relevanceScore: Math.round(Math.random() * 30 + 70), // 70-100%
    popularityIndex: Math.round(Math.random() * 40 + 60), // 60-100%
    priceRange: {
      min: Math.min(...searchResults.map(r => r.price || 0)),
      max: Math.max(...searchResults.map(r => r.price || 0)),
      average: searchResults.reduce((sum, r) => sum + (r.price || 0), 0) / searchResults.length
    },
    categories: {
      'Silver Coins': Math.round(searchResults.length * 0.4),
      'Gold Coins': Math.round(searchResults.length * 0.2),
      'Copper Coins': Math.round(searchResults.length * 0.3),
      'Other': Math.round(searchResults.length * 0.1)
    },
    rarityDistribution: {
      'Common': Math.round(searchResults.length * 0.5),
      'Uncommon': Math.round(searchResults.length * 0.3),
      'Rare': Math.round(searchResults.length * 0.15),
      'Ultra Rare': Math.round(searchResults.length * 0.05)
    }
  };
};
