
import { useMemo } from 'react';
import { Coin } from '@/types/coin';

export interface CategoryStats {
  totalCoins: number;
  averagePrice: number;
  priceRange: { min: number; max: number; };
  mostExpensive: Coin | null;
  oldestCoin: Coin | null;
  newestCoin: Coin | null;
  totalAuctions: number;
  featuredCount: number;
}

export const useCategoryStats = (categoryCoins: Coin[]): CategoryStats => {
  return useMemo(() => {
    if (!categoryCoins || categoryCoins.length === 0) {
      return {
        totalCoins: 0,
        averagePrice: 0,
        priceRange: { min: 0, max: 0 },
        mostExpensive: null,
        oldestCoin: null,
        newestCoin: null,
        totalAuctions: 0,
        featuredCount: 0
      };
    }

    const prices = categoryCoins.map(coin => coin.price);
    const years = categoryCoins.map(coin => coin.year);
    
    const mostExpensive = categoryCoins.reduce((max, coin) => 
      coin.price > max.price ? coin : max, categoryCoins[0]);
    
    const oldestCoin = categoryCoins.reduce((oldest, coin) => 
      coin.year < oldest.year ? coin : oldest, categoryCoins[0]);
    
    const newestCoin = categoryCoins.reduce((newest, coin) => 
      coin.year > newest.year ? coin : newest, categoryCoins[0]);

    return {
      totalCoins: categoryCoins.length,
      averagePrice: prices.reduce((sum, price) => sum + price, 0) / prices.length,
      priceRange: { min: Math.min(...prices), max: Math.max(...prices) },
      mostExpensive,
      oldestCoin,
      newestCoin,
      totalAuctions: categoryCoins.filter(coin => coin.is_auction).length,
      featuredCount: categoryCoins.filter(coin => coin.featured).length
    };
  }, [categoryCoins]);
};
