
export interface TimeRemaining {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  expired: boolean;
}

export interface AuctionCoin {
  id: string;
  name: string;
  year: number;
  grade: string;
  price: number;
  rarity: string;
  image: string;
  user_id: string;
  country?: string;
  denomination?: string;
  condition?: string;
  description?: string;
  is_auction?: boolean;
  listing_type?: 'auction' | 'direct_sale';
  auction_end?: string;
  reserve_price?: number;
  starting_bid?: number;
  current_bid?: number;
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
