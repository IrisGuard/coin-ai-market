
import { supabase } from '@/integrations/supabase/client';

// Enhanced admin access verification using the new final function
export const verifyAdminAccess = async (): Promise<boolean> => {
  try {
    // Check authentication first
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      console.warn('Authentication failed:', authError);
      return false;
    }

    // Use the new secure function that prevents infinite recursion
    const { data: adminCheck, error: adminError } = await supabase
      .rpc('verify_admin_access_final', { user_uuid: user.id });
    
    if (adminError) {
      console.warn('Admin verification failed:', adminError);
      return false;
    }

    return Boolean(adminCheck);

  } catch (error) {
    console.error('Admin access verification failed:', error);
    return false;
  }
};

// Safe query wrapper with comprehensive error handling
export const safeQuery = async <T>(
  queryFn: () => Promise<{ data: T; error: any }>
): Promise<{ data: T | null; error: string | null }> => {
  try {
    const result = await queryFn();
    
    if (result.error) {
      const handledError = handleSupabaseError(result.error, 'database_query');
      return { data: null, error: handledError };
    }

    return { data: result.data, error: null };

  } catch (error: any) {
    const handledError = handleSupabaseError(error, 'query_execution');
    return { data: null, error: handledError };
  }
};

// Enhanced error handling with security-focused messaging
export const handleSupabaseError = (error: any, context: string): string => {
  // Log the full error for debugging (server-side only)
  console.error(`Supabase error in ${context}:`, error);

  // Security-focused error messages for users
  if (error?.code === 'PGRST116' || error?.message?.includes('permission denied')) {
    return 'Access denied. Administrative privileges required.';
  }

  if (error?.code === 'PGRST301' || error?.message?.includes('JWT')) {
    return 'Authentication expired. Please log in again.';
  }

  if (error?.code === '23505' || error?.message?.includes('duplicate')) {
    return 'Resource already exists. Please check for duplicates.';
  }

  if (error?.code === '23503' || error?.message?.includes('foreign key')) {
    return 'Operation failed. Referenced resource may not exist.';
  }

  if (error?.code === '42501' || error?.message?.includes('insufficient privilege')) {
    return 'Insufficient permissions for this operation.';
  }

  // Network and connection errors
  if (error?.message?.includes('Failed to fetch') || error?.message?.includes('network')) {
    return 'Network error. Please check your connection and try again.';
  }

  // Rate limiting
  if (error?.message?.includes('rate limit') || error?.status === 429) {
    return 'Too many requests. Please wait before trying again.';
  }

  // Generic fallback that doesn't expose system details
  return 'An error occurred while processing your request. Please try again.';
};

// Security event logging
export const logSecurityEvent = async (
  eventType: string, 
  eventDetails: string | object,
  severity: 'low' | 'medium' | 'high' | 'critical' = 'medium'
): Promise<void> => {
  try {
    const eventData = {
      event_type: `security_${eventType}`,
      event_details: typeof eventDetails === 'string' ? eventDetails : JSON.stringify(eventDetails),
      severity,
      timestamp: new Date().toISOString(),
      user_agent: navigator?.userAgent || 'unknown',
      page_url: window?.location?.href || 'unknown'
    };

    // Use analytics_events table for logging
    await supabase
      .from('analytics_events')
      .insert({
        event_type: eventData.event_type,
        page_url: eventData.page_url,
        metadata: {
          details: eventData.event_details,
          severity: eventData.severity,
          timestamp: eventData.timestamp,
          user_agent: eventData.user_agent
        }
      });

  } catch (error) {
    // Fail silently for logging errors to prevent infinite loops
    console.warn('Failed to log security event:', error);
  }
};
