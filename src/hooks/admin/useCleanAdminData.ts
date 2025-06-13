
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';
import { verifyAdminAccess, safeQuery, handleSupabaseError } from '@/utils/supabaseSecurityHelpers';

// Clean Admin Users Hook with enhanced error handling
export const useCleanAdminUsers = () => {
  return useQuery({
    queryKey: ['clean-admin-users'],
    queryFn: async () => {
      console.log('🔍 Fetching clean admin users...');
      
      const isAdmin = await verifyAdminAccess();
      if (!isAdmin) {
        throw new Error('Admin access required');
      }

      return safeQuery(async () => {
        const { data, error } = await supabase
          .from('profiles')
          .select('*')
          .order('created_at', { ascending: false });
        
        if (error) {
          console.error('❌ Error fetching profiles:', error);
          throw error;
        }
        
        console.log('✅ Clean admin users loaded:', data?.length || 0);
        return { data: data || [], error: null };
      });
    },
    retry: (failureCount, error: any) => {
      if (error?.message?.includes('Admin access required') || 
          error?.message?.includes('Access denied')) {
        return false;
      }
      return failureCount < 2;
    },
    staleTime: 30000, // 30 seconds
    refetchOnWindowFocus: false
  });
};

// Clean Admin Coins Hook with enhanced error handling
export const useCleanAdminCoins = () => {
  return useQuery({
    queryKey: ['clean-admin-coins'],
    queryFn: async () => {
      console.log('🔍 Fetching clean admin coins...');
      
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
        
        if (error) {
          console.error('❌ Error fetching coins:', error);
          throw error;
        }
        
        console.log('✅ Clean admin coins loaded:', data?.length || 0);
        return { data: data || [], error: null };
      });
    },
    retry: (failureCount, error: any) => {
      if (error?.message?.includes('Admin access required') || 
          error?.message?.includes('Access denied')) {
        return false;
      }
      return failureCount < 2;
    },
    staleTime: 30000, // 30 seconds
    refetchOnWindowFocus: false
  });
};

// Clean API Keys Hook with enhanced error handling
export const useCleanApiKeys = () => {
  return useQuery({
    queryKey: ['clean-admin-api-keys'],
    queryFn: async () => {
      console.log('🔍 Fetching clean API keys...');
      
      const isAdmin = await verifyAdminAccess();
      if (!isAdmin) {
        throw new Error('Admin access required');
      }

      return safeQuery(async () => {
        const { data, error } = await supabase
          .from('api_keys')
          .select('*')
          .order('created_at', { ascending: false });
        
        if (error) {
          console.error('❌ Error fetching API keys:', error);
          throw error;
        }
        
        console.log('✅ Clean API keys loaded:', data?.length || 0);
        return { data: data || [], error: null };
      });
    },
    retry: (failureCount, error: any) => {
      if (error?.message?.includes('Admin access required') || 
          error?.message?.includes('Access denied')) {
        return false;
      }
      return failureCount < 2;
    },
    staleTime: 30000, // 30 seconds
    refetchOnWindowFocus: false
  });
};

// Enhanced mutation with better error handling and logging
export const useCleanUpdateUserStatus = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ userId, verified }: { userId: string; verified: boolean }) => {
      console.log('🔄 Updating user status:', { userId, verified });
      
      const isAdmin = await verifyAdminAccess();
      if (!isAdmin) {
        throw new Error('Admin access required');
      }

      const { error } = await supabase
        .from('profiles')
        .update({ verified_dealer: verified })
        .eq('id', userId);
      
      if (error) {
        console.error('❌ Error updating user status:', error);
        const handledError = handleSupabaseError(error, 'update user status');
        throw new Error(handledError);
      }
      
      console.log('✅ User status updated successfully');
    },
    onSuccess: () => {
      // Invalidate all related queries
      queryClient.invalidateQueries({ queryKey: ['clean-admin-users'] });
      queryClient.invalidateQueries({ queryKey: ['admin-users'] });
      queryClient.invalidateQueries({ queryKey: ['secure-admin-users'] });
      
      toast({
        title: "Χρήστης Ενημερώθηκε",
        description: "Το status του χρήστη ενημερώθηκε επιτυχώς με καθαρά policies.",
      });
    },
    onError: (error: Error) => {
      console.error('❌ Error in user status update:', error);
      toast({
        title: "Σφάλμα",
        description: error.message || 'Παρουσιάστηκε σφάλμα',
        variant: "destructive",
      });
    },
  });
};
