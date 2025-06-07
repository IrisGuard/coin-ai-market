
import React, { useState } from 'react';
import { AuctionCoin } from '@/types/auction';
import { useAuctionFetch } from './useAuctionFetch';
import { useUserBids } from './useUserBids';
import { useAuctionRealtime } from './useAuctionRealtime';

export const useAuctionData = (userId?: string) => {
  const { auctions: fetchedAuctions, isLoading } = useAuctionFetch();
  const { myBids } = useUserBids(userId);
  const [auctions, setAuctions] = useState<AuctionCoin[]>([]);

  // Update local auctions state when fetched auctions change
  React.useEffect(() => {
    setAuctions(fetchedAuctions);
  }, [fetchedAuctions]);

  // Set up real-time updates
  useAuctionRealtime(auctions, setAuctions);

  return { auctions, myBids, isLoading };
};
