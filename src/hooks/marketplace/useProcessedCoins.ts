import { useMemo } from 'react';
import { Coin, mapSupabaseCoinToCoin, SupabaseCoin } from '@/types/coin';
import { marketplaceCache } from '@/utils/marketplaceCache';

export const useProcessedCoins = (rawCoins: SupabaseCoin[] | undefined) => {
  return useMemo(() => {
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
      .filter((coin: SupabaseCoin) => {
        // Additional verification - ensure coin has required fields
        return coin.store_id &&
               !coin.sold &&
               coin.price > 0;
      })
      .map((coin: SupabaseCoin) => mapSupabaseCoinToCoin(coin)) // Map to proper Coin type
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
};
