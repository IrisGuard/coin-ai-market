
import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft, ArrowRight, CheckCircle } from 'lucide-react';
import PaymentForm from './PaymentForm';
import PaymentSummary from './PaymentSummary';
import PaymentConfirmation from './PaymentConfirmation';
import { PaymentFormData, PaymentResult } from '@/types/paymentTypes';

interface CheckoutFlowProps {
  amount: number;
  currency: string;
  coinName?: string;
  coinImage?: string;
  onPaymentComplete: (result: PaymentResult) => void;
  onCancel: () => void;
}

type CheckoutStep = 'details' | 'review' | 'confirmation';

const CheckoutFlow = ({
  amount,
  currency,
  coinName,
  coinImage,
  onPaymentComplete,
  onCancel
}: CheckoutFlowProps) => {
  const [currentStep, setCurrentStep] = useState<CheckoutStep>('details');
  const [formData, setFormData] = useState<PaymentFormData | null>(null);
  const [paymentResult, setPaymentResult] = useState<PaymentResult | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  const fees = {
    platform: amount * 0.03, // 3% platform fee
    payment: amount * 0.029 + 0.30, // 2.9% + $0.30 payment processing
    total: 0
  };
  fees.total = fees.platform + fees.payment;

  const handleFormSubmit = (data: PaymentFormData) => {
    setFormData(data);
    setCurrentStep('review');
  };

  const handlePaymentConfirm = async () => {
    if (!formData) return;

    setIsProcessing(true);
    try {
      // Simulate payment processing
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const result: PaymentResult = {
        success: true,
        transactionId: `tx_${Date.now()}`,
        processingTime: 2000
      };
      
      setPaymentResult(result);
      setCurrentStep('confirmation');
      onPaymentComplete(result);
    } catch (error) {
      const result: PaymentResult = {
        success: false,
        error: 'Payment processing failed',
        processingTime: 2000
      };
      
      setPaymentResult(result);
      setCurrentStep('confirmation');
      onPaymentComplete(result);
    } finally {
      setIsProcessing(false);
    }
  };

  const renderStepIndicator = () => (
    <div className="flex items-center justify-center space-x-4 mb-8">
      <div className={`flex items-center space-x-2 ${currentStep === 'details' ? 'text-blue-600' : 'text-gray-400'}`}>
        <div className={`w-8 h-8 rounded-full flex items-center justify-center border-2 ${
          currentStep === 'details' ? 'border-blue-600 bg-blue-600 text-white' : 'border-gray-300'
        }`}>
          1
        </div>
        <span className="font-medium">Payment Details</span>
      </div>
      
      <div className="w-8 h-0.5 bg-gray-300"></div>
      
      <div className={`flex items-center space-x-2 ${currentStep === 'review' ? 'text-blue-600' : 'text-gray-400'}`}>
        <div className={`w-8 h-8 rounded-full flex items-center justify-center border-2 ${
          currentStep === 'review' ? 'border-blue-600 bg-blue-600 text-white' : 'border-gray-300'
        }`}>
          2
        </div>
        <span className="font-medium">Review & Pay</span>
      </div>
      
      <div className="w-8 h-0.5 bg-gray-300"></div>
      
      <div className={`flex items-center space-x-2 ${currentStep === 'confirmation' ? 'text-green-600' : 'text-gray-400'}`}>
        <div className={`w-8 h-8 rounded-full flex items-center justify-center border-2 ${
          currentStep === 'confirmation' ? 'border-green-600 bg-green-600 text-white' : 'border-gray-300'
        }`}>
          {currentStep === 'confirmation' ? <CheckCircle className="h-5 w-5" /> : '3'}
        </div>
        <span className="font-medium">Confirmation</span>
      </div>
    </div>
  );

  const renderStepContent = () => {
    switch (currentStep) {
      case 'details':
        return (
          <PaymentForm
            onSubmit={handleFormSubmit}
            initialData={{
              amount: amount.toString(),
              currency,
            }}
          />
        );

      case 'review':
        return (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div>
              <h3 className="text-lg font-semibold mb-4">Review Your Order</h3>
              {formData && (
                <PaymentSummary
                  formData={formData}
                  fees={fees}
                  coinName={coinName}
                  coinImage={coinImage}
                />
              )}
            </div>
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Complete Payment</h3>
              <Card>
                <CardContent className="p-6">
                  <div className="text-center space-y-4">
                    <div className="text-2xl font-bold">
                      Total: {(amount + fees.total).toFixed(2)} {currency}
                    </div>
                    <Button
                      onClick={handlePaymentConfirm}
                      className="w-full"
                      size="lg"
                      disabled={isProcessing}
                    >
                      {isProcessing ? 'Processing Payment...' : 'Confirm & Pay'}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        );

      case 'confirmation':
        return paymentResult && (
          <PaymentConfirmation
            result={paymentResult}
            amount={amount}
            currency={currency}
            coinName={coinName}
            onComplete={() => onPaymentComplete(paymentResult)}
          />
        );

      default:
        return null;
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      {renderStepIndicator()}
      
      <div className="min-h-[600px]">
        {renderStepContent()}
      </div>

      {/* Navigation Buttons */}
      {currentStep !== 'confirmation' && (
        <div className="flex justify-between mt-8">
          <Button
            variant="outline"
            onClick={currentStep === 'details' ? onCancel : () => setCurrentStep('details')}
            disabled={isProcessing}
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            {currentStep === 'details' ? 'Cancel' : 'Back'}
          </Button>

          {currentStep === 'review' && (
            <Button
              onClick={handlePaymentConfirm}
              disabled={isProcessing}
            >
              Confirm Payment
              <ArrowRight className="h-4 w-4 ml-2" />
            </Button>
          )}
        </div>
      )}
    </div>
  );
};

export default CheckoutFlow;
