
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export const useDealerStoreInfo = (dealerId: string) => {
  return useQuery({
    queryKey: ['dealer-store-info', dealerId],
    queryFn: async () => {
      if (!dealerId) return null;
      
      const { data, error } = await supabase
        .from('stores')
        .select(`
          name,
          solana_wallet_address,
          ethereum_wallet_address,
          bitcoin_wallet_address,
          usdc_wallet_address,
          bank_name,
          iban,
          swift_bic
        `)
        .eq('user_id', dealerId)
        .single();
      
      if (error && error.code !== 'PGRST116') {
        console.error('❌ Error fetching dealer store info:', error);
        throw error;
      }
      
      return data;
    },
    enabled: !!dealerId,
  });
};
