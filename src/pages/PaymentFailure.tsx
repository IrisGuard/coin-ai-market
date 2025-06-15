
import React, { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { XCircle, RefreshCw, ArrowLeft, HelpCircle } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';

interface FailedTransaction {
  coin_id: string;
  coin_name: string;
  coin_image: string;
  amount: number;
  error_code?: string;
  error_message?: string;
  seller_name: string;
}

const PaymentFailure = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [failedTransaction, setFailedTransaction] = useState<FailedTransaction | null>(null);
  const [loading, setLoading] = useState(true);
  const [retrying, setRetrying] = useState(false);

  const coinId = searchParams.get('coin_id');
  const amount = searchParams.get('amount');
  const errorCode = searchParams.get('error_code');
  const errorMessage = searchParams.get('error_message');

  useEffect(() => {
    if (!user) {
      navigate('/auth');
      return;
    }

    if (!coinId || !amount) {
      toast.error('Payment information missing');
      navigate('/marketplace');
      return;
    }

    fetchCoinDetails();
  }, [user, coinId]);

  const fetchCoinDetails = async () => {
    if (!coinId) return;

    try {
      const { data: coinData, error } = await supabase
        .from('coins')
        .select(`
          id,
          name,
          image,
          price,
          user_id,
          profiles(name)
        `)
        .eq('id', coinId)
        .single();

      if (error) throw error;

      setFailedTransaction({
        coin_id: coinData.id,
        coin_name: coinData.name,
        coin_image: coinData.image,
        amount: parseFloat(amount || '0'),
        error_code: errorCode || undefined,
        error_message: errorMessage || 'Payment could not be processed',
        seller_name: (coinData.profiles as any)?.name || 'Unknown Seller'
      });
    } catch (error) {
      console.error('Error fetching coin details:', error);
      toast.error('Failed to load transaction details');
      navigate('/marketplace');
    } finally {
      setLoading(false);
    }
  };

  const handleRetryPayment = async () => {
    if (!failedTransaction) return;
    
    setRetrying(true);
    try {
      // Navigate back to the coin details page with checkout intent
      navigate(`/coin/${failedTransaction.coin_id}?checkout=true`);
    } catch (error) {
      console.error('Error retrying payment:', error);
      toast.error('Failed to retry payment');
    } finally {
      setRetrying(false);
    }
  };

  const getErrorTitle = (code?: string) => {
    switch (code) {
      case 'card_declined':
        return 'Card Declined';
      case 'insufficient_funds':
        return 'Insufficient Funds';
      case 'expired_card':
        return 'Card Expired';
      case 'invalid_cvc':
        return 'Invalid Security Code';
      case 'processing_error':
        return 'Processing Error';
      default:
        return 'Payment Failed';
    }
  };

  const getErrorDescription = (code?: string) => {
    switch (code) {
      case 'card_declined':
        return 'Your card was declined. Please contact your bank or try a different payment method.';
      case 'insufficient_funds':
        return 'There are insufficient funds on your card. Please check your balance or use a different card.';
      case 'expired_card':
        return 'Your card has expired. Please use a different card or update your payment method.';
      case 'invalid_cvc':
        return 'The security code you entered is invalid. Please check and try again.';
      case 'processing_error':
        return 'There was a technical issue processing your payment. Please try again.';
      default:
        return 'We were unable to process your payment. Please try again or contact support.';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600"></div>
      </div>
    );
  }

  if (!failedTransaction) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Card className="max-w-md w-full mx-4">
          <CardContent className="p-6 text-center">
            <p className="text-gray-600 mb-4">Transaction not found</p>
            <Button onClick={() => navigate('/marketplace')}>
              Return to Marketplace
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-2xl mx-auto px-4">
        {/* Failure Header */}
        <div className="text-center mb-8">
          <XCircle className="h-16 w-16 text-red-500 mx-auto mb-4" />
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            {getErrorTitle(failedTransaction.error_code)}
          </h1>
          <p className="text-gray-600">
            {getErrorDescription(failedTransaction.error_code)}
          </p>
        </div>

        {/* Transaction Details */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              Transaction Details
              <Badge variant="destructive">
                Failed
              </Badge>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Coin Info */}
            <div className="flex items-center space-x-4 p-4 bg-gray-50 rounded-lg">
              <img 
                src={failedTransaction.coin_image} 
                alt={failedTransaction.coin_name}
                className="w-16 h-16 object-cover rounded-lg"
              />
              <div>
                <h3 className="font-semibold text-lg">{failedTransaction.coin_name}</h3>
                <p className="text-gray-600">Sold by {failedTransaction.seller_name}</p>
              </div>
            </div>

            {/* Payment Info */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-gray-500">Attempted Amount</label>
                <p className="text-xl font-bold text-gray-900">
                  ${failedTransaction.amount.toFixed(2)}
                </p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500">Failed At</label>
                <p className="text-gray-900">
                  {new Date().toLocaleDateString()}
                </p>
              </div>
            </div>

            {/* Error Details */}
            {failedTransaction.error_code && (
              <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                <div className="flex items-start space-x-2">
                  <XCircle className="h-5 w-5 text-red-500 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium text-red-800">
                      Error Code: {failedTransaction.error_code}
                    </p>
                    <p className="text-sm text-red-700 mt-1">
                      {failedTransaction.error_message}
                    </p>
                  </div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Actions */}
        <div className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Button 
              onClick={handleRetryPayment}
              disabled={retrying}
              className="flex items-center justify-center gap-2"
            >
              {retrying ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  Retrying...
                </>
              ) : (
                <>
                  <RefreshCw className="h-4 w-4" />
                  Try Again
                </>
              )}
            </Button>
            
            <Button 
              variant="outline"
              onClick={() => navigate('/marketplace')}
              className="flex items-center justify-center gap-2"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to Marketplace
            </Button>
          </div>

          <Button 
            variant="outline"
            onClick={() => toast.info('Contact support: support@coinai.com')}
            className="w-full flex items-center justify-center gap-2"
          >
            <HelpCircle className="h-4 w-4" />
            Contact Support
          </Button>
        </div>

        {/* Help Section */}
        <Card className="mt-8">
          <CardHeader>
            <CardTitle className="text-lg">Need Help?</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div>
              <h4 className="font-medium">Common Solutions:</h4>
              <ul className="text-sm text-gray-600 mt-2 space-y-1">
                <li>• Check your card details and try again</li>
                <li>• Ensure your card has sufficient funds</li>
                <li>• Contact your bank to authorize the transaction</li>
                <li>• Try using a different payment method</li>
              </ul>
            </div>
            <div>
              <h4 className="font-medium">Still Having Issues?</h4>
              <p className="text-sm text-gray-600 mt-1">
                Our support team is here to help. Contact us at support@coinai.com
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default PaymentFailure;
