-- Correct the RLS policies for the `stores` table to allow public viewing.
-- Admin stores should be visible when active, dealer stores need verification.

-- Drop the old, incorrect policy
DROP POLICY IF EXISTS "stores_public_read" ON public.stores;
DROP POLICY IF EXISTS "stores_public_viewable" ON public.stores;

-- Create a new policy that allows:
-- 1. Admin stores to be visible when active (no verification required)
-- 2. Dealer stores to be visible when both active and verified
CREATE POLICY "stores_public_viewable" ON public.stores
  FOR SELECT
  USING (
    is_active = true AND (
      -- Admin stores only need to be active
      EXISTS (
        SELECT 1 FROM public.profiles 
        WHERE profiles.id = stores.user_id 
        AND profiles.role = 'admin'
      )
      OR
      -- Dealer stores need both active and verified
      (verified = true AND NOT EXISTS (
        SELECT 1 FROM public.profiles 
        WHERE profiles.id = stores.user_id 
        AND profiles.role = 'admin'
      ))
    )
  ); 