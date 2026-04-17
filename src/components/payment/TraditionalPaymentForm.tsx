import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Banknote, Loader2, CheckCircle, DollarSign } from 'lucide-react';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

interface TraditionalPaymentFormProps {
  coin: { id: string; name: string; price: number; image?: string };
  onPaymentSuccess: (transactionId: string) => void;
  onPaymentError: (error: string) => void;
}

const PAYMENT_METHODS = [
  {
    id: 'internal_credit',
    name: 'Internal credit',
    description: 'Use your platform credit balance for instant settlement.',
    icon: DollarSign,
    processingTime: 'Instant',
    fees: '0%',
  },
  {
    id: 'bank_transfer',
    name: 'Bank transfer',
    description: 'Direct bank-to-bank transfer (IBAN/SWIFT).',
    icon: Banknote,
    processingTime: '1–3 business days',
    fees: 'Bank rates apply',
  },
] as const;

type MethodId = (typeof PAYMENT_METHODS)[number]['id'];

const TraditionalPaymentForm = ({ coin, onPaymentSuccess, onPaymentError }: TraditionalPaymentFormProps) => {
  const { user } = useAuth();
  const [selectedMethod, setSelectedMethod] = useState<MethodId | ''>('');
  const [isLoading, setIsLoading] = useState(false);

  const handlePayment = async (methodId: MethodId) => {
    if (!user) {
      toast.error('Please sign in to continue');
      return;
    }
    setIsLoading(true);
    setSelectedMethod(methodId);

    try {
      const status = methodId === 'internal_credit' ? 'completed' : 'pending';
      const { data: tx, error } = await supabase
        .from('payment_transactions')
        .insert({
          user_id: user.id,
          coin_id: coin.id,
          amount: coin.price,
          currency: 'USD',
          status,
          payment_method: methodId,
          order_type: 'coin_purchase',
        })
        .select()
        .single();

      if (error || !tx) throw error || new Error('Failed to record transaction');

      toast.success(
        status === 'completed'
          ? 'Payment completed successfully'
          : 'Payment initiated — confirmation will follow'
      );
      onPaymentSuccess(tx.id);
    } catch (err: any) {
      const msg = err?.message || 'Payment failed';
      toast.error(msg);
      onPaymentError(msg);
    } finally {
      setIsLoading(false);
      setSelectedMethod('');
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <DollarSign className="h-5 w-5 text-primary" /> Alternative payment methods
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-4 mb-4">
            {coin.image && <img src={coin.image} alt={coin.name} className="w-12 h-12 rounded-lg object-cover" />}
            <div className="flex-1">
              <p className="font-medium">{coin.name}</p>
              <p className="text-2xl font-semibold text-primary font-mono">${coin.price.toFixed(2)}</p>
            </div>
          </div>
          <p className="text-sm text-muted-foreground">
            Select a payment method below. Bank transfers are confirmed manually after settlement.
          </p>
        </CardContent>
      </Card>

      <div className="space-y-3">
        {PAYMENT_METHODS.map((method) => {
          const Icon = method.icon;
          const isProcessing = isLoading && selectedMethod === method.id;
          return (
            <Card key={method.id} className="border-border hover:border-primary/40 transition-colors">
              <CardContent className="p-4">
                <div className="flex items-center justify-between gap-4">
                  <div className="flex items-center gap-4 flex-1">
                    <div className="grid place-items-center w-11 h-11 rounded-xl bg-primary/10 text-primary">
                      <Icon className="h-5 w-5" />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-semibold">{method.name}</h4>
                      <p className="text-sm text-muted-foreground">{method.description}</p>
                      <div className="flex gap-4 mt-1 text-xs text-muted-foreground">
                        <span>Processing: {method.processingTime}</span>
                        <span>Fees: {method.fees}</span>
                      </div>
                    </div>
                  </div>
                  <Button
                    onClick={() => handlePayment(method.id)}
                    disabled={isLoading}
                    variant={method.id === 'internal_credit' ? 'default' : 'outline'}
                    className="min-w-[140px]"
                  >
                    {isProcessing ? (
                      <>
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" /> Processing…
                      </>
                    ) : method.id === 'internal_credit' ? (
                      <>
                        <CheckCircle className="h-4 w-4 mr-2" /> Pay now
                      </>
                    ) : (
                      <>Initiate</>
                    )}
                  </Button>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <Separator />

      <Card className="bg-secondary/40 border-border">
        <CardContent className="p-4">
          <ul className="text-sm text-muted-foreground space-y-1">
            <li>• Internal credit settles instantly</li>
            <li>• Bank transfers may take 1–3 business days</li>
            <li>• Email confirmation sent for every payment</li>
          </ul>
        </CardContent>
      </Card>
    </div>
  );
};

export default TraditionalPaymentForm;
