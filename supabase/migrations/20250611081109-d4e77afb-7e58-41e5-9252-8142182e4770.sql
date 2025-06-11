
-- Enable RLS on ai_commands table if not already enabled
ALTER TABLE public.ai_commands ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist to avoid conflicts
DROP POLICY IF EXISTS "Admins can view all ai_commands" ON public.ai_commands;
DROP POLICY IF EXISTS "Admins can insert ai_commands" ON public.ai_commands;
DROP POLICY IF EXISTS "Admins can update ai_commands" ON public.ai_commands;
DROP POLICY IF EXISTS "Admins can delete ai_commands" ON public.ai_commands;

-- Create comprehensive RLS policies for AI commands
CREATE POLICY "Admins can view all ai_commands" 
  ON public.ai_commands 
  FOR SELECT 
  USING (public.verify_admin_access_secure(auth.uid()));

CREATE POLICY "Admins can insert ai_commands" 
  ON public.ai_commands 
  FOR INSERT 
  WITH CHECK (public.verify_admin_access_secure(auth.uid()));

CREATE POLICY "Admins can update ai_commands" 
  ON public.ai_commands 
  FOR UPDATE 
  USING (public.verify_admin_access_secure(auth.uid()));

CREATE POLICY "Admins can delete ai_commands" 
  ON public.ai_commands 
  FOR DELETE 
  USING (public.verify_admin_access_secure(auth.uid()));

-- Enable RLS on ai_command_executions table
ALTER TABLE public.ai_command_executions ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Admins can view all ai_command_executions" ON public.ai_command_executions;
DROP POLICY IF EXISTS "Admins can insert ai_command_executions" ON public.ai_command_executions;

-- Create RLS policies for command executions
CREATE POLICY "Admins can view all ai_command_executions" 
  ON public.ai_command_executions 
  FOR SELECT 
  USING (public.verify_admin_access_secure(auth.uid()));

CREATE POLICY "Admins can insert ai_command_executions" 
  ON public.ai_command_executions 
  FOR INSERT 
  WITH CHECK (public.verify_admin_access_secure(auth.uid()));

-- Enable realtime for AI commands and executions
ALTER PUBLICATION supabase_realtime ADD TABLE public.ai_commands;
ALTER PUBLICATION supabase_realtime ADD TABLE public.ai_command_executions;

-- Set replica identity for real-time updates
ALTER TABLE public.ai_commands REPLICA IDENTITY FULL;
ALTER TABLE public.ai_command_executions REPLICA IDENTITY FULL;
