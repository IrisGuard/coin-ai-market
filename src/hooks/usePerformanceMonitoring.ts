
import { useEffect, useRef } from 'react';
import { trackPerformance } from '@/utils/analytics';

interface PerformanceMetrics {
  componentName: string;
  renderTime: number;
  mountTime: number;
  memoryUsage?: {
    used: number;
    total: number;
    limit: number;
  };
}

// Extend Window interface to include gtag and Vercel Analytics
declare global {
  interface Window {
    gtag?: (
      command: 'config' | 'event',
      targetId: string,
      config?: Record<string, any>
    ) => void;
    va?: (
      command: 'track',
      name: string,
      properties?: Record<string, any>
    ) => void;
  }
}

export const usePerformanceMonitoring = (componentName: string) => {
  const startTime = useRef<number>(performance.now());
  const mounted = useRef<boolean>(false);

  useEffect(() => {
    const mountTime = performance.now() - startTime.current;
    
    if (!mounted.current) {
      mounted.current = true;
      
      // Get memory info if available
      const memoryInfo = (performance as any).memory ? {
        used: (performance as any).memory.usedJSHeapSize,
        total: (performance as any).memory.totalJSHeapSize,
        limit: (performance as any).memory.jsHeapSizeLimit
      } : undefined;
      
      const metrics: PerformanceMetrics = {
        componentName,
        renderTime: mountTime,
        mountTime,
        memoryUsage: memoryInfo
      };
      
      // Log performance metrics in development
      if (import.meta.env.DEV) {
        console.log(`[Performance] ${componentName} mounted in ${mountTime.toFixed(2)}ms`);
        if (memoryInfo) {
          console.log(`[Memory] Used: ${(memoryInfo.used / 1048576).toFixed(2)}MB`);
        }
      }
      
      // Send to Vercel Analytics and monitoring
      if (import.meta.env.PROD) {
        // Track with Vercel Analytics
        if (window.va) {
          window.va('track', 'component_performance', {
            component: componentName,
            mount_time: mountTime,
            memory_used: memoryInfo?.used || 0
          });
        }

        // Send detailed metrics to Vercel monitoring
        trackPerformance(window.location.pathname, {
          type: 'component_mount',
          component: componentName,
          mountTime,
          memoryUsage: memoryInfo,
          url: window.location.href,
          userAgent: navigator.userAgent
        });

        // Log slow components
        if (mountTime > 100) {
          console.warn(`Slow component detected: ${componentName} took ${mountTime.toFixed(2)}ms`);
          
          // Send to analytics service
          if (window.gtag) {
            window.gtag('event', 'performance_metric', {
              custom_map: { metric_name: 'component_mount_time' },
              component_name: componentName,
              mount_time: mountTime
            });
          }
        }
      }
    }
  }, [componentName]);

  return {
    markStart: () => {
      startTime.current = performance.now();
    },
    markEnd: (operation: string) => {
      const endTime = performance.now() - startTime.current;
      
      if (import.meta.env.DEV) {
        console.log(`[Performance] ${componentName} ${operation} took ${endTime.toFixed(2)}ms`);
      }

      // Track operation performance in production
      if (import.meta.env.PROD && window.va) {
        window.va('track', 'operation_performance', {
          component: componentName,
          operation,
          duration: endTime
        });
      }
    },
    getMetrics: () => ({
      componentName,
      currentTime: performance.now() - startTime.current,
      memory: (performance as any).memory
    })
  };
};

export const useMemoryMonitoring = () => {
  useEffect(() => {
    if ('memory' in performance) {
      const checkMemory = () => {
        const memory = (performance as any).memory;
        if (memory) {
          const usedMB = memory.usedJSHeapSize / 1048576;
          const totalMB = memory.totalJSHeapSize / 1048576;
          const limitMB = memory.jsHeapSizeLimit / 1048576;
          const usagePercent = (memory.usedJSHeapSize / memory.jsHeapSizeLimit) * 100;
          
          if (import.meta.env.DEV) {
            console.log(`[Memory] Used: ${usedMB.toFixed(2)}MB, Total: ${totalMB.toFixed(2)}MB, Limit: ${limitMB.toFixed(2)}MB`);
          }

          // Alert on high memory usage
          if (usagePercent > 80) {
            console.warn(`High memory usage: ${usagePercent.toFixed(2)}%`);
            
            if (import.meta.env.PROD && window.va) {
              window.va('track', 'memory_warning', {
                usage_percent: usagePercent,
                used_mb: usedMB,
                limit_mb: limitMB
              });
            }
          }

          // Send periodic memory reports to Vercel
          if (import.meta.env.PROD) {
            trackPerformance(window.location.pathname, {
              type: 'memory_usage',
              usedMB,
              totalMB,
              limitMB,
              usagePercent,
              timestamp: Date.now()
            });
          }
        }
      };

      const interval = setInterval(checkMemory, 30000); // Check every 30 seconds
      return () => clearInterval(interval);
    }
  }, []);
};

export const useWebVitals = () => {
  useEffect(() => {
    if (import.meta.env.PROD) {
      // Dynamic import for web-vitals to avoid build issues
      const loadWebVitals = async () => {
        try {
          const { onCLS, onFID, onFCP, onLCP, onTTFB } = await import('web-vitals');
          
          function sendToVercel(metric: any) {
            if (window.va) {
              window.va('track', 'web_vital', {
                name: metric.name,
                value: metric.value,
                rating: metric.rating,
                delta: metric.delta
              });
            }

            trackPerformance(window.location.pathname, {
              type: 'web_vital',
              metric: metric.name,
              value: metric.value,
              rating: metric.rating,
              delta: metric.delta
            });
          }

          onCLS(sendToVercel);
          onFID(sendToVercel);
          onFCP(sendToVercel);
          onLCP(sendToVercel);
          onTTFB(sendToVercel);
        } catch (error) {
          console.log('Web Vitals library failed to load:', error);
        }
      };

      loadWebVitals();
    }
  }, []);
};
