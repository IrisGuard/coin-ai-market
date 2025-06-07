
export class ConsoleMonitor {
  private static instance: ConsoleMonitor;
  private originalConsole: any = {};
  private isInitialized = false;

  static getInstance(): ConsoleMonitor {
    if (!ConsoleMonitor.instance) {
      ConsoleMonitor.instance = new ConsoleMonitor();
    }
    return ConsoleMonitor.instance;
  }

  init() {
    if (this.isInitialized) return;

    // Store original console methods
    this.originalConsole = {
      log: console.log,
      warn: console.warn,
      error: console.error,
      info: console.info
    };

    // Intercept console methods
    console.log = this.interceptLog.bind(this, 'log');
    console.warn = this.interceptLog.bind(this, 'warn');
    console.error = this.interceptLog.bind(this, 'error');
    console.info = this.interceptLog.bind(this, 'info');

    this.isInitialized = true;
    console.log('🔍 Console monitoring initialized');
  }

  private async interceptLog(level: string, ...args: any[]) {
    // Call original console method
    this.originalConsole[level]?.apply(console, args);

    // Send to monitoring in production
    if (import.meta.env.PROD) {
      try {
        await fetch('/api/console-monitor', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            level,
            message: args.map(arg => 
              typeof arg === 'object' ? JSON.stringify(arg) : String(arg)
            ).join(' '),
            timestamp: new Date().toISOString(),
            url: window.location.href,
            userAgent: navigator.userAgent,
            stack: level === 'error' && args[0]?.stack ? args[0].stack : undefined
          })
        });
      } catch (error) {
        // Fail silently to avoid infinite loops
      }
    }
  }

  destroy() {
    if (!this.isInitialized) return;

    // Restore original console methods
    Object.assign(console, this.originalConsole);
    this.isInitialized = false;
  }
}
