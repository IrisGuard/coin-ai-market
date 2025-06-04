
import { supabase } from '@/integrations/supabase/client';

export const logError = async (error: any, context?: string) => {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    
    const { error: insertError } = await supabase
      .from('error_logs')
      .insert([{
        message: error.message || String(error),
        error_type: error.name || 'Unknown',
        stack_trace: error.stack,
        page_url: window.location.href,
        user_agent: navigator.userAgent,
        user_id: user?.id
      }]);

    if (insertError) {
      console.error('Failed to log error to database:', insertError);
    }
  } catch (dbError) {
    console.error('Error logging to database:', dbError);
  }
};

export const logConsoleError = async (
  message: string,
  source?: string,
  lineno?: number,
  colno?: number,
  error?: Error
) => {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    
    const { error: insertError } = await supabase
      .from('console_errors')
      .insert([{
        message,
        error_level: 'error',
        source_file: source,
        line_number: lineno,
        column_number: colno,
        user_id: user?.id,
        session_id: sessionStorage.getItem('session_id') || undefined
      }]);

    if (insertError) {
      console.error('Failed to log console error:', insertError);
    }
  } catch (dbError) {
    console.error('Error logging console error:', dbError);
  }
};

// Set up global error handlers
if (typeof window !== 'undefined') {
  window.addEventListener('error', (event) => {
    logConsoleError(
      event.message,
      event.filename,
      event.lineno,
      event.colno,
      event.error
    );
  });

  window.addEventListener('unhandledrejection', (event) => {
    logError(event.reason, 'Unhandled Promise Rejection');
  });
}
