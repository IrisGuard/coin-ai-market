
import { useQuery } from '@tanstack/react-query';
import { Coin } from '@/types/coin';

/**
 * Hook for marketplace coins - τώρα επιστρέφει άδειο array μέχρι να συνδεθεί νέο Supabase
 */
export const useMarketplaceCoins = (options?: {
  rarity?: string | null;
  isAuctionOnly?: boolean;
  searchTerm?: string;
  sortBy?: 'price' | 'year';
  sortDirection?: 'asc' | 'desc';
}) => {
  const fetchCoins = async (): Promise<Coin[]> => {
    console.log('Marketplace coins: Waiting for new Supabase connection');
    return [];
  };

  return useQuery({
    queryKey: ['coins', options?.rarity, options?.isAuctionOnly, options?.searchTerm, options?.sortBy, options?.sortDirection],
    queryFn: fetchCoins,
  });
};

// Re-export for backward compatibility
export const useCoins = useMarketplaceCoins;
