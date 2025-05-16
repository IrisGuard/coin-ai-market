
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
  isAuction?: boolean;
  timeLeft?: string;
  description?: string;
  condition?: CoinCondition;
  country?: string;
  mint?: string;
  diameter?: number; // in mm
  weight?: number; // in grams
  composition?: string;
  seller?: {
    id: string;
    name: string;
    rating: number;
    totalSales?: number;
    avatarUrl?: string;
    reputation?: number;
  };
  obverseImage?: string; // front side
  reverseImage?: string; // back side
  model3d?: string; // URL to 3D model if available
  views?: number;
  favorites?: number;
  featured?: boolean;
  authenticationStatus?: 'pending' | 'verified' | 'rejected';
  tags?: string[];
  bids?: {
    id: string;
    amount: number;
    bidder: string;
    bidderName?: string;
    time: string;
  }[];
  estimatedValue?: {
    min: number;
    max: number;
  };
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
