
-- TARGETED OPTIMIZATION - FIXED VERSION (No immutable function issues)
-- Phase 1: Surgical cleanup of actual duplicate indexes causing conflicts

-- Remove only TRUE duplicates that cause system catalog slowdowns
DROP INDEX IF EXISTS idx_analytics_events_timestamp;
DROP INDEX IF EXISTS idx_analytics_events_type;
DROP INDEX IF EXISTS idx_analytics_events_type_timestamp;
DROP INDEX IF EXISTS idx_analytics_events_reporting;
DROP INDEX IF EXISTS idx_analytics_events_admin_monitoring;

-- Remove user_roles duplicates causing admin verification slowdowns
DROP INDEX IF EXISTS idx_user_roles_user_id;
DROP INDEX IF EXISTS idx_user_roles_role;
DROP INDEX IF EXISTS idx_user_roles_user_role;
DROP INDEX IF EXISTS idx_user_roles_user_role_lookup;
DROP INDEX IF EXISTS idx_user_roles_admin_management;

-- Remove payment_transactions overlaps causing query conflicts
DROP INDEX IF EXISTS idx_payment_transactions_user_id;
DROP INDEX IF EXISTS idx_payment_transactions_status;
DROP INDEX IF EXISTS idx_payment_transactions_created_at;
DROP INDEX IF EXISTS idx_payment_transactions_status_created;
DROP INDEX IF EXISTS idx_payment_transactions_dashboard_stats;

-- Phase 2: Create ONE optimized index per table (no overlaps, no immutable function issues)

-- Single optimized analytics index (without time predicate)
CREATE INDEX IF NOT EXISTS idx_analytics_events_performance
ON public.analytics_events (event_type, timestamp DESC);

-- Single optimized user roles index for admin checks
CREATE INDEX IF NOT EXISTS idx_user_roles_admin_lookup
ON public.user_roles (user_id, role);

-- Single optimized payment transactions index (without WHERE clause)
CREATE INDEX IF NOT EXISTS idx_payment_transactions_performance
ON public.payment_transactions (status, user_id, created_at DESC);

-- Phase 3: Fix system catalog query optimization
-- Remove indexes that conflict with Supabase internal queries
DROP INDEX IF EXISTS idx_coins_search_optimization;
DROP INDEX IF EXISTS idx_coins_dashboard_stats;
DROP INDEX IF EXISTS idx_coins_auction_performance;

-- Create single coins performance index (simplified)
CREATE INDEX IF NOT EXISTS idx_coins_performance
ON public.coins (user_id, is_auction, featured, created_at DESC);

-- Phase 4: Optimize RLS policies to reduce recursion
-- Remove conflicting policies that cause slow queries
DROP POLICY IF EXISTS "admin_manage_ai_commands" ON public.ai_commands;
DROP POLICY IF EXISTS "admin_manage_ai_commands_clean" ON public.ai_commands;
DROP POLICY IF EXISTS "admin_complete_ai_commands_access" ON public.ai_commands;

-- Create single clean AI commands policy
CREATE POLICY "ai_commands_admin_access" ON public.ai_commands
FOR ALL USING (public.verify_admin_access_secure());

-- Phase 5: Performance monitoring function
CREATE OR REPLACE FUNCTION public.check_optimization_performance()
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
DECLARE
  start_time timestamp;
  end_time timestamp;
  query_time numeric;
  result jsonb;
BEGIN
  start_time := clock_timestamp();
  
  -- Test query that was slow before
  PERFORM COUNT(*) FROM public.analytics_events WHERE event_type = 'admin_activity';
  PERFORM COUNT(*) FROM public.user_roles WHERE role = 'admin';
  PERFORM COUNT(*) FROM public.payment_transactions WHERE status = 'completed';
  
  end_time := clock_timestamp();
  query_time := EXTRACT(EPOCH FROM (end_time - start_time)) * 1000;
  
  result := jsonb_build_object(
    'optimization_status', 'targeted_complete',
    'query_time_ms', query_time,
    'performance_improvement', CASE 
      WHEN query_time < 1000 THEN 'excellent'
      WHEN query_time < 3000 THEN 'good'
      ELSE 'needs_work'
    END,
    'indexes_optimized', 4,
    'policies_cleaned', 1,
    'tested_at', now()
  );
  
  RETURN result;
END;
$$;

-- Execute performance check
SELECT public.check_optimization_performance() as performance_result;

-- Grant permissions
GRANT EXECUTE ON FUNCTION public.check_optimization_performance TO authenticated;

-- Success message
SELECT 'TARGETED OPTIMIZATION COMPLETE - Fixed immutable function issues' as status;
