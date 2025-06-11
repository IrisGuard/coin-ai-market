
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';

export const useEnhancedAICommands = (category?: string) => {
  const queryClient = useQueryClient();

  const commandsQuery = useQuery({
    queryKey: ['enhanced-ai-commands', category],
    queryFn: async () => {
      console.log('🔍 Fetching enhanced AI commands...', category ? `Category: ${category}` : 'All categories');
      
      let query = supabase
        .from('ai_commands')
        .select(`
          *,
          ai_command_categories!inner(
            name,
            description,
            icon,
            color
          )
        `)
        .eq('is_active', true);

      if (category) {
        query = query.eq('category', category);
      }

      const { data, error } = await query.order('priority', { ascending: false });

      if (error) {
        console.error('❌ Error fetching enhanced AI commands:', error);
        throw error;
      }

      console.log('✅ Enhanced AI commands loaded:', data?.length || 0);
      return data || [];
    },
    retry: 2
  });

  const executeCommandMutation = useMutation({
    mutationFn: async ({ commandId, inputData = {} }: { commandId: string; inputData?: any }) => {
      console.log('🚀 Executing enhanced AI command:', commandId);
      
      const startTime = Date.now();
      
      // Get command details
      const { data: command, error: cmdError } = await supabase
        .from('ai_commands')
        .select('*')
        .eq('id', commandId)
        .single();

      if (cmdError) throw cmdError;

      // Create execution log
      const { data: executionLog, error: logError } = await supabase
        .from('ai_command_execution_logs')
        .insert([{
          command_id: commandId,
          success: false,
          execution_time_ms: 0
        }])
        .select()
        .single();

      if (logError) throw logError;

      try {
        // Execute the command based on type
        let result;
        
        if (command.site_url && command.site_url.trim()) {
          // Web scraping command
          const { data: parseResult, error: parseError } = await supabase.functions.invoke('parse-website', {
            body: { 
              url: command.site_url, 
              instructions: command.code,
              commandId: commandId,
              inputData
            }
          });

          if (parseError) throw parseError;
          result = parseResult;
        } else {
          // Regular AI command execution
          const { data: aiResult, error: aiError } = await supabase.functions.invoke('anthropic-coin-recognition', {
            body: {
              instructions: command.code,
              inputData,
              commandId,
              commandType: command.command_type
            }
          });

          if (aiError) throw aiError;
          result = aiResult;
        }

        const executionTime = Date.now() - startTime;

        // Update execution log with success
        await supabase
          .from('ai_command_execution_logs')
          .update({
            success: true,
            execution_time_ms: executionTime,
            performance_score: result?.confidence || 0.8
          })
          .eq('id', executionLog.id);

        // Record performance analytics
        await supabase
          .from('ai_performance_analytics')
          .insert([{
            metric_type: 'command_execution',
            metric_name: `${command.name}_performance`,
            metric_value: executionTime,
            command_id: commandId,
            execution_context: {
              success: true,
              input_size: JSON.stringify(inputData).length,
              output_size: JSON.stringify(result).length
            }
          }]);

        console.log('✅ Enhanced AI command executed successfully');
        return result;

      } catch (error: any) {
        const executionTime = Date.now() - startTime;
        
        // Update execution log with failure
        await supabase
          .from('ai_command_execution_logs')
          .update({
            success: false,
            execution_time_ms: executionTime,
            error_message: error.message
          })
          .eq('id', executionLog.id);

        throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['ai-command-execution-logs'] });
      queryClient.invalidateQueries({ queryKey: ['ai-performance-analytics'] });
      toast({
        title: "Command Executed",
        description: "AI command executed successfully with enhanced tracking.",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Execution Failed",
        description: `Enhanced AI command failed: ${error.message}`,
        variant: "destructive",
      });
    }
  });

  return {
    commands: commandsQuery.data || [],
    isLoading: commandsQuery.isLoading,
    error: commandsQuery.error,
    executeCommand: executeCommandMutation.mutateAsync,
    isExecuting: executeCommandMutation.isPending
  };
};
