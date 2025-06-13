
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { verifyAdminAccess } from '@/utils/supabaseSecurityHelpers';

// Clean Error Reference Sources Hook με ενσωματωμένα policies
export const useCleanErrorReferenceSources = () => {
  return useQuery({
    queryKey: ['clean-error-reference-sources'],
    queryFn: async () => {
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
    }
  });
};

// Clean Source Performance Metrics Hook με ενσωματωμένα policies
export const useCleanSourcePerformanceMetrics = () => {
  return useQuery({
    queryKey: ['clean-source-performance-metrics'],
    queryFn: async () => {
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
    }
  });
};

// Clean VPN Proxies Hook με ενσωματωμένα policies
export const useCleanVpnProxies = () => {
  return useQuery({
    queryKey: ['clean-vpn-proxies'],
    queryFn: async () => {
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
    }
  });
};
