-- Phase 2B.4: Multi-Category Source Transformation - Database Schema Enhancement

-- Step 1: Add multi-category support to existing source tables
ALTER TABLE public.global_coin_sources 
ADD COLUMN IF NOT EXISTS multi_category_support boolean DEFAULT true,
ADD COLUMN IF NOT EXISTS supported_categories text[] DEFAULT ARRAY['coins', 'banknotes', 'bullion'],
ADD COLUMN IF NOT EXISTS category_search_params jsonb DEFAULT '{}',
ADD COLUMN IF NOT EXISTS last_multi_category_sync timestamp with time zone DEFAULT now();

-- Step 2: Create source category mapping table for flexible assignments
CREATE TABLE IF NOT EXISTS public.source_category_mapping (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  source_id uuid NOT NULL,
  category text NOT NULL,
  search_template text,
  priority integer DEFAULT 1,
  success_rate numeric DEFAULT 1.0,
  last_success timestamp with time zone,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Step 3: Create AI training data enhancement table
CREATE TABLE IF NOT EXISTS public.ai_learning_sessions (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid,
  upload_id uuid,
  original_analysis jsonb NOT NULL,
  user_corrections jsonb DEFAULT '{}',
  accuracy_score numeric DEFAULT 0.5,
  learning_applied boolean DEFAULT false,
  contribution_score integer DEFAULT 0,
  category text NOT NULL,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Step 4: Create source performance tracking
CREATE TABLE IF NOT EXISTS public.source_performance_logs (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  source_id uuid NOT NULL,
  category text NOT NULL,
  search_query text,
  response_time_ms integer,
  success boolean DEFAULT false,
  results_count integer DEFAULT 0,
  confidence_avg numeric DEFAULT 0.5,
  created_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Step 5: Enable RLS on new tables
ALTER TABLE public.source_category_mapping ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ai_learning_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.source_performance_logs ENABLE ROW LEVEL SECURITY;

-- Step 6: Create RLS policies for new tables
CREATE POLICY "Admin full access to source_category_mapping" ON public.source_category_mapping FOR ALL USING (verify_admin_access_secure());
CREATE POLICY "Public read source_category_mapping" ON public.source_category_mapping FOR SELECT USING (true);

CREATE POLICY "Admin full access to ai_learning_sessions" ON public.ai_learning_sessions FOR ALL USING (verify_admin_access_secure());
CREATE POLICY "Users manage own ai_learning_sessions" ON public.ai_learning_sessions FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Admin full access to source_performance_logs" ON public.source_performance_logs FOR ALL USING (verify_admin_access_secure());
CREATE POLICY "Public read source_performance_logs" ON public.source_performance_logs FOR SELECT USING (true);

-- Step 7: Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_source_category_mapping_source_category ON public.source_category_mapping(source_id, category);
CREATE INDEX IF NOT EXISTS idx_ai_learning_sessions_user_category ON public.ai_learning_sessions(user_id, category);
CREATE INDEX IF NOT EXISTS idx_source_performance_logs_source_created ON public.source_performance_logs(source_id, created_at DESC);

-- Step 8: Update existing sources to be multi-category
UPDATE public.global_coin_sources 
SET 
  multi_category_support = true,
  supported_categories = CASE 
    WHEN source_name ILIKE '%ebay%' OR source_name ILIKE '%heritage%' OR source_name ILIKE '%stack%' THEN 
      ARRAY['coins', 'banknotes', 'bullion', 'error_coins', 'error_banknotes']
    WHEN source_name ILIKE '%pcgs%' OR source_name ILIKE '%ngc%' THEN 
      ARRAY['coins', 'banknotes'] 
    ELSE 
      ARRAY['coins', 'banknotes', 'bullion']
  END,
  category_search_params = jsonb_build_object(
    'coins', jsonb_build_object('keywords', ARRAY['coin', 'numismatic', 'graded'], 'filters', ARRAY['currency', 'collectible']),
    'banknotes', jsonb_build_object('keywords', ARRAY['banknote', 'currency', 'paper money'], 'filters', ARRAY['banknote', 'bill']),
    'bullion', jsonb_build_object('keywords', ARRAY['gold bar', 'silver bar', 'bullion'], 'filters', ARRAY['precious metals', 'investment'])
  );

-- Step 9: Create update triggers
CREATE TRIGGER update_source_category_mapping_updated_at
    BEFORE UPDATE ON public.source_category_mapping
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_ai_learning_sessions_updated_at
    BEFORE UPDATE ON public.ai_learning_sessions
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();

-- Step 10: Log Phase 2B.4 completion
INSERT INTO public.analytics_events (
  event_type,
  page_url,
  metadata,
  timestamp
) VALUES (
  'phase_2b4_multi_category_transformation_complete',
  '/admin/ai-brain',
  jsonb_build_object(
    'multi_category_sources_updated', (SELECT COUNT(*) FROM public.global_coin_sources WHERE multi_category_support = true),
    'new_tables_created', 3,
    'total_supported_categories', 5,
    'phase_status', 'PHASE_2B4_DATABASE_COMPLETE',
    'next_phase', 'real_web_integration'
  ),
  now()
);