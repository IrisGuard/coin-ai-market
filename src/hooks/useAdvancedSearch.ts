import { useState, useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Coin, mapSupabaseCoinToCoin } from '@/types/coin';

export interface SearchFilters {
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

export interface FilterOptions {
  countries: string[];
  grades: string[];
  rarities: string[];
  categories: string[];
  yearRange: { min: number; max: number };
  priceRange: { min: number; max: number };
}

const DEFAULT_FILTERS: SearchFilters = {
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
  sortOrder: 'desc'
};

export const useAdvancedSearch = (currentPage: number = 1, coinsPerPage: number = 100) => {
  const [filters, setFilters] = useState<SearchFilters>(DEFAULT_FILTERS);
  const [isFiltersPanelOpen, setIsFiltersPanelOpen] = useState(false);

  // Get filter options from database - conditional to avoid SSR issues
  const { data: filterOptions } = useQuery<FilterOptions>({
    queryKey: ['filter-options'],
    queryFn: async () => {
      try {
        const { data: coins } = await supabase
          .from('coins')
          .select('country, grade, rarity, category, year, price');

        if (!coins) return {
          countries: [],
          grades: [],
          rarities: [],
          categories: [],
          yearRange: { min: 1800, max: 2024 },
          priceRange: { min: 0, max: 10000 }
        };

        const countries = [...new Set(coins.map(c => c.country).filter(Boolean))].sort();
        const grades = [...new Set(coins.map(c => c.grade).filter(Boolean))].sort();
        const rarities = [...new Set(coins.map(c => c.rarity).filter(Boolean))].sort();
        const categories = [...new Set(coins.map(c => c.category).filter(Boolean))].sort();
        
        const years = coins.map(c => c.year).filter(Boolean);
        const prices = coins.map(c => c.price).filter(Boolean);

        return {
          countries,
          grades,
          rarities,
          categories,
          yearRange: {
            min: Math.min(...years),
            max: Math.max(...years)
          },
          priceRange: {
            min: Math.min(...prices),
            max: Math.max(...prices)
          }
        };
      } catch (error) {
        console.warn('Filter options failed:', error);
        return {
          countries: [],
          grades: [],
          rarities: [],
          categories: [],
          yearRange: { min: 1800, max: 2024 },
          priceRange: { min: 0, max: 10000 }
        };
      }
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
    enabled: typeof window !== 'undefined', // Only run on client
  });

  // Build search query
  const searchQuery = useMemo(() => {
    let query = supabase
      .from('coins')
      .select('*')
      .eq('is_auction', false)
      .eq('listing_type', 'direct_sale');

    // Text search across multiple fields
    if (filters.query) {
      query = query.or(`name.ilike.%${filters.query}%,description.ilike.%${filters.query}%,country.ilike.%${filters.query}%`);
    }

    // Country filter
    if (filters.country) {
      query = query.eq('country', filters.country);
    }

    // Year range
    if (filters.yearFrom) {
      query = query.gte('year', parseInt(filters.yearFrom));
    }
    if (filters.yearTo) {
      query = query.lte('year', parseInt(filters.yearTo));
    }

    // Price range
    if (filters.priceFrom) {
      query = query.gte('price', parseFloat(filters.priceFrom));
    }
    if (filters.priceTo) {
      query = query.lte('price', parseFloat(filters.priceTo));
    }

    // Grade filter
    if (filters.grade) {
      query = query.eq('grade', filters.grade);
    }

    // Rarity filter
    if (filters.rarity) {
      query = query.eq('rarity', filters.rarity);
    }

    // Category filter - handle string conversion for enum
    if (filters.category) {
      query = query.eq('category', filters.category as any);
    }

    // Sorting - use created_at as default fallback
    const sortColumn = filters.sortBy === 'name' ? 'created_at' : filters.sortBy;
    query = query.order(sortColumn, { ascending: filters.sortOrder === 'asc' });

    // Pagination
    const from = (currentPage - 1) * coinsPerPage;
    const to = from + coinsPerPage - 1;
    query = query.range(from, to);

    return query;
  }, [filters, currentPage, coinsPerPage]);

  // Execute search query - conditional for SSR
  const { data: searchResults, isLoading, error } = useQuery({
    queryKey: ['advanced-search', filters, currentPage],
    queryFn: async () => {
      try {
        const result = await searchQuery;
        
        if (result.error) {
          throw result.error;
        }

        // Get total count for pagination
        let countQuery = supabase
          .from('coins')
          .select('*', { count: 'exact', head: true })
          .eq('is_auction', false)
          .eq('listing_type', 'direct_sale');

        // Apply same filters for count
        if (filters.query) {
          countQuery = countQuery.or(`name.ilike.%${filters.query}%,description.ilike.%${filters.query}%,country.ilike.%${filters.query}%`);
        }
        if (filters.country) countQuery = countQuery.eq('country', filters.country);
        if (filters.yearFrom) countQuery = countQuery.gte('year', parseInt(filters.yearFrom));
        if (filters.yearTo) countQuery = countQuery.lte('year', parseInt(filters.yearTo));
        if (filters.priceFrom) countQuery = countQuery.gte('price', parseFloat(filters.priceFrom));
        if (filters.priceTo) countQuery = countQuery.lte('price', parseFloat(filters.priceTo));
        if (filters.grade) countQuery = countQuery.eq('grade', filters.grade);
        if (filters.rarity) countQuery = countQuery.eq('rarity', filters.rarity);
        if (filters.category) countQuery = countQuery.eq('category', filters.category as any);

        const { count } = await countQuery;

        const coins = (result.data || []).map(coin => mapSupabaseCoinToCoin(coin));

        return {
          coins,
          count: count || 0
        };
      } catch (error) {
        console.warn('Search query failed:', error);
        return {
          coins: [],
          count: 0
        };
      }
    },
    staleTime: 30000, // 30 seconds cache
    refetchOnWindowFocus: true,
    enabled: typeof window !== 'undefined', // Only run on client
  });

  const updateFilters = (newFilters: Partial<SearchFilters>) => {
    setFilters(prev => ({ ...prev, ...newFilters }));
  };

  const clearFilters = () => {
    setFilters(DEFAULT_FILTERS);
  };

  const hasActiveFilters = Object.entries(filters).some(([key, value]) => 
    key !== 'sortBy' && key !== 'sortOrder' && value !== ''
  );

  return {
    filters,
    updateFilters,
    clearFilters,
    hasActiveFilters,
    searchResults: searchResults?.coins || [],
    totalCount: searchResults?.count || 0,
    isLoading,
    error,
    filterOptions: filterOptions || {
      countries: [],
      grades: [],
      rarities: [],
      categories: [],
      yearRange: { min: 1800, max: 2024 },
      priceRange: { min: 0, max: 10000 }
    },
    isFiltersPanelOpen,
    setIsFiltersPanelOpen
  };
};