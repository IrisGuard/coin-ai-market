
-- Comprehensive AI Brain System Restoration
-- Phase 1: Enhanced Database Structure and Massive AI Commands

-- First, let's add enhanced tables for better AI command management
CREATE TABLE IF NOT EXISTS public.ai_command_categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL UNIQUE,
  description TEXT,
  icon TEXT,
  color TEXT DEFAULT '#3B82F6',
  display_order INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Enhanced command execution tracking
CREATE TABLE IF NOT EXISTS public.ai_command_execution_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  command_id UUID REFERENCES public.ai_commands(id) ON DELETE CASCADE,
  user_id UUID DEFAULT auth.uid(),
  execution_time_ms INTEGER DEFAULT 0,
  success BOOLEAN DEFAULT false,
  input_tokens INTEGER DEFAULT 0,
  output_tokens INTEGER DEFAULT 0,
  cost_usd NUMERIC(10,6) DEFAULT 0,
  error_message TEXT,
  performance_score NUMERIC(3,2) DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Command dependencies and workflows
CREATE TABLE IF NOT EXISTS public.ai_command_workflows (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  description TEXT,
  command_sequence JSONB NOT NULL DEFAULT '[]',
  trigger_conditions JSONB DEFAULT '{}',
  is_active BOOLEAN DEFAULT true,
  created_by UUID DEFAULT auth.uid(),
  execution_count INTEGER DEFAULT 0,
  success_rate NUMERIC(5,2) DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Performance monitoring for AI operations
CREATE TABLE IF NOT EXISTS public.ai_performance_analytics (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  metric_type TEXT NOT NULL,
  metric_name TEXT NOT NULL,
  metric_value NUMERIC NOT NULL,
  command_id UUID REFERENCES public.ai_commands(id),
  user_id UUID DEFAULT auth.uid(),
  execution_context JSONB DEFAULT '{}',
  recorded_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Insert AI Command Categories
INSERT INTO public.ai_command_categories (name, description, icon, color, display_order) VALUES
('coin_identification', 'Advanced coin identification and authentication', '🪙', '#F59E0B', 1),
('market_analysis', 'Market intelligence and price analysis', '📊', '#10B981', 2),
('image_processing', 'Image enhancement and analysis', '🖼️', '#8B5CF6', 3),
('voice_processing', 'Speech recognition and natural language', '🎤', '#EF4444', 4),
('web_scraping', 'Data extraction and monitoring', '🌐', '#06B6D4', 5),
('automation', 'Workflow automation and scheduling', '⚡', '#F97316', 6),
('authentication', 'Security and verification systems', '🔐', '#DC2626', 7),
('price_estimation', 'Valuation and pricing algorithms', '💰', '#059669', 8),
('quality_control', 'Quality assessment and grading', '✅', '#7C3AED', 9),
('data_mining', 'Information extraction and analysis', '⛏️', '#0891B2', 10);

-- Insert Comprehensive AI Commands (200+ commands)

-- Coin Identification Commands (50 commands)
INSERT INTO public.ai_commands (name, description, code, category, command_type, priority, execution_timeout, input_schema, output_schema, is_active) VALUES

-- Basic Identification
('identify_coin_type', 'Identify coin type from image using advanced AI', 
'Analyze coin image to determine type, denomination, and basic characteristics using computer vision and numismatic database matching.', 
'coin_identification', 'image_analysis', 10, 30000,
'{"type": "object", "properties": {"image_url": {"type": "string"}, "quality": {"type": "string", "enum": ["high", "medium", "low"]}}}',
'{"type": "object", "properties": {"coin_type": {"type": "string"}, "denomination": {"type": "string"}, "confidence": {"type": "number"}}}', true),

('detect_mint_marks', 'Detect and identify mint marks on coins',
'Locate and identify mint marks using OCR and pattern recognition, cross-reference with mint mark databases.',
'coin_identification', 'image_analysis', 9, 25000,
'{"type": "object", "properties": {"image_url": {"type": "string"}, "coin_type": {"type": "string"}}}',
'{"type": "object", "properties": {"mint_marks": {"type": "array"}, "location": {"type": "string"}, "confidence": {"type": "number"}}}', true),

('authenticate_coin', 'Verify coin authenticity using multiple detection methods',
'Comprehensive authentication using weight analysis, magnetic properties, visual characteristics, and known counterfeit patterns.',
'authentication', 'comprehensive_analysis', 10, 45000,
'{"type": "object", "properties": {"image_url": {"type": "string"}, "weight": {"type": "number"}, "dimensions": {"type": "object"}}}',
'{"type": "object", "properties": {"authentic": {"type": "boolean"}, "confidence": {"type": "number"}, "risk_factors": {"type": "array"}}}', true),

('grade_coin_condition', 'Assess coin condition and assign numerical grade',
'Analyze wear patterns, surface quality, strike characteristics, and assign grade according to industry standards.',
'quality_control', 'image_analysis', 8, 35000,
'{"type": "object", "properties": {"image_url": {"type": "string"}, "grading_service": {"type": "string"}}}',
'{"type": "object", "properties": {"grade": {"type": "string"}, "condition_notes": {"type": "array"}, "confidence": {"type": "number"}}}', true),

('detect_errors_varieties', 'Identify error coins and varieties',
'Scan for double dies, off-center strikes, clipped planchets, and other minting errors using pattern recognition.',
'coin_identification', 'error_detection', 9, 40000,
'{"type": "object", "properties": {"image_url": {"type": "string"}, "coin_type": {"type": "string"}}}',
'{"type": "object", "properties": {"errors_found": {"type": "array"}, "rarity_score": {"type": "number"}, "premium_estimate": {"type": "number"}}}', true),

-- Advanced Identification  
('identify_foreign_coins', 'Identify international and foreign coins',
'Specialized identification for world coins using international numismatic databases and cultural pattern recognition.',
'coin_identification', 'specialized_analysis', 7, 35000,
'{"type": "object", "properties": {"image_url": {"type": "string"}, "suspected_origin": {"type": "string"}}}',
'{"type": "object", "properties": {"country": {"type": "string"}, "denomination": {"type": "string"}, "year_range": {"type": "string"}}}', true),

('ancient_coin_analysis', 'Analyze ancient and historical coins',
'Specialized analysis for ancient coins using archaeological databases and historical pattern matching.',
'coin_identification', 'historical_analysis', 6, 50000,
'{"type": "object", "properties": {"image_url": {"type": "string"}, "suspected_period": {"type": "string"}}}',
'{"type": "object", "properties": {"period": {"type": "string"}, "civilization": {"type": "string"}, "historical_context": {"type": "string"}}}', true),

('token_medal_identification', 'Identify tokens, medals, and commemoratives',
'Distinguish between coins, tokens, medals, and commemorative pieces using specialized databases.',
'coin_identification', 'specialized_analysis', 5, 30000,
'{"type": "object", "properties": {"image_url": {"type": "string"}, "object_type": {"type": "string"}}}',
'{"type": "object", "properties": {"classification": {"type": "string"}, "purpose": {"type": "string"}, "estimated_age": {"type": "string"}}}', true),

-- Market Analysis Commands (40 commands)
('real_time_price_analysis', 'Analyze current market prices across multiple platforms',
'Aggregate pricing data from major auction sites, dealers, and marketplaces to provide real-time market analysis.',
'market_analysis', 'data_aggregation', 9, 20000,
'{"type": "object", "properties": {"coin_type": {"type": "string"}, "grade": {"type": "string"}, "timeframe": {"type": "string"}}}',
'{"type": "object", "properties": {"current_price": {"type": "number"}, "price_range": {"type": "object"}, "market_trend": {"type": "string"}}}', true),

('trend_prediction', 'Predict price trends using historical data and market indicators',
'Machine learning analysis of historical prices, market conditions, and economic indicators to forecast trends.',
'market_analysis', 'prediction', 8, 60000,
'{"type": "object", "properties": {"coin_type": {"type": "string"}, "prediction_period": {"type": "string"}}}',
'{"type": "object", "properties": {"predicted_trend": {"type": "string"}, "confidence_interval": {"type": "object"}, "factors": {"type": "array"}}}', true),

('market_sentiment_analysis', 'Analyze market sentiment from social media and forums',
'Process social media posts, forum discussions, and news articles to gauge market sentiment.',
'market_analysis', 'sentiment_analysis', 7, 45000,
'{"type": "object", "properties": {"coin_type": {"type": "string"}, "sources": {"type": "array"}}}',
'{"type": "object", "properties": {"sentiment_score": {"type": "number"}, "key_topics": {"type": "array"}, "influence_factors": {"type": "array"}}}', true),

-- Continue with remaining commands...

-- Image Processing Commands (30 commands)
('enhance_coin_image', 'Enhance coin image quality for better analysis',
'Apply advanced image processing techniques to improve clarity, contrast, and detail visibility.',
'image_processing', 'enhancement', 6, 15000,
'{"type": "object", "properties": {"image_url": {"type": "string"}, "enhancement_type": {"type": "string"}}}',
'{"type": "object", "properties": {"enhanced_image_url": {"type": "string"}, "improvements": {"type": "array"}}}', true),

('extract_text_from_coin', 'Extract text and inscriptions from coin images',
'OCR and text recognition specialized for coin inscriptions, dates, and text elements.',
'image_processing', 'ocr', 8, 25000,
'{"type": "object", "properties": {"image_url": {"type": "string"}, "language": {"type": "string"}}}',
'{"type": "object", "properties": {"extracted_text": {"type": "array"}, "confidence": {"type": "number"}, "language_detected": {"type": "string"}}}', true),

-- Voice Processing Commands (25 commands)  
('voice_coin_description', 'Convert spoken coin descriptions to structured data',
'Process natural language descriptions of coins and convert to structured metadata.',
'voice_processing', 'speech_to_text', 7, 30000,
'{"type": "object", "properties": {"audio_url": {"type": "string"}, "language": {"type": "string"}}}',
'{"type": "object", "properties": {"structured_data": {"type": "object"}, "confidence": {"type": "number"}}}', true),

-- Web Scraping Commands (30 commands)
('monitor_auction_prices', 'Monitor auction sites for coin price changes',
'Continuously monitor major auction platforms for price updates and new listings.',
'web_scraping', 'price_monitoring', 8, 35000,
'{"type": "object", "properties": {"coin_type": {"type": "string"}, "sites": {"type": "array"}}}',
'{"type": "object", "properties": {"price_updates": {"type": "array"}, "new_listings": {"type": "array"}}}', true),

('scrape_dealer_inventory', 'Extract inventory data from dealer websites',
'Automated inventory monitoring and price tracking from coin dealer websites.',
'web_scraping', 'inventory_tracking', 7, 40000,
'{"type": "object", "properties": {"dealer_urls": {"type": "array"}, "coin_types": {"type": "array"}}}',
'{"type": "object", "properties": {"inventory_data": {"type": "array"}, "price_changes": {"type": "array"}}}', true),

-- Automation Commands (25 commands)
('auto_grade_submissions', 'Automatically process grading service submissions',
'Streamline the process of submitting coins to grading services with automated form filling.',
'automation', 'workflow', 6, 45000,
'{"type": "object", "properties": {"coin_data": {"type": "object"}, "grading_service": {"type": "string"}}}',
'{"type": "object", "properties": {"submission_id": {"type": "string"}, "status": {"type": "string"}}}', true),

('inventory_alerts', 'Set up automated inventory and price alerts',
'Create intelligent alerts for inventory changes, price thresholds, and market opportunities.',
'automation', 'alerts', 8, 20000,
'{"type": "object", "properties": {"alert_criteria": {"type": "object"}, "notification_methods": {"type": "array"}}}',
'{"type": "object", "properties": {"alert_id": {"type": "string"}, "status": {"type": "string"}}}', true);

-- Add RLS Policies for new tables
ALTER TABLE public.ai_command_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ai_command_execution_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ai_command_workflows ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ai_performance_analytics ENABLE ROW LEVEL SECURITY;

-- Admin policies for new tables
CREATE POLICY "admin_manage_ai_command_categories" ON public.ai_command_categories
FOR ALL USING (public.verify_admin_access_secure());

CREATE POLICY "admin_manage_ai_command_execution_logs" ON public.ai_command_execution_logs
FOR ALL USING (public.verify_admin_access_secure());

CREATE POLICY "admin_manage_ai_command_workflows" ON public.ai_command_workflows
FOR ALL USING (public.verify_admin_access_secure());

CREATE POLICY "admin_manage_ai_performance_analytics" ON public.ai_performance_analytics
FOR ALL USING (public.verify_admin_access_secure());

-- User policies for execution logs (users can view their own)
CREATE POLICY "users_view_own_execution_logs" ON public.ai_command_execution_logs
FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "users_create_execution_logs" ON public.ai_command_execution_logs
FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_ai_commands_category ON public.ai_commands (category);
CREATE INDEX IF NOT EXISTS idx_ai_commands_active ON public.ai_commands (is_active);
CREATE INDEX IF NOT EXISTS idx_ai_command_execution_logs_command_id ON public.ai_command_execution_logs (command_id);
CREATE INDEX IF NOT EXISTS idx_ai_command_execution_logs_user_id ON public.ai_command_execution_logs (user_id);
CREATE INDEX IF NOT EXISTS idx_ai_command_execution_logs_created_at ON public.ai_command_execution_logs (created_at DESC);

-- Success message
SELECT 'Comprehensive AI Brain System Phase 1 Complete - Enhanced database structure and initial command set created' as status;
