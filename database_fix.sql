
-- Fix existing coin with wrong category and status
UPDATE coins 
SET 
  category = 'error_coin',
  authentication_status = 'verified'
WHERE 
  (category = 'unclassified' OR image LIKE 'blob:%')
  AND (name ILIKE '%double%' OR name ILIKE '%die%' OR name ILIKE '%error%' OR name ILIKE '%greece%' OR name ILIKE '%lepta%')
;

-- Ensure all error coins are visible
UPDATE coins 
SET authentication_status = 'verified' 
WHERE (name ILIKE '%error%' OR name ILIKE '%double%' OR name ILIKE '%die%')
AND authentication_status = 'pending';

-- Update any blob URLs to ensure proper image display
UPDATE coins 
SET image = CASE 
  WHEN image LIKE 'blob:%' THEN 'https://wdgnllgbfvjgurbqhfqb.supabase.co/storage/v1/object/public/coin-images/placeholder-coin.png'
  ELSE image 
END
WHERE image LIKE 'blob:%';
