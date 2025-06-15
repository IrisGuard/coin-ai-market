
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export const useTokenActivity = () => {
  return useQuery({
    queryKey: ['token-activity'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('token_activity')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(50);
      
      if (error) throw error;
      return data;
    },
    refetchInterval: 5000, // Real-time activity feed
  });
};
