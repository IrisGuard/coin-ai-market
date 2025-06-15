
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export const useTokenLocks = () => {
  return useQuery({
    queryKey: ['token-locks'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('token_locks')
        .select(`
          *,
          lock_options (
            duration_months,
            benefit_percentage
          )
        `)
        .eq('user_id', (await supabase.auth.getUser()).data.user?.id)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data;
    },
    enabled: !!(await supabase.auth.getUser()).data.user,
    refetchInterval: 30000,
  });
};
