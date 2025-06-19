
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

interface GitHubViolation {
  id: string;
  file_path: string;
  line_number: number;
  violation_type: string;
  violation_content: string;
  severity: 'critical' | 'high' | 'medium' | 'low';
  status: 'active' | 'resolved';
  detected_at: string;
  context?: string;
}

interface ScanResult {
  violations: GitHubViolation[];
  totalFiles: number;
  violationFiles: number;
  scanDuration: number;
  timestamp: string;
}

export const useRealTimeGithubScanner = () => {
  const queryClient = useQueryClient();

  const scanGitHubRepository = useMutation({
    mutationFn: async ({ repoOwner, repoName, githubToken }: { 
      repoOwner: string; 
      repoName: string; 
      githubToken: string; 
    }): Promise<ScanResult> => {
      console.log('🔍 Starting REAL GitHub repository scan...');
      
      const { data, error } = await supabase.functions.invoke('github-mock-scanner', {
        body: {
          action: 'scan_github_repo',
          repoOwner,
          repoName,
          githubToken
        }
      });

      if (error) {
        console.error('❌ GitHub scan failed:', error);
        throw error;
      }

      console.log('✅ GitHub scan completed:', data);
      return data.result;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['github-violations'] });
      queryClient.invalidateQueries({ queryKey: ['scan-results'] });
    }
  });

  const { data: violations = [], isLoading: violationsLoading, refetch: refetchViolations } = useQuery({
    queryKey: ['github-violations'],
    queryFn: async (): Promise<GitHubViolation[]> => {
      console.log('📋 Fetching GitHub violations...');
      
      const { data, error } = await supabase.functions.invoke('github-mock-scanner', {
        body: { action: 'get_violations' }
      });

      if (error) {
        console.error('❌ Failed to fetch violations:', error);
        throw error;
      }

      return data.violations || [];
    },
    refetchInterval: 10000 // Real-time updates every 10 seconds
  });

  const resolveViolation = useMutation({
    mutationFn: async (violationId: string) => {
      const { data, error } = await supabase.functions.invoke('github-mock-scanner', {
        body: {
          action: 'resolve_violation',
          violationId
        }
      });

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['github-violations'] });
    }
  });

  // Get real-time statistics
  const activeViolations = violations.filter(v => v.status === 'active');
  const criticalViolations = activeViolations.filter(v => v.severity === 'critical');
  const highViolations = activeViolations.filter(v => v.severity === 'high');
  const mediumViolations = activeViolations.filter(v => v.severity === 'medium');
  const lowViolations = activeViolations.filter(v => v.severity === 'low');

  const violationsByType = activeViolations.reduce((acc, violation) => {
    acc[violation.violation_type] = (acc[violation.violation_type] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  return {
    scanGitHubRepository,
    violations,
    activeViolations,
    criticalViolations,
    highViolations,
    mediumViolations,
    lowViolations,
    violationsByType,
    resolveViolation,
    isLoading: violationsLoading,
    refetchViolations,
    totalViolations: activeViolations.length,
    isScanning: scanGitHubRepository.isPending
  };
};
