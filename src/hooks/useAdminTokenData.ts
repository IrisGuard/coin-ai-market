
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export const useAdminTokenStats = () => {
  return useQuery({
    queryKey: ['admin-token-stats'],
    queryFn: async () => {
      const [tokenInfo, walletBalances, tokenLocks, referrals, activity] = await Promise.all([
        supabase.from('token_info').select('*').single(),
        supabase.from('wallet_balances').select('*'),
        supabase.from('token_locks').select('*'),
        supabase.from('referrals').select('*'),
        supabase.from('token_activity').select('*').limit(100).order('created_at', { ascending: false })
      ]);

      const totalLocked = walletBalances.data?.reduce((sum, wallet) => sum + (wallet.locked_balance || 0), 0) || 0;
      const totalCirculating = walletBalances.data?.reduce((sum, wallet) => sum + (wallet.gcai_balance || 0), 0) || 0;
      const totalReferrals = referrals.data?.reduce((sum, ref) => sum + (ref.total_referrals || 0), 0) || 0;
      const totalEarned = referrals.data?.reduce((sum, ref) => sum + (ref.total_earned || 0), 0) || 0;

      return {
        tokenInfo: tokenInfo.data || {
          total_supply: 1000000000,
          circulating_supply: 250000000,
          current_price_usd: 0.1,
          usdc_rate: 10,
          sol_rate: 1000
        },
        stats: {
          totalLocked,
          totalCirculating,
          totalReferrals,
          totalEarned,
          activeLocks: tokenLocks.data?.length || 0,
          recentActivity: activity.data?.length || 0
        },
        rawData: {
          walletBalances: walletBalances.data || [],
          tokenLocks: tokenLocks.data || [],
          referrals: referrals.data || [],
          activity: activity.data || []
        }
      };
    },
    refetchInterval: 30000,
  });
};

export const useAdminTokenLocks = () => {
  return useQuery({
    queryKey: ['admin-token-locks'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('token_locks')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      
      const userIds = data?.map(lock => lock.user_id).filter(Boolean) || [];
      const profilesData = userIds.length > 0 ? await supabase
        .from('profiles')
        .select('id, name, email')
        .in('id', userIds) : { data: [] };

      const enrichedData = data?.map(lock => ({
        ...lock,
        profiles: profilesData.data?.find(profile => profile.id === lock.user_id) || {
          name: 'Unknown User',
          email: 'N/A'
        }
      })) || [];

      return enrichedData;
    },
    refetchInterval: 15000,
  });
};

export const useAdminTokenActivity = () => {
  return useQuery({
    queryKey: ['admin-token-activity'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('token_activity')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(200);
      
      if (error) throw error;
      
      const userIds = data?.map(activity => activity.user_id).filter(Boolean) || [];
      const profilesData = userIds.length > 0 ? await supabase
        .from('profiles')
        .select('id, name, email')
        .in('id', userIds) : { data: [] };

      const enrichedData = data?.map(activity => ({
        ...activity,
        token_amount: activity.amount || 0,
        usd_value: (activity.amount || 0) * 0.1,
        transaction_status: 'completed',
        profiles: profilesData.data?.find(profile => profile.id === activity.user_id) || {
          name: 'Unknown User',
          email: 'N/A'
        }
      })) || [];

      return enrichedData;
    },
    refetchInterval: 10000,
  });
};

export const useAdminReferralStats = () => {
  return useQuery({
    queryKey: ['admin-referral-stats'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('referrals')
        .select('*')
        .order('total_earned', { ascending: false });
      
      if (error) throw error;
      
      const userIds = data?.map(referral => referral.referrer_id).filter(Boolean) || [];
      const profilesData = userIds.length > 0 ? await supabase
        .from('profiles')
        .select('id, name, email')
        .in('id', userIds) : { data: [] };

      const enrichedData = data?.map(referral => ({
        ...referral,
        clicks: 0, // Real clicks would come from analytics
        profiles: profilesData.data?.find(profile => profile.id === referral.referrer_id) || {
          name: 'Unknown User',
          email: 'N/A'
        }
      })) || [];
      
      const totalCommissions = enrichedData.reduce((sum, ref) => sum + (ref.total_earned || 0), 0);
      const totalReferrals = enrichedData.reduce((sum, ref) => sum + (ref.total_referrals || 0), 0);
      const activeReferrers = enrichedData.filter(ref => (ref.total_referrals || 0) > 0).length;

      return {
        referrals: enrichedData,
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
