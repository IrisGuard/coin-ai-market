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
      ai_command_categories: {
        Row: {
          color: string | null
          created_at: string | null
          description: string | null
          display_order: number | null
          icon: string | null
          id: string
          is_active: boolean | null
          name: string
        }
        Insert: {
          color?: string | null
          created_at?: string | null
          description?: string | null
          display_order?: number | null
          icon?: string | null
          id?: string
          is_active?: boolean | null
          name: string
        }
        Update: {
          color?: string | null
          created_at?: string | null
          description?: string | null
          display_order?: number | null
          icon?: string | null
          id?: string
          is_active?: boolean | null
          name?: string
        }
        Relationships: []
      }
      ai_command_execution_logs: {
        Row: {
          command_id: string | null
          cost_usd: number | null
          created_at: string | null
          error_message: string | null
          execution_time_ms: number | null
          id: string
          input_tokens: number | null
          output_tokens: number | null
          performance_score: number | null
          success: boolean | null
          user_id: string | null
        }
        Insert: {
          command_id?: string | null
          cost_usd?: number | null
          created_at?: string | null
          error_message?: string | null
          execution_time_ms?: number | null
          id?: string
          input_tokens?: number | null
          output_tokens?: number | null
          performance_score?: number | null
          success?: boolean | null
          user_id?: string | null
        }
        Update: {
          command_id?: string | null
          cost_usd?: number | null
          created_at?: string | null
          error_message?: string | null
          execution_time_ms?: number | null
          id?: string
          input_tokens?: number | null
          output_tokens?: number | null
          performance_score?: number | null
          success?: boolean | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "ai_command_execution_logs_command_id_fkey"
            columns: ["command_id"]
            isOneToOne: false
            referencedRelation: "ai_commands"
            referencedColumns: ["id"]
          },
        ]
      }
      ai_command_executions: {
        Row: {
          command_id: string | null
          completed_at: string | null
          created_at: string | null
          error_message: string | null
          execution_status: string | null
          execution_time_ms: number | null
          id: string
          input_data: Json | null
          output_data: Json | null
          user_id: string | null
        }
        Insert: {
          command_id?: string | null
          completed_at?: string | null
          created_at?: string | null
          error_message?: string | null
          execution_status?: string | null
          execution_time_ms?: number | null
          id?: string
          input_data?: Json | null
          output_data?: Json | null
          user_id?: string | null
        }
        Update: {
          command_id?: string | null
          completed_at?: string | null
          created_at?: string | null
          error_message?: string | null
          execution_status?: string | null
          execution_time_ms?: number | null
          id?: string
          input_data?: Json | null
          output_data?: Json | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "ai_command_executions_command_id_fkey"
            columns: ["command_id"]
            isOneToOne: false
            referencedRelation: "ai_commands"
            referencedColumns: ["id"]
          },
        ]
      }
      ai_command_workflows: {
        Row: {
          command_sequence: Json
          created_at: string | null
          created_by: string | null
          description: string | null
          execution_count: number | null
          id: string
          is_active: boolean | null
          name: string
          success_rate: number | null
          trigger_conditions: Json | null
        }
        Insert: {
          command_sequence?: Json
          created_at?: string | null
          created_by?: string | null
          description?: string | null
          execution_count?: number | null
          id?: string
          is_active?: boolean | null
          name: string
          success_rate?: number | null
          trigger_conditions?: Json | null
        }
        Update: {
          command_sequence?: Json
          created_at?: string | null
          created_by?: string | null
          description?: string | null
          execution_count?: number | null
          id?: string
          is_active?: boolean | null
          name?: string
          success_rate?: number | null
          trigger_conditions?: Json | null
        }
        Relationships: []
      }
      ai_commands: {
        Row: {
          category: string | null
          code: string
          command_type: string | null
          created_at: string | null
          created_by: string | null
          description: string | null
          execution_timeout: number | null
          id: string
          input_schema: Json | null
          is_active: boolean | null
          name: string
          output_schema: Json | null
          priority: number | null
          required_permissions: string[] | null
          site_url: string | null
          updated_at: string | null
        }
        Insert: {
          category?: string | null
          code: string
          command_type?: string | null
          created_at?: string | null
          created_by?: string | null
          description?: string | null
          execution_timeout?: number | null
          id?: string
          input_schema?: Json | null
          is_active?: boolean | null
          name: string
          output_schema?: Json | null
          priority?: number | null
          required_permissions?: string[] | null
          site_url?: string | null
          updated_at?: string | null
        }
        Update: {
          category?: string | null
          code?: string
          command_type?: string | null
          created_at?: string | null
          created_by?: string | null
          description?: string | null
          execution_timeout?: number | null
          id?: string
          input_schema?: Json | null
          is_active?: boolean | null
          name?: string
          output_schema?: Json | null
          priority?: number | null
          required_permissions?: string[] | null
          site_url?: string | null
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
      ai_error_detection_logs: {
        Row: {
          accuracy_verified: boolean | null
          actual_errors: Json | null
          confidence_scores: Json | null
          created_at: string | null
          detected_errors: Json | null
          id: string
          image_hash: string
          processing_time_ms: number | null
          session_id: string | null
          user_feedback: Json | null
        }
        Insert: {
          accuracy_verified?: boolean | null
          actual_errors?: Json | null
          confidence_scores?: Json | null
          created_at?: string | null
          detected_errors?: Json | null
          id?: string
          image_hash: string
          processing_time_ms?: number | null
          session_id?: string | null
          user_feedback?: Json | null
        }
        Update: {
          accuracy_verified?: boolean | null
          actual_errors?: Json | null
          confidence_scores?: Json | null
          created_at?: string | null
          detected_errors?: Json | null
          id?: string
          image_hash?: string
          processing_time_ms?: number | null
          session_id?: string | null
          user_feedback?: Json | null
        }
        Relationships: []
      }
      ai_performance_analytics: {
        Row: {
          command_id: string | null
          execution_context: Json | null
          id: string
          metric_name: string
          metric_type: string
          metric_value: number
          recorded_at: string | null
          user_id: string | null
        }
        Insert: {
          command_id?: string | null
          execution_context?: Json | null
          id?: string
          metric_name: string
          metric_type: string
          metric_value: number
          recorded_at?: string | null
          user_id?: string | null
        }
        Update: {
          command_id?: string | null
          execution_context?: Json | null
          id?: string
          metric_name?: string
          metric_type?: string
          metric_value?: number
          recorded_at?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "ai_performance_analytics_command_id_fkey"
            columns: ["command_id"]
            isOneToOne: false
            referencedRelation: "ai_commands"
            referencedColumns: ["id"]
          },
        ]
      }
      ai_performance_metrics: {
        Row: {
          id: string
          metadata: Json | null
          metric_name: string
          metric_type: string
          metric_value: number
          recorded_at: string | null
          related_id: string | null
        }
        Insert: {
          id?: string
          metadata?: Json | null
          metric_name: string
          metric_type: string
          metric_value: number
          recorded_at?: string | null
          related_id?: string | null
        }
        Update: {
          id?: string
          metadata?: Json | null
          metric_name?: string
          metric_type?: string
          metric_value?: number
          recorded_at?: string | null
          related_id?: string | null
        }
        Relationships: []
      }
      ai_recognition_cache: {
        Row: {
          confidence_score: number | null
          created_at: string | null
          discovery_version: string | null
          error_patterns: Json | null
          global_sources_count: number | null
          id: string
          image_hash: string
          market_analysis: Json | null
          multi_language_data: Json | null
          processing_time_ms: number | null
          recognition_results: Json
          sources_consulted: string[] | null
          updated_at: string | null
        }
        Insert: {
          confidence_score?: number | null
          created_at?: string | null
          discovery_version?: string | null
          error_patterns?: Json | null
          global_sources_count?: number | null
          id?: string
          image_hash: string
          market_analysis?: Json | null
          multi_language_data?: Json | null
          processing_time_ms?: number | null
          recognition_results?: Json
          sources_consulted?: string[] | null
          updated_at?: string | null
        }
        Update: {
          confidence_score?: number | null
          created_at?: string | null
          discovery_version?: string | null
          error_patterns?: Json | null
          global_sources_count?: number | null
          id?: string
          image_hash?: string
          market_analysis?: Json | null
          multi_language_data?: Json | null
          processing_time_ms?: number | null
          recognition_results?: Json
          sources_consulted?: string[] | null
          updated_at?: string | null
        }
        Relationships: []
      }
      ai_search_filters: {
        Row: {
          ai_prompt: string
          confidence_threshold: number | null
          created_at: string | null
          filter_name: string
          filter_type: string
          id: string
          is_active: boolean | null
          usage_count: number | null
        }
        Insert: {
          ai_prompt: string
          confidence_threshold?: number | null
          created_at?: string | null
          filter_name: string
          filter_type: string
          id?: string
          is_active?: boolean | null
          usage_count?: number | null
        }
        Update: {
          ai_prompt?: string
          confidence_threshold?: number | null
          created_at?: string | null
          filter_name?: string
          filter_type?: string
          id?: string
          is_active?: boolean | null
          usage_count?: number | null
        }
        Relationships: []
      }
      ai_training_data: {
        Row: {
          coin_identification: Json
          contributed_by: string | null
          created_at: string | null
          error_annotations: Json | null
          id: string
          image_hash: string
          image_url: string
          training_quality_score: number | null
          updated_at: string | null
          validated_by: string | null
          validation_status: string | null
        }
        Insert: {
          coin_identification: Json
          contributed_by?: string | null
          created_at?: string | null
          error_annotations?: Json | null
          id?: string
          image_hash: string
          image_url: string
          training_quality_score?: number | null
          updated_at?: string | null
          validated_by?: string | null
          validation_status?: string | null
        }
        Update: {
          coin_identification?: Json
          contributed_by?: string | null
          created_at?: string | null
          error_annotations?: Json | null
          id?: string
          image_hash?: string
          image_url?: string
          training_quality_score?: number | null
          updated_at?: string | null
          validated_by?: string | null
          validation_status?: string | null
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
      api_key_rotations: {
        Row: {
          api_key_id: string | null
          id: string
          new_key_hash: string
          old_key_expires_at: string | null
          old_key_hash: string
          rotated_by: string | null
          rotation_date: string | null
          rotation_reason: string | null
        }
        Insert: {
          api_key_id?: string | null
          id?: string
          new_key_hash: string
          old_key_expires_at?: string | null
          old_key_hash: string
          rotated_by?: string | null
          rotation_date?: string | null
          rotation_reason?: string | null
        }
        Update: {
          api_key_id?: string | null
          id?: string
          new_key_hash?: string
          old_key_expires_at?: string | null
          old_key_hash?: string
          rotated_by?: string | null
          rotation_date?: string | null
          rotation_reason?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "api_key_rotations_api_key_id_fkey"
            columns: ["api_key_id"]
            isOneToOne: false
            referencedRelation: "api_keys"
            referencedColumns: ["id"]
          },
        ]
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
      automation_rules: {
        Row: {
          actions: Json
          conditions: Json | null
          created_at: string | null
          created_by: string | null
          description: string | null
          execution_count: number | null
          id: string
          is_active: boolean | null
          last_executed: string | null
          name: string
          rule_type: string
          success_count: number | null
          trigger_config: Json
          updated_at: string | null
        }
        Insert: {
          actions?: Json
          conditions?: Json | null
          created_at?: string | null
          created_by?: string | null
          description?: string | null
          execution_count?: number | null
          id?: string
          is_active?: boolean | null
          last_executed?: string | null
          name: string
          rule_type?: string
          success_count?: number | null
          trigger_config?: Json
          updated_at?: string | null
        }
        Update: {
          actions?: Json
          conditions?: Json | null
          created_at?: string | null
          created_by?: string | null
          description?: string | null
          execution_count?: number | null
          id?: string
          is_active?: boolean | null
          last_executed?: string | null
          name?: string
          rule_type?: string
          success_count?: number | null
          trigger_config?: Json
          updated_at?: string | null
        }
        Relationships: []
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
      bulk_operations: {
        Row: {
          completed_at: string | null
          error_log: Json | null
          failed_records: number | null
          id: string
          operation_name: string
          operation_parameters: Json | null
          operation_type: string
          processed_records: number | null
          started_at: string | null
          started_by: string | null
          status: string | null
          target_table: string
          total_records: number | null
        }
        Insert: {
          completed_at?: string | null
          error_log?: Json | null
          failed_records?: number | null
          id?: string
          operation_name: string
          operation_parameters?: Json | null
          operation_type: string
          processed_records?: number | null
          started_at?: string | null
          started_by?: string | null
          status?: string | null
          target_table: string
          total_records?: number | null
        }
        Update: {
          completed_at?: string | null
          error_log?: Json | null
          failed_records?: number | null
          id?: string
          operation_name?: string
          operation_parameters?: Json | null
          operation_type?: string
          processed_records?: number | null
          started_at?: string | null
          started_by?: string | null
          status?: string | null
          target_table?: string
          total_records?: number | null
        }
        Relationships: []
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
      coin_inscriptions: {
        Row: {
          confidence_score: number | null
          created_at: string | null
          english_translation: string | null
          id: string
          image_hash: string
          ocr_engine: string | null
          original_language: string | null
          original_text: string | null
          translation_engine: string | null
        }
        Insert: {
          confidence_score?: number | null
          created_at?: string | null
          english_translation?: string | null
          id?: string
          image_hash: string
          ocr_engine?: string | null
          original_language?: string | null
          original_text?: string | null
          translation_engine?: string | null
        }
        Update: {
          confidence_score?: number | null
          created_at?: string | null
          english_translation?: string | null
          id?: string
          image_hash?: string
          ocr_engine?: string | null
          original_language?: string | null
          original_text?: string | null
          translation_engine?: string | null
        }
        Relationships: []
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
          images: string[] | null
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
          images?: string[] | null
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
          images?: string[] | null
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
      command_queue: {
        Row: {
          command_id: string | null
          created_at: string | null
          created_by: string | null
          error_message: string | null
          execution_completed: string | null
          execution_started: string | null
          id: string
          input_data: Json | null
          max_retries: number | null
          priority: number | null
          result_data: Json | null
          retry_count: number | null
          scheduled_at: string | null
          status: string | null
        }
        Insert: {
          command_id?: string | null
          created_at?: string | null
          created_by?: string | null
          error_message?: string | null
          execution_completed?: string | null
          execution_started?: string | null
          id?: string
          input_data?: Json | null
          max_retries?: number | null
          priority?: number | null
          result_data?: Json | null
          retry_count?: number | null
          scheduled_at?: string | null
          status?: string | null
        }
        Update: {
          command_id?: string | null
          created_at?: string | null
          created_by?: string | null
          error_message?: string | null
          execution_completed?: string | null
          execution_started?: string | null
          id?: string
          input_data?: Json | null
          max_retries?: number | null
          priority?: number | null
          result_data?: Json | null
          retry_count?: number | null
          scheduled_at?: string | null
          status?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "command_queue_command_id_fkey"
            columns: ["command_id"]
            isOneToOne: false
            referencedRelation: "ai_commands"
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
      data_quality_reports: {
        Row: {
          accuracy_score: number | null
          completeness_score: number | null
          consistency_score: number | null
          id: string
          quality_issues: Json | null
          quality_score: number
          recommendations: Json | null
          report_date: string | null
          source_id: string | null
          timeliness_score: number | null
        }
        Insert: {
          accuracy_score?: number | null
          completeness_score?: number | null
          consistency_score?: number | null
          id?: string
          quality_issues?: Json | null
          quality_score: number
          recommendations?: Json | null
          report_date?: string | null
          source_id?: string | null
          timeliness_score?: number | null
        }
        Update: {
          accuracy_score?: number | null
          completeness_score?: number | null
          consistency_score?: number | null
          id?: string
          quality_issues?: Json | null
          quality_score?: number
          recommendations?: Json | null
          report_date?: string | null
          source_id?: string | null
          timeliness_score?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "data_quality_reports_source_id_fkey"
            columns: ["source_id"]
            isOneToOne: false
            referencedRelation: "external_price_sources"
            referencedColumns: ["id"]
          },
        ]
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
      dual_image_analysis: {
        Row: {
          analysis_results: Json | null
          back_image_hash: string | null
          back_image_url: string
          confidence_score: number | null
          created_at: string | null
          detected_errors: string[] | null
          estimated_value_range: Json | null
          front_image_hash: string | null
          front_image_url: string
          grade_assessment: string | null
          id: string
          rarity_score: number | null
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          analysis_results?: Json | null
          back_image_hash?: string | null
          back_image_url: string
          confidence_score?: number | null
          created_at?: string | null
          detected_errors?: string[] | null
          estimated_value_range?: Json | null
          front_image_hash?: string | null
          front_image_url: string
          grade_assessment?: string | null
          id?: string
          rarity_score?: number | null
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          analysis_results?: Json | null
          back_image_hash?: string | null
          back_image_url?: string
          confidence_score?: number | null
          created_at?: string | null
          detected_errors?: string[] | null
          estimated_value_range?: Json | null
          front_image_hash?: string | null
          front_image_url?: string
          grade_assessment?: string | null
          id?: string
          rarity_score?: number | null
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      error_coins_knowledge: {
        Row: {
          ai_detection_markers: Json | null
          common_mistakes: string[] | null
          created_at: string
          cross_reference_coins: string[] | null
          description: string
          detection_algorithm: string | null
          detection_difficulty: number | null
          detection_keywords: string[] | null
          error_category: string
          error_name: string
          error_type: string
          false_positive_rate: number | null
          historical_significance: string | null
          id: string
          identification_techniques: string[] | null
          market_premium_multiplier: number | null
          pattern_signature: Json | null
          rarity_score: number | null
          reference_links: string[] | null
          severity_level: number | null
          technical_specifications: Json | null
          updated_at: string
          visual_markers: Json | null
          visual_markers_ai: Json | null
        }
        Insert: {
          ai_detection_markers?: Json | null
          common_mistakes?: string[] | null
          created_at?: string
          cross_reference_coins?: string[] | null
          description: string
          detection_algorithm?: string | null
          detection_difficulty?: number | null
          detection_keywords?: string[] | null
          error_category: string
          error_name: string
          error_type: string
          false_positive_rate?: number | null
          historical_significance?: string | null
          id?: string
          identification_techniques?: string[] | null
          market_premium_multiplier?: number | null
          pattern_signature?: Json | null
          rarity_score?: number | null
          reference_links?: string[] | null
          severity_level?: number | null
          technical_specifications?: Json | null
          updated_at?: string
          visual_markers?: Json | null
          visual_markers_ai?: Json | null
        }
        Update: {
          ai_detection_markers?: Json | null
          common_mistakes?: string[] | null
          created_at?: string
          cross_reference_coins?: string[] | null
          description?: string
          detection_algorithm?: string | null
          detection_difficulty?: number | null
          detection_keywords?: string[] | null
          error_category?: string
          error_name?: string
          error_type?: string
          false_positive_rate?: number | null
          historical_significance?: string | null
          id?: string
          identification_techniques?: string[] | null
          market_premium_multiplier?: number | null
          pattern_signature?: Json | null
          rarity_score?: number | null
          reference_links?: string[] | null
          severity_level?: number | null
          technical_specifications?: Json | null
          updated_at?: string
          visual_markers?: Json | null
          visual_markers_ai?: Json | null
        }
        Relationships: []
      }
      error_coins_market_data: {
        Row: {
          auction_vs_retail_ratio: number | null
          condition_adjustments: Json | null
          created_at: string
          data_confidence: number | null
          grade: string
          grade_impact_factor: number | null
          id: string
          knowledge_base_id: string | null
          last_sale_price: number | null
          market_trend: string | null
          market_value_avg: number | null
          market_value_high: number | null
          market_value_low: number | null
          premium_percentage: number | null
          regional_pricing: Json | null
          source_references: string[] | null
          static_coin_id: string | null
          updated_at: string
        }
        Insert: {
          auction_vs_retail_ratio?: number | null
          condition_adjustments?: Json | null
          created_at?: string
          data_confidence?: number | null
          grade: string
          grade_impact_factor?: number | null
          id?: string
          knowledge_base_id?: string | null
          last_sale_price?: number | null
          market_trend?: string | null
          market_value_avg?: number | null
          market_value_high?: number | null
          market_value_low?: number | null
          premium_percentage?: number | null
          regional_pricing?: Json | null
          source_references?: string[] | null
          static_coin_id?: string | null
          updated_at?: string
        }
        Update: {
          auction_vs_retail_ratio?: number | null
          condition_adjustments?: Json | null
          created_at?: string
          data_confidence?: number | null
          grade?: string
          grade_impact_factor?: number | null
          id?: string
          knowledge_base_id?: string | null
          last_sale_price?: number | null
          market_trend?: string | null
          market_value_avg?: number | null
          market_value_high?: number | null
          market_value_low?: number | null
          premium_percentage?: number | null
          regional_pricing?: Json | null
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
      error_pattern_matches: {
        Row: {
          analysis_id: string | null
          confidence_score: number | null
          created_at: string | null
          error_description: string | null
          error_type: string
          estimated_premium: number | null
          id: string
          rarity_multiplier: number | null
          reference_images: string[] | null
        }
        Insert: {
          analysis_id?: string | null
          confidence_score?: number | null
          created_at?: string | null
          error_description?: string | null
          error_type: string
          estimated_premium?: number | null
          id?: string
          rarity_multiplier?: number | null
          reference_images?: string[] | null
        }
        Update: {
          analysis_id?: string | null
          confidence_score?: number | null
          created_at?: string | null
          error_description?: string | null
          error_type?: string
          estimated_premium?: number | null
          id?: string
          rarity_multiplier?: number | null
          reference_images?: string[] | null
        }
        Relationships: [
          {
            foreignKeyName: "error_pattern_matches_analysis_id_fkey"
            columns: ["analysis_id"]
            isOneToOne: false
            referencedRelation: "dual_image_analysis"
            referencedColumns: ["id"]
          },
        ]
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
          error_categories: string[] | null
          id: string
          is_active: boolean | null
          market_focus: string[] | null
          pricing_methodology: string | null
          priority_score: number | null
          rate_limit_per_hour: number | null
          region_id: string | null
          reliability_score: number | null
          requires_proxy: boolean | null
          scraping_enabled: boolean | null
          source_name: string
          source_type: string
          specializes_in_errors: boolean | null
          supported_currencies: string[] | null
          template_id: string | null
          update_frequency_hours: number | null
          updated_at: string | null
        }
        Insert: {
          base_url: string
          category_id?: string | null
          created_at?: string
          error_categories?: string[] | null
          id?: string
          is_active?: boolean | null
          market_focus?: string[] | null
          pricing_methodology?: string | null
          priority_score?: number | null
          rate_limit_per_hour?: number | null
          region_id?: string | null
          reliability_score?: number | null
          requires_proxy?: boolean | null
          scraping_enabled?: boolean | null
          source_name: string
          source_type: string
          specializes_in_errors?: boolean | null
          supported_currencies?: string[] | null
          template_id?: string | null
          update_frequency_hours?: number | null
          updated_at?: string | null
        }
        Update: {
          base_url?: string
          category_id?: string | null
          created_at?: string
          error_categories?: string[] | null
          id?: string
          is_active?: boolean | null
          market_focus?: string[] | null
          pricing_methodology?: string | null
          priority_score?: number | null
          rate_limit_per_hour?: number | null
          region_id?: string | null
          reliability_score?: number | null
          requires_proxy?: boolean | null
          scraping_enabled?: boolean | null
          source_name?: string
          source_type?: string
          specializes_in_errors?: boolean | null
          supported_currencies?: string[] | null
          template_id?: string | null
          update_frequency_hours?: number | null
          updated_at?: string | null
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
      global_banknote_sources: {
        Row: {
          base_url: string
          country: string
          created_at: string
          id: string
          is_active: boolean
          language: string
          last_scraped: string | null
          priority: number
          response_time_avg: number | null
          source_name: string
          source_type: string
          specialization: string[] | null
          success_rate: number
          updated_at: string
        }
        Insert: {
          base_url: string
          country?: string
          created_at?: string
          id?: string
          is_active?: boolean
          language?: string
          last_scraped?: string | null
          priority?: number
          response_time_avg?: number | null
          source_name: string
          source_type?: string
          specialization?: string[] | null
          success_rate?: number
          updated_at?: string
        }
        Update: {
          base_url?: string
          country?: string
          created_at?: string
          id?: string
          is_active?: boolean
          language?: string
          last_scraped?: string | null
          priority?: number
          response_time_avg?: number | null
          source_name?: string
          source_type?: string
          specialization?: string[] | null
          success_rate?: number
          updated_at?: string
        }
        Relationships: []
      }
      global_bullion_sources: {
        Row: {
          base_url: string
          country: string
          created_at: string
          id: string
          is_active: boolean
          language: string
          last_scraped: string | null
          metal_types: string[] | null
          priority: number
          response_time_avg: number | null
          source_name: string
          source_type: string
          success_rate: number
          updated_at: string
        }
        Insert: {
          base_url: string
          country?: string
          created_at?: string
          id?: string
          is_active?: boolean
          language?: string
          last_scraped?: string | null
          metal_types?: string[] | null
          priority?: number
          response_time_avg?: number | null
          source_name: string
          source_type?: string
          success_rate?: number
          updated_at?: string
        }
        Update: {
          base_url?: string
          country?: string
          created_at?: string
          id?: string
          is_active?: boolean
          language?: string
          last_scraped?: string | null
          metal_types?: string[] | null
          priority?: number
          response_time_avg?: number | null
          source_name?: string
          source_type?: string
          success_rate?: number
          updated_at?: string
        }
        Relationships: []
      }
      global_coin_learning: {
        Row: {
          accuracy_score: number | null
          coin_identifier: string
          created_at: string | null
          id: string
          image_hash: string | null
          learned_data: Json
          source_urls: string[] | null
          updated_at: string | null
          verification_count: number | null
        }
        Insert: {
          accuracy_score?: number | null
          coin_identifier: string
          created_at?: string | null
          id?: string
          image_hash?: string | null
          learned_data: Json
          source_urls?: string[] | null
          updated_at?: string | null
          verification_count?: number | null
        }
        Update: {
          accuracy_score?: number | null
          coin_identifier?: string
          created_at?: string | null
          id?: string
          image_hash?: string | null
          learned_data?: Json
          source_urls?: string[] | null
          updated_at?: string | null
          verification_count?: number | null
        }
        Relationships: []
      }
      global_coin_sources: {
        Row: {
          base_url: string
          country: string | null
          created_at: string | null
          id: string
          is_active: boolean | null
          language: string | null
          last_scraped: string | null
          metadata: Json | null
          priority: number | null
          rate_limit_per_minute: number | null
          response_time_avg: number | null
          scraping_config: Json | null
          source_name: string
          source_type: string
          specialization: string[] | null
          success_rate: number | null
          updated_at: string | null
        }
        Insert: {
          base_url: string
          country?: string | null
          created_at?: string | null
          id?: string
          is_active?: boolean | null
          language?: string | null
          last_scraped?: string | null
          metadata?: Json | null
          priority?: number | null
          rate_limit_per_minute?: number | null
          response_time_avg?: number | null
          scraping_config?: Json | null
          source_name: string
          source_type?: string
          specialization?: string[] | null
          success_rate?: number | null
          updated_at?: string | null
        }
        Update: {
          base_url?: string
          country?: string | null
          created_at?: string | null
          id?: string
          is_active?: boolean | null
          language?: string | null
          last_scraped?: string | null
          metadata?: Json | null
          priority?: number | null
          rate_limit_per_minute?: number | null
          response_time_avg?: number | null
          scraping_config?: Json | null
          source_name?: string
          source_type?: string
          specialization?: string[] | null
          success_rate?: number | null
          updated_at?: string | null
        }
        Relationships: []
      }
      lock_options: {
        Row: {
          benefit_percentage: number
          display_order: number | null
          duration_months: number
          id: string
          is_active: boolean | null
          is_maximum: boolean | null
          is_popular: boolean | null
        }
        Insert: {
          benefit_percentage: number
          display_order?: number | null
          duration_months: number
          id?: string
          is_active?: boolean | null
          is_maximum?: boolean | null
          is_popular?: boolean | null
        }
        Update: {
          benefit_percentage?: number
          display_order?: number | null
          duration_months?: number
          id?: string
          is_active?: boolean | null
          is_maximum?: boolean | null
          is_popular?: boolean | null
        }
        Relationships: []
      }
      market_analysis_results: {
        Row: {
          analysis_id: string | null
          created_at: string | null
          current_market_value: Json | null
          id: string
          investment_recommendation: string | null
          market_outlook: string | null
          population_data: Json | null
          price_trends: Json | null
          recent_sales: Json | null
          updated_at: string | null
        }
        Insert: {
          analysis_id?: string | null
          created_at?: string | null
          current_market_value?: Json | null
          id?: string
          investment_recommendation?: string | null
          market_outlook?: string | null
          population_data?: Json | null
          price_trends?: Json | null
          recent_sales?: Json | null
          updated_at?: string | null
        }
        Update: {
          analysis_id?: string | null
          created_at?: string | null
          current_market_value?: Json | null
          id?: string
          investment_recommendation?: string | null
          market_outlook?: string | null
          population_data?: Json | null
          price_trends?: Json | null
          recent_sales?: Json | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "market_analysis_results_analysis_id_fkey"
            columns: ["analysis_id"]
            isOneToOne: false
            referencedRelation: "dual_image_analysis"
            referencedColumns: ["id"]
          },
        ]
      }
      market_analytics: {
        Row: {
          category_breakdown: Json | null
          geographic_data: Json | null
          id: string
          metric_name: string
          metric_type: string
          metric_value: number
          recorded_at: string | null
          time_period: string
          trend_analysis: Json | null
        }
        Insert: {
          category_breakdown?: Json | null
          geographic_data?: Json | null
          id?: string
          metric_name: string
          metric_type: string
          metric_value: number
          recorded_at?: string | null
          time_period?: string
          trend_analysis?: Json | null
        }
        Update: {
          category_breakdown?: Json | null
          geographic_data?: Json | null
          id?: string
          metric_name?: string
          metric_type?: string
          metric_value?: number
          recorded_at?: string | null
          time_period?: string
          trend_analysis?: Json | null
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
      performance_benchmarks: {
        Row: {
          baseline_value: number
          benchmark_type: string
          current_value: number
          id: string
          improvement_suggestions: string[] | null
          last_updated: string | null
          metric_name: string
          threshold_critical: number | null
          threshold_warning: number | null
        }
        Insert: {
          baseline_value: number
          benchmark_type: string
          current_value: number
          id?: string
          improvement_suggestions?: string[] | null
          last_updated?: string | null
          metric_name: string
          threshold_critical?: number | null
          threshold_warning?: number | null
        }
        Update: {
          baseline_value?: number
          benchmark_type?: string
          current_value?: number
          id?: string
          improvement_suggestions?: string[] | null
          last_updated?: string | null
          metric_name?: string
          threshold_critical?: number | null
          threshold_warning?: number | null
        }
        Relationships: []
      }
      performance_metrics: {
        Row: {
          browser_info: Json | null
          created_at: string | null
          id: string
          load_time_ms: number
          page_url: string
          user_id: string | null
        }
        Insert: {
          browser_info?: Json | null
          created_at?: string | null
          id?: string
          load_time_ms: number
          page_url: string
          user_id?: string | null
        }
        Update: {
          browser_info?: Json | null
          created_at?: string | null
          id?: string
          load_time_ms?: number
          page_url?: string
          user_id?: string | null
        }
        Relationships: []
      }
      photo_quality_assessments: {
        Row: {
          angle_score: number | null
          background_score: number | null
          created_at: string | null
          focus_score: number | null
          id: string
          ideal_for_error_detection: boolean | null
          image_hash: string
          lighting_score: number | null
          quality_score: number | null
          recommendations: string[] | null
          resolution_score: number | null
        }
        Insert: {
          angle_score?: number | null
          background_score?: number | null
          created_at?: string | null
          focus_score?: number | null
          id?: string
          ideal_for_error_detection?: boolean | null
          image_hash: string
          lighting_score?: number | null
          quality_score?: number | null
          recommendations?: string[] | null
          resolution_score?: number | null
        }
        Update: {
          angle_score?: number | null
          background_score?: number | null
          created_at?: string | null
          focus_score?: number | null
          id?: string
          ideal_for_error_detection?: boolean | null
          image_hash?: string
          lighting_score?: number | null
          quality_score?: number | null
          recommendations?: string[] | null
          resolution_score?: number | null
        }
        Relationships: []
      }
      prediction_models: {
        Row: {
          accuracy_score: number | null
          created_at: string | null
          id: string
          is_active: boolean | null
          last_trained: string | null
          model_parameters: Json | null
          model_type: string
          name: string
          target_metric: string
          training_data_config: Json | null
          updated_at: string | null
        }
        Insert: {
          accuracy_score?: number | null
          created_at?: string | null
          id?: string
          is_active?: boolean | null
          last_trained?: string | null
          model_parameters?: Json | null
          model_type: string
          name: string
          target_metric: string
          training_data_config?: Json | null
          updated_at?: string | null
        }
        Update: {
          accuracy_score?: number | null
          created_at?: string | null
          id?: string
          is_active?: boolean | null
          last_trained?: string | null
          model_parameters?: Json | null
          model_type?: string
          name?: string
          target_metric?: string
          training_data_config?: Json | null
          updated_at?: string | null
        }
        Relationships: []
      }
      price_source_templates_enhanced: {
        Row: {
          created_at: string | null
          error_handling: Json | null
          extraction_rules: Json
          id: string
          is_active: boolean | null
          last_tested: string | null
          source_type: string
          success_rate: number | null
          template_name: string
          transformation_rules: Json | null
          validation_rules: Json | null
        }
        Insert: {
          created_at?: string | null
          error_handling?: Json | null
          extraction_rules: Json
          id?: string
          is_active?: boolean | null
          last_tested?: string | null
          source_type: string
          success_rate?: number | null
          template_name: string
          transformation_rules?: Json | null
          validation_rules?: Json | null
        }
        Update: {
          created_at?: string | null
          error_handling?: Json | null
          extraction_rules?: Json
          id?: string
          is_active?: boolean | null
          last_tested?: string | null
          source_type?: string
          success_rate?: number | null
          template_name?: string
          transformation_rules?: Json | null
          validation_rules?: Json | null
        }
        Relationships: []
      }
      production_test_results: {
        Row: {
          created_at: string | null
          id: string
          overall_score: number | null
          overall_status: string
          samples_tested: number | null
          test_duration: number | null
          test_results: Json
          test_type: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          overall_score?: number | null
          overall_status: string
          samples_tested?: number | null
          test_duration?: number | null
          test_results: Json
          test_type: string
        }
        Update: {
          created_at?: string | null
          id?: string
          overall_score?: number | null
          overall_status?: string
          samples_tested?: number | null
          test_duration?: number | null
          test_results?: Json
          test_type?: string
        }
        Relationships: []
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
      referrals: {
        Row: {
          commission_rate: number | null
          created_at: string | null
          id: string
          referral_code: string
          referred_id: string | null
          referrer_id: string
          total_earned: number | null
          total_referrals: number | null
          updated_at: string | null
        }
        Insert: {
          commission_rate?: number | null
          created_at?: string | null
          id?: string
          referral_code: string
          referred_id?: string | null
          referrer_id: string
          total_earned?: number | null
          total_referrals?: number | null
          updated_at?: string | null
        }
        Update: {
          commission_rate?: number | null
          created_at?: string | null
          id?: string
          referral_code?: string
          referred_id?: string | null
          referrer_id?: string
          total_earned?: number | null
          total_referrals?: number | null
          updated_at?: string | null
        }
        Relationships: []
      }
      revenue_forecasts: {
        Row: {
          confidence_score: number | null
          contributing_factors: Json | null
          created_at: string | null
          forecast_period: string
          forecast_type: string
          id: string
          model_parameters: Json | null
          predicted_revenue: number
        }
        Insert: {
          confidence_score?: number | null
          contributing_factors?: Json | null
          created_at?: string | null
          forecast_period: string
          forecast_type: string
          id?: string
          model_parameters?: Json | null
          predicted_revenue: number
        }
        Update: {
          confidence_score?: number | null
          contributing_factors?: Json | null
          created_at?: string | null
          forecast_period?: string
          forecast_type?: string
          id?: string
          model_parameters?: Json | null
          predicted_revenue?: number
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
      search_analytics: {
        Row: {
          clicked_results: Json | null
          created_at: string | null
          filters_applied: Json | null
          id: string
          results_count: number | null
          search_duration_ms: number | null
          search_query: string
          user_id: string | null
        }
        Insert: {
          clicked_results?: Json | null
          created_at?: string | null
          filters_applied?: Json | null
          id?: string
          results_count?: number | null
          search_duration_ms?: number | null
          search_query: string
          user_id?: string | null
        }
        Update: {
          clicked_results?: Json | null
          created_at?: string | null
          filters_applied?: Json | null
          id?: string
          results_count?: number | null
          search_duration_ms?: number | null
          search_query?: string
          user_id?: string | null
        }
        Relationships: []
      }
      security_incidents: {
        Row: {
          affected_users: Json | null
          assigned_to: string | null
          created_at: string | null
          description: string | null
          id: string
          incident_data: Json | null
          incident_type: string
          resolved_at: string | null
          severity_level: string
          status: string | null
          title: string
        }
        Insert: {
          affected_users?: Json | null
          assigned_to?: string | null
          created_at?: string | null
          description?: string | null
          id?: string
          incident_data?: Json | null
          incident_type: string
          resolved_at?: string | null
          severity_level: string
          status?: string | null
          title: string
        }
        Update: {
          affected_users?: Json | null
          assigned_to?: string | null
          created_at?: string | null
          description?: string | null
          id?: string
          incident_data?: Json | null
          incident_type?: string
          resolved_at?: string | null
          severity_level?: string
          status?: string | null
          title?: string
        }
        Relationships: []
      }
      security_scan_results: {
        Row: {
          created_at: string | null
          error_message: string | null
          id: string
          initiated_by: string | null
          scan_completed_at: string | null
          scan_duration_ms: number | null
          scan_id: string
          scan_started_at: string | null
          scan_status: string
          scan_type: string
          total_files_scanned: number | null
          updated_at: string | null
          violations_found: number | null
        }
        Insert: {
          created_at?: string | null
          error_message?: string | null
          id?: string
          initiated_by?: string | null
          scan_completed_at?: string | null
          scan_duration_ms?: number | null
          scan_id: string
          scan_started_at?: string | null
          scan_status?: string
          scan_type?: string
          total_files_scanned?: number | null
          updated_at?: string | null
          violations_found?: number | null
        }
        Update: {
          created_at?: string | null
          error_message?: string | null
          id?: string
          initiated_by?: string | null
          scan_completed_at?: string | null
          scan_duration_ms?: number | null
          scan_id?: string
          scan_started_at?: string | null
          scan_status?: string
          scan_type?: string
          total_files_scanned?: number | null
          updated_at?: string | null
          violations_found?: number | null
        }
        Relationships: []
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
      store_activity_logs: {
        Row: {
          activity_data: Json | null
          activity_description: string
          activity_type: string
          created_at: string
          id: string
          ip_address: string | null
          performed_by: string | null
          related_entity_id: string | null
          related_entity_type: string | null
          severity_level: string | null
          source_component: string | null
          store_id: string
          user_agent: string | null
        }
        Insert: {
          activity_data?: Json | null
          activity_description: string
          activity_type: string
          created_at?: string
          id?: string
          ip_address?: string | null
          performed_by?: string | null
          related_entity_id?: string | null
          related_entity_type?: string | null
          severity_level?: string | null
          source_component?: string | null
          store_id: string
          user_agent?: string | null
        }
        Update: {
          activity_data?: Json | null
          activity_description?: string
          activity_type?: string
          created_at?: string
          id?: string
          ip_address?: string | null
          performed_by?: string | null
          related_entity_id?: string | null
          related_entity_type?: string | null
          severity_level?: string | null
          source_component?: string | null
          store_id?: string
          user_agent?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "store_activity_logs_performed_by_fkey"
            columns: ["performed_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "store_activity_logs_store_id_fkey"
            columns: ["store_id"]
            isOneToOne: false
            referencedRelation: "stores"
            referencedColumns: ["id"]
          },
        ]
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
      store_verifications: {
        Row: {
          id: string
          store_id: string | null
          submitted_at: string | null
          submitted_documents: Json | null
          verification_notes: string | null
          verification_status: string | null
          verification_type: string
          verified_at: string | null
          verified_by: string | null
        }
        Insert: {
          id?: string
          store_id?: string | null
          submitted_at?: string | null
          submitted_documents?: Json | null
          verification_notes?: string | null
          verification_status?: string | null
          verification_type: string
          verified_at?: string | null
          verified_by?: string | null
        }
        Update: {
          id?: string
          store_id?: string | null
          submitted_at?: string | null
          submitted_documents?: Json | null
          verification_notes?: string | null
          verification_status?: string | null
          verification_type?: string
          verified_at?: string | null
          verified_by?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "store_verifications_store_id_fkey"
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
          bank_name: string | null
          bitcoin_wallet_address: string | null
          created_at: string
          description: string | null
          email: string | null
          ethereum_wallet_address: string | null
          iban: string | null
          id: string
          is_active: boolean | null
          logo_url: string | null
          name: string
          phone: string | null
          shipping_options: Json | null
          solana_wallet_address: string | null
          swift_bic: string | null
          updated_at: string
          usdc_wallet_address: string | null
          user_id: string
          verified: boolean | null
          website: string | null
        }
        Insert: {
          address?: Json | null
          bank_name?: string | null
          bitcoin_wallet_address?: string | null
          created_at?: string
          description?: string | null
          email?: string | null
          ethereum_wallet_address?: string | null
          iban?: string | null
          id?: string
          is_active?: boolean | null
          logo_url?: string | null
          name: string
          phone?: string | null
          shipping_options?: Json | null
          solana_wallet_address?: string | null
          swift_bic?: string | null
          updated_at?: string
          usdc_wallet_address?: string | null
          user_id: string
          verified?: boolean | null
          website?: string | null
        }
        Update: {
          address?: Json | null
          bank_name?: string | null
          bitcoin_wallet_address?: string | null
          created_at?: string
          description?: string | null
          email?: string | null
          ethereum_wallet_address?: string | null
          iban?: string | null
          id?: string
          is_active?: boolean | null
          logo_url?: string | null
          name?: string
          phone?: string | null
          shipping_options?: Json | null
          solana_wallet_address?: string | null
          swift_bic?: string | null
          updated_at?: string
          usdc_wallet_address?: string | null
          user_id?: string
          verified?: boolean | null
          website?: string | null
        }
        Relationships: []
      }
      system_alerts: {
        Row: {
          alert_data: Json | null
          alert_type: string
          created_at: string | null
          current_value: number | null
          description: string | null
          id: string
          is_resolved: boolean | null
          metric_threshold: number | null
          resolved_at: string | null
          severity: string
          title: string
        }
        Insert: {
          alert_data?: Json | null
          alert_type: string
          created_at?: string | null
          current_value?: number | null
          description?: string | null
          id?: string
          is_resolved?: boolean | null
          metric_threshold?: number | null
          resolved_at?: string | null
          severity?: string
          title: string
        }
        Update: {
          alert_data?: Json | null
          alert_type?: string
          created_at?: string | null
          current_value?: number | null
          description?: string | null
          id?: string
          is_resolved?: boolean | null
          metric_threshold?: number | null
          resolved_at?: string | null
          severity?: string
          title?: string
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
      system_metrics: {
        Row: {
          id: string
          metric_name: string
          metric_type: string
          metric_value: number
          recorded_at: string | null
          tags: Json | null
        }
        Insert: {
          id?: string
          metric_name: string
          metric_type?: string
          metric_value: number
          recorded_at?: string | null
          tags?: Json | null
        }
        Update: {
          id?: string
          metric_name?: string
          metric_type?: string
          metric_value?: number
          recorded_at?: string | null
          tags?: Json | null
        }
        Relationships: []
      }
      token_activity: {
        Row: {
          activity_type: string
          amount: number | null
          created_at: string | null
          description: string | null
          id: string
          metadata: Json | null
          user_id: string
        }
        Insert: {
          activity_type: string
          amount?: number | null
          created_at?: string | null
          description?: string | null
          id?: string
          metadata?: Json | null
          user_id: string
        }
        Update: {
          activity_type?: string
          amount?: number | null
          created_at?: string | null
          description?: string | null
          id?: string
          metadata?: Json | null
          user_id?: string
        }
        Relationships: []
      }
      token_info: {
        Row: {
          circulating_supply: number
          current_price_usd: number
          id: string
          sol_rate: number
          total_supply: number
          treasury_address: string
          updated_at: string | null
          usdc_rate: number
        }
        Insert: {
          circulating_supply?: number
          current_price_usd?: number
          id?: string
          sol_rate?: number
          total_supply?: number
          treasury_address: string
          updated_at?: string | null
          usdc_rate?: number
        }
        Update: {
          circulating_supply?: number
          current_price_usd?: number
          id?: string
          sol_rate?: number
          total_supply?: number
          treasury_address?: string
          updated_at?: string | null
          usdc_rate?: number
        }
        Relationships: []
      }
      token_locks: {
        Row: {
          amount: number
          benefit_percentage: number | null
          created_at: string | null
          duration_months: number
          id: string
          lock_date: string
          status: string
          unlock_date: string
          updated_at: string | null
          user_id: string
        }
        Insert: {
          amount: number
          benefit_percentage?: number | null
          created_at?: string | null
          duration_months: number
          id?: string
          lock_date?: string
          status?: string
          unlock_date: string
          updated_at?: string | null
          user_id: string
        }
        Update: {
          amount?: number
          benefit_percentage?: number | null
          created_at?: string | null
          duration_months?: number
          id?: string
          lock_date?: string
          status?: string
          unlock_date?: string
          updated_at?: string | null
          user_id?: string
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
      user_activity: {
        Row: {
          activity_type: string
          created_at: string | null
          id: string
          ip_address: string | null
          metadata: Json | null
          page_url: string | null
          session_id: string | null
          user_agent: string | null
          user_id: string | null
        }
        Insert: {
          activity_type: string
          created_at?: string | null
          id?: string
          ip_address?: string | null
          metadata?: Json | null
          page_url?: string | null
          session_id?: string | null
          user_agent?: string | null
          user_id?: string | null
        }
        Update: {
          activity_type?: string
          created_at?: string | null
          id?: string
          ip_address?: string | null
          metadata?: Json | null
          page_url?: string | null
          session_id?: string | null
          user_agent?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      user_analytics: {
        Row: {
          actions_performed: Json | null
          created_at: string | null
          device_info: Json | null
          id: string
          location_data: Json | null
          page_views: number | null
          session_id: string
          time_spent_minutes: number | null
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          actions_performed?: Json | null
          created_at?: string | null
          device_info?: Json | null
          id?: string
          location_data?: Json | null
          page_views?: number | null
          session_id: string
          time_spent_minutes?: number | null
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          actions_performed?: Json | null
          created_at?: string | null
          device_info?: Json | null
          id?: string
          location_data?: Json | null
          page_views?: number | null
          session_id?: string
          time_spent_minutes?: number | null
          updated_at?: string | null
          user_id?: string | null
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
      visual_coin_matches: {
        Row: {
          analysis_id: string | null
          coin_details: Json | null
          date_found: string | null
          id: string
          matched_image_url: string
          price_info: Json | null
          similarity_score: number
          source_url: string | null
        }
        Insert: {
          analysis_id?: string | null
          coin_details?: Json | null
          date_found?: string | null
          id?: string
          matched_image_url: string
          price_info?: Json | null
          similarity_score: number
          source_url?: string | null
        }
        Update: {
          analysis_id?: string | null
          coin_details?: Json | null
          date_found?: string | null
          id?: string
          matched_image_url?: string
          price_info?: Json | null
          similarity_score?: number
          source_url?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "visual_coin_matches_analysis_id_fkey"
            columns: ["analysis_id"]
            isOneToOne: false
            referencedRelation: "dual_image_analysis"
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
      wallet_balances: {
        Row: {
          created_at: string | null
          gcai_balance: number
          id: string
          last_updated: string | null
          locked_balance: number
          user_id: string
          wallet_address: string
        }
        Insert: {
          created_at?: string | null
          gcai_balance?: number
          id?: string
          last_updated?: string | null
          locked_balance?: number
          user_id: string
          wallet_address: string
        }
        Update: {
          created_at?: string | null
          gcai_balance?: number
          id?: string
          last_updated?: string | null
          locked_balance?: number
          user_id?: string
          wallet_address?: string
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
      web_discovery_results: {
        Row: {
          analysis_id: string | null
          auction_data: Json | null
          coin_match_confidence: number | null
          created_at: string | null
          extracted_data: Json | null
          id: string
          image_urls: string[] | null
          is_active: boolean | null
          last_scraped: string | null
          price_data: Json | null
          source_type: string
          source_url: string
        }
        Insert: {
          analysis_id?: string | null
          auction_data?: Json | null
          coin_match_confidence?: number | null
          created_at?: string | null
          extracted_data?: Json | null
          id?: string
          image_urls?: string[] | null
          is_active?: boolean | null
          last_scraped?: string | null
          price_data?: Json | null
          source_type: string
          source_url: string
        }
        Update: {
          analysis_id?: string | null
          auction_data?: Json | null
          coin_match_confidence?: number | null
          created_at?: string | null
          extracted_data?: Json | null
          id?: string
          image_urls?: string[] | null
          is_active?: boolean | null
          last_scraped?: string | null
          price_data?: Json | null
          source_type?: string
          source_url?: string
        }
        Relationships: [
          {
            foreignKeyName: "web_discovery_results_analysis_id_fkey"
            columns: ["analysis_id"]
            isOneToOne: false
            referencedRelation: "dual_image_analysis"
            referencedColumns: ["id"]
          },
        ]
      }
      web_discovery_sessions: {
        Row: {
          coin_query: Json
          created_at: string | null
          id: string
          processing_time_ms: number | null
          results_found: Json | null
          session_id: string
          sources_attempted: number | null
          sources_successful: number | null
        }
        Insert: {
          coin_query: Json
          created_at?: string | null
          id?: string
          processing_time_ms?: number | null
          results_found?: Json | null
          session_id: string
          sources_attempted?: number | null
          sources_successful?: number | null
        }
        Update: {
          coin_query?: Json
          created_at?: string | null
          id?: string
          processing_time_ms?: number | null
          results_found?: Json | null
          session_id?: string
          sources_attempted?: number | null
          sources_successful?: number | null
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      admin_safe_query: {
        Args: { query_type: string }
        Returns: Json
      }
      audit_security_configuration: {
        Args: Record<PropertyKey, never>
        Returns: {
          issue: string
          severity: string
          resolved: boolean
        }[]
      }
      calculate_error_coin_value: {
        Args: {
          p_error_id: string
          p_grade: string
          p_base_coin_value?: number
        }
        Returns: Json
      }
      cancel_user_subscription: {
        Args: { p_subscription_id: string; p_user_id: string }
        Returns: undefined
      }
      check_optimization_performance: {
        Args: Record<PropertyKey, never>
        Returns: Json
      }
      configure_complete_auth_security: {
        Args: Record<PropertyKey, never>
        Returns: Json
      }
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
      configure_production_auth_security_final: {
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
      create_security_incident: {
        Args: {
          incident_type: string
          severity_level: string
          title: string
          description?: string
          incident_data?: Json
        }
        Returns: string
      }
      detect_coin_errors: {
        Args: {
          p_image_hash: string
          p_base_coin_info: Json
          p_detection_config?: Json
        }
        Returns: Json
      }
      enable_ai_global_integration: {
        Args: Record<PropertyKey, never>
        Returns: Json
      }
      enable_password_protection: {
        Args: Record<PropertyKey, never>
        Returns: Json
      }
      encrypt_api_key_secure: {
        Args: { plain_key: string }
        Returns: string
      }
      execute_ai_command: {
        Args: { p_command_id: string; p_input_data?: Json }
        Returns: string
      }
      execute_automation_rule: {
        Args: { rule_id: string }
        Returns: Json
      }
      execute_bulk_operation: {
        Args: {
          operation_type: string
          operation_name: string
          target_table: string
          operation_parameters: Json
        }
        Returns: string
      }
      execute_production_cleanup: {
        Args: Record<PropertyKey, never>
        Returns: Json
      }
      final_security_audit: {
        Args: Record<PropertyKey, never>
        Returns: Json
      }
      final_system_validation: {
        Args: Record<PropertyKey, never>
        Returns: Json
      }
      generate_ai_prediction: {
        Args: { model_id: string; input_data: Json }
        Returns: Json
      }
      get_admin_dashboard_comprehensive: {
        Args: Record<PropertyKey, never>
        Returns: Json
      }
      get_admin_dashboard_optimized: {
        Args: Record<PropertyKey, never>
        Returns: Json
      }
      get_advanced_analytics_dashboard: {
        Args: Record<PropertyKey, never>
        Returns: Json
      }
      get_ai_brain_dashboard_stats: {
        Args: Record<PropertyKey, never>
        Returns: Json
      }
      get_category_stats: {
        Args: Record<PropertyKey, never>
        Returns: Json
      }
      get_coin_images: {
        Args: { coin_row: Database["public"]["Tables"]["coins"]["Row"] }
        Returns: string[]
      }
      get_coin_store_verification: {
        Args: { coin_store_id: string }
        Returns: boolean
      }
      get_current_user_id: {
        Args: Record<PropertyKey, never>
        Returns: string
      }
      get_dashboard_stats: {
        Args: Record<PropertyKey, never>
        Returns: Json
      }
      get_store_activity_stats: {
        Args: { p_store_id: string; p_days?: number }
        Returns: Json
      }
      get_store_average_rating: {
        Args: { store_uuid: string }
        Returns: number
      }
      get_subscription_plans: {
        Args: Record<PropertyKey, never>
        Returns: {
          id: string
          name: string
          price: number
          currency: string
          features: string[]
          duration_days: number
          popular: boolean
        }[]
      }
      get_system_performance_metrics: {
        Args: Record<PropertyKey, never>
        Returns: Json
      }
      get_tenant_from_domain: {
        Args: { domain_name: string }
        Returns: string
      }
      get_ultra_optimized_admin_dashboard: {
        Args: Record<PropertyKey, never>
        Returns: Json
      }
      get_user_role: {
        Args: { user_uuid?: string }
        Returns: string
      }
      get_user_subscriptions: {
        Args: { p_user_id: string }
        Returns: {
          id: string
          user_id: string
          plan_name: string
          status: string
          expires_at: string
          cancelled_at: string
          created_at: string
        }[]
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
      is_admin_secure: {
        Args: Record<PropertyKey, never>
        Returns: boolean
      }
      is_store_verified: {
        Args: { store_uuid: string }
        Returns: boolean
      }
      is_user_admin: {
        Args: { check_user_id: string }
        Returns: boolean
      }
      log_admin_activity: {
        Args: {
          p_action: string
          p_target_type: string
          p_target_id?: string
          p_details?: Json
        }
        Returns: undefined
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
      log_store_activity: {
        Args: {
          p_store_id: string
          p_activity_type: string
          p_activity_description: string
          p_activity_data?: Json
          p_severity_level?: string
          p_source_component?: string
          p_related_entity_type?: string
          p_related_entity_id?: string
        }
        Returns: string
      }
      monitor_auth_sessions: {
        Args: Record<PropertyKey, never>
        Returns: Json
      }
      monitor_query_performance: {
        Args: Record<PropertyKey, never>
        Returns: undefined
      }
      record_phase_completion: {
        Args: {
          phase_number: string
          completion_percentage: number
          validation_results?: Json
        }
        Returns: string
      }
      record_system_metric: {
        Args: {
          p_metric_name: string
          p_metric_value: number
          p_metric_type?: string
          p_tags?: Json
        }
        Returns: undefined
      }
      resolve_all_security_issues: {
        Args: Record<PropertyKey, never>
        Returns: Json
      }
      resolve_all_security_warnings: {
        Args: Record<PropertyKey, never>
        Returns: Json
      }
      resolve_security_warnings: {
        Args: Record<PropertyKey, never>
        Returns: Json
      }
      secure_admin_verification: {
        Args: { user_uuid?: string }
        Returns: boolean
      }
      set_tenant_context: {
        Args: { tenant_uuid: string }
        Returns: undefined
      }
      update_source_success_rate: {
        Args: {
          source_url: string
          was_successful: boolean
          response_time?: number
        }
        Returns: undefined
      }
      validate_all_security_warnings_resolved: {
        Args: Record<PropertyKey, never>
        Returns: Json
      }
      validate_complete_system: {
        Args: Record<PropertyKey, never>
        Returns: Json
      }
      validate_enhanced_security_config: {
        Args: Record<PropertyKey, never>
        Returns: Json
      }
      validate_final_optimization: {
        Args: Record<PropertyKey, never>
        Returns: Json
      }
      validate_password_security: {
        Args: { password_input: string }
        Returns: Json
      }
      validate_phase_2_security_fixes: {
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
      validate_uuid_input: {
        Args: { input_text: string }
        Returns: string
      }
      verify_admin_access_secure: {
        Args: Record<PropertyKey, never>
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
        | "banknotes"
        | "error_banknotes"
        | "gold_bullion"
        | "silver_bullion"
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
        "banknotes",
        "error_banknotes",
        "gold_bullion",
        "silver_bullion",
      ],
      user_role: ["admin", "moderator", "user", "dealer", "buyer"],
    },
  },
} as const
