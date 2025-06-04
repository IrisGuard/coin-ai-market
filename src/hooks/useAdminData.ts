
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';

export const useAdminCoins = () => {
  return useQuery({
    queryKey: ['admin-coins'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('coins')
        .select(`
          *,
          profiles!inner(
            name,
            email
          )
        `)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data || [];
    },
  });
};

export const useAdminUsers = () => {
  return useQuery({
    queryKey: ['admin-users'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data || [];
    },
  });
};

export const useErrorLogs = () => {
  return useQuery({
    queryKey: ['error-logs'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('error_logs')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data || [];
    },
  });
};

export const useConsoleErrors = () => {
  return useQuery({
    queryKey: ['console-errors'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('console_errors')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data || [];
    },
  });
};

export const useNotifications = () => {
  return useQuery({
    queryKey: ['admin-notifications'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('notifications')
        .select(`
          *,
          profiles!inner(
            name,
            email
          )
        `)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data || [];
    },
  });
};

export const useTransactions = () => {
  return useQuery({
    queryKey: ['admin-transactions'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('transactions')
        .select(`
          *,
          seller:profiles!transactions_seller_id_fkey(
            name,
            email
          ),
          buyer:profiles!transactions_buyer_id_fkey(
            name,
            email
          ),
          coins!inner(
            name,
            image
          )
        `)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data || [];
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
          data_sources!scraping_jobs_source_id_fkey(
            name
          ),
          vpn_proxies!scraping_jobs_proxy_id_fkey(
            name,
            country_code
          )
        `)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data || [];
    },
  });
};

export const useMarketplaceStats = () => {
  return useQuery({
    queryKey: ['marketplace-stats'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('marketplace_stats')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(1)
        .maybeSingle();
      
      if (error) {
        // Return default stats if no data exists
        return {
          registered_users: 0,
          listed_coins: 0,
          active_auctions: 0,
          total_volume: 0,
          weekly_transactions: 0
        };
      }
      return data || {
        registered_users: 0,
        listed_coins: 0,
        active_auctions: 0,
        total_volume: 0,
        weekly_transactions: 0
      };
    },
  });
};

export const useApiKeys = () => {
  return useQuery({
    queryKey: ['api-keys'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('api_keys')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data || [];
    },
  });
};

export const useApiKeyCategories = () => {
  return useQuery({
    queryKey: ['api-key-categories'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('api_key_categories')
        .select('*')
        .order('name', { ascending: true });
      
      if (error) throw error;
      return data || [];
    },
  });
};

export const useUpdateCoinStatus = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ coinId, status }: { coinId: string; status: string }) => {
      const { error } = await supabase
        .from('coins')
        .update({ authentication_status: status })
        .eq('id', coinId);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-coins'] });
      toast({
        title: "Status Updated",
        description: "Coin status has been updated successfully.",
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

export const useUpdateUserStatus = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ userId, verified }: { userId: string; verified: boolean }) => {
      const { error } = await supabase
        .from('profiles')
        .update({ verified_dealer: verified })
        .eq('id', userId);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-users'] });
      toast({
        title: "User Updated",
        description: "User status has been updated successfully.",
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

export const useCreateApiKey = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (keyData: {
      key_name: string;
      encrypted_value: string;
      description?: string;
      category_id?: string | null;
    }) => {
      const { data: { user } } = await supabase.auth.getUser();
      
      const { data, error } = await supabase
        .from('api_keys')
        .insert([{ 
          ...keyData,
          created_by: user?.id
        }])
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['api-keys'] });
      toast({
        title: "API Key Created",
        description: "API key has been created successfully.",
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

export const useBulkCreateApiKeys = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (keysData: Array<{
      name: string;
      value: string;
      description?: string;
      category_id?: string | null;
    }>) => {
      const { data: { user } } = await supabase.auth.getUser();
      
      const formattedKeys = keysData.map(key => ({
        key_name: key.name,
        encrypted_value: key.value,
        description: key.description,
        created_by: user?.id
      }));
      
      const { data, error } = await supabase
        .from('api_keys')
        .insert(formattedKeys)
        .select();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['api-keys'] });
      toast({
        title: "API Keys Imported",
        description: "API keys have been imported successfully.",
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

// Aliases for backward compatibility
export const useAdminNotifications = useNotifications;
export const useAdminTransactions = useTransactions;
