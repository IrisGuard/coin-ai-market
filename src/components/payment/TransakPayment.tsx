
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from '@/hooks/use-toast';
import { CreditCard, Loader2 } from 'lucide-react';

interface TransakPaymentProps {
  coinId: string;
  coinName: string;
  price: number;
  onPaymentSuccess?: (transactionId: string) => void;
}

const TransakPayment = ({ coinId, coinName, price, onPaymentSuccess }: TransakPaymentProps) => {
  const { user } = useAuth();
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentUrl, setPaymentUrl] = useState<string | null>(null);

  const handlePayment = async () => {
    if (!user) {
      toast({
        title: "Authentication Required",
        description: "Please log in to make a payment.",
        variant: "destructive",
      });
      return;
    }

    setIsProcessing(true);

    try {
      const { data, error } = await supabase.functions.invoke('transak-payment', {
        body: {
          coinId,
          amount: price.toString(),
          currency: 'USD',
          userId: user.id,
        },
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (error) {
        throw error;
      }

      if (data?.success && data?.transakUrl) {
        setPaymentUrl(data.transakUrl);
        
        // Open Transak widget in a new window
        const transakWindow = window.open(
          data.transakUrl,
          'transak-payment',
          'width=500,height=700,scrollbars=yes,resizable=yes'
        );

        // Poll for transaction status
        const pollStatus = setInterval(async () => {
          try {
            const { data: statusData } = await supabase.functions.invoke('transak-payment', {
              body: null,
              headers: {
                'Content-Type': 'application/json',
              },
            });

            if (statusData?.status === 'completed') {
              clearInterval(pollStatus);
              if (transakWindow) transakWindow.close();
              
              toast({
                title: "Payment Successful!",
                description: `You have successfully purchased ${coinName}`,
              });

              onPaymentSuccess?.(data.transaction.id);
            }
          } catch (pollError) {
            console.error('Status polling error:', pollError);
          }
        }, 5000);

        // Clean up polling when window is closed
        const checkClosed = setInterval(() => {
          if (transakWindow?.closed) {
            clearInterval(pollStatus);
            clearInterval(checkClosed);
            setIsProcessing(false);
          }
        }, 1000);

      } else {
        throw new Error('Failed to initialize payment');
      }
    } catch (error) {
      console.error('Payment error:', error);
      toast({
        title: "Payment Failed",
        description: "There was an error processing your payment. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <CreditCard className="h-5 w-5" />
          Secure Payment
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <p className="text-sm text-muted-foreground">Purchasing:</p>
          <p className="font-medium">{coinName}</p>
        </div>
        
        <div className="space-y-2">
          <p className="text-sm text-muted-foreground">Price:</p>
          <p className="text-2xl font-bold">${price.toFixed(2)}</p>
        </div>

        <Button
          onClick={handlePayment}
          disabled={isProcessing || !user}
          className="w-full"
          size="lg"
        >
          {isProcessing ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin mr-2" />
              Processing Payment...
            </>
          ) : (
            <>
              <CreditCard className="h-4 w-4 mr-2" />
              Pay with Transak
            </>
          )}
        </Button>

        <p className="text-xs text-muted-foreground text-center">
          Secure payment powered by Transak. Supports credit cards, debit cards, and bank transfers.
        </p>
      </CardContent>
    </Card>
  );
};

export default TransakPayment;
