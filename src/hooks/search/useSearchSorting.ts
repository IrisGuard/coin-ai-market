
import { useMemo } from 'react';
import { Coin } from '@/types/coin';

interface SearchParams {
  query: string;
  sortBy: string;
}

export const useSearchSorting = (filteredCoins: Coin[], params: SearchParams) => {
  const sortedCoins = useMemo(() => {
    // Calculate relevance scores
    const scoredResults = filteredCoins.map(coin => {
      let relevanceScore = 0;
      
      if (params.query) {
        const query = params.query.toLowerCase();
        const name = coin.name?.toLowerCase() || '';
        const description = coin.description?.toLowerCase() || '';
        
        // Exact name match gets highest score
        if (name.includes(query)) relevanceScore += 100;
        
        // Description match gets medium score
        if (description.includes(query)) relevanceScore += 50;
        
        // Year match
        if (coin.year?.toString().includes(params.query)) relevanceScore += 75;
        
        // Country match
        if (coin.country?.toLowerCase().includes(query)) relevanceScore += 60;
      }

      // Boost score for featured items
      if (coin.featured) relevanceScore += 25;
      
      // Boost score for items with images
      if (coin.image) relevanceScore += 10;
      
      // Boost score for graded items
      if (coin.grade) relevanceScore += 15;

      return { ...coin, relevanceScore };
    });

    // Sort by selected criteria
    scoredResults.sort((a, b) => {
      switch (params.sortBy) {
        case 'relevance':
          return b.relevanceScore - a.relevanceScore;
        case 'price-low':
          return (a.price || 0) - (b.price || 0);
        case 'price-high':
          return (b.price || 0) - (a.price || 0);
        case 'year-old':
          return (a.year || 0) - (b.year || 0);
        case 'year-new':
          return (b.year || 0) - (a.year || 0);
        case 'popularity':
          return (b.views || 0) - (a.views || 0);
        case 'recently-added':
          return new Date(b.created_at || '').getTime() - new Date(a.created_at || '').getTime();
        default:
          return b.relevanceScore - a.relevanceScore;
      }
    });

    return scoredResults;
  }, [filteredCoins, params.query, params.sortBy]);

  return sortedCoins;
};
