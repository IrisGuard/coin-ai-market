-- Fix coin-store connection for WORLD COINS ERROR store
-- This ensures that existing coins are properly connected to the store

-- Update coins that belong to the admin user to be connected to WORLD COINS ERROR store
UPDATE coins 
SET store_id = (
  SELECT id 
  FROM stores 
  WHERE name = 'WORLD COINS ERROR' 
  AND user_id = '47fc544e-c907-4112-949a-4399d7703217'
  LIMIT 1
)
WHERE user_id = '47fc544e-c907-4112-949a-4399d7703217'
AND (store_id IS NULL OR store_id != (
  SELECT id 
  FROM stores 
  WHERE name = 'WORLD COINS ERROR' 
  AND user_id = '47fc544e-c907-4112-949a-4399d7703217'
  LIMIT 1
));

-- Log the connection fix
INSERT INTO analytics_events (
  event_type,
  page_url,
  metadata,
  timestamp
) VALUES (
  'coin_store_connection_fix',
  '/admin',
  jsonb_build_object(
    'action', 'connected_coins_to_world_coins_error_store',
    'admin_user_id', '47fc544e-c907-4112-949a-4399d7703217',
    'store_name', 'WORLD COINS ERROR'
  ),
  now()
); 