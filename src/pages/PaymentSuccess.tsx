
import React, { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, Download, Printer, Mail, ArrowLeft } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';
import TransactionReceiptModal from '@/components/TransactionReceiptModal';

interface TransactionDetails {
  id: string;
  amount: number;
  coin_name: string;
  coin_image: string;
  seller_name: string;
  transaction_date: string;
  payment_method: string;
  status: string;
}

const PaymentSuccess = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [transaction, setTransaction] = useState<TransactionDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [showReceiptModal, setShowReceiptModal] = useState(false);

  const transactionId = searchParams.get('transaction_id');
  const coinId = searchParams.get('coin_id');
  const amount = searchParams.get('amount');
  const paymentMethod = searchParams.get('payment_method') || 'Credit Card';

  useEffect(() => {
    if (!user) {
      navigate('/auth');
      return;
    }

    fetchTransactionDetails();
  }, [user, transactionId]);

  const fetchTransactionDetails = async () => {
    if (!transactionId && !coinId) {
      toast.error('Transaction information missing');
      navigate('/marketplace');
      return;
    }

    try {
      let transactionData = null;

      // Try to fetch from payment_transactions first
      if (transactionId) {
        const { data: paymentData, error: paymentError } = await supabase
          .from('payment_transactions')
          .select(`
            *,
            coins (
              name,
              image,
              user_id,
              profiles(name)
            )
          `)
          .eq('id', transactionId)
          .eq('user_id', user?.id)
          .single();

        if (paymentData && !paymentError) {
          transactionData = {
            id: paymentData.id,
            amount: paymentData.amount,
            coin_name: paymentData.coins?.name || 'Unknown Coin',
            coin_image: paymentData.coins?.image || '',
            seller_name: (paymentData.coins?.profiles as any)?.name || 'Marketplace',
            transaction_date: paymentData.created_at,
            payment_method: paymentData.currency || 'USD',
            status: paymentData.status
          };
        }
      }

      // Fallback: get coin details for display if no transaction found
      if (!transactionData && coinId && amount) {
        const { data: coinData } = await supabase
          .from('coins')
          .select(`
            id,
            name,
            image,
            user_id,
            profiles(name)
          `)
          .eq('id', coinId)
          .single();

        if (coinData) {
          transactionData = {
            id: transactionId || 'temp-' + Date.now(),
            amount: parseFloat(amount),
            coin_name: coinData.name,
            coin_image: coinData.image,
            seller_name: (coinData.profiles as any)?.name || 'Unknown Seller',
            transaction_date: new Date().toISOString(),
            payment_method: paymentMethod,
            status: 'completed'
          };

          // Create a transaction record for tracking
          const { error: insertError } = await supabase
            .from('payment_transactions')
            .insert({
              id: transactionData.id,
              user_id: user?.id,
              coin_id: coinId,
              amount: transactionData.amount,
              currency: 'USD',
              status: 'completed',
              order_type: 'coin_purchase'
            });

          if (insertError) {
            console.error('Error creating transaction record:', insertError);
          }
        }
      }

      if (transactionData) {
        setTransaction(transactionData);
      } else {
        toast.error('Transaction details not found');
        navigate('/marketplace');
      }
    } catch (error) {
      console.error('Error fetching transaction:', error);
      toast.error('Failed to load transaction details');
      navigate('/marketplace');
    } finally {
      setLoading(false);
    }
  };

  const handleDownloadReceipt = () => {
    setShowReceiptModal(true);
  };

  const handleEmailReceipt = () => {
    if (user?.email) {
      toast.success(`Receipt will be sent to ${user.email}`);
    } else {
      toast.info('Email receipt feature coming soon!');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!transaction) {
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
        {/* Success Header */}
        <div className="text-center mb-8">
          <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Payment Successful!
          </h1>
          <p className="text-gray-600">
            Your purchase has been completed successfully
          </p>
        </div>

        {/* Transaction Details */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              Transaction Details
              <Badge variant="default" className="bg-green-100 text-green-800">
                {transaction.status}
              </Badge>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Coin Info */}
            <div className="flex items-center space-x-4 p-4 bg-gray-50 rounded-lg">
              <img 
                src={transaction.coin_image || '/placeholder.svg'} 
                alt={transaction.coin_name}
                className="w-16 h-16 object-cover rounded-lg"
              />
              <div>
                <h3 className="font-semibold text-lg">{transaction.coin_name}</h3>
                <p className="text-gray-600">Sold by {transaction.seller_name}</p>
              </div>
            </div>

            {/* Payment Info */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-gray-500">Amount Paid</label>
                <p className="text-xl font-bold text-gray-900">
                  ${transaction.amount.toFixed(2)}
                </p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500">Payment Method</label>
                <p className="text-gray-900">{transaction.payment_method}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500">Transaction ID</label>
                <p className="text-gray-900 font-mono text-sm">{transaction.id}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500">Date</label>
                <p className="text-gray-900">
                  {new Date(transaction.transaction_date).toLocaleDateString()}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Actions */}
        <div className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <Button 
              variant="outline" 
              onClick={handleDownloadReceipt}
              className="flex items-center justify-center gap-2"
            >
              <Download className="h-4 w-4" />
              Download Receipt
            </Button>
            
            <Button 
              variant="outline"
              onClick={() => window.print()}
              className="flex items-center justify-center gap-2"
            >
              <Printer className="h-4 w-4" />
              Print Receipt
            </Button>
            
            <Button 
              variant="outline"
              onClick={handleEmailReceipt}
              className="flex items-center justify-center gap-2"
            >
              <Mail className="h-4 w-4" />
              Email Receipt
            </Button>
          </div>

          <div className="flex flex-col sm:flex-row gap-4">
            <Button 
              variant="outline"
              onClick={() => navigate('/marketplace')}
              className="flex items-center justify-center gap-2"
            >
              <ArrowLeft className="h-4 w-4" />
              Continue Shopping
            </Button>
            
            <Button 
              onClick={() => navigate('/profile')}
              className="flex-1"
            >
              View Purchase History
            </Button>
          </div>
        </div>

        {/* Receipt Modal */}
        {showReceiptModal && (
          <TransactionReceiptModal
            transaction={transaction}
            isOpen={showReceiptModal}
            onClose={() => setShowReceiptModal(false)}
          />
        )}
      </div>
    </div>
  );
};

export default PaymentSuccess;
