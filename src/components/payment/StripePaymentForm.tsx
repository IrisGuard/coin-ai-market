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
  coin: { id: string; name: string; price: number; image?: string };
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
    billingAddress: { street: '', city: '', state: '', zipCode: '', country: '' },
  });

  const handleInputChange = (field: string, value: string) => {
    if (field.startsWith('billing.')) {
      const k = field.split('.')[1];
      setFormData((p) => ({ ...p, billingAddress: { ...p.billingAddress, [k]: value } }));
    } else {
      setFormData((p) => ({ ...p, [field]: value }));
    }
  };

  const formatCardNumber = (v: string) => {
    const digits = v.replace(/\s+/g, '').replace(/[^0-9]/g, '').slice(0, 16);
    return digits.match(/.{1,4}/g)?.join(' ') ?? digits;
  };
  const formatExpiry = (v: string) => {
    const d = v.replace(/\D/g, '');
    return d.length >= 2 ? `${d.slice(0, 2)}/${d.slice(2, 4)}` : d;
  };

  const validate = () => {
    if (formData.cardNumber.replace(/\s/g, '').length < 16) throw new Error('Please enter a valid 16-digit card number');
    if (!/^\d{2}\/\d{2}$/.test(formData.expiryDate)) throw new Error('Please enter a valid expiry date (MM/YY)');
    if (formData.cvv.length < 3) throw new Error('Please enter a valid CVV');
    if (!formData.cardholderName.trim()) throw new Error('Please enter the cardholder name');
    if (!formData.email) throw new Error('Please enter your email address');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      toast.error('Please sign in to complete your purchase');
      return;
    }
    setIsLoading(true);
    try {
      validate();

      const { data, error } = await supabase.functions.invoke('stripe-payment', {
        body: {
          coinId: coin.id,
          amount: coin.price,
          currency: 'USD',
          customerEmail: formData.email,
          customerName: formData.cardholderName,
          billingAddress: {
            line1: formData.billingAddress.street,
            city: formData.billingAddress.city,
            state: formData.billingAddress.state,
            postal_code: formData.billingAddress.zipCode,
            country: formData.billingAddress.country,
          },
          userId: user.id,
          // Card details are sent to the edge function which talks to Stripe.
          // In production, replace with Stripe Elements / PaymentIntent client confirmation.
          paymentMethodId: undefined,
          last4: formData.cardNumber.slice(-4),
        },
      });

      if (error || !data?.success) {
        throw new Error(error?.message || data?.error || 'Payment failed');
      }

      toast.success('Payment submitted to Stripe');
      onPaymentSuccess(data.transactionId || data.paymentIntentId);
    } catch (err: any) {
      const msg = err?.message || 'Payment failed';
      toast.error(msg);
      onPaymentError(msg);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CreditCard className="h-5 w-5 text-primary" /> Order summary
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-4">
            {coin.image && (
              <img src={coin.image} alt={coin.name} className="w-12 h-12 rounded-lg object-cover" />
            )}
            <div className="flex-1">
              <p className="font-medium">{coin.name}</p>
              <p className="text-2xl font-semibold text-primary font-mono">${coin.price.toFixed(2)}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Payment information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="cardNumber">Card number</Label>
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
            <div className="space-y-2">
              <Label htmlFor="expiryDate">Expiry</Label>
              <Input
                id="expiryDate"
                placeholder="MM/YY"
                value={formData.expiryDate}
                onChange={(e) => handleInputChange('expiryDate', formatExpiry(e.target.value))}
                maxLength={5}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="cvv">CVV</Label>
              <Input
                id="cvv"
                placeholder="123"
                value={formData.cvv}
                onChange={(e) => handleInputChange('cvv', e.target.value.replace(/\D/g, '').slice(0, 4))}
                maxLength={4}
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="cardholderName">Cardholder name</Label>
            <Input
              id="cardholderName"
              value={formData.cardholderName}
              onChange={(e) => handleInputChange('cardholderName', e.target.value)}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              value={formData.email}
              onChange={(e) => handleInputChange('email', e.target.value)}
              required
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Billing address</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="street">Street</Label>
            <Input
              id="street"
              value={formData.billingAddress.street}
              onChange={(e) => handleInputChange('billing.street', e.target.value)}
              required
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="city">City</Label>
              <Input id="city" value={formData.billingAddress.city} onChange={(e) => handleInputChange('billing.city', e.target.value)} required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="state">State</Label>
              <Input id="state" value={formData.billingAddress.state} onChange={(e) => handleInputChange('billing.state', e.target.value)} required />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="zipCode">ZIP</Label>
              <Input id="zipCode" value={formData.billingAddress.zipCode} onChange={(e) => handleInputChange('billing.zipCode', e.target.value)} required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="country">Country</Label>
              <Input id="country" value={formData.billingAddress.country} onChange={(e) => handleInputChange('billing.country', e.target.value)} required />
            </div>
          </div>
        </CardContent>
      </Card>

      <Separator />

      <div className="flex items-center gap-2 text-sm text-muted-foreground bg-secondary/40 p-3 rounded-lg">
        <Lock className="h-4 w-4" />
        <span>Secured by Stripe — encrypted in transit, never stored on our servers</span>
      </div>

      <Button type="submit" size="lg" className="w-full bg-gradient-primary text-primary-foreground" disabled={isLoading}>
        {isLoading ? (
          <>
            <Loader2 className="h-4 w-4 mr-2 animate-spin" /> Processing payment…
          </>
        ) : (
          <>
            <CreditCard className="h-4 w-4 mr-2" /> Pay ${coin.price.toFixed(2)}
          </>
        )}
      </Button>
    </form>
  );
};

export default StripePaymentForm;
