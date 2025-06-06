
import { supabase } from '@/integrations/supabase/client';
import { logSecurityEvent } from './securityConfig';

/**
 * Secure admin verification utility
 * Uses the updated is_admin_user function with proper security settings
 */
export const verifyAdminAccess = async (userId?: string): Promise<boolean> => {
  try {
    if (!userId) {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return false;
      userId = user.id;
    }

    const { data, error } = await supabase
      .rpc('is_admin_user', { user_id: userId });

    if (error) {
      console.error('Admin verification error:', error);
      await logSecurityEvent('admin_verification_failed', { error: error.message, userId });
      return false;
    }

    // Log successful admin verification
    if (data) {
      await logSecurityEvent('admin_verified', { userId });
    }

    return !!data;
  } catch (error) {
    console.error('Admin verification failed:', error);
    await logSecurityEvent('admin_verification_error', { error: error instanceof Error ? error.message : 'Unknown error', userId });
    return false;
  }
};

/**
 * Safe query wrapper that handles RLS policy violations gracefully
 */
export const safeQuery = async <T>(
  queryFn: () => Promise<{ data: T | null; error: any }>
): Promise<{ data: T | null; error: any }> => {
  try {
    const result = await queryFn();
    return result;
  } catch (error: any) {
    if (error?.message?.includes('row-level security') || 
        error?.message?.includes('insufficient privilege')) {
      console.warn('RLS policy blocked query:', error.message);
      await logSecurityEvent('rls_policy_violation', { error: error.message });
      return { data: null, error: { message: 'Access denied by security policy' } };
    }
    throw error;
  }
};

/**
 * Enhanced error handler for Supabase operations - FIXED: Now returns string directly
 */
export const handleSupabaseError = (error: any, operation: string): string | null => {
  if (!error) return null;

  const errorMessage = error.message || 'Unknown error';
  
  // Log specific error types for debugging (async operations moved to separate function)
  if (errorMessage.includes('row-level security')) {
    console.error(`RLS violation in ${operation}:`, errorMessage);
    logSecurityEvent('rls_violation', { operation, error: errorMessage });
    return 'Access denied by security policy';
  }
  
  if (errorMessage.includes('insufficient privilege')) {
    console.error(`Privilege error in ${operation}:`, errorMessage);
    logSecurityEvent('privilege_error', { operation, error: errorMessage });
    return 'Insufficient permissions';
  }
  
  if (errorMessage.includes('violates check constraint')) {
    console.error(`Constraint violation in ${operation}:`, errorMessage);
    logSecurityEvent('constraint_violation', { operation, error: errorMessage });
    return 'Data validation failed';
  }

  console.error(`Error in ${operation}:`, errorMessage);
  logSecurityEvent('general_error', { operation, error: errorMessage });
  return errorMessage;
};

/**
 * Secure API key encryption helper
 * Uses the new encrypt_api_key_secure function
 */
export const encryptApiKey = async (plainKey: string): Promise<string | null> => {
  try {
    const { data, error } = await supabase
      .rpc('encrypt_api_key_secure', { plain_key: plainKey });

    if (error) {
      console.error('API key encryption error:', error);
      await logSecurityEvent('api_key_encryption_failed', { error: error.message });
      return null;
    }

    await logSecurityEvent('api_key_encrypted', { success: true });
    return data;
  } catch (error) {
    console.error('API key encryption failed:', error);
    await logSecurityEvent('api_key_encryption_error', { error: error instanceof Error ? error.message : 'Unknown error' });
    return null;
  }
};

/**
 * Enhanced security validation for tenant operations
 */
export const validateTenantAccess = async (domain: string): Promise<string | null> => {
  try {
    const { data, error } = await supabase
      .rpc('get_tenant_from_domain', { domain_name: domain });

    if (error) {
      console.error('Tenant validation error:', error);
      await logSecurityEvent('tenant_validation_failed', { domain, error: error.message });
      return null;
    }

    await logSecurityEvent('tenant_validated', { domain, tenantId: data });
    return data;
  } catch (error) {
    console.error('Tenant validation failed:', error);
    await logSecurityEvent('tenant_validation_error', { domain, error: error instanceof Error ? error.message : 'Unknown error' });
    return null;
  }
};
