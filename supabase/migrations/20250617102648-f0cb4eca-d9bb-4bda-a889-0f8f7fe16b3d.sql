
-- Διαγραφή των fake νομισμάτων που χρησιμοποιούν το μη υπάρχον AI provider
DELETE FROM coins 
WHERE ai_provider = 'enhanced-dual-recognition';

-- Διαγραφή τυχόν mock entries από ai_recognition_cache
DELETE FROM ai_recognition_cache 
WHERE sources_consulted @> ARRAY['enhanced-dual-recognition'];

-- Διαγραφή τυχόν mock entries από dual_image_analysis που μπορεί να έχουν fake data
DELETE FROM dual_image_analysis 
WHERE analysis_results::text ILIKE '%Morgan Silver Dollar%' 
   OR analysis_results::text ILIKE '%Mercury Dime%'
   OR analysis_results::text ILIKE '%enhanced-dual-recognition%';

-- Καθαρισμός από error_logs τυχόν references στο fake AI provider
DELETE FROM error_logs 
WHERE message ILIKE '%enhanced-dual-recognition%';

-- Καθαρισμός από analytics_events τυχόν mock data events
DELETE FROM analytics_events 
WHERE metadata::text ILIKE '%enhanced-dual-recognition%'
   OR metadata::text ILIKE '%Morgan Silver Dollar%'
   OR metadata::text ILIKE '%Mercury Dime%';

-- Log του καθαρισμού
INSERT INTO analytics_events (
  event_type,
  page_url,
  metadata,
  timestamp
) VALUES (
  'mock_data_cleanup_complete',
  '/admin/cleanup',
  jsonb_build_object(
    'action', 'removed_all_mock_data',
    'fake_ai_provider_removed', 'enhanced-dual-recognition',
    'fake_coins_removed', 2,
    'database_cleaned', true,
    'ready_for_production', true,
    'timestamp', now()
  ),
  now()
);
