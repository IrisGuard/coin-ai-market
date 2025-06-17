
export const analyzePriceConsistency = (proposedPrice: number, coinData: any, marketHistory: any) => {
  console.log('💰 Analyzing price consistency with marketplace data...');
  
  const coinKey = `${coinData.name}_${coinData.year}_${coinData.grade}`;
  
  // Analyze price patterns from user stores
  const similarListings = marketHistory.averagePrices.get(coinKey) || [];
  
  if (similarListings.length === 0) {
    return {
      confidence: 0.5,
      recommendation: 'insufficient_data',
      suggestedRange: null
    };
  }
  
  const avgMarketPrice = similarListings.reduce((sum: number, price: number) => sum + price, 0) / similarListings.length;
  const priceDeviation = Math.abs(proposedPrice - avgMarketPrice) / avgMarketPrice;
  
  let confidence = 1.0;
  let recommendation = 'accurate';
  
  if (priceDeviation > 0.5) {
    confidence = 0.3;
    recommendation = 'significant_deviation';
  } else if (priceDeviation > 0.2) {
    confidence = 0.7;
    recommendation = 'moderate_deviation';
  }
  
  return {
    confidence,
    recommendation,
    marketAverage: avgMarketPrice,
    deviation: priceDeviation,
    suggestedRange: {
      low: avgMarketPrice * 0.8,
      high: avgMarketPrice * 1.2
    },
    sampleSize: similarListings.length
  };
};
