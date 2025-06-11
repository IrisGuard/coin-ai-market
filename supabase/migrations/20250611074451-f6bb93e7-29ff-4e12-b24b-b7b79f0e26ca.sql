
-- Create table for AI command execution logs
CREATE TABLE IF NOT EXISTS public.ai_command_executions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  command_id UUID REFERENCES public.ai_commands(id) ON DELETE CASCADE,
  user_id UUID REFERENCES auth.users(id),
  input_data JSONB DEFAULT '{}',
  output_data JSONB DEFAULT '{}',
  execution_status TEXT DEFAULT 'pending' CHECK (execution_status IN ('pending', 'running', 'completed', 'failed')),
  execution_time_ms INTEGER DEFAULT 0,
  error_message TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  completed_at TIMESTAMP WITH TIME ZONE
);

-- Enable RLS
ALTER TABLE public.ai_command_executions ENABLE ROW LEVEL SECURITY;

-- Create policies for ai_command_executions
CREATE POLICY "Users can view their own executions" 
  ON public.ai_command_executions 
  FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own executions" 
  ON public.ai_command_executions 
  FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

-- Add indexes for performance
CREATE INDEX IF NOT EXISTS idx_ai_command_executions_command_id ON public.ai_command_executions(command_id);
CREATE INDEX IF NOT EXISTS idx_ai_command_executions_user_id ON public.ai_command_executions(user_id);
CREATE INDEX IF NOT EXISTS idx_ai_command_executions_created_at ON public.ai_command_executions(created_at DESC);

-- Function to execute AI commands
CREATE OR REPLACE FUNCTION public.execute_ai_command(
  p_command_id UUID,
  p_input_data JSONB DEFAULT '{}'
)
RETURNS UUID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
DECLARE
  execution_id UUID;
  command_record RECORD;
BEGIN
  -- Get command details
  SELECT * INTO command_record 
  FROM public.ai_commands 
  WHERE id = p_command_id AND is_active = true;
  
  IF NOT FOUND THEN
    RAISE EXCEPTION 'Command not found or inactive';
  END IF;
  
  -- Create execution record
  INSERT INTO public.ai_command_executions (
    command_id,
    user_id,
    input_data,
    execution_status
  ) VALUES (
    p_command_id,
    auth.uid(),
    p_input_data,
    'running'
  ) RETURNING id INTO execution_id;
  
  -- Update command execution count
  UPDATE public.ai_commands 
  SET updated_at = now()
  WHERE id = p_command_id;
  
  -- Simulate execution completion (in real implementation, this would be async)
  UPDATE public.ai_command_executions 
  SET 
    execution_status = 'completed',
    output_data = jsonb_build_object(
      'result', 'Command executed successfully',
      'timestamp', now(),
      'command_name', command_record.name
    ),
    execution_time_ms = extract(epoch from (now() - created_at)) * 1000,
    completed_at = now()
  WHERE id = execution_id;
  
  RETURN execution_id;
END;
$$;
