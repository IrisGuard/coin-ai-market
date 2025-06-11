
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { AICommand } from '@/components/admin/ai-brain/types';

export const useAdminAICommands = () => {
  return useQuery({
    queryKey: ['admin-ai-commands-for-dealer'],
    queryFn: async () => {
      console.log('🔍 Fetching AI commands for dealer use...');
      
      // Get current user
      const { data: { user }, error: userError } = await supabase.auth.getUser();
      
      if (userError || !user) {
        console.error('❌ User not authenticated:', userError);
        throw new Error('Authentication required');
      }

      console.log('✅ User authenticated:', user.id);
      
      // Fetch active AI commands that can be used by dealers
      const { data, error } = await supabase
        .from('ai_commands')
        .select(`
          id, 
          name, 
          description, 
          code,
          category, 
          command_type, 
          priority, 
          execution_timeout, 
          is_active, 
          created_at, 
          updated_at, 
          site_url
        `)
        .eq('is_active', true)
        .in('category', ['coin_identification', 'market_analysis', 'price_estimation', 'authentication'])
        .order('priority', { ascending: false });
      
      if (error) {
        console.error('❌ Error fetching AI commands:', error);
        throw error;
      }
      
      console.log('✅ AI Commands fetched for dealer:', data?.length || 0, 'commands');
      return (data as AICommand[]) || [];
    },
    retry: (failureCount, error: any) => {
      if (error?.message?.includes('Authentication')) {
        return false;
      }
      return failureCount < 2;
    },
    retryDelay: 1000,
  });
};
