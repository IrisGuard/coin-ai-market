-- Phase 10.5 Final Completion - Add Production Testing Framework & Optimization
-- Add system metrics table for production monitoring

CREATE TABLE IF NOT EXISTS public.system_metrics (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  metric_name TEXT NOT NULL,
  metric_value NUMERIC NOT NULL,
  metric_type TEXT DEFAULT 'gauge', -- gauge, counter, histogram
  tags JSONB DEFAULT '{}',
  recorded_at TIMESTAMPTZ DEFAULT now()
);

-- Add production testing results table
CREATE TABLE IF NOT EXISTS public.production_test_results (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  test_type TEXT NOT NULL,
  test_results JSONB NOT NULL,
  overall_status TEXT NOT NULL, -- PRODUCTION_READY, NEEDS_ATTENTION, CRITICAL_ISSUES
  overall_score INTEGER DEFAULT 0,
  test_duration INTEGER DEFAULT 0,
  samples_tested INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Add system alerts table for monitoring
CREATE TABLE IF NOT EXISTS public.system_alerts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  alert_type TEXT NOT NULL,
  severity TEXT NOT NULL, -- low, medium, high, critical
  title TEXT NOT NULL,
  description TEXT,
  alert_data JSONB DEFAULT '{}',
  is_resolved BOOLEAN DEFAULT false,
  resolved_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Enhanced indexes for performance optimization
CREATE INDEX IF NOT EXISTS idx_system_metrics_name_time ON public.system_metrics (metric_name, recorded_at DESC);
CREATE INDEX IF NOT EXISTS idx_production_tests_type ON public.production_test_results (test_type, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_system_alerts_severity ON public.system_alerts (severity, is_resolved, created_at DESC);

-- RLS Policies for production monitoring
ALTER TABLE public.system_metrics ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.production_test_results ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.system_alerts ENABLE ROW LEVEL SECURITY;

-- Admin access to all monitoring tables
CREATE POLICY "Admin full access to system_metrics" ON public.system_metrics FOR ALL USING (verify_admin_access_secure());
CREATE POLICY "Admin full access to production_test_results" ON public.production_test_results FOR ALL USING (verify_admin_access_secure());
CREATE POLICY "Admin full access to system_alerts" ON public.system_alerts FOR ALL USING (verify_admin_access_secure());

-- Insert initial global coin sources if not exists
INSERT INTO public.global_coin_sources (base_url, source_name, source_type, country, language, success_rate) VALUES
-- Additional premium sources for Phase 10.5
('https://www.pcgs.com/coinfacts', 'PCGS CoinFacts', 'database', 'US', 'en', 0.95),
('https://www.ngccoin.com/price-guide', 'NGC Price Guide', 'database', 'US', 'en', 0.92),
('https://www.greysheet.com', 'Greysheet', 'pricing', 'US', 'en', 0.89),
('https://www.cdncoin.com', 'CDN Publishing', 'pricing', 'US', 'en', 0.87),
('https://www.coinworld.com/news/precious-metals', 'Coin World', 'news', 'US', 'en', 0.78),
('https://www.coinage.org', 'ANA', 'organization', 'US', 'en', 0.85),
('https://www.money.org', 'ANA Resources', 'educational', 'US', 'en', 0.82),
('https://www.professionalcoin.com', 'Professional Coin Grading', 'services', 'US', 'en', 0.91),
('https://www.apmex.com/category/20000/coins', 'APMEX Coins', 'marketplace', 'US', 'en', 0.84),
('https://www.jmbullion.com/coins', 'JM Bullion Coins', 'marketplace', 'US', 'en', 0.83)

ON CONFLICT (base_url) DO UPDATE SET
  success_rate = EXCLUDED.success_rate,
  updated_at = now(),
  is_active = true;

-- Update global coin sources success rates for existing entries
UPDATE public.global_coin_sources 
SET success_rate = CASE 
  WHEN source_name = 'Heritage Auctions' THEN 0.96
  WHEN source_name = 'Stack''s Bowers' THEN 0.94
  WHEN source_name = 'NGC' THEN 0.93
  WHEN source_name = 'PCGS' THEN 0.95
  WHEN source_name = 'Sixbid' THEN 0.88
  WHEN source_name = 'MA-Shops' THEN 0.85
  WHEN source_name = 'Coin Archives' THEN 0.91
  WHEN source_name = 'NumisBids' THEN 0.87
  WHEN source_name = 'Coin Community' THEN 0.79
  WHEN source_name = 'CoinTalk' THEN 0.77
  WHEN source_name = 'Error Reference' THEN 0.92
  WHEN source_name = 'CONECA' THEN 0.90
  WHEN source_name = 'uCoin' THEN 0.86
  WHEN source_name = 'Numista' THEN 0.88
  WHEN source_name = 'eBay' THEN 0.73
  WHEN source_name = 'WorthPoint' THEN 0.81
  ELSE success_rate
END,
updated_at = now()
WHERE base_url IN (
  'https://www.heritage.com',
  'https://www.stacksbowers.com', 
  'https://www.ngccoin.com',
  'https://www.pcgs.com',
  'https://www.sixbid.com',
  'https://www.ma-shops.com',
  'https://www.coinarchives.com',
  'https://www.numisbids.com',
  'https://www.coincommunity.com',
  'https://www.cointalk.com',
  'https://www.error-ref.com',
  'https://www.conecaonline.org',
  'https://www.ucoin.net',
  'https://en.numista.com',
  'https://www.ebay.com',
  'https://www.worthpoint.com'
);

-- Function to record phase completion
CREATE OR REPLACE FUNCTION public.record_phase_completion(
  phase_number TEXT,
  completion_percentage INTEGER,
  validation_results JSONB DEFAULT '{}'
)
RETURNS UUID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
DECLARE
  result_id UUID;
BEGIN
  INSERT INTO public.production_test_results (
    test_type,
    test_results,
    overall_status,
    overall_score,
    created_at
  ) VALUES (
    'phase_' || phase_number || '_validation',
    validation_results,
    CASE 
      WHEN completion_percentage >= 95 THEN 'PRODUCTION_READY'
      WHEN completion_percentage >= 80 THEN 'NEEDS_ATTENTION'
      ELSE 'CRITICAL_ISSUES'
    END,
    completion_percentage,
    now()
  ) RETURNING id INTO result_id;
  
  -- Record metric
  INSERT INTO public.system_metrics (
    metric_name,
    metric_value,
    metric_type,
    tags
  ) VALUES (
    'phase_completion',
    completion_percentage,
    'gauge',
    jsonb_build_object('phase', phase_number)
  );
  
  RETURN result_id;
END;
$$;

-- Log Phase 10.5 completion initialization
INSERT INTO public.analytics_events (
  event_type,
  page_url,
  metadata,
  timestamp
) VALUES (
  'phase_10_5_final_completion_initialized',
  '/admin/phases',
  jsonb_build_object(
    'phase', '10.5',
    'status', 'final_15_percent_implementation',
    'components', jsonb_build_array(
      'dealer_learning_engine_completion',
      'production_testing_framework',
      'multi_language_ocr_integration', 
      'global_ai_brain_enhancement',
      'database_optimization'
    ),
    'target_completion', '100%',
    'ready_for_phase_11', false
  ),
  now()
);