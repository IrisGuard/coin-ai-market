
import { useEffect } from 'react';
import { useAllDealerCoins } from './useDealerCoins';
import { useProcessedCoins } from './marketplace/useProcessedCoins';
import { useMarketplaceStats } from './marketplace/useMarketplaceStats';
import { marketplaceCache } from '@/utils/marketplaceCache';

export const useCachedMarketplaceData = () => {
  const { data: rawCoins, isLoading, error } = useAllDealerCoins();
  
  const processedCoins = useProcessedCoins(rawCoins);
  const enhancedStats = useMarketplaceStats(processedCoins);

  // Cache invalidation on data changes
  useEffect(() => {
    if (rawCoins && rawCoins.length > 0) {
      marketplaceCache.invalidate('processed-coins');
      marketplaceCache.invalidate('marketplace-stats');
    }
  }, [rawCoins?.length]);

  return {
    coins: processedCoins,
    stats: enhancedStats,
    isLoading,
    error,
    cacheInfo: {
      size: marketplaceCache.size(),
      invalidateCache: () => marketplaceCache.invalidate()
    }
  };
};
