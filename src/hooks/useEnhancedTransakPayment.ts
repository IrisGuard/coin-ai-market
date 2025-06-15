
import { useState, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';

export interface EnhancedPaymentRequest {
  orderType: 'coin_purchase' | 'subscription' | 'store_upgrade';
  coinId?: string;
  amount: number;
  currency: string;
  cryptoCurrency?: string;
  subscriptionPlan?: string;
}

export interface PaymentTransaction {
  id: string;
  user_id: string;
  coin_id?: string;
  amount: number;
  currency: string;
  crypto_currency?: string;
  status: string;
  order_type: string;
  subscription_plan?: string;
  transak_order_id?: string;
  created_at: string;
}

export const useEnhancedTransakPayment = () => {
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [transaction, setTransaction] = useState<PaymentTransaction | null>(null);

  const createPayment = useCallback(async (paymentRequest: EnhancedPaymentRequest) => {
    if (!user) {
      toast.error('Please log in to make a payment.');
      return null;
    }

    setIsLoading(true);
    
    try {
      const { data, error } = await supabase.functions.invoke('transak-payment', {
        body: {
          coinId: paymentRequest.coinId,
          amount: paymentRequest.amount.toString(),
          currency: paymentRequest.currency,
          userId: user.id,
          orderType: paymentRequest.orderType,
          subscriptionPlan: paymentRequest.subscriptionPlan,
          cryptoCurrency: paymentRequest.cryptoCurrency || 'BTC'
        },
      });

      if (error) throw error;

      if (data?.success) {
        setTransaction(data.transaction);
        return {
          transaction: data.transaction,
          paymentUrl: data.transakUrl,
        };
      }

      throw new Error('Failed to create payment');
    } catch (error) {
      console.error('Payment creation error:', error);
      toast.error('Failed to initialize payment. Please try again.');
      return null;
    } finally {
      setIsLoading(false);
    }
  }, [user]);

  const checkPaymentStatus = useCallback(async (transactionId: string) => {
    try {
      const { data, error } = await supabase
        .from('payment_transactions')
        .select('*')
        .eq('id', transactionId)
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Status check error:', error);
      return null;
    }
  }, []);

  return {
    isLoading,
    transaction,
    createPayment,
    checkPaymentStatus,
  };
};
