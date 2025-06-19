
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
