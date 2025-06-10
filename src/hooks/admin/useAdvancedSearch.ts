
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';

export const useSearchAnalytics = () => {
  return useQuery({
    queryKey: ['search-analytics'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('search_analytics')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(100);
      
      if (error) throw error;
      return data || [];
    },
  });
};

export const useAISearchFilters = () => {
  return useQuery({
    queryKey: ['ai-search-filters'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('ai_search_filters')
        .select('*')
        .eq('is_active', true)
        .order('usage_count', { ascending: false });
      
      if (error) throw error;
      return data || [];
    },
  });
};

export const useCreateAISearchFilter = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (filterData: {
      filter_name: string;
      filter_type: string;
      ai_prompt: string;
      confidence_threshold?: number;
    }) => {
      const { data, error } = await supabase
        .from('ai_search_filters')
        .insert(filterData)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['ai-search-filters'] });
      toast({
        title: "Success",
        description: "AI search filter created successfully.",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: `Failed to create AI search filter: ${error.message}`,
        variant: "destructive",
      });
    },
  });
};

export const useRecordSearchAnalytics = () => {
  return useMutation({
    mutationFn: async (searchData: {
      search_query: string;
      filters_applied?: any;
      results_count: number;
      clicked_results?: any;
      search_duration_ms?: number;
    }) => {
      const { data, error } = await supabase
        .from('search_analytics')
        .insert(searchData)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
  });
};
