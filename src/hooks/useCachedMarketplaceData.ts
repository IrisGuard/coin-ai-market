
import { useState, useEffect, useMemo } from 'react';
import { useCoins } from './useCoins';
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
  const { data: rawCoins, isLoading, error } = useCoins();
  const [cachedStats, setCachedStats] = useState<any>(null);

  // Memoize processed coins data
  const processedCoins = useMemo(() => {
    if (!rawCoins) return [];
    
    const cacheKey = `processed-coins-${rawCoins.length}`;
    const cached = marketplaceCache.get<Coin[]>(cacheKey);
    
    if (cached) {
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

  // Memoize marketplace statistics
  const enhancedStats = useMemo(() => {
    if (!processedCoins.length) return null;
    
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
    if (rawCoins) {
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
