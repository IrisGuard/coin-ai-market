
import { useState, useCallback, useEffect } from 'react';

interface SearchState {
  query: string;
  isSearching: boolean;
  recentSearches: string[];
  popularSearches: string[];
  suggestions: string[];
}

export const useSearchEnhancement = () => {
  const [searchState, setSearchState] = useState<SearchState>({
    query: '',
    isSearching: false,
    recentSearches: [],
    popularSearches: [
      'Morgan Silver Dollar',
      'Mercury Dime', 
      'Walking Liberty',
      'Indian Head Penny',
      'Buffalo Nickel',
      'Peace Dollar',
      'Standing Liberty',
      'Barber Dime'
    ],
    suggestions: []
  });

  // Load recent searches from localStorage
  useEffect(() => {
    const savedSearches = localStorage.getItem('coinvision-recent-searches');
    if (savedSearches) {
      try {
        const parsed = JSON.parse(savedSearches);
        setSearchState(prev => ({ ...prev, recentSearches: parsed }));
      } catch (error) {
        console.error('Failed to parse recent searches:', error);
      }
    }
  }, []);

  // Save search to recent searches
  const saveSearch = useCallback((query: string) => {
    if (!query.trim()) return;

    setSearchState(prev => {
      const newRecentSearches = [
        query,
        ...prev.recentSearches.filter(search => search !== query)
      ].slice(0, 10); // Keep only last 10 searches

      // Save to localStorage
      localStorage.setItem('coinvision-recent-searches', JSON.stringify(newRecentSearches));

      return {
        ...prev,
        recentSearches: newRecentSearches
      };
    });
  }, []);

  // Generate suggestions based on query
  const generateSuggestions = useCallback((query: string) => {
    if (!query.trim()) return [];

    const allSuggestions = [
      ...searchState.popularSearches,
      ...searchState.recentSearches
    ];

    return allSuggestions
      .filter(suggestion => 
        suggestion.toLowerCase().includes(query.toLowerCase())
      )
      .slice(0, 8);
  }, [searchState.popularSearches, searchState.recentSearches]);

  // Perform search
  const performSearch = useCallback((query: string) => {
    if (!query.trim()) return;

    setSearchState(prev => ({ ...prev, isSearching: true }));
    
    // Save to recent searches
    saveSearch(query);

    // Simulate search delay
    setTimeout(() => {
      setSearchState(prev => ({ ...prev, isSearching: false }));
      
      // Navigate to search results or trigger search callback
      console.log('Searching for:', query);
      
      // Here you would typically navigate to search results
      // or trigger a search callback
    }, 500);
  }, [saveSearch]);

  // Update query and suggestions
  const updateQuery = useCallback((query: string) => {
    setSearchState(prev => ({
      ...prev,
      query,
      suggestions: generateSuggestions(query)
    }));
  }, [generateSuggestions]);

  // Clear search
  const clearSearch = useCallback(() => {
    setSearchState(prev => ({
      ...prev,
      query: '',
      suggestions: []
    }));
  }, []);

  // Clear recent searches
  const clearRecentSearches = useCallback(() => {
    localStorage.removeItem('coinvision-recent-searches');
    setSearchState(prev => ({ ...prev, recentSearches: [] }));
  }, []);

  return {
    searchState,
    updateQuery,
    performSearch,
    clearSearch,
    clearRecentSearches,
    generateSuggestions
  };
};
