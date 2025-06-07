
import { useAuth } from '@/contexts/AuthContext';
import { useCoinQuery, useCoinBidsQuery, useRelatedCoinsQuery } from './useCoinQueries';
import { useCoinActions } from './useCoinActions';

export const useCoinDetails = (id: string) => {
  const { user } = useAuth();
  
  const { data: coin, isLoading, error } = useCoinQuery(id);
  const { data: bidsData } = useCoinBidsQuery(id, coin);
  const { data: relatedCoins } = useRelatedCoinsQuery(coin);
  
  const {
    isFavorited,
    bidAmount,
    setBidAmount,
    isPurchasing,
    isBidding,
    toggleFavorite,
    handlePurchase,
    handleBid
  } = useCoinActions(coin);

  return {
    coin,
    isLoading,
    error,
    bidsData,
    relatedCoins,
    isFavorited,
    bidAmount,
    setBidAmount,
    isPurchasing,
    isBidding,
    onToggleFavorite: toggleFavorite, // Renamed for consistency
    handlePurchase,
    handleBid,
    user
  };
};
