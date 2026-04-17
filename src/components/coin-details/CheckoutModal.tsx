import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import PaymentMethodSelector from '@/components/payment/PaymentMethodSelector';
import StripePaymentForm from '@/components/payment/StripePaymentForm';
import TraditionalPaymentForm from '@/components/payment/TraditionalPaymentForm';

interface CheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  coin: {
    id: string;
    name: string;
    price: number;
    image?: string;
    user_id: string;
  };
  // Kept for backward compatibility — wallet/crypto removed.
  dealerStore?: any | null;
  onTraditionalPurchase: () => void;
  onTransakSuccess: () => void;
  onTransakFailure?: () => void;
}

type Step = 'select' | 'stripe' | 'traditional';

const CheckoutModal = ({
  isOpen,
  onClose,
  coin,
  onTraditionalPurchase,
  onTransakSuccess,
  onTransakFailure,
}: CheckoutModalProps) => {
  const [step, setStep] = useState<Step>('select');

  const handleSuccess = (_id?: string) => {
    onTransakSuccess();
    onTraditionalPurchase();
    setStep('select');
    onClose();
  };

  const handleError = (_err: string) => {
    onTransakFailure?.();
  };

  const goBack = () => setStep('select');

  return (
    <Dialog
      open={isOpen}
      onOpenChange={(open) => {
        if (!open) {
          setStep('select');
          onClose();
        }
      }}
    >
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto glass-panel-strong">
        <DialogHeader>
          <DialogTitle className="text-xl">Purchase: {coin.name}</DialogTitle>
        </DialogHeader>

        {step === 'select' && (
          <PaymentMethodSelector coin={coin} onMethodSelect={(m) => setStep(m)} />
        )}

        {step === 'stripe' && (
          <div className="space-y-4">
            <Button variant="outline" onClick={goBack} className="w-full">
              <ArrowLeft className="w-4 h-4 mr-2" /> Back to payment options
            </Button>
            <StripePaymentForm coin={coin} onPaymentSuccess={handleSuccess} onPaymentError={handleError} />
          </div>
        )}

        {step === 'traditional' && (
          <div className="space-y-4">
            <Button variant="outline" onClick={goBack} className="w-full">
              <ArrowLeft className="w-4 h-4 mr-2" /> Back to payment options
            </Button>
            <TraditionalPaymentForm coin={coin} onPaymentSuccess={handleSuccess} onPaymentError={handleError} />
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default CheckoutModal;
