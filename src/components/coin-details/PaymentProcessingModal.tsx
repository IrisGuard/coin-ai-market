
import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { CheckCircle, XCircle, Loader2, CreditCard } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface PaymentProcessingModalProps {
  isOpen: boolean;
  onClose: () => void;
  paymentStatus: 'processing' | 'success' | 'failed' | null;
  transactionId?: string;
  coinName: string;
  amount: number;
}

const PaymentProcessingModal = ({
  isOpen,
  onClose,
  paymentStatus,
  transactionId,
  coinName,
  amount
}: PaymentProcessingModalProps) => {
  const navigate = useNavigate();
  const [countdown, setCountdown] = useState(3);

  useEffect(() => {
    if (paymentStatus === 'success' && countdown > 0) {
      const timer = setTimeout(() => {
        setCountdown(countdown - 1);
      }, 1000);
      return () => clearTimeout(timer);
    } else if (paymentStatus === 'success' && countdown === 0) {
      navigate(`/payment-success?transaction_id=${transactionId}`);
      onClose();
    }
  }, [paymentStatus, countdown, navigate, transactionId, onClose]);

  const getStatusContent = () => {
    switch (paymentStatus) {
      case 'processing':
        return {
          icon: <Loader2 className="h-16 w-16 text-blue-600 animate-spin" />,
          title: 'Processing Payment',
          message: 'Please wait while we process your payment...',
          color: 'blue'
        };
      case 'success':
        return {
          icon: <CheckCircle className="h-16 w-16 text-green-600" />,
          title: 'Payment Successful!',
          message: `Your purchase of ${coinName} for $${amount.toFixed(2)} has been completed.`,
          color: 'green'
        };
      case 'failed':
        return {
          icon: <XCircle className="h-16 w-16 text-red-600" />,
          title: 'Payment Failed',
          message: 'Your payment could not be processed. Please try again.',
          color: 'red'
        };
      default:
        return {
          icon: <CreditCard className="h-16 w-16 text-gray-600" />,
          title: 'Initializing Payment',
          message: 'Setting up your payment...',
          color: 'gray'
        };
    }
  };

  const { icon, title, message, color } = getStatusContent();

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="text-center">Payment Status</DialogTitle>
        </DialogHeader>
        
        <Card>
          <CardContent className="p-6 text-center space-y-4">
            <div className="flex justify-center">
              {icon}
            </div>
            
            <div>
              <h3 className={`text-xl font-bold text-${color}-600 mb-2`}>
                {title}
              </h3>
              <p className="text-gray-600">{message}</p>
            </div>

            {paymentStatus === 'success' && (
              <div className="bg-green-50 p-3 rounded-lg">
                <p className="text-sm text-green-700">
                  Redirecting to receipt page in {countdown} seconds...
                </p>
              </div>
            )}

            {paymentStatus === 'failed' && (
              <div className="space-y-2">
                <Button 
                  onClick={onClose}
                  variant="outline" 
                  className="w-full"
                >
                  Try Again
                </Button>
                <Button 
                  onClick={() => navigate('/marketplace')}
                  variant="default" 
                  className="w-full"
                >
                  Back to Marketplace
                </Button>
              </div>
            )}

            {paymentStatus === 'processing' && (
              <div className="bg-blue-50 p-3 rounded-lg">
                <p className="text-sm text-blue-700">
                  This may take a few moments. Please do not close this window.
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </DialogContent>
    </Dialog>
  );
};

export default PaymentProcessingModal;
