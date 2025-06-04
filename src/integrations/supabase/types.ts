export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      admin_activity_logs: {
        Row: {
          action: string
          admin_user_id: string
          created_at: string | null
          details: Json | null
          id: string
          ip_address: string | null
          target_id: string | null
          target_type: string
          user_agent: string | null
        }
        Insert: {
          action: string
          admin_user_id: string
          created_at?: string | null
          details?: Json | null
          id?: string
          ip_address?: string | null
          target_id?: string | null
          target_type: string
          user_agent?: string | null
        }
        Update: {
          action?: string
          admin_user_id?: string
          created_at?: string | null
          details?: Json | null
          id?: string
          ip_address?: string | null
          target_id?: string | null
          target_type?: string
          user_agent?: string | null
        }
        Relationships: []
      }
      admin_roles: {
        Row: {
          created_at: string | null
          created_by: string | null
          id: string
          role: string | null
          user_id: string
        }
        Insert: {
          created_at?: string | null
          created_by?: string | null
          id?: string
          role?: string | null
          user_id: string
        }
        Update: {
          created_at?: string | null
          created_by?: string | null
          id?: string
          role?: string | null
          user_id?: string
        }
        Relationships: []
      }
      api_keys: {
        Row: {
          created_at: string | null
          created_by: string | null
          description: string | null
          encrypted_value: string
          id: string
          is_active: boolean | null
          key_name: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          created_by?: string | null
          description?: string | null
          encrypted_value: string
          id?: string
          is_active?: boolean | null
          key_name: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          created_by?: string | null
          description?: string | null
          encrypted_value?: string
          id?: string
          is_active?: boolean | null
          key_name?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      bids: {
        Row: {
          amount: number
          coin_id: string
          created_at: string | null
          id: string
          user_id: string
        }
        Insert: {
          amount: number
          coin_id: string
          created_at?: string | null
          id?: string
          user_id: string
        }
        Update: {
          amount?: number
          coin_id?: string
          created_at?: string | null
          id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "bids_coin_id_fkey"
            columns: ["coin_id"]
            isOneToOne: false
            referencedRelation: "coins"
            referencedColumns: ["id"]
          },
        ]
      }
      coin_evaluations: {
        Row: {
          coin_id: string
          comments: string | null
          created_at: string | null
          estimated_value: number
          expert_id: string | null
          grade: string
          id: string
        }
        Insert: {
          coin_id: string
          comments?: string | null
          created_at?: string | null
          estimated_value: number
          expert_id?: string | null
          grade: string
          id?: string
        }
        Update: {
          coin_id?: string
          comments?: string | null
          created_at?: string | null
          estimated_value?: number
          expert_id?: string | null
          grade?: string
          id?: string
        }
        Relationships: [
          {
            foreignKeyName: "coin_evaluations_coin_id_fkey"
            columns: ["coin_id"]
            isOneToOne: false
            referencedRelation: "coins"
            referencedColumns: ["id"]
          },
        ]
      }
      coins: {
        Row: {
          auction_end: string | null
          authentication_status: string | null
          composition: string | null
          condition: string | null
          country: string | null
          created_at: string | null
          denomination: string | null
          description: string | null
          diameter: number | null
          favorites: number | null
          featured: boolean | null
          grade: string
          id: string
          image: string
          is_auction: boolean | null
          mint: string | null
          mintage: number | null
          model_3d_url: string | null
          name: string
          ngc_grade: string | null
          ngc_number: string | null
          obverse_image: string | null
          pcgs_grade: string | null
          pcgs_number: string | null
          price: number
          rarity: string
          reserve_price: number | null
          reverse_image: string | null
          tags: string[] | null
          updated_at: string | null
          user_id: string
          views: number | null
          weight: number | null
          year: number
        }
        Insert: {
          auction_end?: string | null
          authentication_status?: string | null
          composition?: string | null
          condition?: string | null
          country?: string | null
          created_at?: string | null
          denomination?: string | null
          description?: string | null
          diameter?: number | null
          favorites?: number | null
          featured?: boolean | null
          grade: string
          id?: string
          image: string
          is_auction?: boolean | null
          mint?: string | null
          mintage?: number | null
          model_3d_url?: string | null
          name: string
          ngc_grade?: string | null
          ngc_number?: string | null
          obverse_image?: string | null
          pcgs_grade?: string | null
          pcgs_number?: string | null
          price: number
          rarity: string
          reserve_price?: number | null
          reverse_image?: string | null
          tags?: string[] | null
          updated_at?: string | null
          user_id: string
          views?: number | null
          weight?: number | null
          year: number
        }
        Update: {
          auction_end?: string | null
          authentication_status?: string | null
          composition?: string | null
          condition?: string | null
          country?: string | null
          created_at?: string | null
          denomination?: string | null
          description?: string | null
          diameter?: number | null
          favorites?: number | null
          featured?: boolean | null
          grade?: string
          id?: string
          image?: string
          is_auction?: boolean | null
          mint?: string | null
          mintage?: number | null
          model_3d_url?: string | null
          name?: string
          ngc_grade?: string | null
          ngc_number?: string | null
          obverse_image?: string | null
          pcgs_grade?: string | null
          pcgs_number?: string | null
          price?: number
          rarity?: string
          reserve_price?: number | null
          reverse_image?: string | null
          tags?: string[] | null
          updated_at?: string | null
          user_id?: string
          views?: number | null
          weight?: number | null
          year?: number
        }
        Relationships: []
      }
      console_errors: {
        Row: {
          column_number: number | null
          created_at: string | null
          error_level: string
          id: string
          line_number: number | null
          message: string
          session_id: string | null
          source_file: string | null
          user_id: string | null
        }
        Insert: {
          column_number?: number | null
          created_at?: string | null
          error_level: string
          id?: string
          line_number?: number | null
          message: string
          session_id?: string | null
          source_file?: string | null
          user_id?: string | null
        }
        Update: {
          column_number?: number | null
          created_at?: string | null
          error_level?: string
          id?: string
          line_number?: number | null
          message?: string
          session_id?: string | null
          source_file?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      error_logs: {
        Row: {
          created_at: string | null
          error_type: string
          id: string
          message: string
          page_url: string | null
          stack_trace: string | null
          user_agent: string | null
          user_id: string | null
        }
        Insert: {
          created_at?: string | null
          error_type: string
          id?: string
          message: string
          page_url?: string | null
          stack_trace?: string | null
          user_agent?: string | null
          user_id?: string | null
        }
        Update: {
          created_at?: string | null
          error_type?: string
          id?: string
          message?: string
          page_url?: string | null
          stack_trace?: string | null
          user_agent?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      notifications: {
        Row: {
          action_url: string | null
          created_at: string | null
          id: string
          is_read: boolean | null
          message: string
          related_coin_id: string | null
          type: string
          user_id: string
        }
        Insert: {
          action_url?: string | null
          created_at?: string | null
          id?: string
          is_read?: boolean | null
          message: string
          related_coin_id?: string | null
          type: string
          user_id: string
        }
        Update: {
          action_url?: string | null
          created_at?: string | null
          id?: string
          is_read?: boolean | null
          message?: string
          related_coin_id?: string | null
          type?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "notifications_related_coin_id_fkey"
            columns: ["related_coin_id"]
            isOneToOne: false
            referencedRelation: "coins"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          avatar_url: string | null
          bio: string | null
          created_at: string | null
          email: string | null
          id: string
          location: string | null
          name: string | null
          ngc_member_id: string | null
          pcgs_member_id: string | null
          reputation: number | null
          updated_at: string | null
          verified_dealer: boolean | null
          website: string | null
        }
        Insert: {
          avatar_url?: string | null
          bio?: string | null
          created_at?: string | null
          email?: string | null
          id: string
          location?: string | null
          name?: string | null
          ngc_member_id?: string | null
          pcgs_member_id?: string | null
          reputation?: number | null
          updated_at?: string | null
          verified_dealer?: boolean | null
          website?: string | null
        }
        Update: {
          avatar_url?: string | null
          bio?: string | null
          created_at?: string | null
          email?: string | null
          id?: string
          location?: string | null
          name?: string | null
          ngc_member_id?: string | null
          pcgs_member_id?: string | null
          reputation?: number | null
          updated_at?: string | null
          verified_dealer?: boolean | null
          website?: string | null
        }
        Relationships: []
      }
      system_config: {
        Row: {
          config_key: string
          config_value: Json
          description: string | null
          id: string
          updated_at: string | null
          updated_by: string | null
        }
        Insert: {
          config_key: string
          config_value: Json
          description?: string | null
          id?: string
          updated_at?: string | null
          updated_by?: string | null
        }
        Update: {
          config_key?: string
          config_value?: Json
          description?: string | null
          id?: string
          updated_at?: string | null
          updated_by?: string | null
        }
        Relationships: []
      }
      transactions: {
        Row: {
          amount: number
          buyer_id: string
          coin_id: string
          created_at: string | null
          id: string
          seller_id: string
          status: string | null
          stripe_payment_intent_id: string | null
          transaction_type: string | null
        }
        Insert: {
          amount: number
          buyer_id: string
          coin_id: string
          created_at?: string | null
          id?: string
          seller_id: string
          status?: string | null
          stripe_payment_intent_id?: string | null
          transaction_type?: string | null
        }
        Update: {
          amount?: number
          buyer_id?: string
          coin_id?: string
          created_at?: string | null
          id?: string
          seller_id?: string
          status?: string | null
          stripe_payment_intent_id?: string | null
          transaction_type?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "transactions_coin_id_fkey"
            columns: ["coin_id"]
            isOneToOne: false
            referencedRelation: "coins"
            referencedColumns: ["id"]
          },
        ]
      }
      user_favorites: {
        Row: {
          coin_id: string
          created_at: string | null
          id: string
          user_id: string
        }
        Insert: {
          coin_id: string
          created_at?: string | null
          id?: string
          user_id: string
        }
        Update: {
          coin_id?: string
          created_at?: string | null
          id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_favorites_coin_id_fkey"
            columns: ["coin_id"]
            isOneToOne: false
            referencedRelation: "coins"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DefaultSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
