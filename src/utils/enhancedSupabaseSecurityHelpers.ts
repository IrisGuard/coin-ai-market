
import { supabase } from '@/integrations/supabase/client';
import { logProductionError } from './enhancedSecurityConfig';

export const verifyEnhancedAdminAccess = async (): Promise<boolean> => {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return false;

    const { data, error } = await supabase
      .rpc('verify_admin_access_secure', { user_id: user.id });

    if (error) {
      await logProductionError('admin_verification_error', error.message, {
        user_id: user.id,
        function: 'verify_admin_access_secure'
      });
      return false;
    }

    return !!data;
  } catch (error) {
    console.error('Enhanced admin verification failed:', error);
    await logProductionError('admin_verification_exception', 
      error instanceof Error ? error.message : 'Unknown error', {
      function: 'verifyEnhancedAdminAccess'
    });
    return false;
  }
};

export const enhancedSafeQuery = async <T>(
  queryFn: () => Promise<{ data: T; error: any }>,
  context: string = 'unknown'
): Promise<{ data: T | null; error: any }> => {
  try {
    const result = await queryFn();
    
    if (result.error) {
      await logProductionError('database_query_error', result.error.message, {
        context,
        query_function: queryFn.name
      });
    }
    
    return result;
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    await logProductionError('database_query_exception', errorMessage, {
      context,
      query_function: queryFn.name
    });
    return { data: null, error };
  }
};

export const handleEnhancedSupabaseError = async (
  error: any, 
  operation: string
): Promise<string> => {
  const errorMessage = error?.message || `Failed to ${operation}`;
  
  // Enhanced error categorization
  let errorCategory = 'general_error';
  
  if (error?.code === 'PGRST301') {
    errorCategory = 'access_denied';
  } else if (error?.code === 'PGRST116') {
    errorCategory = 'not_found';
  } else if (error?.message?.includes('JWT')) {
    errorCategory = 'authentication_required';
  } else if (error?.message?.includes('RLS')) {
    errorCategory = 'row_level_security';
  }
  
  // Log the enhanced error
  await logProductionError(errorCategory, errorMessage, {
    operation,
    error_code: error?.code,
    error_details: error?.details,
    supabase_operation: true
  });
  
  // Return user-friendly messages
  switch (errorCategory) {
    case 'access_denied':
      return 'Access denied - insufficient permissions';
    case 'not_found':
      return 'Requested data not found';
    case 'authentication_required':
      return 'Authentication required - please log in';
    case 'row_level_security':
      return 'Access restricted by security policy';
    default:
      return errorMessage;
  }
};

export const logEnhancedSecurityEvent = async (
  eventType: string, 
  details: any = {}
) => {
  try {
    await logProductionError(`security_${eventType}`, 
      `Security event: ${eventType}`, {
      ...details,
      event_type: eventType,
      security_event: true
    });
  } catch (error) {
    console.warn('Failed to log enhanced security event:', error);
  }
};

export class EnhancedSecurityMonitor {
  private static instance: EnhancedSecurityMonitor;
  
  static getInstance(): EnhancedSecurityMonitor {
    if (!EnhancedSecurityMonitor.instance) {
      EnhancedSecurityMonitor.instance = new EnhancedSecurityMonitor();
    }
    return EnhancedSecurityMonitor.instance;
  }
  
  async logSecurityViolation(type: string, message: string, context: any = {}): Promise<void> {
    console.warn(`🚨 Security violation [${type}]: ${message}`);
    
    await logEnhancedSecurityEvent('violation', { 
      type, 
      message, 
      context,
      severity: 'high'
    });
  }
  
  async logSecurityWarning(type: string, message: string, context: any = {}): Promise<void> {
    console.warn(`⚠️ Security warning [${type}]: ${message}`);
    
    await logEnhancedSecurityEvent('warning', { 
      type, 
      message, 
      context,
      severity: 'medium'
    });
  }
  
  async logSecurityInfo(type: string, message: string, context: any = {}): Promise<void> {
    console.info(`ℹ️ Security info [${type}]: ${message}`);
    
    await logEnhancedSecurityEvent('info', { 
      type, 
      message, 
      context,
      severity: 'low'
    });
  }
}
