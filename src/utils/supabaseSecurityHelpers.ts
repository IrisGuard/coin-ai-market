
import { supabase } from '@/integrations/supabase/client';

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
      return false;
    }

    return !!data;
  } catch (error) {
    console.error('Admin verification failed:', error);
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
      return { data: null, error: { message: 'Access denied by security policy' } };
    }
    throw error;
  }
};

/**
 * Enhanced error handler for Supabase operations
 */
export const handleSupabaseError = (error: any, operation: string) => {
  if (!error) return null;

  const errorMessage = error.message || 'Unknown error';
  
  // Log specific error types for debugging
  if (errorMessage.includes('row-level security')) {
    console.error(`RLS violation in ${operation}:`, errorMessage);
    return 'Access denied by security policy';
  }
  
  if (errorMessage.includes('insufficient privilege')) {
    console.error(`Privilege error in ${operation}:`, errorMessage);
    return 'Insufficient permissions';
  }
  
  if (errorMessage.includes('violates check constraint')) {
    console.error(`Constraint violation in ${operation}:`, errorMessage);
    return 'Data validation failed';
  }

  console.error(`Error in ${operation}:`, errorMessage);
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
      return null;
    }

    return data;
  } catch (error) {
    console.error('API key encryption failed:', error);
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
      return null;
    }

    return data;
  } catch (error) {
    console.error('Tenant validation failed:', error);
    return null;
  }
};
