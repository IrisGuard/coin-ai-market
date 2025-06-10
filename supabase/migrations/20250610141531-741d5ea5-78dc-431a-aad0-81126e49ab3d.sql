
-- Advanced Analytics Tables
CREATE TABLE IF NOT EXISTS public.user_analytics (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  session_id TEXT NOT NULL,
  page_views INTEGER DEFAULT 0,
  time_spent_minutes INTEGER DEFAULT 0,
  actions_performed JSONB DEFAULT '[]'::jsonb,
  device_info JSONB DEFAULT '{}'::jsonb,
  location_data JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.market_analytics (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  metric_type TEXT NOT NULL,
  metric_name TEXT NOT NULL,
  metric_value NUMERIC NOT NULL,
  time_period TEXT NOT NULL DEFAULT 'daily',
  category_breakdown JSONB DEFAULT '{}'::jsonb,
  geographic_data JSONB DEFAULT '{}'::jsonb,
  trend_analysis JSONB DEFAULT '{}'::jsonb,
  recorded_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.revenue_forecasts (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  forecast_type TEXT NOT NULL,
  forecast_period TEXT NOT NULL,
  predicted_revenue NUMERIC NOT NULL,
  confidence_score NUMERIC DEFAULT 0.5,
  contributing_factors JSONB DEFAULT '{}'::jsonb,
  model_parameters JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Real-Time Monitoring Tables
CREATE TABLE IF NOT EXISTS public.system_alerts (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  alert_type TEXT NOT NULL,
  severity TEXT NOT NULL DEFAULT 'medium',
  title TEXT NOT NULL,
  description TEXT,
  metric_threshold NUMERIC,
  current_value NUMERIC,
  alert_data JSONB DEFAULT '{}'::jsonb,
  is_resolved BOOLEAN DEFAULT false,
  resolved_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.performance_benchmarks (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  benchmark_type TEXT NOT NULL,
  metric_name TEXT NOT NULL,
  baseline_value NUMERIC NOT NULL,
  current_value NUMERIC NOT NULL,
  threshold_warning NUMERIC,
  threshold_critical NUMERIC,
  improvement_suggestions TEXT[],
  last_updated TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Advanced Search and Filtering
CREATE TABLE IF NOT EXISTS public.search_analytics (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  search_query TEXT NOT NULL,
  filters_applied JSONB DEFAULT '{}'::jsonb,
  results_count INTEGER DEFAULT 0,
  user_id UUID REFERENCES auth.users(id),
  clicked_results JSONB DEFAULT '[]'::jsonb,
  search_duration_ms INTEGER,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.ai_search_filters (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  filter_name TEXT NOT NULL,
  filter_type TEXT NOT NULL,
  ai_prompt TEXT NOT NULL,
  confidence_threshold NUMERIC DEFAULT 0.7,
  is_active BOOLEAN DEFAULT true,
  usage_count INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Bulk Operations Tracking
CREATE TABLE IF NOT EXISTS public.bulk_operations (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  operation_type TEXT NOT NULL,
  operation_name TEXT NOT NULL,
  target_table TEXT NOT NULL,
  operation_parameters JSONB DEFAULT '{}'::jsonb,
  total_records INTEGER DEFAULT 0,
  processed_records INTEGER DEFAULT 0,
  failed_records INTEGER DEFAULT 0,
  status TEXT DEFAULT 'pending',
  started_by UUID REFERENCES auth.users(id),
  started_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  completed_at TIMESTAMP WITH TIME ZONE,
  error_log JSONB DEFAULT '[]'::jsonb
);

-- Store Verification System
CREATE TABLE IF NOT EXISTS public.store_verifications (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  store_id UUID REFERENCES public.stores(id) ON DELETE CASCADE,
  verification_type TEXT NOT NULL,
  verification_status TEXT DEFAULT 'pending',
  submitted_documents JSONB DEFAULT '[]'::jsonb,
  verification_notes TEXT,
  verified_by UUID REFERENCES auth.users(id),
  submitted_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  verified_at TIMESTAMP WITH TIME ZONE
);

-- Security Incident Tracking
CREATE TABLE IF NOT EXISTS public.security_incidents (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  incident_type TEXT NOT NULL,
  severity_level TEXT NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  affected_users JSONB DEFAULT '[]'::jsonb,
  incident_data JSONB DEFAULT '{}'::jsonb,
  status TEXT DEFAULT 'open',
  assigned_to UUID REFERENCES auth.users(id),
  resolved_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- API Key Rotation System
CREATE TABLE IF NOT EXISTS public.api_key_rotations (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  api_key_id UUID REFERENCES public.api_keys(id) ON DELETE CASCADE,
  old_key_hash TEXT NOT NULL,
  new_key_hash TEXT NOT NULL,
  rotation_reason TEXT,
  rotated_by UUID REFERENCES auth.users(id),
  rotation_date TIMESTAMP WITH TIME ZONE DEFAULT now(),
  old_key_expires_at TIMESTAMP WITH TIME ZONE
);

-- Geographic Regions (already exists, adding indexes)
CREATE INDEX IF NOT EXISTS idx_geographic_regions_code ON public.geographic_regions(code);
CREATE INDEX IF NOT EXISTS idx_geographic_regions_continent ON public.geographic_regions(continent);

-- Price Source Templates (enhancing existing)
CREATE TABLE IF NOT EXISTS public.price_source_templates_enhanced (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  template_name TEXT NOT NULL,
  source_type TEXT NOT NULL,
  extraction_rules JSONB NOT NULL,
  validation_rules JSONB DEFAULT '{}'::jsonb,
  transformation_rules JSONB DEFAULT '{}'::jsonb,
  error_handling JSONB DEFAULT '{}'::jsonb,
  success_rate NUMERIC DEFAULT 0,
  last_tested TIMESTAMP WITH TIME ZONE,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Data Quality Monitoring
CREATE TABLE IF NOT EXISTS public.data_quality_reports (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  source_id UUID REFERENCES public.external_price_sources(id),
  quality_score NUMERIC NOT NULL,
  completeness_score NUMERIC DEFAULT 0,
  accuracy_score NUMERIC DEFAULT 0,
  timeliness_score NUMERIC DEFAULT 0,
  consistency_score NUMERIC DEFAULT 0,
  quality_issues JSONB DEFAULT '[]'::jsonb,
  recommendations JSONB DEFAULT '[]'::jsonb,
  report_date TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Enhanced indexes for performance
CREATE INDEX IF NOT EXISTS idx_user_analytics_user_id ON public.user_analytics(user_id);
CREATE INDEX IF NOT EXISTS idx_user_analytics_session_id ON public.user_analytics(session_id);
CREATE INDEX IF NOT EXISTS idx_market_analytics_metric_type ON public.market_analytics(metric_type);
CREATE INDEX IF NOT EXISTS idx_market_analytics_recorded_at ON public.market_analytics(recorded_at);
CREATE INDEX IF NOT EXISTS idx_system_alerts_severity ON public.system_alerts(severity);
CREATE INDEX IF NOT EXISTS idx_system_alerts_is_resolved ON public.system_alerts(is_resolved);
CREATE INDEX IF NOT EXISTS idx_search_analytics_user_id ON public.search_analytics(user_id);
CREATE INDEX IF NOT EXISTS idx_search_analytics_created_at ON public.search_analytics(created_at);
CREATE INDEX IF NOT EXISTS idx_bulk_operations_status ON public.bulk_operations(status);
CREATE INDEX IF NOT EXISTS idx_security_incidents_status ON public.security_incidents(status);

-- Enable RLS on new tables
ALTER TABLE public.user_analytics ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.market_analytics ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.revenue_forecasts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.system_alerts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.performance_benchmarks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.search_analytics ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ai_search_filters ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.bulk_operations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.store_verifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.security_incidents ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.api_key_rotations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.price_source_templates_enhanced ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.data_quality_reports ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for admin access
CREATE POLICY "Admins can manage user analytics" ON public.user_analytics
  FOR ALL USING (public.verify_admin_access_secure(auth.uid()));

CREATE POLICY "Admins can manage market analytics" ON public.market_analytics
  FOR ALL USING (public.verify_admin_access_secure(auth.uid()));

CREATE POLICY "Admins can manage revenue forecasts" ON public.revenue_forecasts
  FOR ALL USING (public.verify_admin_access_secure(auth.uid()));

CREATE POLICY "Admins can manage system alerts" ON public.system_alerts
  FOR ALL USING (public.verify_admin_access_secure(auth.uid()));

CREATE POLICY "Admins can manage performance benchmarks" ON public.performance_benchmarks
  FOR ALL USING (public.verify_admin_access_secure(auth.uid()));

CREATE POLICY "Admins can manage search analytics" ON public.search_analytics
  FOR ALL USING (public.verify_admin_access_secure(auth.uid()));

CREATE POLICY "Admins can manage AI search filters" ON public.ai_search_filters
  FOR ALL USING (public.verify_admin_access_secure(auth.uid()));

CREATE POLICY "Admins can manage bulk operations" ON public.bulk_operations
  FOR ALL USING (public.verify_admin_access_secure(auth.uid()));

CREATE POLICY "Admins can manage store verifications" ON public.store_verifications
  FOR ALL USING (public.verify_admin_access_secure(auth.uid()));

CREATE POLICY "Admins can manage security incidents" ON public.security_incidents
  FOR ALL USING (public.verify_admin_access_secure(auth.uid()));

CREATE POLICY "Admins can manage API key rotations" ON public.api_key_rotations
  FOR ALL USING (public.verify_admin_access_secure(auth.uid()));

CREATE POLICY "Admins can manage price source templates" ON public.price_source_templates_enhanced
  FOR ALL USING (public.verify_admin_access_secure(auth.uid()));

CREATE POLICY "Admins can manage data quality reports" ON public.data_quality_reports
  FOR ALL USING (public.verify_admin_access_secure(auth.uid()));

-- Advanced analytics functions
CREATE OR REPLACE FUNCTION public.get_advanced_analytics_dashboard()
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = 'public'
AS $$
DECLARE
  result JSONB;
BEGIN
  WITH analytics_data AS (
    SELECT 
      (SELECT COUNT(*) FROM public.user_analytics WHERE created_at > now() - interval '24 hours') as active_users_24h,
      (SELECT COUNT(*) FROM public.search_analytics WHERE created_at > now() - interval '24 hours') as searches_24h,
      (SELECT AVG(time_spent_minutes) FROM public.user_analytics WHERE created_at > now() - interval '7 days') as avg_session_time,
      (SELECT COUNT(*) FROM public.coins WHERE created_at > now() - interval '24 hours') as new_listings_24h,
      (SELECT SUM(amount) FROM public.transactions WHERE created_at > now() - interval '24 hours') as revenue_24h,
      (SELECT COUNT(*) FROM public.system_alerts WHERE is_resolved = false) as active_alerts,
      (SELECT AVG(quality_score) FROM public.data_quality_reports WHERE report_date > now() - interval '7 days') as avg_data_quality
  )
  SELECT jsonb_build_object(
    'active_users_24h', active_users_24h,
    'searches_24h', searches_24h,
    'avg_session_time', COALESCE(avg_session_time, 0),
    'new_listings_24h', new_listings_24h,
    'revenue_24h', COALESCE(revenue_24h, 0),
    'active_alerts', active_alerts,
    'avg_data_quality', COALESCE(avg_data_quality, 0),
    'last_updated', now()
  ) INTO result
  FROM analytics_data;
  
  RETURN result;
END;
$$;

-- Performance monitoring function
CREATE OR REPLACE FUNCTION public.get_system_performance_metrics()
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = 'public'
AS $$
DECLARE
  result JSONB;
BEGIN
  WITH performance_data AS (
    SELECT 
      (SELECT AVG(load_time_ms) FROM public.performance_metrics WHERE created_at > now() - interval '1 hour') as avg_response_time,
      (SELECT COUNT(*) FROM public.error_logs WHERE created_at > now() - interval '1 hour') as errors_last_hour,
      (SELECT COUNT(*) FROM public.profiles WHERE updated_at > now() - interval '15 minutes') as active_sessions,
      (SELECT COUNT(*) FROM public.system_alerts WHERE severity = 'critical' AND is_resolved = false) as critical_alerts
  )
  SELECT jsonb_build_object(
    'avg_response_time', COALESCE(avg_response_time, 0),
    'errors_last_hour', errors_last_hour,
    'active_sessions', active_sessions,
    'critical_alerts', critical_alerts,
    'system_health', CASE 
      WHEN critical_alerts > 0 THEN 'critical'
      WHEN errors_last_hour > 10 THEN 'warning'
      ELSE 'healthy'
    END,
    'last_updated', now()
  ) INTO result
  FROM performance_data;
  
  RETURN result;
END;
$$;

-- Bulk operations function
CREATE OR REPLACE FUNCTION public.execute_bulk_operation(
  operation_type TEXT,
  operation_name TEXT,
  target_table TEXT,
  operation_parameters JSONB
)
RETURNS UUID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = 'public'
AS $$
DECLARE
  operation_id UUID;
BEGIN
  INSERT INTO public.bulk_operations (
    operation_type,
    operation_name,
    target_table,
    operation_parameters,
    started_by,
    status
  ) VALUES (
    operation_type,
    operation_name,
    target_table,
    operation_parameters,
    auth.uid(),
    'pending'
  ) RETURNING id INTO operation_id;
  
  -- Log the operation start
  INSERT INTO public.admin_activity_logs (
    admin_user_id,
    action,
    target_type,
    target_id,
    details
  ) VALUES (
    auth.uid(),
    'bulk_operation_started',
    'bulk_operations',
    operation_id,
    jsonb_build_object('operation_type', operation_type, 'target_table', target_table)
  );
  
  RETURN operation_id;
END;
$$;

-- Security incident management function
CREATE OR REPLACE FUNCTION public.create_security_incident(
  incident_type TEXT,
  severity_level TEXT,
  title TEXT,
  description TEXT DEFAULT NULL,
  incident_data JSONB DEFAULT '{}'::jsonb
)
RETURNS UUID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = 'public'
AS $$
DECLARE
  incident_id UUID;
BEGIN
  INSERT INTO public.security_incidents (
    incident_type,
    severity_level,
    title,
    description,
    incident_data,
    assigned_to
  ) VALUES (
    incident_type,
    severity_level,
    title,
    description,
    incident_data,
    auth.uid()
  ) RETURNING id INTO incident_id;
  
  -- Create alert for high severity incidents
  IF severity_level IN ('high', 'critical') THEN
    INSERT INTO public.system_alerts (
      alert_type,
      severity,
      title,
      description,
      alert_data
    ) VALUES (
      'security_incident',
      severity_level,
      'Security Incident: ' || title,
      description,
      jsonb_build_object('incident_id', incident_id)
    );
  END IF;
  
  RETURN incident_id;
END;
$$;
