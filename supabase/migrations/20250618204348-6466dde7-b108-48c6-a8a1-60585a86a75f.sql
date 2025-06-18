
-- Update existing admin stores to be verified
UPDATE public.stores 
SET verified = true 
WHERE user_id IN (
  SELECT user_id FROM public.user_roles WHERE role = 'admin'
);

-- Add store_verified computed field for easier querying
-- This will help us easily identify verified stores in queries

-- Create function to check if a store is verified
CREATE OR REPLACE FUNCTION public.is_store_verified(store_uuid uuid)
RETURNS boolean
LANGUAGE sql
STABLE SECURITY DEFINER
SET search_path TO 'public'
AS $$
  SELECT COALESCE(verified, false) 
  FROM public.stores 
  WHERE id = store_uuid;
$$;

-- Create function to get store verification status for coins
CREATE OR REPLACE FUNCTION public.get_coin_store_verification(coin_store_id uuid)
RETURNS boolean
LANGUAGE sql
STABLE SECURITY DEFINER  
SET search_path TO 'public'
AS $$
  SELECT COALESCE(s.verified, false)
  FROM public.stores s
  WHERE s.id = coin_store_id;
$$;
