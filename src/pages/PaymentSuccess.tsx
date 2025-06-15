
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, useSearchParams } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, Download, Share2, ArrowLeft, Coins } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';
import Navbar from '@/components/Navbar';
import TransactionReceiptModal from '@/components/payment/TransactionReceiptModal';

const PaymentSuccess = () => {
  const { transactionId } = useParams();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [transaction, setTransaction] = useState<any>(null);
  const [coin, setCoin] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [showReceipt, setShowReceipt] = useState(false);

  useEffect(() => {
    if (transactionId) {
      fetchTransactionDetails();
    } else {
      // Handle Transak redirect with query params
      const transakOrderId = searchParams.get('transak_order_id');
      if (transakOrderId) {
        handleTransakSuccess(transakOrderId);
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
            image,
            user_id
          )
        `)
        .eq('id', transactionId)
        .single();

      if (error) throw error;

      setTransaction(transactionData);
      setCoin(transactionData.coins);

      // Transfer coin ownership if not already done
      if (transactionData.status === 'completed' && transactionData.coins) {
        await transferCoinOwnership(transactionData.coins.id, transactionData.user_id);
      }
    } catch (error) {
      console.error('Error fetching transaction:', error);
      toast.error('Failed to load transaction details');
    } finally {
      setLoading(false);
    }
  };

  const handleTransakSuccess = async (transakOrderId: string) => {
    try {
      // Find transaction by Transak order ID
      const { data: transactionData, error } = await supabase
        .from('payment_transactions')
        .select(`
          *,
          coins (
            id,
            name,
            price,
            image,
            user_id
          )
        `)
        .eq('transak_order_id', transakOrderId)
        .single();

      if (error) throw error;

      // Update transaction status to completed
      await supabase
        .from('payment_transactions')
        .update({ status: 'completed' })
        .eq('id', transactionData.id);

      setTransaction({ ...transactionData, status: 'completed' });
      setCoin(transactionData.coins);

      // Transfer coin ownership
      if (transactionData.coins) {
        await transferCoinOwnership(transactionData.coins.id, transactionData.user_id);
      }

      toast.success('Payment completed successfully!');
    } catch (error) {
      console.error('Error processing Transak success:', error);
      toast.error('Failed to process payment');
      navigate('/payment-failure');
    } finally {
      setLoading(false);
    }
  };

  const transferCoinOwnership = async (coinId: string, newOwnerId: string) => {
    try {
      const { error } = await supabase
        .from('coins')
        .update({ 
          user_id: newOwnerId,
          sold: true,
          sold_at: new Date().toISOString()
        })
        .eq('id', coinId);

      if (error) throw error;

      // Log the ownership transfer
      await supabase
        .from('analytics_events')
        .insert({
          event_type: 'coin_ownership_transferred',
          page_url: `/coin/${coinId}`,
          metadata: {
            coin_id: coinId,
            new_owner_id: newOwnerId,
            transaction_id: transaction?.id
          }
        });
    } catch (error) {
      console.error('Error transferring ownership:', error);
    }
  };

  const shareSuccess = async () => {
    if (navigator.share && coin) {
      try {
        await navigator.share({
          title: `I just purchased ${coin.name}!`,
          text: `Check out this amazing coin I just bought on CoinVision`,
          url: window.location.href
        });
      } catch (error) {
        // Fallback to clipboard
        await navigator.clipboard.writeText(window.location.href);
        toast.success('Link copied to clipboard!');
      }
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 via-blue-50 to-purple-50">
        <Navbar />
        <div className="pt-20 flex items-center justify-center">
          <div className="animate-spin h-8 w-8 border-b-2 border-green-600"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-blue-50 to-purple-50">
      <Navbar />
      
      <div className="pt-20 pb-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Success Header */}
          <div className="text-center mb-8">
            <div className="flex justify-center mb-4">
              <CheckCircle className="h-16 w-16 text-green-600" />
            </div>
            <h1 className="text-4xl font-bold text-gray-900 mb-2">Payment Successful!</h1>
            <p className="text-xl text-gray-600">
              Your purchase has been completed successfully
            </p>
          </div>

          {/* Transaction Details */}
          {transaction && (
            <Card className="mb-8">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Coins className="h-5 w-5" />
                  Transaction Details
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Coin Information */}
                {coin && (
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
                      <p className="text-2xl font-bold text-green-600">
                        ${Number(coin.price).toFixed(2)}
                      </p>
                    </div>
                  </div>
                )}

                {/* Transaction Info */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm text-gray-600">Transaction ID</label>
                    <p className="font-mono text-sm">{transaction.id}</p>
                  </div>
                  <div>
                    <label className="text-sm text-gray-600">Status</label>
                    <div>
                      <Badge className="bg-green-100 text-green-800">
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
              </CardContent>
            </Card>
          )}

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              onClick={() => setShowReceipt(true)}
              className="flex items-center gap-2"
            >
              <Download className="h-4 w-4" />
              Download Receipt
            </Button>
            
            <Button 
              onClick={shareSuccess}
              variant="outline"
              className="flex items-center gap-2"
            >
              <Share2 className="h-4 w-4" />
              Share
            </Button>
            
            <Button 
              onClick={() => navigate('/dashboard')}
              variant="outline"
              className="flex items-center gap-2"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to Dashboard
            </Button>
          </div>

          {/* Next Steps */}
          <Card className="mt-8">
            <CardContent className="p-6">
              <h3 className="font-semibold mb-4">What's Next?</h3>
              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <CheckCircle className="h-5 w-5 text-green-600 mt-0.5" />
                  <div>
                    <p className="font-medium">Coin Added to Your Collection</p>
                    <p className="text-sm text-gray-600">The coin has been automatically added to your portfolio</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle className="h-5 w-5 text-green-600 mt-0.5" />
                  <div>
                    <p className="font-medium">Receipt Generated</p>
                    <p className="text-sm text-gray-600">A detailed receipt is available for download</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle className="h-5 w-5 text-green-600 mt-0.5" />
                  <div>
                    <p className="font-medium">Ownership Transferred</p>
                    <p className="text-sm text-gray-600">You are now the official owner of this coin</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Receipt Modal */}
      {showReceipt && transaction && (
        <TransactionReceiptModal
          isOpen={showReceipt}
          onClose={() => setShowReceipt(false)}
          transaction={transaction}
          coin={coin}
        />
      )}
    </div>
  );
};

export default PaymentSuccess;
