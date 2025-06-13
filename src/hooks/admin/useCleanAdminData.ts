
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';
import { verifyAdminAccess, safeQuery, handleSupabaseError } from '@/utils/supabaseSecurityHelpers';

// Clean Admin Users Hook using the new secure function
export const useCleanAdminUsers = () => {
  return useQuery({
    queryKey: ['clean-admin-users'],
    queryFn: async () => {
      // First verify admin access using the new secure function
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
        console.log('✅ Clean admin users loaded:', data?.length || 0);
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

// Clean Admin Coins Hook using the new secure function
export const useCleanAdminCoins = () => {
  return useQuery({
    queryKey: ['clean-admin-coins'],
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
        console.log('✅ Clean admin coins loaded:', data?.length || 0);
        return { data: data || [], error: null };
      });
    }
  });
};

// Clean API Keys Hook using the new secure function
export const useCleanApiKeys = () => {
  return useQuery({
    queryKey: ['clean-admin-api-keys'],
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
        console.log('✅ Clean API keys loaded:', data?.length || 0);
        return { data: data || [], error: null };
      });
    }
  });
};

// Enhanced mutation with proper error handling using the new secure function
export const useCleanUpdateUserStatus = () => {
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
      queryClient.invalidateQueries({ queryKey: ['clean-admin-users'] });
      queryClient.invalidateQueries({ queryKey: ['admin-users'] });
      toast({
        title: "Χρήστης Ενημερώθηκε",
        description: "Το status του χρήστη ενημερώθηκε επιτυχώς με ενιαία policies.",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Σφάλμα",
        description: error.message || 'Παρουσιάστηκε σφάλμα',
        variant: "destructive",
      });
    },
  });
};
