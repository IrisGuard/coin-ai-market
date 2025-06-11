
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { DollarSign, CreditCard, TrendingUp, Users, RefreshCw, Eye, CheckCircle, XCircle } from 'lucide-react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';

const AdminTransactionsTab = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterMethod, setFilterMethod] = useState('all');

  const queryClient = useQueryClient();

  // Payment Transactions Query
  const { data: transactions = [], isLoading } = useQuery({
    queryKey: ['admin-payment-transactions'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('payment_transactions')
        .select(`
          *,
          profiles:user_id (
            id,
            name,
            email,
            verified_dealer
          ),
          coins:coin_id (
            id,
            name,
            image,
            price
          )
        `)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data || [];
    }
  });

  // Transaction Statistics
  const { data: transactionStats } = useQuery({
    queryKey: ['admin-transaction-stats'],
    queryFn: async () => {
      const totalTransactions = transactions.length;
      const completedTransactions = transactions.filter(tx => tx.status === 'completed').length;
      const pendingTransactions = transactions.filter(tx => tx.status === 'pending').length;
      const failedTransactions = transactions.filter(tx => tx.status === 'failed').length;
      const totalRevenue = transactions
        .filter(tx => tx.status === 'completed')
        .reduce((sum, tx) => sum + Number(tx.amount || 0), 0);
      const avgTransactionValue = completedTransactions > 0 
        ? totalRevenue / completedTransactions 
        : 0;
      
      // Today's stats
      const today = new Date().toDateString();
      const todaysTransactions = transactions.filter(tx => 
        new Date(tx.created_at).toDateString() === today
      );
      const todaysRevenue = todaysTransactions
        .filter(tx => tx.status === 'completed')
        .reduce((sum, tx) => sum + Number(tx.amount || 0), 0);
      
      return {
        totalTransactions,
        completedTransactions,
        pendingTransactions,
        failedTransactions,
        totalRevenue,
        avgTransactionValue,
        todaysTransactions: todaysTransactions.length,
        todaysRevenue
      };
    },
    enabled: transactions.length > 0
  });

  // Update Transaction Status Mutation
  const updateTransactionMutation = useMutation({
    mutationFn: async ({ transactionId, status }: { transactionId: string; status: string }) => {
      const { error } = await supabase
        .from('payment_transactions')
        .update({ 
          status,
          updated_at: new Date().toISOString()
        })
        .eq('id', transactionId);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-payment-transactions'] });
      toast({
        title: "Success",
        description: "Transaction status updated successfully.",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    }
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'failed': return 'bg-red-100 text-red-800';
      case 'cancelled': return 'bg-gray-100 text-gray-800';
      default: return 'bg-blue-100 text-blue-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed': return <CheckCircle className="h-4 w-4" />;
      case 'pending': return <DollarSign className="h-4 w-4" />;
      case 'failed': return <XCircle className="h-4 w-4" />;
      default: return <DollarSign className="h-4 w-4" />;
    }
  };

  const getMethodColor = (method: string) => {
    switch (method) {
      case 'credit_card': return 'bg-blue-100 text-blue-800';
      case 'paypal': return 'bg-purple-100 text-purple-800';
      case 'bank_transfer': return 'bg-green-100 text-green-800';
      case 'crypto': return 'bg-orange-100 text-orange-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const filteredTransactions = transactions.filter(transaction => {
    const user = transaction.profiles;
    const coin = transaction.coins;
    
    const matchesSearch = 
      transaction.id?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user?.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      coin?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      transaction.transak_order_id?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = filterStatus === 'all' || transaction.status === filterStatus;
    const matchesMethod = filterMethod === 'all' || transaction.payment_method === filterMethod;
    
    return matchesSearch && matchesStatus && matchesMethod;
  });

  return (
    <div className="space-y-6">
      {/* Transaction Statistics Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              ${(transactionStats?.totalRevenue || 0).toLocaleString()}
            </div>
            <p className="text-xs text-muted-foreground">
              From {transactionStats?.completedTransactions || 0} completed transactions
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Today's Revenue</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              ${(transactionStats?.todaysRevenue || 0).toLocaleString()}
            </div>
            <p className="text-xs text-muted-foreground">
              From {transactionStats?.todaysTransactions || 0} transactions today
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg Transaction</CardTitle>
            <CreditCard className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              ${(transactionStats?.avgTransactionValue || 0).toFixed(2)}
            </div>
            <p className="text-xs text-muted-foreground">Average transaction value</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{transactionStats?.pendingTransactions || 0}</div>
            <p className="text-xs text-muted-foreground">Transactions pending</p>
          </CardContent>
        </Card>
      </div>

      {/* Transaction Status Overview */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Completed</p>
                <p className="text-xl font-bold text-green-600">
                  {transactionStats?.completedTransactions || 0}
                </p>
              </div>
              <CheckCircle className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Pending</p>
                <p className="text-xl font-bold text-yellow-600">
                  {transactionStats?.pendingTransactions || 0}
                </p>
              </div>
              <DollarSign className="h-8 w-8 text-yellow-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Failed</p>
                <p className="text-xl font-bold text-red-600">
                  {transactionStats?.failedTransactions || 0}
                </p>
              </div>
              <XCircle className="h-8 w-8 text-red-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total</p>
                <p className="text-xl font-bold">
                  {transactionStats?.totalTransactions || 0}
                </p>
              </div>
              <CreditCard className="h-8 w-8 text-muted-foreground" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Transactions Management */}
      <Card>
        <CardHeader>
          <CardTitle>Payment Transactions</CardTitle>
          <CardDescription>Monitor and manage all payment transactions</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-2">
              <Input
                placeholder="Search transactions..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="max-w-sm"
              />
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-md"
              >
                <option value="all">All Status</option>
                <option value="pending">Pending</option>
                <option value="completed">Completed</option>
                <option value="failed">Failed</option>
                <option value="cancelled">Cancelled</option>
              </select>
              <select
                value={filterMethod}
                onChange={(e) => setFilterMethod(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-md"
              >
                <option value="all">All Methods</option>
                <option value="credit_card">Credit Card</option>
                <option value="paypal">PayPal</option>
                <option value="bank_transfer">Bank Transfer</option>
                <option value="crypto">Cryptocurrency</option>
              </select>
            </div>
            <Button
              onClick={() => queryClient.invalidateQueries({ queryKey: ['admin-payment-transactions'] })}
              variant="outline"
              size="sm"
            >
              <RefreshCw className="h-4 w-4 mr-2" />
              Refresh
            </Button>
          </div>
          
          {isLoading ? (
            <div className="text-center py-8">Loading transactions...</div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Transaction ID</TableHead>
                  <TableHead>User</TableHead>
                  <TableHead>Coin</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Method</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredTransactions.map((transaction) => (
                  <TableRow key={transaction.id}>
                    <TableCell className="font-mono text-sm">
                      {transaction.id.substring(0, 8)}...
                    </TableCell>
                    <TableCell>
                      <div>
                        <div className="font-medium">
                          {transaction.profiles?.name || 'Unknown User'}
                        </div>
                        <div className="text-sm text-muted-foreground">
                          {transaction.profiles?.email}
                        </div>
                        {transaction.profiles?.verified_dealer && (
                          <Badge variant="outline" className="text-xs">Verified Dealer</Badge>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      {transaction.coins ? (
                        <div className="flex items-center gap-2">
                          {transaction.coins.image && (
                            <img 
                              src={transaction.coins.image} 
                              alt={transaction.coins.name}
                              className="w-8 h-8 object-cover rounded"
                            />
                          )}
                          <div>
                            <div className="text-sm font-medium">{transaction.coins.name}</div>
                            <div className="text-xs text-muted-foreground">
                              ${transaction.coins.price}
                            </div>
                          </div>
                        </div>
                      ) : (
                        'Unknown Coin'
                      )}
                    </TableCell>
                    <TableCell className="font-medium">
                      ${Number(transaction.amount || 0).toFixed(2)} {transaction.currency}
                    </TableCell>
                    <TableCell>
                      <Badge className={getMethodColor(transaction.payment_method || 'unknown')}>
                        {transaction.payment_method || 'Unknown'}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        {getStatusIcon(transaction.status)}
                        <Badge className={getStatusColor(transaction.status)}>
                          {transaction.status}
                        </Badge>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div>
                        <div>{new Date(transaction.created_at).toLocaleDateString()}</div>
                        <div className="text-sm text-muted-foreground">
                          {new Date(transaction.created_at).toLocaleTimeString()}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        {transaction.status === 'pending' && (
                          <>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => updateTransactionMutation.mutate({ 
                                transactionId: transaction.id, 
                                status: 'completed' 
                              })}
                              disabled={updateTransactionMutation.isPending}
                            >
                              <CheckCircle className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => updateTransactionMutation.mutate({ 
                                transactionId: transaction.id, 
                                status: 'failed' 
                              })}
                              disabled={updateTransactionMutation.isPending}
                            >
                              <XCircle className="h-4 w-4" />
                            </Button>
                          </>
                        )}
                        <Button
                          variant="outline"
                          size="sm"
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminTransactionsTab;
