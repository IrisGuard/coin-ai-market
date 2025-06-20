
-- Create the production cleanup function
CREATE OR REPLACE FUNCTION public.execute_production_cleanup()
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $function$
DECLARE
  result jsonb;
  cleanup_count integer := 0;
BEGIN
  -- Verify admin access
  IF NOT public.verify_admin_access_secure() THEN
    RAISE EXCEPTION 'Access denied: Admin privileges required for production cleanup';
  END IF;

  -- Clean mock/demo data from analytics_events
  DELETE FROM public.analytics_events 
  WHERE event_type ILIKE '%mock%' 
     OR event_type ILIKE '%demo%' 
     OR event_type ILIKE '%test%'
     OR event_type ILIKE '%placeholder%';
  
  GET DIAGNOSTICS cleanup_count = ROW_COUNT;
  
  -- Clean mock/demo data from admin_activity_logs
  DELETE FROM public.admin_activity_logs 
  WHERE action ILIKE '%mock%' 
     OR action ILIKE '%demo%' 
     OR action ILIKE '%test%'
     OR action ILIKE '%placeholder%';
  
  -- Log the production cleanup completion
  INSERT INTO public.analytics_events (
    event_type,
    page_url,
    metadata,
    timestamp
  ) VALUES (
    'production_cleanup_completed',
    '/admin/cleanup',
    jsonb_build_object(
      'cleanup_type', 'full_production_migration',
      'records_cleaned', cleanup_count,
      'production_ready', true,
      'cleaned_at', now()
    ),
    now()
  );
  
  -- Build result
  result := jsonb_build_object(
    'status', 'success',
    'message', 'Production cleanup completed successfully',
    'records_cleaned', cleanup_count,
    'production_ready', true,
    'completed_at', now()
  );
  
  RETURN result;
END;
$function$;
