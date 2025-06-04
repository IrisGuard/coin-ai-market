
import { useQuery } from '@tanstack/react-query';
import { Coin } from '@/types/coin';

/**
 * Hook for single coin - τώρα επιστρέφει error μέχρι να συνδεθεί νέο Supabase
 */
export const useSingleCoin = (id: string) => {
  const fetchCoin = async (): Promise<Coin> => {
    console.log('Single coin: Waiting for new Supabase connection');
    throw new Error('No database connection - waiting for new Supabase setup');
  };

  return useQuery({
    queryKey: ['coin', id],
    queryFn: fetchCoin,
  });
};

// Re-export for backward compatibility
export const useCoin = useSingleCoin;
