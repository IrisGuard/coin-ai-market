
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';

export const useDataSources = () => {
  return useQuery({
    queryKey: ['data-sources'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('data_sources')
        .select('*')
        .order('priority', { ascending: true });
      
      if (error) throw error;
      return data;
    },
  });
};

export const useVPNProxies = () => {
  return useQuery({
    queryKey: ['vpn-proxies'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('vpn_proxies')
        .select('*')
        .order('success_rate', { ascending: false });
      
      if (error) throw error;
      return data;
    },
  });
};

export const useScrapingJobs = () => {
  return useQuery({
    queryKey: ['scraping-jobs'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('scraping_jobs')
        .select(`
          *,
          data_sources(name),
          vpn_proxies(name, country_code)
        `)
        .order('created_at', { ascending: false })
        .limit(50);
      
      if (error) throw error;
      return data;
    },
  });
};

export const useCoinDataCache = () => {
  return useQuery({
    queryKey: ['coin-data-cache'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('coin_data_cache')
        .select('*')
        .order('last_updated', { ascending: false });
      
      if (error) throw error;
      return data;
    },
  });
};

export const useStaticCoinsDB = () => {
  return useQuery({
    queryKey: ['static-coins-db'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('static_coins_db')
        .select('*')
        .order('name', { ascending: true });
      
      if (error) throw error;
      return data;
    },
  });
};

export const useCreateScrapingJob = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (jobData: {
      source_id: string;
      proxy_id?: string;
      target_url: string;
      job_type: string;
    }) => {
      const { data, error } = await supabase
        .from('scraping_jobs')
        .insert(jobData)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['scraping-jobs'] });
      toast({
        title: "Scraping Job Created",
        description: "Web scraping job has been queued successfully.",
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

export const useUpdateDataSource = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ id, updates }: { id: string; updates: any }) => {
      const { error } = await supabase
        .from('data_sources')
        .update(updates)
        .eq('id', id);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['data-sources'] });
      toast({
        title: "Data Source Updated",
        description: "Data source configuration has been updated.",
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

// Enhanced scraping job with external sources
export const useCreateAdvancedScrapingJob = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (jobData: {
      target_url: string;
      job_type: string;
      proxy_config?: any;
    }) => {
      const { data, error } = await supabase.functions.invoke('advanced-scraper', {
        body: {
          target_url: jobData.target_url,
          job_type: jobData.job_type,
          proxy_config: jobData.proxy_config
        }
      });
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['scraping-jobs'] });
      queryClient.invalidateQueries({ queryKey: ['coin-data-cache'] });
      toast({
        title: "Advanced Scraping Started",
        description: "Enhanced scraping job with AI analysis has been started.",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Scraping Failed",
        description: error.message,
        variant: "destructive",
      });
    },
  });
};
