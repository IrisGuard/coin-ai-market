
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export const useAllDealerCoins = () => {
  return useQuery({
    queryKey: ['dealer-coins', 'all'],
    queryFn: async () => {
      console.log('Fetching all dealer coins from Supabase...');
      
      const { data, error } = await supabase
        .from('coins')
        .select(`
          *,
          profiles!coins_user_id_fkey(
            id,
            name,
            full_name,
            username,
            reputation,
            verified_dealer,
            avatar_url
          )
        `)
        .eq('authentication_status', 'verified')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching dealer coins:', error);
        throw error;
      }

      console.log(`Fetched ${data?.length || 0} verified coins from database`);
      return data || [];
    },
    staleTime: 30000, // 30 seconds
  });
};

export const useDealerCoins = (dealerId: string) => {
  return useQuery({
    queryKey: ['dealer-coins', dealerId],
    queryFn: async () => {
      console.log(`Fetching coins for dealer: ${dealerId}`);
      
      const { data, error } = await supabase
        .from('coins')
        .select(`
          *,
          profiles!coins_user_id_fkey(
            id,
            name,
            full_name,
            username,
            reputation,
            verified_dealer,
            avatar_url
          )
        `)
        .eq('user_id', dealerId)
        .eq('authentication_status', 'verified')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching dealer coins:', error);
        throw error;
      }

      console.log(`Fetched ${data?.length || 0} coins for dealer ${dealerId}`);
      return data || [];
    },
    staleTime: 30000, // 30 seconds
  });
};
