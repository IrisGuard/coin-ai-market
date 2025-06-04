
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';
import { SecurityUtils } from '@/utils/securityUtils';

// Type definitions
interface ApiKey {
  id: string;
  key_name: string;
  encrypted_value: string;
  description?: string;
  is_active: boolean;
  created_at?: string;
  category_id?: string;
}

interface Category {
  id: string;
  name: string;
  description?: string;
  icon?: string;
}

// Hook for admin users data
export const useAdminUsers = () => {
  return useQuery({
    queryKey: ['admin-users'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data;
    },
  });
};

// Hook for admin coins data
export const useAdminCoins = () => {
  return useQuery({
    queryKey: ['admin-coins'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('coins')
        .select(`
          *,
          profiles:user_id (
            name,
            email
          )
        `)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data;
    },
  });
};

// Hook for admin transactions data
export const useAdminTransactions = () => {
  return useQuery({
    queryKey: ['admin-transactions'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('transactions')
        .select(`
          *,
          coins (name, image),
          seller:seller_id (name, email),
          buyer:buyer_id (name, email)
        `)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data;
    },
  });
};

// Hook for admin notifications data
export const useAdminNotifications = () => {
  return useQuery({
    queryKey: ['admin-notifications'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('notifications')
        .select(`
          *,
          profiles:user_id (name, email)
        `)
        .order('created_at', { ascending: false })
        .limit(100);
      
      if (error) throw error;
      return data;
    },
  });
};

// Hook for marketplace stats
export const useMarketplaceStats = () => {
  return useQuery({
    queryKey: ['marketplace-stats'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('marketplace_stats')
        .select('*')
        .single();
      
      if (error) throw error;
      return data;
    },
  });
};

// Hook for error logs
export const useErrorLogs = () => {
  return useQuery({
    queryKey: ['error-logs'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('error_logs')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(50);
      
      if (error) throw error;
      return data;
    },
  });
};

// Hook for console errors
export const useConsoleErrors = () => {
  return useQuery({
    queryKey: ['console-errors'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('console_errors')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(50);
      
      if (error) throw error;
      return data;
    },
  });
};

// Hook for API key categories
export const useApiKeyCategories = () => {
  return useQuery<Category[]>({
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

// Hook for API keys
export const useApiKeys = () => {
  return useQuery<ApiKey[]>({
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

// Mutation for updating user status
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
        title: "User updated successfully",
        description: "User verification status has been updated.",
      });
    },
    onError: (error) => {
      toast({
        title: "Update failed",
        description: error.message,
        variant: "destructive",
      });
    },
  });
};

// Mutation for updating coin status
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
        title: "Coin updated successfully",
        description: "Coin authentication status has been updated.",
      });
    },
    onError: (error) => {
      toast({
        title: "Update failed",
        description: error.message,
        variant: "destructive",
      });
    },
  });
};

// SECURITY FIX: Updated to use secure edge function
export const useBulkCreateApiKeys = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (keys: Array<{ name: string; value: string; description?: string; category_id?: string | null }>) => {
      // Client-side rate limiting check
      if (!SecurityUtils.checkClientRateLimit('bulk_create_api_keys', 1, 300000)) { // 1 request per 5 minutes
        throw new Error('Rate limit exceeded. Please wait before trying again.');
      }

      // Get current session for authorization
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        throw new Error('Authentication required');
      }

      // Call secure edge function instead of direct database access
      const { data, error } = await supabase.functions.invoke('secure-admin-operations', {
        body: {
          operation: 'bulk_create_api_keys',
          payload: keys
        },
        headers: {
          Authorization: `Bearer ${session.access_token}`
        }
      });

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['api-keys'] });
      toast({
        title: "API Keys imported successfully",
        description: "Keys have been securely encrypted and stored.",
      });
    },
    onError: (error) => {
      console.error('Bulk import error:', SecurityUtils.sanitizeForLogging(error));
      toast({
        title: "Bulk import failed",
        description: error.message,
        variant: "destructive",
      });
    },
  });
};

// SECURITY FIX: Updated to use secure edge function
export const useCreateApiKey = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ name, value, description, category_id }: { 
      name: string; 
      value: string; 
      description?: string; 
      category_id?: string | null;
    }) => {
      // Input validation
      if (!name || name.length < 3) {
        throw new Error('API key name must be at least 3 characters long');
      }
      
      if (!value || value.length < 10) {
        throw new Error('API key value must be at least 10 characters long');
      }

      // Sanitize inputs
      const sanitizedName = SecurityUtils.sanitizeText(name);
      const sanitizedDescription = description ? SecurityUtils.sanitizeText(description) : undefined;

      // Client-side rate limiting
      if (!SecurityUtils.checkClientRateLimit('create_api_key', 5, 300000)) { // 5 requests per 5 minutes
        throw new Error('Rate limit exceeded. Please wait before creating more keys.');
      }

      // Get current session for authorization
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        throw new Error('Authentication required');
      }

      // Call secure edge function
      const { data, error } = await supabase.functions.invoke('secure-admin-operations', {
        body: {
          operation: 'create_api_key',
          payload: {
            name: sanitizedName,
            value: value,
            description: sanitizedDescription,
            category_id
          }
        },
        headers: {
          Authorization: `Bearer ${session.access_token}`
        }
      });

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['api-keys'] });
      toast({
        title: "API Key created successfully",
        description: "New API key has been securely encrypted and stored.",
      });
    },
    onError: (error) => {
      console.error('Create API key error:', SecurityUtils.sanitizeForLogging(error));
      toast({
        title: "Creation failed",
        description: error.message,
        variant: "destructive",
      });
    },
  });
};
