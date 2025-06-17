
-- Διαγραφή των 3 fake coins που δημιουργήθηκαν από το ProductionPlatformActivator
-- Αυτά τα coins έχουν ai_provider = 'enhanced-dual-recognition' και ανήκουν στον admin user

DELETE FROM coins 
WHERE ai_provider = 'enhanced-dual-recognition' 
  AND user_id = '0c8d23db-5892-4c5a-95e5-0df44f9d9386';

-- Διαγραφή τυχόν bids που μπορεί να έχουν γίνει σε αυτά τα fake coins
DELETE FROM bids 
WHERE coin_id NOT IN (SELECT id FROM coins);

-- Διαγραφή τυχόν favorites για αυτά τα fake coins
DELETE FROM favorites 
WHERE coin_id NOT IN (SELECT id FROM coins);

-- Cleanup AI recognition cache για fake entries
DELETE FROM ai_recognition_cache 
WHERE recognition_results::text LIKE '%enhanced-dual-recognition%';
