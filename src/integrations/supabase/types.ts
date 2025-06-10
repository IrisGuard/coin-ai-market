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
      aggregated_coin_prices: {
        Row: {
          avg_price: number
          coin_identifier: string
          confidence_level: number | null
          date_range: string
          grade: string | null
          id: string
          last_updated: string
          max_price: number
          min_price: number
          price_sources: string[] | null
          price_trend: string | null
          sample_size: number | null
          source_count: number
          trend_percentage: number | null
        }
        Insert: {
          avg_price?: number
          coin_identifier: string
          confidence_level?: number | null
          date_range?: string
          grade?: string | null
          id?: string
          last_updated?: string
          max_price?: number
          min_price?: number
          price_sources?: string[] | null
          price_trend?: string | null
          sample_size?: number | null
          source_count?: number
          trend_percentage?: number | null
        }
        Update: {
          avg_price?: number
          coin_identifier?: string
          confidence_level?: number | null
          date_range?: string
          grade?: string | null
          id?: string
          last_updated?: string
          max_price?: number
          min_price?: number
          price_sources?: string[] | null
          price_trend?: string | null
          sample_size?: number | null
          source_count?: number
          trend_percentage?: number | null
        }
        Relationships: []
      }
      ai_commands: {
        Row: {
          category: string | null
          code: string
          created_at: string | null
          created_by: string | null
          description: string | null
          id: string
          is_active: boolean | null
          name: string
          updated_at: string | null
        }
        Insert: {
          category?: string | null
          code: string
          created_at?: string | null
          created_by?: string | null
          description?: string | null
          id?: string
          is_active?: boolean | null
          name: string
          updated_at?: string | null
        }
        Update: {
          category?: string | null
          code?: string
          created_at?: string | null
          created_by?: string | null
          description?: string | null
          id?: string
          is_active?: boolean | null
          name?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "ai_commands_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      ai_configuration: {
        Row: {
          config: Json
          created_at: string | null
          id: string
          updated_at: string | null
        }
        Insert: {
          config?: Json
          created_at?: string | null
          id?: string
          updated_at?: string | null
        }
        Update: {
          config?: Json
          created_at?: string | null
          id?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      ai_recognition_cache: {
        Row: {
          confidence_score: number | null
          created_at: string | null
          id: string
          image_hash: string
          processing_time_ms: number | null
          recognition_results: Json
          sources_consulted: string[] | null
          updated_at: string | null
        }
        Insert: {
          confidence_score?: number | null
          created_at?: string | null
          id?: string
          image_hash: string
          processing_time_ms?: number | null
          recognition_results?: Json
          sources_consulted?: string[] | null
          updated_at?: string | null
        }
        Update: {
          confidence_score?: number | null
          created_at?: string | null
          id?: string
          image_hash?: string
          processing_time_ms?: number | null
          recognition_results?: Json
          sources_consulted?: string[] | null
          updated_at?: string | null
        }
        Relationships: []
      }
      analytics_events: {
        Row: {
          event_type: string
          id: string
          metadata: Json | null
          page_url: string
          timestamp: string
          user_agent: string | null
          user_id: string | null
        }
        Insert: {
          event_type: string
          id?: string
          metadata?: Json | null
          page_url: string
          timestamp?: string
          user_agent?: string | null
          user_id?: string | null
        }
        Update: {
          event_type?: string
          id?: string
          metadata?: Json | null
          page_url?: string
          timestamp?: string
          user_agent?: string | null
          user_id?: string | null
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
      auction_bids: {
        Row: {
          amount: number
          auction_id: string
          auto_bid_max: number | null
          bidder_id: string
          created_at: string
          id: string
          is_winning: boolean | null
        }
        Insert: {
          amount: number
          auction_id: string
          auto_bid_max?: number | null
          bidder_id: string
          created_at?: string
          id?: string
          is_winning?: boolean | null
        }
        Update: {
          amount?: number
          auction_id?: string
          auto_bid_max?: number | null
          bidder_id?: string
          created_at?: string
          id?: string
          is_winning?: boolean | null
        }
        Relationships: [
          {
            foreignKeyName: "auction_bids_auction_id_fkey"
            columns: ["auction_id"]
            isOneToOne: false
            referencedRelation: "coins"
            referencedColumns: ["id"]
          },
        ]
      }
      bids: {
        Row: {
          amount: number
          auto_bid_max: number | null
          bidder_id: string | null
          coin_id: string
          created_at: string | null
          id: string
          is_winning: boolean | null
          listing_id: string | null
          user_id: string
        }
        Insert: {
          amount: number
          auto_bid_max?: number | null
          bidder_id?: string | null
          coin_id: string
          created_at?: string | null
          id?: string
          is_winning?: boolean | null
          listing_id?: string | null
          user_id: string
        }
        Update: {
          amount?: number
          auto_bid_max?: number | null
          bidder_id?: string | null
          coin_id?: string
          created_at?: string | null
          id?: string
          is_winning?: boolean | null
          listing_id?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "bids_bidder_id_fkey"
            columns: ["bidder_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "bids_coin_id_fkey"
            columns: ["coin_id"]
            isOneToOne: false
            referencedRelation: "coins"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "bids_listing_id_fkey"
            columns: ["listing_id"]
            isOneToOne: false
            referencedRelation: "marketplace_listings"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fk_bids_coin_id"
            columns: ["coin_id"]
            isOneToOne: false
            referencedRelation: "coins"
            referencedColumns: ["id"]
          },
        ]
      }
      categories: {
        Row: {
          created_at: string | null
          description: string | null
          display_order: number | null
          icon: string | null
          id: string
          image_url: string | null
          is_active: boolean | null
          name: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          display_order?: number | null
          icon?: string | null
          id?: string
          image_url?: string | null
          is_active?: boolean | null
          name: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          description?: string | null
          display_order?: number | null
          icon?: string | null
          id?: string
          image_url?: string | null
          is_active?: boolean | null
          name?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      coin_analysis_logs: {
        Row: {
          accuracy_score: number
          analysis_time: number
          analysis_type: string
          coin_id: string | null
          created_at: string
          id: string
          user_id: string
        }
        Insert: {
          accuracy_score?: number
          analysis_time?: number
          analysis_type?: string
          coin_id?: string | null
          created_at?: string
          id?: string
          user_id: string
        }
        Update: {
          accuracy_score?: number
          analysis_time?: number
          analysis_type?: string
          coin_id?: string | null
          created_at?: string
          id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "coin_analysis_logs_coin_id_fkey"
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
          {
            foreignKeyName: "fk_coin_evaluations_coin_id"
            columns: ["coin_id"]
            isOneToOne: false
            referencedRelation: "coins"
            referencedColumns: ["id"]
          },
        ]
      }
      coin_price_history: {
        Row: {
          coin_identifier: string
          created_at: string
          date_recorded: string
          external_source_id: string | null
          grade: string | null
          id: string
          price: number
          sale_date: string | null
          sale_type: string | null
          source: string
        }
        Insert: {
          coin_identifier: string
          created_at?: string
          date_recorded?: string
          external_source_id?: string | null
          grade?: string | null
          id?: string
          price: number
          sale_date?: string | null
          sale_type?: string | null
          source: string
        }
        Update: {
          coin_identifier?: string
          created_at?: string
          date_recorded?: string
          external_source_id?: string | null
          grade?: string | null
          id?: string
          price?: number
          sale_date?: string | null
          sale_type?: string | null
          source?: string
        }
        Relationships: [
          {
            foreignKeyName: "coin_price_history_external_source_id_fkey"
            columns: ["external_source_id"]
            isOneToOne: false
            referencedRelation: "external_price_sources"
            referencedColumns: ["id"]
          },
        ]
      }
      coins: {
        Row: {
          ai_confidence: number | null
          ai_provider: string | null
          auction_end: string | null
          authentication_status: string | null
          category: Database["public"]["Enums"]["coin_category"] | null
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
          listing_type: string | null
          mint: string | null
          mintage: number | null
          model_3d_url: string | null
          name: string
          ngc_grade: string | null
          ngc_number: string | null
          obverse_image: string | null
          owner_id: string | null
          pcgs_grade: string | null
          pcgs_number: string | null
          price: number
          rarity: string
          reserve_price: number | null
          reverse_image: string | null
          seller_id: string | null
          sold: boolean | null
          sold_at: string | null
          starting_bid: number | null
          store_id: string | null
          tags: string[] | null
          updated_at: string | null
          uploaded_by: string | null
          user_id: string
          views: number | null
          weight: number | null
          year: number
        }
        Insert: {
          ai_confidence?: number | null
          ai_provider?: string | null
          auction_end?: string | null
          authentication_status?: string | null
          category?: Database["public"]["Enums"]["coin_category"] | null
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
          listing_type?: string | null
          mint?: string | null
          mintage?: number | null
          model_3d_url?: string | null
          name: string
          ngc_grade?: string | null
          ngc_number?: string | null
          obverse_image?: string | null
          owner_id?: string | null
          pcgs_grade?: string | null
          pcgs_number?: string | null
          price: number
          rarity: string
          reserve_price?: number | null
          reverse_image?: string | null
          seller_id?: string | null
          sold?: boolean | null
          sold_at?: string | null
          starting_bid?: number | null
          store_id?: string | null
          tags?: string[] | null
          updated_at?: string | null
          uploaded_by?: string | null
          user_id: string
          views?: number | null
          weight?: number | null
          year: number
        }
        Update: {
          ai_confidence?: number | null
          ai_provider?: string | null
          auction_end?: string | null
          authentication_status?: string | null
          category?: Database["public"]["Enums"]["coin_category"] | null
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
          listing_type?: string | null
          mint?: string | null
          mintage?: number | null
          model_3d_url?: string | null
          name?: string
          ngc_grade?: string | null
          ngc_number?: string | null
          obverse_image?: string | null
          owner_id?: string | null
          pcgs_grade?: string | null
          pcgs_number?: string | null
          price?: number
          rarity?: string
          reserve_price?: number | null
          reverse_image?: string | null
          seller_id?: string | null
          sold?: boolean | null
          sold_at?: string | null
          starting_bid?: number | null
          store_id?: string | null
          tags?: string[] | null
          updated_at?: string | null
          uploaded_by?: string | null
          user_id?: string
          views?: number | null
          weight?: number | null
          year?: number
        }
        Relationships: [
          {
            foreignKeyName: "coins_owner_id_fkey"
            columns: ["owner_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "coins_store_id_fkey"
            columns: ["store_id"]
            isOneToOne: false
            referencedRelation: "stores"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "coins_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
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
          {
            foreignKeyName: "fk_error_coins_market_data_knowledge_base_id"
            columns: ["knowledge_base_id"]
            isOneToOne: false
            referencedRelation: "error_coins_knowledge"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fk_error_coins_market_data_static_coin_id"
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
          {
            foreignKeyName: "fk_external_price_sources_category_id"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "source_categories"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fk_external_price_sources_region_id"
            columns: ["region_id"]
            isOneToOne: false
            referencedRelation: "geographic_regions"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fk_external_price_sources_template_id"
            columns: ["template_id"]
            isOneToOne: false
            referencedRelation: "source_templates"
            referencedColumns: ["id"]
          },
        ]
      }
      favorites: {
        Row: {
          coin_id: string | null
          created_at: string | null
          id: string
          user_id: string | null
        }
        Insert: {
          coin_id?: string | null
          created_at?: string | null
          id?: string
          user_id?: string | null
        }
        Update: {
          coin_id?: string | null
          created_at?: string | null
          id?: string
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "favorites_coin_id_fkey"
            columns: ["coin_id"]
            isOneToOne: false
            referencedRelation: "coins"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "favorites_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
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
      marketplace_listings: {
        Row: {
          auto_extend: boolean | null
          buyout_price: number | null
          coin_id: string | null
          created_at: string | null
          current_price: number | null
          ends_at: string | null
          id: string
          international_shipping: boolean | null
          listing_type: string
          return_policy: string | null
          seller_id: string | null
          shipping_cost: number | null
          starting_price: number
          status: string | null
          updated_at: string | null
        }
        Insert: {
          auto_extend?: boolean | null
          buyout_price?: number | null
          coin_id?: string | null
          created_at?: string | null
          current_price?: number | null
          ends_at?: string | null
          id?: string
          international_shipping?: boolean | null
          listing_type: string
          return_policy?: string | null
          seller_id?: string | null
          shipping_cost?: number | null
          starting_price: number
          status?: string | null
          updated_at?: string | null
        }
        Update: {
          auto_extend?: boolean | null
          buyout_price?: number | null
          coin_id?: string | null
          created_at?: string | null
          current_price?: number | null
          ends_at?: string | null
          id?: string
          international_shipping?: boolean | null
          listing_type?: string
          return_policy?: string | null
          seller_id?: string | null
          shipping_cost?: number | null
          starting_price?: number
          status?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "marketplace_listings_coin_id_fkey"
            columns: ["coin_id"]
            isOneToOne: false
            referencedRelation: "coins"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "marketplace_listings_seller_id_fkey"
            columns: ["seller_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
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
      messages: {
        Row: {
          content: string
          created_at: string | null
          id: string
          listing_id: string | null
          message_type: string | null
          offer_amount: number | null
          read_at: string | null
          receiver_id: string | null
          sender_id: string | null
          status: string | null
        }
        Insert: {
          content: string
          created_at?: string | null
          id?: string
          listing_id?: string | null
          message_type?: string | null
          offer_amount?: number | null
          read_at?: string | null
          receiver_id?: string | null
          sender_id?: string | null
          status?: string | null
        }
        Update: {
          content?: string
          created_at?: string | null
          id?: string
          listing_id?: string | null
          message_type?: string | null
          offer_amount?: number | null
          read_at?: string | null
          receiver_id?: string | null
          sender_id?: string | null
          status?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "messages_listing_id_fkey"
            columns: ["listing_id"]
            isOneToOne: false
            referencedRelation: "marketplace_listings"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "messages_receiver_id_fkey"
            columns: ["receiver_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "messages_sender_id_fkey"
            columns: ["sender_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
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
            foreignKeyName: "fk_notifications_coin_id"
            columns: ["related_coin_id"]
            isOneToOne: false
            referencedRelation: "coins"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "notifications_related_coin_id_fkey"
            columns: ["related_coin_id"]
            isOneToOne: false
            referencedRelation: "coins"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "notifications_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      page_views: {
        Row: {
          id: string
          last_viewed: string
          page_path: string
          updated_at: string
          view_count: number
        }
        Insert: {
          id?: string
          last_viewed?: string
          page_path: string
          updated_at?: string
          view_count?: number
        }
        Update: {
          id?: string
          last_viewed?: string
          page_path?: string
          updated_at?: string
          view_count?: number
        }
        Relationships: []
      }
      payment_transactions: {
        Row: {
          amount: number
          coin_id: string | null
          created_at: string | null
          currency: string
          id: string
          payment_method: string | null
          status: string
          transak_data: Json | null
          transak_order_id: string | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          amount: number
          coin_id?: string | null
          created_at?: string | null
          currency?: string
          id?: string
          payment_method?: string | null
          status?: string
          transak_data?: Json | null
          transak_order_id?: string | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          amount?: number
          coin_id?: string | null
          created_at?: string | null
          currency?: string
          id?: string
          payment_method?: string | null
          status?: string
          transak_data?: Json | null
          transak_order_id?: string | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "payment_transactions_coin_id_fkey"
            columns: ["coin_id"]
            isOneToOne: false
            referencedRelation: "coins"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          address: Json | null
          avatar_url: string | null
          bio: string | null
          birth_date: string | null
          created_at: string | null
          email: string | null
          full_name: string | null
          id: string
          instagram: string | null
          kyc_verified: boolean | null
          location: string | null
          name: string | null
          ngc_member_id: string | null
          pcgs_member_id: string | null
          phone: string | null
          phone_number: string | null
          rating: number | null
          reputation: number | null
          role: string | null
          twitter: string | null
          updated_at: string | null
          username: string | null
          verified_dealer: boolean | null
          website: string | null
        }
        Insert: {
          address?: Json | null
          avatar_url?: string | null
          bio?: string | null
          birth_date?: string | null
          created_at?: string | null
          email?: string | null
          full_name?: string | null
          id: string
          instagram?: string | null
          kyc_verified?: boolean | null
          location?: string | null
          name?: string | null
          ngc_member_id?: string | null
          pcgs_member_id?: string | null
          phone?: string | null
          phone_number?: string | null
          rating?: number | null
          reputation?: number | null
          role?: string | null
          twitter?: string | null
          updated_at?: string | null
          username?: string | null
          verified_dealer?: boolean | null
          website?: string | null
        }
        Update: {
          address?: Json | null
          avatar_url?: string | null
          bio?: string | null
          birth_date?: string | null
          created_at?: string | null
          email?: string | null
          full_name?: string | null
          id?: string
          instagram?: string | null
          kyc_verified?: boolean | null
          location?: string | null
          name?: string | null
          ngc_member_id?: string | null
          pcgs_member_id?: string | null
          phone?: string | null
          phone_number?: string | null
          rating?: number | null
          reputation?: number | null
          role?: string | null
          twitter?: string | null
          updated_at?: string | null
          username?: string | null
          verified_dealer?: boolean | null
          website?: string | null
        }
        Relationships: []
      }
      proxy_rotation_log: {
        Row: {
          error_message: string | null
          id: string
          proxy_id: string | null
          reason: string | null
          rotation_time: string
          source_id: string | null
          success: boolean
        }
        Insert: {
          error_message?: string | null
          id?: string
          proxy_id?: string | null
          reason?: string | null
          rotation_time?: string
          source_id?: string | null
          success?: boolean
        }
        Update: {
          error_message?: string | null
          id?: string
          proxy_id?: string | null
          reason?: string | null
          rotation_time?: string
          source_id?: string | null
          success?: boolean
        }
        Relationships: [
          {
            foreignKeyName: "proxy_rotation_log_proxy_id_fkey"
            columns: ["proxy_id"]
            isOneToOne: false
            referencedRelation: "vpn_proxies"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "proxy_rotation_log_source_id_fkey"
            columns: ["source_id"]
            isOneToOne: false
            referencedRelation: "external_price_sources"
            referencedColumns: ["id"]
          },
        ]
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
            foreignKeyName: "fk_scraping_jobs_proxy_id"
            columns: ["proxy_id"]
            isOneToOne: false
            referencedRelation: "vpn_proxies"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fk_scraping_jobs_source_id"
            columns: ["source_id"]
            isOneToOne: false
            referencedRelation: "data_sources"
            referencedColumns: ["id"]
          },
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
      scraping_schedules: {
        Row: {
          created_at: string
          cron_expression: string
          id: string
          is_active: boolean
          last_run: string | null
          next_run: string | null
          schedule_type: string
          source_id: string | null
        }
        Insert: {
          created_at?: string
          cron_expression: string
          id?: string
          is_active?: boolean
          last_run?: string | null
          next_run?: string | null
          schedule_type?: string
          source_id?: string | null
        }
        Update: {
          created_at?: string
          cron_expression?: string
          id?: string
          is_active?: boolean
          last_run?: string | null
          next_run?: string | null
          schedule_type?: string
          source_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "scraping_schedules_source_id_fkey"
            columns: ["source_id"]
            isOneToOne: false
            referencedRelation: "external_price_sources"
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
            foreignKeyName: "fk_source_performance_metrics_source_id"
            columns: ["source_id"]
            isOneToOne: false
            referencedRelation: "external_price_sources"
            referencedColumns: ["id"]
          },
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
      store_ratings: {
        Row: {
          comment: string | null
          created_at: string
          id: string
          rating: number | null
          store_id: string
          user_id: string
        }
        Insert: {
          comment?: string | null
          created_at?: string
          id?: string
          rating?: number | null
          store_id: string
          user_id: string
        }
        Update: {
          comment?: string | null
          created_at?: string
          id?: string
          rating?: number | null
          store_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "store_ratings_store_id_fkey"
            columns: ["store_id"]
            isOneToOne: false
            referencedRelation: "stores"
            referencedColumns: ["id"]
          },
        ]
      }
      stores: {
        Row: {
          address: Json | null
          created_at: string
          description: string | null
          email: string | null
          id: string
          is_active: boolean | null
          logo_url: string | null
          name: string
          phone: string | null
          shipping_options: Json | null
          updated_at: string
          user_id: string
          verified: boolean | null
          website: string | null
        }
        Insert: {
          address?: Json | null
          created_at?: string
          description?: string | null
          email?: string | null
          id?: string
          is_active?: boolean | null
          logo_url?: string | null
          name: string
          phone?: string | null
          shipping_options?: Json | null
          updated_at?: string
          user_id: string
          verified?: boolean | null
          website?: string | null
        }
        Update: {
          address?: Json | null
          created_at?: string
          description?: string | null
          email?: string | null
          id?: string
          is_active?: boolean | null
          logo_url?: string | null
          name?: string
          phone?: string | null
          shipping_options?: Json | null
          updated_at?: string
          user_id?: string
          verified?: boolean | null
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
            foreignKeyName: "fk_transactions_coin_id"
            columns: ["coin_id"]
            isOneToOne: false
            referencedRelation: "coins"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "transactions_buyer_id_fkey"
            columns: ["buyer_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "transactions_coin_id_fkey"
            columns: ["coin_id"]
            isOneToOne: false
            referencedRelation: "coins"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "transactions_seller_id_fkey"
            columns: ["seller_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      url_cache: {
        Row: {
          content: string | null
          description: string | null
          expires_at: string | null
          id: string
          scraped_at: string | null
          title: string | null
          url: string
        }
        Insert: {
          content?: string | null
          description?: string | null
          expires_at?: string | null
          id?: string
          scraped_at?: string | null
          title?: string | null
          url: string
        }
        Update: {
          content?: string | null
          description?: string | null
          expires_at?: string | null
          id?: string
          scraped_at?: string | null
          title?: string | null
          url?: string
        }
        Relationships: []
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
            foreignKeyName: "fk_user_favorites_coin_id"
            columns: ["coin_id"]
            isOneToOne: false
            referencedRelation: "coins"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "user_favorites_coin_id_fkey"
            columns: ["coin_id"]
            isOneToOne: false
            referencedRelation: "coins"
            referencedColumns: ["id"]
          },
        ]
      }
      user_portfolios: {
        Row: {
          coin_id: string
          created_at: string
          id: string
          notes: string | null
          purchase_date: string
          purchase_price: number | null
          quantity: number
          user_id: string
        }
        Insert: {
          coin_id: string
          created_at?: string
          id?: string
          notes?: string | null
          purchase_date?: string
          purchase_price?: number | null
          quantity?: number
          user_id: string
        }
        Update: {
          coin_id?: string
          created_at?: string
          id?: string
          notes?: string | null
          purchase_date?: string
          purchase_price?: number | null
          quantity?: number
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_portfolios_coin_id_fkey"
            columns: ["coin_id"]
            isOneToOne: false
            referencedRelation: "coins"
            referencedColumns: ["id"]
          },
        ]
      }
      user_purchases: {
        Row: {
          amount: number
          buyer_id: string
          coin_id: string
          created_at: string
          id: string
          payment_method: string | null
          seller_id: string
          status: string | null
          store_id: string | null
        }
        Insert: {
          amount: number
          buyer_id: string
          coin_id: string
          created_at?: string
          id?: string
          payment_method?: string | null
          seller_id: string
          status?: string | null
          store_id?: string | null
        }
        Update: {
          amount?: number
          buyer_id?: string
          coin_id?: string
          created_at?: string
          id?: string
          payment_method?: string | null
          seller_id?: string
          status?: string | null
          store_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "user_purchases_coin_id_fkey"
            columns: ["coin_id"]
            isOneToOne: false
            referencedRelation: "coins"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "user_purchases_store_id_fkey"
            columns: ["store_id"]
            isOneToOne: false
            referencedRelation: "stores"
            referencedColumns: ["id"]
          },
        ]
      }
      user_roles: {
        Row: {
          created_at: string | null
          created_by: string | null
          id: string
          role: Database["public"]["Enums"]["user_role"]
          user_id: string
        }
        Insert: {
          created_at?: string | null
          created_by?: string | null
          id?: string
          role?: Database["public"]["Enums"]["user_role"]
          user_id: string
        }
        Update: {
          created_at?: string | null
          created_by?: string | null
          id?: string
          role?: Database["public"]["Enums"]["user_role"]
          user_id?: string
        }
        Relationships: []
      }
      user_settings: {
        Row: {
          app_settings: Json | null
          created_at: string | null
          id: string
          notifications: Json | null
          privacy: Json | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          app_settings?: Json | null
          created_at?: string | null
          id?: string
          notifications?: Json | null
          privacy?: Json | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          app_settings?: Json | null
          created_at?: string | null
          id?: string
          notifications?: Json | null
          privacy?: Json | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
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
      watchlist: {
        Row: {
          created_at: string | null
          id: string
          last_price_check: number | null
          listing_id: string | null
          max_bid_alert: number | null
          price_alert_enabled: boolean | null
          price_change_percentage: number | null
          target_price: number | null
          user_id: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          last_price_check?: number | null
          listing_id?: string | null
          max_bid_alert?: number | null
          price_alert_enabled?: boolean | null
          price_change_percentage?: number | null
          target_price?: number | null
          user_id?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          last_price_check?: number | null
          listing_id?: string | null
          max_bid_alert?: number | null
          price_alert_enabled?: boolean | null
          price_change_percentage?: number | null
          target_price?: number | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "watchlist_listing_id_fkey"
            columns: ["listing_id"]
            isOneToOne: false
            referencedRelation: "marketplace_listings"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "watchlist_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      configure_enhanced_auth_security: {
        Args: Record<PropertyKey, never>
        Returns: undefined
      }
      configure_otp_security: {
        Args: Record<PropertyKey, never>
        Returns: Json
      }
      configure_production_auth_security: {
        Args: Record<PropertyKey, never>
        Returns: Json
      }
      configure_secure_otp_settings: {
        Args: Record<PropertyKey, never>
        Returns: Json
      }
      create_admin_user: {
        Args: { user_email: string }
        Returns: undefined
      }
      create_default_admin: {
        Args: Record<PropertyKey, never>
        Returns: undefined
      }
      create_first_admin_safely: {
        Args: {
          target_user_id: string
          admin_role?: Database["public"]["Enums"]["user_role"]
        }
        Returns: boolean
      }
      enable_password_protection: {
        Args: Record<PropertyKey, never>
        Returns: Json
      }
      encrypt_api_key_secure: {
        Args: { plain_key: string }
        Returns: string
      }
      get_store_average_rating: {
        Args: { store_uuid: string }
        Returns: number
      }
      get_tenant_from_domain: {
        Args: { domain_name: string }
        Returns: string
      }
      has_role: {
        Args: {
          _user_id: string
          _role: Database["public"]["Enums"]["user_role"]
        }
        Returns: boolean
      }
      increment_page_view: {
        Args: { page_path_param: string }
        Returns: undefined
      }
      is_admin: {
        Args: { _user_id?: string }
        Returns: boolean
      }
      is_admin_user: {
        Args: { user_id?: string }
        Returns: boolean
      }
      log_production_error: {
        Args: {
          error_type: string
          error_message: string
          error_context?: Json
        }
        Returns: undefined
      }
      log_security_event: {
        Args: { event_type: string; event_details?: Json }
        Returns: undefined
      }
      monitor_auth_sessions: {
        Args: Record<PropertyKey, never>
        Returns: Json
      }
      set_tenant_context: {
        Args: { tenant_uuid: string }
        Returns: undefined
      }
      validate_enhanced_security_config: {
        Args: Record<PropertyKey, never>
        Returns: Json
      }
      validate_production_security_config: {
        Args: Record<PropertyKey, never>
        Returns: Json
      }
      validate_security_config: {
        Args: Record<PropertyKey, never>
        Returns: Json
      }
      verify_admin_access_secure: {
        Args: { user_id?: string }
        Returns: boolean
      }
    }
    Enums: {
      coin_category:
        | "error_coin"
        | "greek"
        | "american"
        | "british"
        | "asian"
        | "european"
        | "ancient"
        | "modern"
        | "silver"
        | "gold"
        | "commemorative"
        | "unclassified"
      user_role: "admin" | "moderator" | "user" | "dealer" | "buyer"
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
    Enums: {
      coin_category: [
        "error_coin",
        "greek",
        "american",
        "british",
        "asian",
        "european",
        "ancient",
        "modern",
        "silver",
        "gold",
        "commemorative",
        "unclassified",
      ],
      user_role: ["admin", "moderator", "user", "dealer", "buyer"],
    },
  },
} as const
