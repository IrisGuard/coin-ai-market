
-- Remove demo/fake coins from the database
DELETE FROM coins 
WHERE name IN ('1909-S VDB Lincoln Cent', 'Morgan Silver Dollar 1881-S', 'Walking Liberty Half Dollar 1916-D')
   OR description LIKE '%demo%' 
   OR description LIKE '%sample%'
   OR user_id NOT IN (SELECT id FROM auth.users);

-- Also remove any coins that might be test data without proper user associations
DELETE FROM coins 
WHERE user_id IS NULL OR user_id = '00000000-0000-0000-0000-000000000000';
