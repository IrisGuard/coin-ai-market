
import { useQuery } from '@tanstack/react-query';

interface CryptoPrices {
  solana: {
    usd: number;
  };
  'usd-coin': {
    usd: number;
  };
}

export const useCryptoPrices = () => {
  return useQuery({
    queryKey: ['crypto-prices'],
    queryFn: async (): Promise<CryptoPrices> => {
      const response = await fetch(
        'https://api.coingecko.com/api/v3/simple/price?ids=solana,usd-coin&vs_currencies=usd'
      );
      
      if (!response.ok) {
        throw new Error('Failed to fetch crypto prices');
      }
      
      return response.json();
    },
    refetchInterval: 30000, // Refresh every 30 seconds
    staleTime: 25000, // Consider data stale after 25 seconds
  });
};
