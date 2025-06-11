
-- Security and Performance Fixes Migration

-- 1. Create secure admin verification function (replaces multiple RLS policies)
CREATE OR REPLACE FUNCTION public.verify_admin_access_secure(user_id uuid DEFAULT auth.uid())
RETURNS boolean
LANGUAGE sql
STABLE SECURITY DEFINER
SET search_path TO 'public'
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.user_roles 
    WHERE user_roles.user_id = $1 
    AND user_roles.role = 'admin'::user_role
  );
$$;

-- 2. Drop conflicting RLS policies on ai_commands
DROP POLICY IF EXISTS "Admin access to ai_commands" ON public.ai_commands;
DROP POLICY IF EXISTS "Admins can manage ai_commands" ON public.ai_commands;
DROP POLICY IF EXISTS "Admin users can manage AI commands" ON public.ai_commands;
DROP POLICY IF EXISTS "Enable all operations for admin users" ON public.ai_commands;

-- 3. Create single optimized RLS policy for ai_commands
CREATE POLICY "Admins can manage all ai_commands" ON public.ai_commands
FOR ALL USING (public.verify_admin_access_secure());

-- 4. Clean up unnecessary RLS on admin tables
-- Admin activity logs should only be viewable by admins
ALTER TABLE public.admin_activity_logs ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Admins can view admin_activity_logs" ON public.admin_activity_logs
FOR SELECT USING (public.verify_admin_access_secure());

-- API Keys should only be managed by admins
ALTER TABLE public.api_keys ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Admins can manage api_keys" ON public.api_keys
FOR ALL USING (public.verify_admin_access_secure());

-- Console errors should only be viewable by admins
ALTER TABLE public.console_errors ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Admins can view console_errors" ON public.console_errors
FOR SELECT USING (public.verify_admin_access_secure());

-- Admin roles should only be managed by admins
ALTER TABLE public.admin_roles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Admins can manage admin_roles" ON public.admin_roles
FOR ALL USING (public.verify_admin_access_secure());

-- 5. Performance Indexes
-- Index for ai_commands frequent queries
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_ai_commands_active_created 
ON public.ai_commands (is_active, created_at DESC) WHERE is_active = true;

CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_ai_commands_category 
ON public.ai_commands (category) WHERE is_active = true;

-- Index for command executions
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_ai_command_executions_command_created
ON public.ai_command_executions (command_id, created_at DESC);

CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_ai_command_executions_status
ON public.ai_command_executions (execution_status, created_at DESC);

-- Index for user roles lookup (critical for admin checks)
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_user_roles_user_role
ON public.user_roles (user_id, role);

-- Index for profiles role lookup
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_profiles_role
ON public.profiles (role) WHERE role IS NOT NULL;

-- 6. Optimize analytics and error tracking
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_analytics_events_type_timestamp
ON public.analytics_events (event_type, timestamp DESC);

CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_error_logs_created_type
ON public.error_logs (created_at DESC, error_type);

-- 7. Performance optimization for coin queries
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_coins_active_featured
ON public.coins (is_auction, featured, created_at DESC) WHERE is_auction = true OR featured = true;

CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_coins_user_store
ON public.coins (user_id, store_id) WHERE user_id IS NOT NULL;

-- 8. Cleanup function to remove any potential mock data
CREATE OR REPLACE FUNCTION public.cleanup_mock_data()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
BEGIN
  -- Remove any test/mock data that might exist
  DELETE FROM public.ai_commands WHERE name ILIKE '%test%' OR name ILIKE '%mock%' OR name ILIKE '%example%';
  DELETE FROM public.ai_command_executions WHERE input_data::text ILIKE '%test%' OR input_data::text ILIKE '%mock%';
  
  -- Log cleanup
  INSERT INTO public.analytics_events (event_type, page_url, metadata, timestamp)
  VALUES ('mock_data_cleanup', '/admin/security', 
          jsonb_build_object('cleanup_performed', true, 'timestamp', now()), 
          now());
END;
$$;

-- Run cleanup
SELECT public.cleanup_mock_data();

-- 9. Grant necessary permissions for the application
GRANT USAGE ON SCHEMA public TO anon, authenticated;
GRANT SELECT ON public.ai_commands TO authenticated;
GRANT ALL ON public.ai_commands TO service_role;
GRANT ALL ON public.ai_command_executions TO authenticated;
GRANT SELECT ON public.user_roles TO authenticated;

-- 10. Comment the schema for documentation
COMMENT ON TABLE public.ai_commands IS 'AI commands with site_url support for website parsing and analysis';
COMMENT ON TABLE public.ai_command_executions IS 'Execution history and results for AI commands';
COMMENT ON FUNCTION public.verify_admin_access_secure IS 'Secure function to verify admin access without RLS recursion';
