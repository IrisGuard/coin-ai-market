import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export const useDealerStores = () => {
  return useQuery({
    queryKey: ['dealer-stores'],
    queryFn: async () => {
      console.log('Fetching all visible stores...');
      
      // First, get all admin users
      const { data: adminUsers, error: adminError } = await supabase
        .from('profiles')
        .select('id')
        .eq('role', 'admin');

      if (adminError) {
        console.error('Error fetching admin users:', adminError);
      }

      const adminUserIds = adminUsers?.map(admin => admin.id) || [];
      console.log('Admin user IDs:', adminUserIds);

      // Get all stores that are either:
      // 1. Active stores (is_active = true)
      // 2. OR stores owned by admin users (regardless of is_active status)
      const { data: stores, error: storesError } = await supabase
        .from('stores')
        .select(`
          id, name, description, address, logo_url, user_id, created_at, is_active, verified,
          profiles ( id, username, full_name, bio, avatar_url, rating, location, role )
        `)
        .or(`is_active.eq.true,user_id.in.(${adminUserIds.length > 0 ? adminUserIds.join(',') : 'null'})`)
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
        const isAdminStore = adminUserIds.includes(store.user_id);
        
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
