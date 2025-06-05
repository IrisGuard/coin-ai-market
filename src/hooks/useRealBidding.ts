
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';

export const usePlaceBid = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ 
      listingId, 
      amount 
    }: { 
      listingId: string; 
      amount: number; 
    }) => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Must be logged in to bid');

      // Check if bid is valid
      const { data: listing, error: listingError } = await supabase
        .from('marketplace_listings')
        .select('current_price, ends_at, seller_id, starting_price')
        .eq('id', listingId)
        .single();

      if (listingError) throw listingError;
      if (!listing) throw new Error('Listing not found');
      
      if (listing.seller_id === user.id) throw new Error('Cannot bid on your own listing');
      if (listing.ends_at && new Date(listing.ends_at) < new Date()) {
        throw new Error('Auction has ended');
      }
      
      const currentPrice = listing.current_price || listing.starting_price;
      if (amount <= currentPrice) {
        throw new Error('Bid must be higher than current price');
      }

      // Place bid
      const { data, error } = await supabase
        .from('bids')
        .insert({
          listing_id: listingId,
          bidder_id: user.id,
          amount: amount,
          coin_id: '', // We'll need to get this from the listing
        })
        .select()
        .single();

      if (error) throw error;

      // Update listing current price
      await supabase
        .from('marketplace_listings')
        .update({ current_price: amount })
        .eq('id', listingId);

      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['marketplace-listings'] });
      toast({
        title: "Bid Placed Successfully",
        description: "Your bid has been placed. You'll be notified if you're outbid.",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Bid Failed",
        description: error.message,
        variant: "destructive",
      });
    }
  });
};
