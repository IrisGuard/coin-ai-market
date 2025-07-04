import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  CreditCard, 
  DollarSign, 
  Wallet, 
  Bitcoin,
  ArrowRight
} from 'lucide-react';

interface PaymentMethodSelectorProps {
  onMethodSelect: (method: 'stripe' | 'traditional' | 'crypto' | 'direct') => void;
  coin: {
    name: string;
    price: number;
  };
}

const PaymentMethodSelector = ({ onMethodSelect, coin }: PaymentMethodSelectorProps) => {
  const [selectedMethod, setSelectedMethod] = useState<string>('');

  const paymentMethods = [
    {
      id: 'stripe',
      name: 'Credit Card',
      description: 'Secure payment with Stripe',
      icon: CreditCard,
      features: ['Instant processing', 'All major cards accepted', 'Secure encryption'],
      recommended: true,
      processingTime: 'Instant',
      fees: '2.9% + $0.30'
    },
    {
      id: 'traditional',
      name: 'Traditional Payment',
      description: 'Bank transfer, digital wallets, credits',
      icon: DollarSign,
      features: ['Bank transfers', 'Digital wallets', 'Internal credits'],
      recommended: false,
      processingTime: 'Varies',
      fees: 'Low fees'
    },
    {
      id: 'crypto',
      name: 'Cryptocurrency',
      description: 'Pay with crypto via Transak',
      icon: Wallet,
      features: ['Multiple cryptocurrencies', 'Fiat on-ramp', 'Global access'],
      recommended: false,
      processingTime: '5-15 minutes',
      fees: '1-3%'
    },
    {
      id: 'direct',
      name: 'Direct Transfer',
      description: 'Transfer directly to dealer',
      icon: Bitcoin,
      features: ['Lowest fees', 'Direct to seller', 'Manual confirmation'],
      recommended: false,
      processingTime: 'Manual',
      fees: 'Minimal'
    }
  ];

  const handleMethodSelect = (methodId: string) => {
    setSelectedMethod(methodId);
    setTimeout(() => {
      onMethodSelect(methodId as any);
    }, 300);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card>
        <CardHeader>
          <CardTitle>Choose Payment Method</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium text-lg">{coin.name}</p>
              <p className="text-2xl font-bold text-green-600">${coin.price.toFixed(2)}</p>
            </div>
            <Badge className="bg-blue-100 text-blue-800">
              Select payment method to continue
            </Badge>
          </div>
        </CardContent>
      </Card>

      {/* Payment Methods Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {paymentMethods.map((method) => {
          const Icon = method.icon;
          const isSelected = selectedMethod === method.id;

          return (
            <Card 
              key={method.id}
              className={`cursor-pointer border-2 transition-all hover:shadow-lg ${
                isSelected 
                  ? 'border-blue-500 bg-blue-50 scale-105' 
                  : method.recommended
                    ? 'border-green-500 hover:border-green-600'
                    : 'border-gray-200 hover:border-blue-300'
              }`}
              onClick={() => handleMethodSelect(method.id)}
            >
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className={`p-2 rounded-lg ${
                      method.recommended ? 'bg-green-100' : 'bg-blue-100'
                    }`}>
                      <Icon className={`h-6 w-6 ${
                        method.recommended ? 'text-green-600' : 'text-blue-600'
                      }`} />
                    </div>
                    <div>
                      <CardTitle className="text-lg">{method.name}</CardTitle>
                      {method.recommended && (
                        <Badge className="bg-green-100 text-green-800 text-xs">
                          Recommended
                        </Badge>
                      )}
                    </div>
                  </div>
                  <ArrowRight className={`h-5 w-5 transition-transform ${
                    isSelected ? 'scale-110 text-blue-600' : 'text-gray-400'
                  }`} />
                </div>
              </CardHeader>

              <CardContent>
                <p className="text-gray-600 mb-3">{method.description}</p>
                
                <div className="space-y-2 mb-4">
                  {method.features.map((feature, index) => (
                    <div key={index} className="flex items-center gap-2">
                      <div className="w-1.5 h-1.5 bg-blue-500 rounded-full"></div>
                      <span className="text-sm text-gray-600">{feature}</span>
                    </div>
                  ))}
                </div>

                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Processing: {method.processingTime}</span>
                  <span className="text-gray-500">Fees: {method.fees}</span>
                </div>

                <Button 
                  className={`w-full mt-3 ${
                    method.recommended 
                      ? 'bg-green-600 hover:bg-green-700' 
                      : ''
                  }`}
                  variant={method.recommended ? 'default' : 'outline'}
                >
                  Select {method.name}
                </Button>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Security Notice */}
      <Card className="bg-blue-50 border-blue-200">
        <CardContent className="p-4">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
            <h4 className="font-semibold text-blue-800">Secure Payment Processing</h4>
          </div>
          <p className="text-sm text-blue-700">
            All payment methods are secured with industry-standard encryption. 
            Your financial information is never stored on our servers and is processed 
            through trusted payment providers.
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default PaymentMethodSelector;