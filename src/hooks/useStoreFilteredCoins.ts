
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useAdminStore } from '@/contexts/AdminStoreContext';

export const useStoreFilteredCoins = () => {
  const { user } = useAuth();
  const { selectedStoreId, isAdminUser } = useAdminStore();

  return useQuery({
    queryKey: ['store-filtered-coins', user?.id, selectedStoreId, isAdminUser],
    queryFn: async () => {
      if (!user?.id) return [];

      let query = supabase
        .from('coins')
        .select('*')
        .eq('user_id', user.id);

      // For admin users, filter by selected store if one is selected
      if (isAdminUser && selectedStoreId) {
        query = query.eq('store_id', selectedStoreId);
      }

      const { data, error } = await query.order('created_at', { ascending: false });
      
      if (error) {
        console.error('Error fetching store-filtered coins:', error);
        throw error;
      }

      return data || [];
    },
    enabled: !!user?.id,
  });
};
