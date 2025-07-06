
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';

export const useDataSourcesManagement = () => {
  const queryClient = useQueryClient();

  const { data: dataSources = [], isLoading: sourcesLoading } = useQuery({
    queryKey: ['admin-data-sources'],
    queryFn: async () => {
      console.log('🔍 Fetching data sources...');
      const { data, error } = await supabase
        .from('data_sources')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) {
        console.error('❌ Error fetching data sources:', error);
        throw error;
      }
      console.log('✅ Data sources loaded:', data?.length || 0);
      return data || [];
    },
  });

  const { data: externalSources = [] } = useQuery({
    queryKey: ['admin-external-sources'],
    queryFn: async () => {
      console.log('🔍 Fetching external sources...');
      const { data, error } = await supabase
        .from('external_price_sources')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) {
        console.error('❌ Error fetching external sources:', error);
        throw error;
      }
      console.log('✅ External sources loaded:', data?.length || 0);
      return data || [];
    },
  });

  const { data: globalCoinSources = [] } = useQuery({
    queryKey: ['admin-global-coin-sources'],
    queryFn: async () => {
      console.log('🔍 Fetching premium global coin sources...');
      const { data, error } = await supabase
        .from('global_coin_sources')
        .select('*')
        .order('priority', { ascending: true });
      
      if (error) {
        console.error('❌ Error fetching global coin sources:', error);
        throw error;
      }
      console.log('✅ Premium global coin sources loaded:', data?.length || 0);
      return data || [];
    },
  });

  const { data: scrapingJobs = [] } = useQuery({
    queryKey: ['admin-scraping-jobs'],
    queryFn: async () => {
      console.log('🔍 Fetching scraping jobs...');
      const { data, error } = await supabase
        .from('scraping_jobs')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(100);
      
      if (error) {
        console.error('❌ Error fetching scraping jobs:', error);
        throw error;
      }
      console.log('✅ Scraping jobs loaded:', data?.length || 0);
      return data || [];
    },
  });

  const { data: sourceStats } = useQuery({
    queryKey: ['admin-source-stats'],
    queryFn: async () => {
      console.log('🔍 Fetching source stats...');
      try {
        const [
          totalDataSources,
          activeDataSources,
          totalExternalSources,
          activeExternalSources,
          totalGlobalSources,
          activeGlobalSources,
          totalScrapingJobs,
          recentJobs
        ] = await Promise.all([
          supabase.from('data_sources').select('id', { count: 'exact', head: true }),
          supabase.from('data_sources').select('id', { count: 'exact', head: true }).eq('is_active', true),
          supabase.from('external_price_sources').select('id', { count: 'exact', head: true }),
          supabase.from('external_price_sources').select('id', { count: 'exact', head: true }).eq('is_active', true),
          supabase.from('global_coin_sources').select('id', { count: 'exact', head: true }),
          supabase.from('global_coin_sources').select('id', { count: 'exact', head: true }).eq('is_active', true),
          supabase.from('scraping_jobs').select('id', { count: 'exact', head: true }),
          supabase.from('scraping_jobs')
            .select('status')
            .gte('created_at', new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString())
        ]);

        const stats = {
          totalDataSources: totalDataSources.count || 0,
          activeDataSources: activeDataSources.count || 0,
          totalExternalSources: totalExternalSources.count || 0,
          activeExternalSources: activeExternalSources.count || 0,
          totalGlobalSources: totalGlobalSources.count || 0,
          activeGlobalSources: activeGlobalSources.count || 0,
          totalScrapingJobs: totalScrapingJobs.count || 0,
          jobsLast24h: recentJobs.count || 0,
        };
        
        console.log('✅ Source stats loaded:', stats);
        return stats;
      } catch (error) {
        console.error('❌ Error fetching source stats:', error);
        return {
          totalDataSources: 0,
          activeDataSources: 0,
          totalExternalSources: 0,
          activeExternalSources: 0,
          totalGlobalSources: 0,
          activeGlobalSources: 0,
          totalScrapingJobs: 0,
          jobsLast24h: 0,
        };
      }
    },
  });

  const updateDataSourceMutation = useMutation({
    mutationFn: async ({ sourceId, updates, tableType }: { sourceId: string; updates: Record<string, any>; tableType: 'data_sources' | 'external_price_sources' }) => {
      console.log(`🔄 Updating ${tableType} with ID ${sourceId}:`, updates);
      
      if (tableType === 'data_sources') {
        const { error } = await supabase
          .from('data_sources')
          .update(updates)
          .eq('id', sourceId);
        if (error) {
          console.error('❌ Error updating data source:', error);
          throw error;
        }
      } else if (tableType === 'external_price_sources') {
        const { error } = await supabase
          .from('external_price_sources')
          .update(updates)
          .eq('id', sourceId);
        if (error) {
          console.error('❌ Error updating external source:', error);
          throw error;
        }
      }
      
      console.log('✅ Source updated successfully');
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-data-sources'] });
      queryClient.invalidateQueries({ queryKey: ['admin-external-sources'] });
      queryClient.invalidateQueries({ queryKey: ['admin-source-stats'] });
      toast({
        title: "Success",
        description: "Data source updated successfully.",
      });
    },
    onError: (error: any) => {
      console.error('❌ Update failed:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to update data source",
        variant: "destructive",
      });
    },
  });

  return {
    dataSources,
    externalSources,
    globalCoinSources,
    scrapingJobs,
    sourceStats,
    sourcesLoading,
    updateDataSourceMutation
  };
};
