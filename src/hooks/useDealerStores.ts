
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

// This hook is now for ADMIN use only - returns all stores for admin panel
export const useDealerStores = () => {
  return useQuery({
    queryKey: ['dealer-stores-admin'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('stores')
        .select(`
          *,
          profiles!stores_user_id_fkey(name, email, verified_dealer)
        `)
        .order('created_at', { ascending: false });

      if (error) {
        throw error;
      }

      // Transform to match the expected interface
      const transformedData = data?.map(store => ({
        id: store.id,
        username: store.profiles?.email?.split('@')[0] || 'unknown',
        full_name: store.name,
        bio: store.description,
        avatar_url: store.logo_url || '/placeholder.svg',
        rating: 4.5, // Default rating - could be calculated from store_ratings table
        location: 'Location not set',
        verified_dealer: store.profiles?.verified_dealer || false
      })) || [];

      return transformedData;
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};
