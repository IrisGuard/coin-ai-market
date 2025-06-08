
import { supabase } from '@/integrations/supabase/client';

export const trackEvent = async (eventType: string, pageUrl: string, metadata?: any) => {
  try {
    await supabase.from('analytics_events').insert({
      event_type: eventType,
      page_url: pageUrl,
      user_agent: navigator.userAgent,
      metadata: metadata || {},
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Error tracking event:', error);
  }
};

export const getPopularPages = async (limit: number = 5) => {
  try {
    const { data, error } = await supabase
      .from('page_views')
      .select('page_path, view_count')
      .order('view_count', { ascending: false })
      .limit(limit);

    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error('Error fetching popular pages:', error);
    return [];
  }
};
