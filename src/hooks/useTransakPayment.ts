
import { useState, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from '@/hooks/use-toast';

export interface PaymentTransaction {
  id: string;
  user_id: string;
  coin_id: string;
  amount: number;
  currency: string;
  crypto_currency?: string;
  status: string;
  transak_order_id?: string;
  order_type?: string;
  subscription_plan?: string;
  created_at: string;
}

export const useTransakPayment = () => {
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [transaction, setTransaction] = useState<PaymentTransaction | null>(null);

  const createPayment = useCallback(async (
    coinId: string, 
    amount: number, 
    currency = 'USD',
    orderType: string = 'coin_purchase',
    subscriptionPlan?: string,
    cryptoCurrency: string = 'ETH'
  ) => {
    if (!user) {
      toast({
        title: "Authentication Required",
        description: "Please log in to make a payment.",
        variant: "destructive",
      });
      return null;
    }

    setIsLoading(true);
    
    try {
      console.log('💳 Creating Transak payment...');
      console.log('Payment details:', { coinId, amount, currency, orderType, cryptoCurrency });

      const { data, error } = await supabase.functions.invoke('transak-payment', {
        body: {
          coinId,
          amount: amount.toString(),
          currency,
          userId: user.id,
          orderType,
          subscriptionPlan,
          cryptoCurrency
        },
      });

      if (error) {
        console.error('❌ Transak payment creation failed:', error);
        throw error;
      }

      if (data?.success) {
        console.log('✅ Transak payment created successfully:', data);
        setTransaction(data.transaction);
        
        toast({
          title: "Payment Initialized",
          description: "Your payment has been created successfully.",
        });

        return {
          transaction: data.transaction,
          paymentUrl: data.transakUrl,
          config: data.config
        };
      }

      throw new Error('Failed to create payment');
    } catch (error) {
      console.error('💥 Payment creation error:', error);
      toast({
        title: "Payment Failed",
        description: "Failed to initialize payment. Please try again.",
        variant: "destructive",
      });
      return null;
    } finally {
      setIsLoading(false);
    }
  }, [user]);

  const checkPaymentStatus = useCallback(async (transactionId: string) => {
    try {
      console.log('🔍 Checking payment status for transaction:', transactionId);

      const { data, error } = await supabase
        .from('payment_transactions')
        .select('*')
        .eq('id', transactionId)
        .single();

      if (error) {
        console.error('❌ Payment status check failed:', error);
        throw error;
      }

      console.log('✅ Payment status retrieved:', data);
      return data;
    } catch (error) {
      console.error('💥 Status check error:', error);
      return null;
    }
  }, []);

  const getUserTransactions = useCallback(async () => {
    if (!user) return [];

    try {
      console.log('📊 Fetching user transactions for:', user.id);

      const { data, error } = await supabase
        .from('payment_transactions')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('❌ Failed to fetch user transactions:', error);
        throw error;
      }

      console.log('✅ User transactions retrieved:', data?.length || 0, 'transactions');
      return data || [];
    } catch (error) {
      console.error('💥 Error fetching transactions:', error);
      return [];
    }
  }, [user]);

  const createSubscriptionPayment = useCallback(async (
    planName: string,
    amount: number,
    currency: string = 'USD'
  ) => {
    return createPayment(
      'subscription', // Use 'subscription' as coinId for subscription payments
      amount,
      currency,
      'subscription',
      planName
    );
  }, [createPayment]);

  return {
    isLoading,
    transaction,
    createPayment,
    createSubscriptionPayment,
    checkPaymentStatus,
    getUserTransactions,
  };
};
