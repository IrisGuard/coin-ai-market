
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export const useAdminTokenStats = () => {
  return useQuery({
    queryKey: ['admin-token-stats'],
    queryFn: async () => {
      // Get comprehensive token statistics for admin
      const [tokenInfo, walletBalances, tokenLocks, referrals, activity] = await Promise.all([
        supabase.from('token_info').select('*').single(),
        supabase.from('wallet_balances').select('*'),
        supabase.from('token_locks').select('*'),
        supabase.from('referrals').select('*'),
        supabase.from('token_activity').select('*').limit(100).order('created_at', { ascending: false })
      ]);

      // Calculate aggregated stats
      const totalLocked = walletBalances.data?.reduce((sum, wallet) => sum + (wallet.locked_balance || 0), 0) || 0;
      const totalCirculating = walletBalances.data?.reduce((sum, wallet) => sum + (wallet.gcai_balance || 0), 0) || 0;
      const totalReferrals = referrals.data?.reduce((sum, ref) => sum + (ref.total_referrals || 0), 0) || 0;
      const totalEarned = referrals.data?.reduce((sum, ref) => sum + (ref.total_earned || 0), 0) || 0;

      return {
        tokenInfo: tokenInfo.data,
        stats: {
          totalLocked,
          totalCirculating,
          totalReferrals,
          totalEarned,
          activeLocks: tokenLocks.data?.length || 0,
          recentActivity: activity.data?.length || 0
        },
        rawData: {
          walletBalances: walletBalances.data,
          tokenLocks: tokenLocks.data,
          referrals: referrals.data,
          activity: activity.data
        }
      };
    },
    refetchInterval: 30000, // Refresh every 30 seconds for real-time data
  });
};

export const useAdminTokenLocks = () => {
  return useQuery({
    queryKey: ['admin-token-locks'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('token_locks')
        .select(`
          *,
          profiles!token_locks_user_id_fkey (
            id,
            name,
            email
          )
        `)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data;
    },
    refetchInterval: 15000, // Refresh every 15 seconds
  });
};

export const useAdminTokenActivity = () => {
  return useQuery({
    queryKey: ['admin-token-activity'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('token_activity')
        .select(`
          *,
          profiles!token_activity_user_id_fkey (
            id,
            name,
            email
          )
        `)
        .order('created_at', { ascending: false })
        .limit(200);
      
      if (error) throw error;
      return data;
    },
    refetchInterval: 10000, // Refresh every 10 seconds for live activity
  });
};

export const useAdminReferralStats = () => {
  return useQuery({
    queryKey: ['admin-referral-stats'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('referrals')
        .select(`
          *,
          profiles!referrals_referrer_id_fkey (
            id,
            name,
            email
          )
        `)
        .order('total_earned', { ascending: false });
      
      if (error) throw error;
      
      // Calculate referral performance metrics
      const totalCommissions = data?.reduce((sum, ref) => sum + (ref.total_earned || 0), 0) || 0;
      const totalReferrals = data?.reduce((sum, ref) => sum + (ref.total_referrals || 0), 0) || 0;
      const activeReferrers = data?.filter(ref => (ref.total_referrals || 0) > 0).length || 0;

      return {
        referrals: data,
        metrics: {
          totalCommissions,
          totalReferrals,
          activeReferrers,
          averageCommission: totalReferrals > 0 ? totalCommissions / totalReferrals : 0
        }
      };
    },
    refetchInterval: 30000,
  });
};
