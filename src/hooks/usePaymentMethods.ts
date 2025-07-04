import { useState, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from '@/hooks/use-toast';
import { PaymentRequest, PaymentResult } from '@/types/paymentTypes';

export const usePaymentMethods = () => {
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(false);

  const processStripePayment = useCallback(async (
    paymentData: PaymentRequest & {
      paymentMethodId: string;
      customerInfo: {
        name: string;
        email: string;
      };
      billingAddress: any;
    }
  ): Promise<PaymentResult> => {
    setIsLoading(true);
    
    try {
      const { data, error } = await supabase.functions.invoke('stripe-payment', {
        body: {
          coinId: paymentData.coinId,
          amount: paymentData.amount,
          currency: paymentData.currency,
          paymentMethodId: paymentData.paymentMethodId,
          customerEmail: paymentData.customerInfo.email,
          customerName: paymentData.customerInfo.name,
          billingAddress: paymentData.billingAddress,
          userId: user?.id
        },
      });

      if (error) {
        throw error;
      }

      return {
        success: data.success,
        transactionId: data.transaction?.id,
        paymentUrl: data.paymentIntent?.client_secret,
        processingTime: Date.now()
      };
    } catch (error) {
      console.error('Stripe payment error:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Payment failed'
      };
    } finally {
      setIsLoading(false);
    }
  }, [user]);

  const processTraditionalPayment = useCallback(async (
    paymentData: PaymentRequest & {
      paymentMethod: string;
    }
  ): Promise<PaymentResult> => {
    setIsLoading(true);
    
    try {
      // Simulate traditional payment processing
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Create transaction record
      const { data: transaction, error } = await supabase
        .from('payment_transactions')
        .insert({
          user_id: user?.id,
          coin_id: paymentData.coinId,
          amount: paymentData.amount,
          currency: paymentData.currency,
          status: paymentData.paymentMethod === 'internal_credit' ? 'completed' : 'pending',
          payment_method: paymentData.paymentMethod,
          order_type: paymentData.orderType
        })
        .select()
        .single();

      if (error) {
        throw error;
      }

      return {
        success: true,
        transactionId: transaction.id,
        processingTime: Date.now()
      };
    } catch (error) {
      console.error('Traditional payment error:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Payment failed'
      };
    } finally {
      setIsLoading(false);
    }
  }, [user]);

  const getPaymentHistory = useCallback(async () => {
    if (!user) return [];

    try {
      const { data, error } = await supabase
        .from('payment_transactions')
        .select(`
          *,
          coins (
            name,
            image,
            price
          )
        `)
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) {
        throw error;
      }

      return data || [];
    } catch (error) {
      console.error('Error fetching payment history:', error);
      toast({
        title: "Error",
        description: "Failed to load payment history",
        variant: "destructive",
      });
      return [];
    }
  }, [user]);

  const validatePaymentData = (paymentData: Partial<PaymentRequest>): string[] => {
    const errors: string[] = [];

    if (!paymentData.amount || paymentData.amount <= 0) {
      errors.push('Invalid payment amount');
    }

    if (!paymentData.currency) {
      errors.push('Currency is required');
    }

    if (!paymentData.orderType) {
      errors.push('Order type is required');
    }

    return errors;
  };

  return {
    isLoading,
    processStripePayment,
    processTraditionalPayment,
    getPaymentHistory,
    validatePaymentData
  };
};