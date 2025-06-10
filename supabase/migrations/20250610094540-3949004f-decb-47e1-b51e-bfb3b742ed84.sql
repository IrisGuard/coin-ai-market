
-- Create a policy that allows creating the first admin when no admins exist
CREATE POLICY "Allow first admin creation when no admins exist" 
ON public.user_roles 
FOR INSERT 
WITH CHECK (
  role = 'admin'::user_role 
  AND NOT EXISTS (
    SELECT 1 FROM public.user_roles WHERE role = 'admin'::user_role
  )
);

-- Create a secure function to create the first admin safely
CREATE OR REPLACE FUNCTION public.create_first_admin_safely(
  target_user_id uuid,
  admin_role user_role DEFAULT 'admin'::user_role
)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = 'public'
AS $$
DECLARE
  admin_count integer;
BEGIN
  -- Check if any admin already exists
  SELECT COUNT(*) INTO admin_count 
  FROM public.user_roles 
  WHERE role = 'admin'::user_role;
  
  -- Only allow creation if no admins exist
  IF admin_count = 0 THEN
    -- Insert the admin role
    INSERT INTO public.user_roles (user_id, role)
    VALUES (target_user_id, admin_role);
    
    -- Update the profile role as well
    UPDATE public.profiles 
    SET role = 'admin' 
    WHERE id = target_user_id;
    
    RETURN true;
  ELSE
    -- Admin already exists, return false
    RETURN false;
  END IF;
  
EXCEPTION
  WHEN OTHERS THEN
    -- Return false on any error
    RETURN false;
END;
$$;
