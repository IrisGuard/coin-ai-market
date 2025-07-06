-- Phase 2B.5: Complete Multi-Category Source Activation (Fixed)
-- Step 1: Mass populate source_category_mapping with all sources × 5 categories

WITH category_mappings AS (
  SELECT 
    gcs.id as source_id,
    'coins' as category,
    'coin {query} collectible numismatic' as search_template,
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
  
  UNION ALL
  
  SELECT 
    gcs.id,
    'banknotes',
    'banknote {query} paper money currency',
    CASE 
      WHEN gcs.source_name ILIKE '%ebay%' OR gcs.source_name ILIKE '%heritage%' OR gcs.source_name ILIKE '%stack%' THEN 10
      WHEN gcs.source_name ILIKE '%pcgs%' OR gcs.source_name ILIKE '%ngc%' THEN 9
      WHEN gcs.source_name ILIKE '%ma-shop%' OR gcs.source_name ILIKE '%vcoins%' THEN 8
      ELSE 7
    END,
    CASE 
      WHEN gcs.source_name ILIKE '%ebay%' OR gcs.source_name ILIKE '%heritage%' THEN 0.95
      WHEN gcs.source_name ILIKE '%pcgs%' OR gcs.source_name ILIKE '%ngc%' THEN 0.90
      ELSE 0.85
    END
  FROM public.global_coin_sources gcs
  
  UNION ALL
  
  SELECT 
    gcs.id,
    'bullion',
    'bullion {query} gold silver bar ingot',
    CASE 
      WHEN gcs.source_name ILIKE '%ebay%' OR gcs.source_name ILIKE '%heritage%' OR gcs.source_name ILIKE '%stack%' THEN 10
      WHEN gcs.source_name ILIKE '%pcgs%' OR gcs.source_name ILIKE '%ngc%' THEN 9
      WHEN gcs.source_name ILIKE '%ma-shop%' OR gcs.source_name ILIKE '%vcoins%' THEN 8
      ELSE 7
    END,
    CASE 
      WHEN gcs.source_name ILIKE '%ebay%' OR gcs.source_name ILIKE '%heritage%' THEN 0.95
      WHEN gcs.source_name ILIKE '%pcgs%' OR gcs.source_name ILIKE '%ngc%' THEN 0.90
      ELSE 0.85
    END
  FROM public.global_coin_sources gcs
  
  UNION ALL
  
  SELECT 
    gcs.id,
    'error_coins',
    'error coin {query} minting mistake variety',
    CASE 
      WHEN gcs.source_name ILIKE '%ebay%' OR gcs.source_name ILIKE '%heritage%' OR gcs.source_name ILIKE '%stack%' THEN 10
      WHEN gcs.source_name ILIKE '%pcgs%' OR gcs.source_name ILIKE '%ngc%' THEN 9
      WHEN gcs.source_name ILIKE '%ma-shop%' OR gcs.source_name ILIKE '%vcoins%' THEN 8
      ELSE 7
    END,
    CASE 
      WHEN gcs.source_name ILIKE '%ebay%' OR gcs.source_name ILIKE '%heritage%' THEN 0.95
      WHEN gcs.source_name ILIKE '%pcgs%' OR gcs.source_name ILIKE '%ngc%' THEN 0.90
      ELSE 0.85
    END
  FROM public.global_coin_sources gcs
  
  UNION ALL
  
  SELECT 
    gcs.id,
    'error_banknotes',
    'error banknote {query} printing mistake variety',
    CASE 
      WHEN gcs.source_name ILIKE '%ebay%' OR gcs.source_name ILIKE '%heritage%' OR gcs.source_name ILIKE '%stack%' THEN 10
      WHEN gcs.source_name ILIKE '%pcgs%' OR gcs.source_name ILIKE '%ngc%' THEN 9
      WHEN gcs.source_name ILIKE '%ma-shop%' OR gcs.source_name ILIKE '%vcoins%' THEN 8
      ELSE 7
    END,
    CASE 
      WHEN gcs.source_name ILIKE '%ebay%' OR gcs.source_name ILIKE '%heritage%' THEN 0.95
      WHEN gcs.source_name ILIKE '%pcgs%' OR gcs.source_name ILIKE '%ngc%' THEN 0.90
      ELSE 0.85
    END
  FROM public.global_coin_sources gcs
)
INSERT INTO public.source_category_mapping (source_id, category, search_template, priority, success_rate)
SELECT source_id, category, search_template, priority, success_rate
FROM category_mappings
ON CONFLICT (source_id, category) DO UPDATE SET
  search_template = EXCLUDED.search_template,
  priority = EXCLUDED.priority,
  success_rate = EXCLUDED.success_rate;

