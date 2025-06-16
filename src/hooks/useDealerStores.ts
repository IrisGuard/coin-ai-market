
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export const useDealerStores = () => {
  return useQuery({
    queryKey: ['dealer-stores'],
    queryFn: async () => {
      console.log('Fetching dealer stores...');
      
      // First get all active and verified stores
      const { data: stores, error: storesError } = await supabase
        .from('stores')
        .select('*')
        .eq('is_active', true)
        .eq('verified', true)
        .order('created_at', { ascending: false });

      if (storesError) {
        console.error('Error fetching stores:', storesError);
        throw storesError;
      }

      if (!stores || stores.length === 0) {
        console.log('No verified stores found');
        return [];
      }

      // Get user IDs from stores
      const userIds = stores.map(store => store.user_id);

      // Fetch profiles for these users
      const { data: profiles, error: profilesError } = await supabase
        .from('profiles')
        .select('id, username, full_name, bio, avatar_url, rating, location, verified_dealer')
        .in('id', userIds)
        .eq('verified_dealer', true);

      if (profilesError) {
        console.error('Error fetching profiles:', profilesError);
        throw profilesError;
      }

      // Combine stores with their profiles
      const storesWithProfiles = stores
        .map(store => {
          const profile = profiles?.find(p => p.id === store.user_id);
          if (profile) {
            return {
              ...store,
              profiles: profile // Single profile object, not array
            };
          }
          return null;
        })
        .filter(Boolean);

      console.log(`Found ${storesWithProfiles.length} verified dealer stores`);
      return storesWithProfiles;
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
    refetchInterval: 30000, // Refresh every 30 seconds
  });
};
