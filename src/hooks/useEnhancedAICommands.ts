
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { useEffect, useRef } from 'react';

export const useEnhancedAICommands = (category?: string) => {
  const queryClient = useQueryClient();
  const channelRef = useRef<any>(null);

  // Real-time AI commands with full data
  const { data: commands = [], isLoading } = useQuery({
    queryKey: ['ai-commands', category],
    queryFn: async () => {
      let query = supabase
        .from('ai_commands')
        .select(`
          *,
          ai_command_executions (
            id,
            execution_status,
            execution_time_ms,
            created_at,
            error_message
          )
        `)
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

  // Real-time execution tracking
  const executeCommandMutation = useMutation({
    mutationFn: async ({ commandId, inputData }: { commandId: string; inputData: any }) => {
      console.log('🚀 Executing AI command with real-time tracking:', commandId);
      
      // Create execution record first
      const { data: executionData, error: executionError } = await supabase
        .from('ai_command_executions')
        .insert({
          command_id: commandId,
          input_data: inputData,
          execution_status: 'running'
        })
        .select()
        .single();

      if (executionError) throw executionError;

      // Execute the command
      const { data: result, error: commandError } = await supabase.rpc('execute_ai_command', {
        p_command_id: commandId,
        p_input_data: inputData
      });

      if (commandError) {
        // Update execution status to failed
        await supabase
          .from('ai_command_executions')
          .update({
            execution_status: 'failed',
            error_message: commandError.message
          })
          .eq('id', executionData.id);
        
        throw commandError;
      }

      // Log performance metrics
      await supabase
        .from('ai_performance_metrics')
        .insert({
          metric_type: 'command_execution',
          metric_name: 'execution_success',
          metric_value: 1,
          metadata: {
            command_id: commandId,
            execution_id: executionData.id
          }
        });

      return result;
    },
    onSuccess: (data, variables) => {
      toast.success('AI Command executed successfully');
      // Invalidate all related queries for real-time updates
      queryClient.invalidateQueries({ queryKey: ['ai-commands'] });
      queryClient.invalidateQueries({ queryKey: ['ai-command-executions'] });
      queryClient.invalidateQueries({ queryKey: ['ai-brain-stats'] });
      queryClient.invalidateQueries({ queryKey: ['ai-performance-metrics'] });
    },
    onError: (error: any) => {
      console.error('❌ AI Command execution failed:', error);
      toast.error(`Command execution failed: ${error.message}`);
      // Still invalidate to update UI with failure status
      queryClient.invalidateQueries({ queryKey: ['ai-commands'] });
      queryClient.invalidateQueries({ queryKey: ['ai-brain-stats'] });
    }
  });

  // Real-time execution history with performance data
  const { data: executionHistory = [] } = useQuery({
    queryKey: ['ai-command-executions'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('ai_command_executions')
        .select(`
          *,
          ai_commands (
            name,
            category,
            site_url
          )
        `)
        .order('created_at', { ascending: false })
        .limit(100);

      if (error) throw error;
      return data || [];
    },
    refetchInterval: 15000 // Refresh every 15 seconds
  });

  // Set up real-time subscriptions for live updates
  useEffect(() => {
    // Cleanup existing subscription
    if (channelRef.current) {
      supabase.removeChannel(channelRef.current);
      channelRef.current = null;
    }

    console.log('🔄 Setting up real-time AI commands subscription...');
    
    const channel = supabase
      .channel(`ai-commands-realtime-${Date.now()}`)
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'ai_commands'
      }, (payload) => {
        console.log('🔄 Real-time AI command change:', payload);
        queryClient.invalidateQueries({ queryKey: ['ai-commands'] });
      })
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'ai_command_executions'
      }, (payload) => {
        console.log('🔄 Real-time execution change:', payload);
        queryClient.invalidateQueries({ queryKey: ['ai-command-executions'] });
        queryClient.invalidateQueries({ queryKey: ['ai-brain-stats'] });
      })
      .subscribe((status) => {
        if (status === 'SUBSCRIBED') {
          console.log('✅ AI commands real-time subscription established');
        } else if (status === 'CHANNEL_ERROR') {
          console.error('❌ AI commands subscription error');
        }
      });

    channelRef.current = channel;

    return () => {
      console.log('🛑 Cleaning up AI commands real-time subscription');
      if (channelRef.current) {
        supabase.removeChannel(channelRef.current);
        channelRef.current = null;
      }
    };
  }, [queryClient]);

  // Performance analytics
  const { data: performanceMetrics } = useQuery({
    queryKey: ['ai-performance-metrics'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('ai_performance_metrics')
        .select('*')
        .eq('metric_type', 'command_execution')
        .gte('recorded_at', new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString())
        .order('recorded_at', { ascending: false });

      if (error) throw error;
      return data || [];
    },
    refetchInterval: 30000
  });

  return {
    commands,
    isLoading,
    executeCommand: (commandId: string, inputData: any = {}) => 
      executeCommandMutation.mutate({ commandId, inputData }),
    isExecuting: executeCommandMutation.isPending,
    executionHistory,
    performanceMetrics,
    // Enhanced stats from real data
    stats: {
      totalCommands: commands.length,
      activeExecutions: executionHistory.filter(e => e.execution_status === 'running').length,
      successRate: executionHistory.length > 0 
        ? (executionHistory.filter(e => e.execution_status === 'completed').length / executionHistory.length) * 100
        : 100,
      averageExecutionTime: executionHistory.length > 0
        ? executionHistory.reduce((sum, e) => sum + (e.execution_time_ms || 0), 0) / executionHistory.length
        : 0
    }
  };
};
