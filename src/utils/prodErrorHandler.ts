
import { logErrorToSentry } from '@/lib/sentry';

export class ProdErrorHandler {
  static logError(
    errorType: string,
    message: string,
    stackTrace?: string,
    pageUrl?: string
  ): void {
    // Log to Sentry in production
    if (import.meta.env.PROD) {
      logErrorToSentry(new Error(message), {
        errorType,
        stackTrace,
        pageUrl: pageUrl || window.location.href,
        userAgent: navigator.userAgent,
        timestamp: new Date().toISOString()
      });
    }

    // Also log to console for debugging
    console.error(`[${errorType}] ${message}`, {
      stackTrace,
      pageUrl,
      userAgent: navigator.userAgent
    });
  }

  static initializeGlobalErrorHandling(): void {
    // Handle unhandled promise rejections
    window.addEventListener('unhandledrejection', (event) => {
      this.logError(
        'unhandled_rejection',
        event.reason?.message || 'Unhandled promise rejection',
        event.reason?.stack,
        window.location.href
      );
    });

    // Handle general JavaScript errors
    window.addEventListener('error', (event) => {
      this.logError(
        'javascript_error',
        event.message,
        event.error?.stack,
        window.location.href
      );
    });

    // Intercept console errors for production monitoring
    if (import.meta.env.PROD) {
      const originalConsoleError = console.error;
      console.error = (...args) => {
        originalConsoleError.apply(console, args);
        this.logError('console_error', args.join(' '));
      };
    }
  }
}
