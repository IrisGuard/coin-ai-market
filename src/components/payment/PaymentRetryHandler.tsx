
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { RefreshCw, CreditCard, Wallet, AlertTriangle } from 'lucide-react';
import { toast } from 'sonner';

interface PaymentRetryHandlerProps {
  coinId: string;
  coinName: string;
  amount: number;
  currency: string;
  onRetrySuccess?: () => void;
  onRetryFailed?: (error: string) => void;
  maxRetries?: number;
}

const PaymentRetryHandler = ({
  coinId,
  coinName,
  amount,
  currency,
  onRetrySuccess,
  onRetryFailed,
  maxRetries = 3
}: PaymentRetryHandlerProps) => {
  const [retryCount, setRetryCount] = useState(0);
  const [isRetrying, setIsRetrying] = useState(false);
  const [lastError, setLastError] = useState<string>('');

  const retryPayment = async (paymentMethod: 'traditional' | 'transak') => {
    if (retryCount >= maxRetries) {
      toast.error('Maximum retry attempts reached. Please contact support.');
      return;
    }

    setIsRetrying(true);
    setRetryCount(prev => prev + 1);

    try {
      // Simulate retry logic - in real implementation, this would call the appropriate payment service
      await new Promise(resolve => setTimeout(resolve, 2000));

      // Simulate random success/failure for demo
      const success = Math.random() > 0.3;
      
      if (success) {
        toast.success('Payment retry successful!');
        onRetrySuccess?.();
      } else {
        const error = 'Payment failed - please try again or contact support';
        setLastError(error);
        onRetryFailed?.(error);
        toast.error(error);
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
      setLastError(errorMessage);
      onRetryFailed?.(errorMessage);
      toast.error(`Retry failed: ${errorMessage}`);
    } finally {
      setIsRetrying(false);
    }
  };

  const canRetry = retryCount < maxRetries && !isRetrying;

  return (
    <Card className="border-yellow-200">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-yellow-700">
          <RefreshCw className="h-5 w-5" />
          Payment Retry Options
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="bg-yellow-50 p-4 rounded-lg">
          <h4 className="font-medium text-yellow-800 mb-2">Retry Payment for:</h4>
          <p className="text-yellow-700">{coinName}</p>
          <p className="text-lg font-bold text-yellow-800">
            ${amount.toFixed(2)} {currency}
          </p>
        </div>

        {lastError && (
          <Alert className="border-red-200 bg-red-50">
            <AlertTriangle className="h-4 w-4 text-red-600" />
            <AlertDescription className="text-red-700">
              Last attempt failed: {lastError}
            </AlertDescription>
          </Alert>
        )}

        <div className="text-sm text-gray-600">
          <p>Retry attempts: {retryCount}/{maxRetries}</p>
        </div>

        <div className="space-y-3">
          <Button
            onClick={() => retryPayment('traditional')}
            disabled={!canRetry}
            className="w-full flex items-center gap-2"
          >
            <CreditCard className={`h-4 w-4 ${isRetrying ? 'animate-pulse' : ''}`} />
            {isRetrying ? 'Retrying...' : 'Retry with Traditional Payment'}
          </Button>

          <Button
            onClick={() => retryPayment('transak')}
            disabled={!canRetry}
            variant="outline"
            className="w-full flex items-center gap-2"
          >
            <Wallet className={`h-4 w-4 ${isRetrying ? 'animate-pulse' : ''}`} />
            {isRetrying ? 'Retrying...' : 'Retry with Crypto/Card Payment'}
          </Button>
        </div>

        {retryCount >= maxRetries && (
          <Alert className="border-red-200 bg-red-50">
            <AlertTriangle className="h-4 w-4 text-red-600" />
            <AlertDescription className="text-red-700">
              Maximum retry attempts reached. Please contact our support team for assistance.
            </AlertDescription>
          </Alert>
        )}

        <div className="text-xs text-gray-500 text-center">
          Having trouble? Contact support at support@coinvision.com
        </div>
      </CardContent>
    </Card>
  );
};

export default PaymentRetryHandler;
