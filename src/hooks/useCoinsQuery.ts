
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Coin } from '@/types/coin';

export const useCoins = () => {
  return useQuery({
    queryKey: ['coins'],
    queryFn: async () => {
      try {
        const { data, error } = await supabase
          .from('coins')
          .select(`
            *,
            profiles!coins_user_id_fkey (
              id,
              name,
              reputation,
              verified_dealer
            ),
            bids (
              amount,
              user_id,
              created_at,
              profiles!bids_user_id_fkey (name)
            )
          `)
          .eq('authentication_status', 'verified')
          .order('created_at', { ascending: false });

        if (error) {
          console.error('Error fetching coins:', error);
          return [];
        }
        
        // Transform the data to match the Coin interface
        const transformedData = data?.map(coin => ({
          ...coin,
          profiles: coin.profiles ? {
            id: coin.profiles.id || '',
            name: coin.profiles.name || '',
            reputation: coin.profiles.reputation || 0,
            verified_dealer: coin.profiles.verified_dealer || false
          } : {
            id: '',
            name: '',
            reputation: 0,
            verified_dealer: false
          }
        })) || [];
        
        return transformedData as Coin[];
      } catch (error) {
        console.error('Connection error:', error);
        return [];
      }
    },
  });
};

export const useCoin = (id: string) => {
  return useQuery({
    queryKey: ['coin', id],
    queryFn: async () => {
      try {
        const { data, error } = await supabase
          .from('coins')
          .select(`
            *,
            profiles!coins_user_id_fkey (
              id,
              name,
              reputation,
              verified_dealer,
              avatar_url
            ),
            bids (
              id,
              amount,
              user_id,
              created_at,
              profiles!bids_user_id_fkey (name)
            )
          `)
          .eq('id', id)
          .single();

        if (error) {
          console.error('Error fetching coin:', error);
          return null;
        }
        
        // Transform the data to match the Coin interface
        const transformedData = {
          ...data,
          profiles: data.profiles ? {
            id: data.profiles.id || '',
            name: data.profiles.name || '',
            reputation: data.profiles.reputation || 0,
            verified_dealer: data.profiles.verified_dealer || false,
            avatar_url: data.profiles.avatar_url || undefined
          } : {
            id: '',
            name: '',
            reputation: 0,
            verified_dealer: false
          }
        };
        
        return transformedData as Coin;
      } catch (error) {
        console.error('Connection error:', error);
        return null;
      }
    },
    enabled: !!id,
  });
};
