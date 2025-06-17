
-- Διαγραφή των 3 fake coins με το σωστό user_id
-- Αυτά τα coins έχουν ai_provider = 'enhanced-dual-recognition' και ανήκουν στον συγκεκριμένο user
DELETE FROM coins 
WHERE ai_provider = 'enhanced-dual-recognition' 
  AND user_id = '47fc544e-c907-4112-949a-4399d7703217';

-- Διαγραφή τυχόν bids που μπορεί να έχουν γίνει σε αυτά τα fake coins
DELETE FROM bids 
WHERE coin_id NOT IN (SELECT id FROM coins);

-- Διαγραφή τυχόν favorites για αυτά τα fake coins
DELETE FROM favorites 
WHERE coin_id NOT IN (SELECT id FROM coins);

-- Cleanup AI recognition cache για fake entries
DELETE FROM ai_recognition_cache 
WHERE recognition_results::text LIKE '%enhanced-dual-recognition%';
