
-- Create github_violations table for tracking GitHub repository mock data violations
CREATE TABLE IF NOT EXISTS public.github_violations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  repository_owner TEXT NOT NULL,
  repository_name TEXT NOT NULL,
  file_path TEXT NOT NULL,
  line_number INTEGER NOT NULL,
  violation_type TEXT NOT NULL,
  violation_content TEXT NOT NULL,
  severity TEXT NOT NULL CHECK (severity IN ('critical', 'high', 'medium', 'low')),
  status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'resolved', 'ignored')),
  commit_sha TEXT,
  branch_name TEXT DEFAULT 'main',
  detected_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  resolved_at TIMESTAMP WITH TIME ZONE,
  resolved_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_github_violations_repository ON public.github_violations (repository_owner, repository_name);
CREATE INDEX IF NOT EXISTS idx_github_violations_status ON public.github_violations (status);
CREATE INDEX IF NOT EXISTS idx_github_violations_severity ON public.github_violations (severity);
CREATE INDEX IF NOT EXISTS idx_github_violations_detected_at ON public.github_violations (detected_at DESC);

-- Enable RLS
ALTER TABLE public.github_violations ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Admin users can view all github violations" ON public.github_violations
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.user_roles 
      WHERE user_id = auth.uid() AND role = 'admin'
    )
  );

CREATE POLICY "Admin users can insert github violations" ON public.github_violations
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.user_roles 
      WHERE user_id = auth.uid() AND role = 'admin'
    )
  );

CREATE POLICY "Admin users can update github violations" ON public.github_violations
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM public.user_roles 
      WHERE user_id = auth.uid() AND role = 'admin'
    )
  );

-- Create trigger for updated_at
CREATE TRIGGER github_violations_updated_at
  BEFORE UPDATE ON public.github_violations
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Insert initial mock data for testing (will be removed once real scanning is active)
INSERT INTO public.github_violations (
  repository_owner,
  repository_name,
  file_path,
  line_number,
  violation_type,
  violation_content,
  severity,
  status,
  commit_sha,
  branch_name
) VALUES 
(
  'coinai',
  'main-repository',
  'src/hooks/useAnalytics.ts',
  64,
  'math_random',
  'const randomValue = Math.random() * 100;',
  'critical',
  'active',
  'abc123def456',
  'main'
),
(
  'coinai',
  'main-repository',
  'src/components/CategoryNav.tsx',
  145,
  'mock_array',
  'const mockCategories = ["demo", "test"];',
  'high',
  'active',
  'def456ghi789',
  'main'
);
