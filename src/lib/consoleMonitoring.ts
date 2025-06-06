
import { logSecurityEvent } from '../utils/securityConfig';

interface ErrorEntry {
  message: string;
  timestamp: string;
  stack?: string;
  url: string;
}

interface WarningEntry {
  message: string;
  timestamp: string;
  url: string;
}

export class ConsoleMonitor {
  private static instance: ConsoleMonitor;
  private errors: ErrorEntry[] = [];
  private warnings: WarningEntry[] = [];
  
  static getInstance(): ConsoleMonitor {
    if (!ConsoleMonitor.instance) {
      ConsoleMonitor.instance = new ConsoleMonitor();
    }
    return ConsoleMonitor.instance;
  }
  
  init() {
    // Capture console errors and warnings
    const originalError = console.error;
    const originalWarn = console.warn;
    
    console.error = (...args) => {
      this.errors.push({
        message: args.join(' '),
        timestamp: new Date().toISOString(),
        stack: new Error().stack,
        url: window.location.href
      });
      originalError.apply(console, args);
      this.sendToMonitoring('error', args);
    };
    
    console.warn = (...args) => {
      this.warnings.push({
        message: args.join(' '),
        timestamp: new Date().toISOString(),
        url: window.location.href
      });
      originalWarn.apply(console, args);
      this.sendToMonitoring('warning', args);
    };
  }
  
  private sendToMonitoring(level: string, args: any[]) {
    // Send to monitoring in production only
    if (process.env.NODE_ENV === 'production') {
      fetch('/api/console-monitor', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          level,
          message: args.join(' '),
          timestamp: new Date().toISOString(),
          url: window.location.href,
          userAgent: navigator.userAgent
        })
      }).catch(() => {}); // Silent fail
    }
  }
  
  getErrors() { return this.errors; }
  getWarnings() { return this.warnings; }
  
  clearAll() {
    this.errors = [];
    this.warnings = [];
  }
}
