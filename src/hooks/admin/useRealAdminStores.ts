
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';

export const useRealAdminStores = () => {
  return useQuery({
    queryKey: ['real-admin-stores'],
    queryFn: async () => {
      console.log('🔥 Loading REAL store data from Supabase...');
      
      const { data: stores, error } = await supabase
        .from('stores')
        .select(`
          *,
          profiles!stores_user_id_fkey (
            id,
            full_name,
            email,
            avatar_url,
            verified_dealer,
            username,
            bio,
            location,
            rating
          )
        `)
        .order('created_at', { ascending: false });
      
      if (error) {
        console.error('❌ Error loading stores:', error);
        throw error;
      }
      
      console.log(`✅ Loaded ${stores?.length || 0} REAL stores:`, stores);
      return stores || [];
    },
    refetchInterval: 30000, // Refresh every 30 seconds for real-time updates
  });
};

export const useCreateStore = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (storeData: {
      name: string;
      description?: string;
      email?: string;
      phone?: string;
      website?: string;
    }) => {
      const { data, error } = await supabase
        .from('stores')
        .insert({
          ...storeData,
          is_active: true,
          verified: true, // Admin creates verified stores by default
        })
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['real-admin-stores'] });
      toast({
        title: "🏪 Store Created Successfully!",
        description: "New store is ready for coin uploads",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "❌ Store Creation Failed",
        description: error.message,
        variant: "destructive",
      });
    },
  });
};

export const useUpdateStoreVerification = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ storeId, verified }: { storeId: string; verified: boolean }) => {
      const { error } = await supabase
        .from('stores')
        .update({ verified })
        .eq('id', storeId);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['real-admin-stores'] });
      toast({
        title: "✅ Store Status Updated",
        description: "Store verification status updated successfully",
      });
    },
  });
};
