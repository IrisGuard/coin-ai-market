-- Enable pg_cron and pg_net extensions for scheduled jobs
CREATE EXTENSION IF NOT EXISTS pg_cron;
CREATE EXTENSION IF NOT EXISTS pg_net;

-- Create scheduled job for autonomous source discovery (every 12 hours)
SELECT cron.schedule(
  'autonomous-source-discovery-12h',
  '0 */12 * * *', -- Every 12 hours
  $$
  SELECT
    net.http_post(
      url := 'https://wdgnllgbfvjgurbqhfqb.supabase.co/functions/v1/autonomous-source-discovery',
      headers := '{"Content-Type": "application/json", "Authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6IndkZ25sbGdiZnZqZ3VyYnFoZnFiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDkwNTM4NjUsImV4cCI6MjA2NDYyOTg2NX0.vPsjHXSqpx3SLKtoIroQkFZhTSdWEfHA4x5kg5p1veU"}'::jsonb,
      body := '{"action": "discover_all", "scheduled": true}'::jsonb
    ) as request_id;
  $$
);

-- Create scheduled job for AI learning engine (daily)
SELECT cron.schedule(
  'ai-learning-daily',
  '0 2 * * *', -- Every day at 2 AM
  $$
  SELECT
    net.http_post(
      url := 'https://wdgnllgbfvjgurbqhfqb.supabase.co/functions/v1/ai-learning-engine',
      headers := '{"Content-Type": "application/json", "Authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6IndkZ25sbGdiZnZqZ3VyYnFoZnFiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDkwNTM4NjUsImV4cCI6MjA2NDYyOTg2NX0.vPsjHXSqpx3SLKtoIroQkFZhTSdWEfHA4x5kg5p1veU"}'::jsonb,
      body := '{"auto_learn": true, "scheduled": true}'::jsonb
    ) as request_id;
  $$
);

-- Create scheduled job for global intelligence analysis (weekly)
SELECT cron.schedule(
  'global-intelligence-weekly',
  '0 6 * * 0', -- Every Sunday at 6 AM
  $$
  SELECT
    net.http_post(
      url := 'https://wdgnllgbfvjgurbqhfqb.supabase.co/functions/v1/global-intelligence-network',
      headers := '{"Content-Type": "application/json", "Authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6IndkZ25sbGdiZnZqZ3VyYnFoZnFiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDkwNTM4NjUsImV4cCI6MjA2NDYyOTg2NX0.vPsjHXSqpx3SLKtoIroQkFZhTSdWEfHA4x5kg5p1veU"}'::jsonb,
      body := '{"action": "analyze", "scheduled": true}'::jsonb
    ) as request_id;
  $$
);

-- Log the successful activation of autonomous scheduling
INSERT INTO public.analytics_events (
  event_type,
  page_url,
  metadata,
  timestamp
) VALUES (
  'autonomous_scheduling_activated',
  '/admin/ai-brain/scheduler',
  jsonb_build_object(
    'scheduled_jobs', jsonb_build_array(
      'autonomous-source-discovery-12h',
      'ai-learning-daily', 
      'global-intelligence-weekly'
    ),
    'discovery_frequency', 'every_12_hours',
    'learning_frequency', 'daily',
    'intelligence_frequency', 'weekly',
    'system_status', 'FULLY_AUTONOMOUS_WITH_SCHEDULING'
  ),
  now()
);