
import { useCallback } from 'react';
import { Coin } from '@/types/coin';

export const useSearchSuggestions = (allCoins: Coin[] | undefined) => {
  const getSearchSuggestions = useCallback((query: string) => {
    if (!allCoins || query.length < 2) return [];

    const suggestions = new Set<string>();
    const queryLower = query.toLowerCase();

    allCoins.forEach(coin => {
      // Add coin names that match
      if (coin.name?.toLowerCase().includes(queryLower)) {
        suggestions.add(coin.name);
      }
      
      // Add countries that match
      if (coin.country?.toLowerCase().includes(queryLower)) {
        suggestions.add(coin.country);
      }
      
      // Add years that match
      if (coin.year?.toString().includes(query)) {
        suggestions.add(coin.year.toString());
      }
    });

    return Array.from(suggestions).slice(0, 10);
  }, [allCoins]);

  return { getSearchSuggestions };
};
