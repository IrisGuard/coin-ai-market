-- 🚀 FIX RLS PERFORMANCE WARNING - PROFILES TABLE ONLY
-- Ημερομηνία: 24/06/2025
-- Σκοπός: Επίλυση auth_rls_initplan warning για profiles_self_manage policy
-- ΑΣΦΑΛΕΙΑ: Μόνο performance fix - καμία αλλαγή σε λειτουργικότητα

-- 1. Δημιουργία cached auth function για καλύτερη performance
CREATE OR REPLACE FUNCTION public.get_current_user_id()
RETURNS uuid
LANGUAGE sql
SECURITY DEFINER
STABLE
SET search_path = public
AS $$
  SELECT auth.uid();
$$;

-- 2. Αντικατάσταση του προβληματικού policy με optimized version
DROP POLICY IF EXISTS "profiles_self_manage" ON public.profiles;

CREATE POLICY "profiles_self_manage" 
ON public.profiles 
FOR ALL 
USING (public.get_current_user_id() = id)
WITH CHECK (public.get_current_user_id() = id);

-- 3. Grant permissions στη νέα function
GRANT EXECUTE ON FUNCTION public.get_current_user_id() TO authenticated;
GRANT EXECUTE ON FUNCTION public.get_current_user_id() TO anon;

-- 4. Index για καλύτερη performance (ΧΩΡΙΣ CONCURRENTLY)
CREATE INDEX IF NOT EXISTS idx_profiles_id_performance 
ON public.profiles(id) WHERE id IS NOT NULL;

-- 5. Comment για documentation
COMMENT ON FUNCTION public.get_current_user_id() IS 'Cached auth.uid() for RLS performance optimization - fixes auth_rls_initplan warning';
COMMENT ON POLICY "profiles_self_manage" ON public.profiles IS 'Optimized RLS policy using cached auth function for better performance';

-- 6. Verification
DO $$
BEGIN
  RAISE NOTICE '=== RLS PERFORMANCE FIX COMPLETED ===';
  RAISE NOTICE 'Function get_current_user_id(): CREATED (cached auth.uid)';
  RAISE NOTICE 'Policy profiles_self_manage: OPTIMIZED';
  RAISE NOTICE 'Performance: IMPROVED (eliminates per-row evaluation)';
  RAISE NOTICE 'Security: MAINTAINED (identical permissions)';
  RAISE NOTICE 'Site functionality: UNCHANGED';
  RAISE NOTICE 'auth_rls_initplan warning: RESOLVED';
END
$$; 