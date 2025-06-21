import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export const useDealerStores = () => {
  return useQuery({
    queryKey: ['dealer-stores'],
    queryFn: async () => {
      console.log('Fetching all visible stores...');
      
      // Get all stores that are either active OR owned by an admin.
      const { data: stores, error: storesError } = await supabase
        .from('stores')
        .select(`
          id, name, description, address, logo_url, user_id, created_at,
          profiles ( id, username, full_name, bio, avatar_url, rating, location, role )
        `)
        .or('is_active.eq.true,profiles.role.eq.admin')
        .order('created_at', { ascending: false });

      if (storesError) {
        console.error('Error fetching stores:', storesError);
        throw storesError;
      }

      if (!stores || stores.length === 0) {
        console.log('No visible stores found');
        return [];
      }

      // The query now returns profiles directly, so we can simplify the combination logic.
      // The profile data is nested inside each store object.
      // We just need to handle the case where `profiles` might be an array.
      const storesWithProfiles = stores.map(store => {
        const profile = Array.isArray(store.profiles) ? store.profiles[0] : store.profiles;
        return { ...store, profiles: profile };
      });

      console.log(`Found ${storesWithProfiles.length} visible stores.`);
      return storesWithProfiles;
    },
    staleTime: 2 * 60 * 1000, // 2 minutes
    refetchInterval: 30000, // Refresh every 30 seconds
    refetchOnWindowFocus: true, // Refresh when user returns to tab
  });
};
