
import { Coin, Rarity, CoinCondition } from '@/types/coin';
import { supabase } from '@/integrations/supabase/client';

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

// Production data fetching - no mock data
export const getCoins = async (count: number = 6): Promise<Coin[]> => {
  const { data, error } = await supabase
    .from('coins')
    .select(`
      *,
      profiles!coins_user_id_fkey (
        id,
        name,
        email,
        reputation,
        verified_dealer
      )
    `)
    .order('created_at', { ascending: false })
    .limit(count);

  if (error) {
    console.error('Error fetching coins:', error);
    return [];
  }

  return (data || []).map(transformSupabaseCoinData);
};

export const getCoinById = async (id: string): Promise<Coin | null> => {
  const { data, error } = await supabase
    .from('coins')
    .select(`
      *,
      profiles!coins_user_id_fkey (
        id,
        name,
        email,
        reputation,
        verified_dealer
      )
    `)
    .eq('id', id)
    .single();

  if (error) {
    console.error('Error fetching coin:', error);
    return null;
  }

  return data ? transformSupabaseCoinData(data) : null;
};

export const getFeaturedCoins = async (): Promise<Coin[]> => {
  const { data, error } = await supabase
    .from('coins')
    .select(`
      *,
      profiles!coins_user_id_fkey (
        id,
        name,
        email,
        reputation,
        verified_dealer
      )
    `)
    .eq('featured', true)
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching featured coins:', error);
    return [];
  }

  return (data || []).map(transformSupabaseCoinData);
};

export const getAuctionCoins = async (): Promise<Coin[]> => {
  const { data, error } = await supabase
    .from('coins')
    .select(`
      *,
      profiles!coins_user_id_fkey (
        id,
        name,
        email,
        reputation,
        verified_dealer
      )
    `)
    .eq('is_auction', true)
    .gt('auction_end', new Date().toISOString())
    .order('auction_end', { ascending: true });

  if (error) {
    console.error('Error fetching auction coins:', error);
    return [];
  }

  return (data || []).map(transformSupabaseCoinData);
};

// Legacy support - use real data
export const getRandomCoins = getCoins;
export const sampleCoins: Coin[] = [];
