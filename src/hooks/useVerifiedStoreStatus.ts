
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export const useVerifiedStoreStatus = (storeId?: string) => {
  return useQuery({
    queryKey: ['store-verification', storeId],
    queryFn: async () => {
      if (!storeId) return false;
      
      const { data, error } = await supabase
        .from('stores')
        .select('verified')
        .eq('id', storeId)
        .single();
      
      if (error) {
        console.error('Error checking store verification:', error);
        return false;
      }
      
      return data?.verified || false;
    },
    enabled: !!storeId,
    staleTime: 5 * 60 * 1000, // Cache for 5 minutes
  });
};
