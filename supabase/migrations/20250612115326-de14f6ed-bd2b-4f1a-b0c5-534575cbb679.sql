
-- Add missing RLS policy for user_roles table to allow users to insert their own roles
CREATE POLICY "Users can insert their own roles" 
  ON public.user_roles 
  FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

-- Also add a policy to allow users to view their own roles (for role checking)
CREATE POLICY "Users can view their own roles" 
  ON public.user_roles 
  FOR SELECT 
  USING (auth.uid() = user_id);
