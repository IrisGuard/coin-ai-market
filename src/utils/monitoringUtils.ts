
// Enhanced monitoring utilities for development and production
export class MonitoringUtils {
  
  // Get performance metrics
  static getPerformanceMetrics() {
    const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
    const paint = performance.getEntriesByType('paint');
    
    return {
      pageLoadTime: navigation.loadEventEnd - navigation.loadEventStart,
      domContentLoaded: navigation.domContentLoadedEventEnd - navigation.domContentLoadedEventStart,
      firstPaint: paint.find(p => p.name === 'first-paint')?.startTime || 0,
      firstContentfulPaint: paint.find(p => p.name === 'first-contentful-paint')?.startTime || 0,
      memoryUsage: (performance as any).memory ? {
        used: (performance as any).memory.usedJSHeapSize,
        total: (performance as any).memory.totalJSHeapSize,
        limit: (performance as any).memory.jsHeapSizeLimit
      } : null
    };
  }
  
  // Monitor network requests
  static monitorNetworkRequests() {
    const observer = new PerformanceObserver((list) => {
      list.getEntries().forEach((entry) => {
        if (entry.entryType === 'resource') {
          const resource = entry as PerformanceResourceTiming;
          if (resource.duration > 2000) { // Log slow requests
            console.warn(`Slow network request detected:`, {
              name: resource.name,
              duration: resource.duration,
              size: resource.transferSize
            });
          }
        }
      });
    });
    
    observer.observe({ entryTypes: ['resource'] });
    return observer;
  }
  
  // Check for memory leaks
  static checkMemoryUsage() {
    if ((performance as any).memory) {
      const memory = (performance as any).memory;
      const usagePercent = (memory.usedJSHeapSize / memory.jsHeapSizeLimit) * 100;
      
      if (usagePercent > 80) {
        console.warn(`High memory usage detected: ${usagePercent.toFixed(2)}%`);
        return { warning: true, usage: usagePercent };
      }
      
      return { warning: false, usage: usagePercent };
    }
    
    return null;
  }
  
  // Export system diagnostic report
  static exportDiagnosticReport() {
    const report = {
      timestamp: new Date().toISOString(),
      url: window.location.href,
      userAgent: navigator.userAgent,
      performance: this.getPerformanceMetrics(),
      memory: this.checkMemoryUsage(),
      errors: (window as any).CoinAI?.showErrors ? 'Available via CoinAI.showErrors()' : 'Not available',
      connection: (navigator as any).connection ? {
        effectiveType: (navigator as any).connection.effectiveType,
        downlink: (navigator as any).connection.downlink,
        rtt: (navigator as any).connection.rtt
      } : 'Not available'
    };
    
    console.group('🔍 System Diagnostic Report');
    console.log(report);
    console.groupEnd();
    
    return report;
  }
  
  // Set up automatic monitoring
  static setupAutomaticMonitoring() {
    // Check memory every 30 seconds
    setInterval(() => {
      this.checkMemoryUsage();
    }, 30000);
    
    // Monitor network requests
    this.monitorNetworkRequests();
    
    console.log('✅ Automatic monitoring enabled');
  }
}

// Auto-initialize in development
if (import.meta.env.DEV) {
  MonitoringUtils.setupAutomaticMonitoring();
  
  // Add to global scope for easy access
  (window as any).MonitoringUtils = MonitoringUtils;
}
