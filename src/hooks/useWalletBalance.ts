
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

export const useWalletBalance = () => {
  const { user } = useAuth();

  return useQuery({
    queryKey: ['wallet-balance', user?.id],
    queryFn: async () => {
      if (!user?.id) return null;
      
      const { data, error } = await supabase
        .from('wallet_balances')
        .select('*')
        .eq('user_id', user.id)
        .single();
      
      if (error && error.code !== 'PGRST116') throw error;
      
      // If no wallet exists, create one
      if (!data) {
        const { data: newWallet, error: createError } = await supabase
          .from('wallet_balances')
          .insert({
            user_id: user.id,
            wallet_address: `gcai_${user.id.slice(0, 12)}`,
            gcai_balance: 0,
            locked_balance: 0,
          })
          .select()
          .single();
        
        if (createError) throw createError;
        return newWallet;
      }
      
      return data;
    },
    enabled: !!user?.id,
  });
};
