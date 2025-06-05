
import { Coin, Rarity } from '@/types/coin';
import { supabase } from '@/integrations/supabase/client';

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

  return (data || []).map(coin => ({
    ...coin,
    rarity: coin.rarity as Rarity
  }));
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

  return data ? {
    ...data,
    rarity: data.rarity as Rarity
  } : null;
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

  return (data || []).map(coin => ({
    ...coin,
    rarity: coin.rarity as Rarity
  }));
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

  return (data || []).map(coin => ({
    ...coin,
    rarity: coin.rarity as Rarity
  }));
};

// Legacy support - use real data
export const getRandomCoins = getCoins;
export const sampleCoins: Coin[] = [];
