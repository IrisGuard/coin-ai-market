
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('Missing Supabase environment variables. Please set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY.');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export type Database = {
  public: {
    Tables: {
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
    };
  };
};
