
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export const useRealGithubMockDataScanner = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ repoOwner, repoName, githubToken }: { 
      repoOwner: string; 
      repoName: string; 
      githubToken: string; 
    }) => {
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
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['github-violations'] });
    }
  });
};

export const useRealGithubViolations = () => {
  return useQuery({
    queryKey: ['github-violations'],
    queryFn: async () => {
      console.log('📋 Fetching REAL GitHub violations...');
      
      const { data, error } = await supabase.functions.invoke('github-mock-scanner', {
        body: { action: 'get_violations' }
      });

      if (error) {
        console.error('❌ Failed to fetch GitHub violations:', error);
        throw error;
      }

      return data.violations || [];
    },
    refetchInterval: 30000
  });
};
