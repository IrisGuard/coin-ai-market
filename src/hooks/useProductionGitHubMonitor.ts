
import { useState } from 'react';
import { useMutation, useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

interface GitHubViolation {
  id: string;
  file_path: string;
  line_number: number;
  violation_type: string;
  violation_content: string;
  severity: 'critical' | 'high' | 'medium' | 'low';
  is_resolved: boolean;
  created_at: string;
}

export const useProductionGitHubMonitor = () => {
  const [isScanning, setIsScanning] = useState(false);

  const { data: violations = [], refetch: refetchViolations } = useQuery({
    queryKey: ['github-violations'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('error_logs')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(100);
      
      if (error) throw error;
      
      // Transform error logs to violation format
      return data.map(log => ({
        id: log.id,
        file_path: log.page_url || 'unknown',
        line_number: 1,
        violation_type: log.error_type,
        violation_content: log.message,
        severity: 'low' as const,
        is_resolved: false,
        created_at: log.created_at
      })) as GitHubViolation[];
    }
  });

  const scanGitHubRepository = useMutation({
    mutationFn: async ({ repoOwner, repoName, githubToken }: {
      repoOwner: string;
      repoName: string;
      githubToken: string;
    }) => {
      setIsScanning(true);
      
      // Simulate GitHub scanning
      await new Promise(resolve => setTimeout(resolve, 3000));
      
      // Log the scan activity
      await supabase.from('analytics_events').insert({
        event_type: 'github_repository_scanned',
        page_url: `/github/${repoOwner}/${repoName}`,
        metadata: {
          repo_owner: repoOwner,
          repo_name: repoName,
          scan_time: new Date().toISOString()
        }
      });
      
      setIsScanning(false);
      return { success: true, violations_found: 0 };
    }
  });

  const resolveViolation = useMutation({
    mutationFn: async (violationId: string) => {
      // In a real implementation, this would update the violation status
      await supabase.from('analytics_events').insert({
        event_type: 'github_violation_resolved',
        page_url: '/github/violations',
        metadata: {
          violation_id: violationId,
          resolved_at: new Date().toISOString()
        }
      });
    }
  });

  const activeViolations = violations.filter(v => !v.is_resolved);
  const criticalViolations = activeViolations.filter(v => v.severity === 'critical');
  const highViolations = activeViolations.filter(v => v.severity === 'high');
  const mediumViolations = activeViolations.filter(v => v.severity === 'medium');
  const lowViolations = activeViolations.filter(v => v.severity === 'low');
  const totalViolations = activeViolations.length;

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
    isLoading: false,
    refetchViolations,
    totalViolations,
    isScanning
  };
};
