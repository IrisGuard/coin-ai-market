
import { createClient } from '@supabase/supabase-js';

// Use hardcoded values instead of environment variables
const supabaseUrl = 'https://saimszsekjafmqqcvcgx.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNhaW1zenNla2phZm1xcWN2Y2d4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDc0MzM4NjcsImV4cCI6MjA2MzAwOTg2N30.o5x0i7u4NJ20RPb9hjBaRsjvDdTw6rwwkc-SDx1Morw';

// Create a singleton Supabase client
export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Remove the hasValidSupabaseCredentials function as we're using hardcoded values
export const hasValidSupabaseCredentials = () => true;

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
      admin_roles: {
        Row: {
          id: string;
          user_id: string;
          role: string;
          created_at: string;
          created_by: string | null;
        };
        Insert: {
          id?: string;
          user_id: string;
          role?: string;
          created_at?: string;
          created_by?: string | null;
        };
        Update: {
          role?: string;
          created_by?: string | null;
        };
      };
      admin_activity_logs: {
        Row: {
          id: string;
          admin_user_id: string;
          action: string;
          target_type: string;
          target_id: string | null;
          details: any | null;
          ip_address: string | null;
          user_agent: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          admin_user_id: string;
          action: string;
          target_type: string;
          target_id?: string | null;
          details?: any | null;
          ip_address?: string | null;
          user_agent?: string | null;
          created_at?: string;
        };
        Update: {
          action?: string;
          target_type?: string;
          target_id?: string | null;
          details?: any | null;
          ip_address?: string | null;
          user_agent?: string | null;
        };
      };
      error_logs: {
        Row: {
          id: string;
          error_type: string;
          message: string;
          stack_trace: string | null;
          user_id: string | null;
          page_url: string | null;
          user_agent: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          error_type: string;
          message: string;
          stack_trace?: string | null;
          user_id?: string | null;
          page_url?: string | null;
          user_agent?: string | null;
          created_at?: string;
        };
        Update: {
          error_type?: string;
          message?: string;
          stack_trace?: string | null;
          user_id?: string | null;
          page_url?: string | null;
          user_agent?: string | null;
        };
      };
      api_keys: {
        Row: {
          id: string;
          key_name: string;
          encrypted_value: string;
          description: string | null;
          is_active: boolean;
          created_by: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          key_name: string;
          encrypted_value: string;
          description?: string | null;
          is_active?: boolean;
          created_by?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          key_name?: string;
          encrypted_value?: string;
          description?: string | null;
          is_active?: boolean;
          created_by?: string | null;
          updated_at?: string;
        };
      };
      system_config: {
        Row: {
          id: string;
          config_key: string;
          config_value: any;
          description: string | null;
          updated_by: string | null;
          updated_at: string;
        };
        Insert: {
          id?: string;
          config_key: string;
          config_value: any;
          description?: string | null;
          updated_by?: string | null;
          updated_at?: string;
        };
        Update: {
          config_key?: string;
          config_value?: any;
          description?: string | null;
          updated_by?: string | null;
          updated_at?: string;
        };
      };
      console_errors: {
        Row: {
          id: string;
          error_level: string;
          message: string;
          source_file: string | null;
          line_number: number | null;
          column_number: number | null;
          user_id: string | null;
          session_id: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          error_level: string;
          message: string;
          source_file?: string | null;
          line_number?: number | null;
          column_number?: number | null;
          user_id?: string | null;
          session_id?: string | null;
          created_at?: string;
        };
        Update: {
          error_level?: string;
          message?: string;
          source_file?: string | null;
          line_number?: number | null;
          column_number?: number | null;
          user_id?: string | null;
          session_id?: string | null;
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
      is_admin: {
        Args: {
          user_id: string;
        };
        Returns: boolean;
      };
      log_admin_activity: {
        Args: {
          action_type: string;
          target_type: string;
          target_id?: string;
          details?: any;
        };
        Returns: void;
      };
      log_error: {
        Args: {
          error_type_param: string;
          message_param: string;
          stack_trace_param?: string;
          page_url_param?: string;
          user_agent_param?: string;
        };
        Returns: string;
      };
      log_console_error: {
        Args: {
          error_level_param: string;
          message_param: string;
          source_file_param?: string;
          line_number_param?: number;
          column_number_param?: number;
          session_id_param?: string;
        };
        Returns: string;
      };
      encrypt_api_key: {
        Args: {
          plain_key: string;
        };
        Returns: string;
      };
      decrypt_api_key: {
        Args: {
          encrypted_key: string;
        };
        Returns: string;
      };
    };
  };
};

// Helper function to get user profile data by ID
export const getUserProfile = async (userId: string) => {
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
  try {
    const { data, error } = await supabase
      .from('marketplace_stats')
      .select('*')
      .single();
      
    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error fetching marketplace stats:', error);
    // Return null instead of mock data to force real data usage
    return null;
  }
};

// Helper function to upload a file to storage
export const uploadFile = async (
  bucket: string,
  path: string,
  file: File
): Promise<string | null> => {
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
