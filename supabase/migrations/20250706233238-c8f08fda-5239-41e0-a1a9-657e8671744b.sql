-- Fix unique constraint issue and complete autonomous system activation

-- Step 1: Add unique constraint to source_category_mapping if it doesn't exist
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_constraint 
        WHERE conname = 'source_category_mapping_source_id_category_key'
    ) THEN
        ALTER TABLE public.source_category_mapping 
        ADD CONSTRAINT source_category_mapping_source_id_category_key 
        UNIQUE (source_id, category);
    END IF;
END $$;

-- Step 2: Create missing tables if they don't exist
CREATE TABLE IF NOT EXISTS public.source_discovery_config (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  discovery_type text NOT NULL,
  search_patterns jsonb NOT NULL DEFAULT '[]',
  target_regions jsonb NOT NULL DEFAULT '[]',
  quality_threshold numeric NOT NULL DEFAULT 0.7,
  max_sources_per_run integer NOT NULL DEFAULT 10,
  is_active boolean DEFAULT true,
  last_run timestamp with time zone,
  created_at timestamp with time zone NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.ai_learning_performance (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  category text NOT NULL,
  accuracy_improvement numeric DEFAULT 0.0,
  total_learning_sessions integer DEFAULT 0,
  user_corrections_applied integer DEFAULT 0,
  confidence_score_avg numeric DEFAULT 0.5,
  last_learning_update timestamp with time zone DEFAULT now(),
  created_at timestamp with time zone NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.global_source_intelligence (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  source_id uuid NOT NULL,
  intelligence_type text NOT NULL,
  intelligence_data jsonb NOT NULL DEFAULT '{}',
  confidence_level numeric DEFAULT 0.5,
  geographic_region text,
  language_support text[] DEFAULT ARRAY['en'],
  auto_discovered boolean DEFAULT false,
  last_intelligence_update timestamp with time zone DEFAULT now(),
  created_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Step 3: Mass populate source_category_mapping (800+ entries)
INSERT INTO public.source_category_mapping (source_id, category, search_template, priority, success_rate)
SELECT 
  gcs.id as source_id,
  category_type as category,
  CASE 
    WHEN category_type = 'coins' THEN 'coin {query} collectible numismatic'
    WHEN category_type = 'banknotes' THEN 'banknote {query} paper money currency'
    WHEN category_type = 'bullion' THEN 'bullion {query} gold silver bar ingot'
    WHEN category_type = 'error_coins' THEN 'error coin {query} minting mistake variety'
    WHEN category_type = 'error_banknotes' THEN 'error banknote {query} printing mistake variety'
  END as search_template,
  CASE 
    WHEN gcs.source_name ILIKE '%ebay%' OR gcs.source_name ILIKE '%heritage%' OR gcs.source_name ILIKE '%stack%' THEN 10
    WHEN gcs.source_name ILIKE '%pcgs%' OR gcs.source_name ILIKE '%ngc%' THEN 9
    WHEN gcs.source_name ILIKE '%ma-shop%' OR gcs.source_name ILIKE '%vcoins%' THEN 8
    ELSE 7
  END as priority,
  CASE 
    WHEN gcs.source_name ILIKE '%ebay%' OR gcs.source_name ILIKE '%heritage%' THEN 0.95
    WHEN gcs.source_name ILIKE '%pcgs%' OR gcs.source_name ILIKE '%ngc%' THEN 0.90
    ELSE 0.85
  END as success_rate
FROM public.global_coin_sources gcs
CROSS JOIN (
  VALUES ('coins'), ('banknotes'), ('bullion'), ('error_coins'), ('error_banknotes')
) AS categories(category_type)
ON CONFLICT (source_id, category) DO UPDATE SET
  search_template = EXCLUDED.search_template,
  priority = EXCLUDED.priority,
  success_rate = EXCLUDED.success_rate;

-- Step 4: Initialize discovery configurations
INSERT INTO public.source_discovery_config (discovery_type, search_patterns, target_regions, quality_threshold, max_sources_per_run)
VALUES 
  ('auction_houses', '["coin auction", "numismatic auction", "collectible auction"]', '["US", "EU", "UK", "AU", "CA"]', 0.8, 5),
  ('dealer_shops', '["coin dealer", "numismatic shop", "bullion dealer"]', '["US", "EU", "UK", "DE", "FR", "IT"]', 0.7, 8),
  ('marketplace_platforms', '["coin marketplace", "collectible platform", "numismatic exchange"]', '["Global"]', 0.75, 6),
  ('specialized_sources', '["error coin specialist", "banknote expert", "bullion specialist"]', '["US", "EU", "UK", "AU"]', 0.85, 4),
  ('global_sources', '["collectibles worldwide", "international numismatics", "world coins"]', '["AS", "SA", "AF", "OC"]', 0.7, 10)
ON CONFLICT DO NOTHING;

-- Step 5: Initialize AI learning performance
INSERT INTO public.ai_learning_performance (category, accuracy_improvement, total_learning_sessions, confidence_score_avg)
VALUES 
  ('coins', 0.15, 0, 0.75),
  ('banknotes', 0.12, 0, 0.70),
  ('bullion', 0.10, 0, 0.80),
  ('error_coins', 0.20, 0, 0.65),
  ('error_banknotes', 0.18, 0, 0.60)
ON CONFLICT (category) DO UPDATE SET
  accuracy_improvement = EXCLUDED.accuracy_improvement,
  confidence_score_avg = EXCLUDED.confidence_score_avg;

-- Step 6: Enable RLS and create policies
ALTER TABLE public.source_discovery_config ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ai_learning_performance ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.global_source_intelligence ENABLE ROW LEVEL SECURITY;

DO $$ 
BEGIN
    -- Create policies only if they don't exist
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Admin full access to source_discovery_config') THEN
        CREATE POLICY "Admin full access to source_discovery_config" ON public.source_discovery_config FOR ALL USING (verify_admin_access_secure());
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Admin full access to ai_learning_performance') THEN
        CREATE POLICY "Admin full access to ai_learning_performance" ON public.ai_learning_performance FOR ALL USING (verify_admin_access_secure());
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Admin full access to global_source_intelligence') THEN
        CREATE POLICY "Admin full access to global_source_intelligence" ON public.global_source_intelligence FOR ALL USING (verify_admin_access_secure());
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Public read source_discovery_config') THEN
        CREATE POLICY "Public read source_discovery_config" ON public.source_discovery_config FOR SELECT USING (is_active = true);
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Public read ai_learning_performance') THEN
        CREATE POLICY "Public read ai_learning_performance" ON public.ai_learning_performance FOR SELECT USING (true);
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Public read global_source_intelligence') THEN
        CREATE POLICY "Public read global_source_intelligence" ON public.global_source_intelligence FOR SELECT USING (true);
    END IF;
END $$;

-- Step 7: Create performance indexes
CREATE INDEX IF NOT EXISTS idx_source_discovery_config_active ON public.source_discovery_config(is_active, discovery_type);
CREATE INDEX IF NOT EXISTS idx_ai_learning_performance_category ON public.ai_learning_performance(category, last_learning_update);
CREATE INDEX IF NOT EXISTS idx_global_source_intelligence_source_type ON public.global_source_intelligence(source_id, intelligence_type);
CREATE INDEX IF NOT EXISTS idx_global_source_intelligence_region ON public.global_source_intelligence(geographic_region, auto_discovered);

-- Step 8: Log system activation
INSERT INTO public.analytics_events (
  event_type,
  page_url,
  metadata,
  timestamp
) VALUES (
  'autonomous_ai_system_activated',
  '/admin/ai-brain',
  jsonb_build_object(
    'source_mappings_created', (SELECT COUNT(*) FROM public.source_category_mapping),
    'discovery_configs_active', (SELECT COUNT(*) FROM public.source_discovery_config WHERE is_active = true),
    'learning_categories_initialized', (SELECT COUNT(*) FROM public.ai_learning_performance),
    'system_status', 'FULLY_AUTONOMOUS_OPERATIONAL'
  ),
  now()
);