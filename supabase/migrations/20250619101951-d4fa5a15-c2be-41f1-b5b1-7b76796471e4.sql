
-- Create store_activity_logs table for comprehensive store activity tracking
CREATE TABLE public.store_activity_logs (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  store_id UUID REFERENCES public.stores(id) ON DELETE CASCADE NOT NULL,
  activity_type TEXT NOT NULL,
  activity_description TEXT NOT NULL,
  activity_data JSONB DEFAULT '{}'::jsonb,
  performed_by UUID REFERENCES public.profiles(id),
  ip_address TEXT,
  user_agent TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  severity_level TEXT DEFAULT 'info' CHECK (severity_level IN ('info', 'warning', 'error', 'critical')),
  source_component TEXT DEFAULT 'unknown',
  related_entity_type TEXT,
  related_entity_id UUID
);

-- Add indexes for performance
CREATE INDEX idx_store_activity_logs_store_id ON public.store_activity_logs(store_id);
CREATE INDEX idx_store_activity_logs_activity_type ON public.store_activity_logs(activity_type);
CREATE INDEX idx_store_activity_logs_created_at ON public.store_activity_logs(created_at DESC);
CREATE INDEX idx_store_activity_logs_performed_by ON public.store_activity_logs(performed_by);
CREATE INDEX idx_store_activity_logs_severity_level ON public.store_activity_logs(severity_level);

-- Enable Row Level Security
ALTER TABLE public.store_activity_logs ENABLE ROW LEVEL SECURITY;

-- Policy for store owners to view their store activity logs
CREATE POLICY "Store owners can view their store activity logs" 
  ON public.store_activity_logs 
  FOR SELECT 
  USING (
    EXISTS (
      SELECT 1 FROM public.stores 
      WHERE stores.id = store_activity_logs.store_id 
      AND stores.user_id = auth.uid()
    )
  );

-- Policy for admins to view all store activity logs
CREATE POLICY "Admins can view all store activity logs" 
  ON public.store_activity_logs 
  FOR SELECT 
  USING (
    EXISTS (
      SELECT 1 FROM public.user_roles 
      WHERE user_id = auth.uid() AND role = 'admin'
    )
  );

-- Policy for store owners to insert activity logs for their stores
CREATE POLICY "Store owners can create activity logs for their stores" 
  ON public.store_activity_logs 
  FOR INSERT 
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.stores 
      WHERE stores.id = store_activity_logs.store_id 
      AND stores.user_id = auth.uid()
    )
  );

-- Policy for admins to insert activity logs for any store
CREATE POLICY "Admins can create activity logs for any store" 
  ON public.store_activity_logs 
  FOR INSERT 
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.user_roles 
      WHERE user_id = auth.uid() AND role = 'admin'
    )
  );

-- Function to automatically log store activities
CREATE OR REPLACE FUNCTION public.log_store_activity(
  p_store_id UUID,
  p_activity_type TEXT,
  p_activity_description TEXT,
  p_activity_data JSONB DEFAULT '{}'::jsonb,
  p_severity_level TEXT DEFAULT 'info',
  p_source_component TEXT DEFAULT 'system',
  p_related_entity_type TEXT DEFAULT NULL,
  p_related_entity_id UUID DEFAULT NULL
) RETURNS UUID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $function$
DECLARE
  activity_id UUID;
BEGIN
  INSERT INTO public.store_activity_logs (
    store_id,
    activity_type,
    activity_description,
    activity_data,
    performed_by,
    severity_level,
    source_component,
    related_entity_type,
    related_entity_id
  ) VALUES (
    p_store_id,
    p_activity_type,
    p_activity_description,
    p_activity_data,
    auth.uid(),
    p_severity_level,
    p_source_component,
    p_related_entity_type,
    p_related_entity_id
  ) RETURNING id INTO activity_id;
  
  RETURN activity_id;
END;
$function$;

-- Function to get store activity statistics
CREATE OR REPLACE FUNCTION public.get_store_activity_stats(p_store_id UUID, p_days INTEGER DEFAULT 30)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $function$
DECLARE
  result JSONB;
BEGIN
  -- Verify user has access to this store
  IF NOT EXISTS (
    SELECT 1 FROM public.stores 
    WHERE id = p_store_id 
    AND (
      user_id = auth.uid() 
      OR EXISTS (
        SELECT 1 FROM public.user_roles 
        WHERE user_id = auth.uid() AND role = 'admin'
      )
    )
  ) THEN
    RAISE EXCEPTION 'Access denied: You do not have permission to view this store activity';
  END IF;

  WITH activity_stats AS (
    SELECT 
      COUNT(*) as total_activities,
      COUNT(CASE WHEN severity_level = 'critical' THEN 1 END) as critical_count,
      COUNT(CASE WHEN severity_level = 'error' THEN 1 END) as error_count,
      COUNT(CASE WHEN severity_level = 'warning' THEN 1 END) as warning_count,
      COUNT(CASE WHEN severity_level = 'info' THEN 1 END) as info_count,
      COUNT(DISTINCT activity_type) as unique_activity_types,
      COUNT(DISTINCT performed_by) as unique_users,
      MIN(created_at) as first_activity,
      MAX(created_at) as last_activity
    FROM public.store_activity_logs
    WHERE store_id = p_store_id
    AND created_at >= now() - (p_days || ' days')::interval
  ),
  top_activities AS (
    SELECT 
      activity_type,
      COUNT(*) as activity_count
    FROM public.store_activity_logs
    WHERE store_id = p_store_id
    AND created_at >= now() - (p_days || ' days')::interval
    GROUP BY activity_type
    ORDER BY activity_count DESC
    LIMIT 5
  )
  SELECT jsonb_build_object(
    'total_activities', total_activities,
    'severity_breakdown', jsonb_build_object(
      'critical', critical_count,
      'error', error_count,
      'warning', warning_count,
      'info', info_count
    ),
    'unique_activity_types', unique_activity_types,
    'unique_users', unique_users,
    'first_activity', first_activity,
    'last_activity', last_activity,
    'top_activities', (
      SELECT jsonb_agg(
        jsonb_build_object(
          'activity_type', activity_type,
          'count', activity_count
        )
      ) FROM top_activities
    ),
    'period_days', p_days,
    'generated_at', now()
  ) INTO result
  FROM activity_stats;
  
  RETURN result;
END;
$function$;
