
-- Enhanced error coins knowledge table with missing columns
ALTER TABLE error_coins_knowledge 
ADD COLUMN IF NOT EXISTS detection_difficulty integer DEFAULT 1 CHECK (detection_difficulty >= 1 AND detection_difficulty <= 10),
ADD COLUMN IF NOT EXISTS market_premium_multiplier numeric DEFAULT 1.0,
ADD COLUMN IF NOT EXISTS historical_significance text,
ADD COLUMN IF NOT EXISTS detection_keywords text[],
ADD COLUMN IF NOT EXISTS visual_markers jsonb DEFAULT '{}',
ADD COLUMN IF NOT EXISTS cross_reference_coins text[];

-- Enhanced error coins market data with pricing intelligence
ALTER TABLE error_coins_market_data
ADD COLUMN IF NOT EXISTS grade_impact_factor numeric DEFAULT 1.0,
ADD COLUMN IF NOT EXISTS condition_adjustments jsonb DEFAULT '{}',
ADD COLUMN IF NOT EXISTS regional_pricing jsonb DEFAULT '{}',
ADD COLUMN IF NOT EXISTS auction_vs_retail_ratio numeric DEFAULT 1.0;

-- Create static coins database for cross-reference
CREATE TABLE IF NOT EXISTS static_coins_db (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  year integer NOT NULL,
  country text NOT NULL,
  denomination text NOT NULL,
  composition text,
  diameter numeric,
  weight numeric,
  mint_mark text,
  mintage bigint,
  designer text,
  edge_type text,
  obverse_description text,
  reverse_description text,
  rarity_scale text,
  base_value numeric DEFAULT 0,
  catalog_numbers jsonb DEFAULT '{}',
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now()
);

-- AI training data storage
CREATE TABLE IF NOT EXISTS ai_training_data (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  image_hash text NOT NULL UNIQUE,
  image_url text NOT NULL,
  coin_identification jsonb NOT NULL,
  error_annotations jsonb DEFAULT '{}',
  validation_status text DEFAULT 'pending' CHECK (validation_status IN ('pending', 'validated', 'rejected')),
  training_quality_score numeric DEFAULT 0.5 CHECK (training_quality_score >= 0 AND training_quality_score <= 1),
  contributed_by uuid REFERENCES auth.users(id),
  validated_by uuid REFERENCES auth.users(id),
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now()
);

-- Enhanced external price sources with error-specific data
ALTER TABLE external_price_sources
ADD COLUMN IF NOT EXISTS specializes_in_errors boolean DEFAULT false,
ADD COLUMN IF NOT EXISTS error_categories text[] DEFAULT '{}',
ADD COLUMN IF NOT EXISTS pricing_methodology text DEFAULT 'market_average',
ADD COLUMN IF NOT EXISTS update_frequency_hours integer DEFAULT 24;

-- AI performance tracking for error detection
CREATE TABLE IF NOT EXISTS ai_error_detection_logs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id uuid DEFAULT gen_random_uuid(),
  image_hash text NOT NULL,
  detected_errors jsonb DEFAULT '[]',
  confidence_scores jsonb DEFAULT '{}',
  processing_time_ms integer DEFAULT 0,
  user_feedback jsonb DEFAULT '{}',
  actual_errors jsonb DEFAULT '{}',
  accuracy_verified boolean DEFAULT false,
  created_at timestamp with time zone DEFAULT now()
);

-- Photo quality assessment for dealers
CREATE TABLE IF NOT EXISTS photo_quality_assessments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  image_hash text NOT NULL,
  quality_score numeric DEFAULT 0.5 CHECK (quality_score >= 0 AND quality_score <= 1),
  lighting_score numeric DEFAULT 0.5,
  focus_score numeric DEFAULT 0.5,
  angle_score numeric DEFAULT 0.5,
  background_score numeric DEFAULT 0.5,
  resolution_score numeric DEFAULT 0.5,
  recommendations text[],
  ideal_for_error_detection boolean DEFAULT false,
  created_at timestamp with time zone DEFAULT now()
);

-- Add unique constraint on source_url if it doesn't exist
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_constraint 
        WHERE conname = 'error_reference_sources_source_url_key'
    ) THEN
        ALTER TABLE error_reference_sources ADD CONSTRAINT error_reference_sources_source_url_key UNIQUE (source_url);
    END IF;
END $$;

