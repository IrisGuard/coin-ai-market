
-- Διαγραφή όλων των mock events από analytics_events
DELETE FROM public.analytics_events 
WHERE event_type ILIKE '%mock%' 
   OR event_type ILIKE '%demo%' 
   OR event_type ILIKE '%cleanup%'
   OR event_type ILIKE '%emergency%'
   OR event_type ILIKE '%phase%'
   OR event_type ILIKE '%security%'
   OR metadata::text ILIKE '%mock%'
   OR metadata::text ILIKE '%demo%'
   OR metadata::text ILIKE '%cleanup%'
   OR metadata::text ILIKE '%emergency%';

-- Διαγραφή όλων των mock cleanup activities από admin_activity_logs
DELETE FROM public.admin_activity_logs 
WHERE action ILIKE '%mock%' 
   OR action ILIKE '%cleanup%' 
   OR action ILIKE '%emergency%'
   OR details::text ILIKE '%mock%'
   OR details::text ILIKE '%cleanup%';

-- Διαγραφή του πίνακα mock_data_violations εντελώς
DROP TABLE IF EXISTS public.mock_data_violations CASCADE;

-- Διαγραφή του view mock_data_statistics αν υπάρχει
DROP VIEW IF EXISTS public.mock_data_statistics CASCADE;
