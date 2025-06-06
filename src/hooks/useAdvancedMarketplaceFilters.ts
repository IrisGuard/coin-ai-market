
import { useState, useMemo } from 'react';
import { Coin } from '@/types/coin';

interface AdvancedFilters {
  searchTerm: string;
  priceRange: [number, number];
  selectedRarity: string;
  selectedCondition: string;
  selectedCountry: string;
  yearRange: [number, number];
  sortBy: string;
  showAuctionsOnly: boolean;
  showFeaturedOnly: boolean;
  showRecentlyAdded: boolean;
  minViews: number;
}

export const useAdvancedMarketplaceFilters = (coins: Coin[]) => {
  const [filters, setFilters] = useState<AdvancedFilters>({
    searchTerm: '',
    priceRange: [0, 10000],
    selectedRarity: '',
    selectedCondition: '',
    selectedCountry: '',
    yearRange: [1800, new Date().getFullYear()],
    sortBy: 'newest',
    showAuctionsOnly: false,
    showFeaturedOnly: false,
    showRecentlyAdded: false,
    minViews: 0
  });

  const filteredCoins = useMemo(() => {
    if (!coins) return [];

    let filtered = [...coins];

    // Text search
    if (filters.searchTerm) {
      const searchLower = filters.searchTerm.toLowerCase();
      filtered = filtered.filter(coin =>
        coin.name?.toLowerCase().includes(searchLower) ||
        coin.country?.toLowerCase().includes(searchLower) ||
        coin.description?.toLowerCase().includes(searchLower) ||
        coin.year?.toString().includes(filters.searchTerm)
      );
    }

    // Advanced filters
    filtered = filtered.filter(coin => {
      // Price range
      const price = coin.price || 0;
      if (price < filters.priceRange[0] || price > filters.priceRange[1]) return false;

      // Year range
      const year = coin.year || 0;
      if (year < filters.yearRange[0] || year > filters.yearRange[1]) return false;

      // Category filters
      if (filters.selectedRarity && coin.rarity !== filters.selectedRarity) return false;
      if (filters.selectedCondition && coin.condition !== filters.selectedCondition) return false;
      if (filters.selectedCountry && coin.country !== filters.selectedCountry) return false;

      // Boolean filters
      if (filters.showAuctionsOnly && !coin.is_auction) return false;
      if (filters.showFeaturedOnly && !coin.featured) return false;
      if (filters.minViews && (coin.views || 0) < filters.minViews) return false;

      // Recently added (last 7 days)
      if (filters.showRecentlyAdded) {
        const weekAgo = new Date();
        weekAgo.setDate(weekAgo.getDate() - 7);
        const coinDate = new Date(coin.created_at || '');
        if (coinDate < weekAgo) return false;
      }

      return true;
    });

    // Sorting
    filtered.sort((a, b) => {
      switch (filters.sortBy) {
        case 'price-low':
          return (a.price || 0) - (b.price || 0);
        case 'price-high':
          return (b.price || 0) - (a.price || 0);
        case 'year-old':
          return (a.year || 0) - (b.year || 0);
        case 'year-new':
          return (b.year || 0) - (a.year || 0);
        case 'name':
          return (a.name || '').localeCompare(b.name || '');
        case 'popularity':
          return (b.views || 0) - (a.views || 0);
        case 'recently-added':
          return new Date(b.created_at || '').getTime() - new Date(a.created_at || '').getTime();
        case 'ending-soon':
          if (!a.is_auction && !b.is_auction) return 0;
          if (!a.is_auction) return 1;
          if (!b.is_auction) return -1;
          return new Date(a.auction_end || '').getTime() - new Date(b.auction_end || '').getTime();
        default:
          return new Date(b.created_at || '').getTime() - new Date(a.created_at || '').getTime();
      }
    });

    return filtered;
  }, [coins, filters]);

  const updateFilter = (key: keyof AdvancedFilters, value: any) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const clearFilters = () => {
    setFilters({
      searchTerm: '',
      priceRange: [0, 10000],
      selectedRarity: '',
      selectedCondition: '',
      selectedCountry: '',
      yearRange: [1800, new Date().getFullYear()],
      sortBy: 'newest',
      showAuctionsOnly: false,
      showFeaturedOnly: false,
      showRecentlyAdded: false,
      minViews: 0
    });
  };

  const getFilterOptions = () => {
    const rarities = [...new Set(coins.map(c => c.rarity).filter(Boolean))];
    const conditions = [...new Set(coins.map(c => c.condition).filter(Boolean))];
    const countries = [...new Set(coins.map(c => c.country).filter(Boolean))];
    
    return { rarities, conditions, countries };
  };

  return {
    filters,
    filteredCoins,
    updateFilter,
    clearFilters,
    getFilterOptions,
    totalResults: filteredCoins.length,
    hasActiveFilters: Object.values(filters).some((value, index) => {
      const defaultValues = [
        '', [0, 10000], '', '', '', [1800, new Date().getFullYear()], 
        'newest', false, false, false, 0
      ];
      return JSON.stringify(value) !== JSON.stringify(defaultValues[index]);
    })
  };
};
