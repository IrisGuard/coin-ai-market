
-- 1. Delete the old "CHARALAMPOS VLANTIS's Store" that belongs to dealer account
DELETE FROM stores 
WHERE name = 'CHARALAMPOS VLANTIS''s Store' 
AND user_id = '0c8d23db-5892-4c5a-95e5-0df44f9d9386';

-- 2. Update "WORLD COINS" to be verified so it appears in Marketplace
UPDATE stores 
SET verified = true 
WHERE name = 'WORLD COINS';

-- 3. Ensure all admin stores are verified by default for future consistency
UPDATE stores 
SET verified = true 
WHERE user_id IN (
  SELECT user_id FROM user_roles WHERE role = 'admin'
);
