
-- Fix indexes and ensure clean policies (without CONCURRENTLY)

-- Drop any remaining conflicting policies first
DROP POLICY IF EXISTS "Admins can view all ai_commands" ON public.ai_commands;
DROP POLICY IF EXISTS "Admins can insert ai_commands" ON public.ai_commands;
DROP POLICY IF EXISTS "Admins can update ai_commands" ON public.ai_commands;
DROP POLICY IF EXISTS "Admins can delete ai_commands" ON public.ai_commands;
DROP POLICY IF EXISTS "Users can view their own executions" ON public.ai_command_executions;
DROP POLICY IF EXISTS "Users can create their own executions" ON public.ai_command_executions;

-- Create clean single policies
CREATE POLICY "Admin full access to ai_commands" ON public.ai_commands
FOR ALL USING (public.verify_admin_access_secure());

CREATE POLICY "Admin full access to ai_command_executions" ON public.ai_command_executions
FOR ALL USING (public.verify_admin_access_secure());

-- Create performance indexes (without CONCURRENTLY)
CREATE INDEX IF NOT EXISTS idx_ai_commands_created_at 
ON public.ai_commands (created_at DESC);

CREATE INDEX IF NOT EXISTS idx_ai_commands_is_active 
ON public.ai_commands (is_active) WHERE is_active = true;

CREATE INDEX IF NOT EXISTS idx_ai_command_executions_command_id_created 
ON public.ai_command_executions (command_id, created_at DESC);

CREATE INDEX IF NOT EXISTS idx_ai_command_executions_status 
ON public.ai_command_executions (execution_status);

-- Clean up mock data
DELETE FROM public.ai_commands WHERE name ILIKE '%mock%' OR name ILIKE '%test%' OR name ILIKE '%example%';
DELETE FROM public.ai_command_executions WHERE input_data::text ILIKE '%mock%' OR input_data::text ILIKE '%test%';

-- Ensure ai_command_executions has correct structure
ALTER TABLE public.ai_command_executions 
ADD COLUMN IF NOT EXISTS completed_at TIMESTAMP WITH TIME ZONE;

-- Comment for documentation
COMMENT ON TABLE public.ai_commands IS 'AI commands with site_url support for website parsing and analysis - cleaned and optimized';
COMMENT ON TABLE public.ai_command_executions IS 'Execution history and results for AI commands - performance optimized';
