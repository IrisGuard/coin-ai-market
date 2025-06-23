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

  // Enhanced Payment Transactions Query with RLS-optimized approach
  const { data: transactions = [], isLoading, error } = useQuery({
    queryKey: ['admin-payment-transactions'],
    queryFn: async () => {
      try {
        // With the new RLS policies, admin can access everything directly
        const { data: transactionData, error: transactionError } = await supabase
          .from('payment_transactions')
          .select('*')
          .order('created_at', { ascending: false });
        
        if (transactionError) {
          console.error('Transaction fetch error:', transactionError);
          throw transactionError;
        }

        if (!transactionData || transactionData.length === 0) {
          return [];
        }
        
        // Get unique IDs for batch fetching
        const userIds = [...new Set(transactionData.map(t => t.user_id).filter(Boolean))];
        const coinIds = [...new Set(transactionData.map(t => t.coin_id).filter(Boolean))];
        
        let profilesData = [];
        let coinsData = [];
        
        // Fetch profiles if we have user IDs
        if (userIds.length > 0) {
          const { data: profiles, error: profilesError } = await supabase
            .from('profiles')
            .select('id, name, email, verified_dealer')
            .in('id', userIds);
          
          if (profilesError) {
            console.error('Profiles fetch error:', profilesError);
          } else {
            profilesData = profiles || [];
          }
        }
        
        // Fetch coins if we have coin IDs
        if (coinIds.length > 0) {
          const { data: coins, error: coinsError } = await supabase
            .from('coins')
            .select('id, name, image, price')
            .in('id', coinIds);
          
          if (coinsError) {
            console.error('Coins fetch error:', coinsError);
          } else {
            coinsData = coins || [];
          }
        }
        
        // Combine the data with null safety
        const enrichedTransactions = transactionData.map(transaction => ({
          ...transaction,
          profiles: profilesData.find(p => p.id === transaction.user_id) || null,
          coins: coinsData.find(c => c.id === transaction.coin_id) || null
        }));
        
        console.log(`✅ Successfully loaded ${enrichedTransactions.length} transactions`);
        return enrichedTransactions;
        
      } catch (error) {
        console.error('❌ Failed to load transactions:', error);
        throw error;
      }
    },
    retry: 3,
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
  });

  // Transaction Statistics with enhanced error handling
  const { data: transactionStats } = useQuery({
    queryKey: ['admin-transaction-stats', transactions.length],
    queryFn: async () => {
      try {
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
      } catch (error) {
        console.error('Stats calculation error:', error);
        return {
          totalTransactions: 0,
          completedTransactions: 0,
          pendingTransactions: 0,
          failedTransactions: 0,
          totalRevenue: 0,
          avgTransactionValue: 0,
          todaysTransactions: 0,
          todaysRevenue: 0
        };
      }
    },
    enabled: transactions.length > 0
  });

  // Enhanced Update Transaction Status Mutation
  const updateTransactionMutation = useMutation({
    mutationFn: async ({ transactionId, status }: { transactionId: string; status: string }) => {
      console.log(`🔄 Updating transaction ${transactionId} to status: ${status}`);
      
      const { error } = await supabase
        .from('payment_transactions')
        .update({ 
          status,
          updated_at: new Date().toISOString()
        })
        .eq('id', transactionId);
      
      if (error) {
        console.error('❌ Transaction update failed:', error);
        throw error;
      }
      
      console.log(`✅ Transaction ${transactionId} updated successfully`);
    },
    onSuccess: (_, { transactionId, status }) => {
      queryClient.invalidateQueries({ queryKey: ['admin-payment-transactions'] });
      toast({
        title: "Success",
        description: `Transaction status updated to ${status}.`,
      });
    },
    onError: (error: any) => {
      console.error('❌ Transaction update mutation failed:', error);
      toast({
        title: "Error",
        description: error.message || 'Failed to update transaction status',
        variant: "destructive",
      });
    }
  });

  // Helper functions remain the same
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

  // Enhanced filtering with null safety
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

  // Show error state
  if (error) {
    console.error('❌ AdminTransactionsTab error:', error);
    return (
      <div className="space-y-6">
        <Card>
          <CardContent className="p-6">
            <div className="text-center">
              <XCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-red-700 mb-2">Failed to Load Transactions</h3>
              <p className="text-red-600 mb-4">{error.message}</p>
              <Button 
                onClick={() => queryClient.invalidateQueries({ queryKey: ['admin-payment-transactions'] })}
                variant="outline"
              >
                <RefreshCw className="h-4 w-4 mr-2" />
                Retry
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

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
          <CardDescription>
            Monitor and manage all payment transactions ({filteredTransactions.length} shown)
          </CardDescription>
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
              disabled={isLoading}
            >
              <RefreshCw className={`h-4 w-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
              Refresh
            </Button>
          </div>
          
          {isLoading ? (
            <div className="text-center py-8">
              <div className="animate-spin h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
              <p>Loading transactions...</p>
            </div>
          ) : filteredTransactions.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-muted-foreground">No transactions found matching your criteria.</p>
            </div>
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
                          {transaction.profiles?.email || 'No email'}
                        </div>
                        <Badge variant="outline" className="text-xs">Store Profile</Badge>
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
                        <span className="text-muted-foreground">Unknown Coin</span>
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
                              title="Mark as Completed"
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
                              title="Mark as Failed"
                            >
                              <XCircle className="h-4 w-4" />
                            </Button>
                          </>
                        )}
                        <Button
                          variant="outline"
                          size="sm"
                          title="View Details"
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
