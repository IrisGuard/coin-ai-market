
import { supabase } from '@/integrations/supabase/client';
import { logSecurityEvent } from './securityConfig';

export interface SafeQueryResult<T> {
  data: T | null;
  error: string | null;
}

/**
 * Verifies admin access using the secure RPC function
 */
export const verifyAdminAccess = async (): Promise<boolean> => {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      await logSecurityEvent('ADMIN_ACCESS_DENIED', { reason: 'No authenticated user' });
      return false;
    }

    const { data, error } = await supabase
      .rpc('is_admin_user', { user_id: user.id });

    if (error) {
      console.error('Admin verification error:', error);
      await logSecurityEvent('ADMIN_VERIFICATION_ERROR', { 
        error: error.message, 
        userId: user.id 
      });
      return false;
    }

    if (!data) {
      await logSecurityEvent('ADMIN_ACCESS_DENIED', { 
        reason: 'Insufficient privileges',
        userId: user.id 
      });
    }

    return !!data;
  } catch (error) {
    console.error('Admin access verification failed:', error);
    await logSecurityEvent('ADMIN_ACCESS_ERROR', { 
      error: error instanceof Error ? error.message : 'Unknown error' 
    });
    return false;
  }
};

/**
 * Safe query wrapper that handles errors and provides consistent return format
 */
export const safeQuery = async <T>(
  queryFn: () => Promise<{ data: T; error: any }>
): Promise<SafeQueryResult<T>> => {
  try {
    const result = await queryFn();
    
    if (result.error) {
      const handledError = handleSupabaseError(result.error, 'database query');
      return { data: null, error: handledError };
    }
    
    return { data: result.data, error: null };
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
    console.error('Safe query error:', errorMessage);
    return { data: null, error: errorMessage };
  }
};

/**
 * Enhanced error handler for Supabase operations
 */
export const handleSupabaseError = (error: any, operation: string): string => {
  if (!error) return 'Unknown error occurred';
  
  // Handle common Supabase error patterns
  if (error.code === 'PGRST116') {
    return 'The requested resource was not found.';
  }
  
  if (error.code === '42501') {
    return 'Access denied. Please check your permissions.';
  }
  
  if (error.code === '23505') {
    return 'This record already exists.';
  }
  
  if (error.code === '23503') {
    return 'Cannot complete operation due to missing dependencies.';
  }
  
  if (error.message?.includes('JWT')) {
    return 'Authentication token expired. Please log in again.';
  }
  
  if (error.message?.includes('RLS')) {
    return 'Access denied by security policy.';
  }
  
  // Log the error for debugging
  console.error(`Supabase error in ${operation}:`, error);
  
  // Return user-friendly message
  return error.message || `An error occurred during ${operation}`;
};

/**
 * Validates sensitive operations before execution
 */
export const validateSensitiveOperation = async (
  operationType: string,
  context?: Record<string, any>
): Promise<boolean> => {
  const isAdmin = await verifyAdminAccess();
  
  if (!isAdmin) {
    await logSecurityEvent('UNAUTHORIZED_OPERATION_ATTEMPT', {
      operation: operationType,
      context
    });
    return false;
  }
  
  await logSecurityEvent('ADMIN_OPERATION', {
    operation: operationType,
    context
  });
  
  return true;
};

/**
 * Rate limiting helper for admin operations
 */
const operationCounts = new Map<string, { count: number; resetTime: number }>();

export const checkRateLimit = (operation: string, limit: number = 10, windowMs: number = 60000): boolean => {
  const now = Date.now();
  const key = `${operation}_rate_limit`;
  const current = operationCounts.get(key);
  
  if (!current || now > current.resetTime) {
    operationCounts.set(key, { count: 1, resetTime: now + windowMs });
    return true;
  }
  
  if (current.count >= limit) {
    return false;
  }
  
  current.count++;
  return true;
};
