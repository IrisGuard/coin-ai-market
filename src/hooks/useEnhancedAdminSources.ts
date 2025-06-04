
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';

// Hook for source categories
export const useSourceCategories = () => {
  return useQuery({
    queryKey: ['source-categories'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('source_categories')
        .select('*')
        .order('name', { ascending: true });
      
      if (error) throw error;
      return data;
    },
  });
};

// Hook for source templates
export const useSourceTemplates = () => {
  return useQuery({
    queryKey: ['source-templates'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('source_templates')
        .select('*')
        .order('name', { ascending: true });
      
      if (error) throw error;
      return data;
    },
  });
};

// Hook for geographic regions
export const useGeographicRegions = () => {
  return useQuery({
    queryKey: ['geographic-regions'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('geographic_regions')
        .select('*')
        .order('name', { ascending: true });
      
      if (error) throw error;
      return data;
    },
  });
};

// Hook for source performance metrics
export const useSourcePerformanceMetrics = (sourceId?: string) => {
  return useQuery({
    queryKey: ['source-performance-metrics', sourceId],
    queryFn: async () => {
      let query = supabase
        .from('source_performance_metrics')
        .select(`
          *,
          external_price_sources(source_name)
        `)
        .order('date', { ascending: false });

      if (sourceId) {
        query = query.eq('source_id', sourceId);
      }

      const { data, error } = await query.limit(30);
      
      if (error) throw error;
      return data;
    },
  });
};

// Enhanced external price sources with joins
export const useEnhancedExternalSources = () => {
  return useQuery({
    queryKey: ['enhanced-external-sources'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('external_price_sources')
        .select(`
          *,
          source_categories(name, icon),
          geographic_regions(name, code, continent),
          source_templates(name, description)
        `)
        .order('priority_score', { ascending: false });
      
      if (error) throw error;
      return data;
    },
  });
};

// Mutation for bulk source import
export const useBulkImportSources = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (sourcesData: any[]) => {
      const { data, error } = await supabase.rpc('bulk_import_sources', {
        sources_data: sourcesData
      });
      
      if (error) throw error;
      return data;
    },
    onSuccess: (result) => {
      queryClient.invalidateQueries({ queryKey: ['enhanced-external-sources'] });
      queryClient.invalidateQueries({ queryKey: ['external-price-sources'] });
      
      toast({
        title: "Bulk Import Completed",
        description: `Successfully imported ${result[0]?.imported_count || 0} sources. ${result[0]?.failed_count || 0} failed.`,
      });
    },
    onError: (error: any) => {
      toast({
        title: "Import Failed",
        description: error.message,
        variant: "destructive",
      });
    },
  });
};

// Hook for AI source discovery
export const useAISourceDiscovery = () => {
  return useMutation({
    mutationFn: async (searchParams: {
      query: string;
      region?: string;
      category?: string;
      limit?: number;
    }) => {
      const { data, error } = await supabase.functions.invoke('ai-source-discovery', {
        body: searchParams
      });
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      toast({
        title: "AI Discovery Complete",
        description: "New potential sources have been identified.",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Discovery Failed",
        description: error.message,
        variant: "destructive",
      });
    },
  });
};

