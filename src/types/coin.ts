
export type Rarity = 'Common' | 'Uncommon' | 'Rare' | 'Ultra Rare' | 'Legendary';

export type CoinCondition = 'Poor' | 'Fair' | 'Good' | 'Very Good' | 'Fine' | 'Very Fine' | 'Extremely Fine' | 'About Uncirculated' | 'Uncirculated' | 'Proof';

export type CoinCategory = 
  | 'ancient'
  | 'modern' 
  | 'error_coin'
  | 'greek'
  | 'american'
  | 'british'
  | 'european'
  | 'asian'
  | 'gold'
  | 'silver'
  | 'commemorative'
  | 'unclassified';

export interface CoinProfile {
  id: string;
  name?: string;
  full_name?: string;
  username?: string;
  reputation?: number;
  verified_dealer?: boolean;
  avatar_url?: string;
}

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
  condition?: CoinCondition;
  image: string;
  images?: string[]; // Multi-image support
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
  profiles?: CoinProfile;
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
  images?: string[]; // Multi-image support
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
  profiles?: any;
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

  // Map string condition to proper CoinCondition type
  const mapCondition = (condition: string): CoinCondition | undefined => {
    if (!condition) return undefined;
    switch (condition?.toLowerCase()) {
      case 'poor': return 'Poor';
      case 'fair': return 'Fair';
      case 'good': return 'Good';
      case 'very good': return 'Very Good';
      case 'fine': return 'Fine';
      case 'very fine': return 'Very Fine';
      case 'extremely fine': return 'Extremely Fine';
      case 'about uncirculated': return 'About Uncirculated';
      case 'uncirculated': return 'Uncirculated';
      case 'proof': return 'Proof';
      default: return undefined;
    }
  };

  return {
    ...supabaseCoin,
    rarity: mapRarity(supabaseCoin.rarity),
    condition: mapCondition(supabaseCoin.condition || ''),
    category: supabaseCoin.category as CoinCategory,
    profiles: supabaseCoin.profiles ? {
      id: supabaseCoin.profiles.id || '',
      name: supabaseCoin.profiles.name,
      full_name: supabaseCoin.profiles.full_name,
      username: supabaseCoin.profiles.username,
      reputation: supabaseCoin.profiles.reputation,
      verified_dealer: supabaseCoin.profiles.verified_dealer,
      avatar_url: supabaseCoin.profiles.avatar_url
    } : undefined
  };
};
