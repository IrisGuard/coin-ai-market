
import { supabase } from '@/integrations/supabase/client';

interface SearchEvent {
  query: string;
  results_count: number;
  user_id?: string;
  timestamp: Date;
  filters?: Record<string, any>;
}

export const trackSearchEvent = async (event: SearchEvent) => {
  try {
    await supabase
      .from('search_analytics')
      .insert({
        search_query: event.query,
        results_count: event.results_count,
        user_id: event.user_id,
        search_filters: event.filters || {},
        created_at: event.timestamp.toISOString()
      });
  } catch (error) {
    console.error('Error tracking search event:', error);
  }
};

export const getPopularSearches = async (limit = 10, days = 7) => {
  try {
    const { data, error } = await supabase
      .from('search_analytics')
      .select('search_query, count(*)')
      .gte('created_at', new Date(Date.now() - days * 24 * 60 * 60 * 1000).toISOString())
      .order('count', { ascending: false })
      .limit(limit);

    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error('Error getting popular searches:', error);
    return [];
  }
};

export const getSearchTrends = async (days = 30) => {
  try {
    const { data, error } = await supabase
      .from('search_analytics')
      .select('created_at, search_query')
      .gte('created_at', new Date(Date.now() - days * 24 * 60 * 60 * 1000).toISOString())
      .order('created_at', { ascending: true });

    if (error) throw error;

    // Group by day
    const trends = data?.reduce((acc, item) => {
      const date = item.created_at.split('T')[0];
      acc[date] = (acc[date] || 0) + 1;
      return acc;
    }, {} as Record<string, number>) || {};

    return Object.entries(trends).map(([date, count]) => ({
      date,
      searches: count
    }));
  } catch (error) {
    console.error('Error getting search trends:', error);
    return [];
  }
};
