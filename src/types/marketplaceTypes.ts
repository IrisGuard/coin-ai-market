
export interface ListingFilters {
  category?: string;
  price_min?: number;
  price_max?: number;
  year_min?: number;
  year_max?: number;
  condition?: string;
  rarity?: string;
  listing_type?: 'auction' | 'fixed_price' | 'best_offer';
  sort_by?: 'price_asc' | 'price_desc' | 'newest' | 'oldest' | 'ending_soon' | 'most_watched';
  search_query?: string;
}

export interface MarketplaceListing {
  id: string;
  coin_id: string;
  seller_id: string;
  listing_type: 'auction' | 'fixed_price' | 'best_offer';
  starting_price: number;
  current_price: number;
  buyout_price?: number;
  ends_at?: string;
  auto_extend: boolean;
  shipping_cost: number;
  international_shipping: boolean;
  return_policy?: string;
  status: 'active' | 'sold' | 'cancelled' | 'expired';
  created_at: string;
  updated_at: string;
  coins?: {
    id: string;
    name: string;
    image: string;
    year: number;
    grade: string;
    rarity: string;
    condition?: string;
    category: string;
    views?: number;
  };
}

export interface WishlistItem {
  id: string;
  user_id: string;
  coin_id: string;
  created_at: string;
  coins?: {
    id: string;
    name: string;
    image: string;
    price: number;
    year: number;
    grade: string;
    rarity: string;
    condition?: string;
    category: string;
    views?: number;
    is_auction: boolean;
  };
}

export interface MarketplaceNotification {
  id: string;
  user_id: string;
  type: 'bid_placed' | 'auction_won' | 'auction_ended' | 'price_drop' | 'new_listing' | 'wishlist_available';
  message: string;
  action_url?: string;
  is_read: boolean;
  created_at: string;
  related_coin_id?: string;
}

export interface BidHistory {
  id: string;
  listing_id: string;
  bidder_id: string;
  amount: number;
  auto_bid_max?: number;
  is_winning: boolean;
  created_at: string;
}

export interface MarketplaceAnalytics {
  total_listings: number;
  active_auctions: number;
  total_value: number;
  average_price: number;
  trending_categories: string[];
  sales_by_month: {
    month: string;
    sales: number;
    revenue: number;
  }[];
  category_performance: {
    category: string;
    count: number;
    value: number;
  }[];
}

export interface CoinComparison {
  coins: Array<{
    id: string;
    name: string;
    image: string;
    price: number;
    year: number;
    grade: string;
    rarity: string;
    condition?: string;
    views?: number;
    category: string;
  }>;
  insights: {
    highest_price: string;
    oldest_coin: string;
    most_popular: string;
    best_value?: string;
  };
}

export interface SearchSuggestion {
  text: string;
  type: 'coin' | 'category' | 'year' | 'grade' | 'country';
  count?: number;
  icon?: string;
}

export interface MarketplaceTrend {
  category: string;
  trend_direction: 'up' | 'down' | 'stable';
  percentage_change: number;
  period: 'daily' | 'weekly' | 'monthly';
  sample_size: number;
}

export interface UserPreferences {
  preferred_categories: string[];
  price_range: {
    min: number;
    max: number;
  };
  notification_settings: {
    price_drops: boolean;
    auction_endings: boolean;
    new_listings: boolean;
    outbid_alerts: boolean;
  };
  display_settings: {
    items_per_page: number;
    default_sort: string;
    show_sold_items: boolean;
  };
}

export interface SellerProfile {
  id: string;
  user_id: string;
  store_name: string;
  description?: string;
  rating: number;
  total_sales: number;
  member_since: string;
  verification_status: 'verified' | 'pending' | 'unverified';
  response_time: string;
  shipping_locations: string[];
  return_policy: string;
  payment_methods: string[];
}
