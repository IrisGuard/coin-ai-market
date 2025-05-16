
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';
import { Coin } from '@/types/coin';
import { marketplaceCoins } from '@/data/marketplaceCoins';
import { mapDbCoinWithBidsToCoin } from '@/utils/coinMappers';

/**
 * Hook for fetching a single coin by ID
 */
export const useSingleCoin = (id: string) => {
  const fetchCoin = async (): Promise<Coin> => {
    try {
      const { data, error } = await supabase
        .from('coins')
        .select(`
          *,
          bids(*)
        `)
        .eq('id', id)
        .single();
      
      if (error) {
        throw error;
      }
      
      // Update view count
      await supabase
        .from('coins')
        .update({ views: (data.views || 0) + 1 })
        .eq('id', id);
      
      return mapDbCoinWithBidsToCoin(data) as Coin;
    } catch (error) {
      console.error('Error fetching coin:', error);
      
      // Return static data as fallback
      const staticCoin = marketplaceCoins.find(c => c.id === id);
      
      if (!staticCoin) {
        throw new Error('Coin not found');
      }
      
      return staticCoin;
    }
  };

  return useQuery({
    queryKey: ['coin', id],
    queryFn: fetchCoin,
  });
};

// Re-export for backward compatibility
export const useCoin = useSingleCoin;
