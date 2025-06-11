
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export const useRealSearchData = () => {
  return useQuery({
    queryKey: ['real-search-data'],
    queryFn: async () => {
      // Get trending searches from analytics events instead of search_analytics table
      const { data: searchEvents } = await supabase
        .from('analytics_events')
        .select('metadata')
        .eq('event_type', 'search_performed')
        .order('timestamp', { ascending: false })
        .limit(100);

      // Get popular categories from coin views
      const { data: coinViews } = await supabase
        .from('coins')
        .select('category, views')
        .gt('views', 0)
        .order('views', { ascending: false });

      // Process trending searches from analytics events
      const searchTerms = searchEvents?.map(event => 
        event.metadata?.search_term || event.metadata?.query
      ).filter(Boolean) || [];
      
      const searchCounts = searchTerms.reduce((acc: Record<string, number>, term: string) => {
        acc[term] = (acc[term] || 0) + 1;
        return acc;
      }, {});

      const trendingSearches = Object.entries(searchCounts)
        .sort(([,a], [,b]) => b - a)
        .slice(0, 8)
        .map(([term]) => term);

      // Fallback trending searches if no data
      const fallbackSearches = [
        'Morgan Silver Dollar',
        'Mercury Dime',
        'Buffalo Nickel',
        'Walking Liberty Half',
        'Peace Dollar',
        'Indian Head Penny',
        'Standing Liberty Quarter',
        'Barber Dime'
      ];

      const finalTrendingSearches = trendingSearches.length > 0 ? trendingSearches : fallbackSearches;

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
        trendingSearches: finalTrendingSearches,
        hotCategories,
        searchAnalytics: Object.entries(searchCounts).map(([term, count]) => ({
          search_term: term,
          search_count: count
        }))
      };
    },
    refetchInterval: 300000 // Update every 5 minutes
  });
};
