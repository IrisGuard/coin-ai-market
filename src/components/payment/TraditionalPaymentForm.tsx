import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { 
  CreditCard, 
  Banknote, 
  Smartphone, 
  Loader2,
  CheckCircle,
  DollarSign
} from 'lucide-react';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

interface TraditionalPaymentFormProps {
  coin: {
    id: string;
    name: string;
    price: number;
    image?: string;
  };
  onPaymentSuccess: (transactionId: string) => void;
  onPaymentError: (error: string) => void;
}

const TraditionalPaymentForm = ({ 
  coin, 
  onPaymentSuccess, 
  onPaymentError 
}: TraditionalPaymentFormProps) => {
  const { user } = useAuth();
  const [selectedMethod, setSelectedMethod] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);

  const paymentMethods = [
    {
      id: 'internal_credit',
      name: 'Internal Credit System',
      description: 'Use your platform credits for instant payment',
      icon: DollarSign,
      processingTime: 'Instant',
      fees: '0%',
      available: true
    },
    {
      id: 'bank_transfer',
      name: 'Bank Transfer',
      description: 'Direct bank-to-bank transfer',
      icon: Banknote,
      processingTime: '1-3 business days',
      fees: '$2.50',
      available: true
    },
    {
      id: 'digital_wallet',
      name: 'Digital Wallet',
      description: 'PayPal, Apple Pay, Google Pay',
      icon: Smartphone,
      processingTime: 'Instant',
      fees: '2.9% + $0.30',
      available: true
    },
    {
      id: 'check_payment',
      name: 'Check Payment',
      description: 'Mail physical check',
      icon: CreditCard,
      processingTime: '5-7 business days',
      fees: '$1.00',
      available: false
    }
  ];

  const simulatePaymentProcessing = async (method: string) => {
    // Simulate different processing times based on method
    const processingTime = method === 'internal_credit' ? 1000 : 3000;
    await new Promise(resolve => setTimeout(resolve, processingTime));
    
    // Simulate success (95% success rate)
    const success = Math.random() > 0.05;
    
    if (success) {
      const transactionId = `${method}_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      return { success: true, transactionId };
    } else {
      throw new Error('Payment processing failed. Please try again.');
    }
  };

  const handlePayment = async (methodId: string) => {
    setIsLoading(true);
    setSelectedMethod(methodId);

    try {
      const method = paymentMethods.find(m => m.id === methodId);
      if (!method) {
        throw new Error('Invalid payment method selected');
      }

      toast.info(`Processing ${method.name} payment...`);

      // Simulate payment processing
      const paymentResult = await simulatePaymentProcessing(methodId);

      if (paymentResult.success) {
        // Create transaction record
        const { data: transaction, error } = await supabase
          .from('payment_transactions')
          .insert({
            user_id: user?.id,
            coin_id: coin.id,
            amount: coin.price,
            currency: 'USD',
            status: methodId === 'internal_credit' ? 'completed' : 'pending',
            payment_method: methodId,
            order_type: 'coin_purchase'
          })
          .select()
          .single();

        if (error) {
          throw error;
        }

        toast.success(
          methodId === 'internal_credit' 
            ? 'Payment completed successfully!' 
            : 'Payment initiated! You will receive confirmation shortly.'
        );
        
        onPaymentSuccess(transaction.id);
      }
    } catch (error) {
      console.error('Payment error:', error);
      const errorMessage = error instanceof Error ? error.message : 'Payment failed';
      toast.error(errorMessage);
      onPaymentError(errorMessage);
    } finally {
      setIsLoading(false);
      setSelectedMethod('');
    }
  };

  return (
    <div className="space-y-6">
      {/* Order Summary */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <DollarSign className="h-5 w-5" />
            Traditional Payment Options
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-4 mb-4">
            {coin.image && (
              <img src={coin.image} alt={coin.name} className="w-12 h-12 rounded object-cover" />
            )}
            <div className="flex-1">
              <p className="font-medium">{coin.name}</p>
              <p className="text-2xl font-bold text-green-600">${coin.price.toFixed(2)}</p>
            </div>
          </div>
          
          <div className="bg-blue-50 p-3 rounded-lg">
            <p className="text-sm text-blue-700">
              Choose your preferred traditional payment method below. All payments are processed securely.
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Payment Methods */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Select Payment Method</h3>
        
        {paymentMethods.map((method) => {
          const Icon = method.icon;
          const isSelected = selectedMethod === method.id;
          const isProcessing = isLoading && isSelected;

          return (
            <Card 
              key={method.id} 
              className={`cursor-pointer border-2 transition-all ${
                !method.available 
                  ? 'opacity-50 cursor-not-allowed border-gray-200' 
                  : isSelected 
                    ? 'border-blue-500 bg-blue-50' 
                    : 'border-gray-200 hover:border-blue-300'
              }`}
            >
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className={`p-2 rounded-lg ${
                      method.available ? 'bg-blue-100' : 'bg-gray-100'
                    }`}>
                      <Icon className={`h-6 w-6 ${
                        method.available ? 'text-blue-600' : 'text-gray-400'
                      }`} />
                    </div>
                    
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <h4 className="font-semibold">{method.name}</h4>
                        {!method.available && (
                          <Badge variant="secondary">Coming Soon</Badge>
                        )}
                      </div>
                      <p className="text-sm text-gray-600">{method.description}</p>
                      <div className="flex gap-4 mt-1">
                        <span className="text-xs text-gray-500">
                          Processing: {method.processingTime}
                        </span>
                        <span className="text-xs text-gray-500">
                          Fees: {method.fees}
                        </span>
                      </div>
                    </div>
                  </div>

                  <Button
                    onClick={() => handlePayment(method.id)}
                    disabled={!method.available || isLoading}
                    variant={isSelected ? 'default' : 'outline'}
                    className="min-w-[120px]"
                  >
                    {isProcessing ? (
                      <>
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        Processing...
                      </>
                    ) : method.id === 'internal_credit' ? (
                      <>
                        <CheckCircle className="h-4 w-4 mr-2" />
                        Pay Now
                      </>
                    ) : (
                      <>
                        Select
                      </>
                    )}
                  </Button>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <Separator />

      {/* Information */}
      <Card className="bg-yellow-50 border-yellow-200">
        <CardContent className="p-4">
          <h4 className="font-semibold text-yellow-800 mb-2">Payment Information</h4>
          <ul className="text-sm text-yellow-700 space-y-1">
            <li>• Internal credits provide instant confirmation</li>
            <li>• Bank transfers may take 1-3 business days to process</li>
            <li>• Digital wallet payments are processed instantly</li>
            <li>• You will receive email confirmation for all payments</li>
            <li>• Contact support if you experience any issues</li>
          </ul>
        </CardContent>
      </Card>
    </div>
  );
};

export default TraditionalPaymentForm;