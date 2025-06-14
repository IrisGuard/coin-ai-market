
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';

export const useEnhancedExternalSources = () => {
  return useQuery({
    queryKey: ['enhanced-external-sources'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('external_price_sources')
        .select(`
          *,
          geographic_regions!external_price_sources_region_id_fkey (
            name
          )
        `)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data || [];
    },
  });
};

export const useBulkImportSources = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (sourcesData: Array<{
      base_url: string;
      source_name: string;
      source_type: string;
      category_id?: string;
      region_id?: string;
      priority_score?: number;
      rate_limit_per_hour?: number;
      reliability_score?: number;
    }>) => {
      const { data, error } = await supabase
        .from('external_price_sources')
        .insert(sourcesData)
        .select();
      
      if (error) throw error;
      return [{
        imported_count: data?.length || 0,
        failed_count: 0,
        errors: []
      }];
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['enhanced-external-sources'] });
      toast({
        title: "Sources Imported",
        description: "Sources have been imported successfully.",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: error.message || 'An error occurred',
        variant: "destructive",
      });
    },
  });
};
