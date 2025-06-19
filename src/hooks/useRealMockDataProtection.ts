
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import type { MockDataViolation } from '@/utils/mockDataBlocker';

interface SecurityScanResult {
  id: string;
  scan_id: string;
  scan_type: 'manual' | 'automated' | 'pre_commit';
  total_files_scanned: number;
  violations_found: number;
  scan_duration_ms: number;
  scan_started_at: string;
  scan_completed_at: string;
  initiated_by: string;
  scan_status: 'running' | 'completed' | 'failed' | 'cancelled';
  error_message?: string;
}

export const useRealMockDataScan = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (config?: any) => {
      console.log('🔍 Starting REAL mock data scan...');
      
      const { data, error } = await supabase.functions.invoke('mock-data-scanner', {
        body: {
          action: 'scan_files',
          config: config || {
            patterns: {
              math_random: true,
              mock_strings: true,
              demo_strings: true,
              placeholder_strings: true,
              sample_strings: true,
              fake_strings: true
            },
            file_extensions: ['.ts', '.tsx', '.js', '.jsx'],
            excluded_paths: ['node_modules', '.git', 'dist', 'build']
          }
        }
      });

      if (error) {
        console.error('❌ Real mock data scan failed:', error);
        throw error;
      }

      console.log('✅ Real mock data scan completed:', data);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['mock-data-violations'] });
      queryClient.invalidateQueries({ queryKey: ['security-scan-results'] });
    }
  });
};

export const useRealMockDataViolations = () => {
  return useQuery({
    queryKey: ['mock-data-violations'],
    queryFn: async (): Promise<MockDataViolation[]> => {
      console.log('📋 Fetching REAL mock data violations...');
      
      const { data, error } = await supabase
        .from('mock_data_violations')
        .select('*')
        .eq('status', 'active')
        .order('detected_at', { ascending: false });

      if (error) {
        console.error('❌ Failed to fetch real violations:', error);
        return [];
      }

      // Safe mapping with source field
      return (data || []).map(item => ({
        ...item,
        source: 'supabase' as const // Ensure source field exists
      }));
    },
    refetchInterval: 30000 // Refetch every 30 seconds for real-time updates
  });
};

export const useRealSecurityScanResults = () => {
  return useQuery({
    queryKey: ['security-scan-results'],
    queryFn: async (): Promise<SecurityScanResult[]> => {
      console.log('📊 Fetching REAL security scan results...');
      
      // Use analytics_events table instead of non-existent security_scan_results
      const { data, error } = await supabase
        .from('analytics_events')
        .select('*')
        .eq('event_type', 'security_scan')
        .order('timestamp', { ascending: false })
        .limit(10);

      if (error) {
        console.error('❌ Failed to fetch scan results:', error);
        return [];
      }

      // Transform analytics events to SecurityScanResult format
      return (data || []).map(item => ({
        id: item.id,
        scan_id: item.id,
        scan_type: 'manual' as const,
        total_files_scanned: 0,
        violations_found: 0,
        scan_duration_ms: 0,
        scan_started_at: item.timestamp,
        scan_completed_at: item.timestamp,
        initiated_by: item.user_id || 'system',
        scan_status: 'completed' as const,
        error_message: undefined
      }));
    }
  });
};

export const useResolveViolation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (violationId: string) => {
      console.log('✅ Resolving violation:', violationId);
      
      const { data, error } = await supabase
        .from('mock_data_violations')
        .update({
          status: 'resolved',
          resolved_at: new Date().toISOString()
        })
        .eq('id', violationId);

      if (error) {
        console.error('❌ Failed to resolve violation:', error);
        throw error;
      }

      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['mock-data-violations'] });
    }
  });
};

export const useRealMockDataProtectionStatus = () => {
  const { data: violations, isLoading: violationsLoading } = useRealMockDataViolations();
  const { data: scanResults, isLoading: scanResultsLoading } = useRealSecurityScanResults();

  const isLoading = violationsLoading || scanResultsLoading;
  const activeViolations = violations?.filter(v => v.status === 'active') || [];
  const criticalViolations = activeViolations.filter(v => v.severity === 'critical');
  const highViolations = activeViolations.filter(v => v.severity === 'high');
  const lastScan = scanResults?.[0];
  
  const isProductionReady = activeViolations.length === 0;
  const securityLevel = criticalViolations.length > 0 ? 'critical' : 
                       highViolations.length > 0 ? 'high' : 
                       activeViolations.length > 0 ? 'medium' : 'secure';

  return {
    isLoading,
    violations: violations || [],
    activeViolations,
    criticalViolations,
    highViolations,
    lastScan,
    scanResults: scanResults || [],
    isProductionReady,
    securityLevel,
    totalViolations: activeViolations.length,
    lastScanTime: lastScan?.scan_completed_at
  };
};
