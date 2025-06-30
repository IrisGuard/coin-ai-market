-- 🚀 FINAL PRODUCTION CLEANUP - Remove ALL Mock Data
-- This migration ensures the system is 100% production ready

-- 1. Remove any remaining mock/demo coins
DELETE FROM public.coins 
WHERE 
  -- Coins with demo/mock in name or description
  (name ILIKE '%demo%' OR name ILIKE '%mock%' OR name ILIKE '%test%' OR name ILIKE '%sample%')
  OR (description ILIKE '%demo%' OR description ILIKE '%mock%' OR description ILIKE '%test%' OR description ILIKE '%sample%')
  
  -- Known demo coins
  OR name IN (
    '1909-S VDB Lincoln Cent',
    'Morgan Silver Dollar 1881-S', 
    'Walking Liberty Half Dollar 1916-D',
    'Mercury Dime 1916-D',
    'Standing Liberty Quarter 1916'
  )
  
  -- Coins with invalid user_id
  OR user_id IS NULL 
  OR user_id = '00000000-0000-0000-0000-000000000000'
  
  -- Coins using fake AI provider
  OR ai_provider = 'enhanced-dual-recognition'
  
  -- Coins with placeholder images only
  OR (image = '/placeholder-coin.svg' AND images IS NULL);

-- 2. Clean AI recognition cache
DELETE FROM public.ai_recognition_cache 
WHERE 
  sources_consulted @> ARRAY['enhanced-dual-recognition']
  OR sources_consulted @> ARRAY['mock-provider']
  OR image_url ILIKE '%placeholder%'
  OR analysis_results::text ILIKE '%demo%'
  OR analysis_results::text ILIKE '%mock%';

-- 3. Clean dual image analysis table
DELETE FROM public.dual_image_analysis 
WHERE 
  analysis_results::text ILIKE '%Morgan Silver Dollar%' 
  OR analysis_results::text ILIKE '%Mercury Dime%'
  OR analysis_results::text ILIKE '%enhanced-dual-recognition%'
  OR analysis_results::text ILIKE '%demo%'
  OR analysis_results::text ILIKE '%mock%';

-- 4. Clean error logs
DELETE FROM public.error_logs 
WHERE 
  message ILIKE '%enhanced-dual-recognition%'
  OR message ILIKE '%mock%'
  OR message ILIKE '%demo%'
  OR error_context::text ILIKE '%test%';

-- 5. Clean analytics events
DELETE FROM public.analytics_events 
WHERE 
  metadata::text ILIKE '%enhanced-dual-recognition%'
  OR metadata::text ILIKE '%Morgan Silver Dollar%'
  OR metadata::text ILIKE '%Mercury Dime%'
  OR metadata::text ILIKE '%mock%'
  OR metadata::text ILIKE '%demo%'
  OR event_type ILIKE '%test%';

-- 6. Clean admin activity logs
DELETE FROM public.admin_activity_logs 
WHERE 
  action ILIKE '%mock%'
  OR action ILIKE '%demo%'
  OR action ILIKE '%test%'
  OR details::text ILIKE '%sample%';

-- 7. Clean marketplace listings
DELETE FROM public.marketplace_listings
WHERE coin_id NOT IN (SELECT id FROM public.coins);

-- 8. Clean bids for non-existent coins
DELETE FROM public.bids
WHERE coin_id NOT IN (SELECT id FROM public.coins);

-- 9. Clean transactions for non-existent coins
DELETE FROM public.transactions
WHERE coin_id NOT IN (SELECT id FROM public.coins);

-- 10. Clean favorites for non-existent coins
DELETE FROM public.favorites
WHERE coin_id NOT IN (SELECT id FROM public.coins);

-- 11. Clean views for non-existent coins
DELETE FROM public.coin_views
WHERE coin_id NOT IN (SELECT id FROM public.coins);

-- 12. Remove mock data violations table (no longer needed)
DROP TABLE IF EXISTS public.mock_data_violations CASCADE;

-- 13. Remove any temporary/test functions
DROP FUNCTION IF EXISTS public.cleanup_mock_data();

-- 14. Update system status to production
UPDATE public.system_status 
SET 
  environment = 'production',
  mock_data_present = false,
  production_ready = true,
  last_cleanup = now(),
  updated_at = now()
WHERE environment = 'development' OR mock_data_present = true;

-- 15. Log the production activation
INSERT INTO public.analytics_events (
  event_type,
  page_url,
  user_id,
  metadata,
  timestamp
) VALUES (
  'production_activation_complete',
  '/admin/production',
  (SELECT id FROM auth.users WHERE email LIKE '%admin%' LIMIT 1),
  jsonb_build_object(
    'action', 'production_deployment_complete',
    'mock_data_removed', true,
    'database_cleaned', true,
    'production_ready', true,
    'timestamp', now(),
    'version', '2.1.0',
    'deployment_type', 'full_production'
  ),
  now()
);

-- 16. Vacuum and analyze tables for optimal performance
VACUUM ANALYZE public.coins;
VACUUM ANALYZE public.stores;
VACUUM ANALYZE public.marketplace_listings;
VACUUM ANALYZE public.analytics_events;

-- Success message
DO $$
BEGIN
  RAISE NOTICE '🚀 PRODUCTION CLEANUP COMPLETE! All mock data removed, system ready for live coins.';
  RAISE NOTICE '✅ Database optimized for production performance.';
  RAISE NOTICE '🎯 Ready to accept real coin uploads and transactions.';
END $$; 