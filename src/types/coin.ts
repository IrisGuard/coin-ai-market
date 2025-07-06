
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
  | 'unclassified'
  | 'banknotes'
  | 'error_banknotes'
  | 'gold_bullion'
  | 'silver_bullion';

export type BanknoteCondition = 'Poor' | 'Fair' | 'Good' | 'Very Good' | 'Fine' | 'Very Fine' | 'Extremely Fine' | 'About Uncirculated' | 'Uncirculated' | 'Crisp Uncirculated';

export type BullionCondition = 'Poor' | 'Good' | 'Very Good' | 'Excellent' | 'Mint' | 'Sealed';

export type MetalType = 'gold' | 'silver' | 'platinum' | 'palladium';

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

// Banknote interface for frontend use
export interface Banknote {
  id: string;
  name: string;
  description?: string;
  price: number;
  year: number;
  country?: string;
  series?: string;
  denomination?: string;
  condition?: BanknoteCondition;
  grade: string;
  image: string;
  images?: string[];
  obverse_image?: string;
  reverse_image?: string;
  serial_number?: string;
  printer?: string;
  security_features?: string[];
  error_type?: string;
  error_description?: string;
  rarity: Rarity;
  authentication_status?: string;
  category?: CoinCategory;
  user_id: string;
  owner_id?: string;
  seller_id?: string;
  uploaded_by?: string;
  store_id?: string;
  ai_confidence?: number;
  ai_provider?: string;
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
  created_at?: string;
  updated_at?: string;
  profiles?: CoinProfile;
}

// Bullion Bar interface for frontend use  
export interface BullionBar {
  id: string;
  name: string;
  description?: string;
  price: number;
  metal_type: MetalType;
  weight: number; // in troy ounces
  purity: number; // 0.999, 0.9999, etc.
  brand?: string;
  refinery?: string;
  serial_number?: string;
  assay_certificate?: boolean;
  hallmarks?: string[];
  dimensions?: {
    width?: number;
    height?: number; 
    thickness?: number;
  };
  image: string;
  images?: string[];
  obverse_image?: string;
  reverse_image?: string;
  certificate_image?: string;
  condition?: BullionCondition;
  grade: string;
  authentication_status?: string;
  category?: CoinCategory;
  user_id: string;
  owner_id?: string;
  seller_id?: string;
  uploaded_by?: string;
  store_id?: string;
  ai_confidence?: number;
  ai_provider?: string;
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
  created_at?: string;
  updated_at?: string;
  profiles?: CoinProfile;
}

// Supabase raw data types
export interface SupabaseBanknote {
  id: string;
  name: string;
  description?: string;
  price: number;
  year: number;
  country?: string;
  series?: string;
  denomination?: string;
  condition?: string;
  grade: string;
  image: string;
  images?: string[];
  obverse_image?: string;
  reverse_image?: string;
  serial_number?: string;
  printer?: string;
  security_features?: string[];
  error_type?: string;
  error_description?: string;
  rarity: string;
  authentication_status?: string;
  category?: string;
  user_id: string;
  owner_id?: string;
  seller_id?: string;
  uploaded_by?: string;
  store_id?: string;
  ai_confidence?: number;
  ai_provider?: string;
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
  created_at?: string;
  updated_at?: string;
  profiles?: any;
}

export interface SupabaseBullionBar {
  id: string;
  name: string;
  description?: string;
  price: number;
  metal_type: string;
  weight: number;
  purity: number;
  brand?: string;
  refinery?: string;
  serial_number?: string;
  assay_certificate?: boolean;
  hallmarks?: string[];
  dimensions?: any; // JSONB from database
  image: string;
  images?: string[];
  obverse_image?: string;  
  reverse_image?: string;
  certificate_image?: string;
  condition?: string;
  grade: string;
  authentication_status?: string;
  category?: string;
  user_id: string;
  owner_id?: string;
  seller_id?: string;
  uploaded_by?: string;
  store_id?: string;
  ai_confidence?: number;
  ai_provider?: string;
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
  created_at?: string;
  updated_at?: string;
  profiles?: any;
}

// Mapper functions
export const mapSupabaseBanknoteToBanknote = (supabaseBanknote: SupabaseBanknote): Banknote => {
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

  const mapBanknoteCondition = (condition: string): BanknoteCondition | undefined => {
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
      case 'crisp uncirculated': return 'Crisp Uncirculated';
      default: return undefined;
    }
  };

  return {
    ...supabaseBanknote,
    rarity: mapRarity(supabaseBanknote.rarity),
    condition: mapBanknoteCondition(supabaseBanknote.condition || ''),
    category: supabaseBanknote.category as CoinCategory,
    profiles: supabaseBanknote.profiles ? {
      id: supabaseBanknote.profiles.id || '',
      name: supabaseBanknote.profiles.name,
      full_name: supabaseBanknote.profiles.full_name,
      username: supabaseBanknote.profiles.username,
      reputation: supabaseBanknote.profiles.reputation,
      verified_dealer: supabaseBanknote.profiles.verified_dealer,
      avatar_url: supabaseBanknote.profiles.avatar_url
    } : undefined
  };
};

export const mapSupabaseBullionBarToBullionBar = (supabaseBullionBar: SupabaseBullionBar): BullionBar => {
  const mapBullionCondition = (condition: string): BullionCondition | undefined => {
    if (!condition) return undefined;
    switch (condition?.toLowerCase()) {
      case 'poor': return 'Poor';
      case 'good': return 'Good';
      case 'very good': return 'Very Good';
      case 'excellent': return 'Excellent';
      case 'mint': return 'Mint';
      case 'sealed': return 'Sealed';
      default: return 'Mint';
    }
  };

  return {
    ...supabaseBullionBar,
    metal_type: supabaseBullionBar.metal_type as MetalType,
    condition: mapBullionCondition(supabaseBullionBar.condition || ''),
    category: supabaseBullionBar.category as CoinCategory,
    dimensions: supabaseBullionBar.dimensions ? {
      width: supabaseBullionBar.dimensions.width,
      height: supabaseBullionBar.dimensions.height,
      thickness: supabaseBullionBar.dimensions.thickness
    } : undefined,
    profiles: supabaseBullionBar.profiles ? {
      id: supabaseBullionBar.profiles.id || '',
      name: supabaseBullionBar.profiles.name,
      full_name: supabaseBullionBar.profiles.full_name,
      username: supabaseBullionBar.profiles.username,
      reputation: supabaseBullionBar.profiles.reputation,
      verified_dealer: supabaseBullionBar.profiles.verified_dealer,
      avatar_url: supabaseBullionBar.profiles.avatar_url
    } : undefined
  };
};
