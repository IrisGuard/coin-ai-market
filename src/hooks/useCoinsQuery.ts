
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
            profiles:user_id (
              name,
              reputation,
              verified_dealer
            ),
            bids (
              amount,
              user_id,
              created_at,
              profiles:user_id (name)
            )
          `)
          .eq('authentication_status', 'verified')
          .order('created_at', { ascending: false });

        if (error) {
          console.error('Error fetching coins:', error);
          return [];
        }
        
        return data as Coin[] || [];
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
            profiles:user_id (
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
              profiles:user_id (name)
            )
          `)
          .eq('id', id)
          .single();

        if (error) {
          console.error('Error fetching coin:', error);
          return null;
        }
        
        return data as Coin;
      } catch (error) {
        console.error('Connection error:', error);
        return null;
      }
    },
    enabled: !!id,
  });
};
