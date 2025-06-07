
import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { trackPageView, trackEvent } from '@/utils/analytics';
import { reportEnvironmentToVercel } from '@/utils/envCheck';

export const usePageView = () => {
  const location = useLocation();

  useEffect(() => {
    const handlePageView = async () => {
      try {
        const referrer = document.referrer;
        const startTime = performance.now();
        
        // Enhanced page view tracking with Vercel integration
        await trackPageView(location.pathname, referrer);
        
        // Track additional page metadata
        const pageMetadata = {
          title: document.title,
          referrer,
          user_agent: navigator.userAgent,
          screen_resolution: `${screen.width}x${screen.height}`,
          viewport_size: `${window.innerWidth}x${window.innerHeight}`,
          connection_type: (navigator as any).connection?.effectiveType || 'unknown',
          language: navigator.language,
          timestamp: new Date().toISOString(),
          load_time: performance.now() - startTime
        };

        // Send to Vercel Analytics if available
        if (typeof window !== 'undefined' && (window as any).va) {
          (window as any).va('track', 'page_view', {
            page: location.pathname,
            title: document.title,
            referrer
          });
        }

        // Track page performance
        setTimeout(() => {
          const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
          if (navigation) {
            const performanceData = {
              page_load_time: navigation.loadEventEnd - navigation.loadEventStart,
              dom_content_loaded: navigation.domContentLoadedEventEnd - navigation.domContentLoadedEventStart,
              first_byte: navigation.responseStart - navigation.requestStart,
              dns_lookup: navigation.domainLookupEnd - navigation.domainLookupStart,
              tcp_connect: navigation.connectEnd - navigation.connectStart
            };

            trackEvent('page_performance', location.pathname, {
              ...pageMetadata,
              performance: performanceData
            });
          }
        }, 1000);

        // Report environment status periodically
        if (Math.random() < 0.1) { // 10% of page views
          reportEnvironmentToVercel();
        }
        
      } catch (error) {
        console.error('Error in page view tracking:', error);
        
        // Track the error
        trackEvent('tracking_error', location.pathname, {
          error: error instanceof Error ? error.message : 'Unknown error',
          context: 'usePageView'
        });
      }
    };

    // Track page view with a small delay to ensure proper rendering
    const timer = setTimeout(handlePageView, 100);

    return () => clearTimeout(timer);
  }, [location.pathname]);

  return {
    currentPath: location.pathname,
    trackCustomEvent: (eventName: string, data?: any) => {
      trackEvent(eventName, location.pathname, data);
    }
  };
};

export const usePagePerformance = () => {
  useEffect(() => {
    const observer = new PerformanceObserver((list) => {
      list.getEntries().forEach((entry) => {
        if (entry.entryType === 'paint') {
          trackEvent('paint_timing', window.location.pathname, {
            name: entry.name,
            startTime: entry.startTime,
            timestamp: Date.now()
          });
        }
        
        if (entry.entryType === 'largest-contentful-paint') {
          trackEvent('lcp', window.location.pathname, {
            startTime: entry.startTime,
            timestamp: Date.now()
          });
        }
      });
    });

    try {
      observer.observe({ entryTypes: ['paint', 'largest-contentful-paint'] });
    } catch (error) {
      console.warn('Performance Observer not supported:', error);
    }

    return () => observer.disconnect();
  }, []);
};
