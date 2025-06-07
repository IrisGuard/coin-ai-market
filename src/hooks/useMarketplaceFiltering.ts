
import { useState, useMemo } from 'react';
import { Coin } from '@/types/coin';

export const useMarketplaceFiltering = (coins: Coin[]) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCondition, setSelectedCondition] = useState('');
  const [selectedRarity, setSelectedRarity] = useState('');
  const [sortBy, setSortBy] = useState('newest');
  const [showAuctionsOnly, setShowAuctionsOnly] = useState(false);
  const [showFeaturedOnly, setShowFeaturedOnly] = useState(false);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  // Filter and sort coins
  const filteredCoins = useMemo(() => {
    let filtered = [...coins];

    // Search filter
    if (searchTerm) {
      const searchLower = searchTerm.toLowerCase();
      filtered = filtered.filter(coin =>
        coin.name?.toLowerCase().includes(searchLower) ||
        coin.country?.toLowerCase().includes(searchLower) ||
        coin.description?.toLowerCase().includes(searchLower) ||
        coin.year?.toString().includes(searchTerm)
      );
    }

    // Condition filter
    if (selectedCondition) {
      filtered = filtered.filter(coin => coin.condition === selectedCondition);
    }

    // Rarity filter
    if (selectedRarity) {
      filtered = filtered.filter(coin => coin.rarity === selectedRarity);
    }

    // Auctions filter
    if (showAuctionsOnly) {
      filtered = filtered.filter(coin => coin.is_auction);
    }

    // Featured filter
    if (showFeaturedOnly) {
      filtered = filtered.filter(coin => coin.featured);
    }

    // Sort
    filtered.sort((a, b) => {
      switch (sortBy) {
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
        case 'newest':
        default:
          return new Date(b.created_at || '').getTime() - new Date(a.created_at || '').getTime();
      }
    });

    return filtered;
  }, [coins, searchTerm, selectedCondition, selectedRarity, sortBy, showAuctionsOnly, showFeaturedOnly]);

  const clearFilters = () => {
    setSearchTerm('');
    setSelectedCondition('');
    setSelectedRarity('');
    setSortBy('newest');
    setShowAuctionsOnly(false);
    setShowFeaturedOnly(false);
  };

  return {
    searchTerm,
    setSearchTerm,
    selectedCondition,
    setSelectedCondition,
    selectedRarity,
    setSelectedRarity,
    sortBy,
    setSortBy,
    showAuctionsOnly,
    setShowAuctionsOnly,
    showFeaturedOnly,
    setShowFeaturedOnly,
    viewMode,
    setViewMode,
    filteredCoins,
    clearFilters
  };
};
