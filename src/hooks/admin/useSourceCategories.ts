
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export const useSourceCategories = () => {
  return useQuery({
    queryKey: ['source-categories'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('source_categories')
        .select('*')
        .order('name', { ascending: true });
      
      if (error) throw error;
      return data || [];
    },
  });
};
