import { createClient } from '@supabase/supabase-js';

// Get environment variables
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://placeholder-project.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'placeholder-key';

// Create a singleton Supabase client
export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Add a simple function to check if we have real credentials
export const hasValidSupabaseCredentials = () => {
  return import.meta.env.VITE_SUPABASE_URL && 
         import.meta.env.VITE_SUPABASE_URL !== 'https://placeholder-project.supabase.co' &&
         import.meta.env.VITE_SUPABASE_ANON_KEY && 
         import.meta.env.VITE_SUPABASE_ANON_KEY !== 'placeholder-key';
};

export type Database = {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          email: string | null;
          name: string | null;
          avatar_url: string | null;
          bio: string | null;
          location: string | null;
          website: string | null;
          reputation: number;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          email?: string | null;
          name?: string | null;
          avatar_url?: string | null;
          bio?: string | null;
          location?: string | null;
          website?: string | null;
          reputation?: number;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          email?: string | null;
          name?: string | null;
          avatar_url?: string | null;
          bio?: string | null;
          location?: string | null;
          website?: string | null;
          reputation?: number;
          updated_at?: string;
        };
      };
      coins: {
        Row: {
          id: string;
          name: string;
          year: number;
          grade: string;
          price: number;
          rarity: string;
          image: string;
          description?: string;
          condition?: string;
          country?: string;
          mint?: string;
          diameter?: number;
          weight?: number;
          composition?: string;
          created_at: string;
          user_id: string;
          is_auction: boolean;
          auction_end?: string;
          views: number;
          favorites: number;
          obverse_image?: string;
          reverse_image?: string;
          model_3d_url?: string;
          authentication_status: string;
          featured: boolean;
          tags?: string[];
        };
        Insert: {
          id?: string;
          name: string;
          year: number;
          grade: string;
          price: number;
          rarity: string;
          image: string;
          description?: string;
          condition?: string;
          country?: string;
          mint?: string;
          diameter?: number;
          weight?: number;
          composition?: string;
          created_at?: string;
          user_id: string;
          is_auction?: boolean;
          auction_end?: string;
          views?: number;
          favorites?: number;
          obverse_image?: string;
          reverse_image?: string;
          model_3d_url?: string;
          authentication_status?: string;
          featured?: boolean;
          tags?: string[];
        };
        Update: {
          name?: string;
          year?: number;
          grade?: string;
          price?: number;
          rarity?: string;
          image?: string;
          description?: string;
          condition?: string;
          country?: string;
          mint?: string;
          diameter?: number;
          weight?: number;
          composition?: string;
          is_auction?: boolean;
          auction_end?: string;
          views?: number;
          favorites?: number;
          obverse_image?: string;
          reverse_image?: string;
          model_3d_url?: string;
          authentication_status?: string;
          featured?: boolean;
          tags?: string[];
        };
      };
      bids: {
        Row: {
          id: string;
          coin_id: string;
          user_id: string;
          amount: number;
          created_at: string;
        };
        Insert: {
          id?: string;
          coin_id: string;
          user_id: string;
          amount: number;
          created_at?: string;
        };
        Update: {
          amount?: number;
        };
      };
      user_favorites: {
        Row: {
          id: string;
          user_id: string;
          coin_id: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          coin_id: string;
          created_at?: string;
        };
        Update: {
          user_id?: string;
          coin_id?: string;
        };
      };
      notifications: {
        Row: {
          id: string;
          user_id: string;
          message: string;
          type: string;
          is_read: boolean;
          created_at: string;
          related_coin_id?: string;
          action_url?: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          message: string;
          type: string;
          is_read?: boolean;
          created_at?: string;
          related_coin_id?: string;
          action_url?: string;
        };
        Update: {
          is_read?: boolean;
        };
      };
      transactions: {
        Row: {
          id: string;
          coin_id: string;
          seller_id: string;
          buyer_id: string;
          amount: number;
          status: string;
          created_at: string;
          transaction_type: string;
        };
        Insert: {
          id?: string;
          coin_id: string;
          seller_id: string;
          buyer_id: string;
          amount: number;
          status?: string;
          created_at?: string;
          transaction_type?: string;
        };
        Update: {
          status?: string;
        };
      };
      coin_evaluations: {
        Row: {
          id: string;
          coin_id: string;
          expert_id: string;
          grade: string;
          estimated_value: number;
          comments?: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          coin_id: string;
          expert_id: string;
          grade: string;
          estimated_value: number;
          comments?: string;
          created_at?: string;
        };
        Update: {
          grade?: string;
          estimated_value?: number;
          comments?: string;
        };
      };
    };
    Views: {
      marketplace_stats: {
        Row: {
          listed_coins: number;
          active_auctions: number;
          registered_users: number;
          total_volume: number;
          weekly_transactions: number;
        };
      };
    };
    Functions: {
      generate_presigned_url: {
        Args: {
          bucket_name: string;
          file_name: string;
        };
        Returns: string;
      };
      check_auction_end: {
        Args: Record<string, never>;
        Returns: void;
      };
    };
  };
};

// Helper function to get user profile data by ID
export const getUserProfile = async (userId: string) => {
  if (!hasValidSupabaseCredentials()) return null;
  
  try {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single();
      
    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error fetching user profile:', error);
    return null;
  }
};

// Helper function to get marketplace statistics
export const getMarketplaceStats = async () => {
  if (!hasValidSupabaseCredentials()) {
    return {
      listed_coins: 1245,
      active_auctions: 126,
      registered_users: 45729,
      total_volume: 1200000,
      weekly_transactions: 342
    };
  }
  
  try {
    const { data, error } = await supabase
      .from('marketplace_stats')
      .select('*')
      .single();
      
    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error fetching marketplace stats:', error);
    return {
      listed_coins: 1245,
      active_auctions: 126,
      registered_users: 45729,
      total_volume: 1200000,
      weekly_transactions: 342
    };
  }
};

// Helper function to upload a file to storage
export const uploadFile = async (
  bucket: string,
  path: string,
  file: File
): Promise<string | null> => {
  if (!hasValidSupabaseCredentials()) {
    console.warn('Cannot upload file without valid Supabase credentials');
    return null;
  }
  
  try {
    const { data, error } = await supabase.storage
      .from(bucket)
      .upload(path, file, {
        cacheControl: '3600',
        upsert: true
      });
      
    if (error) throw error;
    
    // Get public URL
    const { data: urlData } = supabase.storage
      .from(bucket)
      .getPublicUrl(data.path);
      
    return urlData.publicUrl;
  } catch (error) {
    console.error('Error uploading file:', error);
    return null;
  }
};

// Export the typed Supabase client
export type SupabaseClient = typeof supabase;
