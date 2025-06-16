
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
          profiles!stores_user_id_fkey (
            id,
            username,
            full_name,
            bio,
            avatar_url,
            rating,
            location,
            verified_dealer
          )
        `)
        .eq('is_active', true)
        .eq('verified', true)
        .eq('profiles.verified_dealer', true)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching dealer stores:', error);
        throw error;
      }

      return data || [];
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
    refetchInterval: 30000, // Refresh every 30 seconds
  });
};
