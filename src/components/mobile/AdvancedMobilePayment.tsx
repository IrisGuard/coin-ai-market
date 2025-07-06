import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { 
  CreditCard, Smartphone, Wallet, Globe, 
  CheckCircle, AlertCircle, Loader2 
} from 'lucide-react';
import { usePaymentMethods } from '@/hooks/usePaymentMethods';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from '@/hooks/use-toast';
import { useAdvancedMobilePWA } from '@/hooks/useAdvancedMobilePWA';

interface AdvancedMobilePaymentProps {
  coinId: string;
  coinName: string;
  coinPrice: number;
  onPaymentSuccess?: (transactionId: string) => void;
}

interface PaymentMethod {
  id: string;
  name: string;
  type: 'stripe' | 'transak' | 'mobile_wallet' | 'crypto';
  icon: React.ReactNode;
  fees: number;
  processingTime: string;
  currencies: string[];
  enabled: boolean;
}

const AdvancedMobilePayment: React.FC<AdvancedMobilePaymentProps> = ({
  coinId,
  coinName,
  coinPrice,
  onPaymentSuccess
}) => {
  const { user } = useAuth();
  const { processStripePayment, processTraditionalPayment, isLoading } = usePaymentMethods();
  const { isOnline, sendNotification } = useAdvancedMobilePWA();
  
  const [selectedMethod, setSelectedMethod] = useState<string>('');
  const [paymentAmount, setPaymentAmount] = useState(coinPrice);
  const [selectedCurrency, setSelectedCurrency] = useState('USD');
  const [processing, setProcessing] = useState(false);

  const paymentMethods: PaymentMethod[] = [
    {
      id: 'stripe_card',
      name: 'Credit/Debit Card',
      type: 'stripe',
      icon: <CreditCard className="h-5 w-5" />,
      fees: 2.9,
      processingTime: 'Instant',
      currencies: ['USD', 'EUR', 'GBP'],
      enabled: isOnline
    },
    {
      id: 'transak_crypto',
      name: 'Crypto Payment',
      type: 'transak',
      icon: <Wallet className="h-5 w-5" />,
      fees: 1.5,
      processingTime: '5-15 min',
      currencies: ['BTC', 'ETH', 'USDC', 'USDT'],
      enabled: isOnline
    },
    {
      id: 'mobile_wallet',
      name: 'Mobile Wallet',
      type: 'mobile_wallet',
      icon: <Smartphone className="h-5 w-5" />,
      fees: 1.0,
      processingTime: 'Instant',
      currencies: ['USD'],
      enabled: 'PaymentRequest' in window
    },
    {
      id: 'global_payment',
      name: 'Global Payment',
      type: 'crypto',
      icon: <Globe className="h-5 w-5" />,
      fees: 0.5,
      processingTime: '1-3 min',
      currencies: ['USD', 'EUR', 'JPY', 'CNY'],
      enabled: isOnline
    }
  ];

  const selectedMethodData = paymentMethods.find(m => m.id === selectedMethod);
  const totalWithFees = paymentAmount + (paymentAmount * (selectedMethodData?.fees || 0) / 100);

  const handlePayment = async () => {
    if (!selectedMethod || !user) return;

    setProcessing(true);
    
    try {
      let result;
      
      switch (selectedMethodData?.type) {
        case 'stripe':
          result = await processStripePayment({
            coinId,
            amount: totalWithFees,
            currency: selectedCurrency,
            orderType: 'coin_purchase',
            paymentMethodId: 'stripe_card',
            customerInfo: {
              name: user.user_metadata?.full_name || 'User',
              email: user.email || ''
            },
            billingAddress: {}
          });
          break;
          
        case 'mobile_wallet':
          result = await processMobileWalletPayment();
          break;
          
        case 'transak':
        case 'crypto':
          result = await processTraditionalPayment({
            coinId,
            amount: totalWithFees,
            currency: selectedCurrency,
            orderType: 'coin_purchase',
            paymentMethod: selectedMethod
          });
          break;
          
        default:
          throw new Error('Unsupported payment method');
      }

      if (result.success) {
        await sendNotification('Payment Successful!', {
          body: `Successfully purchased ${coinName} for ${selectedCurrency} ${totalWithFees.toFixed(2)}`,
          icon: '/icons/icon-192x192.png'
        });
        
        onPaymentSuccess?.(result.transactionId || '');
        
        toast({
          title: "Payment Successful!",
          description: `You've successfully purchased ${coinName}`,
        });
      } else {
        throw new Error(result.error || 'Payment failed');
      }
      
    } catch (error) {
      console.error('Payment error:', error);
      toast({
        title: "Payment Failed",
        description: error instanceof Error ? error.message : 'An error occurred',
        variant: "destructive",
      });
    } finally {
      setProcessing(false);
    }
  };

  const processMobileWalletPayment = async () => {
    if (!('PaymentRequest' in window)) {
      throw new Error('Mobile wallet payments not supported');
    }

    const paymentRequest = new PaymentRequest(
      [
        {
          supportedMethods: 'basic-card',
          data: {
            supportedNetworks: ['visa', 'mastercard', 'amex'],
            supportedTypes: ['debit', 'credit']
          }
        }
      ],
      {
        total: {
          label: `Purchase ${coinName}`,
          amount: { currency: selectedCurrency, value: totalWithFees.toFixed(2) }
        },
        displayItems: [
          {
            label: coinName,
            amount: { currency: selectedCurrency, value: paymentAmount.toFixed(2) }
          },
          {
            label: 'Processing Fee',
            amount: { currency: selectedCurrency, value: (totalWithFees - paymentAmount).toFixed(2) }
          }
        ]
      }
    );

    const paymentResponse = await paymentRequest.show();
    await paymentResponse.complete('success');
    
    return {
      success: true,
      transactionId: `mobile_${Date.now()}`,
      processingTime: Date.now()
    };
  };

  const convertCurrency = async (amount: number, from: string, to: string) => {
    // Simplified currency conversion - in production, use real exchange rates
    const rates: Record<string, number> = {
      'USD': 1,
      'EUR': 0.85,
      'GBP': 0.73,
      'BTC': 0.000023,
      'ETH': 0.00041,
      'USDC': 1,
      'USDT': 1,
      'JPY': 110,
      'CNY': 6.4
    };
    
    return (amount / rates[from]) * rates[to];
  };

  useEffect(() => {
    if (selectedCurrency !== 'USD') {
      convertCurrency(coinPrice, 'USD', selectedCurrency).then(setPaymentAmount);
    } else {
      setPaymentAmount(coinPrice);
    }
  }, [selectedCurrency, coinPrice]);

  return (
    <div className="space-y-6">
      {/* Payment Amount Display */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CreditCard className="h-5 w-5" />
            Payment Details
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">Item:</span>
              <span className="font-medium">{coinName}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">Base Price:</span>
              <span className="font-medium">{selectedCurrency} {paymentAmount.toFixed(2)}</span>
            </div>
            {selectedMethodData && (
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Processing Fee ({selectedMethodData.fees}%):</span>
                <span className="font-medium">{selectedCurrency} {(totalWithFees - paymentAmount).toFixed(2)}</span>
              </div>
            )}
            <div className="border-t pt-2">
              <div className="flex justify-between items-center text-lg font-bold">
                <span>Total:</span>
                <span className="text-primary">{selectedCurrency} {totalWithFees.toFixed(2)}</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Currency Selection */}
      <Card>
        <CardHeader>
          <CardTitle>Select Currency</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-3 gap-2">
            {['USD', 'EUR', 'GBP', 'BTC', 'ETH', 'USDC'].map((currency) => (
              <Button
                key={currency}
                variant={selectedCurrency === currency ? 'default' : 'outline'}
                size="sm"
                onClick={() => setSelectedCurrency(currency)}
                className="text-xs"
              >
                {currency}
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Payment Method Selection */}
      <Card>
        <CardHeader>
          <CardTitle>Payment Method</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {paymentMethods.map((method) => (
              <div
                key={method.id}
                className={`p-3 border rounded-lg cursor-pointer transition-all ${
                  selectedMethod === method.id
                    ? 'border-primary bg-primary/5'
                    : 'border-border hover:border-primary/50'
                } ${!method.enabled ? 'opacity-50 cursor-not-allowed' : ''}`}
                onClick={() => method.enabled && setSelectedMethod(method.id)}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    {method.icon}
                    <div>
                      <div className="font-medium">{method.name}</div>
                      <div className="text-xs text-muted-foreground">
                        {method.fees}% fee • {method.processingTime}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {method.enabled ? (
                      <CheckCircle className="h-4 w-4 text-green-600" />
                    ) : (
                      <AlertCircle className="h-4 w-4 text-orange-600" />
                    )}
                  </div>
                </div>
                
                <div className="mt-2 flex flex-wrap gap-1">
                  {method.currencies.slice(0, 4).map((currency) => (
                    <Badge key={currency} variant="secondary" className="text-xs">
                      {currency}
                    </Badge>
                  ))}
                  {method.currencies.length > 4 && (
                    <Badge variant="secondary" className="text-xs">
                      +{method.currencies.length - 4} more
                    </Badge>
                  )}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Process Payment Button */}
      <Button
        onClick={handlePayment}
        disabled={!selectedMethod || processing || isLoading || !user}
        className="w-full h-12"
        size="lg"
      >
        {processing || isLoading ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin mr-2" />
            Processing Payment...
          </>
        ) : (
          <>
            <CreditCard className="h-4 w-4 mr-2" />
            Pay {selectedCurrency} {totalWithFees.toFixed(2)}
          </>
        )}
      </Button>

      {!isOnline && (
        <div className="p-3 bg-orange-50 border border-orange-200 rounded-lg">
          <div className="flex items-center gap-2 text-orange-700">
            <AlertCircle className="h-4 w-4" />
            <span className="text-sm">Some payment methods unavailable offline</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdvancedMobilePayment;