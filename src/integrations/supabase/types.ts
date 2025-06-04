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
        Relationships: [
          {
            foreignKeyName: "admin_activity_logs_admin_user_id_fkey"
            columns: ["admin_user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      admin_roles: {
        Row: {
          created_at: string | null
          created_by: string | null
          id: string
          role: string
          user_id: string
        }
        Insert: {
          created_at?: string | null
          created_by?: string | null
          id?: string
          role?: string
          user_id: string
        }
        Update: {
          created_at?: string | null
          created_by?: string | null
          id?: string
          role?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "admin_roles_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "admin_roles_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      aggregated_coin_prices: {
        Row: {
          coin_identifier: string
          confidence_level: number | null
          current_avg_price: number | null
          grade: string | null
          id: string
          last_updated: string | null
          price_sources: string[] | null
          price_trend: string | null
          sample_size: number | null
          trend_percentage: number | null
        }
        Insert: {
          coin_identifier: string
          confidence_level?: number | null
          current_avg_price?: number | null
          grade?: string | null
          id?: string
          last_updated?: string | null
          price_sources?: string[] | null
          price_trend?: string | null
          sample_size?: number | null
          trend_percentage?: number | null
        }
        Update: {
          coin_identifier?: string
          confidence_level?: number | null
          current_avg_price?: number | null
          grade?: string | null
          id?: string
          last_updated?: string | null
          price_sources?: string[] | null
          price_trend?: string | null
          sample_size?: number | null
          trend_percentage?: number | null
        }
        Relationships: []
      }
      ai_recognition_cache: {
        Row: {
          confidence_score: number | null
          created_at: string | null
          error_detected: boolean | null
          expires_at: string | null
          grade_estimation: string | null
          id: string
          image_hash: string
          price_estimate: number | null
          processing_time_ms: number | null
          recognition_results: Json
          sources_consulted: string[] | null
        }
        Insert: {
          confidence_score?: number | null
          created_at?: string | null
          error_detected?: boolean | null
          expires_at?: string | null
          grade_estimation?: string | null
          id?: string
          image_hash: string
          price_estimate?: number | null
          processing_time_ms?: number | null
          recognition_results: Json
          sources_consulted?: string[] | null
        }
        Update: {
          confidence_score?: number | null
          created_at?: string | null
          error_detected?: boolean | null
          expires_at?: string | null
          grade_estimation?: string | null
          id?: string
          image_hash?: string
          price_estimate?: number | null
          processing_time_ms?: number | null
          recognition_results?: Json
          sources_consulted?: string[] | null
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
        Relationships: [
          {
            foreignKeyName: "api_keys_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
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
          {
            foreignKeyName: "bids_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      coin_data_cache: {
        Row: {
          coin_identifier: string
          confidence_score: number | null
          created_at: string | null
          data_type: string
          expires_at: string | null
          id: string
          last_updated: string | null
          processed_data: Json | null
          raw_data: Json
          source_name: string
        }
        Insert: {
          coin_identifier: string
          confidence_score?: number | null
          created_at?: string | null
          data_type: string
          expires_at?: string | null
          id?: string
          last_updated?: string | null
          processed_data?: Json | null
          raw_data: Json
          source_name: string
        }
        Update: {
          coin_identifier?: string
          confidence_score?: number | null
          created_at?: string | null
          data_type?: string
          expires_at?: string | null
          id?: string
          last_updated?: string | null
          processed_data?: Json | null
          raw_data?: Json
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
            foreignKeyName: "coin_evaluations_expert_id_fkey"
            columns: ["expert_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      coin_price_history: {
        Row: {
          coin_identifier: string
          condition_notes: string | null
          confidence_score: number | null
          created_at: string | null
          currency: string | null
          grade: string | null
          id: string
          price: number
          raw_listing_data: Json | null
          sale_date: string | null
          sale_type: string | null
          source_id: string | null
        }
        Insert: {
          coin_identifier: string
          condition_notes?: string | null
          confidence_score?: number | null
          created_at?: string | null
          currency?: string | null
          grade?: string | null
          id?: string
          price: number
          raw_listing_data?: Json | null
          sale_date?: string | null
          sale_type?: string | null
          source_id?: string | null
        }
        Update: {
          coin_identifier?: string
          condition_notes?: string | null
          confidence_score?: number | null
          created_at?: string | null
          currency?: string | null
          grade?: string | null
          id?: string
          price?: number
          raw_listing_data?: Json | null
          sale_date?: string | null
          sale_type?: string | null
          source_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "coin_price_history_source_id_fkey"
            columns: ["source_id"]
            isOneToOne: false
            referencedRelation: "external_price_sources"
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
        Relationships: [
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
        Relationships: [
          {
            foreignKeyName: "console_errors_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      data_sources: {
        Row: {
          config: Json | null
          created_at: string | null
          id: string
          is_active: boolean | null
          last_used: string | null
          name: string
          priority: number | null
          rate_limit: number | null
          success_rate: number | null
          type: string
          updated_at: string | null
          url: string | null
        }
        Insert: {
          config?: Json | null
          created_at?: string | null
          id?: string
          is_active?: boolean | null
          last_used?: string | null
          name: string
          priority?: number | null
          rate_limit?: number | null
          success_rate?: number | null
          type: string
          updated_at?: string | null
          url?: string | null
        }
        Update: {
          config?: Json | null
          created_at?: string | null
          id?: string
          is_active?: boolean | null
          last_used?: string | null
          name?: string
          priority?: number | null
          rate_limit?: number | null
          success_rate?: number | null
          type?: string
          updated_at?: string | null
          url?: string | null
        }
        Relationships: []
      }
      error_coins_db: {
        Row: {
          base_coin_id: string | null
          created_at: string | null
          error_description: string
          error_type: string
          id: string
          identification_markers: string[] | null
          image_examples: string[] | null
          rarity_multiplier: number | null
          value_premium_percent: number | null
        }
        Insert: {
          base_coin_id?: string | null
          created_at?: string | null
          error_description: string
          error_type: string
          id?: string
          identification_markers?: string[] | null
          image_examples?: string[] | null
          rarity_multiplier?: number | null
          value_premium_percent?: number | null
        }
        Update: {
          base_coin_id?: string | null
          created_at?: string | null
          error_description?: string
          error_type?: string
          id?: string
          identification_markers?: string[] | null
          image_examples?: string[] | null
          rarity_multiplier?: number | null
          value_premium_percent?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "error_coins_db_base_coin_id_fkey"
            columns: ["base_coin_id"]
            isOneToOne: false
            referencedRelation: "static_coins_db"
            referencedColumns: ["id"]
          },
        ]
      }
      error_coins_knowledge: {
        Row: {
          ai_detection_markers: Json | null
          common_mistakes: string[] | null
          created_at: string | null
          description: string
          diagnostic_images: string[] | null
          error_category: string
          error_name: string
          error_type: string
          id: string
          identification_techniques: string[] | null
          rarity_score: number | null
          reference_links: string[] | null
          severity_level: number | null
          technical_specifications: Json | null
          updated_at: string | null
        }
        Insert: {
          ai_detection_markers?: Json | null
          common_mistakes?: string[] | null
          created_at?: string | null
          description: string
          diagnostic_images?: string[] | null
          error_category: string
          error_name: string
          error_type: string
          id?: string
          identification_techniques?: string[] | null
          rarity_score?: number | null
          reference_links?: string[] | null
          severity_level?: number | null
          technical_specifications?: Json | null
          updated_at?: string | null
        }
        Update: {
          ai_detection_markers?: Json | null
          common_mistakes?: string[] | null
          created_at?: string | null
          description?: string
          diagnostic_images?: string[] | null
          error_category?: string
          error_name?: string
          error_type?: string
          id?: string
          identification_techniques?: string[] | null
          rarity_score?: number | null
          reference_links?: string[] | null
          severity_level?: number | null
          technical_specifications?: Json | null
          updated_at?: string | null
        }
        Relationships: []
      }
      error_coins_market_data: {
        Row: {
          base_coin_id: string | null
          created_at: string | null
          data_confidence: number | null
          grade: string
          id: string
          knowledge_base_id: string | null
          last_sale_date: string | null
          last_sale_price: number | null
          market_trend: string | null
          market_value_avg: number | null
          market_value_high: number | null
          market_value_low: number | null
          premium_percentage: number | null
          source_references: string[] | null
          updated_at: string | null
        }
        Insert: {
          base_coin_id?: string | null
          created_at?: string | null
          data_confidence?: number | null
          grade: string
          id?: string
          knowledge_base_id?: string | null
          last_sale_date?: string | null
          last_sale_price?: number | null
          market_trend?: string | null
          market_value_avg?: number | null
          market_value_high?: number | null
          market_value_low?: number | null
          premium_percentage?: number | null
          source_references?: string[] | null
          updated_at?: string | null
        }
        Update: {
          base_coin_id?: string | null
          created_at?: string | null
          data_confidence?: number | null
          grade?: string
          id?: string
          knowledge_base_id?: string | null
          last_sale_date?: string | null
          last_sale_price?: number | null
          market_trend?: string | null
          market_value_avg?: number | null
          market_value_high?: number | null
          market_value_low?: number | null
          premium_percentage?: number | null
          source_references?: string[] | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "error_coins_market_data_base_coin_id_fkey"
            columns: ["base_coin_id"]
            isOneToOne: false
            referencedRelation: "static_coins_db"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "error_coins_market_data_knowledge_base_id_fkey"
            columns: ["knowledge_base_id"]
            isOneToOne: false
            referencedRelation: "error_coins_knowledge"
            referencedColumns: ["id"]
          },
        ]
      }
      error_coins_price_history: {
        Row: {
          auction_house: string | null
          condition_notes: string | null
          created_at: string | null
          grade: string | null
          id: string
          lot_number: string | null
          market_data_id: string | null
          price: number
          sale_date: string
          source_url: string | null
        }
        Insert: {
          auction_house?: string | null
          condition_notes?: string | null
          created_at?: string | null
          grade?: string | null
          id?: string
          lot_number?: string | null
          market_data_id?: string | null
          price: number
          sale_date: string
          source_url?: string | null
        }
        Update: {
          auction_house?: string | null
          condition_notes?: string | null
          created_at?: string | null
          grade?: string | null
          id?: string
          lot_number?: string | null
          market_data_id?: string | null
          price?: number
          sale_date?: string
          source_url?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "error_coins_price_history_market_data_id_fkey"
            columns: ["market_data_id"]
            isOneToOne: false
            referencedRelation: "error_coins_market_data"
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
        Relationships: [
          {
            foreignKeyName: "error_logs_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      error_reference_sources: {
        Row: {
          created_at: string | null
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
          created_at?: string | null
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
          created_at?: string | null
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
          ai_detection_rules: Json | null
          auto_config_enabled: boolean | null
          avg_response_time: number | null
          base_url: string
          category_id: string | null
          created_at: string | null
          discovery_method: string | null
          failed_scrapes: number | null
          id: string
          last_config_update: string | null
          last_successful_scrape: string | null
          market_focus: string[] | null
          obfuscation_level: number | null
          priority_score: number | null
          rate_limit_per_hour: number | null
          region_id: string | null
          reliability_score: number | null
          requires_proxy: boolean | null
          scraping_config: Json | null
          scraping_enabled: boolean | null
          source_name: string
          source_type: string
          supported_currencies: string[] | null
          template_id: string | null
          total_scrapes: number | null
        }
        Insert: {
          ai_detection_rules?: Json | null
          auto_config_enabled?: boolean | null
          avg_response_time?: number | null
          base_url: string
          category_id?: string | null
          created_at?: string | null
          discovery_method?: string | null
          failed_scrapes?: number | null
          id?: string
          last_config_update?: string | null
          last_successful_scrape?: string | null
          market_focus?: string[] | null
          obfuscation_level?: number | null
          priority_score?: number | null
          rate_limit_per_hour?: number | null
          region_id?: string | null
          reliability_score?: number | null
          requires_proxy?: boolean | null
          scraping_config?: Json | null
          scraping_enabled?: boolean | null
          source_name: string
          source_type: string
          supported_currencies?: string[] | null
          template_id?: string | null
          total_scrapes?: number | null
        }
        Update: {
          ai_detection_rules?: Json | null
          auto_config_enabled?: boolean | null
          avg_response_time?: number | null
          base_url?: string
          category_id?: string | null
          created_at?: string | null
          discovery_method?: string | null
          failed_scrapes?: number | null
          id?: string
          last_config_update?: string | null
          last_successful_scrape?: string | null
          market_focus?: string[] | null
          obfuscation_level?: number | null
          priority_score?: number | null
          rate_limit_per_hour?: number | null
          region_id?: string | null
          reliability_score?: number | null
          requires_proxy?: boolean | null
          scraping_config?: Json | null
          scraping_enabled?: boolean | null
          source_name?: string
          source_type?: string
          supported_currencies?: string[] | null
          template_id?: string | null
          total_scrapes?: number | null
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
          country_codes: string[] | null
          created_at: string
          id: string
          name: string
        }
        Insert: {
          code: string
          continent?: string | null
          country_codes?: string[] | null
          created_at?: string
          id?: string
          name: string
        }
        Update: {
          code?: string
          continent?: string | null
          country_codes?: string[] | null
          created_at?: string
          id?: string
          name?: string
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
          {
            foreignKeyName: "notifications_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
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
      proxy_rotation_log: {
        Row: {
          avg_response_time: number | null
          blocked_until: string | null
          created_at: string | null
          id: string
          last_used: string | null
          proxy_id: string | null
          request_count: number | null
          source_id: string | null
          success_rate: number | null
        }
        Insert: {
          avg_response_time?: number | null
          blocked_until?: string | null
          created_at?: string | null
          id?: string
          last_used?: string | null
          proxy_id?: string | null
          request_count?: number | null
          source_id?: string | null
          success_rate?: number | null
        }
        Update: {
          avg_response_time?: number | null
          blocked_until?: string | null
          created_at?: string | null
          id?: string
          last_used?: string | null
          proxy_id?: string | null
          request_count?: number | null
          source_id?: string | null
          success_rate?: number | null
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
          created_at: string | null
          error_message: string | null
          id: string
          job_type: string
          proxy_id: string | null
          results: Json | null
          source_id: string | null
          started_at: string | null
          status: string
          target_url: string
        }
        Insert: {
          completed_at?: string | null
          created_at?: string | null
          error_message?: string | null
          id?: string
          job_type: string
          proxy_id?: string | null
          results?: Json | null
          source_id?: string | null
          started_at?: string | null
          status?: string
          target_url: string
        }
        Update: {
          completed_at?: string | null
          created_at?: string | null
          error_message?: string | null
          id?: string
          job_type?: string
          proxy_id?: string | null
          results?: Json | null
          source_id?: string | null
          started_at?: string | null
          status?: string
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
      scraping_schedules: {
        Row: {
          created_at: string | null
          id: string
          is_active: boolean | null
          last_run: string | null
          max_pages_per_run: number | null
          next_run: string | null
          priority: number | null
          schedule_pattern: string
          source_id: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          is_active?: boolean | null
          last_run?: string | null
          max_pages_per_run?: number | null
          next_run?: string | null
          priority?: number | null
          schedule_pattern: string
          source_id?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          is_active?: boolean | null
          last_run?: string | null
          max_pages_per_run?: number | null
          next_run?: string | null
          priority?: number | null
          schedule_pattern?: string
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
          coins_discovered: number | null
          created_at: string
          data_quality_score: number | null
          date: string
          failed_requests: number | null
          id: string
          source_id: string | null
          successful_requests: number | null
        }
        Insert: {
          avg_response_time?: number | null
          coins_discovered?: number | null
          created_at?: string
          data_quality_score?: number | null
          date?: string
          failed_requests?: number | null
          id?: string
          source_id?: string | null
          successful_requests?: number | null
        }
        Update: {
          avg_response_time?: number | null
          coins_discovered?: number | null
          created_at?: string
          data_quality_score?: number | null
          date?: string
          failed_requests?: number | null
          id?: string
          source_id?: string | null
          successful_requests?: number | null
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
          default_config: Json
          description: string | null
          id: string
          name: string
          supported_features: Json | null
        }
        Insert: {
          created_at?: string
          default_config: Json
          description?: string | null
          id?: string
          name: string
          supported_features?: Json | null
        }
        Update: {
          created_at?: string
          default_config?: Json
          description?: string | null
          id?: string
          name?: string
          supported_features?: Json | null
        }
        Relationships: []
      }
      static_coins_db: {
        Row: {
          base_value: number | null
          category: string | null
          composition: string | null
          country: string | null
          created_at: string | null
          denomination: string | null
          design_type: string | null
          designer: string | null
          diameter: number | null
          edge_type: string | null
          error_variations: string[] | null
          id: string
          mint_location: string | null
          mint_marks: string[] | null
          mintage: number | null
          name: string
          obverse_designer: string | null
          rarity_score: number | null
          reverse_designer: string | null
          specifications: Json | null
          subcategory: string | null
          updated_at: string | null
          variety_notes: string | null
          weight: number | null
          world_region: string | null
          year_end: number | null
          year_start: number | null
        }
        Insert: {
          base_value?: number | null
          category?: string | null
          composition?: string | null
          country?: string | null
          created_at?: string | null
          denomination?: string | null
          design_type?: string | null
          designer?: string | null
          diameter?: number | null
          edge_type?: string | null
          error_variations?: string[] | null
          id?: string
          mint_location?: string | null
          mint_marks?: string[] | null
          mintage?: number | null
          name: string
          obverse_designer?: string | null
          rarity_score?: number | null
          reverse_designer?: string | null
          specifications?: Json | null
          subcategory?: string | null
          updated_at?: string | null
          variety_notes?: string | null
          weight?: number | null
          world_region?: string | null
          year_end?: number | null
          year_start?: number | null
        }
        Update: {
          base_value?: number | null
          category?: string | null
          composition?: string | null
          country?: string | null
          created_at?: string | null
          denomination?: string | null
          design_type?: string | null
          designer?: string | null
          diameter?: number | null
          edge_type?: string | null
          error_variations?: string[] | null
          id?: string
          mint_location?: string | null
          mint_marks?: string[] | null
          mintage?: number | null
          name?: string
          obverse_designer?: string | null
          rarity_score?: number | null
          reverse_designer?: string | null
          specifications?: Json | null
          subcategory?: string | null
          updated_at?: string | null
          variety_notes?: string | null
          weight?: number | null
          world_region?: string | null
          year_end?: number | null
          year_start?: number | null
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
        Relationships: [
          {
            foreignKeyName: "system_config_updated_by_fkey"
            columns: ["updated_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      transactions: {
        Row: {
          amount: number
          buyer_id: string
          coin_id: string
          created_at: string | null
          id: string
          seller_id: string
          status: string
          stripe_payment_intent_id: string | null
          transaction_type: string
        }
        Insert: {
          amount: number
          buyer_id: string
          coin_id: string
          created_at?: string | null
          id?: string
          seller_id: string
          status?: string
          stripe_payment_intent_id?: string | null
          transaction_type?: string
        }
        Update: {
          amount?: number
          buyer_id?: string
          coin_id?: string
          created_at?: string | null
          id?: string
          seller_id?: string
          status?: string
          stripe_payment_intent_id?: string | null
          transaction_type?: string
        }
        Relationships: [
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
          {
            foreignKeyName: "user_favorites_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      vpn_proxies: {
        Row: {
          country_code: string | null
          created_at: string | null
          encrypted_password: string | null
          endpoint: string
          id: string
          is_active: boolean | null
          last_used: string | null
          name: string
          port: number | null
          success_rate: number | null
          type: string
          username: string | null
        }
        Insert: {
          country_code?: string | null
          created_at?: string | null
          encrypted_password?: string | null
          endpoint: string
          id?: string
          is_active?: boolean | null
          last_used?: string | null
          name: string
          port?: number | null
          success_rate?: number | null
          type: string
          username?: string | null
        }
        Update: {
          country_code?: string | null
          created_at?: string | null
          encrypted_password?: string | null
          endpoint?: string
          id?: string
          is_active?: boolean | null
          last_used?: string | null
          name?: string
          port?: number | null
          success_rate?: number | null
          type?: string
          username?: string | null
        }
        Relationships: []
      }
    }
    Views: {
      marketplace_stats: {
        Row: {
          active_auctions: number | null
          listed_coins: number | null
          registered_users: number | null
          total_volume: number | null
          weekly_transactions: number | null
        }
        Relationships: []
      }
    }
    Functions: {
      bulk_import_sources: {
        Args: { sources_data: Json }
        Returns: {
          imported_count: number
          failed_count: number
          errors: string[]
        }[]
      }
      check_auction_end: {
        Args: Record<PropertyKey, never>
        Returns: undefined
      }
      decrypt_api_key: {
        Args: { encrypted_key: string }
        Returns: string
      }
      encrypt_api_key: {
        Args: { plain_key: string }
        Returns: string
      }
      generate_presigned_url: {
        Args: { bucket_name: string; file_name: string }
        Returns: string
      }
      is_admin: {
        Args: { user_id: string }
        Returns: boolean
      }
      log_admin_activity: {
        Args: {
          action_type: string
          target_type: string
          target_id?: string
          details?: Json
        }
        Returns: undefined
      }
      log_console_error: {
        Args: {
          error_level_param: string
          message_param: string
          source_file_param?: string
          line_number_param?: number
          column_number_param?: number
          session_id_param?: string
        }
        Returns: string
      }
      log_error: {
        Args: {
          error_type_param: string
          message_param: string
          stack_trace_param?: string
          page_url_param?: string
          user_agent_param?: string
        }
        Returns: string
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
