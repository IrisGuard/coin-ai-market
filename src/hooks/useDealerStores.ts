import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export const useDealerStores = () => {
  return useQuery({
    queryKey: ['dealer-stores'],
    queryFn: async () => {
      console.log('Fetching all visible stores...');
      
      // Get all stores that should be visible in marketplace
      const { data: stores, error: storesError } = await supabase
        .from('stores')
        .select(`
          id, name, description, address, logo_url, user_id, created_at, is_active, verified,
          profiles ( id, username, full_name, bio, avatar_url, rating, location, role )
        `)
        .eq('is_active', true)
        .order('created_at', { ascending: false });

      if (storesError) {
        console.error('Error fetching stores:', storesError);
        throw storesError;
      }

      if (!stores || stores.length === 0) {
        console.log('No visible stores found');
        return [];
      }

      // Process the results
      const storesWithProfiles = stores.map(store => {
        const profile = Array.isArray(store.profiles) ? store.profiles[0] : store.profiles;
        const isAdminStore = profile?.role === 'admin';
        
        console.log(`Store: ${store.name}, Admin: ${isAdminStore}, Active: ${store.is_active}, Verified: ${store.verified}`);
        
        return { 
          ...store, 
          profiles: profile,
          isAdminStore
        };
      });

      console.log(`Found ${storesWithProfiles.length} visible stores (${storesWithProfiles.filter(s => s.isAdminStore).length} admin stores)`);
      return storesWithProfiles;
    },
    staleTime: 2 * 60 * 1000, // 2 minutes
    refetchInterval: 30000, // Refresh every 30 seconds
    refetchOnWindowFocus: true, // Refresh when user returns to tab
  });
};