-- Step 2: Create autonomous source discovery configuration table
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

-- Step 3: Create AI learning performance tracking
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

-- Step 4: Create global source intelligence network table
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

-- Step 5: Populate discovery configurations for autonomous operation
INSERT INTO public.source_discovery_config (discovery_type, search_patterns, target_regions, quality_threshold, max_sources_per_run)
VALUES 
  ('auction_houses', '["coin auction", "numismatic auction", "collectible auction"]', '["US", "EU", "UK", "AU", "CA"]', 0.8, 5),
  ('dealer_shops', '["coin dealer", "numismatic shop", "bullion dealer"]', '["US", "EU", "UK", "DE", "FR", "IT"]', 0.7, 8),
  ('marketplace_platforms', '["coin marketplace", "collectible platform", "numismatic exchange"]', '["Global"]', 0.75, 6),
  ('specialized_sources', '["error coin specialist", "banknote expert", "bullion specialist"]', '["US", "EU", "UK", "AU"]', 0.85, 4);

-- Step 6: Enable RLS on new tables
ALTER TABLE public.source_discovery_config ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ai_learning_performance ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.global_source_intelligence ENABLE ROW LEVEL SECURITY;

-- Step 7: Create RLS policies
CREATE POLICY "Admin full access to source_discovery_config" ON public.source_discovery_config FOR ALL USING (verify_admin_access_secure());
CREATE POLICY "Admin full access to ai_learning_performance" ON public.ai_learning_performance FOR ALL USING (verify_admin_access_secure());
CREATE POLICY "Admin full access to global_source_intelligence" ON public.global_source_intelligence FOR ALL USING (verify_admin_access_secure());
CREATE POLICY "Public read source_discovery_config" ON public.source_discovery_config FOR SELECT USING (is_active = true);
CREATE POLICY "Public read ai_learning_performance" ON public.ai_learning_performance FOR SELECT USING (true);
CREATE POLICY "Public read global_source_intelligence" ON public.global_source_intelligence FOR SELECT USING (true);

-- Step 8: Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_source_discovery_config_active ON public.source_discovery_config(is_active, discovery_type);
CREATE INDEX IF NOT EXISTS idx_ai_learning_performance_category ON public.ai_learning_performance(category, last_learning_update);
CREATE INDEX IF NOT EXISTS idx_global_source_intelligence_source_type ON public.global_source_intelligence(source_id, intelligence_type);
CREATE INDEX IF NOT EXISTS idx_global_source_intelligence_region ON public.global_source_intelligence(geographic_region, auto_discovered);

-- Step 9: Log Phase 2B.5 completion
INSERT INTO public.analytics_events (
  event_type,
  page_url,
  metadata,
  timestamp
) VALUES (
  'phase_2b5_autonomous_ai_system_complete',
  '/admin/ai-brain',
  jsonb_build_object(
    'source_mappings_created', (SELECT COUNT(*) FROM public.source_category_mapping),
    'discovery_configs_active', (SELECT COUNT(*) FROM public.source_discovery_config WHERE is_active = true),
    'global_intelligence_ready', true,
    'autonomous_discovery_enabled', true,
    'self_learning_tracking_active', true,
    'phase_status', 'AUTONOMOUS_AI_SYSTEM_PHASE_2B5_COMPLETE'
  ),
  now()
);