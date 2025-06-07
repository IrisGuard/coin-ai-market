
import { useEffect, useRef } from 'react';

interface PerformanceMetrics {
  componentName: string;
  renderTime: number;
  mountTime: number;
}

export const usePerformanceMonitoring = (componentName: string) => {
  const startTime = useRef<number>(performance.now());
  const mounted = useRef<boolean>(false);

  useEffect(() => {
    const mountTime = performance.now() - startTime.current;
    
    if (!mounted.current) {
      mounted.current = true;
      
      // Log performance metrics in development
      if (process.env.NODE_ENV === 'development') {
        console.log(`[Performance] ${componentName} mounted in ${mountTime.toFixed(2)}ms`);
      }
      
      // Send to analytics in production
      if (process.env.NODE_ENV === 'production' && mountTime > 100) {
        // Only log slow components
        const metrics: PerformanceMetrics = {
          componentName,
          renderTime: mountTime,
          mountTime
        };
        
        // Send to analytics service
        window.gtag?.('event', 'performance_metric', {
          custom_map: { metric_name: 'component_mount_time' },
          component_name: componentName,
          mount_time: mountTime
        });
      }
    }
  }, [componentName]);

  return {
    markStart: () => {
      startTime.current = performance.now();
    },
    markEnd: (operation: string) => {
      const endTime = performance.now() - startTime.current;
      if (process.env.NODE_ENV === 'development') {
        console.log(`[Performance] ${componentName} ${operation} took ${endTime.toFixed(2)}ms`);
      }
    }
  };
};

export const useMemoryMonitoring = () => {
  useEffect(() => {
    if (process.env.NODE_ENV === 'development' && 'memory' in performance) {
      const checkMemory = () => {
        const memory = (performance as any).memory;
        if (memory) {
          console.log(`[Memory] Used: ${(memory.usedJSHeapSize / 1048576).toFixed(2)}MB, Total: ${(memory.totalJSHeapSize / 1048576).toFixed(2)}MB`);
        }
      };

      const interval = setInterval(checkMemory, 30000); // Check every 30 seconds
      return () => clearInterval(interval);
    }
  }, []);
};
