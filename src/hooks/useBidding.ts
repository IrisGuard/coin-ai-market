
import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { auctionService } from '@/services/auctionService';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';

export const useBidding = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [autoBidSettings, setAutoBidSettings] = useState<Record<string, { maxAmount: number; increment: number }>>({});

  const { data: userBids, isLoading: userBidsLoading } = useQuery({
    queryKey: ['user-bids', user?.id],
    queryFn: () => auctionService.getUserBids(user!.id),
    enabled: !!user?.id,
    refetchInterval: 30000
  });

  const { data: auctionStats, isLoading: statsLoading } = useQuery({
    queryKey: ['auction-stats'],
    queryFn: () => auctionService.getAuctionStats(),
    refetchInterval: 60000 // Refresh every minute
  });

  const placeBidMutation = useMutation({
    mutationFn: ({ auctionId, amount, autoBidMax }: { auctionId: string; amount: number; autoBidMax?: number }) =>
      auctionService.placeBid({
        listing_id: auctionId,
        amount,
        auto_bid_max: autoBidMax
      }),
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: ['auctions'] });
      queryClient.invalidateQueries({ queryKey: ['auction', variables.auctionId] });
      queryClient.invalidateQueries({ queryKey: ['bid-history', variables.auctionId] });
      queryClient.invalidateQueries({ queryKey: ['user-bids', user?.id] });
      toast.success('Bid placed successfully!');
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Failed to place bid');
    }
  });

  const enableAutoBid = (auctionId: string, maxAmount: number, increment: number) => {
    setAutoBidSettings(prev => ({
      ...prev,
      [auctionId]: { maxAmount, increment }
    }));
    toast.success('Auto-bidding enabled');
  };

  const disableAutoBid = (auctionId: string) => {
    setAutoBidSettings(prev => {
      const updated = { ...prev };
      delete updated[auctionId];
      return updated;
    });
    toast.success('Auto-bidding disabled');
  };

  const getMinimumBid = (currentPrice: number, bidIncrement: number = 1) => {
    return currentPrice + bidIncrement;
  };

  const calculateBidAmount = (currentPrice: number, increment: number = 1) => {
    return Math.ceil((currentPrice + increment) / increment) * increment;
  };

  return {
    userBids,
    auctionStats,
    autoBidSettings,
    userBidsLoading,
    statsLoading,
    placeBid: placeBidMutation.mutate,
    isPlacingBid: placeBidMutation.isPending,
    enableAutoBid,
    disableAutoBid,
    getMinimumBid,
    calculateBidAmount
  };
};
