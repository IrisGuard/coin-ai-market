
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export const useAICommandCategories = () => {
  return useQuery({
    queryKey: ['ai-command-categories'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('ai_command_categories')
        .select('*')
        .eq('is_active', true)
        .order('display_order', { ascending: true });

      if (error) throw error;
      return data || [];
    }
  });
};
