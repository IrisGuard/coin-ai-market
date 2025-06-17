
-- Delete the specific old WORLD COINS store by its ID
DELETE FROM stores 
WHERE id = 'cc4f0430-fa93-4064-b456-3a8c3f3fa9a3'
AND name = 'WORLD COINS'
AND description IS NULL 
AND address IS NULL;

-- Verify that only the correct WORLD COINS ERROR store remains verified
UPDATE stores 
SET verified = true 
WHERE name = 'WORLD COINS ERROR' 
AND id != 'cc4f0430-fa93-4064-b456-3a8c3f3fa9a3';

-- Log the specific cleanup action with store ID
INSERT INTO analytics_events (
  event_type,
  page_url,
  metadata,
  timestamp
) VALUES (
  'specific_store_cleanup_by_id',
  '/marketplace',
  jsonb_build_object(
    'action', 'deleted_old_world_coins_by_id',
    'deleted_store_id', 'cc4f0430-fa93-4064-b456-3a8c3f3fa9a3',
    'remaining_store_verified', true,
    'marketplace_cleaned', true
  ),
  now()
);
