
-- COMPREHENSIVE ADMIN PANEL POLICY CLEANUP & OPTIMIZATION
-- Phase 1: Remove ALL duplicate and conflicting policies

-- AI Commands & Executions - Remove ALL existing policies
DROP POLICY IF EXISTS "Admins can view all ai_commands" ON public.ai_commands;
DROP POLICY IF EXISTS "Admins can insert ai_commands" ON public.ai_commands;
DROP POLICY IF EXISTS "Admins can update ai_commands" ON public.ai_commands;
DROP POLICY IF EXISTS "Admins can delete ai_commands" ON public.ai_commands;
DROP POLICY IF EXISTS "Admin access to ai_commands" ON public.ai_commands;
DROP POLICY IF EXISTS "Admins can manage ai_commands" ON public.ai_commands;
DROP POLICY IF EXISTS "Admin users can manage AI commands" ON public.ai_commands;
DROP POLICY IF EXISTS "Enable all operations for admin users" ON public.ai_commands;
DROP POLICY IF EXISTS "Admins can manage all ai_commands" ON public.ai_commands;
DROP POLICY IF EXISTS "Admin full access to ai_commands" ON public.ai_commands;

DROP POLICY IF EXISTS "Users can view their own executions" ON public.ai_command_executions;
DROP POLICY IF EXISTS "Users can create their own executions" ON public.ai_command_executions;
DROP POLICY IF EXISTS "Admins can view all ai_command_executions" ON public.ai_command_executions;
DROP POLICY IF EXISTS "Admins can insert ai_command_executions" ON public.ai_command_executions;
DROP POLICY IF EXISTS "Admin full access to ai_command_executions" ON public.ai_command_executions;

-- Remove old admin_roles references and conflicting policies
DROP POLICY IF EXISTS "Admins can view admin_activity_logs" ON public.admin_activity_logs;
DROP POLICY IF EXISTS "Admins can manage api_keys" ON public.api_keys;
DROP POLICY IF EXISTS "Admins can view console_errors" ON public.console_errors;
DROP POLICY IF EXISTS "Admins can manage admin_roles" ON public.admin_roles;

-- Phase 2: Create CLEAN admin policies (one per table)
-- AI Commands - Single clean admin policy
CREATE POLICY "admin_manage_ai_commands" ON public.ai_commands
FOR ALL USING (public.verify_admin_access_secure());

-- AI Command Executions - Single clean admin policy  
CREATE POLICY "admin_manage_ai_executions" ON public.ai_command_executions
FOR ALL USING (public.verify_admin_access_secure());

-- Admin Activity Logs - Admin read access
CREATE POLICY "admin_view_activity_logs" ON public.admin_activity_logs
FOR SELECT USING (public.verify_admin_access_secure());

-- API Keys - Admin management
CREATE POLICY "admin_manage_api_keys" ON public.api_keys
FOR ALL USING (public.verify_admin_access_secure());

-- Console Errors - Admin read access
CREATE POLICY "admin_view_console_errors" ON public.console_errors
FOR SELECT USING (public.verify_admin_access_secure());

-- Admin Roles - Admin management
CREATE POLICY "admin_manage_admin_roles" ON public.admin_roles
FOR ALL USING (public.verify_admin_access_secure());

-- Data Sources - Admin management
CREATE POLICY "admin_manage_data_sources" ON public.data_sources
FOR ALL USING (public.verify_admin_access_secure());

-- External Price Sources - Admin management  
CREATE POLICY "admin_manage_external_sources" ON public.external_price_sources
FOR ALL USING (public.verify_admin_access_secure());

-- Scraping Jobs - Admin management
CREATE POLICY "admin_manage_scraping_jobs" ON public.scraping_jobs
FOR ALL USING (public.verify_admin_access_secure());

-- Stores - Admin management (keep existing user policies intact)
CREATE POLICY "admin_manage_stores" ON public.stores
FOR ALL USING (public.verify_admin_access_secure());

-- Phase 3: Performance indexes
CREATE INDEX IF NOT EXISTS idx_ai_commands_created_at ON public.ai_commands (created_at DESC);
CREATE INDEX IF NOT EXISTS idx_ai_commands_is_active ON public.ai_commands (is_active) WHERE is_active = true;
CREATE INDEX IF NOT EXISTS idx_ai_command_executions_command_id_created ON public.ai_command_executions (command_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_ai_command_executions_status ON public.ai_command_executions (execution_status);
CREATE INDEX IF NOT EXISTS idx_user_roles_user_role ON public.user_roles (user_id, role);
CREATE INDEX IF NOT EXISTS idx_data_sources_active ON public.data_sources (is_active) WHERE is_active = true;
CREATE INDEX IF NOT EXISTS idx_external_sources_active ON public.external_price_sources (is_active) WHERE is_active = true;

-- Phase 4: Cleanup and structure
-- Remove test/mock data
DELETE FROM public.ai_commands WHERE name ILIKE '%mock%' OR name ILIKE '%test%' OR name ILIKE '%example%';
DELETE FROM public.ai_command_executions WHERE input_data::text ILIKE '%mock%' OR input_data::text ILIKE '%test%';

-- Ensure proper table structure
ALTER TABLE public.ai_command_executions ADD COLUMN IF NOT EXISTS completed_at TIMESTAMP WITH TIME ZONE;

-- Documentation
COMMENT ON TABLE public.ai_commands IS 'AI commands with site_url support - admin managed via RLS';
COMMENT ON TABLE public.ai_command_executions IS 'AI command execution history - admin managed via RLS';
COMMENT ON FUNCTION public.verify_admin_access_secure IS 'Secure admin verification function for RLS policies';
