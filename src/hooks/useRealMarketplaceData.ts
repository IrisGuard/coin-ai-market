
import { useState, useEffect, useMemo } from 'react';
import { useCoins } from './useCoins';
import { Coin } from '@/types/coin';

interface UseRealMarketplaceDataProps {
  searchTerm: string;
  selectedRarity: string;
  selectedCondition: string;
  priceRange: [number, number];
  sortBy: string;
  showAuctionsOnly: boolean;
  showFeaturedOnly: boolean;
}

export const useRealMarketplaceData = ({
  searchTerm,
  selectedRarity,
  selectedCondition,
  priceRange,
  sortBy,
  showAuctionsOnly,
  showFeaturedOnly
}: UseRealMarketplaceDataProps) => {
  const { data: coins, isLoading } = useCoins();
  const [auctionsCount, setAuctionsCount] = useState(0);
  const [featuredCount, setFeaturedCount] = useState(0);

  // Filter and sort coins based on criteria
  const filteredCoins = useMemo(() => {
    if (!coins) return [];

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

    // Rarity filter
    if (selectedRarity) {
      filtered = filtered.filter(coin => coin.rarity === selectedRarity);
    }

    // Condition filter
    if (selectedCondition) {
      filtered = filtered.filter(coin => coin.condition === selectedCondition);
    }

    // Price range filter
    filtered = filtered.filter(coin => {
      const price = coin.price || 0;
      return price >= priceRange[0] && price <= priceRange[1];
    });

    // Auction filter
    if (showAuctionsOnly) {
      filtered = filtered.filter(coin => coin.is_auction);
    }

    // Featured filter
    if (showFeaturedOnly) {
      filtered = filtered.filter(coin => coin.featured);
    }

    // Sort coins
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
  }, [coins, searchTerm, selectedRarity, selectedCondition, priceRange, sortBy, showAuctionsOnly, showFeaturedOnly]);

  // Update counts when coins change
  useEffect(() => {
    if (coins) {
      setAuctionsCount(coins.filter(coin => coin.is_auction).length);
      setFeaturedCount(coins.filter(coin => coin.featured).length);
    }
  }, [coins]);

  return {
    filteredCoins,
    loading: isLoading,
    auctionsCount,
    featuredCount
  };
};
