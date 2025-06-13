
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export const useEnhancedAICommands = (category?: string) => {
  const queryClient = useQueryClient();

  const { data: commands = [], isLoading } = useQuery({
    queryKey: ['ai-commands', category],
    queryFn: async () => {
      let query = supabase
        .from('ai_commands')
        .select('*')
        .eq('is_active', true)
        .order('priority', { ascending: false });

      if (category) {
        query = query.eq('category', category);
      }

      const { data, error } = await query;
      if (error) throw error;
      return data || [];
    }
  });

  const executeCommandMutation = useMutation({
    mutationFn: async ({ commandId, inputData }: { commandId: string; inputData: any }) => {
      const { data: executionData, error: executionError } = await supabase
        .rpc('execute_ai_command', {
          p_command_id: commandId,
          p_input_data: inputData
        });

      if (executionError) throw executionError;

      const command = commands.find(cmd => cmd.id === commandId);
      if (!command) throw new Error('Command not found');

      let edgeFunction = '';
      switch (command.category) {
        case 'web_scraping':
          edgeFunction = 'advanced-web-scraper';
          break;
        case 'expert_analysis':
          edgeFunction = 'advanced-coin-analyzer';
          break;
        case 'market_intelligence':
          edgeFunction = 'market-intelligence-engine';
          break;
        default:
          edgeFunction = 'advanced-coin-analyzer';
      }

      const { data: functionResult, error: functionError } = await supabase.functions.invoke(edgeFunction, {
        body: {
          commandType: command.command_type,
          inputData,
          commandId
        }
      });

      if (functionError) {
        console.warn('Edge function failed, using database execution result:', functionError);
        return executionData;
      }

      return functionResult;
    },
    onSuccess: (data, variables) => {
      toast.success('Command executed successfully');
      queryClient.invalidateQueries({ queryKey: ['ai-command-executions'] });
      queryClient.invalidateQueries({ queryKey: ['ai-performance-metrics'] });
    },
    onError: (error) => {
      console.error('Command execution error:', error);
      toast.error(`Command execution failed: ${error.message}`);
    }
  });

  const { data: executionHistory = [] } = useQuery({
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
    }
  });

  return {
    commands,
    isLoading,
    executeCommand: (commandId: string, inputData: any = {}) => 
      executeCommandMutation.mutate({ commandId, inputData }),
    isExecuting: executeCommandMutation.isPending,
    executionHistory
  };
};
