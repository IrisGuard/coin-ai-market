
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';
import { CreditCard, Loader2, Wallet, Shield, Zap } from 'lucide-react';

interface EnhancedTransakPaymentProps {
  orderType: 'coin_purchase' | 'subscription' | 'store_upgrade';
  coinId?: string;
  coinName?: string;
  price: number;
  subscriptionPlan?: string;
  onPaymentSuccess?: (transactionId: string) => void;
  className?: string;
}

const SUPPORTED_CRYPTOCURRENCIES = [
  { code: 'SOL', name: 'Solana', network: 'solana' },
  { code: 'USDC', name: 'USD Coin', network: 'solana' },
  { code: 'ETH', name: 'Ethereum', network: 'ethereum' },
  { code: 'BTC', name: 'Bitcoin', network: 'bitcoin' },
  { code: 'MATIC', name: 'Polygon', network: 'polygon' }
];

const SUPPORTED_FIAT_CURRENCIES = [
  { code: 'USD', symbol: '$', name: 'US Dollar' },
  { code: 'EUR', symbol: '€', name: 'Euro' },
  { code: 'GBP', symbol: '£', name: 'British Pound' },
  { code: 'JPY', symbol: '¥', name: 'Japanese Yen' }
];

const EnhancedTransakPayment: React.FC<EnhancedTransakPaymentProps> = ({
  orderType,
  coinId,
  coinName,
  price,
  subscriptionPlan,
  onPaymentSuccess,
  className = ''
}) => {
  const { user } = useAuth();
  const [isProcessing, setIsProcessing] = useState(false);
  const [selectedCrypto, setSelectedCrypto] = useState('SOL');
  const [selectedFiat, setSelectedFiat] = useState('USD');
  const [paymentMethod, setPaymentMethod] = useState<'crypto' | 'card'>('crypto');
  const [transakWidget, setTransakWidget] = useState<any>(null);

  useEffect(() => {
    // Load Transak SDK
    const script = document.createElement('script');
    script.src = 'https://global.transak.com/sdk/v1.2/transak.js';
    script.async = true;
    script.onload = () => {
      console.log('Transak SDK loaded');
    };
    document.head.appendChild(script);

    return () => {
      if (transakWidget) {
        transakWidget.close();
      }
    };
  }, [transakWidget]);

  const getOrderTitle = () => {
    switch (orderType) {
      case 'coin_purchase':
        return `Purchase: ${coinName}`;
      case 'subscription':
        return `Subscription: ${subscriptionPlan}`;
      case 'store_upgrade':
        return `Store Upgrade: ${subscriptionPlan}`;
      default:
        return 'Payment';
    }
  };

  const handlePayment = async () => {
    if (!user) {
      toast.error('Please log in to make a payment');
      return;
    }

    setIsProcessing(true);

    try {
      const { data, error } = await supabase.functions.invoke('transak-payment', {
        body: {
          coinId,
          amount: price.toString(),
          currency: selectedFiat,
          userId: user.id,
          orderType,
          subscriptionPlan,
          cryptoCurrency: selectedCrypto
        }
      });

      if (error) throw error;

      if (data?.success && data?.transakUrl) {
        // Open Transak widget
        if (window.TransakSDK) {
          const transak = new window.TransakSDK({
            apiKey: data.config.apiKey,
            environment: data.config.environment,
            walletAddress: data.config.walletAddress,
            cryptoCurrencyCode: selectedCrypto,
            fiatCurrency: selectedFiat,
            fiatAmount: price,
            network: SUPPORTED_CRYPTOCURRENCIES.find(c => c.code === selectedCrypto)?.network,
            partnerOrderId: data.config.partnerOrderId,
            partnerCustomerId: user.id,
            redirectURL: data.config.redirectURL,
            hostURL: data.config.hostURL,
            widgetHeight: '600px',
            widgetWidth: '450px',
            themeColor: '3B82F6',
            hideMenu: true,
            disableWalletAddressForm: true
          });

          setTransakWidget(transak);

          transak.init();

          // Listen for events
          transak.on(transak.EVENTS.TRANSAK_ORDER_SUCCESSFUL, (orderData: any) => {
            console.log('Order successful:', orderData);
            toast.success('Payment completed successfully!');
            transak.close();
            onPaymentSuccess?.(data.transaction.id);
          });

          transak.on(transak.EVENTS.TRANSAK_ORDER_FAILED, (orderData: any) => {
            console.log('Order failed:', orderData);
            toast.error('Payment failed. Please try again.');
            transak.close();
          });

          transak.on(transak.EVENTS.TRANSAK_WIDGET_CLOSE, () => {
            console.log('Widget closed');
            setIsProcessing(false);
          });

        } else {
          // Fallback to popup window
          const transakWindow = window.open(
            data.transakUrl,
            'transak-payment',
            'width=450,height=600,scrollbars=yes,resizable=yes'
          );

          const checkClosed = setInterval(() => {
            if (transakWindow?.closed) {
              clearInterval(checkClosed);
              setIsProcessing(false);
            }
          }, 1000);
        }
      } else {
        throw new Error('Failed to initialize payment');
      }
    } catch (error) {
      console.error('Payment error:', error);
      toast.error('Payment initialization failed. Please try again.');
      setIsProcessing(false);
    }
  };

  const selectedFiatCurrency = SUPPORTED_FIAT_CURRENCIES.find(c => c.code === selectedFiat);
  const selectedCryptoCurrency = SUPPORTED_CRYPTOCURRENCIES.find(c => c.code === selectedCrypto);

  return (
    <Card className={`w-full max-w-md ${className}`}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Wallet className="h-5 w-5" />
          Secure Payment with Transak
        </CardTitle>
        <div className="flex items-center gap-2">
          <Shield className="h-4 w-4 text-green-600" />
          <span className="text-sm text-muted-foreground">256-bit SSL encrypted</span>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-6">
        <div className="space-y-2">
          <p className="text-sm text-muted-foreground">Order:</p>
          <p className="font-medium">{getOrderTitle()}</p>
        </div>
        
        <div className="space-y-2">
          <p className="text-sm text-muted-foreground">Amount:</p>
          <p className="text-2xl font-bold">
            {selectedFiatCurrency?.symbol}{price.toFixed(2)} {selectedFiat}
          </p>
        </div>

        <div className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Payment Method</label>
            <div className="grid grid-cols-2 gap-2">
              <Button
                variant={paymentMethod === 'crypto' ? 'default' : 'outline'}
                onClick={() => setPaymentMethod('crypto')}
                className="h-12"
              >
                <Wallet className="h-4 w-4 mr-2" />
                Crypto
              </Button>
              <Button
                variant={paymentMethod === 'card' ? 'default' : 'outline'}
                onClick={() => setPaymentMethod('card')}
                className="h-12"
              >
                <CreditCard className="h-4 w-4 mr-2" />
                Card
              </Button>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Currency</label>
              <Select value={selectedFiat} onValueChange={setSelectedFiat}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {SUPPORTED_FIAT_CURRENCIES.map((currency) => (
                    <SelectItem key={currency.code} value={currency.code}>
                      {currency.symbol} {currency.code}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {paymentMethod === 'crypto' && (
              <div className="space-y-2">
                <label className="text-sm font-medium">Crypto</label>
                <Select value={selectedCrypto} onValueChange={setSelectedCrypto}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {SUPPORTED_CRYPTOCURRENCIES.map((crypto) => (
                      <SelectItem key={crypto.code} value={crypto.code}>
                        {crypto.code}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}
          </div>
        </div>

        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <Badge variant="secondary" className="text-xs">
              <Zap className="h-3 w-3 mr-1" />
              Instant
            </Badge>
            <Badge variant="secondary" className="text-xs">
              Low Fees
            </Badge>
            <Badge variant="secondary" className="text-xs">
              Secure
            </Badge>
          </div>
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
              Processing...
            </>
          ) : (
            <>
              {paymentMethod === 'crypto' ? (
                <Wallet className="h-4 w-4 mr-2" />
              ) : (
                <CreditCard className="h-4 w-4 mr-2" />
              )}
              Pay with {paymentMethod === 'crypto' ? selectedCryptoCurrency?.name : 'Card'}
            </>
          )}
        </Button>

        <p className="text-xs text-muted-foreground text-center">
          Powered by Transak • Supports {SUPPORTED_CRYPTOCURRENCIES.length}+ cryptocurrencies and major credit cards
        </p>
      </CardContent>
    </Card>
  );
};

export default EnhancedTransakPayment;
