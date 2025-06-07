
import { useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import { AuctionCoin, Bid } from '@/types/auctionData';
import { useAuctionsFetch } from './useAuctionsFetch';
import { useUserBidsFetch } from './useUserBidsFetch';
import { useAuctionSubscription } from './useAuctionSubscription';

export const useAuctionData = (userId?: string) => {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(true);
  const [auctions, setAuctions] = useState<AuctionCoin[]>([]);
  const [myBids, setMyBids] = useState<Bid[]>([]);

  const { fetchAuctions } = useAuctionsFetch();
  const { fetchUserBids } = useUserBidsFetch();

  // Set up real-time subscription
  useAuctionSubscription(setAuctions);

  useEffect(() => {
    const fetchAuctionsData = async () => {
      setIsLoading(true);
      try {
        const auctionsData = await fetchAuctions();
        setAuctions(auctionsData);

        // Fetch user's bids if authenticated
        if (userId) {
          const userBidsData = await fetchUserBids(userId);
          setMyBids(userBidsData);
        }

      } catch (error) {
        console.error('Error in auction data fetch:', error);
        toast({
          title: "Using Demo Data",
          description: "Showing demo auctions while connecting to database",
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchAuctionsData();
  }, [userId, toast, fetchAuctions, fetchUserBids]);

  return { auctions, myBids, isLoading };
};
