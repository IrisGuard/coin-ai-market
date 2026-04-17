import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export interface AnalyticsStats {
  pageViews: Array<{ page: string; views: number; trend: number }>;
  userEngagement: { avgSessionTime: number; bounceRate: number; activeUsers: number };
  searchQueries: Array<{ query: string; count: number; resultCount: number }>;
  performance: { avgLoadTime: number; errorRate: number };
  totalEvents: number;
  activeUsers: number;
  tables: Array<{ name: string; records: number; icon: string; status: string; description: string; growth: number }>;
  insights: Array<{ type: string; message: string; priority: string; trend: number; insight: string; description: string; metric: number }>;
}

export const useAnalyticsStats = () => {
  return useQuery({
    queryKey: ['analytics-stats'],
    queryFn: async (): Promise<AnalyticsStats> => {
      const since = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString();

      const [{ data: events }, { data: searches }] = await Promise.all([
        supabase
          .from('analytics_events')
          .select('page_url, timestamp')
          .eq('event_type', 'page_view')
          .gte('timestamp', since),
        supabase.from('search_analytics').select('query, results_count').limit(50),
      ]);

      // Page views with real trend (this week vs previous week)
      const now = Date.now();
      const week = 7 * 24 * 60 * 60 * 1000;
      const pageViewsMap = new Map<string, { current: number; previous: number }>();
      events?.forEach((e: any) => {
        const url = e.page_url || '/';
        const ts = new Date(e.timestamp).getTime();
        const bucket = pageViewsMap.get(url) ?? { current: 0, previous: 0 };
        if (ts >= now - week) bucket.current += 1;
        else if (ts >= now - 2 * week) bucket.previous += 1;
        pageViewsMap.set(url, bucket);
      });
      const pageViews = Array.from(pageViewsMap.entries())
        .map(([page, b]) => ({
          page,
          views: b.current + b.previous,
          trend: b.previous === 0 ? (b.current > 0 ? 100 : 0) : ((b.current - b.previous) / b.previous) * 100,
        }))
        .sort((a, b) => b.views - a.views)
        .slice(0, 10);

      const searchQueriesMap = new Map<string, { count: number; resultCount: number }>();
      searches?.forEach((s: any) => {
        const q = (s.query || '').toLowerCase();
        if (!q) return;
        const cur = searchQueriesMap.get(q) ?? { count: 0, resultCount: 0 };
        cur.count += 1;
        cur.resultCount = Math.max(cur.resultCount, s.results_count || 0);
        searchQueriesMap.set(q, cur);
      });
      const searchQueries = Array.from(searchQueriesMap.entries())
        .map(([query, v]) => ({ query, count: v.count, resultCount: v.resultCount }))
        .sort((a, b) => b.count - a.count)
        .slice(0, 5);

      const totalEvents = events?.length || 0;

      return {
        pageViews,
        userEngagement: { avgSessionTime: 0, bounceRate: 0, activeUsers: totalEvents },
        searchQueries,
        performance: { avgLoadTime: 0, errorRate: 0 },
        totalEvents,
        activeUsers: totalEvents,
        tables: [
          { name: 'analytics_events', records: totalEvents, icon: 'BarChart', status: 'active', description: 'Page view events', growth: 0 },
          { name: 'page_views', records: pageViews.length, icon: 'Activity', status: 'active', description: 'Unique page views', growth: 0 },
        ],
        insights: [],
      };
    },
    staleTime: 5 * 60 * 1000,
  });
};
