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

export const useCoins = (includeAllStatuses = true) => {
  return useQuery({
    queryKey: ['coins', includeAllStatuses],
    queryFn: async () => {
      try {
        console.log('🔍 Fetching coins including ERROR COINS...');
        
        // Enhanced query to show all coins, prioritizing ERROR COINS
        let query = supabase
          .from('coins')
          .select(`
            *,
            profiles!coins_user_id_fkey(
              id,
              name,
              reputation,
              verified_dealer
            )
          `);

        // Show all coins without authentication status filtering
        const { data: coins, error: coinsError } = await query
          .order('created_at', { ascending: false });

        if (coinsError) {
          console.error('Error fetching coins:', coinsError);
          return [];
        }

        if (!coins || coins.length === 0) {
          console.log('⚠️ No coins found');
          return [];
        }

        console.log(`📊 Fetched ${coins.length} coins (including ${coins.filter(c => c.category === 'error_coin').length} ERROR COINS)`);

        // Fetch bids for each coin
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

        // PRIORITIZE ERROR COINS in display order
        const sortedCoins = coinsWithBids.sort((a, b) => {
          // ERROR COINS ALWAYS FIRST
          if (a.category === 'error_coin' && b.category !== 'error_coin') return -1;
          if (a.category !== 'error_coin' && b.category === 'error_coin') return 1;
          
          // Then featured
          if (a.featured && !b.featured) return -1;
          if (!a.featured && b.featured) return 1;
          
          // Then by creation date
          return new Date(b.created_at || '').getTime() - new Date(a.created_at || '').getTime();
        });

        console.log('✅ ERROR COINS prioritized in display order');
        return sortedCoins;
      } catch (error) {
        console.error('Error in useCoins:', error);
        return [];
      }
    },
    refetchOnWindowFocus: false,
    staleTime: 15 * 1000, // Faster refresh for error coins
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

const mapCoinData = (rawCoin: any) => ({
  id: rawCoin.id,
  name: rawCoin.name,
  year: rawCoin.year,
  grade: rawCoin.grade,
  price: rawCoin.price,
  rarity: rawCoin.rarity,
  image: rawCoin.image || rawCoin.images?.[0],
  country: rawCoin.country,
  views: rawCoin.views || 0,
  user_id: rawCoin.user_id,
  store_id: rawCoin.store_id,
  featured: rawCoin.featured || false,
  is_auction: rawCoin.is_auction || false,
  category: rawCoin.category,
  ai_confidence: rawCoin.ai_confidence,
  description: rawCoin.description,
  denomination: rawCoin.denomination,
  composition: rawCoin.composition,
  condition: rawCoin.condition
});
