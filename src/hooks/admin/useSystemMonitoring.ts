
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';

export const useSystemPerformanceMetrics = () => {
  return useQuery({
    queryKey: ['system-performance-metrics'],
    queryFn: async () => {
      const { data, error } = await supabase.rpc('get_system_performance_metrics');
      
      if (error) throw error;
      return data;
    },
    refetchInterval: 15000, // Refresh every 15 seconds for real-time monitoring
  });
};

export const useSystemAlerts = () => {
  return useQuery({
    queryKey: ['system-alerts'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('system_alerts')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data || [];
    },
    refetchInterval: 10000, // Refresh every 10 seconds
  });
};

export const usePerformanceBenchmarks = () => {
  return useQuery({
    queryKey: ['performance-benchmarks'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('performance_benchmarks')
        .select('*')
        .order('last_updated', { ascending: false });
      
      if (error) throw error;
      return data || [];
    },
  });
};

export const useCreateSystemAlert = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (alertData: {
      alert_type: string;
      severity: string;
      title: string;
      description?: string;
      metric_threshold?: number;
      current_value?: number;
      alert_data?: any;
    }) => {
      const { data, error } = await supabase
        .from('system_alerts')
        .insert(alertData)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['system-alerts'] });
      toast({
        title: "Alert Created",
        description: "System alert has been created successfully.",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: `Failed to create alert: ${error.message}`,
        variant: "destructive",
      });
    },
  });
};

export const useResolveAlert = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (alertId: string) => {
      const { data, error } = await supabase
        .from('system_alerts')
        .update({ 
          is_resolved: true, 
          resolved_at: new Date().toISOString() 
        })
        .eq('id', alertId)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['system-alerts'] });
      toast({
        title: "Alert Resolved",
        description: "System alert has been marked as resolved.",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: `Failed to resolve alert: ${error.message}`,
        variant: "destructive",
      });
    },
  });
};
