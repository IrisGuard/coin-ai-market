import { useState, useEffect, useMemo } from 'react';
import { Coin } from '@/types/coin';
import { useCachedMarketplaceData } from './useCachedMarketplaceData';

export interface CategoryFilters {
  searchTerm: string;
  sortBy: string;
  priceRange: [number, number];
  yearRange: [number, number];
  selectedCountry: string | null;
  selectedCondition: string | null;
  selectedRarity: string | null;
  showAuctionsOnly: boolean;
  showFeaturedOnly: boolean;
}

export interface CategoryStats {
  totalCoins: number;
  averagePrice: number;
  priceRange: [number, number];
  mostExpensive: Coin | null;
  oldestCoin: Coin | null;
  newestCoin: Coin | null;
  totalAuctions: number;
  featuredCount: number;
}

export const useCategoryData = (category: string) => {
  const { coins: allCoins, isLoading } = useCachedMarketplaceData();
  
  const [filters, setFilters] = useState<CategoryFilters>({
    searchTerm: '',
    sortBy: 'newest',
    priceRange: [0, 10000],
    yearRange: [0, 2024],
    selectedCountry: null,
    selectedCondition: null,
    selectedRarity: null,
    showAuctionsOnly: false,
    showFeaturedOnly: false
  });

  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  // Filter coins by category
  const categoryCoins = useMemo(() => {
    if (!allCoins || allCoins.length === 0) return [];

    console.log(`Filtering ${allCoins.length} coins for category: ${category}`);

    return allCoins.filter(coin => {
      // Ensure coin has required properties before filtering
      if (!coin.id || !coin.name || typeof coin.price !== 'number') return false;

      switch (category) {
        case 'ancient':
          return coin.year < 1000;
        case 'modern':
          return coin.year >= 1900;
        case 'error':
          return coin.description?.toLowerCase().includes('error') ||
                 coin.description?.toLowerCase().includes('λάθος') ||
                 coin.name.toLowerCase().includes('error');
        case 'graded':
          return coin.pcgs_grade || coin.ngc_grade;
        case 'trending':
          return (coin.views || 0) > 50;
        case 'european':
          return ['Germany', 'France', 'Italy', 'Spain', 'Greece', 'United Kingdom'].includes(coin.country || '');
        case 'american':
          return ['United States', 'Canada', 'Mexico'].includes(coin.country || '');
        case 'asian':
          return ['China', 'Japan', 'India', 'Korea', 'Thailand'].includes(coin.country || '');
        case 'gold':
          return coin.composition?.toLowerCase().includes('gold') ||
                 coin.composition?.toLowerCase().includes('χρυσό');
        case 'silver':
          return coin.composition?.toLowerCase().includes('silver') ||
                 coin.composition?.toLowerCase().includes('ασήμι');
        case 'rare':
          return coin.rarity === 'Rare' || coin.rarity === 'Ultra Rare';
        default:
          return true;
      }
    });
  }, [allCoins, category]);

  // Apply filters
  const filteredCoins = useMemo(() => {
    if (!categoryCoins) return [];

    let filtered = [...categoryCoins];

    // Search filter
    if (filters.searchTerm) {
      const searchLower = filters.searchTerm.toLowerCase();
      filtered = filtered.filter(coin =>
        coin.name.toLowerCase().includes(searchLower) ||
        (coin.description && coin.description.toLowerCase().includes(searchLower)) ||
        (coin.country && coin.country.toLowerCase().includes(searchLower))
      );
    }

    // Price range filter
    filtered = filtered.filter(coin =>
      coin.price >= filters.priceRange[0] && coin.price <= filters.priceRange[1]
    );

    // Year range filter
    filtered = filtered.filter(coin =>
      coin.year >= filters.yearRange[0] && coin.year <= filters.yearRange[1]
    );

    // Country filter
    if (filters.selectedCountry) {
      filtered = filtered.filter(coin => coin.country === filters.selectedCountry);
    }

    // Condition filter
    if (filters.selectedCondition) {
      filtered = filtered.filter(coin => coin.condition === filters.selectedCondition);
    }

    // Rarity filter
    if (filters.selectedRarity) {
      filtered = filtered.filter(coin => coin.rarity === filters.selectedRarity);
    }

    // Auctions only filter
    if (filters.showAuctionsOnly) {
      filtered = filtered.filter(coin => coin.is_auction);
    }

    // Featured only filter
    if (filters.showFeaturedOnly) {
      filtered = filtered.filter(coin => coin.featured);
    }

    // Sort
    switch (filters.sortBy) {
      case 'price-low':
        filtered.sort((a, b) => a.price - b.price);
        break;
      case 'price-high':
        filtered.sort((a, b) => b.price - a.price);
        break;
      case 'year-old':
        filtered.sort((a, b) => a.year - b.year);
        break;
      case 'year-new':
        filtered.sort((a, b) => b.year - a.year);
        break;
      case 'name':
        filtered.sort((a, b) => a.name.localeCompare(b.name));
        break;
      case 'newest':
      default:
        filtered.sort((a, b) => new Date(b.created_at || '').getTime() - new Date(a.created_at || '').getTime());
        break;
    }

    return filtered;
  }, [categoryCoins, filters]);

  // Calculate category statistics
  const categoryStats: CategoryStats = useMemo(() => {
    if (!categoryCoins || categoryCoins.length === 0) {
      return {
        totalCoins: 0,
        averagePrice: 0,
        priceRange: [0, 0] as [number, number],
        mostExpensive: null,
        oldestCoin: null,
        newestCoin: null,
        totalAuctions: 0,
        featuredCount: 0
      };
    }

    const prices = categoryCoins.map(coin => coin.price);
    const years = categoryCoins.map(coin => coin.year);
    
    const mostExpensive = categoryCoins.reduce((max, coin) => 
      coin.price > max.price ? coin : max, categoryCoins[0]);
    
    const oldestCoin = categoryCoins.reduce((oldest, coin) => 
      coin.year < oldest.year ? coin : oldest, categoryCoins[0]);
    
    const newestCoin = categoryCoins.reduce((newest, coin) => 
      coin.year > newest.year ? coin : newest, categoryCoins[0]);

    return {
      totalCoins: categoryCoins.length,
      averagePrice: prices.reduce((sum, price) => sum + price, 0) / prices.length,
      priceRange: [Math.min(...prices), Math.max(...prices)] as [number, number],
      mostExpensive,
      oldestCoin,
      newestCoin,
      totalAuctions: categoryCoins.filter(coin => coin.is_auction).length,
      featuredCount: categoryCoins.filter(coin => coin.featured).length
    };
  }, [categoryCoins]);

  const updateFilter = (key: keyof CategoryFilters, value: any) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const clearAllFilters = () => {
    setFilters({
      searchTerm: '',
      sortBy: 'newest',
      priceRange: [0, 10000],
      yearRange: [0, 2024],
      selectedCountry: null,
      selectedCondition: null,
      selectedRarity: null,
      showAuctionsOnly: false,
      showFeaturedOnly: false
    });
  };

  const activeFiltersCount = useMemo(() => {
    let count = 0;
    if (filters.searchTerm) count++;
    if (filters.selectedCountry) count++;
    if (filters.selectedCondition) count++;
    if (filters.selectedRarity) count++;
    if (filters.showAuctionsOnly) count++;
    if (filters.showFeaturedOnly) count++;
    if (filters.priceRange[0] > 0 || filters.priceRange[1] < 10000) count++;
    if (filters.yearRange[0] > 0 || filters.yearRange[1] < 2024) count++;
    return count;
  }, [filters]);

  return {
    coins: filteredCoins,
    categoryStats,
    filters,
    updateFilter,
    clearAllFilters,
    activeFiltersCount,
    viewMode,
    setViewMode,
    isLoading
  };
};
