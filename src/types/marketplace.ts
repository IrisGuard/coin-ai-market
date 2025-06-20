
export interface StoreProfile {
  id: string;
  full_name?: string;
  email?: string;
  avatar_url?: string;
  verified_dealer?: boolean;
  rating?: number;
  username?: string;
  bio?: string;
  location?: string;
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
  bank_name?: string;
  iban?: string;
  bitcoin_wallet_address?: string;
  ethereum_wallet_address?: string;
  profiles?: StoreProfile; // Single object, not array
}

export interface MarketplaceStats {
  registered_users: number;
  listed_coins: number;
  active_auctions: number;
  total_volume: number;
}