-- Insert the important error reference sources (now with proper constraint)
INSERT INTO error_reference_sources (source_name, source_url, source_type, reliability_score, is_active, scraping_config) 
VALUES
  ('Error-Ref.com', 'https://www.error-ref.com/', 'knowledge', 0.95, true, '{
    "scraping_enabled": true,
    "error_categories": ["doubled_die", "off_center", "clipped_planchet", "die_crack"],
    "content_selectors": {
      "error_name": ".error-title, h1",
      "description": ".error-description, .content p",
      "images": ".error-images img",
      "identification_tips": ".identification ul li"
    }
  }'::jsonb),
  ('DoubledDie.com', 'https://doubleddie.com/', 'knowledge', 0.90, true, '{
    "scraping_enabled": true,
    "specialization": "doubled_die_varieties",
    "content_selectors": {
      "variety_name": "h1, .variety-title",
      "description": ".variety-description",
      "identification": ".identification-guide"
    }
  }'::jsonb),
  ('APMEX Error Coins', 'https://www.apmex.com/', 'marketplace', 0.85, true, '{
    "scraping_enabled": true,
    "source_type": "marketplace",
    "price_tracking": true,
    "content_selectors": {
      "product_name": ".product-title",
      "price": ".price",
      "grade": ".grade-info",
      "description": ".product-description"
    }
  }'::jsonb),
  ('Amazon Numismatics', 'https://www.amazon.com/', 'marketplace', 0.70, true, '{
    "scraping_enabled": true,
    "source_type": "marketplace",
    "search_terms": ["error coin", "doubled die", "off center", "mint error"],
    "content_selectors": {
      "product_title": "[data-cy=title]",
      "price": ".a-price-whole",
      "rating": ".a-icon-alt"
    }
  }'::jsonb),
  ('The Spruce Crafts', 'https://www.thesprucecrafts.com/', 'educational', 0.80, true, '{
    "scraping_enabled": true,
    "source_type": "educational",
    "content_focus": "error_identification_guides",
    "content_selectors": {
      "article_title": "h1",
      "content": ".article-content p",
      "tips": ".tip-box, .highlight"
    }
  }'::jsonb)
ON CONFLICT (source_url) DO NOTHING;

-- Enable RLS on all new tables
ALTER TABLE static_coins_db ENABLE ROW LEVEL SECURITY;
ALTER TABLE ai_training_data ENABLE ROW LEVEL SECURITY;
ALTER TABLE ai_error_detection_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE photo_quality_assessments ENABLE ROW LEVEL SECURITY;

-- RLS Policies for static_coins_db (public read, admin write)
CREATE POLICY "Allow public read access to static coins" ON static_coins_db
  FOR SELECT USING (true);

CREATE POLICY "Allow admin write access to static coins" ON static_coins_db
  FOR ALL USING (
    EXISTS (SELECT 1 FROM user_roles WHERE user_id = auth.uid() AND role = 'admin')
  );

-- RLS Policies for ai_training_data
CREATE POLICY "Users can view their own training data" ON ai_training_data
  FOR SELECT USING (contributed_by = auth.uid() OR auth.uid() IN (
    SELECT user_id FROM user_roles WHERE role = 'admin'
  ));

CREATE POLICY "Users can insert their own training data" ON ai_training_data
  FOR INSERT WITH CHECK (contributed_by = auth.uid());

CREATE POLICY "Admins can validate training data" ON ai_training_data
  FOR UPDATE USING (
    EXISTS (SELECT 1 FROM user_roles WHERE user_id = auth.uid() AND role = 'admin')
  );

-- RLS Policies for ai_error_detection_logs
CREATE POLICY "Users can view their own detection logs" ON ai_error_detection_logs
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM coins WHERE user_id = auth.uid()) OR
    EXISTS (SELECT 1 FROM user_roles WHERE user_id = auth.uid() AND role IN ('admin', 'dealer'))
  );

CREATE POLICY "Authenticated users can insert detection logs" ON ai_error_detection_logs
  FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);

-- RLS Policies for photo_quality_assessments  
CREATE POLICY "Users can view photo quality assessments" ON photo_quality_assessments
  FOR SELECT USING (auth.uid() IS NOT NULL);

CREATE POLICY "Dealers and admins can insert photo assessments" ON photo_quality_assessments
  FOR INSERT WITH CHECK (
    EXISTS (SELECT 1 FROM user_roles WHERE user_id = auth.uid() AND role IN ('admin', 'dealer'))
  );

-- Enhanced RLS policies for existing error tables
DROP POLICY IF EXISTS "Allow public read access to error knowledge" ON error_coins_knowledge;
CREATE POLICY "Allow public read access to error knowledge" ON error_coins_knowledge
  FOR SELECT USING (true);

