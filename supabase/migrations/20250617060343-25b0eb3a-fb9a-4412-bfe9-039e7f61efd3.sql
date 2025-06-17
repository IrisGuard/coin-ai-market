
-- Complete cleanup of CHARALAMPOS VLANTIS store and ensure admin stores are auto-verified
-- This addresses the store still appearing in Marketplace despite previous deletion

-- 1. Complete removal of CHARALAMPOS VLANTIS store from all related tables
DELETE FROM stores 
WHERE name LIKE '%CHARALAMPOS VLANTIS%' 
OR description LIKE '%CHARALAMPOS VLANTIS%';

-- Also remove any potential orphaned records
DELETE FROM marketplace_listings 
WHERE seller_id = '0c8d23db-5892-4c5a-95e5-0df44f9d9386';

DELETE FROM coins 
WHERE user_id = '0c8d23db-5892-4c5a-95e5-0df44f9d9386';

-- 2. Update existing admin stores to be verified
UPDATE stores 
SET verified = true 
WHERE user_id IN (
  SELECT user_id FROM user_roles WHERE role = 'admin'
) AND verified = false;

-- 3. Ensure WORLD COINS store is properly configured as an admin store
UPDATE stores 
SET verified = true, is_active = true 
WHERE name = 'WORLD COINS';

-- Log the cleanup
INSERT INTO analytics_events (
  event_type,
  page_url,
  metadata,
  timestamp
) VALUES (
  'admin_store_cleanup_complete',
  '/admin/store-manager',
  jsonb_build_object(
    'action', 'removed_charalampos_store_completely',
    'verified_admin_stores', true,
    'marketplace_consistency', 'restored'
  ),
  now()
);
