
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export const useAdminCoins = () => {
  return useQuery({
    queryKey: ['admin-coins'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('coins')
        .select(`
          *,
          profiles!coins_user_id_fkey(name, email)
        `)
        .order('created_at', { ascending: false })
        .limit(100);

      if (error) {
        throw error;
      }

      return data || [];
    },
    staleTime: 30000,
  });
};
