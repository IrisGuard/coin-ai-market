
import { useState, useMemo } from 'react';
import { Coin } from '@/types/coin';

interface MarketplaceFilters {
  searchTerm: string;
  selectedRarity: string | null;
  selectedCondition: string | null;
  selectedCountry: string | null;
  selectedYear: string | null;
  priceRange: [number, number];
  showAuctionsOnly: boolean;
  showFeaturedOnly: boolean;
  sortBy: 'price_asc' | 'price_desc' | 'newest' | 'oldest' | 'name' | 'views';
}

const DEFAULT_FILTERS: MarketplaceFilters = {
  searchTerm: '',
  selectedRarity: null,
  selectedCondition: null,
  selectedCountry: null,
  selectedYear: null,
  priceRange: [0, 10000],
  showAuctionsOnly: false,
  showFeaturedOnly: false,
  sortBy: 'newest'
};

export const useAdvancedMarketplaceFilters = (coins: Coin[]) => {
  const [filters, setFilters] = useState<MarketplaceFilters>(DEFAULT_FILTERS);

  const updateFilter = (key: keyof MarketplaceFilters, value: any) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const clearFilters = () => {
    setFilters(DEFAULT_FILTERS);
  };

  const filteredCoins = useMemo(() => {
    let filtered = [...coins];

    // Search filter
    if (filters.searchTerm) {
      const searchLower = filters.searchTerm.toLowerCase();
      filtered = filtered.filter(coin =>
        coin.name.toLowerCase().includes(searchLower) ||
        coin.description?.toLowerCase().includes(searchLower) ||
        coin.country?.toLowerCase().includes(searchLower)
      );
    }

    // Rarity filter
    if (filters.selectedRarity) {
      filtered = filtered.filter(coin => coin.rarity === filters.selectedRarity);
    }

    // Condition filter
    if (filters.selectedCondition) {
      filtered = filtered.filter(coin => coin.condition === filters.selectedCondition);
    }

    // Country filter
    if (filters.selectedCountry) {
      filtered = filtered.filter(coin => coin.country === filters.selectedCountry);
    }

    // Year filter
    if (filters.selectedYear) {
      filtered = filtered.filter(coin => coin.year.toString() === filters.selectedYear);
    }

    // Price range filter
    filtered = filtered.filter(coin => 
      coin.price >= filters.priceRange[0] && coin.price <= filters.priceRange[1]
    );

    // Auction filter
    if (filters.showAuctionsOnly) {
      filtered = filtered.filter(coin => coin.is_auction);
    }

    // Featured filter
    if (filters.showFeaturedOnly) {
      filtered = filtered.filter(coin => coin.featured);
    }

    // Sorting
    filtered.sort((a, b) => {
      switch (filters.sortBy) {
        case 'price_asc':
          return a.price - b.price;
        case 'price_desc':
          return b.price - a.price;
        case 'newest':
          return new Date(b.created_at || 0).getTime() - new Date(a.created_at || 0).getTime();
        case 'oldest':
          return new Date(a.created_at || 0).getTime() - new Date(b.created_at || 0).getTime();
        case 'name':
          return a.name.localeCompare(b.name);
        case 'views':
          return (b.views || 0) - (a.views || 0);
        default:
          return 0;
      }
    });

    return filtered;
  }, [coins, filters]);

  const getFilterOptions = () => {
    const rarities = [...new Set(coins.map(coin => coin.rarity))].filter(Boolean);
    const conditions = [...new Set(coins.map(coin => coin.condition))].filter(Boolean);
    const countries = [...new Set(coins.map(coin => coin.country))].filter(Boolean);
    const years = [...new Set(coins.map(coin => coin.year.toString()))].sort((a, b) => parseInt(b) - parseInt(a));

    return {
      rarities,
      conditions,
      countries,
      years
    };
  };

  const totalResults = filteredCoins.length;
  const hasActiveFilters = Object.keys(filters).some(key => {
    const value = filters[key as keyof MarketplaceFilters];
    const defaultValue = DEFAULT_FILTERS[key as keyof MarketplaceFilters];
    return JSON.stringify(value) !== JSON.stringify(defaultValue);
  });

  return {
    filters,
    filteredCoins,
    updateFilter,
    clearFilters,
    getFilterOptions,
    totalResults,
    hasActiveFilters
  };
};
