
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';

export const useExternalSourcesManagement = () => {
  return useQuery({
    queryKey: ['external-sources-management'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('external_price_sources')
        .select(`
          *,
          geographic_regions!external_price_sources_region_id_fkey (
            name,
            code
          )
        `)
        .order('priority_score', { ascending: false });
      
      if (error) throw error;
      return data || [];
    },
  });
};

export const useSourceTesting = () => {
  return useMutation({
    mutationFn: async ({ sourceId, testUrl }: { sourceId: string; testUrl: string }) => {
      try {
        // Test the source connection
        const testResponse = await fetch(testUrl, {
          method: 'HEAD',
          mode: 'no-cors'
        });
        
        // Update source status
        const { error } = await supabase
          .from('external_price_sources')
          .update({ 
            last_tested: new Date().toISOString(),
            is_active: true
          })
          .eq('id', sourceId);
        
        if (error) throw error;
        
        return { success: true, status: 'connected' };
      } catch (error) {
        // Update source as inactive if test fails
        await supabase
          .from('external_price_sources')
          .update({ 
            last_tested: new Date().toISOString(),
            is_active: false
          })
          .eq('id', sourceId);
        
        throw error;
      }
    },
    onSuccess: () => {
      toast({
        title: "Source Test Successful",
        description: "External source connection is working properly.",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Source Test Failed",
        description: error.message || 'Connection test failed',
        variant: "destructive",
      });
    },
  });
};

export const useDataAggregation = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (coinIdentifier: string) => {
      const { data, error } = await supabase.functions.invoke('coin-data-aggregator', {
        body: { 
          coin_identifier: coinIdentifier,
          include_sources: ['external_apis', 'static_db', 'scraping_cache']
        }
      });

      if (error) throw error;
      return data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['aggregated-prices'] });
      toast({
        title: "Data Aggregated",
        description: `Successfully gathered data from ${data.sources_used?.length || 0} sources.`,
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Aggregation Error",
        description: error.message || 'Data aggregation failed',
        variant: "destructive",
      });
    },
  });
};

export const useCreateExternalSource = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (sourceData: {
      source_name: string;
      base_url: string;
      source_type: string;
      api_key?: string;
      rate_limit_per_hour?: number;
      priority_score?: number;
    }) => {
      const { data, error } = await supabase
        .from('external_price_sources')
        .insert(sourceData)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['external-sources-management'] });
      toast({
        title: "Source Added",
        description: "External source has been configured successfully.",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: error.message || 'Failed to add source',
        variant: "destructive",
      });
    },
  });
};

export const useUpdateExternalSource = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ id, updates }: { id: string; updates: Record<string, any> }) => {
      const { error } = await supabase
        .from('external_price_sources')
        .update(updates)
        .eq('id', id);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['external-sources-management'] });
      toast({
        title: "Source Updated",
        description: "External source has been updated successfully.",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: error.message || 'Failed to update source',
        variant: "destructive",
      });
    },
  });
};

export const useBulkSourceImport = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (sourcesData: Array<{
      source_name: string;
      base_url: string;
      source_type: string;
      priority_score?: number;
    }>) => {
      const { data, error } = await supabase
        .from('external_price_sources')
        .insert(sourcesData)
        .select();
      
      if (error) throw error;
      return data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['external-sources-management'] });
      toast({
        title: "Bulk Import Complete",
        description: `Successfully imported ${data?.length || 0} external sources.`,
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Import Failed",
        description: error.message || 'Bulk import failed',
        variant: "destructive",
      });
    },
  });
};
