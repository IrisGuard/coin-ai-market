
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

export const useExecuteAICommand = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ 
      commandId, 
      inputData 
    }: { 
      commandId: string; 
      inputData: any 
    }) => {
      const startTime = Date.now();
      
      try {
        // Get command details
        const { data: command, error: commandError } = await supabase
          .from('ai_commands')
          .select('*')
          .eq('id', commandId)
          .single();
        
        if (commandError) throw commandError;
        
        // Log execution start
        const { data: execution, error: execError } = await supabase
          .from('ai_command_executions')
          .insert({
            command_id: commandId,
            user_id: (await supabase.auth.getUser()).data.user?.id,
            input_data: inputData,
            execution_status: 'running'
          })
          .select()
          .single();
        
        if (execError) throw execError;
        
        // Simulate command execution (replace with actual AI processing)
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        const executionTime = Date.now() - startTime;
        const outputData = {
          result: 'Command executed successfully',
          processed_at: new Date().toISOString(),
          input_processed: inputData
        };
        
        // Update execution log
        const { error: updateError } = await supabase
          .from('ai_command_executions')
          .update({
            execution_status: 'completed',
            output_data: outputData,
            execution_time_ms: executionTime
          })
          .eq('id', execution.id);
        
        if (updateError) throw updateError;
        
        return { success: true, output: outputData, executionTime };
        
      } catch (error) {
        // Log execution failure
        await supabase
          .from('ai_command_executions')
          .update({
            execution_status: 'failed',
            error_message: error instanceof Error ? error.message : 'Unknown error',
            execution_time_ms: Date.now() - startTime
          })
          .eq('command_id', commandId);
        
        throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['ai-command-executions'] });
      toast({
        title: "Success",
        description: "AI command executed successfully.",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: `Command execution failed: ${error.message}`,
        variant: "destructive",
      });
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
          ai_commands(name, category),
          profiles(name, email)
        `)
        .order('created_at', { ascending: false })
        .limit(100);
      
      if (error) throw error;
      return data || [];
    },
  });
};
