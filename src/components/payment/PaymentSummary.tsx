
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { CreditCard, Wallet, Building, MapPin, User, Mail } from 'lucide-react';
import { PaymentFormData } from '@/types/paymentTypes';

interface PaymentSummaryProps {
  formData: PaymentFormData;
  fees?: {
    platform: number;
    payment: number;
    total: number;
  };
  coinName?: string;
  coinImage?: string;
}

const PaymentSummary = ({ formData, fees, coinName, coinImage }: PaymentSummaryProps) => {
  const amount = parseFloat(formData.amount) || 0;
  const totalAmount = fees ? amount + fees.total : amount;

  const getPaymentMethodIcon = () => {
    switch (formData.paymentMethod) {
      case 'card':
        return <CreditCard className="h-5 w-5" />;
      case 'crypto':
        return <Wallet className="h-5 w-5" />;
      case 'bank_transfer':
        return <Building className="h-5 w-5" />;
      default:
        return <CreditCard className="h-5 w-5" />;
    }
  };

  const getPaymentMethodName = () => {
    switch (formData.paymentMethod) {
      case 'card':
        return 'Credit Card';
      case 'crypto':
        return 'Cryptocurrency';
      case 'bank_transfer':
        return 'Bank Transfer';
      default:
        return 'Payment Method';
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Payment Summary</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Item being purchased */}
        {coinName && (
          <div className="flex items-center space-x-4 p-4 bg-gray-50 rounded-lg">
            {coinImage && (
              <img
                src={coinImage}
                alt={coinName}
                className="w-16 h-16 object-cover rounded-lg"
              />
            )}
            <div>
              <h3 className="font-semibold text-lg">{coinName}</h3>
              <p className="text-gray-600">Digital Coin Purchase</p>
            </div>
          </div>
        )}

        {/* Amount Breakdown */}
        <div className="space-y-3">
          <div className="flex justify-between items-center">
            <span className="text-gray-600">Item Price</span>
            <span className="font-medium">
              {amount.toFixed(2)} {formData.currency}
            </span>
          </div>

          {fees && (
            <>
              <div className="flex justify-between items-center text-sm">
                <span className="text-gray-500">Platform Fee</span>
                <span className="text-gray-700">
                  {fees.platform.toFixed(2)} {formData.currency}
                </span>
              </div>
              <div className="flex justify-between items-center text-sm">
                <span className="text-gray-500">Payment Processing</span>
                <span className="text-gray-700">
                  {fees.payment.toFixed(2)} {formData.currency}
                </span>
              </div>
            </>
          )}

          <Separator />

          <div className="flex justify-between items-center text-lg font-bold">
            <span>Total</span>
            <span>
              {totalAmount.toFixed(2)} {formData.currency}
            </span>
          </div>
        </div>

        {/* Payment Method */}
        <div className="space-y-3">
          <h4 className="font-medium">Payment Method</h4>
          <div className="flex items-center space-x-3 p-3 bg-blue-50 rounded-lg border border-blue-200">
            {getPaymentMethodIcon()}
            <span className="font-medium">{getPaymentMethodName()}</span>
            <Badge variant="outline" className="ml-auto">
              {formData.currency}
            </Badge>
          </div>
        </div>

        {/* Customer Info */}
        {formData.customerInfo && (
          <div className="space-y-3">
            <h4 className="font-medium">Customer Information</h4>
            <div className="space-y-2 text-sm">
              {formData.customerInfo.name && (
                <div className="flex items-center space-x-2">
                  <User className="h-4 w-4 text-gray-500" />
                  <span>{formData.customerInfo.name}</span>
                </div>
              )}
              {formData.customerInfo.email && (
                <div className="flex items-center space-x-2">
                  <Mail className="h-4 w-4 text-gray-500" />
                  <span>{formData.customerInfo.email}</span>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Billing Address */}
        {formData.billingAddress && (
          <div className="space-y-3">
            <h4 className="font-medium">Billing Address</h4>
            <div className="flex items-start space-x-2 text-sm">
              <MapPin className="h-4 w-4 text-gray-500 mt-0.5" />
              <div className="space-y-1">
                <div>{formData.billingAddress.street}</div>
                <div>
                  {formData.billingAddress.city}, {formData.billingAddress.state} {formData.billingAddress.zipCode}
                </div>
                <div>{formData.billingAddress.country}</div>
              </div>
            </div>
          </div>
        )}

        {/* Security Notice */}
        <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
          <p className="text-sm text-green-800">
            🔒 Your payment information is encrypted and secure
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

export default PaymentSummary;
