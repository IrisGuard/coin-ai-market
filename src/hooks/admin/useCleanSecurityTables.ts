
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { verifyAdminAccess } from '@/utils/supabaseSecurityHelpers';

// Clean Error Reference Sources Hook with enhanced error handling
export const useCleanErrorReferenceSources = () => {
  return useQuery({
    queryKey: ['clean-error-reference-sources'],
    queryFn: async () => {
      console.log('🔍 Fetching clean error reference sources...');
      
      const isAdmin = await verifyAdminAccess();
      if (!isAdmin) {
        throw new Error('Admin access required for error reference sources');
      }

      const { data, error } = await supabase
        .from('error_reference_sources')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) {
        console.error('❌ Error fetching error reference sources:', error);
        throw error;
      }
      
      console.log('✅ Clean error reference sources loaded:', data?.length || 0);
      return data || [];
    },
    retry: (failureCount, error: any) => {
      if (error?.message?.includes('Admin access required')) {
        return false;
      }
      return failureCount < 2;
    },
    staleTime: 60000, // 1 minute
    refetchOnWindowFocus: false
  });
};

// Clean Source Performance Metrics Hook with enhanced error handling
export const useCleanSourcePerformanceMetrics = () => {
  return useQuery({
    queryKey: ['clean-source-performance-metrics'],
    queryFn: async () => {
      console.log('🔍 Fetching clean source performance metrics...');
      
      const isAdmin = await verifyAdminAccess();
      if (!isAdmin) {
        throw new Error('Admin access required for source performance metrics');
      }

      const { data, error } = await supabase
        .from('source_performance_metrics')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) {
        console.error('❌ Error fetching source performance metrics:', error);
        throw error;
      }
      
      console.log('✅ Clean source performance metrics loaded:', data?.length || 0);
      return data || [];
    },
    retry: (failureCount, error: any) => {
      if (error?.message?.includes('Admin access required')) {
        return false;
      }
      return failureCount < 2;
    },
    staleTime: 60000, // 1 minute
    refetchOnWindowFocus: false
  });
};

// Clean VPN Proxies Hook with enhanced error handling
export const useCleanVpnProxies = () => {
  return useQuery({
    queryKey: ['clean-vpn-proxies'],
    queryFn: async () => {
      console.log('🔍 Fetching clean VPN proxies...');
      
      const isAdmin = await verifyAdminAccess();
      if (!isAdmin) {
        throw new Error('Admin access required for VPN proxies');
      }

      const { data, error } = await supabase
        .from('vpn_proxies')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) {
        console.error('❌ Error fetching VPN proxies:', error);
        throw error;
      }
      
      console.log('✅ Clean VPN proxies loaded:', data?.length || 0);
      return data || [];
    },
    retry: (failureCount, error: any) => {
      if (error?.message?.includes('Admin access required')) {
        return false;
      }
      return failureCount < 2;
    },
    staleTime: 60000, // 1 minute
    refetchOnWindowFocus: false
  });
};
