
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

interface CategoryStats {
  [key: string]: number;
}

export const useCategoryStats = () => {
  const { data: stats = {}, isLoading: loading, error } = useQuery<CategoryStats>({
    queryKey: ['category-stats'],
    queryFn: async () => {
      // Get coin counts by category
      const { data: coins, error } = await supabase
        .from('coins')
        .select('category');
      
      if (error) throw error;
      
      // Count coins by category
      const categoryStats: CategoryStats = {};
      coins?.forEach(coin => {
        const category = coin.category || 'unclassified';
        categoryStats[category] = (categoryStats[category] || 0) + 1;
      });
      
      // Map to display names and add some mock data for categories not yet populated
      const displayStats: CategoryStats = {
        american: categoryStats.american || 0,
        world: categoryStats.world || 0,
        ancient: categoryStats.ancient || 0,
        modern: categoryStats.modern || 0,
        gold: categoryStats.gold || 0,
        silver: categoryStats.silver || 0,
        platinum: categoryStats.platinum || 0,
        paper: categoryStats.paper || 0,
        graded: categoryStats.graded || 0,
        error: categoryStats.error_coin || 0,
        commemorative: categoryStats.commemorative || 0,
        proof: Math.floor(Math.random() * 500) + 100,
        mint_sets: Math.floor(Math.random() * 300) + 50,
        type: Math.floor(Math.random() * 400) + 75,
        key_date: Math.floor(Math.random() * 200) + 25,
        bullion: Math.floor(Math.random() * 600) + 150,
        colonial: Math.floor(Math.random() * 150) + 20,
        civil_war: Math.floor(Math.random() * 100) + 15,
        trade: Math.floor(Math.random() * 80) + 10,
        half_cent: Math.floor(Math.random() * 60) + 8,
        large_cent: Math.floor(Math.random() * 120) + 18,
        flying_eagle: Math.floor(Math.random() * 40) + 5,
        indian_head: Math.floor(Math.random() * 180) + 25,
        lincoln: Math.floor(Math.random() * 800) + 200,
        two_cent: Math.floor(Math.random() * 30) + 3,
        three_cent: Math.floor(Math.random() * 50) + 7,
        half_dime: Math.floor(Math.random() * 70) + 10,
        twenty_cent: Math.floor(Math.random() * 25) + 2,
        gold_dollar: Math.floor(Math.random() * 90) + 12,
        double_eagle: Math.floor(Math.random() * 250) + 35
      };
      
      return displayStats;
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
    cacheTime: 10 * 60 * 1000, // 10 minutes
  });

  return { stats, loading, error: error?.message };
};
