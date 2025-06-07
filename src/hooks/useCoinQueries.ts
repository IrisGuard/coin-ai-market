import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAllDealerCoins } from '@/hooks/useDealerCoins';

export const useCoinQuery = (id: string) => {
  const { data: allCoins } = useAllDealerCoins();

  return useQuery({
    queryKey: ['coin', id],
    queryFn: async () => {
      if (!id) throw new Error('No coin ID provided');
      
      // First try to get from database
      const { data, error } = await supabase
        .from('coins')
        .select(`
          *,
          profiles!coins_user_id_fkey (
            id,
            username,
            avatar_url,
            verified_dealer,
            full_name,
            created_at,
            rating,
            name
          )
        `)
        .eq('id', id)
        .single();

      if (error && error.code !== 'PGRST116') {
        console.error('Database error:', error);
      }

      // If found in database, return it
      if (data) {
        return data;
      }

      // Otherwise, look in mock data
      const mockCoin = allCoins?.find(coin => coin.id === id);
      if (mockCoin) {
        return mockCoin;
      }

      throw new Error('Coin not found');
    },
    enabled: !!id,
  });
};

export const useCoinBidsQuery = (id: string, coin: any) => {
  return useQuery({
    queryKey: ['coin-bids', id],
    queryFn: async () => {
      if (!id) return [];
      
      // For mock data, return empty bids array
      if (coin && !coin.created_at?.includes('T')) {
        return [];
      }
      
      // First get bids without trying to join profiles
      const { data: bidsRaw, error: bidsError } = await supabase
        .from('bids')
        .select('*')
        .eq('coin_id', id)
        .order('amount', { ascending: false });

      if (bidsError) {
        console.error('Error fetching bids:', bidsError);
        return [];
      }

      if (!bidsRaw || bidsRaw.length === 0) return [];

      // Then get profiles for each bid separately
      const bidsWithProfiles = await Promise.all(
        bidsRaw.map(async (bid) => {
          const { data: profile } = await supabase
            .from('profiles')
            .select('full_name, name, username, avatar_url')
            .eq('id', bid.user_id)
            .single();

          return {
            ...bid,
            profiles: profile || { full_name: '', name: '', username: '', avatar_url: '' }
          };
        })
      );

      return bidsWithProfiles;
    },
    enabled: !!id && !!coin,
  });
};

export const useRelatedCoinsQuery = (coin: any) => {
  const { data: allCoins } = useAllDealerCoins();

  return useQuery({
    queryKey: ['related-coins', coin?.rarity, coin?.country],
    queryFn: async () => {
      if (!coin) return [];
      
      // For mock data, find related coins from mock data
      if (allCoins) {
        return allCoins
          .filter(c => 
            c.id !== coin.id && 
            (c.rarity === coin.rarity || c.country === coin.country)
          )
          .slice(0, 4);
      }
      
      const { data, error } = await supabase
        .from('coins')
        .select('*')
        .or(`rarity.eq.${coin.rarity},country.eq.${coin.country}`)
        .neq('id', coin.id)
        .limit(4);

      if (error) throw error;
      return data || [];
    },
    enabled: !!coin,
  });
};
