
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export interface AggregatedCoinData {
  totalCoins: number;
  verifiedCoins: number;
  averagePrice: number;
  priceRanges: {
    under100: number;
    between100and1000: number;
    between1000and10000: number;
    above10000: number;
  };
  categoryBreakdown: Array<{
    category: string;
    count: number;
    avgPrice: number;
  }>;
  rarityDistribution: Array<{
    rarity: string;
    count: number;
    percentage: number;
  }>;
  gradeDistribution: Array<{
    grade: string;
    count: number;
  }>;
  countryBreakdown: Array<{
    country: string;
    count: number;
  }>;
  yearDistribution: Array<{
    decade: string;
    count: number;
  }>;
  recentTrends: {
    newListingsLast7Days: number;
    avgPriceChange: number;
    mostActiveCategory: string;
  };
}

export const useCoinDataAggregation = () => {
  return useQuery({
    queryKey: ['coin-data-aggregation'],
    queryFn: async (): Promise<AggregatedCoinData> => {
      // Get all coins with real data from Supabase
      const { data: allCoins, error } = await supabase
        .from('coins')
        .select('*');

      if (error) {
        console.error('Error fetching coins for aggregation:', error);
        throw error;
      }

      const coins = allCoins || [];
      const totalCoins = coins.length;
      const verifiedCoins = coins.filter(coin => coin.authentication_status === 'verified').length;
      
      // Calculate real average price
      const validPrices = coins.filter(coin => coin.price && coin.price > 0);
      const averagePrice = validPrices.length > 0 
        ? validPrices.reduce((sum, coin) => sum + coin.price, 0) / validPrices.length 
        : 0;

      // Real price ranges calculation
      const priceRanges = {
        under100: coins.filter(coin => coin.price && coin.price < 100).length,
        between100and1000: coins.filter(coin => coin.price && coin.price >= 100 && coin.price < 1000).length,
        between1000and10000: coins.filter(coin => coin.price && coin.price >= 1000 && coin.price < 10000).length,
        above10000: coins.filter(coin => coin.price && coin.price >= 10000).length,
      };

      // Real category breakdown
      const categoryMap = new Map<string, { count: number; totalPrice: number }>();
      coins.forEach(coin => {
        const category = coin.category || 'unclassified';
        if (!categoryMap.has(category)) {
          categoryMap.set(category, { count: 0, totalPrice: 0 });
        }
        const data = categoryMap.get(category)!;
        data.count++;
        if (coin.price) {
          data.totalPrice += coin.price;
        }
      });

      const categoryBreakdown = Array.from(categoryMap.entries()).map(([category, data]) => ({
        category,
        count: data.count,
        avgPrice: data.count > 0 ? data.totalPrice / data.count : 0
      }));

      // Real rarity distribution
      const rarityMap = new Map<string, number>();
      coins.forEach(coin => {
        const rarity = coin.rarity || 'unknown';
        rarityMap.set(rarity, (rarityMap.get(rarity) || 0) + 1);
      });

      const rarityDistribution = Array.from(rarityMap.entries()).map(([rarity, count]) => ({
        rarity,
        count,
        percentage: totalCoins > 0 ? (count / totalCoins) * 100 : 0
      }));

      // Real grade distribution
      const gradeMap = new Map<string, number>();
      coins.forEach(coin => {
        const grade = coin.grade || 'ungraded';
        gradeMap.set(grade, (gradeMap.get(grade) || 0) + 1);
      });

      const gradeDistribution = Array.from(gradeMap.entries()).map(([grade, count]) => ({
        grade,
        count
      }));

      // Real country breakdown
      const countryMap = new Map<string, number>();
      coins.forEach(coin => {
        const country = coin.country || 'unknown';
        countryMap.set(country, (countryMap.get(country) || 0) + 1);
      });

      const countryBreakdown = Array.from(countryMap.entries()).map(([country, count]) => ({
        country,
        count
      })).sort((a, b) => b.count - a.count).slice(0, 10);

      // Real year distribution by decades
      const decadeMap = new Map<string, number>();
      coins.forEach(coin => {
        if (coin.year) {
          const decade = `${Math.floor(coin.year / 10) * 10}s`;
          decadeMap.set(decade, (decadeMap.get(decade) || 0) + 1);
        }
      });

      const yearDistribution = Array.from(decadeMap.entries()).map(([decade, count]) => ({
        decade,
        count
      })).sort((a, b) => b.count - a.count);

      // Real recent trends
      const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
      const recentCoins = coins.filter(coin => 
        coin.created_at && new Date(coin.created_at) >= sevenDaysAgo
      );

      const recentCategoryMap = new Map<string, number>();
      recentCoins.forEach(coin => {
        const category = coin.category || 'unclassified';
        recentCategoryMap.set(category, (recentCategoryMap.get(category) || 0) + 1);
      });

      const mostActiveCategory = recentCategoryMap.size > 0 
        ? Array.from(recentCategoryMap.entries()).sort((a, b) => b[1] - a[1])[0][0]
        : 'none';

      // Calculate real price change (compare recent vs older coins)
      const recentPrices = recentCoins.filter(coin => coin.price).map(coin => coin.price);
      const olderCoins = coins.filter(coin => 
        coin.created_at && new Date(coin.created_at) < sevenDaysAgo && coin.price
      );
      
      const recentAvgPrice = recentPrices.length > 0 
        ? recentPrices.reduce((sum, price) => sum + price, 0) / recentPrices.length 
        : 0;
      
      const olderAvgPrice = olderCoins.length > 0 
        ? olderCoins.reduce((sum, coin) => sum + coin.price, 0) / olderCoins.length 
        : 0;

      const avgPriceChange = olderAvgPrice > 0 
        ? ((recentAvgPrice - olderAvgPrice) / olderAvgPrice) * 100 
        : 0;

      const recentTrends = {
        newListingsLast7Days: recentCoins.length,
        avgPriceChange,
        mostActiveCategory
      };

      return {
        totalCoins,
        verifiedCoins,
        averagePrice,
        priceRanges,
        categoryBreakdown,
        rarityDistribution,
        gradeDistribution,
        countryBreakdown,
        yearDistribution,
        recentTrends
      };
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
    refetchInterval: 10 * 60 * 1000 // 10 minutes
  });
};
