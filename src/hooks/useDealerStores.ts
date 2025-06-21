import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export const useDealerStores = () => {
  return useQuery({
    queryKey: ['dealer-stores'],
    queryFn: async () => {
      console.log('🔍 [useDealerStores] Starting fetch...');
      
      // First get all admin user IDs
      const { data: adminProfiles, error: adminError } = await supabase
        .from('profiles')
        .select('id')
        .eq('role', 'admin');

      if (adminError) {
        console.error('❌ [useDealerStores] Error fetching admin profiles:', adminError);
        return [];
      }

      const adminUserIds = adminProfiles?.map(p => p.id) || [];
      console.log('👑 [useDealerStores] Admin user IDs found:', adminUserIds);

      // Get all stores
      const { data: allStores, error: storesError } = await supabase
        .from('stores')
        .select('*')
        .order('created_at', { ascending: false });

      if (storesError) {
        console.error('❌ [useDealerStores] Error fetching stores:', storesError);
        throw storesError;
      }

      if (!allStores || allStores.length === 0) {
        console.log('⚠️ [useDealerStores] No stores found in database');
        return [];
      }

      console.log('🏪 [useDealerStores] All stores found:', allStores.map(s => ({ 
        name: s.name, 
        user_id: s.user_id, 
        is_active: s.is_active, 
        verified: s.verified 
      })));

      // Filter for visible stores
      const visibleStores = allStores.filter(store => {
        const isAdminStore = adminUserIds.includes(store.user_id);
        
        if (isAdminStore) {
          // Admin stores only need to be active
          console.log(`✅ [useDealerStores] Admin store ${store.name}: active=${store.is_active}`);
          return store.is_active === true;
        } else {
          // Regular stores need active AND verified
          console.log(`🔍 [useDealerStores] Regular store ${store.name}: active=${store.is_active}, verified=${store.verified}`);
          return store.is_active === true && store.verified === true;
        }
      });

      console.log(`📊 [useDealerStores] Visible stores after filtering: ${visibleStores.length}`);
      visibleStores.forEach(s => console.log(`  - ${s.name}`));

      if (visibleStores.length === 0) {
        console.log('⚠️ [useDealerStores] No visible stores found after filtering');
        return [];
      }

      // Get profiles for visible stores
      const userIds = visibleStores.map(store => store.user_id);
      console.log('👤 [useDealerStores] Fetching profiles for user IDs:', userIds);
      
      const { data: profiles, error: profilesError } = await supabase
        .from('profiles')
        .select('*')
        .in('id', userIds);

      if (profilesError) {
        console.error('❌ [useDealerStores] Error fetching profiles:', profilesError);
      }

      console.log('👤 [useDealerStores] Profiles found:', profiles?.map(p => ({ id: p.id, username: p.username, role: p.role })));

      // Combine stores with profiles
      const storesWithProfiles = visibleStores.map(store => {
        const profile = profiles?.find(p => p.id === store.user_id);
        const isAdminStore = adminUserIds.includes(store.user_id);
        
        console.log(`🔗 [useDealerStores] Combining store ${store.name}:`, {
          isAdminStore,
          hasProfile: !!profile,
          profileUsername: profile?.username || 'No profile'
        });
        
        return { 
          ...store, 
          profiles: profile,
          isAdminStore
        };
      });

      console.log(`✅ [useDealerStores] Final result: ${storesWithProfiles.length} stores with profiles`);
      console.log('📋 [useDealerStores] Final stores:', storesWithProfiles.map(s => ({ 
        name: s.name, 
        isAdmin: s.isAdminStore,
        hasProfile: !!s.profiles 
      })));
      
      return storesWithProfiles;
    },
    staleTime: 2 * 60 * 1000,
    refetchInterval: 30000,
    refetchOnWindowFocus: true,
  });
};