// Predefined global sources data
export const getGlobalSourcesData = () => {
  return [
    // Major Auction Houses
    {
      source_name: "Heritage Auctions",
      source_type: "auction",
      base_url: "https://coins.ha.com",
      category_name: "Auction Houses",
      region_name: "North America",
      template_name: "Auction House Standard",
      requires_proxy: false,
      rate_limit_per_hour: 100,
      priority_score: 95,
      supported_currencies: ["USD"],
      market_focus: ["rare_coins", "ancient", "modern"]
    },
    {
      source_name: "Stack's Bowers",
      source_type: "auction",
      base_url: "https://www.stacksbowers.com",
      category_name: "Auction Houses",
      region_name: "North America",
      template_name: "Auction House Standard",
      requires_proxy: false,
      rate_limit_per_hour: 60,
      priority_score: 90,
      supported_currencies: ["USD"],
      market_focus: ["rare_coins", "ancient", "world"]
    },
    {
      source_name: "Künker Auctions",
      source_type: "auction",
      base_url: "https://www.kuenker.de",
      category_name: "Auction Houses",
      region_name: "Europe",
      template_name: "Auction House Standard",
      requires_proxy: true,
      rate_limit_per_hour: 50,
      priority_score: 85,
      supported_currencies: ["EUR", "USD"],
      market_focus: ["world", "ancient", "medieval"]
    },
    {
      source_name: "Baldwin's Auctions",
      source_type: "auction",
      base_url: "https://www.baldwin.co.uk",
      category_name: "Auction Houses",
      region_name: "Europe",
      template_name: "Auction House Standard",
      requires_proxy: true,
      rate_limit_per_hour: 40,
      priority_score: 80,
      supported_currencies: ["GBP", "USD", "EUR"],
      market_focus: ["british", "world", "ancient"]
    },
    
    // Online Marketplaces
    {
      source_name: "eBay Coins",
      source_type: "marketplace",
      base_url: "https://www.ebay.com/sch/Coins-Paper-Money",
      category_name: "Online Marketplaces",
      region_name: "North America",
      template_name: "E-commerce Marketplace",
      requires_proxy: true,
      rate_limit_per_hour: 200,
      priority_score: 75,
      supported_currencies: ["USD", "EUR", "GBP"],
      market_focus: ["general", "rare_coins", "world"]
    },
    {
      source_name: "Vcoins",
      source_type: "marketplace",
      base_url: "https://www.vcoins.com",
      category_name: "Online Marketplaces",
      region_name: "North America",
      template_name: "E-commerce Marketplace",
      requires_proxy: false,
      rate_limit_per_hour: 80,
      priority_score: 85,
      supported_currencies: ["USD"],
      market_focus: ["ancient", "world", "rare_coins"]
    },
    {
      source_name: "MA-Shops",
      source_type: "marketplace",
      base_url: "https://www.ma-shops.com",
      category_name: "Online Marketplaces",
      region_name: "Europe",
      template_name: "E-commerce Marketplace",
      requires_proxy: true,
      rate_limit_per_hour: 60,
      priority_score: 70,
      supported_currencies: ["EUR", "USD"],
      market_focus: ["world", "ancient", "medieval"]
    },
    
    // Professional Dealers
    {
      source_name: "PCGS CoinFacts",
      source_type: "reference",
      base_url: "https://www.pcgs.com/coinfacts",
      category_name: "Reference Guides",
      region_name: "North America",
      template_name: "Reference Database",
      requires_proxy: false,
      rate_limit_per_hour: 120,
      priority_score: 95,
      supported_currencies: ["USD"],
      market_focus: ["grading", "pricing", "reference"]
    },
    {
      source_name: "NGC Coin Explorer",
      source_type: "reference",
      base_url: "https://www.ngccoin.com/coin-explorer",
      category_name: "Reference Guides",
      region_name: "North America",
      template_name: "Reference Database",
      requires_proxy: false,
      rate_limit_per_hour: 100,
      priority_score: 95,
      supported_currencies: ["USD"],
      market_focus: ["grading", "pricing", "reference"]
    },
    {
      source_name: "CoinArchives",
      source_type: "reference",
      base_url: "https://www.coinarchives.com",
      category_name: "Reference Guides",
      region_name: "North America",
      template_name: "Reference Database",
      requires_proxy: false,
      rate_limit_per_hour: 80,
      priority_score: 90,
      supported_currencies: ["USD"],
      market_focus: ["auction_results", "historical", "reference"]
    },
    
    // Asian Markets
    {
      source_name: "Spink Auctions",
      source_type: "auction",
      base_url: "https://www.spink.com",
      category_name: "Auction Houses",
      region_name: "Asia Pacific",
      template_name: "Auction House Standard",
      requires_proxy: true,
      rate_limit_per_hour: 40,
      priority_score: 80,
      supported_currencies: ["USD", "GBP", "HKD"],
      market_focus: ["asian", "world", "banknotes"]
    },
    {
      source_name: "Noble Numismatics",
      source_type: "auction",
      base_url: "https://www.noble.com.au",
      category_name: "Auction Houses",
      region_name: "Asia Pacific",
      template_name: "Auction House Standard",
      requires_proxy: true,
      rate_limit_per_hour: 30,
      priority_score: 75,
      supported_currencies: ["AUD", "USD"],
      market_focus: ["australian", "world"]
    }
  ];
};
