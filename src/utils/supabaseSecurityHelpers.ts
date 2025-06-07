
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';

/**
 * Verifies if the current user has admin access
 * Uses the secure is_admin_user function from the database
 */
export const verifyAdminAccess = async (): Promise<boolean> => {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return false;

    const { data, error } = await supabase
      .rpc('is_admin_user', { user_id: user.id });

    if (error) {
      console.error('Admin verification error:', error);
      return false;
    }

    return !!data;
  } catch (error) {
    console.error('Admin access verification failed:', error);
    return false;
  }
};

/**
 * Safe query wrapper that handles errors gracefully
 */
export const safeQuery = async <T>(queryFn: () => Promise<{ data: T; error: any }>): Promise<{ data: T | null; error: any }> => {
  try {
    const result = await queryFn();
    return result;
  } catch (error) {
    console.error('Query error:', error);
    return { data: null, error };
  }
};

/**
 * Handles Supabase errors with user-friendly messages
 */
export const handleSupabaseError = (error: any, operation: string): string => {
  if (error?.code === 'PGRST301') {
    return 'Access denied: Insufficient permissions';
  }
  if (error?.code === '42501') {
    return 'Access denied: Admin privileges required';
  }
  if (error?.message?.includes('RLS')) {
    return 'Security policy violation';
  }
  return `Failed to ${operation}: ${error?.message || 'Unknown error'}`;
};

/**
 * Logs security events for audit purposes
 */
export const logSecurityEvent = async (eventType: string, details: any = {}) => {
  try {
    await supabase.rpc('log_security_event', {
      event_type: eventType,
      event_details: {
        ...details,
        timestamp: new Date().toISOString(),
        page_url: window.location.href
      }
    });
  } catch (error) {
    console.error('Failed to log security event:', error);
  }
};
