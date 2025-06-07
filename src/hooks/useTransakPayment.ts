
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
  status: string;
  transak_order_id?: string;
  created_at: string;
}

export const useTransakPayment = () => {
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [transaction, setTransaction] = useState<PaymentTransaction | null>(null);

  const createPayment = useCallback(async (coinId: string, amount: number, currency = 'USD') => {
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
      const { data, error } = await supabase.functions.invoke('transak-payment', {
        body: {
          coinId,
          amount: amount.toString(),
          currency,
          userId: user.id,
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

  const getUserTransactions = useCallback(async () => {
    if (!user) return [];

    try {
      const { data, error } = await supabase
        .from('payment_transactions')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error fetching transactions:', error);
      return [];
    }
  }, [user]);

  return {
    isLoading,
    transaction,
    createPayment,
    checkPaymentStatus,
    getUserTransactions,
  };
};
