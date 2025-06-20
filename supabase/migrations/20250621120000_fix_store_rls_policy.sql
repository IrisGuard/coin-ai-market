-- Correct the RLS policies for the `stores` table to allow public viewing.
-- The previous policy `stores_public_read` was too restrictive.

-- Drop the old, incorrect policy
DROP POLICY IF EXISTS "stores_public_read" ON public.stores;

-- Create a new, correct policy that allows public read access to stores
-- that are both verified and active. This will allow users to see the store pages.
CREATE POLICY "stores_public_viewable" ON public.stores
  FOR SELECT
  USING (verified = true AND is_active = true); 