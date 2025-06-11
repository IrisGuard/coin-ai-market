
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

interface CategoryStats {
  ancient: number;
  modern: number;
  error: number;
  graded: number;
  trending: number;
  european: number;
  american: number;
  asian: number;
  gold: number;
  silver: number;
  rare: number;
  auctions: number;
}

export const useCategoryStats = () => {
  const { data: stats, isLoading, error } = useQuery({
    queryKey: ['category-stats'],
    queryFn: async () => {
      // Get counts for each category from the coins table
      const { data: coinCounts, error: countError } = await supabase
        .from('coins')
        .select('category');
      
      if (countError) throw countError;

      // Count coins by category
      const categoryCounts = coinCounts?.reduce((acc: any, coin) => {
        const category = coin.category || 'unclassified';
        acc[category] = (acc[category] || 0) + 1;
        return acc;
      }, {}) || {};

      // Get auction count
      const { count: auctionCount, error: auctionError } = await supabase
        .from('coins')
        .select('*', { count: 'exact', head: true })
        .eq('is_auction', true)
        .gt('auction_end', new Date().toISOString());
      
      if (auctionError) throw auctionError;

      // Get graded coins count
      const { count: gradedCount, error: gradedError } = await supabase
        .from('coins')
        .select('*', { count: 'exact', head: true })
        .or('pcgs_grade.neq.null,ngc_grade.neq.null');
      
      if (gradedError) throw gradedError;

      return {
        ancient: categoryCounts.ancient || 0,
        modern: categoryCounts.modern || 0,
        error: categoryCounts.error || 0,
        graded: gradedCount || 0,
        trending: categoryCounts.trending || 0,
        european: categoryCounts.european || 0,
        american: categoryCounts.american || 0,
        asian: categoryCounts.asian || 0,
        gold: categoryCounts.gold || 0,
        silver: categoryCounts.silver || 0,
        rare: categoryCounts.rare || 0,
        auctions: auctionCount || 0
      } as CategoryStats;
    }
  });

  return { 
    stats: stats || {
      ancient: 0,
      modern: 0,
      error: 0,
      graded: 0,
      trending: 0,
      european: 0,
      american: 0,
      asian: 0,
      gold: 0,
      silver: 0,
      rare: 0,
      auctions: 0
    }, 
    loading: isLoading, 
    error: error?.message || null 
  };
};
