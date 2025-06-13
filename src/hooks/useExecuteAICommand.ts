
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export const useExecuteAICommand = () => {
  const queryClient = useQueryClient();

  const executeCommandMutation = useMutation({
    mutationFn: async ({ commandId, inputData }: { commandId: string; inputData: any }) => {
      console.log('▶️ Executing REAL AI command from admin system:', commandId);
      
      // Use the existing execute_ai_command function
      const { data, error } = await supabase.rpc('execute_ai_command', {
        p_command_id: commandId,
        p_input_data: inputData
      });

      if (error) {
        console.error('❌ AI command execution error:', error);
        throw error;
      }

      console.log('✅ AI command executed successfully:', data);
      return data;
    },
    onSuccess: (data) => {
      toast.success('AI Command executed successfully');
      queryClient.invalidateQueries({ queryKey: ['ai-command-executions'] });
      queryClient.invalidateQueries({ queryKey: ['real-performance-metrics'] });
    },
    onError: (error: any) => {
      console.error('❌ Execute command error:', error);
      toast.error(`Command execution failed: ${error.message}`);
    }
  });

  return {
    executeCommand: (commandId: string, inputData: any = {}) => 
      executeCommandMutation.mutate({ commandId, inputData }),
    isExecuting: executeCommandMutation.isPending
  };
};
