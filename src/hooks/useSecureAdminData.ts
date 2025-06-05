
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';
import { verifyAdminAccess, safeQuery, handleSupabaseError } from '@/utils/supabaseSecurityHelpers';

// Secure Admin Users Hook with RLS compliance
export const useSecureAdminUsers = () => {
  return useQuery({
    queryKey: ['secure-admin-users'],
    queryFn: async () => {
      // First verify admin access
      const isAdmin = await verifyAdminAccess();
      if (!isAdmin) {
        throw new Error('Admin access required');
      }

      return safeQuery(async () => {
        const { data, error } = await supabase
          .from('profiles')
          .select('*')
          .order('created_at', { ascending: false });
        
        if (error) throw error;
        return { data: data || [], error: null };
      });
    },
    retry: (failureCount, error: any) => {
      // Don't retry on permission errors
      if (error?.message?.includes('Admin access required') || 
          error?.message?.includes('Access denied')) {
        return false;
      }
      return failureCount < 2;
    }
  });
};

// Secure Admin Coins Hook
export const useSecureAdminCoins = () => {
  return useQuery({
    queryKey: ['secure-admin-coins'],
    queryFn: async () => {
      const isAdmin = await verifyAdminAccess();
      if (!isAdmin) {
        throw new Error('Admin access required');
      }

      return safeQuery(async () => {
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
        return { data: data || [], error: null };
      });
    }
  });
};

// Secure API Keys Hook
export const useSecureApiKeys = () => {
  return useQuery({
    queryKey: ['secure-admin-api-keys'],
    queryFn: async () => {
      const isAdmin = await verifyAdminAccess();
      if (!isAdmin) {
        throw new Error('Admin access required');
      }

      return safeQuery(async () => {
        const { data, error } = await supabase
          .from('api_keys')
          .select('*')
          .order('created_at', { ascending: false });
        
        if (error) throw error;
        return { data: data || [], error: null };
      });
    }
  });
};

// Enhanced mutation with proper error handling
export const useSecureUpdateUserStatus = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ userId, verified }: { userId: string; verified: boolean }) => {
      const isAdmin = await verifyAdminAccess();
      if (!isAdmin) {
        throw new Error('Admin access required');
      }

      const { error } = await supabase
        .from('profiles')
        .update({ verified_dealer: verified })
        .eq('id', userId);
      
      if (error) {
        const handledError = handleSupabaseError(error, 'update user status');
        throw new Error(handledError);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['secure-admin-users'] });
      queryClient.invalidateQueries({ queryKey: ['admin-users'] });
      toast({
        title: "User Updated",
        description: "User status has been updated successfully.",
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
