
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export const useTransactions = () => {
  return useQuery({
    queryKey: ['admin-transactions'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('transactions')
        .select(`
          *,
          seller:profiles!transactions_seller_id_fkey(
            id,
            name,
            email
          ),
          buyer:profiles!transactions_buyer_id_fkey(
            id,
            name,
            email
          ),
          coin:coins!transactions_coin_id_fkey(
            name,
            image
          )
        `)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data || [];
    },
  });
};

// Alias for backward compatibility
export const useAdminTransactions = useTransactions;