DROP POLICY IF EXISTS "Allow admin write access to error knowledge" ON error_coins_knowledge;
CREATE POLICY "Allow admin write access to error knowledge" ON error_coins_knowledge
  FOR ALL USING (
    EXISTS (SELECT 1 FROM user_roles WHERE user_id = auth.uid() AND role = 'admin')
  );

DROP POLICY IF EXISTS "Allow public read access to error market data" ON error_coins_market_data;
CREATE POLICY "Allow public read access to error market data" ON error_coins_market_data
  FOR SELECT USING (true);

DROP POLICY IF EXISTS "Allow admin write access to error market data" ON error_coins_market_data;
CREATE POLICY "Allow admin write access to error market data" ON error_coins_market_data
  FOR ALL USING (
    EXISTS (SELECT 1 FROM user_roles WHERE user_id = auth.uid() AND role = 'admin')
  );

-- Enhanced function for error detection with cross-reference
CREATE OR REPLACE FUNCTION detect_coin_errors(
  p_image_hash text,
  p_base_coin_info jsonb,
  p_detection_config jsonb DEFAULT '{}'
) RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  result jsonb := '{"errors_detected": [], "confidence_scores": {}, "cross_references": []}';
  error_record record;
  confidence_score numeric;
BEGIN
  -- Log the detection attempt
  INSERT INTO ai_error_detection_logs (image_hash, detected_errors, confidence_scores)
  VALUES (p_image_hash, '[]', '{}');
  
  -- Search for potential errors based on coin characteristics
  FOR error_record IN 
    SELECT * FROM error_coins_knowledge 
    WHERE (
      detection_keywords && ARRAY(SELECT jsonb_array_elements_text(p_base_coin_info->'keywords')) OR
      error_category = p_base_coin_info->>'category' OR
      error_type = p_base_coin_info->>'type'
    )
    ORDER BY rarity_score DESC, severity_level DESC
  LOOP
    -- Calculate confidence based on visual markers and detection difficulty
    confidence_score := GREATEST(0.1, 
      LEAST(1.0, 0.8 - (error_record.detection_difficulty::numeric / 10.0))
    );
    
    -- Add to result if confidence is above threshold
    IF confidence_score >= COALESCE((p_detection_config->>'min_confidence')::numeric, 0.3) THEN
      result := jsonb_set(
        result,
        '{errors_detected}',
        (result->'errors_detected') || jsonb_build_object(
          'error_id', error_record.id,
          'error_name', error_record.error_name,
          'error_type', error_record.error_type,
          'severity', error_record.severity_level,
          'rarity', error_record.rarity_score,
          'confidence', confidence_score
        )
      );
    END IF;
  END LOOP;
  
  RETURN result;
END;
$$;

-- Function for advanced pricing based on error and grade
CREATE OR REPLACE FUNCTION calculate_error_coin_value(
  p_error_id uuid,
  p_grade text,
  p_base_coin_value numeric DEFAULT 0
) RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  error_info record;
  market_data record;
  calculated_value numeric;
  price_range jsonb;
BEGIN
  -- Get error information
  SELECT * INTO error_info FROM error_coins_knowledge WHERE id = p_error_id;
  
  IF NOT FOUND THEN
    RETURN '{"error": "Error not found"}';
  END IF;
  
  -- Get market data for this error and grade
  SELECT * INTO market_data 
  FROM error_coins_market_data 
  WHERE knowledge_base_id = p_error_id AND grade = p_grade
  ORDER BY updated_at DESC
  LIMIT 1;
  
  IF FOUND THEN
    -- Use actual market data
    price_range := jsonb_build_object(
      'low', market_data.market_value_low,
      'average', market_data.market_value_avg,
      'high', market_data.market_value_high,
      'premium_percentage', market_data.premium_percentage,
      'data_source', 'market_data'
    );
  ELSE
    -- Calculate estimated value based on rarity and base value
    calculated_value := p_base_coin_value * COALESCE(error_info.market_premium_multiplier, 1.0) * 
                       (1 + (error_info.rarity_score::numeric / 10.0));
    
    price_range := jsonb_build_object(
      'estimated_value', calculated_value,
      'confidence', 'estimated',
      'premium_multiplier', error_info.market_premium_multiplier,
      'data_source', 'calculated'
    );
  END IF;
  
  RETURN jsonb_build_object(
    'error_name', error_info.error_name,
    'error_type', error_info.error_type,
    'grade', p_grade,
    'pricing', price_range,
    'rarity_score', error_info.rarity_score,
    'calculated_at', now()
  );
END;
$$;
