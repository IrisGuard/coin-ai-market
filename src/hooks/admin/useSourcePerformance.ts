
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export const useSourcePerformanceMetrics = () => {
  return useQuery({
    queryKey: ['source-performance-metrics'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('source_performance_metrics')
        .select(`
          *,
          external_price_sources!source_performance_metrics_source_id_fkey (
            source_name,
            source_type
          )
        `)
        .order('date', { ascending: false });
      
      if (error) throw error;
      return data || [];
    },
  });
};
