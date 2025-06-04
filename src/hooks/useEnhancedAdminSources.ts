
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';

export const useSourceTemplates = () => {
  return useQuery({
    queryKey: ['source-templates'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('source_templates')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data || [];
    },
  });
};

export const useSourceCategories = () => {
  return useQuery({
    queryKey: ['source-categories'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('source_categories')
        .select('*')
        .order('name', { ascending: true });
      
      if (error) throw error;
      return data || [];
    },
  });
};

export const useGeographicRegions = () => {
  return useQuery({
    queryKey: ['geographic-regions'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('geographic_regions')
        .select('*')
        .order('name', { ascending: true });
      
      if (error) throw error;
      return data || [];
    },
  });
};

export const useSourcePerformanceMetrics = () => {
  return useQuery({
    queryKey: ['source-performance-metrics'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('source_performance_metrics')
        .select(`
          *,
          external_price_sources!source_performance_metrics_source_id_fkey (
            source_name,
            source_type
          )
        `)
        .order('date', { ascending: false });
      
      if (error) throw error;
      return data || [];
    },
  });
};

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

export const useCreateSourceTemplate = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (templateData: {
      name: string;
      description?: string;
      supported_features?: string[];
      default_config?: any;
      template_config?: any;
    }) => {
      const { data, error } = await supabase
        .from('source_templates')
        .insert(templateData)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['source-templates'] });
      toast({
        title: "Template Created",
        description: "Source template has been created successfully.",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    },
  });
};

export const useUpdateSourceTemplate = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ id, updates }: { id: string; updates: any }) => {
      const { error } = await supabase
        .from('source_templates')
        .update(updates)
        .eq('id', id);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['source-templates'] });
      toast({
        title: "Template Updated",
        description: "Source template has been updated successfully.",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    },
  });
};

export const useBulkImportSources = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (sourcesData: any[]) => {
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
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    },
  });
};

export const getGlobalSourcesData = () => {
  return [
    {
      source_name: "Heritage Auctions",
      source_type: "auction",
      base_url: "https://coins.ha.com",
      category_name: "Auction Houses",
      region_name: "North America",
      template_name: "Heritage Template",
      requires_proxy: false,
      rate_limit_per_hour: 60,
      priority_score: 90,
      supported_currencies: ["USD"],
      market_focus: ["rare_coins", "error_coins"]
    },
    {
      source_name: "Stack's Bowers",
      source_type: "auction",
      base_url: "https://www.stacksbowers.com",
      category_name: "Auction Houses",
      region_name: "North America",
      template_name: "Stack's Template",
      requires_proxy: false,
      rate_limit_per_hour: 60,
      priority_score: 85,
      supported_currencies: ["USD"],
      market_focus: ["rare_coins", "ancient_coins"]
    },
    {
      source_name: "PCGS Price Guide",
      source_type: "price_guide",
      base_url: "https://www.pcgs.com/prices",
      category_name: "Reference Guides",
      region_name: "North America",
      template_name: "PCGS Template",
      requires_proxy: false,
      rate_limit_per_hour: 120,
      priority_score: 95,
      supported_currencies: ["USD"],
      market_focus: ["graded_coins"]
    },
    {
      source_name: "NGC Price Guide",
      source_type: "price_guide",
      base_url: "https://www.ngccoin.com/price-guide",
      category_name: "Reference Guides",
      region_name: "North America",
      template_name: "NGC Template",
      requires_proxy: false,
      rate_limit_per_hour: 120,
      priority_score: 95,
      supported_currencies: ["USD"],
      market_focus: ["graded_coins"]
    },
    {
      source_name: "eBay Sold Listings",
      source_type: "marketplace",
      base_url: "https://www.ebay.com",
      category_name: "Marketplaces",
      region_name: "Global",
      template_name: "eBay Template",
      requires_proxy: true,
      rate_limit_per_hour: 30,
      priority_score: 70,
      supported_currencies: ["USD", "EUR", "GBP"],
      market_focus: ["general", "error_coins"]
    },
    {
      source_name: "CoinWorld",
      source_type: "news",
      base_url: "https://www.coinworld.com",
      category_name: "News & Analysis",
      region_name: "North America",
      template_name: "News Template",
      requires_proxy: false,
      rate_limit_per_hour: 60,
      priority_score: 60,
      supported_currencies: ["USD"],
      market_focus: ["market_analysis"]
    }
  ];
};
