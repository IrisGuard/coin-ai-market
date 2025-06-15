
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

interface ReferralData {
  id: string;
  user_id: string;
  referral_code: string;
  total_referrals: number;
  total_earned: number;
  created_at: string;
  updated_at: string;
}

export const useReferrals = () => {
  return useQuery<ReferralData | null>({
    queryKey: ['referrals'],
    queryFn: async () => {
      const { data: user } = await supabase.auth.getUser();
      if (!user.user) return null;

      const { data, error } = await supabase
        .from('referrals')
        .select('*')
        .eq('user_id', user.user.id)
        .maybeSingle();
      
      if (error && error.code !== 'PGRST116') throw error;
      return data as ReferralData | null;
    },
    refetchInterval: 60000,
  });
};
