
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Wallet, CreditCard, Bitcoin, Loader2, ExternalLink } from 'lucide-react';
import { useEnhancedTransakPayment } from '@/hooks/useEnhancedTransakPayment';
import { toast } from 'sonner';
import TransakWidget from './TransakWidget';

interface EnhancedTransakPaymentProps {
  orderType: 'coin_purchase' | 'subscription' | 'store_upgrade';
  coinId?: string;
  coinName?: string;
  price: number;
  subscriptionPlan?: string;
  onPaymentSuccess: () => void;
}

const EnhancedTransakPayment = ({
  orderType,
  coinId,
  coinName,
  price,
  subscriptionPlan,
  onPaymentSuccess
}: EnhancedTransakPaymentProps) => {
  const { createPayment, isLoading } = useEnhancedTransakPayment();
  const [selectedCrypto, setSelectedCrypto] = useState<string>('BTC');
  const [useWidget, setUseWidget] = useState<boolean>(true);

  const cryptoOptions = [
    { code: 'BTC', name: 'Bitcoin', icon: Bitcoin },
    { code: 'ETH', name: 'Ethereum', icon: Wallet },
    { code: 'USDC', name: 'USD Coin', icon: CreditCard },
    { code: 'SOL', name: 'Solana', icon: Wallet }
  ];

  const handlePaymentSuccess = (transactionId: string) => {
    toast.success('Payment completed successfully!');
    onPaymentSuccess();
  };

  const handlePaymentFailed = (error: string) => {
    toast.error(`Payment failed: ${error}`);
  };

  const handleLegacyPayment = async () => {
    try {
      const result = await createPayment({
        orderType,
        coinId,
        amount: price,
        currency: 'USD',
        cryptoCurrency: selectedCrypto,
        subscriptionPlan
      });

      if (result?.paymentUrl) {
        // Open Transak in a new window
        const transakWindow = window.open(
          result.paymentUrl,
          'transak-payment',
          'width=500,height=700,scrollbars=yes,resizable=yes'
        );

        // Monitor for window closure or success
        const checkClosed = setInterval(() => {
          if (transakWindow?.closed) {
            clearInterval(checkClosed);
            // Check payment status after window closes
            setTimeout(() => {
              onPaymentSuccess();
            }, 1000);
          }
        }, 1000);

        toast.success('Payment window opened. Complete your payment in the new window.');
      }
    } catch (error) {
      console.error('Payment initiation failed:', error);
      toast.error('Failed to initiate payment. Please try again.');
    }
  };

  // Use the new TransakWidget for better integration
  if (useWidget) {
    return (
      <TransakWidget
        orderType={orderType}
        coinId={coinId}
        coinName={coinName}
        amount={price}
        currency="USD"
        cryptoCurrency={selectedCrypto}
        subscriptionPlan={subscriptionPlan}
        onPaymentSuccess={handlePaymentSuccess}
        onPaymentFailed={handlePaymentFailed}
      />
    );
  }

  // Fallback to legacy implementation
  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Wallet className="h-5 w-5 text-blue-600" />
          Crypto & Card Payment
          <Badge variant="secondary">Powered by Transak</Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Payment Method Toggle */}
        <div className="flex gap-2">
          <Button
            variant={useWidget ? 'default' : 'outline'}
            onClick={() => setUseWidget(true)}
            size="sm"
          >
            Widget Mode
          </Button>
          <Button
            variant={!useWidget ? 'default' : 'outline'}
            onClick={() => setUseWidget(false)}
            size="sm"
          >
            Popup Mode
          </Button>
        </div>

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
              <span className="font-bold">${price.toFixed(2)}</span>
            </div>
          </div>
        </div>

        {/* Crypto Selection */}
        <div className="space-y-3">
          <h4 className="font-medium">Select Cryptocurrency</h4>
          <div className="grid grid-cols-2 gap-2">
            {cryptoOptions.map((crypto) => {
              const IconComponent = crypto.icon;
              return (
                <Button
                  key={crypto.code}
                  variant={selectedCrypto === crypto.code ? 'default' : 'outline'}
                  onClick={() => setSelectedCrypto(crypto.code)}
                  className="flex items-center gap-2 h-12"
                >
                  <IconComponent className="h-4 w-4" />
                  <div className="text-left">
                    <div className="text-sm font-medium">{crypto.code}</div>
                    <div className="text-xs opacity-70">{crypto.name}</div>
                  </div>
                </Button>
              );
            })}
          </div>
        </div>

        {/* Payment Button */}
        <Button
          onClick={handleLegacyPayment}
          disabled={isLoading}
          className="w-full h-12 text-lg"
        >
          {isLoading ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin mr-2" />
              Processing...
            </>
          ) : (
            <>
              <ExternalLink className="h-4 w-4 mr-2" />
              Pay ${price.toFixed(2)} with {selectedCrypto}
            </>
          )}
        </Button>

        {/* Payment Info */}
        <div className="text-xs text-gray-600 space-y-1">
          <p>• Supports credit cards, debit cards, and bank transfers</p>
          <p>• Secure payment processing by Transak</p>
          <p>• Instant confirmation upon successful payment</p>
          <p>• Multiple cryptocurrency options available</p>
        </div>
      </CardContent>
    </Card>
  );
};

export default EnhancedTransakPayment;
