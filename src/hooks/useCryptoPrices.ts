
import { useQuery } from '@tanstack/react-query';

interface CryptoPrices {
  solana: {
    usd: number;
  };
}

export const useCryptoPrices = () => {
  return useQuery({
    queryKey: ['crypto-prices'],
    queryFn: async (): Promise<CryptoPrices> => {
      try {
        const response = await fetch('https://api.coingecko.com/api/v3/simple/price?ids=solana&vs_currencies=usd');
        if (!response.ok) throw new Error('Failed to fetch prices');
        const data = await response.json();
        return data;
      } catch (error) {
        console.error('Error fetching crypto prices:', error);
        return {
          solana: { usd: 0 }
        };
      }
    },
    refetchInterval: 60000, // Refresh every minute
    retry: 3,
  });
};
