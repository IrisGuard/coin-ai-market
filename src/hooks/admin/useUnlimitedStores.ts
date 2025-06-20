
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export const useUnlimitedStores = () => {
  const queryClient = useQueryClient();

  const { data: stores = [], isLoading } = useQuery({
    queryKey: ['unlimited-stores'],
    queryFn: async () => {
      console.log('🏪 Loading unlimited stores with real data...');
      
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
            username
          ),
          coins (
            id,
            name,
            price,
            sold,
            created_at
          )
        `)
        .order('created_at', { ascending: false });
      
      if (error) {
        console.error('❌ Error loading stores:', error);
        throw error;
      }
      
      console.log(`✅ Loaded ${data?.length || 0} real stores with coins`);
      return data || [];
    },
    refetchInterval: 15000, // Real-time updates
  });

  const createStore = useMutation({
    mutationFn: async (storeData: {
      name: string;
      description?: string;
      email?: string;
      phone?: string;
      website?: string;
    }) => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('User not authenticated');

      const { data, error } = await supabase
        .from('stores')
        .insert({
          ...storeData,
          user_id: user.id,
          is_active: true,
          verified: true, // Admin creates verified stores
        })
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: (newStore) => {
      queryClient.invalidateQueries({ queryKey: ['unlimited-stores'] });
      toast.success(`🏪 Store "${newStore.name}" created successfully!`);
    },
    onError: (error: Error) => {
      toast.error(`❌ Store creation failed: ${error.message}`);
    },
  });

  return {
    stores,
    isLoading,
    createStore,
    totalStores: stores.length,
    activeStores: stores.filter(s => s.is_active).length,
    verifiedStores: stores.filter(s => s.verified).length
  };
};
