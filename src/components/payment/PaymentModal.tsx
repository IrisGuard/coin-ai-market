
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { X } from 'lucide-react';
import PaymentForm from './PaymentForm';
import { PaymentFormData } from '@/types/paymentTypes';

interface PaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onPaymentSubmit: (formData: PaymentFormData) => void;
  title?: string;
  amount?: number;
  currency?: string;
  isProcessing?: boolean;
}

const PaymentModal = ({
  isOpen,
  onClose,
  onPaymentSubmit,
  title = 'Complete Payment',
  amount,
  currency = 'USD',
  isProcessing = false
}: PaymentModalProps) => {
  const initialData = {
    amount: amount?.toString() || '',
    currency,
    paymentMethod: '',
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center justify-between">
            {title}
            <button
              onClick={onClose}
              className="p-1 rounded-full hover:bg-gray-100 transition-colors"
              disabled={isProcessing}
            >
              <X className="h-5 w-5" />
            </button>
          </DialogTitle>
        </DialogHeader>
        
        <div className="py-4">
          <PaymentForm
            onSubmit={onPaymentSubmit}
            isLoading={isProcessing}
            initialData={initialData}
          />
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default PaymentModal;
