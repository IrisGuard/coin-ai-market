
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, useSearchParams } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { XCircle, RefreshCw, ArrowLeft, AlertTriangle, Phone, Mail } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import Navbar from '@/components/Navbar';

const PaymentFailure = () => {
  const { transactionId } = useParams();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [transaction, setTransaction] = useState<any>(null);
  const [coin, setCoin] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [retrying, setRetrying] = useState(false);

  useEffect(() => {
    if (transactionId) {
      fetchTransactionDetails();
    } else {
      // Handle failed Transak payment
      const errorMessage = searchParams.get('error');
      const transakOrderId = searchParams.get('transak_order_id');
      
      if (transakOrderId) {
        handleTransakFailure(transakOrderId, errorMessage);
      } else {
        setLoading(false);
      }
    }
  }, [transactionId, searchParams]);

  const fetchTransactionDetails = async () => {
    try {
      const { data: transactionData, error } = await supabase
        .from('payment_transactions')
        .select(`
          *,
          coins (
            id,
            name,
            price,
            image
          )
        `)
        .eq('id', transactionId)
        .single();

      if (error) throw error;

      setTransaction(transactionData);
      setCoin(transactionData.coins);
    } catch (error) {
      console.error('Error fetching transaction:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleTransakFailure = async (transakOrderId: string, errorMessage: string | null) => {
    try {
      // Find and update transaction status
      const { data: transactionData, error } = await supabase
        .from('payment_transactions')
        .select(`
          *,
          coins (
            id,
            name,
            price,
            image
          )
        `)
        .eq('transak_order_id', transakOrderId)
        .single();

      if (!error && transactionData) {
        await supabase
          .from('payment_transactions')
          .update({ 
            status: 'failed',
            metadata: { error_message: errorMessage }
          })
          .eq('id', transactionData.id);

        setTransaction({ ...transactionData, status: 'failed' });
        setCoin(transactionData.coins);
      }
    } catch (error) {
      console.error('Error processing Transak failure:', error);
    } finally {
      setLoading(false);
    }
  };

  const retryPayment = async () => {
    if (!coin) return;
    
    setRetrying(true);
    try {
      // Navigate back to coin details to retry payment
      navigate(`/coin/${coin.id}`);
      toast.info('Redirecting to retry payment...');
    } catch (error) {
      toast.error('Failed to redirect for retry');
    } finally {
      setRetrying(false);
    }
  };

  const contactSupport = () => {
    const subject = `Payment Issue - Transaction ${transaction?.id || 'Unknown'}`;
    const body = `I experienced an issue with my payment for ${coin?.name || 'a coin'}. Transaction ID: ${transaction?.id || 'N/A'}`;
    
    window.location.href = `mailto:support@coinvision.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-50 via-orange-50 to-yellow-50">
        <Navbar />
        <div className="pt-20 flex items-center justify-center">
          <div className="animate-spin h-8 w-8 border-b-2 border-red-600"></div>
        </div>
      </div>
    );
  }

  const errorMessage = transaction?.metadata?.error_message || 'Payment could not be processed';

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 via-orange-50 to-yellow-50">
      <Navbar />
      
      <div className="pt-20 pb-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Failure Header */}
          <div className="text-center mb-8">
            <div className="flex justify-center mb-4">
              <XCircle className="h-16 w-16 text-red-600" />
            </div>
            <h1 className="text-4xl font-bold text-gray-900 mb-2">Payment Failed</h1>
            <p className="text-xl text-gray-600">
              We encountered an issue processing your payment
            </p>
          </div>

          {/* Error Details */}
          <Card className="mb-8 border-red-200">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-red-700">
                <AlertTriangle className="h-5 w-5" />
                Payment Error Details
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="bg-red-50 p-4 rounded-lg">
                <p className="text-red-800 font-medium">Error Message:</p>
                <p className="text-red-700">{errorMessage}</p>
              </div>

              {transaction && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm text-gray-600">Transaction ID</label>
                    <p className="font-mono text-sm">{transaction.id}</p>
                  </div>
                  <div>
                    <label className="text-sm text-gray-600">Status</label>
                    <div>
                      <Badge variant="destructive">
                        {transaction.status}
                      </Badge>
                    </div>
                  </div>
                  <div>
                    <label className="text-sm text-gray-600">Amount</label>
                    <p className="text-lg font-semibold">
                      ${Number(transaction.amount).toFixed(2)} {transaction.currency}
                    </p>
                  </div>
                  <div>
                    <label className="text-sm text-gray-600">Date</label>
                    <p>{new Date(transaction.created_at).toLocaleDateString()}</p>
                  </div>
                </div>
              )}

              {/* Coin Information */}
              {coin && (
                <div className="border-t pt-4">
                  <label className="text-sm text-gray-600 mb-2 block">Attempted Purchase:</label>
                  <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg">
                    {coin.image && (
                      <img 
                        src={coin.image} 
                        alt={coin.name}
                        className="w-16 h-16 rounded-lg object-cover"
                      />
                    )}
                    <div className="flex-1">
                      <h3 className="font-semibold text-lg">{coin.name}</h3>
                      <p className="text-xl font-bold text-gray-700">
                        ${Number(coin.price).toFixed(2)}
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
            <Button 
              onClick={retryPayment}
              disabled={retrying || !coin}
              className="flex items-center gap-2"
            >
              <RefreshCw className={`h-4 w-4 ${retrying ? 'animate-spin' : ''}`} />
              Retry Payment
            </Button>
            
            <Button 
              onClick={contactSupport}
              variant="outline"
              className="flex items-center gap-2"
            >
              <Mail className="h-4 w-4" />
              Contact Support
            </Button>
            
            <Button 
              onClick={() => navigate('/marketplace')}
              variant="outline"
              className="flex items-center gap-2"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to Marketplace
            </Button>
          </div>

          {/* Common Issues */}
          <Card>
            <CardHeader>
              <CardTitle>Common Issues & Solutions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <h4 className="font-medium text-gray-900">Insufficient Funds</h4>
                  <p className="text-sm text-gray-600">
                    Please check that you have sufficient balance in your account or credit card.
                  </p>
                </div>
                
                <div>
                  <h4 className="font-medium text-gray-900">Card Declined</h4>
                  <p className="text-sm text-gray-600">
                    Contact your bank to ensure the transaction is authorized, or try a different payment method.
                  </p>
                </div>
                
                <div>
                  <h4 className="font-medium text-gray-900">Network Issues</h4>
                  <p className="text-sm text-gray-600">
                    Check your internet connection and try again. The payment may have been interrupted.
                  </p>
                </div>
                
                <div>
                  <h4 className="font-medium text-gray-900">Browser Issues</h4>
                  <p className="text-sm text-gray-600">
                    Try clearing your browser cache or using a different browser.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Support Contact */}
          <Card className="mt-6 border-blue-200">
            <CardContent className="p-6">
              <div className="text-center">
                <h3 className="font-semibold mb-2">Need Help?</h3>
                <p className="text-gray-600 mb-4">
                  Our support team is here to help you resolve any payment issues.
                </p>
                <div className="flex justify-center gap-4">
                  <Button 
                    onClick={contactSupport}
                    variant="outline" 
                    size="sm"
                    className="flex items-center gap-2"
                  >
                    <Mail className="h-4 w-4" />
                    Email Support
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm"
                    className="flex items-center gap-2"
                    onClick={() => window.open('tel:+1-555-COIN-HELP', '_self')}
                  >
                    <Phone className="h-4 w-4" />
                    Call Support
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default PaymentFailure;
