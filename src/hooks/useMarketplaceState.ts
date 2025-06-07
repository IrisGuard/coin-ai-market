
import { useState } from 'react';
import { useCoins } from './useCoins';
import { useAdvancedMarketplaceFilters } from './useAdvancedMarketplaceFilters';
import { useRealTimeMarketplace } from './useRealTimeMarketplace';

export const useMarketplaceState = () => {
  const { data: coins = [], isLoading: coinsLoading } = useCoins();
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  
  const {
    filters,
    filteredCoins,
    updateFilter,
    clearFilters,
    getFilterOptions,
    totalResults,
    hasActiveFilters
  } = useAdvancedMarketplaceFilters(coins);

  const realTimeUpdates = useRealTimeMarketplace(coins);

  const enhancedCoins = filteredCoins.map(coin => {
    const update = realTimeUpdates[coin.id];
    return update ? { ...coin, ...update } : coin;
  });

  const filterOptions = getFilterOptions();

  const enhancedStats = {
    total: coins.length,
    auctions: coins.filter(c => c.is_auction).length,
    featured: coins.filter(c => c.featured).length,
    totalValue: coins.reduce((sum, coin) => sum + (coin.price || 0), 0)
  };

  return {
    coins,
    enhancedCoins,
    coinsLoading,
    viewMode,
    setViewMode,
    filters,
    updateFilter,
    clearFilters,
    filterOptions,
    totalResults,
    hasActiveFilters,
    enhancedStats
  };
};
