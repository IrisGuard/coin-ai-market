
-- Fix mock_data_violations table and view

-- Add missing source column to existing table
ALTER TABLE public.mock_data_violations 
ADD COLUMN IF NOT EXISTS source text DEFAULT 'local' CHECK (source IN ('github', 'supabase', 'local'));

-- Update existing records to have a source
UPDATE public.mock_data_violations 
SET source = 'local' 
WHERE source IS NULL;

-- Recreate the view with correct column references
DROP VIEW IF EXISTS mock_data_statistics;

CREATE OR REPLACE VIEW mock_data_statistics AS
SELECT 
  COUNT(*) as total_violations,
  COUNT(*) FILTER (WHERE status = 'active') as active_violations,
  COUNT(*) FILTER (WHERE status = 'resolved') as resolved_violations,
  COUNT(*) FILTER (WHERE severity = 'critical') as critical_violations,
  COUNT(*) FILTER (WHERE violation_type = 'math_random') as math_random_count,
  COUNT(*) FILTER (WHERE source = 'github') as github_violations,
  COUNT(*) FILTER (WHERE source = 'supabase') as supabase_violations,
  COUNT(*) FILTER (WHERE source = 'local') as local_violations,
  MAX(detected_at) as last_violation_time
FROM public.mock_data_violations;
