export class PerformanceMetrics {
  private metrics: Map<string, number> = new Map();
  private observers: PerformanceObserver[] = [];

  // Start timing a specific operation
  startTiming(label: string): void {
    this.metrics.set(`${label}_start`, performance.now());
  }

  // End timing and get duration
  endTiming(label: string): number {
    const startTime = this.metrics.get(`${label}_start`);
    if (!startTime) {
      console.warn(`No start time found for ${label}`);
      return 0;
    }
    
    const duration = performance.now() - startTime;
    this.metrics.set(`${label}_duration`, duration);
    return duration;
  }

  // Get all metrics
  getAllMetrics(): Record<string, number> {
    const result: Record<string, number> = {};
    this.metrics.forEach((value, key) => {
      result[key] = value;
    });
    return result;
  }

  // Monitor Core Web Vitals
  initializeWebVitals(): void {
    // Largest Contentful Paint
    const lcpObserver = new PerformanceObserver((list) => {
      const entries = list.getEntries();
      const lastEntry = entries[entries.length - 1];
      this.metrics.set('LCP', lastEntry.startTime);
    });
    lcpObserver.observe({ type: 'largest-contentful-paint', buffered: true });
    this.observers.push(lcpObserver);

    // First Input Delay
    const fidObserver = new PerformanceObserver((list) => {
      const firstInput = list.getEntries()[0] as PerformanceEventTiming;
      if (firstInput) {
        const fid = firstInput.processingStart - firstInput.startTime;
        this.metrics.set('FID', fid);
      }
    });
    fidObserver.observe({ type: 'first-input', buffered: true });
    this.observers.push(fidObserver);

    // Cumulative Layout Shift
    let clsValue = 0;
    const clsObserver = new PerformanceObserver((list) => {
      for (const entry of list.getEntries()) {
        if (!(entry as any).hadRecentInput) {
          clsValue += (entry as any).value;
        }
      }
      this.metrics.set('CLS', clsValue);
    });
    clsObserver.observe({ type: 'layout-shift', buffered: true });
    this.observers.push(clsObserver);
  }

  // Monitor API response times
  monitorAPICall(url: string, startTime: number, endTime: number): void {
    const duration = endTime - startTime;
    const key = `api_${url.replace(/[^a-zA-Z0-9]/g, '_')}`;
    this.metrics.set(key, duration);
  }

  // Memory usage monitoring
  getMemoryUsage(): Record<string, number> | null {
    if ('memory' in performance) {
      const memory = (performance as any).memory;
      return {
        usedJSHeapSize: memory.usedJSHeapSize,
        totalJSHeapSize: memory.totalJSHeapSize,
        jsHeapSizeLimit: memory.jsHeapSizeLimit
      };
    }
    return null;
  }

  // Generate performance report
  generateReport(): Record<string, any> {
    return {
      timestamp: new Date().toISOString(),
      metrics: this.getAllMetrics(),
      memory: this.getMemoryUsage(),
      navigation: this.getNavigationTiming(),
      resources: this.getResourceTiming()
    };
  }

  private getNavigationTiming(): Record<string, number> {
    const nav = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
    if (!nav) return {};

    return {
      domContentLoaded: nav.domContentLoadedEventEnd - nav.domContentLoadedEventStart,
      load: nav.loadEventEnd - nav.loadEventStart,
      domInteractive: nav.domInteractive - nav.navigationStart,
      firstPaint: this.getFirstPaint(),
      firstContentfulPaint: this.getFirstContentfulPaint()
    };
  }

  private getFirstPaint(): number {
    const paintEntries = performance.getEntriesByType('paint');
    const firstPaint = paintEntries.find(entry => entry.name === 'first-paint');
    return firstPaint ? firstPaint.startTime : 0;
  }

  private getFirstContentfulPaint(): number {
    const paintEntries = performance.getEntriesByType('paint');
    const fcp = paintEntries.find(entry => entry.name === 'first-contentful-paint');
    return fcp ? fcp.startTime : 0;
  }

  private getResourceTiming(): Array<{ name: string; duration: number; size: number }> {
    return performance.getEntriesByType('resource')
      .map(entry => ({
        name: entry.name,
        duration: entry.duration,
        size: (entry as PerformanceResourceTiming).transferSize || 0
      }))
      .filter(entry => entry.duration > 100) // Only slow resources
      .sort((a, b) => b.duration - a.duration)
      .slice(0, 10); // Top 10 slowest
  }

  // Cleanup observers
  destroy(): void {
    this.observers.forEach(observer => observer.disconnect());
    this.observers = [];
    this.metrics.clear();
  }
}

// Global instance
export const performanceMetrics = new PerformanceMetrics();

// Auto-initialize in production
if (typeof window !== 'undefined') {
  performanceMetrics.initializeWebVitals();
}

export const measurePageLoadTime = (): number => {
  if (typeof window !== 'undefined' && performance.timing) {
    const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
    if (navigation) {
      return navigation.loadEventEnd - navigation.fetchStart;
    }
  }
  return 0;
};
