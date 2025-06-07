
import { supabase } from '@/integrations/supabase/client';
import { mockAuctionCoins } from '@/data/mockAuctionCoins';
import { AuctionCoin } from '@/types/auction';

export const useAuctionsFetch = () => {
  const fetchAuctions = async (): Promise<AuctionCoin[]> => {
    try {
      // Try to get from database first
      const { data: auctionsData, error: auctionsError } = await supabase
        .from('coins')
        .select(`
          id,
          name,
          year,
          image,
          price,
          reserve_price,
          auction_end,
          rarity,
          condition,
          country,
          user_id,
          description,
          views,
          is_auction,
          listing_type,
          profiles!user_id (
            name,
            reputation,
            verified_dealer
          )
        `)
        .eq('is_auction', true)
        .gt('auction_end', new Date().toISOString())
        .order('auction_end', { ascending: true });

      // If database has auction data, use it
      if (auctionsData && auctionsData.length > 0) {
        const auctionsWithBids = await Promise.all(
          auctionsData.map(async (auction: any) => {
            const { data: bids } = await supabase
              .from('auction_bids')
              .select('amount, bidder_id')
              .eq('auction_id', auction.id)
              .order('amount', { ascending: false });

            const { count: bidCount } = await supabase
              .from('auction_bids')
              .select('*', { count: 'exact', head: true })
              .eq('auction_id', auction.id);

            const { count: watcherCount } = await supabase
              .from('watchlist')
              .select('*', { count: 'exact', head: true })
              .eq('listing_id', auction.id);

            const currentBid = bids?.[0]?.amount || auction.price;
            const highestBidderId = bids?.[0]?.bidder_id || null;

            return {
              ...auction,
              starting_price: auction.price,
              current_bid: currentBid,
              bid_count: bidCount || 0,
              highest_bidder_id: highestBidderId,
              seller_id: auction.user_id,
              watchers: watcherCount || 0,
              views: auction.views || 0,
              listing_type: auction.listing_type || 'auction',
              is_auction: auction.is_auction || true,
              authentication_status: 'verified',
              featured: false,
              profiles: auction.profiles ? {
                id: auction.user_id,
                name: auction.profiles.name || 'Unknown Dealer',
                reputation: auction.profiles.reputation || 95,
                verified_dealer: auction.profiles.verified_dealer || true,
                avatar_url: '/placeholder.svg'
              } : {
                id: auction.user_id,
                name: 'Unknown Dealer',
                reputation: 95,
                verified_dealer: true,
                avatar_url: '/placeholder.svg'
              }
            };
          })
        );
        return auctionsWithBids;
      } else {
        // Use mock data if no database data
        console.log('No auctions found in database, using mock auction data');
        return mockAuctionCoins.filter(auction => {
          const auctionEnd = new Date(auction.auction_end);
          return auctionEnd > new Date(); // Only show active auctions
        });
      }
    } catch (error) {
      console.error('Error fetching auctions:', error);
      // Fallback to mock data on error
      console.log('Database error, falling back to mock auction data');
      return mockAuctionCoins.filter(auction => {
        const auctionEnd = new Date(auction.auction_end);
        return auctionEnd > new Date();
      });
    }
  };

  return { fetchAuctions };
};
