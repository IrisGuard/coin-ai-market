
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export const useErrorLogs = () => {
  return useQuery({
    queryKey: ['admin-error-logs'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('error_logs')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(100);
      
      if (error) throw error;
      return data || [];
    },
    refetchInterval: 30000, // Refresh every 30 seconds
  });
};

export const useConsoleErrors = () => {
  return useQuery({
    queryKey: ['admin-console-errors'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('console_errors')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(50);
      
      if (error) throw error;
      return data || [];
    },
    refetchInterval: 30000,
  });
};

export const useErrorAnalytics = () => {
  return useQuery({
    queryKey: ['admin-error-analytics'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('error_logs')
        .select('error_type, created_at')
        .gte('created_at', new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString());
      
      if (error) throw error;
      
      // Process analytics data
      const criticalCount = data?.filter(e => 
        e.error_type === 'critical' || e.error_type === 'error'
      ).length || 0;
      
      const categories = data?.reduce((acc: any[], curr) => {
        const existing = acc.find(item => item.type === curr.error_type);
        if (existing) {
          existing.count++;
        } else {
          acc.push({ type: curr.error_type, count: 1 });
        }
        return acc;
      }, []) || [];
      
      return {
        critical_24h: criticalCount,
        error_rate: data?.length ? (criticalCount / data.length) * 100 : 0,
        avg_resolution_time: 25, // Mock data for now
        categories
      };
    },
    refetchInterval: 60000,
  });
};
