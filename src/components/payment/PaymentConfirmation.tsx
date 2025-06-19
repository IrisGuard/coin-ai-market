
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, XCircle, Download, Share, ArrowRight } from 'lucide-react';
import { PaymentResult } from '@/types/paymentTypes';

interface PaymentConfirmationProps {
  result: PaymentResult;
  amount: number;
  currency: string;
  coinName?: string;
  onComplete: () => void;
}

const PaymentConfirmation = ({ 
  result, 
  amount, 
  currency, 
  coinName,
  onComplete 
}: PaymentConfirmationProps) => {
  const handleDownloadReceipt = () => {
    // In a real implementation, this would generate and download a PDF receipt
    const receiptData = {
      transactionId: result.transactionId,
      amount,
      currency,
      coinName,
      date: new Date().toISOString(),
      status: result.success ? 'completed' : 'failed'
    };
    
    const blob = new Blob([JSON.stringify(receiptData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `receipt-${result.transactionId}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleShare = () => {
    if (navigator.share && result.success) {
      navigator.share({
        title: 'Payment Confirmation',
        text: `Successfully purchased ${coinName} for ${amount} ${currency}`,
        url: window.location.href
      });
    }
  };

  if (result.success) {
    return (
      <div className="text-center space-y-6">
        <div className="flex flex-col items-center space-y-4">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center">
            <CheckCircle className="h-12 w-12 text-green-600" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-green-800 mb-2">Payment Successful!</h2>
            <p className="text-gray-600">Your transaction has been completed successfully</p>
          </div>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              Transaction Details
              <Badge className="bg-green-100 text-green-800">Completed</Badge>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {coinName && (
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Item</span>
                <span className="font-medium">{coinName}</span>
              </div>
            )}
            
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Amount</span>
              <span className="font-medium">{amount} {currency}</span>
            </div>
            
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Transaction ID</span>
              <span className="font-mono text-sm">{result.transactionId}</span>
            </div>
            
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Processing Time</span>
              <span className="text-sm">{result.processingTime}ms</span>
            </div>
            
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Date</span>
              <span className="text-sm">{new Date().toLocaleDateString()}</span>
            </div>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <Button variant="outline" onClick={handleDownloadReceipt}>
            <Download className="h-4 w-4 mr-2" />
            Download Receipt
          </Button>
          
          <Button variant="outline" onClick={handleShare}>
            <Share className="h-4 w-4 mr-2" />
            Share
          </Button>
          
          <Button onClick={onComplete}>
            Continue
            <ArrowRight className="h-4 w-4 ml-2" />
          </Button>
        </div>

        <div className="text-xs text-gray-500 space-y-1">
          <p>You will receive a confirmation email shortly.</p>
          <p>If you have any questions, please contact our support team.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="text-center space-y-6">
      <div className="flex flex-col items-center space-y-4">
        <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center">
          <XCircle className="h-12 w-12 text-red-600" />
        </div>
        <div>
          <h2 className="text-2xl font-bold text-red-800 mb-2">Payment Failed</h2>
          <p className="text-gray-600">There was an issue processing your payment</p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            Transaction Details
            <Badge variant="destructive">Failed</Badge>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex justify-between items-center">
            <span className="text-gray-600">Attempted Amount</span>
            <span className="font-medium">{amount} {currency}</span>
          </div>
          
          <div className="flex justify-between items-center">
            <span className="text-gray-600">Error</span>
            <span className="text-red-600 text-sm">{result.error}</span>
          </div>
          
          <div className="flex justify-between items-center">
            <span className="text-gray-600">Date</span>
            <span className="text-sm">{new Date().toLocaleDateString()}</span>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Button variant="outline" onClick={onComplete}>
          Try Again
        </Button>
        
        <Button onClick={onComplete}>
          Return to Marketplace
          <ArrowRight className="h-4 w-4 ml-2" />
        </Button>
      </div>

      <div className="text-xs text-gray-500 space-y-1">
        <p>Your card was not charged for this failed transaction.</p>
        <p>Please try again or contact support if the issue persists.</p>
      </div>
    </div>
  );
};

export default PaymentConfirmation;
