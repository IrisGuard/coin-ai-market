
import { generateSecureRandomNumber, generateSecureRandomId } from './secureProductionUtils';

export const generateSearchSessionId = (): string => {
  return generateSecureRandomId('search');
};

export const calculateRelevanceScore = (query: string, result: any): number => {
  const baseScore = 0.5;
  let score = baseScore;
  
  const queryWords = query.toLowerCase().split(' ');
  const resultText = `${result.name || ''} ${result.description || ''}`.toLowerCase();
  
  queryWords.forEach(word => {
    if (resultText.includes(word)) {
      score += 0.1;
    }
  });
  
  const variance = generateSecureRandomNumber(-5, 5) / 100;
  return Math.min(1, Math.max(0, score + variance));
};

export const generateSearchMetrics = (resultsCount: number) => {
  return {
    searchTime: generateSecureRandomNumber(50, 300),
    totalResults: resultsCount,
    relevanceThreshold: 0.6,
    searchQuality: calculateSearchQuality(resultsCount)
  };
};

export const generateSearchAnalytics = (searchResults: any[]) => {
  const totalResults = searchResults.length;
  const searchTime = generateSecureRandomNumber(50, 300);
  const relevanceScore = searchResults.length > 0 ? 
    searchResults.reduce((acc, result) => acc + calculateRelevanceScore('', result), 0) / totalResults : 0;
  
  // Price analysis
  const prices = searchResults.map(coin => parseFloat(coin.price || '0')).filter(p => p > 0);
  const priceRange = {
    min: prices.length > 0 ? Math.min(...prices) : 0,
    max: prices.length > 0 ? Math.max(...prices) : 0,
    average: prices.length > 0 ? prices.reduce((a, b) => a + b, 0) / prices.length : 0
  };

  // Category distribution
  const categories = searchResults.reduce((acc, coin) => {
    const category = coin.category || 'unknown';
    acc[category] = (acc[category] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  // Rarity distribution
  const rarityDistribution = searchResults.reduce((acc, coin) => {
    const rarity = coin.rarity || 'common';
    acc[rarity] = (acc[rarity] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const popularityIndex = generateSecureRandomNumber(60, 95);

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

const calculateSearchQuality = (resultsCount: number): number => {
  if (resultsCount === 0) return 0;
  if (resultsCount < 5) return 0.3;
  if (resultsCount < 20) return 0.7;
  return 0.9;
};

export const trackSearchEvent = (eventType: string, data: any) => {
  console.log('Search Analytics:', {
    event: eventType,
    timestamp: new Date().toISOString(),
    sessionId: generateSearchSessionId(),
    data
  });
};
