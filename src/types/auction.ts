
export interface TimeRemaining {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  expired: boolean;
}

export type AuctionRarity = 'Common' | 'Uncommon' | 'Rare' | 'Ultra Rare';

export interface CoinType {
  name: string;
  denom: string;
  basePrice: number;
}

export interface Dealer {
  id: string;
  name: string;
  rep: number;
}

export interface AuctionCoin {
  id: string;
  name: string;
  year: number;
  grade: string;
  price: number;
  rarity: AuctionRarity;
  image: string;
  user_id: string;
  country?: string;
  denomination?: string;
  condition?: string;
  description?: string;
  is_auction?: boolean;
  listing_type?: 'auction' | 'direct_sale';
  auction_end: string;
  reserve_price?: number;
  starting_bid?: number;
  starting_price?: number;
  current_bid: number;
  bid_count?: number;
  seller_id?: string;
  highest_bidder_id?: string | null;
  watchers?: number;
  views?: number;
  authentication_status?: 'pending' | 'verified' | 'rejected';
  featured?: boolean;
  profiles?: {
    id: string;
    name: string;
    reputation: number;
    verified_dealer: boolean;
    avatar_url?: string;
  };
  bids?: Array<{
    id: string;
    amount: number;
    user_id: string;
    created_at: string;
    profiles?: {
      name: string;
    };
  }>;
}
