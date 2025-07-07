import React, { useEffect, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Wallet, Loader2 } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';

interface TransakWidgetProps {
  orderType: 'coin_purchase' | 'subscription' | 'store_upgrade';
  coinId?: string;
  coinName?: string;
  amount: number;
  currency?: string;
  cryptoCurrency?: string;
  subscriptionPlan?: string;
  onPaymentSuccess: (transactionId: string) => void;
  onPaymentFailed: (error: string) => void;
}

interface TransakSDKGlobal {
  TransakSDK: any;
}

declare const window: Window & TransakSDKGlobal;

const TransakWidget = ({
  orderType,
  coinId,
  coinName,
  amount,
  currency = 'USD',
  cryptoCurrency = 'BTC',
  subscriptionPlan,
  onPaymentSuccess,
  onPaymentFailed
}: TransakWidgetProps) => {
  const { user } = useAuth();
  const transakRef = useRef<any>(null);
  const [isLoading, setIsLoading] = React.useState(true);
  const [scriptLoaded, setScriptLoaded] = React.useState(false);

  useEffect(() => {
    // Load Transak SDK script
    const script = document.createElement('script');
    script.src = 'https://global.transak.com/sdk/v1.2/widget.js';
    script.async = true;
    script.onload = () => {
      setScriptLoaded(true);
      initializeTransak();
    };
    script.onerror = () => {
      toast.error('Failed to load payment system');
      onPaymentFailed('SDK load failed');
    };
    document.head.appendChild(script);

    return () => {
      if (transakRef.current) {
        transakRef.current.close();
      }
      document.head.removeChild(script);
    };
  }, []);

  const initializeTransak = async () => {
    if (!window.TransakSDK || !user) return;

    try {
      const transak = new window.TransakSDK({
        apiKey: 'test-api-key', // Will be replaced with env variable
        environment: 'STAGING', // STAGING or PRODUCTION
        fiatCurrency: currency,
        cryptoCurrency: cryptoCurrency,
        fiatAmount: amount,
        userEmail: user.email,
        userData: {
          firstName: user.user_metadata?.full_name?.split(' ')[0] || 'User',
          email: user.email,
        },
        themeColor: '000000',
        hostURL: window.location.origin,
        redirectURL: `${window.location.origin}/payment-success?transaction_id={{ORDER_ID}}&payment_method=Transak`,
        partnerOrderId: `${orderType}-${Date.now()}`,
        networks: 'ethereum,polygon,bsc',
        paymentMethod: 'credit_debit_card,bank_transfer',
        disableWalletAddressForm: false,
        hideExchangeScreen: false,
        exchangeScreenTitle: `Purchase ${coinName || subscriptionPlan || 'Item'}`,
        isFeeCalculationHidden: false,
        isDisableCrypto: false,
      });

      // Event listeners
      transak.on('TRANSAK_WIDGET_INITIALISED', () => {
        console.log('Transak widget initialized');
        setIsLoading(false);
      });

      transak.on('TRANSAK_ORDER_SUCCESSFUL', (orderData: any) => {
        console.log('Payment successful:', orderData);
        toast.success('Payment completed successfully!');
        onPaymentSuccess(orderData.status.id);
        transak.close();
      });

      transak.on('TRANSAK_ORDER_FAILED', (orderData: any) => {
        console.log('Payment failed:', orderData);
        toast.error('Payment failed. Please try again.');
        onPaymentFailed(orderData.status?.failureReason || 'Payment failed');
      });

      transak.on('TRANSAK_ORDER_CANCELLED', () => {
        console.log('Payment cancelled');
        toast.info('Payment was cancelled');
        onPaymentFailed('Payment cancelled by user');
      });

      transak.on('TRANSAK_WIDGET_CLOSE', () => {
        console.log('Widget closed');
      });

      // Initialize the widget
      transak.init();
      transakRef.current = transak;

    } catch (error) {
      console.error('Transak initialization error:', error);
      setIsLoading(false);
      toast.error('Failed to initialize payment system');
      onPaymentFailed('Initialization failed');
    }
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Wallet className="h-5 w-5 text-blue-600" />
          Secure Payment
          <Badge variant="secondary">Powered by Transak</Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Order Summary */}
        <div className="space-y-2">
          <h4 className="font-medium">Order Summary</h4>
          <div className="bg-gray-50 p-3 rounded-lg">
            <div className="flex justify-between items-center">
              <span className="text-sm">
                {orderType === 'coin_purchase' ? coinName : 
                 orderType === 'subscription' ? `${subscriptionPlan} Subscription` : 
                 'Store Upgrade'}
              </span>
              <span className="font-bold">${amount.toFixed(2)}</span>
            </div>
          </div>
        </div>

        {/* Loading State */}
        {isLoading && (
          <div className="flex items-center justify-center p-8">
            <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
            <span className="ml-2">Loading payment system...</span>
          </div>
        )}

        {/* Widget Container */}
        <div id="transak-widget-container" className={isLoading ? 'hidden' : 'block'}>
          {/* Transak widget will be embedded here */}
        </div>

        {/* Payment Info */}
        <div className="text-xs text-gray-600 space-y-1">
          <p>• Supports credit cards, debit cards, and bank transfers</p>
          <p>• Secure payment processing by Transak</p>
          <p>• Multiple cryptocurrency options available</p>
          <p>• Instant confirmation upon successful payment</p>
        </div>
      </CardContent>
    </Card>
  );
};

export default TransakWidget;