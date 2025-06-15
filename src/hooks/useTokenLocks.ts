
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export const useTokenLocks = () => {
  return useQuery({
    queryKey: ['token-locks'],
    queryFn: async () => {
      const { data: user } = await supabase.auth.getUser();
      if (!user.user) return [];

      const { data, error } = await supabase
        .from('token_locks')
        .select(`
          *,
          lock_options (
            duration_months,
            benefit_percentage
          )
        `)
        .eq('user_id', user.user.id)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data || [];
    },
    refetchInterval: 30000,
  });
};
