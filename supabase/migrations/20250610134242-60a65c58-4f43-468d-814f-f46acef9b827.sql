
-- Create missing tables for complete admin functionality

-- Admin activity logs table (already exists, but let's ensure proper structure)
CREATE TABLE IF NOT EXISTS public.admin_activity_logs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  admin_user_id uuid NOT NULL,
  action text NOT NULL,
  target_type text NOT NULL,
  target_id uuid,
  details jsonb DEFAULT '{}',
  ip_address text,
  user_agent text,
  created_at timestamp with time zone DEFAULT now()
);

-- System metrics table for real-time monitoring
CREATE TABLE IF NOT EXISTS public.system_metrics (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  metric_name text NOT NULL,
  metric_value numeric NOT NULL,
  metric_type text NOT NULL DEFAULT 'gauge',
  tags jsonb DEFAULT '{}',
  recorded_at timestamp with time zone DEFAULT now()
);

-- AI commands execution log
CREATE TABLE IF NOT EXISTS public.ai_command_executions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  command_id uuid REFERENCES public.ai_commands(id),
  user_id uuid,
  execution_status text DEFAULT 'pending',
  input_data jsonb DEFAULT '{}',
  output_data jsonb DEFAULT '{}',
  execution_time_ms integer DEFAULT 0,
  error_message text,
  created_at timestamp with time zone DEFAULT now()
);

-- User activity tracking for dashboard analytics
CREATE TABLE IF NOT EXISTS public.user_activity (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid,
  activity_type text NOT NULL,
  page_url text,
  session_id text,
  ip_address text,
  user_agent text,
  metadata jsonb DEFAULT '{}',
  created_at timestamp with time zone DEFAULT now()
);

-- Performance monitoring table
CREATE TABLE IF NOT EXISTS public.performance_metrics (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  page_url text NOT NULL,
  load_time_ms integer NOT NULL,
  user_id uuid,
  browser_info jsonb DEFAULT '{}',
  created_at timestamp with time zone DEFAULT now()
);

-- Enable RLS on all admin tables
ALTER TABLE public.admin_activity_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.system_metrics ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ai_command_executions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_activity ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.performance_metrics ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for admin access
CREATE POLICY "Admins can view admin activity logs" ON public.admin_activity_logs
FOR SELECT USING (public.is_admin_user(auth.uid()));

CREATE POLICY "Admins can insert admin activity logs" ON public.admin_activity_logs
FOR INSERT WITH CHECK (public.is_admin_user(auth.uid()));

CREATE POLICY "Admins can view system metrics" ON public.system_metrics
FOR ALL USING (public.is_admin_user(auth.uid()));

CREATE POLICY "Admins can manage AI command executions" ON public.ai_command_executions
FOR ALL USING (public.is_admin_user(auth.uid()));

CREATE POLICY "Users can view their own activity" ON public.user_activity
FOR SELECT USING (auth.uid() = user_id OR public.is_admin_user(auth.uid()));

CREATE POLICY "System can insert user activity" ON public.user_activity
FOR INSERT WITH CHECK (true);

CREATE POLICY "Admins can view performance metrics" ON public.performance_metrics
FOR ALL USING (public.is_admin_user(auth.uid()));

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_admin_activity_logs_created_at ON public.admin_activity_logs(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_system_metrics_recorded_at ON public.system_metrics(recorded_at DESC);
CREATE INDEX IF NOT EXISTS idx_user_activity_created_at ON public.user_activity(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_performance_metrics_created_at ON public.performance_metrics(created_at DESC);

-- Create function to log admin activities
CREATE OR REPLACE FUNCTION public.log_admin_activity(
  p_action text,
  p_target_type text,
  p_target_id uuid DEFAULT NULL,
  p_details jsonb DEFAULT '{}'
) RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
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
$$;

-- Create function to record system metrics
CREATE OR REPLACE FUNCTION public.record_system_metric(
  p_metric_name text,
  p_metric_value numeric,
  p_metric_type text DEFAULT 'gauge',
  p_tags jsonb DEFAULT '{}'
) RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
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
$$;

-- Function to get real-time dashboard stats
CREATE OR REPLACE FUNCTION public.get_dashboard_stats()
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  result jsonb;
BEGIN
  WITH stats AS (
    SELECT 
      (SELECT COUNT(*) FROM public.profiles) as total_users,
      (SELECT COUNT(*) FROM public.coins) as total_coins,
      (SELECT COUNT(*) FROM public.transactions) as total_transactions,
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
$$;
