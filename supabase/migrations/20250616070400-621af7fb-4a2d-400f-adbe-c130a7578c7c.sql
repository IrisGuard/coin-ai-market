
-- Delete the remaining 2 demo coins that belong to the specific user
DELETE FROM coins 
WHERE user_id = '0c8d23db-5892-4c5a-95e5-0df44f9d9386';

-- Also delete any bids that might be associated with these coins to avoid orphaned records
DELETE FROM bids 
WHERE coin_id NOT IN (SELECT id FROM coins);
