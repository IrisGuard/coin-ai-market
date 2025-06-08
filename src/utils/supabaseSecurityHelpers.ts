
import { supabase } from '@/integrations/supabase/client';

export const verifyAdminAccess = async (): Promise<boolean> => {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return false;

    const { data, error } = await supabase
      .from('user_roles')
      .select('role')
      .eq('user_id', user.id)
      .eq('role', 'admin')
      .single();

    return !error && !!data;
  } catch (error) {
    console.error('Admin verification failed:', error);
    return false;
  }
};

export const safeQuery = async <T>(
  queryFn: () => Promise<{ data: T; error: any }>
): Promise<{ data: T | null; error: any }> => {
  try {
    const result = await queryFn();
    return result;
  } catch (error) {
    console.error('Safe query failed:', error);
    return { data: null, error };
  }
};

export const handleSupabaseError = (error: any, operation: string): string => {
  if (error?.code === 'PGRST301') {
    return 'Access denied - insufficient permissions';
  }
  if (error?.code === 'PGRST116') {
    return 'No data found';
  }
  if (error?.message?.includes('JWT')) {
    return 'Authentication required';
  }
  
  console.error(`${operation} error:`, error);
  return error?.message || `Failed to ${operation}`;
};

export const logSecurityEvent = async (eventType: string, details: any = {}) => {
  try {
    await supabase.from('analytics_events').insert({
      event_type: `security_${eventType}`,
      metadata: {
        ...details,
        timestamp: new Date().toISOString(),
        user_agent: navigator.userAgent
      }
    });
  } catch (error) {
    console.warn('Failed to log security event:', error);
  }
};
