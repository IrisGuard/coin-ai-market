
-- Create github_violations table for real-time violation tracking
CREATE TABLE IF NOT EXISTS public.github_violations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  file_path TEXT NOT NULL,
  line_number INTEGER NOT NULL,
  violation_type TEXT NOT NULL,
  violation_content TEXT NOT NULL,
  severity TEXT NOT NULL CHECK (severity IN ('low', 'medium', 'high', 'critical')),
  status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'resolved', 'ignored')),
  context TEXT,
  detected_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  resolved_at TIMESTAMP WITH TIME ZONE,
  resolved_by UUID REFERENCES auth.users(id),
  scan_id UUID,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Add indexes for performance
CREATE INDEX IF NOT EXISTS idx_github_violations_status ON public.github_violations(status);
CREATE INDEX IF NOT EXISTS idx_github_violations_severity ON public.github_violations(severity);
CREATE INDEX IF NOT EXISTS idx_github_violations_file_path ON public.github_violations(file_path);
CREATE INDEX IF NOT EXISTS idx_github_violations_detected_at ON public.github_violations(detected_at);
CREATE INDEX IF NOT EXISTS idx_github_violations_scan_id ON public.github_violations(scan_id);

-- Add RLS policies
ALTER TABLE public.github_violations ENABLE ROW LEVEL SECURITY;

-- Allow admins to view and manage all violations
CREATE POLICY "Admins can view all github violations" ON public.github_violations
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.user_roles 
      WHERE user_id = auth.uid() AND role = 'admin'
    )
  );

CREATE POLICY "Admins can insert github violations" ON public.github_violations
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.user_roles 
      WHERE user_id = auth.uid() AND role = 'admin'
    )
  );

CREATE POLICY "Admins can update github violations" ON public.github_violations
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM public.user_roles 
      WHERE user_id = auth.uid() AND role = 'admin'
    )
  );

-- Create trigger for updated_at
CREATE OR REPLACE FUNCTION update_github_violations_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER github_violations_updated_at
  BEFORE UPDATE ON public.github_violations
  FOR EACH ROW
  EXECUTE FUNCTION update_github_violations_updated_at();

-- Create function to get violation statistics
CREATE OR REPLACE FUNCTION get_github_violation_stats()
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
DECLARE
  result jsonb;
BEGIN
  WITH stats AS (
    SELECT 
      COUNT(*) as total_violations,
      COUNT(CASE WHEN status = 'active' THEN 1 END) as active_violations,
      COUNT(CASE WHEN severity = 'critical' AND status = 'active' THEN 1 END) as critical_violations,
      COUNT(CASE WHEN severity = 'high' AND status = 'active' THEN 1 END) as high_violations,
      COUNT(CASE WHEN severity = 'medium' AND status = 'active' THEN 1 END) as medium_violations,
      COUNT(CASE WHEN severity = 'low' AND status = 'active' THEN 1 END) as low_violations,
      COUNT(DISTINCT file_path) as affected_files,
      MAX(detected_at) as last_detection
    FROM public.github_violations
  )
  SELECT jsonb_build_object(
    'total_violations', total_violations,
    'active_violations', active_violations,
    'critical_violations', critical_violations,
    'high_violations', high_violations,
    'medium_violations', medium_violations,
    'low_violations', low_violations,
    'affected_files', affected_files,
    'last_detection', last_detection,
    'production_ready', CASE WHEN active_violations = 0 THEN true ELSE false END,
    'last_updated', now()
  ) INTO result
  FROM stats;
  
  RETURN result;
END;
$$;
