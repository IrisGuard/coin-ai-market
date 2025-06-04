
import { supabase } from '@/integrations/supabase/client';
import { SecurityUtils } from './securityUtils';

export class ErrorHandler {
  private static sessionId = Math.random().toString(36).substring(2, 15);

  static async logError(
    errorType: string,
    message: string,
    stackTrace?: string,
    pageUrl?: string
  ): Promise<void> {
    try {
      // SECURITY FIX: Use secure logging function that sanitizes sensitive data
      await supabase.rpc('log_error_secure', {
        error_type_param: errorType,
        message_param: message,
        stack_trace_param: stackTrace,
        page_url_param: pageUrl || window.location.href,
        user_agent_param: navigator.userAgent
      });
    } catch (error) {
      console.error('Failed to log error to Supabase:', SecurityUtils.sanitizeForLogging(error));
    }

    // Local logging with sanitization
    console.error('Error logged:', SecurityUtils.sanitizeForLogging({
      errorType,
      message,
      stackTrace,
      pageUrl: pageUrl || window.location.href,
      userAgent: navigator.userAgent,
      sessionId: this.sessionId
    }));
  }

  static async logConsoleError(
    level: 'error' | 'warn' | 'info',
    message: string,
    sourceFile?: string,
    lineNumber?: number,
    columnNumber?: number
  ): Promise<void> {
    try {
      await supabase.rpc('log_console_error', {
        error_level_param: level,
        message_param: SecurityUtils.sanitizeText(message),
        source_file_param: sourceFile,
        line_number_param: lineNumber,
        column_number_param: columnNumber,
        session_id_param: this.sessionId
      });
    } catch (error) {
      console.error('Failed to log console error to Supabase:', SecurityUtils.sanitizeForLogging(error));
    }

    console.error('Console error logged:', SecurityUtils.sanitizeForLogging({
      level,
      message,
      sourceFile,
      lineNumber,
      columnNumber,
      sessionId: this.sessionId
    }));
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

    // Intercept console errors with sanitization
    const originalConsoleError = console.error;
    const originalConsoleWarn = console.warn;
    const originalConsoleInfo = console.info;

    console.error = (...args) => {
      originalConsoleError.apply(console, args);
      const sanitizedMessage = args.map(arg => 
        typeof arg === 'string' ? SecurityUtils.sanitizeText(arg) : SecurityUtils.sanitizeForLogging(arg)
      ).join(' ');
      this.logConsoleError('error', sanitizedMessage);
    };

    console.warn = (...args) => {
      originalConsoleWarn.apply(console, args);
      const sanitizedMessage = args.map(arg => 
        typeof arg === 'string' ? SecurityUtils.sanitizeText(arg) : SecurityUtils.sanitizeForLogging(arg)
      ).join(' ');
      this.logConsoleError('warn', sanitizedMessage);
    };

    console.info = (...args) => {
      originalConsoleInfo.apply(console, args);
      const sanitizedMessage = args.map(arg => 
        typeof arg === 'string' ? SecurityUtils.sanitizeText(arg) : SecurityUtils.sanitizeForLogging(arg)
      ).join(' ');
      this.logConsoleError('info', sanitizedMessage);
    };
  }

  static async checkSystemConfig(): Promise<boolean> {
    try {
      const { data } = await supabase
        .from('system_config')
        .select('config_value')
        .eq('config_key', 'system_status')
        .single();
      
      return data?.config_value === 'active';
    } catch (error) {
      console.error('Error checking system config:', SecurityUtils.sanitizeForLogging(error));
      return false;
    }
  }
}
