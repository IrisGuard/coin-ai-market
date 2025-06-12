
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export const useDealerStores = () => {
  return useQuery({
    queryKey: ['dealer-stores'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('stores')
        .select(`
          *,
          profiles!user_id (
            id,
            full_name,
            email,
            avatar_url,
            verified_dealer,
            rating
          )
        `)
        .order('created_at', { ascending: false });
      
      if (error) {
        console.error('❌ Error fetching dealer stores:', error);
        throw error;
      }
      return data || [];
    },
  });
};
