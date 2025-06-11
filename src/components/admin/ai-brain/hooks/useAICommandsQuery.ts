
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export const useAICommandsQuery = () => {
  return useQuery({
    queryKey: ['admin-ai-commands'],
    queryFn: async () => {
      console.log('🔍 Fetching AI commands with new clean policies...');
      
      try {
        const { data, error } = await supabase
          .from('ai_commands')
          .select('*')
          .order('created_at', { ascending: false });

        if (error) {
          console.error('❌ Error fetching AI commands:', error);
          throw error;
        }

        console.log('✅ AI commands loaded successfully:', data?.length || 0);
        return data || [];
      } catch (error) {
        console.error('❌ Failed to fetch AI commands:', error);
        throw error;
      }
    },
    retry: (failureCount, error: any) => {
      // Don't retry on permission errors
      if (error?.message?.includes('permission') || error?.message?.includes('denied')) {
        console.error('🚫 Permission denied - check admin access');
        return false;
      }
      return failureCount < 2;
    }
  });
};
