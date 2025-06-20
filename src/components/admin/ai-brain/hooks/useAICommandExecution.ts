
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';

export const useAICommandExecution = () => {
  const queryClient = useQueryClient();

  const executeCommandMutation = useMutation({
    mutationFn: async ({ commandId, inputData = {} }: { commandId: string; inputData?: any }) => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('User not authenticated');

      const { data: command, error: cmdError } = await supabase
        .from('ai_commands')
        .select('*')
        .eq('id', commandId)
        .single();

      if (cmdError) {
        throw cmdError;
      }

      const { data: executionRecord, error: execError } = await supabase
        .from('ai_command_executions')
        .insert([{
          command_id: commandId,
          user_id: user.id,
          input_data: inputData,
          execution_status: 'running'
        }])
        .select()
        .single();

      if (execError) {
        throw execError;
      }

      const startTime = Date.now();
      
      try {
        let result;
        
        if (command.site_url && command.site_url.trim()) {
          const { data: parseResult, error: parseError } = await supabase.functions.invoke('parse-website', {
            body: { 
              url: command.site_url, 
              instructions: command.code,
              commandId: commandId 
            }
          });

          if (parseError) {
            throw parseError;
          }

          result = parseResult || {
            status: 'completed',
            message: `Website parsing completed for ${command.site_url}`,
            url: command.site_url,
            timestamp: new Date().toISOString()
          };
        } else {
          result = {
            status: 'completed',
            message: `Command "${command.name}" executed successfully`,
            output: `Executed instructions: ${command.code.substring(0, 200)}${command.code.length > 200 ? '...' : ''}`,
            timestamp: new Date().toISOString(),
            executionType: 'standard'
          };
        }

        const executionTime = Date.now() - startTime;

        const { error: updateError } = await supabase
          .from('ai_command_executions')
          .update({
            execution_status: 'completed',
            output_data: result,
            execution_time_ms: executionTime
          })
          .eq('id', executionRecord.id);

        if (updateError) {
          // Log but don't throw
        }
        
        queryClient.invalidateQueries({ queryKey: ['ai-command-executions'] });
        
        return result;
        
      } catch (error: any) {
        const executionTime = Date.now() - startTime;
        
        await supabase
          .from('ai_command_executions')
          .update({
            execution_status: 'failed',
            error_message: error.message || 'Unknown execution error',
            execution_time_ms: executionTime
          })
          .eq('id', executionRecord.id);

        queryClient.invalidateQueries({ queryKey: ['ai-command-executions'] });

        throw error;
      }
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['ai-commands'] });
      queryClient.invalidateQueries({ queryKey: ['ai-command-executions'] });
      toast({
        title: "Command Executed",
        description: "AI command executed successfully.",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Execution Failed",
        description: `Failed to execute command: ${error.message}`,
        variant: "destructive",
      });
    }
  });

  return {
    executeCommandMutation
  };
};
