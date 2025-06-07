
export interface AuctionCoin {
  id: string;
  name: string;
  year: number;
  image: string;
  starting_price: number;
  current_bid: number;
  reserve_price: number;
  auction_end: string;
  bid_count: number;
  rarity: string;
  condition: string;
  country: string;
  seller_id: string;
  highest_bidder_id: string | null;
  description: string;
  views: number;
  watchers: number;
  profiles?: {
    name: string;
    reputation: number;
    verified_dealer: boolean;
  } | null;
}

export interface Bid {
  id: string;
  auction_id: string;
  bidder_id: string;
  amount: number;
  created_at: string;
  profiles?: {
    name: string;
  } | null;
}
