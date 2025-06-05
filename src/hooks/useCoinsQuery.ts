
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
                created_at
              `)
              .eq('coin_id', coin.id)
              .order('amount', { ascending: false });

            // Get profile names for bids
            const bidsWithProfiles = await Promise.all(
              (bids || []).map(async (bid) => {
                const { data: profile } = await supabase
                  .from('profiles')
                  .select('name')
                  .eq('id', bid.user_id)
                  .single();

                return {
                  ...bid,
                  profiles: profile || { name: 'Anonymous' }
                };
              })
            );

            return {
              ...coin,
              bids: bidsWithProfiles
            };
          })
        );
        
        return coinsWithBids.map(transformSupabaseCoinData);
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
        const { data: coin, error: coinError } = await supabase
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

        if (coinError) {
          console.error('Error fetching coin:', coinError);
          return null;
        }

        if (!coin) return null;

        // Fetch bids for this coin
        const { data: bids } = await supabase
          .from('bids')
          .select(`
            id,
            amount,
            user_id,
            created_at
          `)
          .eq('coin_id', coin.id)
          .order('amount', { ascending: false });

        // Get profile names for bids
        const bidsWithProfiles = await Promise.all(
          (bids || []).map(async (bid) => {
            const { data: profile } = await supabase
              .from('profiles')
              .select('name')
              .eq('id', bid.user_id)
              .single();

            return {
              ...bid,
              profiles: profile || { name: 'Anonymous' }
            };
          })
        );

        const coinWithBids = {
          ...coin,
          bids: bidsWithProfiles
        };
        
        return transformSupabaseCoinData(coinWithBids);
      } catch (error) {
        console.error('Connection error:', error);
        return null;
      }
    },
    enabled: !!id,
  });
};
