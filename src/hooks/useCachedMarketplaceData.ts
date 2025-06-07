
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

  // Always memoize processed coins data - never conditional
  const processedCoins = useMemo(() => {
    if (!rawCoins || rawCoins.length === 0) return [];
    
    const cacheKey = `processed-coins-${rawCoins.length}`;
    const cached = marketplaceCache.get<Coin[]>(cacheKey);
    
    if (cached && cached.length > 0) {
      return cached;
    }
    
    // Process coins (sorting, filtering verified, etc.)
    const processed = rawCoins
      .filter(coin => coin.authentication_status === 'verified')
      .sort((a, b) => {
        // Featured coins first, then by views
        if (a.featured && !b.featured) return -1;
        if (!a.featured && b.featured) return 1;
        return (b.views || 0) - (a.views || 0);
      });
    
    marketplaceCache.set(cacheKey, processed);
    return processed;
  }, [rawCoins]);

  // Always memoize marketplace statistics - never conditional
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
    
    const stats = {
      total: processedCoins.length,
      auctions: processedCoins.filter(c => c.is_auction).length,
      featured: processedCoins.filter(c => c.featured).length,
      totalValue: processedCoins.reduce((sum, coin) => sum + (coin.price || 0), 0),
      averagePrice: processedCoins.length > 0 
        ? processedCoins.reduce((sum, coin) => sum + (coin.price || 0), 0) / processedCoins.length 
        : 0,
      categories: {
        rare: processedCoins.filter(c => c.rarity === 'Rare').length,
        common: processedCoins.filter(c => c.rarity === 'Common').length,
        uncommon: processedCoins.filter(c => c.rarity === 'Uncommon').length,
      }
    };
    
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
