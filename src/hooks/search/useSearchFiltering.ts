
import { useMemo } from 'react';
import { Coin } from '@/types/coin';

interface SearchParams {
  query: string;
  priceRange: [number, number];
  yearRange: [number, number];
  country: string;
  rarity: string;
  condition: string;
  mintMark: string;
  hasImage: boolean;
  isAuction: boolean;
  hasGrading: boolean;
  sortBy: string;
}

export const useSearchFiltering = (allCoins: Coin[] | undefined, params: SearchParams) => {
  const filteredCoins = useMemo(() => {
    if (!allCoins) return [];

    let filtered = [...allCoins];

    // Text search with fuzzy matching
    if (params.query) {
      const query = params.query.toLowerCase();
      filtered = filtered.filter(coin => {
        const searchableText = [
          coin.name,
          coin.country,
          coin.description,
          coin.year?.toString(),
          coin.rarity,
          coin.condition
        ].filter(Boolean).join(' ').toLowerCase();

        // Check for exact matches first (higher relevance)
        if (searchableText.includes(query)) return true;

        // Check for partial word matches
        const queryWords = query.split(' ');
        return queryWords.some(word => 
          searchableText.includes(word) && word.length > 2
        );
      });
    }

    // Apply filters
    filtered = filtered.filter(coin => {
      // Price range
      const price = coin.price || 0;
      if (price < params.priceRange[0] || price > params.priceRange[1]) return false;

      // Year range
      const year = coin.year || 0;
      if (year < params.yearRange[0] || year > params.yearRange[1]) return false;

      // Category filters
      if (params.country && coin.country !== params.country) return false;
      if (params.rarity && coin.rarity !== params.rarity) return false;
      if (params.condition && coin.condition !== params.condition) return false;

      // Boolean filters
      if (params.hasImage && !coin.image) return false;
      if (params.isAuction && !coin.is_auction) return false;
      if (params.hasGrading && !coin.grade) return false;

      return true;
    });

    return filtered;
  }, [allCoins, params]);

  return filteredCoins;
};
