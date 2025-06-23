import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export const useRealCategoryDistribution = () => {
  return useQuery({
    queryKey: ['real-category-distribution'],
    queryFn: async () => {
      const { data: coins } = await supabase
        .from('coins')
        .select('category, price');

      if (!coins) return { categories: [], totalValue: 0 };

      const categoryCount = coins.reduce((acc: Record<string, number>, coin) => {
        const category = coin.category || 'unclassified';
        acc[category] = (acc[category] || 0) + 1;
        return acc;
      }, {}) || {};

      const colors = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8', '#82CA9D', '#FFC658', '#FF7300'];
      
      return Object.entries(categoryCount)
        .map(([name, value], index) => ({
          name: name.charAt(0).toUpperCase() + name.slice(1).replace('_', ' '),
          value,
          color: colors[index % colors.length]
        }))
        .sort((a, b) => b.value - a.value);
    },
    refetchInterval: 300000 // Update every 5 minutes
  });
};
