
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export const useRealSearchData = () => {
  return useQuery({
    queryKey: ['real-search-data'],
    queryFn: async () => {
      // Get trending searches from search analytics
      const { data: searchAnalytics } = await supabase
        .from('search_analytics')
        .select('search_term, search_count')
        .order('search_count', { ascending: false })
        .limit(8);

      // Get popular categories from coin views
      const { data: coinViews } = await supabase
        .from('coins')
        .select('category, views')
        .gt('views', 0)
        .order('views', { ascending: false });

      // Process trending searches
      const trendingSearches = searchAnalytics?.map(item => item.search_term) || [
        'Morgan Silver Dollar',
        'Mercury Dime',
        'Buffalo Nickel',
        'Walking Liberty Half',
        'Peace Dollar',
        'Indian Head Penny',
        'Standing Liberty Quarter',
        'Barber Dime'
      ];

      // Get most viewed categories
      const categoryViews = coinViews?.reduce((acc: Record<string, number>, coin) => {
        const category = coin.category || 'unclassified';
        acc[category] = (acc[category] || 0) + (coin.views || 0);
        return acc;
      }, {}) || {};

      const hotCategories = Object.entries(categoryViews)
        .sort(([,a], [,b]) => b - a)
        .slice(0, 4)
        .map(([category]) => category);

      return {
        trendingSearches,
        hotCategories,
        searchAnalytics: searchAnalytics || []
      };
    },
    refetchInterval: 300000 // Update every 5 minutes
  });
};
