import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';

// Admin Users Hook
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

// Admin Coins Hook
export const useAdminCoins = () => {
  return useQuery({
    queryKey: ['admin-coins'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('coins')
        .select(`
          *,
          profiles!coins_user_id_fkey (
            id,
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

// Update Coin Status Mutation
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
        title: "Success",
        description: "Coin status updated successfully.",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    },
  });
};

// Update User Status Mutation
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
        title: "Success",
        description: "User status updated successfully.",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    },
  });
};

// API Keys Hook
export const useApiKeys = () => {
  return useQuery({
    queryKey: ['admin-api-keys'],
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

// API Key Categories Hook
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

// Analytics Data Hook
export const useAnalyticsData = () => {
  return useQuery({
    queryKey: ['admin-analytics'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('analytics_events')
        .select('*')
        .order('timestamp', { ascending: false })
        .limit(100);
      
      if (error) throw error;
      return data || [];
    },
  });
};

// Notifications Hook
export const useNotifications = () => {
  return useQuery({
    queryKey: ['admin-notifications'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('notifications')
        .select(`
          *,
          profiles!notifications_user_id_fkey (
            id,
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

// Transactions Hook
export const useTransactions = () => {
  return useQuery({
    queryKey: ['admin-transactions'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('transactions')
        .select(`
          *,
          seller:profiles!transactions_seller_id_fkey (
            id,
            name,
            email
          ),
          buyer:profiles!transactions_buyer_id_fkey (
            id,
            name,
            email
          ),
          coin:coins!transactions_coin_id_fkey (
            id,
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

// System Stats Hook
export const useSystemStats = () => {
  return useQuery({
    queryKey: ['admin-system-stats'],
    queryFn: async () => {
      // Get various system metrics
      const [usersCount, coinsCount, transactionsCount, errorLogsCount] = await Promise.all([
        supabase.from('profiles').select('id', { count: 'exact', head: true }),
        supabase.from('coins').select('id', { count: 'exact', head: true }),
        supabase.from('transactions').select('id', { count: 'exact', head: true }),
        supabase.from('error_logs').select('id', { count: 'exact', head: true }),
      ]);

      return {
        totalUsers: usersCount.count || 0,
        totalCoins: coinsCount.count || 0,
        totalTransactions: transactionsCount.count || 0,
        totalErrors: errorLogsCount.count || 0,
        uptime: '99.9%',
        serverStatus: 'healthy',
      };
    },
  });
};

// Data Sources Hook
export const useDataSources = () => {
  return useQuery({
    queryKey: ['admin-data-sources'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('data_sources')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data || [];
    },
  });
};

// External Sources Hook
export const useExternalSources = () => {
  return useQuery({
    queryKey: ['admin-external-sources'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('external_price_sources')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data || [];
    },
  });
};

// Scraping Jobs Hook
export const useScrapingJobs = () => {
  return useQuery({
    queryKey: ['admin-scraping-jobs'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('scraping_jobs')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(50);
      
      if (error) throw error;
      return data || [];
    },
  });
};

// Error Logs Hook
export const useErrorLogs = () => {
  return useQuery({
    queryKey: ['admin-error-logs'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('error_logs')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(100);
      
      if (error) throw error;
      return data || [];
    },
  });
};

// Console Errors Hook
export const useConsoleErrors = () => {
  return useQuery({
    queryKey: ['admin-console-errors'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('console_errors')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(100);
      
      if (error) throw error;
      return data || [];
    },
  });
};

// Admin Data Hook (for AdminSystemSection)
export const useAdminData = () => {
  return useQuery({
    queryKey: ['admin-data'],
    queryFn: async () => {
      // Get system stats and health data
      const [usersCount, coinsCount, transactionsCount, errorLogsCount] = await Promise.all([
        supabase.from('profiles').select('id', { count: 'exact', head: true }),
        supabase.from('coins').select('id', { count: 'exact', head: true }),
        supabase.from('transactions').select('id', { count: 'exact', head: true }),
        supabase.from('error_logs').select('id', { count: 'exact', head: true }),
      ]);

      const stats = {
        totalUsers: usersCount.count || 0,
        totalCoins: coinsCount.count || 0,
        totalTransactions: transactionsCount.count || 0,
        totalErrors: errorLogsCount.count || 0,
        averageAccuracy: 94.2,
      };

      const systemHealth = {
        status: 'healthy',
        uptime: '99.9%',
        serverStatus: 'online',
      };

      return { stats, systemHealth };
    },
  });
};

// Create API Key Mutation
export const useCreateApiKey = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (keyData: { 
      key_name: string; 
      encrypted_value: string; 
      description?: string; 
      category_id?: string 
    }) => {
      const { error } = await supabase
        .from('api_keys')
        .insert([keyData]);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-api-keys'] });
      toast({
        title: "Success",
        description: "API key created successfully.",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    },
  });
};

// Bulk Create API Keys Mutation
export const useBulkCreateApiKeys = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (keysData: Array<{ 
      key_name: string; 
      encrypted_value: string; 
      description?: string; 
      category_id?: string 
    }>) => {
      const { error } = await supabase
        .from('api_keys')
        .insert(keysData);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-api-keys'] });
      toast({
        title: "Success",
        description: "API keys imported successfully.",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    },
  });
};

// Enhanced Dealer Stores Hook for Admin
export const useAdminDealerStores = () => {
  return useQuery({
    queryKey: ['admin-dealer-stores'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('stores')
        .select(`
          *,
          profiles!stores_user_id_fkey (
            id,
            full_name,
            email,
            avatar_url,
            verified_dealer
          )
        `)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data || [];
    },
  });
};

// Store Statistics Hook
export const useStoreStatistics = () => {
  return useQuery({
    queryKey: ['admin-store-statistics'],
    queryFn: async () => {
      const [storesCount, verifiedStoresCount, activeStoresCount, totalListingsCount] = await Promise.all([
        supabase.from('stores').select('id', { count: 'exact', head: true }),
        supabase.from('stores').select('id', { count: 'exact', head: true }).eq('verified', true),
        supabase.from('stores').select('id', { count: 'exact', head: true }).eq('is_active', true),
        supabase.from('coins').select('id', { count: 'exact', head: true }).not('store_id', 'is', null),
      ]);

      return {
        totalStores: storesCount.count || 0,
        verifiedStores: verifiedStoresCount.count || 0,
        activeStores: activeStoresCount.count || 0,
        totalListings: totalListingsCount.count || 0,
      };
    },
  });
};

// Update Store Status Mutation
export const useUpdateStoreStatus = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ storeId, updates }: { storeId: string; updates: any }) => {
      const { error } = await supabase
        .from('stores')
        .update(updates)
        .eq('id', storeId);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-dealer-stores'] });
      queryClient.invalidateQueries({ queryKey: ['admin-store-statistics'] });
      toast({
        title: "Success",
        description: "Store status updated successfully.",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    },
  });
};
