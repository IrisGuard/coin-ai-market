
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

export const useReferrals = () => {
  const { user } = useAuth();

  return useQuery({
    queryKey: ['referrals', user?.id],
    queryFn: async () => {
      if (!user?.id) return null;
      
      const { data, error } = await supabase
        .from('referrals')
        .select('*')
        .eq('referrer_id', user.id)
        .single();
      
      if (error && error.code !== 'PGRST116') throw error;
      
      // If no referral exists, create one
      if (!data) {
        const referralCode = `GCAI${user.id.slice(0, 8).toUpperCase()}`;
        const { data: newReferral, error: createError } = await supabase
          .from('referrals')
          .insert({
            referrer_id: user.id,
            referral_code: referralCode,
          })
          .select()
          .single();
        
        if (createError) throw createError;
        return newReferral;
      }
      
      return data;
    },
    enabled: !!user?.id,
  });
};
