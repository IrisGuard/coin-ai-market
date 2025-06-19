
export interface AuctionListing {
  id: string;
  coin_id: string;
  seller_id: string;
  listing_type: 'auction';
  starting_price: number;
  current_price: number;
  buyout_price?: number;
  reserve_price?: number;
  bid_increment: number;
  ends_at: string;
  auto_extend: boolean;
  auto_extend_duration?: number; // minutes
  status: 'active' | 'ended' | 'cancelled' | 'sold';
  created_at: string;
  updated_at: string;
  shipping_cost?: number;
  international_shipping?: boolean;
  return_policy?: string;
  view_count?: number;
  watcher_count?: number;
  coins?: AuctionCoin;
}

export interface AuctionCoin {
  id: string;
  name: string;
  image: string;
  year: number;
  grade: string;
  rarity: string;
  condition?: string;
  category: string;
  country?: string;
  denomination?: string;
  mint?: string;
  composition?: string;
  weight?: number;
  diameter?: number;
  mintage?: number;
  description?: string;
  images?: string[];
}

export interface AuctionBid {
  id: string;
  listing_id: string;
  bidder_id: string;
  amount: number;
  auto_bid_max?: number;
  is_winning: boolean;
  is_auto_bid: boolean;
  created_at: string;
  profiles?: {
    name: string;
    avatar_url?: string;
    verified_dealer?: boolean;
  };
}

export interface AuctionTimer {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  expired: boolean;
  endingSoon: boolean; // less than 24 hours
  criticalTime: boolean; // less than 1 hour
}

export interface AuctionStats {
  active_auctions: number;
  ending_soon: number;
  total_bids_24h: number;
  total_value: number;
  average_bid: number;
  highest_bid_24h: number;
  most_watched_auction?: string;
}

export interface AutoBidSettings {
  enabled: boolean;
  max_amount: number;
  increment: number;
  stop_at_reserve?: boolean;
  notify_on_outbid: boolean;
}

export interface AuctionFilters {
  category?: string;
  min_price?: number;
  max_price?: number;
  ending_soon?: boolean;
  has_reserve?: boolean;
  has_buyout?: boolean;
  condition?: string[];
  grade?: string[];
  rarity?: string[];
  country?: string[];
  sort_by?: 'ending_soon' | 'newest' | 'price_low' | 'price_high' | 'most_bids' | 'most_watched';
}

export interface AuctionNotification {
  id: string;
  user_id: string;
  auction_id: string;
  type: 'bid_placed' | 'outbid' | 'auction_won' | 'auction_lost' | 'auction_ending' | 'reserve_met' | 'buyout_available';
  message: string;
  is_read: boolean;
  created_at: string;
  auction_data?: Partial<AuctionListing>;
}

export interface WatchlistItem {
  id: string;
  user_id: string;
  listing_id: string;
  created_at: string;
  auction?: AuctionListing;
}

export interface AuctionAnalytics {
  auction_id: string;
  total_bids: number;
  unique_bidders: number;
  bid_frequency: number; // bids per hour
  price_progression: Array<{
    timestamp: string;
    price: number;
    bidder_id: string;
  }>;
  watchers: number;
  views: number;
  conversion_rate: number; // watchers to bidders
}

export interface AuctionHistory {
  id: string;
  auction_id: string;
  event_type: 'bid_placed' | 'reserve_met' | 'auction_extended' | 'buyout_used' | 'auction_ended';
  event_data: Record<string, any>;
  timestamp: string;
  user_id?: string;
}

export interface BidValidation {
  isValid: boolean;
  error?: string;
  minimumBid: number;
  suggestedBid?: number;
}

export interface AuctionEndResult {
  auction_id: string;
  winner_id?: string;
  winning_bid?: number;
  reserve_met: boolean;
  total_bids: number;
  ended_at: string;
  end_reason: 'time_expired' | 'buyout_used' | 'cancelled';
}
