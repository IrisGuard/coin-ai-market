
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';
import { Coin } from '@/types/coin';
import { mapDbCoinToCoin } from '@/utils/coinMappers';

/**
 * Hook for fetching featured coins from Supabase only
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
      // Return empty array instead of fallback mock data
      return [];
    }
  };

  return useQuery({
    queryKey: ['featuredCoins'],
    queryFn: fetchFeaturedCoins,
  });
};
