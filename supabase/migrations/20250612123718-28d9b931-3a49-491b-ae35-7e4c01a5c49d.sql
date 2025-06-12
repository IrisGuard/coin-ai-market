
-- BACKUP: Existing RLS policies before cleanup (2025-06-12)
-- This backup contains all current policies for reference

-- ARCHIVED ON 2025-06-12: Duplicate policies that cause RLS conflicts

-- Removing duplicate policy from profiles table
DROP POLICY IF EXISTS "users_manage_own_profile" ON public.profiles;

-- Removing duplicate policy from profiles table  
DROP POLICY IF EXISTS "Profiles can be inserted by authenticated users" ON public.profiles;

-- Removing duplicate policy from stores table
DROP POLICY IF EXISTS "admin_manage_stores" ON public.stores;

-- Removing duplicate policy from stores table
DROP POLICY IF EXISTS "Authenticated users can create stores" ON public.stores;

-- RESULT: Only clean, non-conflicting policies remain:
-- profiles: "Users can manage their own profiles" (ALL operations)
-- stores: "Store owners can manage their own stores" (ALL operations) 
-- user_roles: All existing policies remain untouched

-- This resolves RLS conflicts preventing dealer access to /upload
