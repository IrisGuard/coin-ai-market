
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';

export const useTransakPayment = () => {
  const queryClient = useQueryClient();

  const createOrder = useMutation({
    mutationFn: async ({ coinId, amount, currency = 'USD' }: { 
      coinId: string; 
      amount: number; 
      currency?: string;
    }) => {
      const { data, error } = await supabase.functions.invoke('transak-payment', {
        body: { 
          action: 'create_order', 
          payload: { coinId, amount, currency } 
        }
      });

      if (error) throw error;
      return data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['payment-transactions'] });
      toast({
        title: "Payment Order Created",
        description: "Redirecting to Transak for payment...",
      });
      
      // Open Transak widget
      if (data.transakOrder) {
        openTransakWidget(data.transakOrder);
      }
    },
    onError: (error: unknown) => {
      toast({
        title: "Payment Error",
        description: error instanceof Error ? error.message : 'Failed to create payment order',
        variant: "destructive",
      });
    },
  });

  const updateStatus = useMutation({
    mutationFn: async ({ transactionId, status, transakData }: {
      transactionId: string;
      status: string;
      transakData?: any;
    }) => {
      const { data, error } = await supabase.functions.invoke('transak-payment', {
        body: { 
          action: 'update_status', 
          payload: { transactionId, status, transakData } 
        }
      });

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['payment-transactions'] });
      toast({
        title: "Payment Status Updated",
        description: "Payment status has been updated successfully.",
      });
    },
  });

  return {
    createOrder,
    updateStatus,
  };
};

function openTransakWidget(transakOrder: any) {
  // Create Transak widget URL
  const params = new URLSearchParams(transakOrder);
  const transakUrl = `https://staging-global.transak.com/?${params.toString()}`;
  
  // Open in new window
  const popup = window.open(
    transakUrl,
    'transak',
    'width=400,height=600,scrollbars=yes,resizable=yes'
  );

  // Listen for popup close or completion
  const checkClosed = setInterval(() => {
    if (popup?.closed) {
      clearInterval(checkClosed);
      // Refresh payment status
      window.location.reload();
    }
  }, 1000);
}
