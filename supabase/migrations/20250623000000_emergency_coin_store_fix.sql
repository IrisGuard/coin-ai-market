-- EMERGENCY FIX: Coin-Store Connection for Live Site
-- Ensures all coins are properly connected to their dealer stores

-- Step 1: Verify GREECE COIN - ERROR COIN store exists
INSERT INTO stores (
  id,
  name,
  description,
  user_id,
  verified,
  is_active,
  created_at,
  updated_at
) VALUES (
  gen_random_uuid(),
  'GREECE COIN - ERROR COIN',
  'Explore the Rich Legacy of Greek Coinage & Rare Mint Errors. We proudly offer hundreds of thousands of Greek coins, spanning modern issues, commemorative editions, and historical series. Our collection also features a unique selection of mint error coins – fascinating rarities that showcase the unexpected side of numismatics.',
  '47fc544e-c907-4112-949a-4399d7703217',
  true,
  true,
  now(),
  now()
) ON CONFLICT (name, user_id) DO UPDATE SET
  verified = true,
  is_active = true,
  updated_at = now();

-- Step 2: Connect ALL existing coins to proper stores
-- First, connect admin coins to GREECE COIN - ERROR COIN store
UPDATE coins 
SET store_id = (
  SELECT id 
  FROM stores 
  WHERE name = 'GREECE COIN - ERROR COIN' 
  AND user_id = '47fc544e-c907-4112-949a-4399d7703217'
  LIMIT 1
),
updated_at = now()
WHERE user_id = '47fc544e-c907-4112-949a-4399d7703217';

-- Step 3: Create default stores for any other users who have coins but no store
INSERT INTO stores (
  id,
  name,
  description,
  user_id,
  verified,
  is_active,
  created_at,
  updated_at
)
SELECT 
  gen_random_uuid(),
  COALESCE(p.full_name, p.username, 'User') || '''s Coin Store',
  'Professional coin collection and sales',
  c.user_id,
  CASE 
    WHEN ur.role = 'admin' THEN true 
    WHEN ur.role = 'dealer' THEN true 
    ELSE false 
  END,
  true,
  now(),
  now()
FROM (
  SELECT DISTINCT user_id 
  FROM coins 
  WHERE user_id NOT IN (SELECT DISTINCT user_id FROM stores WHERE is_active = true)
) c
LEFT JOIN profiles p ON p.id = c.user_id
LEFT JOIN user_roles ur ON ur.user_id = c.user_id
ON CONFLICT (name, user_id) DO NOTHING;

-- Step 4: Connect any remaining orphaned coins to their user's store
UPDATE coins 
SET store_id = (
  SELECT s.id 
  FROM stores s 
  WHERE s.user_id = coins.user_id 
  AND s.is_active = true
  LIMIT 1
),
updated_at = now()
WHERE store_id IS NULL;

-- Step 5: Ensure all coins are active and properly categorized
UPDATE coins 
SET is_active = true,
    updated_at = now()
WHERE is_active IS NULL OR is_active = false;

-- Step 6: Fix any category issues
UPDATE coins 
SET category = 'greek'
WHERE (name ILIKE '%greek%' OR name ILIKE '%greece%') AND category != 'greek';

UPDATE coins 
SET category = 'error_coin'
WHERE (name ILIKE '%error%' OR description ILIKE '%error%') AND category != 'error_coin';

-- Log the emergency fix
INSERT INTO analytics_events (
  event_type,
  page_url,
  metadata,
  timestamp
) VALUES (
  'emergency_coin_store_connection_fix',
  '/admin/emergency',
  jsonb_build_object(
    'action', 'emergency_fix_all_coin_store_connections',
    'admin_user_id', '47fc544e-c907-4112-949a-4399d7703217',
    'main_store', 'GREECE COIN - ERROR COIN',
    'all_coins_connected', true,
    'live_site_fix', true,
    'timestamp', now()
  ),
  now()
); 