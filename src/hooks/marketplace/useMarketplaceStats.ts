
import { useMemo, useState } from 'react';
import { Coin } from '@/types/coin';
import { marketplaceCache } from '@/utils/marketplaceCache';

export const useMarketplaceStats = (processedCoins: Coin[]) => {
  const [cachedStats, setCachedStats] = useState<any>(null);

  return useMemo(() => {
    if (!processedCoins || processedCoins.length === 0) {
      return {
        total: 0,
        auctions: 0,
        featured: 0,
        totalValue: 0,
        averagePrice: 0,
        categories: {
          rare: 0,
          common: 0,
          uncommon: 0,
        }
      };
    }
    
    const cacheKey = `marketplace-stats-${processedCoins.length}`;
    const cached = marketplaceCache.get(cacheKey);
    
    if (cached) {
      setCachedStats(cached);
      return cached;
    }
    
    // Use reduce for better performance with large datasets
    const stats = processedCoins.reduce(
      (acc, coin) => {
        acc.total++;
        if (coin.is_auction) acc.auctions++;
        if (coin.featured) acc.featured++;
        acc.totalValue += coin.price || 0;
        
        // Count by rarity
        switch (coin.rarity) {
          case 'Rare':
            acc.categories.rare++;
            break;
          case 'Common':
            acc.categories.common++;
            break;
          case 'Uncommon':
            acc.categories.uncommon++;
            break;
        }
        
        return acc;
      },
      {
        total: 0,
        auctions: 0,
        featured: 0,
        totalValue: 0,
        averagePrice: 0,
        categories: {
          rare: 0,
          common: 0,
          uncommon: 0,
        }
      }
    );
    
    // Calculate average price
    stats.averagePrice = stats.total > 0 ? stats.totalValue / stats.total : 0;
    
    console.log(`Calculated stats for ${stats.total} coins`);
    marketplaceCache.set(cacheKey, stats, 10 * 60 * 1000); // 10 minutes for stats
    setCachedStats(stats);
    return stats;
  }, [processedCoins, setCachedStats]);
};
