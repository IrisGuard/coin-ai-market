
-- Step 1: Delete the empty ai_predictions table
DROP TABLE IF EXISTS public.ai_predictions CASCADE;

-- Step 2: Delete inactive prediction models records
DELETE FROM public.prediction_models 
WHERE last_trained IS NULL AND accuracy_score = 0.0;

-- Step 3: Clean up synthetic analytics events
DELETE FROM public.analytics_events 
WHERE event_type IN (
  'production_cleanup_completed',
  'production_mode_activated',
  'production_security_fully_configured',
  'production_security_warnings_resolved',
  'security_warnings_resolution_complete'
) 
OR event_type LIKE '%production%' 
OR event_type LIKE '%mock%' 
OR event_type LIKE '%demo%' 
OR event_type LIKE '%test%';

-- Step 4: If prediction_models table becomes empty, consider dropping it too
-- (This will be checked after the DELETE operation above)
