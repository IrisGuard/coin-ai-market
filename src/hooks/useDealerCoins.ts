
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Coin, Rarity, CoinCondition } from '@/types/coin';

// Type-safe transformation function (reusing from useCoinsQuery)
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

export const useDealerCoins = (dealerId: string) => {
  return useQuery({
    queryKey: ['dealer-coins', dealerId],
    queryFn: async () => {
      try {
        // Fetch coins for specific dealer with profiles
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
          .eq('user_id', dealerId)
          .eq('authentication_status', 'verified')
          .order('created_at', { ascending: false });

        if (coinsError) {
          console.error('Error fetching dealer coins:', coinsError);
          return [];
        }

        if (!coins || coins.length === 0) return [];

        // Fetch bids for each coin separately
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
        console.error('Error in useDealerCoins:', error);
        return [];
      }
    },
    enabled: !!dealerId,
    refetchOnWindowFocus: false,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};
