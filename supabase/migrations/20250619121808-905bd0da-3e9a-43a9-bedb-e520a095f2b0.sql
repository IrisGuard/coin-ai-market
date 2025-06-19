
-- Create mock_data_violations table
CREATE TABLE IF NOT EXISTS public.mock_data_violations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  file_path text NOT NULL,
  line_number integer NOT NULL,
  violation_type text NOT NULL CHECK (violation_type IN ('math_random', 'mock_string', 'demo_string', 'placeholder_string', 'sample_string', 'fake_string')),
  violation_content text NOT NULL,
  detected_at timestamp with time zone DEFAULT now(),
  severity text NOT NULL DEFAULT 'medium' CHECK (severity IN ('low', 'medium', 'high', 'critical')),
  status text NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'resolved', 'ignored')),
  resolved_at timestamp with time zone,
  resolved_by uuid REFERENCES auth.users(id),
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now()
);

-- Create security_scan_results table
CREATE TABLE IF NOT EXISTS public.security_scan_results (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  scan_id text NOT NULL UNIQUE,
  scan_type text NOT NULL DEFAULT 'manual' CHECK (scan_type IN ('manual', 'automated', 'pre_commit')),
  total_files_scanned integer DEFAULT 0,
  violations_found integer DEFAULT 0,
  scan_duration_ms integer DEFAULT 0,
  scan_started_at timestamp with time zone DEFAULT now(),
  scan_completed_at timestamp with time zone,
  initiated_by uuid REFERENCES auth.users(id),
  scan_status text NOT NULL DEFAULT 'running' CHECK (scan_status IN ('running', 'completed', 'failed', 'cancelled')),
  error_message text,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now()
);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_mock_violations_status ON public.mock_data_violations(status);
CREATE INDEX IF NOT EXISTS idx_mock_violations_severity ON public.mock_data_violations(severity);
CREATE INDEX IF NOT EXISTS idx_mock_violations_detected_at ON public.mock_data_violations(detected_at);
CREATE INDEX IF NOT EXISTS idx_security_scans_status ON public.security_scan_results(scan_status);
CREATE INDEX IF NOT EXISTS idx_security_scans_started_at ON public.security_scan_results(scan_started_at);

-- Enable RLS
ALTER TABLE public.mock_data_violations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.security_scan_results ENABLE ROW LEVEL SECURITY;

-- RLS Policies for admin access only
CREATE POLICY "Admin access to mock_data_violations" ON public.mock_data_violations
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.user_roles 
      WHERE user_id = auth.uid() AND role = 'admin'
    )
  );

CREATE POLICY "Admin access to security_scan_results" ON public.security_scan_results
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.user_roles 
      WHERE user_id = auth.uid() AND role = 'admin'
    )
  );

-- Function to automatically update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Triggers for updated_at
CREATE TRIGGER update_mock_violations_updated_at 
  BEFORE UPDATE ON public.mock_data_violations 
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_security_scans_updated_at 
  BEFORE UPDATE ON public.security_scan_results 
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
