
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export const useTokenInfo = () => {
  return useQuery({
    queryKey: ['token-info'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('token_info')
        .select('*')
        .single();
      
      if (error) throw error;
      return data;
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};
