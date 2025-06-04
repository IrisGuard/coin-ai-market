
import { supabase } from '@/integrations/supabase/client';

export class ErrorHandler {
  private static sessionId = Math.random().toString(36).substring(2, 15);

  static async logError(
    errorType: string,
    message: string,
    stackTrace?: string,
    pageUrl?: string
  ): Promise<void> {
    try {
      await supabase.rpc('log_error', {
        error_type_param: errorType,
        message_param: message,
        stack_trace_param: stackTrace || null,
        page_url_param: pageUrl || window.location.href,
        user_agent_param: navigator.userAgent
      });
    } catch (error) {
      console.error('Failed to log error:', error);
    }
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
        message_param: message,
        source_file_param: sourceFile || null,
        line_number_param: lineNumber || null,
        column_number_param: columnNumber || null,
        session_id_param: this.sessionId
      });
    } catch (error) {
      console.error('Failed to log console error:', error);
    }
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
    try {
      const { data, error } = await supabase
        .from('system_config')
        .select('config_value')
        .eq('config_key', 'error_monitoring_enabled')
        .single();

      if (error) return false;
      return data?.config_value === true;
    } catch {
      return false;
    }
  }
}
