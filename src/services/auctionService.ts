
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export interface AuctionListing {
  id: string;
  coin_id: string;
  seller_id: string;
  starting_price: number;
  current_price: number;
  buyout_price?: number;
  reserve_price?: number;
  auction_end: string;
  auto_extend: boolean;
  bid_increment: number;
  status: 'active' | 'ended' | 'cancelled';
  created_at: string;
  coins?: {
    id: string;
    name: string;
    image: string;
    year: number;
    grade: string;
    rarity: string;
    condition?: string;
    category: string;
  };
}

export interface BidData {
  listing_id: string;
  amount: number;
  auto_bid_max?: number;
}

class AuctionService {
  async getActiveAuctions() {
    try {
      const { data, error } = await supabase
        .from('marketplace_listings')
        .select(`
          *,
          coins (*)
        `)
        .eq('listing_type', 'auction')
        .eq('status', 'active')
        .gt('ends_at', new Date().toISOString())
        .order('ends_at', { ascending: true });

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error fetching active auctions:', error);
      throw error;
    }
  }

  async getAuctionById(auctionId: string) {
    try {
      const { data, error } = await supabase
        .from('marketplace_listings')
        .select(`
          *,
          coins (*)
        `)
        .eq('id', auctionId)
        .eq('listing_type', 'auction')
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error fetching auction:', error);
      throw error;
    }
  }

  async placeBid(bidData: BidData) {
    try {
      const user = await supabase.auth.getUser();
      if (!user.data.user) throw new Error('Not authenticated');

      // Get current auction details
      const { data: auction, error: auctionError } = await supabase
        .from('marketplace_listings')
        .select('current_price, ends_at, seller_id, bid_increment')
        .eq('id', bidData.listing_id)
        .single();

      if (auctionError) throw auctionError;
      if (!auction) throw new Error('Auction not found');

      // Validate bid amount
      const minimumBid = auction.current_price + auction.bid_increment;
      if (bidData.amount < minimumBid) {
        throw new Error(`Bid must be at least $${minimumBid}`);
      }

      // Check if auction has ended
      if (new Date(auction.ends_at) <= new Date()) {
        throw new Error('Auction has ended');
      }

      // Check if user is not the seller
      if (auction.seller_id === user.data.user.id) {
        throw new Error('Cannot bid on your own auction');
      }

      // Place the bid
      const { data: bid, error: bidError } = await supabase
        .from('bids')
        .insert({
          listing_id: bidData.listing_id,
          bidder_id: user.data.user.id,
          user_id: user.data.user.id,
          amount: bidData.amount,
          auto_bid_max: bidData.auto_bid_max,
          coin_id: auction.coin_id
        })
        .select()
        .single();

      if (bidError) throw bidError;

      // Update auction current price
      const { error: updateError } = await supabase
        .from('marketplace_listings')
        .update({ current_price: bidData.amount })
        .eq('id', bidData.listing_id);

      if (updateError) throw updateError;

      return bid;
    } catch (error) {
      console.error('Error placing bid:', error);
      throw error;
    }
  }

  async getBidHistory(auctionId: string) {
    try {
      const { data, error } = await supabase
        .from('bids')
        .select(`
          *,
          profiles!bidder_id (name, avatar_url)
        `)
        .eq('listing_id', auctionId)
        .order('amount', { ascending: false });

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error fetching bid history:', error);
      throw error;
    }
  }

  async getUserBids(userId: string) {
    try {
      const { data, error } = await supabase
        .from('bids')
        .select(`
          *,
          marketplace_listings!listing_id (
            *,
            coins (*)
          )
        `)
        .eq('bidder_id', userId)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error fetching user bids:', error);
      throw error;
    }
  }

  async addToWatchlist(auctionId: string) {
    try {
      const user = await supabase.auth.getUser();
      if (!user.data.user) throw new Error('Not authenticated');

      const { data, error } = await supabase
        .from('watchlist')
        .insert({
          user_id: user.data.user.id,
          listing_id: auctionId
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error adding to watchlist:', error);
      throw error;
    }
  }

  async removeFromWatchlist(auctionId: string) {
    try {
      const user = await supabase.auth.getUser();
      if (!user.data.user) throw new Error('Not authenticated');

      const { error } = await supabase
        .from('watchlist')
        .delete()
        .eq('user_id', user.data.user.id)
        .eq('listing_id', auctionId);

      if (error) throw error;
    } catch (error) {
      console.error('Error removing from watchlist:', error);
      throw error;
    }
  }

  async getAuctionStats() {
    try {
      const { data: activeAuctions } = await supabase
        .from('marketplace_listings')
        .select('*')
        .eq('listing_type', 'auction')
        .eq('status', 'active')
        .gt('ends_at', new Date().toISOString());

      const { data: endingSoon } = await supabase
        .from('marketplace_listings')
        .select('*')
        .eq('listing_type', 'auction')
        .eq('status', 'active')
        .gte('ends_at', new Date().toISOString())
        .lte('ends_at', new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString());

      const { data: totalBids } = await supabase
        .from('bids')
        .select('amount')
        .gte('created_at', new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString());

      return {
        active_auctions: activeAuctions?.length || 0,
        ending_soon: endingSoon?.length || 0,
        total_bids_24h: totalBids?.length || 0,
        total_value: totalBids?.reduce((sum, bid) => sum + bid.amount, 0) || 0
      };
    } catch (error) {
      console.error('Error fetching auction stats:', error);
      throw error;
    }
  }
}

export const auctionService = new AuctionService();
