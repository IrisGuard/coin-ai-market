
// Re-export all coin-related hooks from their respective files
export { useCoins, useCoin } from './useCoinsQuery';
export { useCreateCoin, useDeleteCoin } from './useCoinMutations';
export { useRealAICoinRecognition as useAICoinRecognition } from './useRealAICoinRecognition';
export { useCoinDataAggregation } from './useCoinDataAggregation';
export { useRealTimeCoins } from './useRealTimeCoins';
export { useRealTimeMarketplace } from './useRealTimeMarketplace';
