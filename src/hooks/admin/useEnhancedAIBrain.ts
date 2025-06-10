
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';

export const useAutomationRules = () => {
  return useQuery({
    queryKey: ['automation-rules'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('automation_rules')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data || [];
    },
  });
};

export const usePredictionModels = () => {
  return useQuery({
    queryKey: ['prediction-models'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('prediction_models')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data || [];
    },
  });
};

export const useCommandQueue = () => {
  return useQuery({
    queryKey: ['command-queue'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('command_queue')
        .select(`
          *,
          ai_commands(name, category)
        `)
        .order('priority', { ascending: false })
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data || [];
    },
  });
};

export const useAIPerformanceMetrics = () => {
  return useQuery({
    queryKey: ['ai-performance-metrics'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('ai_performance_metrics')
        .select('*')
        .order('recorded_at', { ascending: false })
        .limit(100);
      
      if (error) throw error;
      return data || [];
    },
  });
};

export const useAIBrainDashboardStats = () => {
  return useQuery({
    queryKey: ['ai-brain-dashboard-stats'],
    queryFn: async () => {
      const { data, error } = await supabase.rpc('get_ai_brain_dashboard_stats');
      
      if (error) throw error;
      return data;
    },
    refetchInterval: 30000, // Refresh every 30 seconds
  });
};

export const useExecuteAutomationRule = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (ruleId: string) => {
      const { data, error } = await supabase.rpc('execute_automation_rule', {
        rule_id: ruleId
      });
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['automation-rules'] });
      queryClient.invalidateQueries({ queryKey: ['ai-performance-metrics'] });
      toast({
        title: "Success",
        description: "Automation rule executed successfully.",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: `Failed to execute automation rule: ${error.message}`,
        variant: "destructive",
      });
    },
  });
};

export const useGeneratePrediction = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ modelId, inputData }: { modelId: string; inputData: any }) => {
      const { data, error } = await supabase.rpc('generate_ai_prediction', {
        model_id: modelId,
        input_data: inputData
      });
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['ai-predictions'] });
      queryClient.invalidateQueries({ queryKey: ['ai-performance-metrics'] });
      toast({
        title: "Success",
        description: "AI prediction generated successfully.",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: `Failed to generate prediction: ${error.message}`,
        variant: "destructive",
      });
    },
  });
};
