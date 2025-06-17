
-- Delete the old WORLD COINS store that has no proper configuration
DELETE FROM stores 
WHERE name = 'WORLD COINS' 
AND description IS NULL 
AND address IS NULL;

-- Set the new WORLD COINS ERROR store as verified (for admin users)
UPDATE stores 
SET verified = true 
WHERE name = 'WORLD COINS ERROR';

-- Ensure all admin user stores are automatically verified
UPDATE stores 
SET verified = true 
WHERE user_id IN (
  SELECT user_id FROM admin_roles WHERE role = 'admin'
) AND verified = false;

-- Log the cleanup action
INSERT INTO analytics_events (
  event_type,
  page_url,
  metadata,
  timestamp
) VALUES (
  'store_cleanup_marketplace_fix',
  '/marketplace',
  jsonb_build_object(
    'action', 'removed_old_world_coins_store',
    'verified_admin_stores', true,
    'marketplace_display_fixed', true
  ),
  now()
);
