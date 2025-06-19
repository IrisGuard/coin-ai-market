
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { CreditCard, Building, Wallet } from 'lucide-react';
import { PaymentFormData, PaymentValidationError } from '@/types/paymentTypes';
import PaymentValidation from './PaymentValidation';

interface PaymentFormProps {
  onSubmit: (formData: PaymentFormData) => void;
  isLoading?: boolean;
  initialData?: Partial<PaymentFormData>;
}

const PaymentForm = ({ onSubmit, isLoading = false, initialData = {} }: PaymentFormProps) => {
  const [formData, setFormData] = useState<PaymentFormData>({
    amount: initialData.amount || '',
    currency: initialData.currency || 'USD',
    paymentMethod: initialData.paymentMethod || '',
    billingAddress: initialData.billingAddress || {
      street: '',
      city: '',
      state: '',
      zipCode: '',
      country: 'US'
    },
    customerInfo: initialData.customerInfo || {
      name: '',
      email: '',
      phone: ''
    }
  });

  const [isValid, setIsValid] = useState(false);
  const [validationErrors, setValidationErrors] = useState<PaymentValidationError[]>([]);

  const handleInputChange = (field: string, value: string) => {
    if (field.includes('.')) {
      const [parent, child] = field.split('.');
      setFormData(prev => ({
        ...prev,
        [parent]: {
          ...prev[parent as keyof PaymentFormData] as any,
          [child]: value
        }
      }));
    } else {
      setFormData(prev => ({ ...prev, [field]: value }));
    }
  };

  const handleValidationChange = (valid: boolean, errors: PaymentValidationError[]) => {
    setIsValid(valid);
    setValidationErrors(errors);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isValid) {
      onSubmit(formData);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Payment Method Selection */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CreditCard className="h-5 w-5" />
            Payment Method
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div 
              className={`p-4 border rounded-lg cursor-pointer transition-colors ${
                formData.paymentMethod === 'card' ? 'border-blue-500 bg-blue-50' : 'border-gray-200'
              }`}
              onClick={() => handleInputChange('paymentMethod', 'card')}
            >
              <CreditCard className="h-6 w-6 mb-2" />
              <div className="font-medium">Credit Card</div>
              <div className="text-sm text-gray-600">Visa, MasterCard, Amex</div>
            </div>
            
            <div 
              className={`p-4 border rounded-lg cursor-pointer transition-colors ${
                formData.paymentMethod === 'crypto' ? 'border-blue-500 bg-blue-50' : 'border-gray-200'
              }`}
              onClick={() => handleInputChange('paymentMethod', 'crypto')}
            >
              <Wallet className="h-6 w-6 mb-2" />
              <div className="font-medium">Cryptocurrency</div>
              <div className="text-sm text-gray-600">Bitcoin, Ethereum</div>
            </div>
            
            <div 
              className={`p-4 border rounded-lg cursor-pointer transition-colors ${
                formData.paymentMethod === 'bank_transfer' ? 'border-blue-500 bg-blue-50' : 'border-gray-200'
              }`}
              onClick={() => handleInputChange('paymentMethod', 'bank_transfer')}
            >
              <Building className="h-6 w-6 mb-2" />
              <div className="font-medium">Bank Transfer</div>
              <div className="text-sm text-gray-600">Direct bank payment</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Amount and Currency */}
      <Card>
        <CardHeader>
          <CardTitle>Payment Details</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="md:col-span-2">
              <Label htmlFor="amount">Amount</Label>
              <Input
                id="amount"
                type="number"
                step="0.01"
                placeholder="0.00"
                value={formData.amount}
                onChange={(e) => handleInputChange('amount', e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="currency">Currency</Label>
              <Select value={formData.currency} onValueChange={(value) => handleInputChange('currency', value)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="USD">USD - US Dollar</SelectItem>
                  <SelectItem value="EUR">EUR - Euro</SelectItem>
                  <SelectItem value="GBP">GBP - British Pound</SelectItem>
                  <SelectItem value="CAD">CAD - Canadian Dollar</SelectItem>
                  <SelectItem value="AUD">AUD - Australian Dollar</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Customer Information */}
      <Card>
        <CardHeader>
          <CardTitle>Customer Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="customerName">Full Name</Label>
              <Input
                id="customerName"
                placeholder="John Doe"
                value={formData.customerInfo?.name || ''}
                onChange={(e) => handleInputChange('customerInfo.name', e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="customerEmail">Email</Label>
              <Input
                id="customerEmail"
                type="email"
                placeholder="john@example.com"
                value={formData.customerInfo?.email || ''}
                onChange={(e) => handleInputChange('customerInfo.email', e.target.value)}
              />
            </div>
          </div>
          <div>
            <Label htmlFor="customerPhone">Phone (Optional)</Label>
            <Input
              id="customerPhone"
              type="tel"
              placeholder="+1 (555) 123-4567"
              value={formData.customerInfo?.phone || ''}
              onChange={(e) => handleInputChange('customerInfo.phone', e.target.value)}
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
          <div>
            <Label htmlFor="street">Street Address</Label>
            <Input
              id="street"
              placeholder="123 Main Street"
              value={formData.billingAddress?.street || ''}
              onChange={(e) => handleInputChange('billingAddress.street', e.target.value)}
            />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <Label htmlFor="city">City</Label>
              <Input
                id="city"
                placeholder="New York"
                value={formData.billingAddress?.city || ''}
                onChange={(e) => handleInputChange('billingAddress.city', e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="state">State</Label>
              <Input
                id="state"
                placeholder="NY"
                value={formData.billingAddress?.state || ''}
                onChange={(e) => handleInputChange('billingAddress.state', e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="zipCode">ZIP Code</Label>
              <Input
                id="zipCode"
                placeholder="10001"
                value={formData.billingAddress?.zipCode || ''}
                onChange={(e) => handleInputChange('billingAddress.zipCode', e.target.value)}
              />
            </div>
          </div>
          <div>
            <Label htmlFor="country">Country</Label>
            <Select 
              value={formData.billingAddress?.country || 'US'} 
              onValueChange={(value) => handleInputChange('billingAddress.country', value)}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="US">United States</SelectItem>
                <SelectItem value="CA">Canada</SelectItem>
                <SelectItem value="GB">United Kingdom</SelectItem>
                <SelectItem value="AU">Australia</SelectItem>
                <SelectItem value="DE">Germany</SelectItem>
                <SelectItem value="FR">France</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Payment Validation */}
      <PaymentValidation
        formData={formData}
        onValidationChange={handleValidationChange}
        showErrors={true}
      />

      {/* Submit Button */}
      <Button 
        type="submit" 
        className="w-full" 
        size="lg"
        disabled={!isValid || isLoading}
      >
        {isLoading ? 'Processing...' : `Pay ${formData.amount} ${formData.currency}`}
      </Button>
    </form>
  );
};

export default PaymentForm;
