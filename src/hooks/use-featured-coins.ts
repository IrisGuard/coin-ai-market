
import { useQuery } from '@tanstack/react-query';
import { Coin } from '@/types/coin';

export const useFeaturedCoins = () => {
  const fetchFeaturedCoins = async (): Promise<Coin[]> => {
    // TODO: Replace with real API call when backend is connected
    return [];
  };

  return useQuery({
    queryKey: ['featuredCoins'],
    queryFn: fetchFeaturedCoins,
  });
};
