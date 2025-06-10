
-- Fix function search path security warnings
CREATE OR REPLACE FUNCTION public.log_admin_activity(p_action text, p_target_type text, p_target_id uuid DEFAULT NULL::uuid, p_details jsonb DEFAULT '{}'::jsonb)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $function$
BEGIN
  INSERT INTO public.admin_activity_logs (
    admin_user_id,
    action,
    target_type,
    target_id,
    details
  ) VALUES (
    auth.uid(),
    p_action,
    p_target_type,
    p_target_id,
    p_details
  );
END;
$function$;

CREATE OR REPLACE FUNCTION public.record_system_metric(p_metric_name text, p_metric_value numeric, p_metric_type text DEFAULT 'gauge'::text, p_tags jsonb DEFAULT '{}'::jsonb)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $function$
BEGIN
  INSERT INTO public.system_metrics (
    metric_name,
    metric_value,
    metric_type,
    tags
  ) VALUES (
    p_metric_name,
    p_metric_value,
    p_metric_type,
    p_tags
  );
END;
$function$;

CREATE OR REPLACE FUNCTION public.get_dashboard_stats()
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $function$
DECLARE
  result jsonb;
BEGIN
  WITH stats AS (
    SELECT 
      (SELECT COUNT(*) FROM public.profiles) as total_users,
      (SELECT COUNT(*) FROM public.coins) as total_coins,
      (SELECT COUNT(*) FROM public.payment_transactions) as total_transactions,
      (SELECT COUNT(*) FROM public.error_logs WHERE created_at > now() - interval '24 hours') as errors_24h,
      (SELECT COUNT(*) FROM public.profiles WHERE updated_at > now() - interval '15 minutes') as active_users,
      (SELECT COUNT(*) FROM public.coins WHERE is_auction = true AND auction_end > now()) as live_auctions,
      (SELECT COUNT(*) FROM public.coins WHERE featured = true) as featured_coins,
      (SELECT COALESCE(SUM(price), 0) FROM public.coins) as total_value
  )
  SELECT jsonb_build_object(
    'total_users', total_users,
    'total_coins', total_coins,
    'total_transactions', total_transactions,
    'errors_24h', errors_24h,
    'active_users', active_users,
    'live_auctions', live_auctions,
    'featured_coins', featured_coins,
    'total_value', total_value,
    'last_updated', now()
  ) INTO result
  FROM stats;
  
  RETURN result;
END;
$function$;

-- Create system alerts table if not exists
CREATE TABLE IF NOT EXISTS public.system_alerts (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  alert_type text NOT NULL,
  severity text NOT NULL DEFAULT 'info',
  title text NOT NULL,
  description text,
  alert_data jsonb DEFAULT '{}',
  is_resolved boolean DEFAULT false,
  resolved_at timestamp with time zone,
  resolved_by uuid,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now()
);

-- Create system metrics table if not exists
CREATE TABLE IF NOT EXISTS public.system_metrics (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  metric_name text NOT NULL,
  metric_value numeric NOT NULL,
  metric_type text DEFAULT 'gauge',
  tags jsonb DEFAULT '{}',
  recorded_at timestamp with time zone DEFAULT now()
);

-- Add RLS policies for new tables
ALTER TABLE public.system_alerts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.system_metrics ENABLE ROW LEVEL SECURITY;

-- Policies for system_alerts (admin only)
CREATE POLICY "Admin can view system alerts" ON public.system_alerts
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.user_roles 
      WHERE user_id = auth.uid() AND role = 'admin'
    )
  );

CREATE POLICY "Admin can insert system alerts" ON public.system_alerts
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.user_roles 
      WHERE user_id = auth.uid() AND role = 'admin'
    )
  );

CREATE POLICY "Admin can update system alerts" ON public.system_alerts
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM public.user_roles 
      WHERE user_id = auth.uid() AND role = 'admin'
    )
  );

-- Policies for system_metrics (admin only)
CREATE POLICY "Admin can view system metrics" ON public.system_metrics
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.user_roles 
      WHERE user_id = auth.uid() AND role = 'admin'
    )
  );

CREATE POLICY "Admin can insert system metrics" ON public.system_metrics
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.user_roles 
      WHERE user_id = auth.uid() AND role = 'admin'
    )
  );

-- Fix missing RLS policies for existing tables
CREATE POLICY "Admin can view all profiles" ON public.profiles
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.user_roles 
      WHERE user_id = auth.uid() AND role = 'admin'
    )
  );

