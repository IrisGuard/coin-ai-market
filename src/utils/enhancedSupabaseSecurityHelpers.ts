
import { supabase } from '@/integrations/supabase/client';

// Enhanced admin access verification with multiple security layers
export const verifyEnhancedAdminAccess = async (): Promise<boolean> => {
  try {
    // Check authentication
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      console.warn('Authentication failed:', authError);
      await logEnhancedSecurityEvent('admin_access_denied', 'authentication_failed');
      return false;
    }

    // Verify admin role with enhanced security
    const { data: adminCheck, error: adminError } = await supabase
      .rpc('verify_admin_access_secure', { user_id: user.id });
    
    if (adminError) {
      console.warn('Admin verification failed:', adminError);
      await logEnhancedSecurityEvent('admin_access_denied', 'role_verification_failed');
      return false;
    }

    if (!adminCheck) {
      await logEnhancedSecurityEvent('admin_access_denied', 'insufficient_privileges');
      return false;
    }

    // Log successful admin access
    await logEnhancedSecurityEvent('admin_access_granted', 'success');
    return true;

  } catch (error) {
    console.error('Enhanced admin access verification failed:', error);
    await logEnhancedSecurityEvent('admin_access_error', 'system_error');
    return false;
  }
};

// Enhanced safe query wrapper with comprehensive error handling
export const enhancedSafeQuery = async <T>(
  queryFn: () => Promise<{ data: T; error: any }>
): Promise<{ data: T | null; error: string | null }> => {
  try {
    const result = await queryFn();
    
    if (result.error) {
      const handledError = handleEnhancedSupabaseError(result.error, 'database_query');
      await logEnhancedSecurityEvent('database_error', handledError);
      return { data: null, error: handledError };
    }

    return { data: result.data, error: null };

  } catch (error: any) {
    const handledError = handleEnhancedSupabaseError(error, 'query_execution');
    await logEnhancedSecurityEvent('query_error', handledError);
    return { data: null, error: handledError };
  }
};

// Enhanced error handling with security-focused messaging
export const handleEnhancedSupabaseError = (error: any, context: string): string => {
  // Log the full error for debugging (server-side only)
  console.error(`Enhanced Supabase error in ${context}:`, error);

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

// Enhanced security event logging with structured data
export const logEnhancedSecurityEvent = async (
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

    // Use the enhanced security logging function
    await supabase.rpc('log_production_error', {
      error_type: eventData.event_type,
      error_message: eventData.event_details,
      error_context: {
        severity: eventData.severity,
        timestamp: eventData.timestamp,
        user_agent: eventData.user_agent,
        page_url: eventData.page_url
      }
    });

  } catch (error) {
    // Fail silently for logging errors to prevent infinite loops
    console.warn('Failed to log security event:', error);
  }
};

// Enhanced session validation with security checks
export const validateEnhancedAdminSession = async (): Promise<{
  isValid: boolean;
  timeLeft: number;
  requiresReauth: boolean;
}> => {
  try {
    const { data: { session }, error } = await supabase.auth.getSession();
    
    if (error || !session) {
      await logEnhancedSecurityEvent('session_validation_failed', 'no_session');
      return { isValid: false, timeLeft: 0, requiresReauth: true };
    }

    // Check if session is close to expiry (less than 5 minutes)
    const expiryTime = new Date(session.expires_at || 0).getTime();
    const currentTime = Date.now();
    const timeLeft = expiryTime - currentTime;
    const requiresReauth = timeLeft < 5 * 60 * 1000; // 5 minutes

    if (requiresReauth) {
      await logEnhancedSecurityEvent('session_near_expiry', { timeLeft });
    }

    return {
      isValid: timeLeft > 0,
      timeLeft: Math.max(0, timeLeft),
      requiresReauth
    };

  } catch (error) {
    await logEnhancedSecurityEvent('session_validation_error', error);
    return { isValid: false, timeLeft: 0, requiresReauth: true };
  }
};

export default {
  verifyEnhancedAdminAccess,
  enhancedSafeQuery,
  handleEnhancedSupabaseError,
  logEnhancedSecurityEvent,
  validateEnhancedAdminSession
};
