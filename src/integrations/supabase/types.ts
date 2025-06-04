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
      api_key_categories: {
        Row: {
          created_at: string
          description: string | null
          icon: string | null
          id: string
          name: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          icon?: string | null
          id?: string
          name: string
        }
        Update: {
          created_at?: string
          description?: string | null
          icon?: string | null
          id?: string
          name?: string
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
      coin_data_cache: {
        Row: {
          cached_data: Json
          coin_identifier: string
          expires_at: string | null
          id: string
          last_updated: string
          source_name: string
        }
        Insert: {
          cached_data: Json
          coin_identifier: string
          expires_at?: string | null
          id?: string
          last_updated?: string
          source_name: string
        }
        Update: {
          cached_data?: Json
          coin_identifier?: string
          expires_at?: string | null
          id?: string
          last_updated?: string
          source_name?: string
        }
        Relationships: []
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
      data_sources: {
        Row: {
          config: Json | null
          created_at: string
          id: string
          is_active: boolean | null
          last_used: string | null
          name: string
          priority: number | null
          rate_limit: number | null
          success_rate: number | null
          type: string | null
          url: string
        }
        Insert: {
          config?: Json | null
          created_at?: string
          id?: string
          is_active?: boolean | null
          last_used?: string | null
          name: string
          priority?: number | null
          rate_limit?: number | null
          success_rate?: number | null
          type?: string | null
          url: string
        }
        Update: {
          config?: Json | null
          created_at?: string
          id?: string
          is_active?: boolean | null
          last_used?: string | null
          name?: string
          priority?: number | null
          rate_limit?: number | null
          success_rate?: number | null
          type?: string | null
          url?: string
        }
        Relationships: []
      }
      error_coins_knowledge: {
        Row: {
          ai_detection_markers: Json | null
          common_mistakes: string[] | null
          created_at: string
          description: string
          error_category: string
          error_name: string
          error_type: string
          id: string
          identification_techniques: string[] | null
          rarity_score: number | null
          reference_links: string[] | null
          severity_level: number | null
          technical_specifications: Json | null
          updated_at: string
        }
        Insert: {
          ai_detection_markers?: Json | null
          common_mistakes?: string[] | null
          created_at?: string
          description: string
          error_category: string
          error_name: string
          error_type: string
          id?: string
          identification_techniques?: string[] | null
          rarity_score?: number | null
          reference_links?: string[] | null
          severity_level?: number | null
          technical_specifications?: Json | null
          updated_at?: string
        }
        Update: {
          ai_detection_markers?: Json | null
          common_mistakes?: string[] | null
          created_at?: string
          description?: string
          error_category?: string
          error_name?: string
          error_type?: string
          id?: string
          identification_techniques?: string[] | null
          rarity_score?: number | null
          reference_links?: string[] | null
          severity_level?: number | null
          technical_specifications?: Json | null
          updated_at?: string
        }
        Relationships: []
      }
      error_coins_market_data: {
        Row: {
          created_at: string
          data_confidence: number | null
          grade: string
          id: string
          knowledge_base_id: string | null
          last_sale_price: number | null
          market_trend: string | null
          market_value_avg: number | null
          market_value_high: number | null
          market_value_low: number | null
          premium_percentage: number | null
          source_references: string[] | null
          static_coin_id: string | null
          updated_at: string
        }
        Insert: {
          created_at?: string
          data_confidence?: number | null
          grade: string
          id?: string
          knowledge_base_id?: string | null
          last_sale_price?: number | null
          market_trend?: string | null
          market_value_avg?: number | null
          market_value_high?: number | null
          market_value_low?: number | null
          premium_percentage?: number | null
          source_references?: string[] | null
          static_coin_id?: string | null
          updated_at?: string
        }
        Update: {
          created_at?: string
          data_confidence?: number | null
          grade?: string
          id?: string
          knowledge_base_id?: string | null
          last_sale_price?: number | null
          market_trend?: string | null
          market_value_avg?: number | null
          market_value_high?: number | null
          market_value_low?: number | null
          premium_percentage?: number | null
          source_references?: string[] | null
          static_coin_id?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "error_coins_market_data_knowledge_base_id_fkey"
            columns: ["knowledge_base_id"]
            isOneToOne: false
            referencedRelation: "error_coins_knowledge"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "error_coins_market_data_static_coin_id_fkey"
            columns: ["static_coin_id"]
            isOneToOne: false
            referencedRelation: "static_coins_db"
            referencedColumns: ["id"]
          },
        ]
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
      error_reference_sources: {
        Row: {
          created_at: string
          id: string
          is_active: boolean | null
          last_scraped: string | null
          reliability_score: number | null
          scraping_config: Json | null
          source_name: string
          source_type: string
          source_url: string
        }
        Insert: {
          created_at?: string
          id?: string
          is_active?: boolean | null
          last_scraped?: string | null
          reliability_score?: number | null
          scraping_config?: Json | null
          source_name: string
          source_type: string
          source_url: string
        }
        Update: {
          created_at?: string
          id?: string
          is_active?: boolean | null
          last_scraped?: string | null
          reliability_score?: number | null
          scraping_config?: Json | null
          source_name?: string
          source_type?: string
          source_url?: string
        }
        Relationships: []
      }
      external_price_sources: {
        Row: {
          base_url: string
          category_id: string | null
          created_at: string
          id: string
          is_active: boolean | null
          market_focus: string[] | null
          priority_score: number | null
          rate_limit_per_hour: number | null
          region_id: string | null
          reliability_score: number | null
          requires_proxy: boolean | null
          scraping_enabled: boolean | null
          source_name: string
          source_type: string
          supported_currencies: string[] | null
          template_id: string | null
        }
        Insert: {
          base_url: string
          category_id?: string | null
          created_at?: string
          id?: string
          is_active?: boolean | null
          market_focus?: string[] | null
          priority_score?: number | null
          rate_limit_per_hour?: number | null
          region_id?: string | null
          reliability_score?: number | null
          requires_proxy?: boolean | null
          scraping_enabled?: boolean | null
          source_name: string
          source_type: string
          supported_currencies?: string[] | null
          template_id?: string | null
        }
        Update: {
          base_url?: string
          category_id?: string | null
          created_at?: string
          id?: string
          is_active?: boolean | null
          market_focus?: string[] | null
          priority_score?: number | null
          rate_limit_per_hour?: number | null
          region_id?: string | null
          reliability_score?: number | null
          requires_proxy?: boolean | null
          scraping_enabled?: boolean | null
          source_name?: string
          source_type?: string
          supported_currencies?: string[] | null
          template_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "external_price_sources_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "source_categories"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "external_price_sources_region_id_fkey"
            columns: ["region_id"]
            isOneToOne: false
            referencedRelation: "geographic_regions"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "external_price_sources_template_id_fkey"
            columns: ["template_id"]
            isOneToOne: false
            referencedRelation: "source_templates"
            referencedColumns: ["id"]
          },
        ]
      }
      geographic_regions: {
        Row: {
          code: string
          continent: string | null
          created_at: string
          id: string
          name: string
        }
        Insert: {
          code: string
          continent?: string | null
          created_at?: string
          id?: string
          name: string
        }
        Update: {
          code?: string
          continent?: string | null
          created_at?: string
          id?: string
          name?: string
        }
        Relationships: []
      }
      marketplace_stats: {
        Row: {
          active_auctions: number | null
          created_at: string
          id: string
          listed_coins: number | null
          registered_users: number | null
          total_volume: number | null
          updated_at: string
          weekly_transactions: number | null
        }
        Insert: {
          active_auctions?: number | null
          created_at?: string
          id?: string
          listed_coins?: number | null
          registered_users?: number | null
          total_volume?: number | null
          updated_at?: string
          weekly_transactions?: number | null
        }
        Update: {
          active_auctions?: number | null
          created_at?: string
          id?: string
          listed_coins?: number | null
          registered_users?: number | null
          total_volume?: number | null
          updated_at?: string
          weekly_transactions?: number | null
        }
        Relationships: []
      }
      marketplace_tenants: {
        Row: {
          created_at: string
          domain: string
          id: string
          is_active: boolean | null
          name: string
          settings: Json | null
          updated_at: string
        }
        Insert: {
          created_at?: string
          domain: string
          id?: string
          is_active?: boolean | null
          name: string
          settings?: Json | null
          updated_at?: string
        }
        Update: {
          created_at?: string
          domain?: string
          id?: string
          is_active?: boolean | null
          name?: string
          settings?: Json | null
          updated_at?: string
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
      scraping_jobs: {
        Row: {
          completed_at: string | null
          created_at: string
          id: string
          job_type: string
          proxy_id: string | null
          result: Json | null
          source_id: string | null
          started_at: string | null
          status: string | null
          target_url: string
        }
        Insert: {
          completed_at?: string | null
          created_at?: string
          id?: string
          job_type: string
          proxy_id?: string | null
          result?: Json | null
          source_id?: string | null
          started_at?: string | null
          status?: string | null
          target_url: string
        }
        Update: {
          completed_at?: string | null
          created_at?: string
          id?: string
          job_type?: string
          proxy_id?: string | null
          result?: Json | null
          source_id?: string | null
          started_at?: string | null
          status?: string | null
          target_url?: string
        }
        Relationships: [
          {
            foreignKeyName: "scraping_jobs_proxy_id_fkey"
            columns: ["proxy_id"]
            isOneToOne: false
            referencedRelation: "vpn_proxies"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "scraping_jobs_source_id_fkey"
            columns: ["source_id"]
            isOneToOne: false
            referencedRelation: "data_sources"
            referencedColumns: ["id"]
          },
        ]
      }
      source_categories: {
        Row: {
          created_at: string
          description: string | null
          icon: string | null
          id: string
          name: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          icon?: string | null
          id?: string
          name: string
        }
        Update: {
          created_at?: string
          description?: string | null
          icon?: string | null
          id?: string
          name?: string
        }
        Relationships: []
      }
      source_performance_metrics: {
        Row: {
          avg_response_time: number | null
          created_at: string
          data_quality_score: number | null
          date: string
          id: string
          source_id: string | null
          success_rate: number | null
        }
        Insert: {
          avg_response_time?: number | null
          created_at?: string
          data_quality_score?: number | null
          date?: string
          id?: string
          source_id?: string | null
          success_rate?: number | null
        }
        Update: {
          avg_response_time?: number | null
          created_at?: string
          data_quality_score?: number | null
          date?: string
          id?: string
          source_id?: string | null
          success_rate?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "source_performance_metrics_source_id_fkey"
            columns: ["source_id"]
            isOneToOne: false
            referencedRelation: "external_price_sources"
            referencedColumns: ["id"]
          },
        ]
      }
      source_templates: {
        Row: {
          created_at: string
          default_config: Json | null
          description: string | null
          id: string
          name: string
          supported_features: string[] | null
          template_config: Json | null
        }
        Insert: {
          created_at?: string
          default_config?: Json | null
          description?: string | null
          id?: string
          name: string
          supported_features?: string[] | null
          template_config?: Json | null
        }
        Update: {
          created_at?: string
          default_config?: Json | null
          description?: string | null
          id?: string
          name?: string
          supported_features?: string[] | null
          template_config?: Json | null
        }
        Relationships: []
      }
      static_coins_db: {
        Row: {
          composition: string | null
          country: string | null
          created_at: string
          denomination: string | null
          diameter: number | null
          id: string
          mint: string | null
          name: string
          reference_data: Json | null
          weight: number | null
          year: number | null
        }
        Insert: {
          composition?: string | null
          country?: string | null
          created_at?: string
          denomination?: string | null
          diameter?: number | null
          id?: string
          mint?: string | null
          name: string
          reference_data?: Json | null
          weight?: number | null
          year?: number | null
        }
        Update: {
          composition?: string | null
          country?: string | null
          created_at?: string
          denomination?: string | null
          diameter?: number | null
          id?: string
          mint?: string | null
          name?: string
          reference_data?: Json | null
          weight?: number | null
          year?: number | null
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
      vpn_proxies: {
        Row: {
          config: Json | null
          country_code: string
          created_at: string
          id: string
          is_active: boolean | null
          last_used: string | null
          name: string
          success_rate: number | null
          type: string | null
        }
        Insert: {
          config?: Json | null
          country_code: string
          created_at?: string
          id?: string
          is_active?: boolean | null
          last_used?: string | null
          name: string
          success_rate?: number | null
          type?: string | null
        }
        Update: {
          config?: Json | null
          country_code?: string
          created_at?: string
          id?: string
          is_active?: boolean | null
          last_used?: string | null
          name?: string
          success_rate?: number | null
          type?: string | null
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      get_tenant_from_domain: {
        Args: { domain_name: string }
        Returns: string
      }
      set_tenant_context: {
        Args: { tenant_uuid: string }
        Returns: undefined
      }
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
