
import { useDealerCoinsQuery } from './useDealerCoinsQuery';

export const useDealerCoins = (dealerId?: string) => {
  return useDealerCoinsQuery(dealerId);
};

export const useAllDealerCoins = () => {
  return useDealerCoinsQuery();
};
