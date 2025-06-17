

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
  const totalCount: number = Object.values(categoryStats).reduce((sum: number, count: any) => {
    return sum + (typeof count === 'number' ? count : Number(count) || 0);
  }, 0);
  const mostCommonCategoryCount = Number(categoryStats[mostCommonCategory]) || 0;
  const categoryPercentage = totalCount > 0 ? (mostCommonCategoryCount / totalCount) * 100 : 0;
  
  const isConsistent = proposedCategory === mostCommonCategory || categoryPercentage < 60;
  
  return {
    confidence: isConsistent ? 0.9 : 0.4,
    isConsistent,
    suggestedCategory: mostCommonCategory,
    marketPreference: `${categoryPercentage.toFixed(1)}% of similar coins are in ${mostCommonCategory}`,
    alternatives: categoryFrequency.slice(0, 3).map(([cat, count]) => ({
      category: cat,
      percentage: totalCount > 0 ? ((Number(count) || 0) / totalCount) * 100 : 0
    }))
  };
};

