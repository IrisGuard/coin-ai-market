
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@integrations/supabase/client';

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

      // Filter out any stores without proper name or with null description AND null address
      const validStores = stores.filter(store => 
        store.name && 
        store.name.trim() !== '' &&
        !(store.description === null && store.address === null)
      );

      // Get user IDs from valid stores
      const userIds = validStores.map(store => store.user_id);

      // Check which users are admins
      const { data: adminRoles, error: adminError } = await supabase
        .from('user_roles')
        .select('user_id')
        .in('user_id', userIds)
        .eq('role', 'admin');

      if (adminError) {
        console.error('Error fetching admin roles:', adminError);
      }

      const adminUserIds = adminRoles?.map(role => role.user_id) || [];

      // Fetch profiles for these users
      const { data: profiles, error: profilesError } = await supabase
        .from('profiles')
        .select('id, username, full_name, bio, avatar_url, rating, location, verified_dealer')
        .in('id', userIds);

      if (profilesError) {
        console.error('Error fetching profiles:', profilesError);
        throw profilesError;
      }

      // Combine stores with their profiles
      const storesWithProfiles = validStores
        .map(store => {
          const profile = profiles?.find(p => p.id === store.user_id);
          const isAdminStore = adminUserIds.includes(store.user_id);
          
          if (profile || isAdminStore) {
            return {
              ...store,
              profiles: profile || {
                id: store.user_id,
                username: 'Admin Store',
                full_name: store.name,
                bio: store.description,
                avatar_url: store.logo_url,
                rating: 5,
                location: null,
                verified_dealer: isAdminStore // Admin stores are considered verified
              }
            };
          }
          return null;
        })
        .filter(Boolean);

      console.log(`Found ${storesWithProfiles.length} verified dealer stores (cleaned)`);
      return storesWithProfiles;
    },
    staleTime: 2 * 60 * 1000, // 2 minutes (reduced for better refresh)
    refetchInterval: 30000, // Refresh every 30 seconds
    refetchOnWindowFocus: true, // Refresh when user returns to tab
  });
};
