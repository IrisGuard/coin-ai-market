
import { useQuery } from '@tanstack/react-query';
import { Coin } from '@/types/coin';

/**
 * Hook for featured coins - τώρα επιστρέφει άδειο array μέχρι να συνδεθεί νέο Supabase
 */
export const useFeaturedCoins = () => {
  const fetchFeaturedCoins = async (): Promise<Coin[]> => {
    console.log('Featured coins: Waiting for new Supabase connection');
    return [];
  };

  return useQuery({
    queryKey: ['featuredCoins'],
    queryFn: fetchFeaturedCoins,
  });
};
