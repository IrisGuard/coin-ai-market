
export class ConsoleMonitor {
  private static instance: ConsoleMonitor;
  private originalConsole: {
    error: typeof console.error;
    warn: typeof console.warn;
    log: typeof console.log;
  };
  private isInitialized = false;

  private constructor() {
    this.originalConsole = {
      error: console.error.bind(console),
      warn: console.warn.bind(console),
      log: console.log.bind(console)
    };
  }

  static getInstance(): ConsoleMonitor {
    if (!ConsoleMonitor.instance) {
      ConsoleMonitor.instance = new ConsoleMonitor();
    }
    return ConsoleMonitor.instance;
  }

  init() {
    if (this.isInitialized) return;

    if (import.meta.env.PROD) {
      console.error = (...args: any[]) => {
        this.logToSupabase('error', args);
        this.originalConsole.error(...args);
      };

      console.warn = (...args: any[]) => {
        this.logToSupabase('warn', args);
        this.originalConsole.warn(...args);
      };
    }

    this.isInitialized = true;
  }

  private async logToSupabase(level: string, args: any[]) {
    try {
      const message = args.map(arg => 
        typeof arg === 'object' ? JSON.stringify(arg) : String(arg)
      ).join(' ');

      if (level === 'error') {
        // Production logging only for critical errors
      }
    } catch (error) {
      // Silent fail in production
    }
  }

  destroy() {
    if (!this.isInitialized) return;

    console.error = this.originalConsole.error;
    console.warn = this.originalConsole.warn;
    console.log = this.originalConsole.log;

    this.isInitialized = false;
  }
}
