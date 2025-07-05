-- Phase 10.5: True Global AI Brain Database Schema

-- Global Coin Sources Registry
CREATE TABLE IF NOT EXISTS public.global_coin_sources (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  base_url TEXT NOT NULL UNIQUE,
  source_name TEXT NOT NULL,
  source_type TEXT NOT NULL DEFAULT 'auction_house', -- auction_house, forum, dealer, marketplace, database
  country TEXT,
  language TEXT DEFAULT 'en',
  success_rate NUMERIC DEFAULT 0.0,
  response_time_avg INTEGER DEFAULT 0, -- milliseconds
  last_scraped TIMESTAMPTZ,
  is_active BOOLEAN DEFAULT true,
  scraping_config JSONB DEFAULT '{}',
  rate_limit_per_minute INTEGER DEFAULT 60,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Enhanced AI Recognition Cache (expanded)
ALTER TABLE public.ai_recognition_cache 
ADD COLUMN IF NOT EXISTS multi_language_data JSONB DEFAULT '{}',
ADD COLUMN IF NOT EXISTS error_patterns JSONB DEFAULT '{}',
ADD COLUMN IF NOT EXISTS market_analysis JSONB DEFAULT '{}',
ADD COLUMN IF NOT EXISTS global_sources_count INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS discovery_version TEXT DEFAULT 'v1.0';

-- Global Learning Database
CREATE TABLE IF NOT EXISTS public.global_coin_learning (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  coin_identifier TEXT NOT NULL,
  image_hash TEXT,
  learned_data JSONB NOT NULL,
  source_urls TEXT[],
  verification_count INTEGER DEFAULT 1,
  accuracy_score NUMERIC DEFAULT 0.5,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Web Discovery Sessions
CREATE TABLE IF NOT EXISTS public.web_discovery_sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id TEXT NOT NULL,
  coin_query JSONB NOT NULL,
  sources_attempted INTEGER DEFAULT 0,
  sources_successful INTEGER DEFAULT 0,
  results_found JSONB DEFAULT '[]',
  processing_time_ms INTEGER,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Multi-Language Coin Inscriptions
CREATE TABLE IF NOT EXISTS public.coin_inscriptions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  image_hash TEXT NOT NULL,
  original_language TEXT,
  original_text TEXT,
  english_translation TEXT,
  confidence_score NUMERIC DEFAULT 0.5,
  ocr_engine TEXT DEFAULT 'tesseract',
  translation_engine TEXT DEFAULT 'google',
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Error Coin Patterns (enhanced)
ALTER TABLE public.error_coins_knowledge 
ADD COLUMN IF NOT EXISTS pattern_signature JSONB DEFAULT '{}',
ADD COLUMN IF NOT EXISTS visual_markers_ai JSONB DEFAULT '{}',
ADD COLUMN IF NOT EXISTS detection_algorithm TEXT,
ADD COLUMN IF NOT EXISTS false_positive_rate NUMERIC DEFAULT 0.1;

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_global_sources_active ON public.global_coin_sources (is_active, success_rate DESC);
CREATE INDEX IF NOT EXISTS idx_global_sources_type ON public.global_coin_sources (source_type, country);
CREATE INDEX IF NOT EXISTS idx_ai_cache_hash ON public.ai_recognition_cache (image_hash);
CREATE INDEX IF NOT EXISTS idx_learning_identifier ON public.global_coin_learning (coin_identifier);
CREATE INDEX IF NOT EXISTS idx_discovery_session ON public.web_discovery_sessions (session_id);
CREATE INDEX IF NOT EXISTS idx_inscriptions_hash ON public.coin_inscriptions (image_hash);

-- RLS Policies
ALTER TABLE public.global_coin_sources ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.global_coin_learning ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.web_discovery_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.coin_inscriptions ENABLE ROW LEVEL SECURITY;

-- Admin access to all global AI tables
CREATE POLICY "Admin full access to global_coin_sources" ON public.global_coin_sources FOR ALL USING (verify_admin_access_secure());
CREATE POLICY "Admin full access to global_coin_learning" ON public.global_coin_learning FOR ALL USING (verify_admin_access_secure());
CREATE POLICY "Admin full access to web_discovery_sessions" ON public.web_discovery_sessions FOR ALL USING (verify_admin_access_secure());
CREATE POLICY "Admin full access to coin_inscriptions" ON public.coin_inscriptions FOR ALL USING (verify_admin_access_secure());

-- Public read access for global sources (active only)
CREATE POLICY "Public read active global_coin_sources" ON public.global_coin_sources 
  FOR SELECT USING (is_active = true);

-- Users can read their own discovery sessions
CREATE POLICY "Users read own web_discovery_sessions" ON public.web_discovery_sessions 
  FOR SELECT USING (true); -- Sessions are anonymous for now

-- Insert initial global sources
INSERT INTO public.global_coin_sources (base_url, source_name, source_type, country, language) VALUES
-- Major Auction Houses
('https://www.heritage.com', 'Heritage Auctions', 'auction_house', 'US', 'en'),
('https://www.stacksbowers.com', 'Stack''s Bowers', 'auction_house', 'US', 'en'),
('https://www.ngccoin.com', 'NGC', 'grading_service', 'US', 'en'),
('https://www.pcgs.com', 'PCGS', 'grading_service', 'US', 'en'),

-- International Sources
('https://www.sixbid.com', 'Sixbid', 'auction_house', 'DE', 'en'),
('https://www.ma-shops.com', 'MA-Shops', 'marketplace', 'DE', 'de'),
('https://www.coinarchives.com', 'Coin Archives', 'database', 'US', 'en'),
('https://www.numisbids.com', 'NumisBids', 'auction_house', 'US', 'en'),

-- Forums & Communities
('https://www.coincommunity.com', 'Coin Community', 'forum', 'US', 'en'),
('https://www.cointalk.com', 'CoinTalk', 'forum', 'US', 'en'),

-- Error Coin Specialists
('https://www.error-ref.com', 'Error Reference', 'database', 'US', 'en'),
('https://www.conecaonline.org', 'CONECA', 'organization', 'US', 'en'),

-- International Coin Databases
('https://www.ucoin.net', 'uCoin', 'database', 'Global', 'en'),
('https://en.numista.com', 'Numista', 'database', 'Global', 'en'),

-- Additional Discovery Sources
('https://www.ebay.com', 'eBay', 'marketplace', 'Global', 'en'),
('https://www.worthpoint.com', 'WorthPoint', 'valuation', 'US', 'en')

ON CONFLICT (base_url) DO UPDATE SET
  updated_at = now(),
  is_active = true;

-- Function to update source success rates
CREATE OR REPLACE FUNCTION update_source_success_rate(
  source_url TEXT,
  was_successful BOOLEAN,
  response_time INTEGER DEFAULT NULL
)
RETURNS VOID
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  UPDATE public.global_coin_sources 
  SET 
    success_rate = CASE 
      WHEN was_successful THEN GREATEST(0, LEAST(1, success_rate + 0.05))
      ELSE GREATEST(0, success_rate - 0.02)
    END,
    response_time_avg = CASE 
      WHEN response_time IS NOT NULL THEN 
        COALESCE((response_time_avg + response_time) / 2, response_time)
      ELSE response_time_avg
    END,
    last_scraped = now(),
    updated_at = now()
  WHERE base_url = source_url;
END;
$$;