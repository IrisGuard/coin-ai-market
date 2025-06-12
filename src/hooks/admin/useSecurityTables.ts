
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { verifyAdminAccess } from '@/utils/supabaseSecurityHelpers';

// Error Reference Sources Hook
export const useErrorReferenceSources = () => {
  return useQuery({
    queryKey: ['admin-error-reference-sources'],
    queryFn: async () => {
      const isAdmin = await verifyAdminAccess();
      if (!isAdmin) {
        throw new Error('Admin access required');
      }

      const { data, error } = await supabase
        .from('error_reference_sources')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
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

// Source Performance Metrics Hook
export const useSourcePerformanceMetrics = () => {
  return useQuery({
    queryKey: ['admin-source-performance-metrics'],
    queryFn: async () => {
      const isAdmin = await verifyAdminAccess();
      if (!isAdmin) {
        throw new Error('Admin access required');
      }

      const { data, error } = await supabase
        .from('source_performance_metrics')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
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

// VPN Proxies Hook
export const useVpnProxies = () => {
  return useQuery({
    queryKey: ['admin-vpn-proxies'],
    queryFn: async () => {
      const isAdmin = await verifyAdminAccess();
      if (!isAdmin) {
        throw new Error('Admin access required');
      }

      const { data, error } = await supabase
        .from('vpn_proxies')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
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
