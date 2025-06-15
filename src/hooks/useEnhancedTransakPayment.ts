
import { useState, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';

export interface PaymentTransaction {
  id: string;
  user_id: string;
  coin_id?: string;
  amount: number;
  currency: string;
  crypto_currency?: string;
  wallet_address?: string;
  status: string;
  order_type: 'coin_purchase' | 'subscription' | 'store_upgrade';
  subscription_plan?: string;
  transak_order_id?: string;
  created_at: string;
}

export interface SubscriptionPlan {
  id: string;
  name: string;
  price: number;
  currency: string;
  features: string[];
  duration_days: number;
  popular?: boolean;
}

export interface UserSubscription {
  id: string;
  user_id: string;
  plan_name: string;
  status: string;
  expires_at?: string;
  cancelled_at?: string;
  created_at: string;
}

export const useEnhancedTransakPayment = () => {
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [transaction, setTransaction] = useState<PaymentTransaction | null>(null);

  const createPayment = useCallback(async (
    orderType: 'coin_purchase' | 'subscription' | 'store_upgrade',
    options: {
      coinId?: string;
      amount: number;
      currency?: string;
      subscriptionPlan?: string;
      cryptoCurrency?: string;
      walletAddress?: string;
    }
  ) => {
    if (!user) {
      toast.error('Please log in to make a payment');
      return null;
    }

    setIsLoading(true);
    
    try {
      const { data, error } = await supabase.functions.invoke('transak-payment', {
        body: {
          coinId: options.coinId,
          amount: options.amount.toString(),
          currency: options.currency || 'USD',
          userId: user.id,
          orderType,
          subscriptionPlan: options.subscriptionPlan,
          cryptoCurrency: options.cryptoCurrency || 'SOL',
          walletAddress: options.walletAddress
        }
      });

      if (error) throw error;

      if (data?.success) {
        setTransaction(data.transaction);
        return {
          transaction: data.transaction,
          paymentUrl: data.transakUrl,
          config: data.config
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
      const { data, error } = await supabase.functions.invoke('transak-payment', {
        body: null,
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Status check error:', error);
      return null;
    }
  }, []);

  const getUserTransactions = useCallback(async (): Promise<PaymentTransaction[]> => {
    if (!user) return [];

    try {
      const { data, error } = await supabase
        .from('payment_transactions')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      
      // Transform data to match our interface
      return (data || []).map((item: any) => ({
        ...item,
        order_type: item.order_type || 'coin_purchase'
      }));
    } catch (error) {
      console.error('Error fetching transactions:', error);
      return [];
    }
  }, [user]);

  const getUserSubscriptions = useCallback(async (): Promise<UserSubscription[]> => {
    if (!user) return [];

    try {
      // Use RPC function with proper typing
      const { data, error } = await (supabase as any).rpc('get_user_subscriptions', {
        p_user_id: user.id
      });

      if (error) {
        console.error('Error fetching subscriptions:', error);
        return [];
      }
      
      return data || [];
    } catch (error) {
      console.error('Error fetching subscriptions:', error);
      return [];
    }
  }, [user]);

  const getAvailableSubscriptionPlans = useCallback(async (): Promise<SubscriptionPlan[]> => {
    try {
      // Use RPC function with proper typing
      const { data, error } = await (supabase as any).rpc('get_subscription_plans');

      if (error) {
        console.error('Error fetching subscription plans:', error);
        return [];
      }
      
      return data || [];
    } catch (error) {
      console.error('Error fetching subscription plans:', error);
      return [];
    }
  }, []);

  const cancelSubscription = useCallback(async (subscriptionId: string) => {
    if (!user) return false;

    try {
      const { error } = await (supabase as any).rpc('cancel_user_subscription', {
        p_subscription_id: subscriptionId,
        p_user_id: user.id
      });

      if (error) throw error;

      toast.success('Subscription cancelled successfully');
      return true;
    } catch (error) {
      console.error('Error cancelling subscription:', error);
      toast.error('Failed to cancel subscription');
      return false;
    }
  }, [user]);

  return {
    isLoading,
    transaction,
    createPayment,
    checkPaymentStatus,
    getUserTransactions,
    getUserSubscriptions,
    getAvailableSubscriptionPlans,
    cancelSubscription
  };
};
