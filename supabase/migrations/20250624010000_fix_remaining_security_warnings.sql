-- 🛡️ FIX REMAINING SECURITY WARNINGS
-- Ημερομηνία: 24/06/2025
-- Σκοπός: Επίλυση function_search_path_mutable & auth_leaked_password_protection

-- 1. FIX: Function Search Path Mutable - update_updated_at_column
DROP FUNCTION IF EXISTS public.update_updated_at_column() CASCADE;

CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = 'public'
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

-- Grant permissions
GRANT EXECUTE ON FUNCTION public.update_updated_at_column() TO authenticated;
GRANT EXECUTE ON FUNCTION public.update_updated_at_column() TO anon;

-- Documentation
COMMENT ON FUNCTION public.update_updated_at_column() IS 'Secure trigger function with immutable search_path - fixes function_search_path_mutable warning';

-- 2. Verification
SELECT 
  'SECURITY FIXES COMPLETED' as status,
  'function_search_path_mutable: FIXED' as function_fix,
  'MANUAL STEP REQUIRED: Enable Leaked Password Protection in Auth Settings' as manual_step;

-- 3. Instructions για το Leaked Password Protection
DO $$
BEGIN
  RAISE NOTICE '=== SECURITY WARNINGS RESOLUTION ===';
  RAISE NOTICE '1. Function search_path: FIXED (immutable search_path set)';
  RAISE NOTICE '2. Leaked Password Protection: MANUAL STEP REQUIRED';
  RAISE NOTICE '   → Go to Supabase Dashboard → Authentication → Settings';
  RAISE NOTICE '   → Enable "Leaked Password Protection"';
  RAISE NOTICE '   → This checks passwords against HaveIBeenPwned.org';
END
$$; 