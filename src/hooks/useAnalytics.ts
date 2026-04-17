
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

interface AnalyticsData {
  pageViews: number;
  uniqueVisitors: number;
  sessionDuration: number;
  conversionRate: number;
  topPages: Array<{ page: string; views: number }>;
  userEngagement: {
    avgSessionTime: number;
    bounceRate: number;
    pagesPerSession: number;
  };
}

export const useAnalytics = () => {
  const [analyticsData, setAnalyticsData] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const { data: events, error } = await supabase
          .from('analytics_events')
          .select('*')
          .gte('timestamp', new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString())
          .order('timestamp', { ascending: false });

        if (error) {
          console.error('Error fetching analytics:', error);
        }

        const validEvents = events || [];
        const pageViews = validEvents.filter(e => e.event_type === 'page_view').length;
        const uniqueVisitors = new Set(validEvents.map(e => e.user_id).filter(Boolean)).size;

        const sessionDurations = validEvents
          .map(event => {
            if (typeof event.metadata === 'object' && event.metadata !== null) {
              const metadata = event.metadata as Record<string, any>;
              if (typeof metadata.session_duration === 'number') {
                return metadata.session_duration;
              }
            }
            return 0;
          })
          .filter(duration => duration > 0);

        const avgSessionDuration = sessionDurations.length > 0
          ? sessionDurations.reduce((sum, duration) => sum + duration, 0) / sessionDurations.length
          : 0;

        const pageUrlCounts = validEvents.reduce((acc, event) => {
          if (event.page_url) {
            acc[event.page_url] = (acc[event.page_url] || 0) + 1;
          }
          return acc;
        }, {} as Record<string, number>);

        const topPages = Object.entries(pageUrlCounts)
          .sort(([, a], [, b]) => b - a)
          .slice(0, 5)
          .map(([page, views]) => ({ page, views }));

        const sessions = new Set(
          validEvents
            .map(event => event.user_id ? `${event.user_id}_${new Date(event.timestamp).toDateString()}` : null)
            .filter(Boolean)
        ).size;

        const pagesPerSession = sessions > 0 ? pageViews / sessions : 0;
        const conversionEvents = validEvents.filter(e => ['coin_purchase', 'payment_completed', 'auction_bid'].includes(e.event_type)).length;
        const conversionRate = sessions > 0 ? (conversionEvents / sessions) * 100 : 0;

        setAnalyticsData({
          pageViews,
          uniqueVisitors,
          sessionDuration: avgSessionDuration,
          conversionRate,
          topPages,
          userEngagement: {
            avgSessionTime: avgSessionDuration,
            bounceRate: 0,
            pagesPerSession,
          }
        });
      } catch (error) {
        console.error('Analytics fetch error:', error);
        setAnalyticsData({
          pageViews: 0,
          uniqueVisitors: 0,
          sessionDuration: 0,
          conversionRate: 0,
          topPages: [],
          userEngagement: {
            avgSessionTime: 0,
            bounceRate: 0,
            pagesPerSession: 0,
          }
        });
      } finally {
        setLoading(false);
      }
    };

    fetchAnalytics();
  }, []);

  const trackEvent = async (eventType: string, eventData: Record<string, any>) => {
    try {
      const { error } = await supabase
        .from('analytics_events')
        .insert({
          event_type: eventType,
          page_url: window.location.pathname,
          metadata: eventData,
          user_id: (await supabase.auth.getUser()).data.user?.id
        });

      if (error) {
        console.error('Error tracking event:', error);
      }
    } catch (error) {
      console.error('Event tracking error:', error);
    }
  };

  return {
    analyticsData,
    loading,
    trackEvent
  };
};
