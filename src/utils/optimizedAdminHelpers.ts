
import { supabase } from '@/integrations/supabase/client';

// Use the new optimized admin verification function
export const verifyOptimizedAdminAccess = async (): Promise<boolean> => {
  try {
    // Check authentication first
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      console.warn('Authentication failed:', authError);
      return false;
    }

    // Use the new optimized secure function
    const { data: adminCheck, error: adminError } = await supabase
      .rpc('verify_admin_access_secure');
    
    if (adminError) {
      console.warn('Admin verification failed:', adminError);
      return false;
    }

    return Boolean(adminCheck);

  } catch (error) {
    console.error('Optimized admin access verification failed:', error);
    return false;
  }
};

// Use the new optimized dashboard function
export const getOptimizedDashboardStats = async () => {
  try {
    const { data, error } = await supabase.rpc('get_admin_dashboard_optimized');
    
    if (error) {
      console.error('Failed to get optimized dashboard stats:', error);
      return null;
    }
    
    return data;
  } catch (error) {
    console.error('Dashboard stats error:', error);
    return null;
  }
};

// Performance-optimized query wrapper
export const optimizedSafeQuery = async <T>(
  queryFn: () => Promise<{ data: T; error: any }>
): Promise<{ data: T | null; error: string | null }> => {
  try {
    const startTime = performance.now();
    const result = await queryFn();
    const endTime = performance.now();
    
    // Log performance for monitoring
    console.log(`Query executed in ${endTime - startTime}ms`);
    
    if (result.error) {
      console.error('Query error:', result.error);
      return { data: null, error: result.error.message || 'Query failed' };
    }

    return { data: result.data, error: null };

  } catch (error: any) {
    console.error('Query execution error:', error);
    return { data: null, error: error.message || 'Unknown error' };
  }
};

// Enhanced admin check using the new secure function
export const checkOptimizedAdminStatus = async (): Promise<boolean> => {
  try {
    const { data, error } = await supabase.rpc('is_admin_secure');
    
    if (error) {
      console.error('Admin status check error:', error);
      return false;
    }
    
    return Boolean(data);
  } catch (error) {
    console.error('Admin status check failed:', error);
    return false;
  }
};

export default {
  verifyOptimizedAdminAccess,
  getOptimizedDashboardStats,
  optimizedSafeQuery,
  checkOptimizedAdminStatus
};
