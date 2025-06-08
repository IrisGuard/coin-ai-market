
export type Rarity = 'Common' | 'Uncommon' | 'Rare' | 'Ultra Rare' | 'Legendary';

export type CoinCategory = 
  | 'ancient'
  | 'modern' 
  | 'error_coin'
  | 'graded'
  | 'greek'
  | 'american'
  | 'british'
  | 'european'
  | 'asian'
  | 'gold'
  | 'silver'
  | 'unclassified';

export interface Coin {
  id: string;
  name: string;
  description?: string;
  price: number;
  year: number;
  country?: string;
  denomination?: string;
  composition?: string;
  weight?: number;
  diameter?: number;
  mintage?: number;
  rarity: Rarity;
  grade: string;
  condition?: string;
  image: string;
  obverse_image?: string;
  reverse_image?: string;
  model_3d_url?: string;
  pcgs_grade?: string;
  ngc_grade?: string;
  pcgs_number?: string;
  ngc_number?: string;
  mint?: string;
  tags?: string[];
  views?: number;
  favorites?: number;
  featured?: boolean;
  is_auction?: boolean;
  auction_end?: string;
  starting_bid?: number;
  reserve_price?: number;
  sold?: boolean;
  sold_at?: string;
  listing_type?: string;
  authentication_status?: string;
  category?: CoinCategory;
  user_id: string;
  owner_id?: string;
  seller_id?: string;
  uploaded_by?: string;
  store_id?: string;
  ai_confidence?: number;
  ai_provider?: string;
  created_at?: string;
  updated_at?: string;
}

// Supabase raw data type (more flexible)
export interface SupabaseCoin {
  id: string;
  name: string;
  description?: string;
  price: number;
  year: number;
  country?: string;
  denomination?: string;
  composition?: string;
  weight?: number;
  diameter?: number;
  mintage?: number;
  rarity: string; // This comes as string from Supabase
  grade: string;
  condition?: string;
  image: string;
  obverse_image?: string;
  reverse_image?: string;
  model_3d_url?: string;
  pcgs_grade?: string;
  ngc_grade?: string;
  pcgs_number?: string;
  ngc_number?: string;
  mint?: string;
  tags?: string[];
  views?: number;
  favorites?: number;
  featured?: boolean;
  is_auction?: boolean;
  auction_end?: string;
  starting_bid?: number;
  reserve_price?: number;
  sold?: boolean;
  sold_at?: string;
  listing_type?: string;
  authentication_status?: string;
  category?: string;
  user_id: string;
  owner_id?: string;
  seller_id?: string;
  uploaded_by?: string;
  store_id?: string;
  ai_confidence?: number;
  ai_provider?: string;
  created_at?: string;
  updated_at?: string;
}

// Utility function to convert Supabase data to Coin interface
export const mapSupabaseCoinToCoin = (supabaseCoin: SupabaseCoin): Coin => {
  // Map string rarity to proper Rarity type
  const mapRarity = (rarity: string): Rarity => {
    switch (rarity?.toLowerCase()) {
      case 'common': return 'Common';
      case 'uncommon': return 'Uncommon';
      case 'rare': return 'Rare';
      case 'ultra rare': return 'Ultra Rare';
      case 'legendary': return 'Legendary';
      default: return 'Common';
    }
  };

  return {
    ...supabaseCoin,
    rarity: mapRarity(supabaseCoin.rarity),
    category: supabaseCoin.category as CoinCategory
  };
};
