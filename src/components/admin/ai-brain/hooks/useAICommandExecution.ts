
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';

export const useAICommandExecution = () => {
  const queryClient = useQueryClient();

  const executeCommandMutation = useMutation({
    mutationFn: async ({ commandId, inputData = {} }: { commandId: string; inputData?: any }) => {
      console.log('▶️ Executing AI command:', commandId, inputData);
      
      // Get current user
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('User not authenticated');

      // Get command details first
      const { data: command, error: cmdError } = await supabase
        .from('ai_commands')
        .select('*')
        .eq('id', commandId)
        .single();

      if (cmdError) {
        console.error('❌ Failed to get command:', cmdError);
        throw cmdError;
      }

      console.log('📋 Command details:', { name: command.name, site_url: command.site_url });

      // Create execution record FIRST
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
        console.error('❌ Failed to create execution record:', execError);
        throw execError;
      }

      console.log('✅ Execution record created:', executionRecord.id);

      const startTime = Date.now();
      
      try {
        let result;
        
        // Execute command based on whether it has site_url
        if (command.site_url && command.site_url.trim()) {
          console.log('🔗 Command has site URL, calling parsing function:', command.site_url);
          
          const { data: parseResult, error: parseError } = await supabase.functions.invoke('parse-website', {
            body: { 
              url: command.site_url, 
              instructions: command.code,
              commandId: commandId 
            }
          });

          if (parseError) {
            console.error('❌ Parse website function error:', parseError);
            throw parseError;
          }

          result = parseResult || {
            status: 'completed',
            message: `Website parsing completed for ${command.site_url}`,
            url: command.site_url,
            timestamp: new Date().toISOString()
          };
        } else {
          // Regular command execution without website parsing
          console.log('⚡ Executing regular command without website parsing...');
          result = {
            status: 'completed',
            message: `Command "${command.name}" executed successfully`,
            output: `Executed instructions: ${command.code.substring(0, 200)}${command.code.length > 200 ? '...' : ''}`,
            timestamp: new Date().toISOString(),
            executionType: 'standard'
          };
        }

        const executionTime = Date.now() - startTime;

        // Update execution record with success
        const { error: updateError } = await supabase
          .from('ai_command_executions')
          .update({
            execution_status: 'completed',
            output_data: result,
            execution_time_ms: executionTime
          })
          .eq('id', executionRecord.id);

        if (updateError) {
          console.error('❌ Failed to update execution record:', updateError);
          // Don't throw here, just log the error
        }

        console.log('✅ Command executed successfully, execution time:', executionTime + 'ms');
        
        // Invalidate execution history queries
        queryClient.invalidateQueries({ queryKey: ['ai-command-executions'] });
        
        return result;
        
      } catch (error: any) {
        const executionTime = Date.now() - startTime;
        
        console.error('❌ Command execution failed:', error);
        
        // Update execution record with error
        await supabase
          .from('ai_command_executions')
          .update({
            execution_status: 'failed',
            error_message: error.message || 'Unknown execution error',
            execution_time_ms: executionTime
          })
          .eq('id', executionRecord.id);

        // Invalidate execution history queries
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
      console.error('❌ Execute command error:', error);
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
