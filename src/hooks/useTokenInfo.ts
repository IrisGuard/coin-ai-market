
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
    refetchInterval: 30000, // Refresh every 30 seconds for real-time data
  });
};
