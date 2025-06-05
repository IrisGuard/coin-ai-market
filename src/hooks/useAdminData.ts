
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';
import { verifyAdminAccess, safeQuery, handleSupabaseError } from '@/utils/supabaseSecurityHelpers';

export const useAdminData = () => {
  const { data: stats, isLoading: statsLoading } = useQuery({
    queryKey: ['admin-stats'],
    queryFn: async () => {
      const [usersResult, coinsResult, transactionsResult] = await Promise.all([
        supabase.from('profiles').select('*', { count: 'exact' }),
        supabase.from('coins').select('*', { count: 'exact' }),
        supabase.from('transactions').select('amount, created_at').eq('status', 'completed')
      ]);

      const totalUsers = usersResult.count || 0;
      const totalCoins = coinsResult.count || 0;
      const totalRevenue = transactionsResult.data?.reduce((sum, t) => sum + Number(t.amount), 0) || 0;

      const today = new Date().toISOString().split('T')[0];
      const newUsersToday = usersResult.data?.filter(u => 
        u.created_at && u.created_at.startsWith(today)
      ).length || 0;

      const revenueToday = transactionsResult.data?.filter(t => 
        t.created_at.startsWith(today)
      ).reduce((sum, t) => sum + Number(t.amount), 0) || 0;

      const pendingVerification = coinsResult.data?.filter(c => 
        c.authentication_status === 'pending'
      ).length || 0;

      return {
        totalUsers,
        totalCoins,
        totalRevenue,
        newUsersToday,
        revenueToday,
        pendingVerification,
        totalUploads: totalCoins,
        averageAccuracy: 94,
        activeListings: coinsResult.data?.filter(c => c.authentication_status === 'verified').length || 0
      };
    }
  });

  const { data: pendingCoins, isLoading: coinsLoading } = useQuery({
    queryKey: ['pending-coins'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('coins')
        .select(`
          *,
          profiles!coins_user_id_fkey(
            id,
            name,
            email
          )
        `)
        .eq('authentication_status', 'pending')
        .order('created_at', { ascending: false })
        .limit(10);

      if (error) {
        console.error('Error fetching pending coins:', error);
        return [];
      }
      return data || [];
    }
  });

  const { data: users, isLoading: usersLoading } = useQuery({
    queryKey: ['admin-users'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(20);

      if (error) {
        console.error('Error fetching users:', error);
        return [];
      }
      return data || [];
    }
  });

  const { data: recentTransactions, isLoading: transactionsLoading } = useQuery({
    queryKey: ['recent-transactions'],
    queryFn: async () => {
      // Fetch transactions first, then get profile data separately
      const { data: transactions, error } = await supabase
        .from('transactions')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(10);

      if (error) {
        console.error('Error fetching transactions:', error);
        return [];
      }

      if (!transactions || transactions.length === 0) return [];

      // Get profile data for buyers and sellers
      const userIds = [...new Set([
        ...transactions.map(t => t.buyer_id),
        ...transactions.map(t => t.seller_id)
      ])].filter(Boolean);

      const { data: profiles } = await supabase
        .from('profiles')
        .select('id, name')
        .in('id', userIds);

      // Map profiles to transactions
      const transactionsWithProfiles = transactions.map(transaction => ({
        ...transaction,
        buyer_profile: profiles?.find(p => p.id === transaction.buyer_id) || { name: 'Unknown' },
        seller_profile: profiles?.find(p => p.id === transaction.seller_id) || { name: 'Unknown' }
      }));

      return transactionsWithProfiles;
    }
  });

  const systemHealth = {
    status: 'healthy' as const,
    uptime: '99.9%'
  };

  return {
    stats,
    pendingCoins,
    users,
    recentTransactions,
    systemHealth,
    isLoading: statsLoading || coinsLoading || usersLoading || transactionsLoading
  };
};

// Admin Users Hook with security validation
export const useAdminUsers = () => {
  return useQuery({
    queryKey: ['admin-users'],
    queryFn: async () => {
      const isAdmin = await verifyAdminAccess();
      if (!isAdmin) {
        console.warn('Non-admin attempted to access admin users');
        return [];
      }

      const result = await safeQuery(async () => {
        const { data, error } = await supabase
          .from('profiles')
          .select('*')
          .order('created_at', { ascending: false });
        
        return { data: data || [], error };
      });

      return result.data || [];
    },
    retry: (failureCount, error: any) => {
      if (error?.message?.includes('Access denied') || 
          error?.message?.includes('security policy')) {
        return false;
      }
      return failureCount < 2;
    }
  });
};

// Admin Coins Hook
export const useAdminCoins = () => {
  return useQuery({
    queryKey: ['admin-coins'],
    queryFn: async () => {
      const isAdmin = await verifyAdminAccess();
      if (!isAdmin) {
        console.warn('Non-admin attempted to access admin coins');
        return [];
      }

      const result = await safeQuery(async () => {
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
        
        return { data: data || [], error };
      });

      return result.data || [];
    }
  });
};

// Update User Status Mutation
export const useUpdateUserStatus = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ userId, verified }: { userId: string; verified: boolean }) => {
      const isAdmin = await verifyAdminAccess();
      if (!isAdmin) {
        throw new Error('Admin privileges required');
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
      queryClient.invalidateQueries({ queryKey: ['pending-coins'] });
      toast({
        title: "Coin Updated",
        description: "Coin status has been updated successfully.",
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
