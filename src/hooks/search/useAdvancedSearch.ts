
import { useState, useCallback, useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

interface SearchFilters {
  query: string;
  country: string;
  yearFrom: string;
  yearTo: string;
  priceFrom: string;
  priceTo: string;
  grade: string;
  rarity: string;
  category: string;
  sortBy: 'price' | 'year' | 'name' | 'rarity';
  sortOrder: 'asc' | 'desc';
}

interface Coin {
  id: string;
  name: string;
  year: number;
  country: string;
  price: number;
  grade: string;
  rarity: string;
  image: string;
  category: string;
}

export const useAdvancedSearch = () => {
  const [filters, setFilters] = useState<SearchFilters>({
    query: '',
    country: '',
    yearFrom: '',
    yearTo: '',
    priceFrom: '',
    priceTo: '',
    grade: '',
    rarity: '',
    category: '',
    sortBy: 'name',
    sortOrder: 'asc'
  });

  const [searchHistory, setSearchHistory] = useState<string[]>([]);

  // Fetch all coins with advanced filtering
  const { data: coins = [], isLoading, error } = useQuery({
    queryKey: ['coins', 'advanced-search', filters],
    queryFn: async () => {
      let query = supabase
        .from('coins')
        .select('*');

      // Apply text search
      if (filters.query) {
        query = query.or(`name.ilike.%${filters.query}%, country.ilike.%${filters.query}%, description.ilike.%${filters.query}%`);
      }

      // Apply filters
      if (filters.country) {
        query = query.eq('country', filters.country);
      }

      if (filters.yearFrom) {
        query = query.gte('year', parseInt(filters.yearFrom));
      }

      if (filters.yearTo) {
        query = query.lte('year', parseInt(filters.yearTo));
      }

      if (filters.priceFrom) {
        query = query.gte('price', parseFloat(filters.priceFrom));
      }

      if (filters.priceTo) {
        query = query.lte('price', parseFloat(filters.priceTo));
      }

      if (filters.grade) {
        query = query.eq('grade', filters.grade);
      }

      if (filters.rarity) {
        query = query.eq('rarity', filters.rarity);
      }

      if (filters.category) {
        query = query.eq('category', filters.category);
      }

      // Apply sorting
      query = query.order(filters.sortBy, { ascending: filters.sortOrder === 'asc' });

      const { data, error } = await query;

      if (error) {
        console.error('Search error:', error);
        throw error;
      }

      return data || [];
    },
    staleTime: 30000, // Cache for 30 seconds
  });

  // Get unique filter options
  const filterOptions = useMemo(() => {
    if (!coins.length) return {};

    return {
      countries: [...new Set(coins.map(coin => coin.country).filter(Boolean))].sort(),
      grades: [...new Set(coins.map(coin => coin.grade).filter(Boolean))].sort(),
      rarities: [...new Set(coins.map(coin => coin.rarity).filter(Boolean))].sort(),
      categories: [...new Set(coins.map(coin => coin.category).filter(Boolean))].sort(),
      yearRange: {
        min: Math.min(...coins.map(coin => coin.year).filter(Boolean)),
        max: Math.max(...coins.map(coin => coin.year).filter(Boolean))
      },
      priceRange: {
        min: Math.min(...coins.map(coin => coin.price).filter(Boolean)),
        max: Math.max(...coins.map(coin => coin.price).filter(Boolean))
      }
    };
  }, [coins]);

  const updateFilters = useCallback((newFilters: Partial<SearchFilters>) => {
    setFilters(prev => ({ ...prev, ...newFilters }));
  }, []);

  const clearFilters = useCallback(() => {
    setFilters({
      query: '',
      country: '',
      yearFrom: '',
      yearTo: '',
      priceFrom: '',
      priceTo: '',
      grade: '',
      rarity: '',
      category: '',
      sortBy: 'name',
      sortOrder: 'asc'
    });
  }, []);

  const addToSearchHistory = useCallback((query: string) => {
    if (query && !searchHistory.includes(query)) {
      setSearchHistory(prev => [query, ...prev.slice(0, 9)]); // Keep last 10 searches
    }
  }, [searchHistory]);

  const clearSearchHistory = useCallback(() => {
    setSearchHistory([]);
  }, []);

  const searchWithQuery = useCallback((query: string) => {
    updateFilters({ query });
    addToSearchHistory(query);
  }, [updateFilters, addToSearchHistory]);

  return {
    coins,
    isLoading,
    error,
    filters,
    filterOptions,
    searchHistory,
    updateFilters,
    clearFilters,
    searchWithQuery,
    clearSearchHistory
  };
};
