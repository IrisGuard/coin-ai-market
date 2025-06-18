
-- Fix existing coin with wrong category and status
UPDATE coins 
SET 
  category = 'error_coin',
  authentication_status = 'verified'
WHERE 
  (category = 'unclassified' OR image LIKE 'blob:%')
  AND (name ILIKE '%double%' OR name ILIKE '%die%' OR name ILIKE '%error%')
;

-- Ensure all coins have proper visibility
UPDATE coins 
SET authentication_status = 'verified' 
WHERE authentication_status = 'pending'
AND created_at > NOW() - INTERVAL '1 hour';
