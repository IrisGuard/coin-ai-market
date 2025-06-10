
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export const useErrorLogs = () => {
  return useQuery({
    queryKey: ['error-logs'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('error_logs')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(50);
      
      if (error) throw error;
      return data || [];
    },
    staleTime: 60000, // 1 minute
  });
};

export const useConsoleErrors = () => {
  return useQuery({
    queryKey: ['console-errors'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('console_errors')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(50);
      
      if (error) throw error;
      return data || [];
    },
    staleTime: 60000, // 1 minute
  });
};

export const useErrorAnalytics = () => {
  return useQuery({
    queryKey: ['error-analytics'],
    queryFn: async () => {
      // Get error statistics
      const [
        { count: totalErrors },
        { count: criticalErrors },
        { count: highErrors },
        { count: mediumErrors },
        { data: errorsByType }
      ] = await Promise.all([
        supabase.from('error_logs').select('*', { count: 'exact', head: true }),
        supabase.from('error_logs').select('*', { count: 'exact', head: true }).eq('error_type', 'critical'),
        supabase.from('error_logs').select('*', { count: 'exact', head: true }).eq('error_type', 'high'),
        supabase.from('error_logs').select('*', { count: 'exact', head: true }).eq('error_type', 'medium'),
        supabase.from('error_logs')
          .select('error_type, created_at')
          .order('created_at', { ascending: false })
          .limit(100)
      ]);

      // Calculate categories based on actual data
      const categories = [];
      const typeCounts = {};
      
      if (errorsByType) {
        errorsByType.forEach(error => {
          const type = error.error_type || 'unknown';
          typeCounts[type] = (typeCounts[type] || 0) + 1;
        });
        
        for (const [type, count] of Object.entries(typeCounts)) {
          categories.push({ type, count });
        }
      }

      return {
        critical_24h: criticalErrors || 0,
        error_rate: totalErrors ? ((criticalErrors + highErrors) / totalErrors) * 100 : 0,
        avg_resolution_time: 15, // This would need a more complex calculation in the future
        categories: categories,
        total_errors: totalErrors || 0
      };
    },
    staleTime: 60000, // 1 minute
  });
};
