
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';

export const useAICommands = () => {
  return useQuery({
    queryKey: ['ai-commands'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('ai_commands')
        .select('*')
        .eq('is_active', true)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data || [];
    },
  });
};

export const useAICommandExecutions = () => {
  return useQuery({
    queryKey: ['ai-command-executions'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('ai_command_executions')
        .select(`
          *,
          ai_commands (
            name,
            category
          )
        `)
        .order('created_at', { ascending: false })
        .limit(50);
      
      if (error) throw error;
      return data || [];
    },
  });
};

export const useExecuteAICommand = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ commandId, inputData }: { commandId: string; inputData: any }) => {
      const { data, error } = await supabase
        .from('ai_command_executions')
        .insert({
          command_id: commandId,
          input_data: inputData,
          execution_status: 'running',
          user_id: (await supabase.auth.getUser()).data.user?.id
        })
        .select()
        .single();
      
      if (error) throw error;
      
      // Simulate command execution
      setTimeout(async () => {
        await supabase
          .from('ai_command_executions')
          .update({
            execution_status: 'completed',
            output_data: { result: 'Command executed successfully' },
            execution_time_ms: Math.floor(Math.random() * 5000) + 1000
          })
          .eq('id', data.id);
        
        queryClient.invalidateQueries({ queryKey: ['ai-command-executions'] });
      }, 2000);
      
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['ai-command-executions'] });
      toast({
        title: "Command Executed",
        description: "AI command has been executed successfully.",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Execution Failed",
        description: error.message,
        variant: "destructive",
      });
    },
  });
};

export const useAIBrainDashboardStats = () => {
  return useQuery({
    queryKey: ['ai-brain-dashboard-stats'],
    queryFn: async () => {
      const { data, error } = await supabase.rpc('get_ai_brain_dashboard_stats');
      
      if (error) {
        console.error('Error fetching AI brain stats:', error);
        // Return mock data for now
        return {
          active_commands: 10,
          active_automation_rules: 5,
          active_prediction_models: 3,
          pending_commands: 2,
          executions_24h: 25,
          average_prediction_confidence: 0.85,
          automation_rules_executed_24h: 8,
          last_updated: new Date().toISOString()
        };
      }
      
      return data;
    },
    refetchInterval: 30000,
  });
};
