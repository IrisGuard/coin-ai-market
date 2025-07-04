
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export interface AnalyticsStats {
  pageViews: Array<{
    page: string;
    views: number;
    trend: number;
  }>;
  userEngagement: {
    avgSessionTime: number;
    bounceRate: number;
    activeUsers: number;
  };
  searchQueries: Array<{
    query: string;
    count: number;
    resultCount: number;
  }>;
  performance: {
    avgLoadTime: number;
    errorRate: number;
  };
}

export const useAnalyticsStats = () => {
  return useQuery({
    queryKey: ['analytics-stats'],
    queryFn: async (): Promise<AnalyticsStats> => {
      // Get page views from analytics_events
      const { data: pageViewsData } = await supabase
        .from('analytics_events')
        .select('page_url')
        .eq('event_type', 'page_view')
        .gte('timestamp', new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString());

      // Process page views
      const pageViewsMap = new Map<string, number>();
      pageViewsData?.forEach(event => {
        const page = event.page_url || '/';
        pageViewsMap.set(page, (pageViewsMap.get(page) || 0) + 1);
      });

      const pageViews = Array.from(pageViewsMap.entries())
        .map(([page, views]) => ({
          page,
          views,
          trend: Math.random() * 20 - 10 // Mock trend data
        }))
        .sort((a, b) => b.views - a.views)
        .slice(0, 10);

      // Mock user engagement data
      const userEngagement = {
        avgSessionTime: 185, // seconds
        bounceRate: 32.5, // percentage
        activeUsers: pageViewsData?.length || 0
      };

      // Mock search queries (since we don't have real search_analytics table)
      const searchQueries = [
        { query: 'morgan silver dollar', count: 145, resultCount: 23 },
        { query: 'kennedy half dollar', count: 98, resultCount: 17 },
        { query: 'walking liberty', count: 76, resultCount: 12 },
        { query: 'mercury dime', count: 54, resultCount: 8 },
        { query: 'peace dollar', count: 43, resultCount: 15 }
      ];

      // Mock performance data
      const performance = {
        avgLoadTime: 1.2, // seconds
        errorRate: 0.8 // percentage
      };

      return {
        pageViews,
        userEngagement,
        searchQueries,
        performance
      };
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};
