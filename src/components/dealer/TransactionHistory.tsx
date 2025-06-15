
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { format } from 'date-fns';
import { Receipt, DollarSign, Calendar, User, Coins, Download, Filter } from 'lucide-react';

interface Transaction {
  id: string;
  amount: number;
  currency: string;
  status: string;
  order_type: string;
  created_at: string;
  coin_id?: string;
  user_id: string;
  profiles?: {
    name?: string;
    email?: string;
  };
  coins?: {
    name?: string;
    image?: string;
  };
}

const TransactionHistory = () => {
  const { user } = useAuth();
  const [dateFilter, setDateFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  const { data: transactions = [], isLoading } = useQuery({
    queryKey: ['dealer-transactions', user?.id, dateFilter, statusFilter],
    queryFn: async () => {
      if (!user?.id) return [];
      
      let query = supabase
        .from('payment_transactions')
        .select(`
          *,
          profiles!payment_transactions_user_id_fkey (
            name,
            email
          ),
          coins (
            name,
            image
          )
        `)
        .order('created_at', { ascending: false });

      // Filter by date if provided
      if (dateFilter) {
        const startDate = new Date(dateFilter);
        const endDate = new Date(startDate);
        endDate.setDate(endDate.getDate() + 1);
        
        query = query
          .gte('created_at', startDate.toISOString())
          .lt('created_at', endDate.toISOString());
      }

      // Filter by status if not 'all'
      if (statusFilter !== 'all') {
        query = query.eq('status', statusFilter);
      }

      const { data, error } = await query;
      
      if (error) throw error;
      return data || [];
    },
    enabled: !!user?.id,
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

  const getOrderTypeIcon = (orderType: string) => {
    switch (orderType) {
      case 'coin_purchase': return <Coins className="h-4 w-4" />;
      case 'subscription': return <Receipt className="h-4 w-4" />;
      case 'store_upgrade': return <DollarSign className="h-4 w-4" />;
      default: return <Receipt className="h-4 w-4" />;
    }
  };

  const totalRevenue = transactions
    .filter(t => t.status === 'completed')
    .reduce((sum, t) => sum + t.amount, 0);

  const exportTransactions = () => {
    const csvContent = [
      ['Date', 'Amount', 'Currency', 'Status', 'Type', 'Customer', 'Coin'].join(','),
      ...transactions.map(t => [
        format(new Date(t.created_at), 'yyyy-MM-dd HH:mm:ss'),
        t.amount,
        t.currency,
        t.status,
        t.order_type,
        t.profiles?.name || t.profiles?.email || 'Unknown',
        t.coins?.name || 'N/A'
      ].join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `transactions-${format(new Date(), 'yyyy-MM-dd')}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  if (isLoading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="text-center">Loading transaction history...</div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Receipt className="h-6 w-6" />
            Transaction History
            <Badge variant="outline">{transactions.length} transactions</Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <Card>
              <CardContent className="p-4">
                <div className="text-2xl font-bold text-green-600">
                  ${totalRevenue.toLocaleString()}
                </div>
                <div className="text-sm text-gray-600">Total Revenue</div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-4">
                <div className="text-2xl font-bold">
                  {transactions.filter(t => t.status === 'completed').length}
                </div>
                <div className="text-sm text-gray-600">Completed</div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-4">
                <div className="text-2xl font-bold">
                  {transactions.filter(t => t.status === 'pending').length}
                </div>
                <div className="text-sm text-gray-600">Pending</div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-4">
                <div className="text-2xl font-bold">
                  {transactions.filter(t => t.order_type === 'coin_purchase').length}
                </div>
                <div className="text-sm text-gray-600">Coin Sales</div>
              </CardContent>
            </Card>
          </div>

          <div className="flex gap-4 mb-6">
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              <Input
                type="date"
                value={dateFilter}
                onChange={(e) => setDateFilter(e.target.value)}
                className="w-auto"
              />
            </div>
            
            <div className="flex items-center gap-2">
              <Filter className="h-4 w-4" />
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="px-3 py-2 border rounded-md"
              >
                <option value="all">All Status</option>
                <option value="completed">Completed</option>
                <option value="pending">Pending</option>
                <option value="failed">Failed</option>
                <option value="cancelled">Cancelled</option>
              </select>
            </div>
            
            <Button
              variant="outline"
              onClick={exportTransactions}
              className="ml-auto"
            >
              <Download className="h-4 w-4 mr-2" />
              Export CSV
            </Button>
          </div>

          <div className="space-y-4">
            {transactions.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <Receipt className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>No transactions found.</p>
                <p className="text-sm">Your transaction history will appear here once you start selling.</p>
              </div>
            ) : (
              transactions.map((transaction) => (
                <Card key={transaction.id}>
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className="flex items-center gap-2">
                          {getOrderTypeIcon(transaction.order_type)}
                          <div>
                            <div className="font-medium">
                              {transaction.order_type.replace('_', ' ').toUpperCase()}
                            </div>
                            <div className="text-sm text-gray-600">
                              {format(new Date(transaction.created_at), 'MMM dd, yyyy HH:mm')}
                            </div>
                          </div>
                        </div>
                        
                        {transaction.coins && (
                          <div className="flex items-center gap-2">
                            <img
                              src={transaction.coins.image || '/placeholder.svg'}
                              alt={transaction.coins.name}
                              className="w-8 h-8 rounded object-cover"
                            />
                            <span className="text-sm font-medium">{transaction.coins.name}</span>
                          </div>
                        )}
                        
                        <div className="flex items-center gap-2">
                          <User className="h-4 w-4 text-gray-400" />
                          <span className="text-sm">
                            {transaction.profiles?.name || transaction.profiles?.email || 'Unknown Customer'}
                          </span>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-4">
                        <Badge className={getStatusColor(transaction.status)}>
                          {transaction.status}
                        </Badge>
                        
                        <div className="text-right">
                          <div className="font-bold text-lg">
                            ${transaction.amount.toLocaleString()}
                          </div>
                          <div className="text-sm text-gray-600">
                            {transaction.currency}
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default TransactionHistory;
