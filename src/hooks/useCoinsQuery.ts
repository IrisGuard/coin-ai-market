
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Coin, Rarity, CoinCondition } from '@/types/coin';

// Type-safe transformation function
const transformSupabaseCoinData = (rawCoin: any): Coin => {
  return {
    ...rawCoin,
    rarity: rawCoin.rarity as Rarity,
    condition: rawCoin.condition as CoinCondition | undefined,
    authentication_status: rawCoin.authentication_status as 'pending' | 'verified' | 'rejected' | undefined,
    profiles: rawCoin.profiles || {
      id: '',
      name: '',
      reputation: 0,
      verified_dealer: false
    },
    bids: rawCoin.bids?.map((bid: any) => ({
      ...bid,
      profiles: bid.profiles || { name: '' }
    })) || []
  };
};

export const useCoins = () => {
  return useQuery({
    queryKey: ['coins'],
    queryFn: async () => {
      try {
        // Fetch coins with profiles first
        const { data: coins, error: coinsError } = await supabase
          .from('coins')
          .select(`
            *,
            profiles!coins_user_id_fkey(
              id,
              name,
              reputation,
              verified_dealer
            )
          `)
          .eq('authentication_status', 'verified')
          .order('created_at', { ascending: false });

        if (coinsError) {
          console.error('Error fetching coins:', coinsError);
          return [];
        }

        if (!coins || coins.length === 0) return [];

        // Fetch bids for each coin separately to avoid complex joins
        const coinsWithBids = await Promise.all(
          coins.map(async (coin) => {
            const { data: bids } = await supabase
              .from('bids')
              .select(`
                id,
                amount,
                user_id,
                created_at,
                profiles!bids_user_id_fkey(name)
              `)
              .eq('coin_id', coin.id)
              .order('amount', { ascending: false });

            return transformSupabaseCoinData({
              ...coin,
              bids: bids || []
            });
          })
        );

        return coinsWithBids;
      } catch (error) {
        console.error('Error in useCoins:', error);
        return [];
      }
    },
    refetchOnWindowFocus: false,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

export const useCoin = (id: string) => {
  return useQuery({
    queryKey: ['coin', id],
    queryFn: async () => {
      try {
        const { data: coin, error } = await supabase
          .from('coins')
          .select(`
            *,
            profiles!coins_user_id_fkey(
              id,
              name,
              reputation,
              verified_dealer,
              avatar_url
            )
          `)
          .eq('id', id)
          .single();

        if (error) {
          console.error('Error fetching coin:', error);
          throw error;
        }

        if (!coin) return null;

        // Fetch bids separately
        const { data: bids } = await supabase
          .from('bids')
          .select(`
            id,
            amount,
            user_id,
            created_at,
            profiles!bids_user_id_fkey(name, avatar_url)
          `)
          .eq('coin_id', id)
          .order('amount', { ascending: false });

        return transformSupabaseCoinData({
          ...coin,
          bids: bids || []
        });
      } catch (error) {
        console.error('Error in useCoin:', error);
        throw error;
      }
    },
    enabled: !!id,
    refetchOnWindowFocus: false,
    staleTime: 5 * 60 * 1000,
  });
};
