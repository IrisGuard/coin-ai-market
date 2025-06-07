
import { useQuery } from '@tanstack/react-query';
import { Coin } from '@/types/coin';
import { mockCoinsData } from '@/data/mockCoins';

export const useDealerCoins = (dealerId: string) => {
  return useQuery({
    queryKey: ['dealer-coins', dealerId],
    queryFn: async () => {
      // Simulate loading time
      await new Promise(resolve => setTimeout(resolve, 500));
      return mockCoinsData[dealerId] || [];
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

export const useAllDealerCoins = () => {
  return useQuery({
    queryKey: ['all-dealer-coins'],
    queryFn: async () => {
      // Simulate loading time
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Flatten all coins from all dealers
      const allCoins = Object.values(mockCoinsData).flat();
      return allCoins;
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};
