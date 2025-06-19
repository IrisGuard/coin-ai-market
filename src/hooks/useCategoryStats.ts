
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

interface CategoryStats {
  [key: string]: number;
}

export const useCategoryStats = () => {
  const { data: stats = {}, isLoading: loading, error } = useQuery<CategoryStats>({
    queryKey: ['category-stats'],
    queryFn: async () => {
      const { data: coins, error } = await supabase
        .from('coins')
        .select('category');
      
      if (error) throw error;
      
      const categoryStats: CategoryStats = {};
      coins?.forEach(coin => {
        const category = coin.category || 'unclassified';
        categoryStats[category] = (categoryStats[category] || 0) + 1;
      });
      
      return categoryStats;
    },
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });

  return { stats, loading, error: error?.message };
};
