
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { auctionService, BidData } from '@/services/auctionService';
import { toast } from 'sonner';

export const useAuction = (auctionId?: string) => {
  const queryClient = useQueryClient();

  const { data: auctions, isLoading: auctionsLoading } = useQuery({
    queryKey: ['auctions'],
    queryFn: () => auctionService.getActiveAuctions(),
    refetchInterval: 30000 // Refresh every 30 seconds
  });

  const { data: auction, isLoading: auctionLoading } = useQuery({
    queryKey: ['auction', auctionId],
    queryFn: () => auctionService.getAuctionById(auctionId!),
    enabled: !!auctionId,
    refetchInterval: 10000 // Refresh every 10 seconds for individual auction
  });

  const { data: bidHistory, isLoading: bidHistoryLoading } = useQuery({
    queryKey: ['bid-history', auctionId],
    queryFn: () => auctionService.getBidHistory(auctionId!),
    enabled: !!auctionId,
    refetchInterval: 5000 // Refresh every 5 seconds
  });

  const placeBidMutation = useMutation({
    mutationFn: (bidData: BidData) => auctionService.placeBid(bidData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['auctions'] });
      queryClient.invalidateQueries({ queryKey: ['auction', auctionId] });
      queryClient.invalidateQueries({ queryKey: ['bid-history', auctionId] });
      toast.success('Bid placed successfully!');
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Failed to place bid');
    }
  });

  const addToWatchlistMutation = useMutation({
    mutationFn: (auctionId: string) => auctionService.addToWatchlist(auctionId),
    onSuccess: () => {
      toast.success('Added to watchlist');
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Failed to add to watchlist');
    }
  });

  const removeFromWatchlistMutation = useMutation({
    mutationFn: (auctionId: string) => auctionService.removeFromWatchlist(auctionId),
    onSuccess: () => {
      toast.success('Removed from watchlist');
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Failed to remove from watchlist');
    }
  });

  return {
    auctions,
    auction,
    bidHistory,
    auctionsLoading,
    auctionLoading,
    bidHistoryLoading,
    placeBid: placeBidMutation.mutate,
    addToWatchlist: addToWatchlistMutation.mutate,
    removeFromWatchlist: removeFromWatchlistMutation.mutate,
    isPlacingBid: placeBidMutation.isPending,
    isAddingToWatchlist: addToWatchlistMutation.isPending,
    isRemovingFromWatchlist: removeFromWatchlistMutation.isPending
  };
};
