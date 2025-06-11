
import { useState } from 'react';
import { useCoins } from './useCoins';
import { useAdvancedMarketplaceFilters } from './useAdvancedMarketplaceFilters';
import { useRealTimeMarketplace } from './useRealTimeMarketplace';

export const useMarketplaceState = () => {
  const { data: coins = [], isLoading: coinsLoading, error: coinsError } = useCoins();
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

  // Remove the coins parameter since useRealTimeMarketplace doesn't expect it
  const { data: realTimeData } = useRealTimeMarketplace();

  const enhancedCoins = filteredCoins;

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
    coinsError,
    viewMode,
    setViewMode,
    filters,
    updateFilter,
    clearFilters,
    filterOptions,
    totalResults,
    hasActiveFilters,
    enhancedStats,
    realTimeData
  };
};
