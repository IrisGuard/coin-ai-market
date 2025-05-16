
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';
import { Coin } from '@/types/coin';
import { marketplaceCoins } from '@/data/marketplaceCoins';
import { mapDbCoinToCoin, filterAndSortStaticData } from '@/utils/coinMappers';

/**
 * Hook for fetching and filtering marketplace coins
 */
export const useMarketplaceCoins = (options?: {
  rarity?: string | null;
  isAuctionOnly?: boolean;
  searchTerm?: string;
  sortBy?: 'price' | 'year';
  sortDirection?: 'asc' | 'desc';
}) => {
  const {
    rarity = null,
    isAuctionOnly = false,
    searchTerm = '',
    sortBy = 'price',
    sortDirection = 'desc'
  } = options || {};

  // Fetch coins from Supabase
  const fetchCoins = async (): Promise<Coin[]> => {
    try {
      let query = supabase
        .from('coins')
        .select('*');
      
      // Apply filters
      if (rarity) {
        query = query.eq('rarity', rarity);
      }
      
      if (isAuctionOnly) {
        query = query.eq('is_auction', true);
      }
      
      if (searchTerm) {
        query = query.or(
          `name.ilike.%${searchTerm}%,year.eq.${parseInt(searchTerm) || 0},grade.ilike.%${searchTerm}%`
        );
      }
      
      // Apply sorting
      query = query.order(sortBy, { ascending: sortDirection === 'asc' });
      
      const { data, error } = await query;
      
      if (error) {
        throw error;
      }
      
      return data.map(mapDbCoinToCoin) as Coin[];
    } catch (error) {
      console.error('Error fetching coins:', error);
      
      // Return static data as fallback
      console.log('Using fallback data');
      return filterAndSortStaticData(marketplaceCoins, {
        rarity,
        isAuctionOnly,
        searchTerm,
        sortBy,
        sortDirection
      });
    }
  };

  return useQuery({
    queryKey: ['coins', rarity, isAuctionOnly, searchTerm, sortBy, sortDirection],
    queryFn: fetchCoins,
  });
};

// Re-export for backward compatibility
export const useCoins = useMarketplaceCoins;
