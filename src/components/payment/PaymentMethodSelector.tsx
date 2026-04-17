import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { CreditCard, Banknote, ArrowRight } from 'lucide-react';

interface PaymentMethodSelectorProps {
  onMethodSelect: (method: 'stripe' | 'traditional') => void;
  coin: { name: string; price: number };
}

const PaymentMethodSelector = ({ onMethodSelect, coin }: PaymentMethodSelectorProps) => {
  const [selectedMethod, setSelectedMethod] = useState<string>('');

  const paymentMethods = [
    {
      id: 'stripe' as const,
      name: 'Credit / debit card',
      description: 'Secure card payment processed by Stripe.',
      icon: CreditCard,
      features: ['Instant authorisation', 'All major cards', 'Bank-grade encryption'],
      recommended: true,
      processingTime: 'Instant',
      fees: '2.9% + $0.30',
    },
    {
      id: 'traditional' as const,
      name: 'Bank transfer / credit',
      description: 'Use platform credit or wire via SEPA / SWIFT.',
      icon: Banknote,
      features: ['Internal credit', 'IBAN / SWIFT', 'Manual confirmation'],
      recommended: false,
      processingTime: '1–3 business days',
      fees: 'Bank rates apply',
    },
  ];

  const handleMethodSelect = (methodId: 'stripe' | 'traditional') => {
    setSelectedMethod(methodId);
    setTimeout(() => onMethodSelect(methodId), 200);
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Choose payment method</CardTitle>
        </CardHeader>
        <CardContent className="flex items-center justify-between gap-4">
          <div>
            <p className="font-medium text-lg">{coin.name}</p>
            <p className="text-2xl font-semibold text-primary font-mono">${coin.price.toFixed(2)}</p>
          </div>
          <Badge variant="outline" className="border-primary/30 text-primary">Select to continue</Badge>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {paymentMethods.map((method) => {
          const Icon = method.icon;
          const isSelected = selectedMethod === method.id;
          return (
            <Card
              key={method.id}
              className={`cursor-pointer transition-all ${
                isSelected
                  ? 'border-primary shadow-glow scale-[1.01]'
                  : 'border-border hover:border-primary/40'
              }`}
              onClick={() => handleMethodSelect(method.id)}
            >
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className="grid place-items-center w-11 h-11 rounded-xl bg-primary/10 text-primary">
                      <Icon className="h-5 w-5" />
                    </div>
                    <div>
                      <CardTitle className="text-lg">{method.name}</CardTitle>
                      {method.recommended && (
                        <Badge className="mt-1 bg-primary/10 text-primary border-primary/20" variant="outline">
                          Recommended
                        </Badge>
                      )}
                    </div>
                  </div>
                  <ArrowRight className={`h-5 w-5 transition-transform ${isSelected ? 'translate-x-1 text-primary' : 'text-muted-foreground'}`} />
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground mb-3">{method.description}</p>
                <ul className="space-y-1.5 mb-4">
                  {method.features.map((f) => (
                    <li key={f} className="flex items-center gap-2 text-sm text-muted-foreground">
                      <span className="w-1.5 h-1.5 rounded-full bg-primary" />
                      {f}
                    </li>
                  ))}
                </ul>
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>Processing: {method.processingTime}</span>
                  <span>Fees: {method.fees}</span>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
};

export default PaymentMethodSelector;
