
export const validateCoinCategory = (proposedCategory: string, coinData: any, marketHistory: any) => {
  console.log('📂 Validating category with marketplace intelligence...');
  
  const coinIdentifier = `${coinData.country}_${coinData.denomination}`;
  const categoryStats = marketHistory.categoryInsights.get(coinIdentifier) || {};
  
  const categoryFrequency = Object.entries(categoryStats)
    .sort(([,a], [,b]) => (Number(b) || 0) - (Number(a) || 0));
  
  if (categoryFrequency.length === 0) {
    return {
      confidence: 0.5,
      isConsistent: true,
      suggestedCategory: proposedCategory,
      marketPreference: null
    };
  }
  
  const mostCommonCategory = categoryFrequency[0][0];
  const totalCount = Object.values(categoryStats).reduce((sum: number, count: any) => sum + (Number(count) || 0), 0);
  const categoryPercentage = ((Number(categoryStats[mostCommonCategory]) || 0) / totalCount) * 100;
  
  const isConsistent = proposedCategory === mostCommonCategory || categoryPercentage < 60;
  
  return {
    confidence: isConsistent ? 0.9 : 0.4,
    isConsistent,
    suggestedCategory: mostCommonCategory,
    marketPreference: `${categoryPercentage.toFixed(1)}% of similar coins are in ${mostCommonCategory}`,
    alternatives: categoryFrequency.slice(0, 3).map(([cat, count]) => ({
      category: cat,
      percentage: ((Number(count) || 0) / totalCount) * 100
    }))
  };
};
