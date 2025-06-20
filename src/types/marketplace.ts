
export interface StoreProfile {
  id: string;
  full_name?: string;
  email?: string;
  avatar_url?: string;
  verified_dealer?: boolean;
  rating?: number;
}

export interface MarketplaceStore {
  id: string;
  name: string;
  description?: string;
  logo_url?: string;
  address?: any;
  verified: boolean;
  created_at: string;
  updated_at: string;
  user_id: string;
  is_active: boolean;
  email?: string;
  phone?: string;
  website?: string;
  shipping_options?: any;
  profiles?: StoreProfile; // Changed from StoreProfile[] to StoreProfile
}

export interface MarketplaceStats {
  registered_users: number;
  listed_coins: number;
  active_auctions: number;
  total_volume: number;
}
