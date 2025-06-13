
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export const useAICommands = () => {
  return useQuery({
    queryKey: ['ai-commands'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('ai_commands')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) {
        console.error('❌ Error fetching AI commands:', error);
        throw error;
      }
      
      console.log('✅ AI commands loaded:', data?.length);
      return data || [];
    }
  });
};
