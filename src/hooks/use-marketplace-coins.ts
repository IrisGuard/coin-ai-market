
import { useQuery } from '@tanstack/react-query';
import { Coin } from '@/types/coin';

export const useMarketplaceCoins = (options?: {
  rarity?: string | null;
  isAuctionOnly?: boolean;
  searchTerm?: string;
  sortBy?: 'price' | 'year';
  sortDirection?: 'asc' | 'desc';
}) => {
  const fetchCoins = async (): Promise<Coin[]> => {
    // TODO: Replace with real API call when backend is connected
    return [];
  };

  return useQuery({
    queryKey: ['coins', options?.rarity, options?.isAuctionOnly, options?.searchTerm, options?.sortBy, options?.sortDirection],
    queryFn: fetchCoins,
  });
};

export const useCoins = useMarketplaceCoins;
