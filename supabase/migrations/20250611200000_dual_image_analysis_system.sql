
-- Dual-Side AI Recognition & Web Discovery System
-- Complete database structure for enhanced coin analysis

-- Table for storing dual image analysis results
CREATE TABLE IF NOT EXISTS dual_image_analysis (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  front_image_url text NOT NULL,
  back_image_url text NOT NULL,
  front_image_hash text,
  back_image_hash text,
  user_id uuid REFERENCES auth.users(id),
  analysis_results jsonb DEFAULT '{}',
  confidence_score float DEFAULT 0,
  detected_errors text[],
  grade_assessment text,
  rarity_score integer,
  estimated_value_range jsonb DEFAULT '{}',
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now()
);

-- Table for web discovery results
CREATE TABLE IF NOT EXISTS web_discovery_results (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  analysis_id uuid REFERENCES dual_image_analysis(id) ON DELETE CASCADE,
  source_url text NOT NULL,
  source_type text NOT NULL, -- 'ebay', 'heritage', 'numista', 'pcgs', etc.
  coin_match_confidence float DEFAULT 0,
  price_data jsonb DEFAULT '{}',
  auction_data jsonb DEFAULT '{}',
  image_urls text[],
  extracted_data jsonb DEFAULT '{}',
  last_scraped timestamp with time zone DEFAULT now(),
  is_active boolean DEFAULT true,
  created_at timestamp with time zone DEFAULT now()
);

-- Table for visual coin matching
CREATE TABLE IF NOT EXISTS visual_coin_matches (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  analysis_id uuid REFERENCES dual_image_analysis(id) ON DELETE CASCADE,
  matched_image_url text NOT NULL,
  similarity_score float NOT NULL,
  source_url text,
  coin_details jsonb DEFAULT '{}',
  price_info jsonb DEFAULT '{}',
  date_found timestamp with time zone DEFAULT now()
);

-- Table for error pattern recognition
CREATE TABLE IF NOT EXISTS error_pattern_matches (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  analysis_id uuid REFERENCES dual_image_analysis(id) ON DELETE CASCADE,
  error_type text NOT NULL,
  error_description text,
  confidence_score float DEFAULT 0,
  reference_images text[],
  rarity_multiplier float DEFAULT 1.0,
  estimated_premium float DEFAULT 0,
  created_at timestamp with time zone DEFAULT now()
);

-- Table for market analysis results
CREATE TABLE IF NOT EXISTS market_analysis_results (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  analysis_id uuid REFERENCES dual_image_analysis(id) ON DELETE CASCADE,
  current_market_value jsonb DEFAULT '{}',
  price_trends jsonb DEFAULT '{}',
  recent_sales jsonb DEFAULT '{}',
  population_data jsonb DEFAULT '{}',
  investment_recommendation text,
  market_outlook text,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now()
);

-- Enable RLS for all tables
ALTER TABLE dual_image_analysis ENABLE ROW LEVEL SECURITY;
ALTER TABLE web_discovery_results ENABLE ROW LEVEL SECURITY;
ALTER TABLE visual_coin_matches ENABLE ROW LEVEL SECURITY;
ALTER TABLE error_pattern_matches ENABLE ROW LEVEL SECURITY;
ALTER TABLE market_analysis_results ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Users can manage their own dual analyses" ON dual_image_analysis
FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Users can view discovery results for their analyses" ON web_discovery_results
FOR SELECT USING (
  EXISTS (
    SELECT 1 FROM dual_image_analysis 
    WHERE id = web_discovery_results.analysis_id 
    AND user_id = auth.uid()
  )
);

CREATE POLICY "Users can view visual matches for their analyses" ON visual_coin_matches
FOR SELECT USING (
  EXISTS (
    SELECT 1 FROM dual_image_analysis 
    WHERE id = visual_coin_matches.analysis_id 
    AND user_id = auth.uid()
  )
);

CREATE POLICY "Users can view error patterns for their analyses" ON error_pattern_matches
FOR SELECT USING (
  EXISTS (
    SELECT 1 FROM dual_image_analysis 
    WHERE id = error_pattern_matches.analysis_id 
    AND user_id = auth.uid()
  )
);

CREATE POLICY "Users can view market analysis for their analyses" ON market_analysis_results
FOR SELECT USING (
  EXISTS (
    SELECT 1 FROM dual_image_analysis 
    WHERE id = market_analysis_results.analysis_id 
    AND user_id = auth.uid()
  )
);

-- Admin policies
CREATE POLICY "admin_manage_dual_analysis" ON dual_image_analysis
FOR ALL USING (public.verify_admin_access_secure());

CREATE POLICY "admin_manage_web_discovery" ON web_discovery_results
FOR ALL USING (public.verify_admin_access_secure());

CREATE POLICY "admin_manage_visual_matches" ON visual_coin_matches
FOR ALL USING (public.verify_admin_access_secure());

CREATE POLICY "admin_manage_error_patterns" ON error_pattern_matches
FOR ALL USING (public.verify_admin_access_secure());

CREATE POLICY "admin_manage_market_analysis" ON market_analysis_results
FOR ALL USING (public.verify_admin_access_secure());

-- Indexes for performance
CREATE INDEX idx_dual_analysis_user_created ON dual_image_analysis (user_id, created_at DESC);
CREATE INDEX idx_dual_analysis_confidence ON dual_image_analysis (confidence_score DESC);
CREATE INDEX idx_web_discovery_analysis_id ON web_discovery_results (analysis_id);
CREATE INDEX idx_web_discovery_source_type ON web_discovery_results (source_type, coin_match_confidence DESC);
CREATE INDEX idx_visual_matches_similarity ON visual_coin_matches (analysis_id, similarity_score DESC);
CREATE INDEX idx_error_patterns_type ON error_pattern_matches (analysis_id, error_type);
CREATE INDEX idx_market_analysis_analysis_id ON market_analysis_results (analysis_id);

-- Functions for automated analysis triggers
CREATE OR REPLACE FUNCTION trigger_web_discovery()
RETURNS TRIGGER AS $$
BEGIN
  -- Automatically trigger web discovery when new dual analysis is created
  PERFORM pg_notify('web_discovery_trigger', NEW.id::text);
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER after_dual_analysis_insert
  AFTER INSERT ON dual_image_analysis
  FOR EACH ROW
  EXECUTE FUNCTION trigger_web_discovery();
