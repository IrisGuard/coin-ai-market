
// Simplified error handler χωρίς Supabase dependencies

export class ErrorHandler {
  private static sessionId = Math.random().toString(36).substring(2, 15);

  static async logError(
    errorType: string,
    message: string,
    stackTrace?: string,
    pageUrl?: string
  ): Promise<void> {
    // Log locally μέχρι να συνδεθεί νέο Supabase
    console.error('Error logged:', {
      errorType,
      message,
      stackTrace,
      pageUrl: pageUrl || window.location.href,
      userAgent: navigator.userAgent,
      sessionId: this.sessionId
    });
  }

  static async logConsoleError(
    level: 'error' | 'warn' | 'info',
    message: string,
    sourceFile?: string,
    lineNumber?: number,
    columnNumber?: number
  ): Promise<void> {
    console.error('Console error logged:', {
      level,
      message,
      sourceFile,
      lineNumber,
      columnNumber,
      sessionId: this.sessionId
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

    // Intercept console errors
    const originalConsoleError = console.error;
    const originalConsoleWarn = console.warn;
    const originalConsoleInfo = console.info;

    console.error = (...args) => {
      originalConsoleError.apply(console, args);
      this.logConsoleError('error', args.join(' '));
    };

    console.warn = (...args) => {
      originalConsoleWarn.apply(console, args);
      this.logConsoleError('warn', args.join(' '));
    };

    console.info = (...args) => {
      originalConsoleInfo.apply(console, args);
      this.logConsoleError('info', args.join(' '));
    };
  }

  static async checkSystemConfig(): Promise<boolean> {
    // Επιστρέφει false μέχρι να συνδεθεί νέο Supabase
    return false;
  }
}
