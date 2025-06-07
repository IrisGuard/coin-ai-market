
import { supabase } from '@/integrations/supabase/client';

// Enhanced analytics with Vercel integration
export const trackEvent = async (eventType: string, pageUrl: string, metadata?: any) => {
  try {
    // Store in Supabase
    await supabase.from('analytics_events').insert({
      event_type: eventType,
      page_url: pageUrl,
      user_agent: navigator.userAgent,
      metadata: metadata || {},
      timestamp: new Date().toISOString()
    });

    // Send to Vercel Analytics if available
    if (typeof window !== 'undefined' && (window as any).va) {
      (window as any).va('track', eventType, {
        page: pageUrl,
        ...metadata
      });
    }

    // Send to Vercel monitoring
    await fetch('/api/vercel-monitor', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        type: 'analytics_event',
        eventType,
        pageUrl,
        metadata,
        timestamp: new Date().toISOString(),
        userAgent: navigator.userAgent
      })
    }).catch(() => {}); // Silent fail
    
  } catch (error) {
    console.error('Error tracking event:', error);
  }
};

export const trackPageView = async (pagePath: string, referrer?: string) => {
  try {
    // Enhanced page view tracking
    const pageData = {
      page_path: pagePath,
      referrer: referrer || document.referrer,
      timestamp: new Date().toISOString(),
      user_agent: navigator.userAgent,
      screen_resolution: `${screen.width}x${screen.height}`,
      viewport_size: `${window.innerWidth}x${window.innerHeight}`,
      connection_type: (navigator as any).connection?.effectiveType || 'unknown'
    };

    // Call the increment_page_view function
    const { error } = await supabase.rpc('increment_page_view', {
      page_path_param: pagePath
    });

    if (error) {
      console.error('Error tracking page view:', error);
    }

    // Send to Vercel Analytics
    if (typeof window !== 'undefined' && (window as any).va) {
      (window as any).va('track', 'pageview', {
        page: pagePath,
        referrer
      });
    }

    // Enhanced monitoring
    await trackEvent('page_view', pagePath, pageData);
    
  } catch (error) {
    console.error('Error tracking page view:', error);
  }
};

export const trackPerformance = async (pagePath: string, metrics: any) => {
  try {
    await fetch('/api/vercel-monitor', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        type: 'performance_metrics',
        page: pagePath,
        metrics,
        timestamp: new Date().toISOString()
      })
    }).catch(() => {});
  } catch (error) {
    console.error('Error tracking performance:', error);
  }
};

export const trackError = async (error: Error, context?: string) => {
  try {
    const errorData = {
      message: error.message,
      stack: error.stack,
      context: context || 'unknown',
      url: window.location.href,
      userAgent: navigator.userAgent,
      timestamp: new Date().toISOString()
    };

    // Send to Vercel error monitoring
    await fetch('/api/vercel-monitor', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        type: 'error_report',
        error: errorData,
        timestamp: new Date().toISOString()
      })
    }).catch(() => {});

    // Track as analytics event
    await trackEvent('error', window.location.pathname, errorData);
    
  } catch (trackingError) {
    console.error('Error tracking error:', trackingError);
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

export const getAnalyticsSummary = async () => {
  try {
    const [popularPages, recentEvents] = await Promise.all([
      getPopularPages(10),
      supabase
        .from('analytics_events')
        .select('event_type, page_url, timestamp')
        .order('timestamp', { ascending: false })
        .limit(50)
    ]);

    return {
      popularPages,
      recentEvents: recentEvents.data || [],
      summary: {
        totalPages: popularPages.length,
        totalEvents: recentEvents.data?.length || 0,
        generatedAt: new Date().toISOString()
      }
    };
  } catch (error) {
    console.error('Error getting analytics summary:', error);
    return { popularPages: [], recentEvents: [], summary: null };
  }
};
