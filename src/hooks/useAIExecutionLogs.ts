
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export const useAIExecutionLogs = (commandId?: string) => {
  return useQuery({
    queryKey: ['ai-execution-logs', commandId],
    queryFn: async () => {
      console.log('🔍 Fetching AI execution logs...', commandId ? `Command: ${commandId}` : 'All commands');
      
      let query = supabase
        .from('ai_command_execution_logs')
        .select(`
          *,
          ai_commands(
            name,
            category,
            command_type
          )
        `);

      if (commandId) {
        query = query.eq('command_id', commandId);
      }

      const { data, error } = await query
        .order('created_at', { ascending: false })
        .limit(100);

      if (error) {
        console.error('❌ Error fetching AI execution logs:', error);
        throw error;
      }

      console.log('✅ AI execution logs loaded:', data?.length || 0);
      return data || [];
    },
    retry: 2
  });
};

export const useAIPerformanceAnalytics = () => {
  return useQuery({
    queryKey: ['ai-performance-analytics'],
    queryFn: async () => {
      console.log('📊 Fetching AI performance analytics...');
      
      const { data, error } = await supabase
        .from('ai_performance_analytics')
        .select(`
          *,
          ai_commands(
            name,
            category
          )
        `)
        .order('recorded_at', { ascending: false })
        .limit(200);

      if (error) {
        console.error('❌ Error fetching AI performance analytics:', error);
        throw error;
      }

      console.log('✅ AI performance analytics loaded:', data?.length || 0);
      return data || [];
    },
    retry: 2
  });
};
