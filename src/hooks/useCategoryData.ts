
import { useState, useMemo } from 'react';
import { useCachedMarketplaceData } from './useCachedMarketplaceData';
import { Coin } from '@/types/coin';

interface CategoryFilters {
  searchTerm: string;
  sortBy: string;
  priceRange: [number, number];
  yearRange: [number, number];
  selectedCountry: string;
  selectedCondition: string;
  selectedRarity: string;
  showAuctionsOnly: boolean;
  showFeaturedOnly: boolean;
}

const DEFAULT_FILTERS: CategoryFilters = {
  searchTerm: '',
  sortBy: 'newest',
  priceRange: [0, 10000],
  yearRange: [1800, 2024],
  selectedCountry: '',
  selectedCondition: '',
  selectedRarity: '',
  showAuctionsOnly: false,
  showFeaturedOnly: false
};

export const useCategoryData = (category: string) => {
  const { coins, isLoading } = useCachedMarketplaceData();
  const [filters, setFilters] = useState<CategoryFilters>(DEFAULT_FILTERS);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  // Filter coins by category
  const categoryCoins = useMemo(() => {
    if (!coins) return [];
    
    return coins.filter(coin => {
      switch (category) {
        case 'ancient':
          return coin.year < 1000;
        case 'modern':
          return coin.year >= 1900;
        case 'error':
          return coin.rarity?.toLowerCase().includes('rare') || 
                 coin.description?.toLowerCase().includes('error') ||
                 coin.description?.toLowerCase().includes('doubled') ||
                 coin.name?.toLowerCase().includes('error') ||
                 coin.name?.toLowerCase().includes('doubled');
        case 'graded':
          return coin.pcgs_grade || coin.ngc_grade;
        case 'trending':
          return (coin.views && coin.views > 50) || coin.featured;
        case 'european':
          return ['Germany', 'France', 'Italy', 'Spain', 'Greece', 'United Kingdom', 
                  'Netherlands', 'Austria', 'Switzerland', 'Belgium', 'Portugal',
                  'Roman Empire', 'Ancient Greece'].includes(coin.country || '');
        case 'american':
          return ['United States', 'Canada', 'Mexico'].includes(coin.country || '');
        case 'asian':
          return ['China', 'Japan', 'India', 'Korea', 'Thailand', 'Singapore', 
                  'Vietnam', 'Philippines', 'Malaysia', 'Indonesia'].includes(coin.country || '');
        case 'gold':
          return coin.composition?.toLowerCase().includes('gold') ||
                 coin.name?.toLowerCase().includes('gold') ||
                 coin.description?.toLowerCase().includes('gold');
        case 'silver':
          return coin.composition?.toLowerCase().includes('silver') ||
                 coin.name?.toLowerCase().includes('silver') ||
                 coin.description?.toLowerCase().includes('silver');
        case 'rare':
          return coin.rarity?.toLowerCase().includes('rare') || coin.price > 1000;
        case 'auctions':
          return coin.is_auction;
        default:
          return true;
      }
    });
  }, [coins, category]);

  // Apply filters and sorting
  const filteredCoins = useMemo(() => {
    let filtered = [...categoryCoins];

    // Search filter
    if (filters.searchTerm) {
      const searchLower = filters.searchTerm.toLowerCase();
      filtered = filtered.filter(coin =>
        coin.name?.toLowerCase().includes(searchLower) ||
        coin.country?.toLowerCase().includes(searchLower) ||
        coin.description?.toLowerCase().includes(searchLower) ||
        coin.year?.toString().includes(filters.searchTerm)
      );
    }

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

    // Price range filter
    filtered = filtered.filter(coin => {
      const price = coin.price || 0;
      return price >= filters.priceRange[0] && price <= filters.priceRange[1];
    });

    // Year range filter
    filtered = filtered.filter(coin => {
      const year = coin.year || 0;
      return year >= filters.yearRange[0] && year <= filters.yearRange[1];
    });

    // Auction filter
    if (filters.showAuctionsOnly) {
      filtered = filtered.filter(coin => coin.is_auction);
    }

    // Featured filter
    if (filters.showFeaturedOnly) {
      filtered = filtered.filter(coin => coin.featured);
    }

    // Sort
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
        case 'popularity':
          return (b.views || 0) - (a.views || 0);
        case 'rarity':
          const rarityOrder = { 'Common': 1, 'Uncommon': 2, 'Rare': 3, 'Very Rare': 4, 'Extremely Rare': 5 };
          return (rarityOrder[b.rarity as keyof typeof rarityOrder] || 0) - (rarityOrder[a.rarity as keyof typeof rarityOrder] || 0);
        case 'oldest':
          return (a.year || 0) - (b.year || 0);
        case 'newest':
        default:
          return new Date(b.created_at || '').getTime() - new Date(a.created_at || '').getTime();
      }
    });

    return filtered;
  }, [categoryCoins, filters]);

  // Category statistics
  const categoryStats = useMemo(() => {
    if (!categoryCoins.length) {
      return {
        totalCoins: 0,
        averagePrice: 0,
        priceRange: { min: 0, max: 0 },
        mostExpensive: null,
        oldestCoin: null,
        newestCoin: null,
        totalAuctions: 0,
        featuredCount: 0
      };
    }

    const prices = categoryCoins.map(coin => coin.price || 0).filter(price => price > 0);
    const years = categoryCoins.map(coin => coin.year).filter(Boolean);
    
    const mostExpensive = categoryCoins.reduce((max, coin) => 
      (coin.price || 0) > (max.price || 0) ? coin : max
    );
    
    const oldestCoin = categoryCoins.reduce((oldest, coin) => 
      coin.year < oldest.year ? coin : oldest
    );
    
    const newestCoin = categoryCoins.reduce((newest, coin) => 
      coin.year > newest.year ? coin : newest
    );

    return {
      totalCoins: categoryCoins.length,
      averagePrice: prices.length ? prices.reduce((sum, price) => sum + price, 0) / prices.length : 0,
      priceRange: {
        min: prices.length ? Math.min(...prices) : 0,
        max: prices.length ? Math.max(...prices) : 0
      },
      mostExpensive: mostExpensive.price ? { name: mostExpensive.name, price: mostExpensive.price } : null,
      oldestCoin: oldestCoin.year ? { name: oldestCoin.name, year: oldestCoin.year } : null,
      newestCoin: newestCoin.year ? { name: newestCoin.name, year: newestCoin.year } : null,
      totalAuctions: categoryCoins.filter(coin => coin.is_auction).length,
      featuredCount: categoryCoins.filter(coin => coin.featured).length
    };
  }, [categoryCoins]);

  const updateFilter = (key: keyof CategoryFilters, value: any) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const clearAllFilters = () => {
    setFilters(DEFAULT_FILTERS);
  };

  const activeFiltersCount = Object.keys(filters).filter(key => {
    const value = filters[key as keyof CategoryFilters];
    const defaultValue = DEFAULT_FILTERS[key as keyof CategoryFilters];
    return JSON.stringify(value) !== JSON.stringify(defaultValue);
  }).length;

  return {
    coins: filteredCoins,
    categoryCoins,
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
