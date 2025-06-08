
import { useState, useEffect, useMemo } from 'react';
import { useAllDealerCoins } from './useDealerCoins';
import { Coin } from '@/types/coin';

interface CacheEntry<T> {
  data: T;
  timestamp: number;
  expiresAt: number;
}

class MarketplaceCache {
  private cache = new Map<string, CacheEntry<any>>();
  private defaultTTL = 5 * 60 * 1000; // 5 minutes

  set<T>(key: string, data: T, ttl?: number): void {
    const timestamp = Date.now();
    const expiresAt = timestamp + (ttl || this.defaultTTL);
    
    this.cache.set(key, {
      data,
      timestamp,
      expiresAt
    });
  }

  get<T>(key: string): T | null {
    const entry = this.cache.get(key);
    
    if (!entry) return null;
    
    if (Date.now() > entry.expiresAt) {
      this.cache.delete(key);
      return null;
    }
    
    return entry.data;
  }

  invalidate(pattern?: string): void {
    if (!pattern) {
      this.cache.clear();
      return;
    }
    
    for (const key of this.cache.keys()) {
      if (key.includes(pattern)) {
        this.cache.delete(key);
      }
    }
  }

  size(): number {
    return this.cache.size;
  }
}

const marketplaceCache = new MarketplaceCache();

export const useCachedMarketplaceData = () => {
  const { data: rawCoins, isLoading, error } = useAllDealerCoins();
  const [cachedStats, setCachedStats] = useState<any>(null);

  // Process and cache coins data for better performance with large datasets
  const processedCoins = useMemo(() => {
    if (!rawCoins || rawCoins.length === 0) {
      console.log('No coins data available');
      return [];
    }
    
    console.log(`Processing ${rawCoins.length} coins from database`);
    
    const cacheKey = `processed-coins-${rawCoins.length}-${Date.now()}`;
    const cached = marketplaceCache.get<Coin[]>(cacheKey);
    
    if (cached && cached.length > 0) {
      console.log('Using cached processed coins');
      return cached;
    }
    
    // Process coins (sorting, filtering verified, etc.)
    const processed = rawCoins
      .filter(coin => {
        // Additional verification - ensure coin has required fields
        return coin.authentication_status === 'verified' && 
               coin.name && 
               typeof coin.price === 'number' &&
               coin.year;
      })
      .sort((a, b) => {
        // Featured coins first, then by views, then by creation date
        if (a.featured && !b.featured) return -1;
        if (!a.featured && b.featured) return 1;
        
        const viewDiff = (b.views || 0) - (a.views || 0);
        if (viewDiff !== 0) return viewDiff;
        
        return new Date(b.created_at || '').getTime() - new Date(a.created_at || '').getTime();
      });
    
    console.log(`Processed and sorted ${processed.length} verified coins`);
    marketplaceCache.set(cacheKey, processed);
    return processed;
  }, [rawCoins]);

  // Calculate marketplace statistics optimized for larger datasets
  const enhancedStats = useMemo(() => {
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
  }, [processedCoins]);

  // Cache invalidation on data changes
  useEffect(() => {
    if (rawCoins && rawCoins.length > 0) {
      marketplaceCache.invalidate('processed-coins');
      marketplaceCache.invalidate('marketplace-stats');
    }
  }, [rawCoins?.length]);

  return {
    coins: processedCoins,
    stats: enhancedStats || cachedStats,
    isLoading,
    error,
    cacheInfo: {
      size: marketplaceCache.size(),
      invalidateCache: () => marketplaceCache.invalidate()
    }
  };
};
