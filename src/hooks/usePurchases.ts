
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from '@/hooks/use-toast';

export const usePurchaseCoin = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ coinId, sellerId, amount, storeId }: {
      coinId: string;
      sellerId: string;
      amount: number;
      storeId?: string;
    }) => {
      if (!user) throw new Error('User not authenticated');

      // Create purchase record
      const { data: purchase, error: purchaseError } = await supabase
        .from('user_purchases')
        .insert([{
          buyer_id: user.id,
          seller_id: sellerId,
          coin_id: coinId,
          store_id: storeId,
          amount: amount,
          status: 'completed',
          payment_method: 'instant'
        }])
        .select()
        .single();

      if (purchaseError) throw purchaseError;

      // Mark coin as sold
      const { error: coinError } = await supabase
        .from('coins')
        .update({ 
          sold: true, 
          sold_at: new Date().toISOString(),
          owner_id: user.id
        })
        .eq('id', coinId);

      if (coinError) throw coinError;

      // Create transaction record
      const { error: transactionError } = await supabase
        .from('transactions')
        .insert([{
          buyer_id: user.id,
          seller_id: sellerId,
          coin_id: coinId,
          amount: amount,
          status: 'completed',
          transaction_type: 'purchase'
        }]);

      if (transactionError) throw transactionError;

      return purchase;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['coins'] });
      queryClient.invalidateQueries({ queryKey: ['user-purchases'] });
      toast({
        title: "Purchase Successful!",
        description: "Congratulations on your new coin acquisition!",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Purchase Failed",
        description: error.message || 'Failed to complete purchase',
        variant: "destructive",
      });
    },
  });
};
