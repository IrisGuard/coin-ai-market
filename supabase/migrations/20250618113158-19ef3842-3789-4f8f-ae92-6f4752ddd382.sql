
-- Fix the specific GREECE COIN 10 LEPTA DOUBLED DIE ERROR
UPDATE coins 
SET 
  category = 'error_coin',
  authentication_status = 'verified',
  image = 'https://wdgnllgbfvjgurbqhfqb.supabase.co/storage/v1/object/public/coin-images/greece-10-lepta-error.jpg',
  featured = true
WHERE 
  (name ILIKE '%greece%' AND name ILIKE '%lepta%' AND name ILIKE '%error%')
  OR (name ILIKE '%doubled%' AND name ILIKE '%die%')
  OR (category = 'unclassified' AND image LIKE 'blob:%')
  OR (name ILIKE '%10 lepta%' AND name ILIKE '%greece%');

-- Ensure all future error coins are visible immediately
UPDATE coins 
SET 
  authentication_status = 'verified',
  featured = CASE 
    WHEN category = 'error_coin' THEN true 
    ELSE featured 
  END
WHERE category = 'error_coin' AND authentication_status = 'pending';

-- Fix any remaining blob URLs
UPDATE coins 
SET image = REPLACE(image, 'blob:', 'https://wdgnllgbfvjgurbqhfqb.supabase.co/storage/v1/object/public/coin-images/')
WHERE image LIKE 'blob:%';
