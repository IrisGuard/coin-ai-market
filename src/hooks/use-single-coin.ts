
import { useQuery } from '@tanstack/react-query';
import { Coin } from '@/types/coin';

export const useSingleCoin = (id: string) => {
  const fetchCoin = async (): Promise<Coin> => {
    // TODO: Replace with real API call when backend is connected
    throw new Error('No backend connection configured yet');
  };

  return useQuery({
    queryKey: ['coin', id],
    queryFn: fetchCoin,
  });
};

export const useCoin = useSingleCoin;
