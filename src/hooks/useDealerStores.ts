import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export const useDealerStores = () => {
  return useQuery({
    queryKey: ['dealer-stores'],
    queryFn: async () => {
      console.log('Fetching all visible stores...');
      
      // First get all admin user IDs
      const { data: adminProfiles, error: adminError } = await supabase
        .from('profiles')
        .select('id')
        .eq('role', 'admin');

      if (adminError) {
        console.error('Error fetching admin profiles:', adminError);
      }

      const adminUserIds = adminProfiles?.map(p => p.id) || [];
      console.log('Admin user IDs found:', adminUserIds);

      // Get all stores
      const { data: allStores, error: storesError } = await supabase
        .from('stores')
        .select('*')
        .order('created_at', { ascending: false });

      if (storesError) {
        console.error('Error fetching stores:', storesError);
        throw storesError;
      }

      if (!allStores || allStores.length === 0) {
        console.log('No stores found in database');
        return [];
      }

      console.log('All stores found:', allStores.map(s => ({ name: s.name, user_id: s.user_id, is_active: s.is_active, verified: s.verified })));

      // Filter for visible stores
      const visibleStores = allStores.filter(store => {
        const isAdminStore = adminUserIds.includes(store.user_id);
        
        if (isAdminStore) {
          // Admin stores only need to be active
          console.log(`Admin store ${store.name}: active=${store.is_active}`);
          return store.is_active === true;
        } else {
          // Regular stores need active AND verified
          console.log(`Regular store ${store.name}: active=${store.is_active}, verified=${store.verified}`);
          return store.is_active === true && store.verified === true;
        }
      });

      // Get profiles for visible stores
      const userIds = visibleStores.map(store => store.user_id);
      const { data: profiles, error: profilesError } = await supabase
        .from('profiles')
        .select('*')
        .in('id', userIds);

      if (profilesError) {
        console.error('Error fetching profiles:', profilesError);
      }

      // Combine stores with profiles
      const storesWithProfiles = visibleStores.map(store => {
        const profile = profiles?.find(p => p.id === store.user_id);
        const isAdminStore = adminUserIds.includes(store.user_id);
        
        console.log(`Final store: ${store.name}, Admin: ${isAdminStore}, Profile: ${profile?.username || 'No profile'}`);
        
        return { 
          ...store, 
          profiles: profile,
          isAdminStore
        };
      });

      console.log(`Final result: ${storesWithProfiles.length} visible stores (${storesWithProfiles.filter(s => s.isAdminStore).length} admin stores)`);
      return storesWithProfiles;
    },
    staleTime: 2 * 60 * 1000,
    refetchInterval: 30000,
    refetchOnWindowFocus: true,
  });
};
