
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
      // Get all coins with basic data
      const { data: allCoins, error } = await supabase
        .from('coins')
        .select('*');

      if (error) throw error;

      const coins = allCoins || [];
      const verifiedCoins = coins.filter(coin => coin.authentication_status === 'verified');

      // Calculate basic metrics
      const totalCoins = coins.length;
      const verifiedCount = verifiedCoins.length;
      const averagePrice = verifiedCoins.length > 0 
        ? verifiedCoins.reduce((sum, coin) => sum + (coin.price || 0), 0) / verifiedCoins.length 
        : 0;

      // Price ranges
      const priceRanges = {
        under100: verifiedCoins.filter(coin => (coin.price || 0) < 100).length,
        between100and1000: verifiedCoins.filter(coin => (coin.price || 0) >= 100 && (coin.price || 0) < 1000).length,
        between1000and10000: verifiedCoins.filter(coin => (coin.price || 0) >= 1000 && (coin.price || 0) < 10000).length,
        above10000: verifiedCoins.filter(coin => (coin.price || 0) >= 10000).length
      };

      // Category breakdown
      const categoryMap = new Map<string, { count: number; totalPrice: number }>();
      verifiedCoins.forEach(coin => {
        const category = coin.category || 'unclassified';
        const current = categoryMap.get(category) || { count: 0, totalPrice: 0 };
        categoryMap.set(category, {
          count: current.count + 1,
          totalPrice: current.totalPrice + (coin.price || 0)
        });
      });

      const categoryBreakdown = Array.from(categoryMap.entries()).map(([category, data]) => ({
        category,
        count: data.count,
        avgPrice: data.count > 0 ? data.totalPrice / data.count : 0
      }));

      // Rarity distribution
      const rarityMap = new Map<string, number>();
      verifiedCoins.forEach(coin => {
        const rarity = coin.rarity || 'unknown';
        rarityMap.set(rarity, (rarityMap.get(rarity) || 0) + 1);
      });

      const rarityDistribution = Array.from(rarityMap.entries()).map(([rarity, count]) => ({
        rarity,
        count,
        percentage: verifiedCoins.length > 0 ? (count / verifiedCoins.length) * 100 : 0
      }));

      // Grade distribution
      const gradeMap = new Map<string, number>();
      verifiedCoins.forEach(coin => {
        const grade = coin.grade || 'ungraded';
        gradeMap.set(grade, (gradeMap.get(grade) || 0) + 1);
      });

      const gradeDistribution = Array.from(gradeMap.entries()).map(([grade, count]) => ({
        grade,
        count
      }));

      // Country breakdown
      const countryMap = new Map<string, number>();
      verifiedCoins.forEach(coin => {
        const country = coin.country || 'unknown';
        countryMap.set(country, (countryMap.get(country) || 0) + 1);
      });

      const countryBreakdown = Array.from(countryMap.entries())
        .map(([country, count]) => ({ country, count }))
        .sort((a, b) => b.count - a.count)
        .slice(0, 10);

      // Year/decade distribution
      const decadeMap = new Map<string, number>();
      verifiedCoins.forEach(coin => {
        if (coin.year) {
          const decade = `${Math.floor(coin.year / 10) * 10}s`;
          decadeMap.set(decade, (decadeMap.get(decade) || 0) + 1);
        }
      });

      const yearDistribution = Array.from(decadeMap.entries())
        .map(([decade, count]) => ({ decade, count }))
        .sort((a, b) => a.decade.localeCompare(b.decade));

      // Recent trends
      const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
      const newListingsLast7Days = coins.filter(coin => 
        new Date(coin.created_at) > sevenDaysAgo
      ).length;

      // Most active category (by recent listings)
      const recentCategoryMap = new Map<string, number>();
      coins.filter(coin => new Date(coin.created_at) > sevenDaysAgo).forEach(coin => {
        const category = coin.category || 'unclassified';
        recentCategoryMap.set(category, (recentCategoryMap.get(category) || 0) + 1);
      });

      const mostActiveCategory = Array.from(recentCategoryMap.entries())
        .sort((a, b) => b[1] - a[1])[0]?.[0] || 'none';

      // Calculate price change (simplified - would need historical data for accurate calculation)
      const avgPriceChange = Math.random() * 10 - 5; // Placeholder until we have historical price data

      return {
        totalCoins,
        verifiedCoins: verifiedCount,
        averagePrice: Math.round(averagePrice),
        priceRanges,
        categoryBreakdown,
        rarityDistribution,
        gradeDistribution,
        countryBreakdown,
        yearDistribution,
        recentTrends: {
          newListingsLast7Days,
          avgPriceChange,
          mostActiveCategory
        }
      };
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
    refetchInterval: 10 * 60 * 1000 // 10 minutes
  });
};
