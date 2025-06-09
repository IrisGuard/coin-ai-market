
-- Update the user_role enum to include buyer and dealer instead of user
ALTER TYPE user_role ADD VALUE IF NOT EXISTS 'buyer';
ALTER TYPE user_role ADD VALUE IF NOT EXISTS 'dealer';

-- Update the handle_new_user function to support role-based signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = 'public'
AS $function$
DECLARE
  user_role_type user_role;
  should_create_store boolean := false;
BEGIN
  -- Get role from metadata, default to 'buyer'
  user_role_type := COALESCE(new.raw_user_meta_data->>'role', 'buyer')::user_role;
  
  -- Determine if we should create a store
  should_create_store := (user_role_type = 'dealer');

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
    user_role_type
  );

  -- Assign the specified role
  INSERT INTO public.user_roles (user_id, role)
  VALUES (new.id, user_role_type);

  -- Create store only for dealers
  IF should_create_store THEN
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
  END IF;

  RETURN new;
END;
$function$;
