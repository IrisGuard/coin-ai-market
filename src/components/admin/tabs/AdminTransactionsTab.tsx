
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Eye, DollarSign } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';

interface Transaction {
  id: string;
  coin_id: string;
  seller_id: string;
  buyer_id: string;
  amount: number;
  status: string;
  transaction_type: string;
  created_at: string;
}

const AdminTransactionsTab = () => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('all');

  const fetchTransactions = async () => {
    try {
      const { data, error } = await supabase
        .from('transactions')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setTransactions(data || []);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to fetch transactions",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateTransactionStatus = async (transactionId: string, status: string) => {
    try {
      const { error } = await supabase
        .from('transactions')
        .update({ status })
        .eq('id', transactionId);

      if (error) throw error;

      await supabase.rpc('log_admin_activity', {
        action_type: 'update_transaction_status',
        target_type: 'transaction',
        target_id: transactionId,
        details: { new_status: status, timestamp: new Date().toISOString() }
      });

      setTransactions(transactions.map(transaction => 
        transaction.id === transactionId ? { ...transaction, status } : transaction
      ));

      toast({
        title: "Success",
        description: "Transaction status updated",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update transaction status",
        variant: "destructive",
      });
    }
  };

  useEffect(() => {
    fetchTransactions();
  }, []);

  const filteredTransactions = transactions.filter(transaction => 
    statusFilter === 'all' || transaction.status === statusFilter
  );

  const totalVolume = transactions
    .filter(t => t.status === 'completed')
    .reduce((sum, t) => sum + Number(t.amount), 0);

  if (loading) {
    return <div className="p-4">Loading transactions...</div>;
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold">Transaction Management</h3>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 text-green-600 font-medium">
            <DollarSign className="h-4 w-4" />
            Total Volume: ${totalVolume.toLocaleString()}
          </div>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-40">
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="completed">Completed</SelectItem>
              <SelectItem value="cancelled">Cancelled</SelectItem>
              <SelectItem value="refunded">Refunded</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="grid gap-4">
        {filteredTransactions.map((transaction) => (
          <Card key={transaction.id}>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Badge 
                      variant={
                        transaction.status === 'completed' ? 'default' :
                        transaction.status === 'pending' ? 'secondary' : 'destructive'
                      }
                    >
                      {transaction.status}
                    </Badge>
                    <Badge variant="outline">
                      {transaction.transaction_type}
                    </Badge>
                    <span className="font-medium text-green-600">
                      ${Number(transaction.amount).toLocaleString()}
                    </span>
                  </div>
                  <div className="text-sm text-gray-500">
                    <div>Transaction ID: {transaction.id.slice(0, 8)}...</div>
                    <div>Coin ID: {transaction.coin_id.slice(0, 8)}...</div>
                    <div>Date: {new Date(transaction.created_at).toLocaleString()}</div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Select
                    value={transaction.status}
                    onValueChange={(status) => handleUpdateTransactionStatus(transaction.id, status)}
                  >
                    <SelectTrigger className="w-32">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="pending">Pending</SelectItem>
                      <SelectItem value="completed">Completed</SelectItem>
                      <SelectItem value="cancelled">Cancelled</SelectItem>
                      <SelectItem value="refunded">Refunded</SelectItem>
                    </SelectContent>
                  </Select>
                  <Button size="sm" variant="outline">
                    <Eye className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredTransactions.length === 0 && (
        <div className="text-center py-8 text-gray-500">
          No transactions found matching your criteria.
        </div>
      )}
    </div>
  );
};

export default AdminTransactionsTab;
