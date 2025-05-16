
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';
import { Coin } from '@/types/coin';
import { marketplaceCoins } from '@/data/marketplaceCoins';
import { mapDbCoinToCoin } from '@/utils/coinMappers';
import { getTimeLeft } from '@/utils/timeUtils';

/**
 * Hook for fetching featured coins
 */
export const useFeaturedCoins = () => {
  const fetchFeaturedCoins = async (): Promise<Coin[]> => {
    try {
      const { data, error } = await supabase
        .from('coins')
        .select('*')
        .in('rarity', ['Rare', 'Ultra Rare'])
        .limit(5);
      
      if (error) {
        throw error;
      }
      
      return data.map(mapDbCoinToCoin) as Coin[];
    } catch (error) {
      console.error('Error fetching featured coins:', error);
      
      // Return static data as fallback
      return marketplaceCoins
        .filter(coin => coin.rarity === 'Rare' || coin.rarity === 'Ultra Rare')
        .sort(() => Math.random() - 0.5)
        .slice(0, 5);
    }
  };

  return useQuery({
    queryKey: ['featuredCoins'],
    queryFn: fetchFeaturedCoins,
  });
};
