
-- First, let's ensure the handle_new_user function properly creates profiles, roles, and stores
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = 'public'
AS $function$
BEGIN
  -- Insert profile with all necessary fields
  INSERT INTO public.profiles (
    id, 
    name, 
    full_name, 
    email, 
    username,
    role
  )
  VALUES (
    new.id,
    COALESCE(new.raw_user_meta_data->>'name', new.raw_user_meta_data->>'full_name', 'User'),
    COALESCE(new.raw_user_meta_data->>'full_name', new.raw_user_meta_data->>'name', 'User'),
    new.email,
    COALESCE(new.raw_user_meta_data->>'username', split_part(new.email, '@', 1)),
    'user'
  );

  -- Assign default user role
  INSERT INTO public.user_roles (user_id, role)
  VALUES (new.id, 'user'::user_role);

  -- Auto-create a store for the user
  INSERT INTO public.stores (
    user_id,
    name,
    description,
    is_active,
    verified
  )
  VALUES (
    new.id,
    COALESCE(new.raw_user_meta_data->>'full_name', new.raw_user_meta_data->>'name', 'User') || '''s Store',
    'Welcome to my coin store!',
    true,
    false
  );

  RETURN new;
END;
$function$;

-- Create a default admin user function
CREATE OR REPLACE FUNCTION public.create_default_admin()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = 'public'
AS $function$
DECLARE
  admin_user_id uuid;
BEGIN
  -- Check if admin user already exists
  SELECT id INTO admin_user_id 
  FROM public.profiles 
  WHERE email = 'admin@coinai.com';
  
  -- If admin doesn't exist, we can't create one here (auth.users is managed by Supabase)
  -- This function is for adding admin role to existing user
  IF admin_user_id IS NOT NULL THEN
    -- Add admin role if not exists
    INSERT INTO public.user_roles (user_id, role)
    VALUES (admin_user_id, 'admin'::user_role)
    ON CONFLICT (user_id, role) DO NOTHING;
    
    -- Update profile role
    UPDATE public.profiles 
    SET role = 'admin' 
    WHERE id = admin_user_id;
  END IF;
END;
$function$;

-- Ensure the trigger exists and is properly set up
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();