CREATE POLICY "Admin can update profiles" ON public.profiles
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM public.user_roles 
      WHERE user_id = auth.uid() AND role = 'admin'
    )
  );

CREATE POLICY "Admin can view all coins" ON public.coins
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.user_roles 
      WHERE user_id = auth.uid() AND role = 'admin'
    )
  );

CREATE POLICY "Admin can update coins" ON public.coins
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM public.user_roles 
      WHERE user_id = auth.uid() AND role = 'admin'
    )
  );

-- Create comprehensive admin dashboard function
CREATE OR REPLACE FUNCTION public.get_admin_dashboard_comprehensive()
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $function$
DECLARE
  result jsonb;
BEGIN
  -- Check if user is admin
  IF NOT EXISTS (
    SELECT 1 FROM public.user_roles 
    WHERE user_id = auth.uid() AND role = 'admin'
  ) THEN
    RAISE EXCEPTION 'Access denied: Admin privileges required';
  END IF;

  WITH comprehensive_stats AS (
    SELECT 
      -- User stats
      (SELECT COUNT(*) FROM public.profiles) as total_users,
      (SELECT COUNT(*) FROM public.profiles WHERE role = 'dealer') as total_dealers,
      (SELECT COUNT(*) FROM public.profiles WHERE verified_dealer = true) as verified_dealers,
      (SELECT COUNT(*) FROM public.user_roles WHERE role = 'admin') as admin_users,
      
      -- Coin stats
      (SELECT COUNT(*) FROM public.coins) as total_coins,
      (SELECT COUNT(*) FROM public.coins WHERE featured = true) as featured_coins,
      (SELECT COUNT(*) FROM public.coins WHERE is_auction = true AND auction_end > now()) as live_auctions,
      (SELECT COUNT(*) FROM public.coins WHERE sold = true) as sold_coins,
      
      -- Transaction stats
      (SELECT COUNT(*) FROM public.payment_transactions) as total_transactions,
      (SELECT COUNT(*) FROM public.payment_transactions WHERE status = 'completed') as completed_transactions,
      (SELECT COALESCE(SUM(amount), 0) FROM public.payment_transactions WHERE status = 'completed') as total_revenue,
      
      -- System health
      (SELECT COUNT(*) FROM public.error_logs WHERE created_at > now() - interval '24 hours') as errors_24h,
      (SELECT COUNT(*) FROM public.system_alerts WHERE is_resolved = false) as active_alerts,
      (SELECT COUNT(*) FROM public.profiles WHERE updated_at > now() - interval '15 minutes') as active_users_15min,
      
      -- AI & Automation stats
      (SELECT COUNT(*) FROM public.ai_commands WHERE is_active = true) as active_ai_commands,
      (SELECT COUNT(*) FROM public.automation_rules WHERE is_active = true) as active_automation_rules,
      (SELECT COUNT(*) FROM public.prediction_models WHERE is_active = true) as active_prediction_models,
      
      -- Data sources and API keys
      (SELECT COUNT(*) FROM public.data_sources WHERE is_active = true) as active_data_sources,
      (SELECT COUNT(*) FROM public.api_keys WHERE is_active = true) as active_api_keys
  )
  SELECT jsonb_build_object(
    'users', jsonb_build_object(
      'total', total_users,
      'dealers', total_dealers,
      'verified_dealers', verified_dealers,
      'admins', admin_users,
      'active_15min', active_users_15min
    ),
    'coins', jsonb_build_object(
      'total', total_coins,
      'featured', featured_coins,
      'live_auctions', live_auctions,
      'sold', sold_coins
    ),
    'transactions', jsonb_build_object(
      'total', total_transactions,
      'completed', completed_transactions,
      'revenue', total_revenue
    ),
    'system', jsonb_build_object(
      'errors_24h', errors_24h,
      'active_alerts', active_alerts,
      'health_status', CASE 
        WHEN errors_24h > 10 THEN 'critical'
        WHEN errors_24h > 5 THEN 'warning'
        ELSE 'healthy'
      END
    ),
    'ai_automation', jsonb_build_object(
      'commands', active_ai_commands,
      'rules', active_automation_rules,
      'models', active_prediction_models
    ),
    'integrations', jsonb_build_object(
      'data_sources', active_data_sources,
      'api_keys', active_api_keys
    ),
    'last_updated', now()
  ) INTO result
  FROM comprehensive_stats;
  
  RETURN result;
END;
$function$;
