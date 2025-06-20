
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';

// Enhanced Dealer Stores Hook for Admin - with proper type handling
export const useAdminDealerStores = () => {
  return useQuery({
    queryKey: ['admin-dealer-stores'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('stores')
        .select(`
          *,
          profiles!stores_user_id_fkey (
            id,
            full_name,
            email,
            avatar_url,
            verified_dealer,
            bio
          )
        `)
        .eq('is_active', true)
        .order('created_at', { ascending: false });
      
      if (error) {
        console.error('❌ Error fetching admin dealer stores:', error);
        throw error;
      }
      
      console.log('✅ Admin stores loaded:', data?.length);
      return data || [];
    },
  });
};

// Store Statistics Hook
export const useStoreStatistics = () => {
  return useQuery({
    queryKey: ['admin-store-statistics'],
    queryFn: async () => {
      const [storesCount, verifiedStoresCount, activeStoresCount, totalListingsCount] = await Promise.all([
        supabase.from('stores').select('id', { count: 'exact', head: true }),
        supabase.from('stores').select('id', { count: 'exact', head: true }).eq('verified', true),
        supabase.from('stores').select('id', { count: 'exact', head: true }).eq('is_active', true),
        supabase.from('coins').select('id', { count: 'exact', head: true }).not('store_id', 'is', null),
      ]);

      return {
        totalStores: storesCount.count || 0,
        verifiedStores: verifiedStoresCount.count || 0,
        activeStores: activeStoresCount.count || 0,
        totalListings: totalListingsCount.count || 0,
      };
    },
  });
};

// Update Store Status Mutation
export const useUpdateStoreStatus = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ storeId, updates }: { storeId: string; updates: any }) => {
      const { error } = await supabase
        .from('stores')
        .update(updates)
        .eq('id', storeId);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-dealer-stores'] });
      queryClient.invalidateQueries({ queryKey: ['admin-store-statistics'] });
      toast({
        title: "Success",
        description: "Store status updated successfully.",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    },
  });
};
