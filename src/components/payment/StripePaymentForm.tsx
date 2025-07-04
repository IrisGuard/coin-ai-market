import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { CreditCard, Lock, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

interface StripePaymentFormProps {
  coin: {
    id: string;
    name: string;
    price: number;
    image?: string;
  };
  onPaymentSuccess: (transactionId: string) => void;
  onPaymentError: (error: string) => void;
}

const StripePaymentForm = ({ coin, onPaymentSuccess, onPaymentError }: StripePaymentFormProps) => {
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    cardNumber: '',
    expiryDate: '',
    cvv: '',
    cardholderName: '',
    email: user?.email || '',
    billingAddress: {
      street: '',
      city: '',
      state: '',
      zipCode: '',
      country: ''
    }
  });

  const handleInputChange = (field: string, value: string) => {
    if (field.startsWith('billing.')) {
      const addressField = field.split('.')[1];
      setFormData(prev => ({
        ...prev,
        billingAddress: {
          ...prev.billingAddress,
          [addressField]: value
        }
      }));
    } else {
      setFormData(prev => ({ ...prev, [field]: value }));
    }
  };

  const formatCardNumber = (value: string) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    const matches = v.match(/\d{4,16}/g);
    const match = matches && matches[0] || '';
    const parts = [];
    for (let i = 0, len = match.length; i < len; i += 4) {
      parts.push(match.substring(i, i + 4));
    }
    if (parts.length) {
      return parts.join(' ');
    } else {
      return v;
    }
  };

  const formatExpiryDate = (value: string) => {
    const v = value.replace(/\D/g, '');
    if (v.length >= 2) {
      return v.substring(0, 2) + '/' + v.substring(2, 4);
    }
    return v;
  };

  const validateForm = () => {
    if (!formData.cardNumber || formData.cardNumber.replace(/\s/g, '').length < 16) {
      throw new Error('Please enter a valid card number');
    }
    if (!formData.expiryDate || !formData.expiryDate.match(/^\d{2}\/\d{2}$/)) {
      throw new Error('Please enter a valid expiry date (MM/YY)');
    }
    if (!formData.cvv || formData.cvv.length < 3) {
      throw new Error('Please enter a valid CVV');
    }
    if (!formData.cardholderName.trim()) {
      throw new Error('Please enter the cardholder name');
    }
    if (!formData.email) {
      throw new Error('Please enter your email address');
    }
  };

  const simulateStripePayment = async () => {
    // Simulate Stripe payment processing
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Simulate successful payment
    const mockTransactionId = `stripe_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    return {
      success: true,
      transactionId: mockTransactionId,
      paymentMethodLast4: formData.cardNumber.slice(-4),
      amount: coin.price
    };
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      validateForm();

      // Simulate payment processing with Stripe
      const paymentResult = await simulateStripePayment();

      if (paymentResult.success) {
        // Create transaction record in Supabase
        const { data: transaction, error } = await supabase
          .from('payment_transactions')
          .insert({
            user_id: user?.id,
            coin_id: coin.id,
            amount: coin.price,
            currency: 'USD',
            status: 'completed',
            payment_method: 'stripe_card',
            order_type: 'coin_purchase',
            stripe_payment_intent_id: paymentResult.transactionId
          })
          .select()
          .single();

        if (error) {
          throw error;
        }

        toast.success('Payment successful!');
        onPaymentSuccess(transaction.id);
      } else {
        throw new Error('Payment processing failed');
      }
    } catch (error) {
      console.error('Payment error:', error);
      const errorMessage = error instanceof Error ? error.message : 'Payment failed';
      toast.error(errorMessage);
      onPaymentError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Order Summary */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CreditCard className="h-5 w-5" />
            Order Summary
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-4">
            {coin.image && (
              <img src={coin.image} alt={coin.name} className="w-12 h-12 rounded object-cover" />
            )}
            <div className="flex-1">
              <p className="font-medium">{coin.name}</p>
              <p className="text-2xl font-bold text-green-600">${coin.price.toFixed(2)}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Payment Information */}
      <Card>
        <CardHeader>
          <CardTitle>Payment Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Card Number */}
          <div className="space-y-2">
            <Label htmlFor="cardNumber">Card Number</Label>
            <Input
              id="cardNumber"
              placeholder="1234 5678 9012 3456"
              value={formData.cardNumber}
              onChange={(e) => handleInputChange('cardNumber', formatCardNumber(e.target.value))}
              maxLength={19}
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            {/* Expiry Date */}
            <div className="space-y-2">
              <Label htmlFor="expiryDate">Expiry Date</Label>
              <Input
                id="expiryDate"
                placeholder="MM/YY"
                value={formData.expiryDate}
                onChange={(e) => handleInputChange('expiryDate', formatExpiryDate(e.target.value))}
                maxLength={5}
                required
              />
            </div>

            {/* CVV */}
            <div className="space-y-2">
              <Label htmlFor="cvv">CVV</Label>
              <Input
                id="cvv"
                placeholder="123"
                value={formData.cvv}
                onChange={(e) => handleInputChange('cvv', e.target.value.replace(/\D/g, '').substring(0, 4))}
                maxLength={4}
                required
              />
            </div>
          </div>

          {/* Cardholder Name */}
          <div className="space-y-2">
            <Label htmlFor="cardholderName">Cardholder Name</Label>
            <Input
              id="cardholderName"
              placeholder="John Doe"
              value={formData.cardholderName}
              onChange={(e) => handleInputChange('cardholderName', e.target.value)}
              required
            />
          </div>

          {/* Email */}
          <div className="space-y-2">
            <Label htmlFor="email">Email Address</Label>
            <Input
              id="email"
              type="email"
              placeholder="john@example.com"
              value={formData.email}
              onChange={(e) => handleInputChange('email', e.target.value)}
              required
            />
          </div>
        </CardContent>
      </Card>

      {/* Billing Address */}
      <Card>
        <CardHeader>
          <CardTitle>Billing Address</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="street">Street Address</Label>
            <Input
              id="street"
              placeholder="123 Main Street"
              value={formData.billingAddress.street}
              onChange={(e) => handleInputChange('billing.street', e.target.value)}
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="city">City</Label>
              <Input
                id="city"
                placeholder="New York"
                value={formData.billingAddress.city}
                onChange={(e) => handleInputChange('billing.city', e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="state">State</Label>
              <Input
                id="state"
                placeholder="NY"
                value={formData.billingAddress.state}
                onChange={(e) => handleInputChange('billing.state', e.target.value)}
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="zipCode">ZIP Code</Label>
              <Input
                id="zipCode"
                placeholder="10001"
                value={formData.billingAddress.zipCode}
                onChange={(e) => handleInputChange('billing.zipCode', e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="country">Country</Label>
              <Input
                id="country"
                placeholder="United States"
                value={formData.billingAddress.country}
                onChange={(e) => handleInputChange('billing.country', e.target.value)}
                required
              />
            </div>
          </div>
        </CardContent>
      </Card>

      <Separator />

      {/* Security Notice */}
      <div className="flex items-center gap-2 text-sm text-gray-600 bg-blue-50 p-3 rounded-lg">
        <Lock className="h-4 w-4" />
        <span>Your payment information is encrypted and secure</span>
      </div>

      {/* Submit Button */}
      <Button 
        type="submit" 
        className="w-full" 
        size="lg"
        disabled={isLoading}
      >
        {isLoading ? (
          <>
            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
            Processing Payment...
          </>
        ) : (
          <>
            <CreditCard className="h-4 w-4 mr-2" />
            Pay ${coin.price.toFixed(2)}
          </>
        )}
      </Button>
    </form>
  );
};

export default StripePaymentForm;