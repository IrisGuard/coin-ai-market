
export type AuctionRarity = 'Common' | 'Uncommon' | 'Rare' | 'Ultra Rare';

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
  rarity: AuctionRarity;
  image: string;
  country: string;
  denomination: string;
  condition: string;
  description: string;
  price: number;
  user_id: string;
  starting_price: number;
  current_bid: number;
  reserve_price: number;
  auction_end: string;
  bid_count: number;
  seller_id: string;
  highest_bidder_id: string | null;
  watchers: number;
  views: number;
  is_auction: boolean;
  listing_type: string;
  authentication_status: 'verified';
  featured: boolean;
  profiles: {
    id: string;
    name: string;
    reputation: number;
    verified_dealer: boolean;
    avatar_url: string;
  };
}

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
