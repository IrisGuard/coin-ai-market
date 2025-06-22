-- Fix coin-store connection for WORLD COINS ERROR store
-- This ensures that existing coins are properly connected to the store

-- First, ensure the WORLD COINS ERROR store exists and is properly configured
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
  'WORLD COINS ERROR',
  '🌍 Welcome to the World of Error Coins! We are global dealers specializing in rare, collectible error coins from all over the world. With a curated inventory of 60,000+ authentic coins, we offer one of the largest selections of minting errors, planchet flaws, double strikes, off-centers, clipped planchets, and more. 🔍 Every piece is verified and carefully documented. 📦 Worldwide shipping & professional packaging. ⭐ Trusted by collectors, experts & investors worldwide. Whether you''re a seasoned collector or a new enthusiast, our store is your gateway to the most fascinating world of minting history.',
  '47fc544e-c907-4112-949a-4399d7703217',
  true,
  true,
  now(),
  now()
) ON CONFLICT (name, user_id) DO UPDATE SET
  verified = true,
  is_active = true,
  description = EXCLUDED.description,
  updated_at = now();

-- Update coins that belong to the admin user to be connected to WORLD COINS ERROR store
UPDATE coins 
SET store_id = (
  SELECT id 
  FROM stores 
  WHERE name = 'WORLD COINS ERROR' 
  AND user_id = '47fc544e-c907-4112-949a-4399d7703217'
  LIMIT 1
),
updated_at = now()
WHERE user_id = '47fc544e-c907-4112-949a-4399d7703217'
AND (store_id IS NULL OR store_id != (
  SELECT id 
  FROM stores 
  WHERE name = 'WORLD COINS ERROR' 
  AND user_id = '47fc544e-c907-4112-949a-4399d7703217'
  LIMIT 1
));

-- Ensure all coins have proper store connections
-- For coins without store_id, create a default store for each user
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
  COALESCE(p.full_name, 'User') || '''s Store',
  'Coin collection and sales',
  c.user_id,
  CASE WHEN ur.role = 'admin' THEN true ELSE false END,
  true,
  now(),
  now()
FROM (
  SELECT DISTINCT user_id 
  FROM coins 
  WHERE store_id IS NULL
) c
LEFT JOIN profiles p ON p.id = c.user_id
LEFT JOIN user_roles ur ON ur.user_id = c.user_id
ON CONFLICT (name, user_id) DO NOTHING;

-- Connect orphaned coins to their user's store
UPDATE coins 
SET store_id = (
  SELECT s.id 
  FROM stores s 
  WHERE s.user_id = coins.user_id 
  LIMIT 1
),
updated_at = now()
WHERE store_id IS NULL;

-- Log the connection fix
INSERT INTO analytics_events (
  event_type,
  page_url,
  metadata,
  timestamp
) VALUES (
  'coin_store_connection_fix_complete',
  '/admin',
  jsonb_build_object(
    'action', 'connected_all_coins_to_stores',
    'admin_user_id', '47fc544e-c907-4112-949a-4399d7703217',
    'store_name', 'WORLD COINS ERROR',
    'orphaned_coins_fixed', true
  ),
  now()
); 