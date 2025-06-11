
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export const useAICommandCategories = () => {
  return useQuery({
    queryKey: ['ai-command-categories'],
    queryFn: async () => {
      console.log('🔍 Fetching AI command categories...');
      
      const { data, error } = await supabase
        .from('ai_command_categories')
        .select('*')
        .eq('is_active', true)
        .order('display_order', { ascending: true });

      if (error) {
        console.error('❌ Error fetching AI command categories:', error);
        throw error;
      }

      console.log('✅ AI command categories loaded:', data?.length || 0);
      return data || [];
    },
    retry: 2
  });
};
