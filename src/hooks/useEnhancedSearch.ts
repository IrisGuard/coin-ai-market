
import { useState, useEffect, useMemo } from 'react';
import { useCoins } from './useCoins';
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

export const useEnhancedSearch = () => {
  const { data: allCoins, isLoading } = useCoins();
  const [searchParams, setSearchParams] = useState<SearchParams>({
    query: '',
    priceRange: [0, 10000],
    yearRange: [1800, 2024],
    country: '',
    rarity: '',
    condition: '',
    mintMark: '',
    hasImage: true,
    isAuction: false,
    hasGrading: false,
    sortBy: 'relevance'
  });
  
  const [searchResults, setSearchResults] = useState<Coin[]>([]);
  const [searchTime, setSearchTime] = useState(0);
  const [searchHistory, setSearchHistory] = useState<string[]>([]);

  // Enhanced search function with fuzzy matching and relevance scoring
  const performSearch = useMemo(() => {
    return (params: SearchParams) => {
      const startTime = Date.now();
      
      if (!allCoins) {
        setSearchResults([]);
        return;
      }

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

      // Calculate relevance scores and sort
      const scoredResults = filtered.map(coin => {
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

      // Sort by relevance and other criteria
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

      const endTime = Date.now();
      setSearchTime((endTime - startTime) / 1000);
      setSearchResults(scoredResults);

      // Add to search history
      if (params.query && !searchHistory.includes(params.query)) {
        setSearchHistory(prev => [params.query, ...prev.slice(0, 9)]); // Keep last 10 searches
      }
    };
  }, [allCoins, searchHistory]);

  const search = (params: SearchParams) => {
    setSearchParams(params);
    performSearch(params);
  };

  // Auto-search when coins data changes
  useEffect(() => {
    if (searchParams.query || Object.values(searchParams).some(v => 
      v !== '' && JSON.stringify(v) !== JSON.stringify([0, 10000]) && 
      JSON.stringify(v) !== JSON.stringify([1800, 2024]) && v !== false && v !== 'relevance'
    )) {
      performSearch(searchParams);
    }
  }, [performSearch, searchParams]);

  const getSearchSuggestions = (query: string) => {
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
  };

  const clearSearch = () => {
    setSearchParams({
      query: '',
      priceRange: [0, 10000],
      yearRange: [1800, 2024],
      country: '',
      rarity: '',
      condition: '',
      mintMark: '',
      hasImage: true,
      isAuction: false,
      hasGrading: false,
      sortBy: 'relevance'
    });
    setSearchResults([]);
    setSearchTime(0);
  };

  return {
    search,
    searchResults,
    searchParams,
    searchTime,
    searchHistory,
    isLoading,
    getSearchSuggestions,
    clearSearch
  };
};
