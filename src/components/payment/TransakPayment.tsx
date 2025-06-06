
import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { CreditCard, Loader2 } from 'lucide-react';
import { useTransakPayment } from '@/hooks/useTransakPayment';
import { toast } from '@/hooks/use-toast';

interface TransakPaymentProps {
  coinId: string;
  amount: number;
  currency?: string;
  onSuccess?: (orderData: any) => void;
  onError?: (error: any) => void;
  className?: string;
  children?: React.ReactNode;
}

export const TransakPayment = ({ 
  coinId, 
  amount, 
  currency = 'USD',
  onSuccess,
  onError,
  className = '',
  children 
}: TransakPaymentProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const { createOrder } = useTransakPayment();

  const initializeTransak = () => {
    setIsLoading(true);
    
    try {
      // Create Transak widget configuration
      const transakConfig = {
        apiKey: import.meta.env.VITE_TRANSAK_API_KEY || 'test_api_key',
        environment: 'STAGING', // Change to 'PRODUCTION' for live
        cryptoCurrencyCode: 'ETH',
        fiatCurrency: currency,
        fiatAmount: amount,
        network: 'ethereum',
        walletAddress: '', // This will be provided by user
        themeColor: '#007AFF',
        hideMenu: true,
        redirectURL: window.location.origin,
        hostURL: window.location.origin,
        widgetHeight: '600px',
        widgetWidth: '400px'
      };

      // Create order in our system first
      createOrder.mutate({ coinId, amount, currency }, {
        onSuccess: (data) => {
          // Initialize Transak widget
          const script = document.createElement('script');
          script.src = 'https://global.transak.com/sdk/v1.2/transak.js';
          script.onload = () => {
            const transak = new (window as any).TransakSDK(transakConfig);
            
            transak.init();
            
            // Handle Transak events
            transak.on('ORDER_COMPLETED', (orderData: any) => {
              setIsLoading(false);
              toast({
                title: "Payment Successful",
                description: "Your payment has been processed successfully!",
              });
              onSuccess?.(orderData);
            });
            
            transak.on('ORDER_FAILED', (error: any) => {
              setIsLoading(false);
              toast({
                title: "Payment Failed",
                description: "There was an issue processing your payment.",
                variant: "destructive",
              });
              onError?.(error);
            });
            
            transak.on('ORDER_CANCELLED', () => {
              setIsLoading(false);
              toast({
                title: "Payment Cancelled",
                description: "Payment was cancelled by user.",
              });
            });
          };
          
          script.onerror = () => {
            setIsLoading(false);
            toast({
              title: "Payment System Error",
              description: "Unable to load payment system. Please try again.",
              variant: "destructive",
            });
          };
          
          document.head.appendChild(script);
        },
        onError: (error) => {
          setIsLoading(false);
          toast({
            title: "Order Creation Failed",
            description: "Unable to create payment order. Please try again.",
            variant: "destructive",
          });
          onError?.(error);
        }
      });
      
    } catch (error) {
      setIsLoading(false);
      console.error('Transak initialization error:', error);
      toast({
        title: "Payment Initialization Error",
        description: "Unable to initialize payment system.",
        variant: "destructive",
      });
    }
  };

  return (
    <Button
      onClick={initializeTransak}
      disabled={isLoading || createOrder.isPending}
      className={`${className} bg-gradient-to-r from-brand-primary to-electric-blue hover:from-brand-primary/90 hover:to-electric-blue/90`}
    >
      {isLoading || createOrder.isPending ? (
        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
      ) : (
        <CreditCard className="h-4 w-4 mr-2" />
      )}
      {children || `Pay $${amount} with Crypto`}
    </Button>
  );
};

export default TransakPayment;
