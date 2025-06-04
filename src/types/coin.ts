
export type Rarity = 'Common' | 'Uncommon' | 'Rare' | 'Ultra Rare';

export type CoinCondition = 'Mint' | 'Near Mint' | 'Excellent' | 'Good' | 'Fair' | 'Poor';

export interface Coin {
  id: string;
  name: string;
  year: number;
  grade: string;
  price: number;
  rarity: Rarity;
  image: string;
  user_id: string;
  country?: string;
  denomination?: string;
  pcgs_number?: string;
  ngc_number?: string;
  pcgs_grade?: string;
  ngc_grade?: string;
  condition?: CoinCondition;
  composition?: string;
  diameter?: number;
  weight?: number;
  mint?: string;
  mintage?: number;
  description?: string;
  obverse_image?: string;
  reverse_image?: string;
  model_3d_url?: string;
  tags?: string[];
  views?: number;
  favorites?: number;
  featured?: boolean;
  authentication_status?: 'pending' | 'verified' | 'rejected';
  is_auction?: boolean;
  auction_end?: string;
  reserve_price?: number;
  created_at?: string;
  updated_at?: string;
  profiles?: {
    id: string;
    name: string;
    reputation: number;
    verified_dealer?: boolean;
    avatar_url?: string;
  };
  bids?: {
    id: string;
    amount: number;
    user_id: string;
    created_at: string;
    profiles?: {
      name: string;
    };
  }[];
}

export interface CoinEvaluation {
  id: string;
  coinId: string;
  expertId: string;
  expertName?: string;
  grade: string;
  estimatedValue: number;
  comments?: string;
  createdAt: string;
}

export interface CoinTransaction {
  id: string;
  coinId: string;
  sellerId: string;
  buyerId: string;
  amount: number;
  status: 'pending' | 'completed' | 'cancelled' | 'refunded';
  createdAt: string;
  transactionType: 'purchase' | 'auction';
}
