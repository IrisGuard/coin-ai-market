
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export const useDealerStoreInfo = (userId: string) => {
  return useQuery({
    queryKey: ['dealer-store', userId],
    queryFn: async () => {
      if (!userId) return null;
      
      const { data, error } = await supabase
        .from('stores')
        .select('*')
        .eq('user_id', userId)
        .single();
      
      if (error) {
        console.log('No store found for user:', userId);
        return null;
      }
      
      return data;
    },
    enabled: !!userId
  });
};
