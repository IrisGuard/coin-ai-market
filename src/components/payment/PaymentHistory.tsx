import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  Download, 
  Search, 
  Filter, 
  Calendar,
  CreditCard,
  ArrowUpDown,
  Eye,
  RefreshCw
} from 'lucide-react';
import { TransactionDetails, PaymentHistory as PaymentHistoryType } from '@/types/paymentTypes';
import { useTransakPayment } from '@/hooks/useTransakPayment';

interface PaymentHistoryProps {
  userId?: string;
}

const PaymentHistory = ({ userId }: PaymentHistoryProps) => {
  const { getUserTransactions } = useTransakPayment();
  const [transactions, setTransactions] = useState<TransactionDetails[]>([]);
  const [filteredTransactions, setFilteredTransactions] = useState<TransactionDetails[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'date' | 'amount'>('date');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');

  useEffect(() => {
    loadTransactions();
  }, []);

  useEffect(() => {
    filterTransactions();
  }, [transactions, searchTerm, statusFilter, sortBy, sortOrder]);

  const loadTransactions = async () => {
    setIsLoading(true);
    try {
      const userTransactions = await getUserTransactions();
      
      // Convert to TransactionDetails format
      const formattedTransactions: TransactionDetails[] = userTransactions.map(tx => ({
        id: tx.id,
        userId: tx.user_id,
        coinId: tx.coin_id,
        amount: tx.amount,
        currency: tx.currency,
        status: tx.status as any,
        paymentMethod: tx.payment_method || 'Credit Card',
        transactionDate: new Date(tx.created_at),
        coinName: 'Coin Purchase',
        fees: {
          platform: tx.amount * 0.03,
          payment: tx.amount * 0.029 + 0.30,
          total: tx.amount * 0.059 + 0.30
        }
      }));
      
      setTransactions(formattedTransactions);
    } catch (error) {
      console.error('Failed to load transactions:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const filterTransactions = () => {
    let filtered = [...transactions];

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(tx =>
        tx.coinName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        tx.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        tx.paymentMethod.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Status filter
    if (statusFilter !== 'all') {
      filtered = filtered.filter(tx => tx.status === statusFilter);
    }

    // Sort
    filtered.sort((a, b) => {
      if (sortBy === 'date') {
        const dateA = new Date(a.transactionDate).getTime();
        const dateB = new Date(b.transactionDate).getTime();
        return sortOrder === 'desc' ? dateB - dateA : dateA - dateB;
      } else {
        return sortOrder === 'desc' ? b.amount - a.amount : a.amount - b.amount;
      }
    });

    setFilteredTransactions(filtered);
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'completed':
        return <Badge className="bg-green-100 text-green-800">Completed</Badge>;
      case 'pending':
        return <Badge className="bg-yellow-100 text-yellow-800">Pending</Badge>;
      case 'failed':
        return <Badge variant="destructive">Failed</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const calculateTotalSpent = () => {
    return filteredTransactions
      .filter(tx => tx.status === 'completed')
      .reduce((total, tx) => total + tx.amount, 0);
  };

  const exportTransactions = () => {
    const csvContent = [
      ['Date', 'Transaction ID', 'Coin', 'Amount', 'Currency', 'Status', 'Payment Method'],
      ...filteredTransactions.map(tx => [
        new Date(tx.transactionDate).toLocaleDateString(),
        tx.id,
        tx.coinName || 'N/A',
        tx.amount.toString(),
        tx.currency,
        tx.status,
        tx.paymentMethod
      ])
    ].map(row => row.join(',')).join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `payment-history-${new Date().toISOString().split('T')[0]}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  if (isLoading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-center space-x-2">
            <RefreshCw className="h-4 w-4 animate-spin" />
            <span>Loading payment history...</span>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <CreditCard className="h-5 w-5 text-blue-600" />
              <div>
                <p className="text-sm text-gray-600">Total Transactions</p>
                <p className="text-xl font-bold">{filteredTransactions.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Calendar className="h-5 w-5 text-green-600" />
              <div>
                <p className="text-sm text-gray-600">Total Spent</p>
                <p className="text-xl font-bold">${calculateTotalSpent().toFixed(2)}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Eye className="h-5 w-5 text-purple-600" />
              <div>
                <p className="text-sm text-gray-600">This Month</p>
                <p className="text-xl font-bold">
                  {filteredTransactions.filter(tx => 
                    new Date(tx.transactionDate).getMonth() === new Date().getMonth()
                  ).length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters and Controls */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            Payment History
            <div className="flex items-center space-x-2">
              <Button variant="outline" size="sm" onClick={loadTransactions}>
                <RefreshCw className="h-4 w-4 mr-2" />
                Refresh
              </Button>
              <Button variant="outline" size="sm" onClick={exportTransactions}>
                <Download className="h-4 w-4 mr-2" />
                Export
              </Button>
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search transactions..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full md:w-40">
                <Filter className="h-4 w-4 mr-2" />
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="failed">Failed</SelectItem>
              </SelectContent>
            </Select>
            
            <Button
              variant="outline"
              onClick={() => {
                setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
              }}
              className="w-full md:w-auto"
            >
              <ArrowUpDown className="h-4 w-4 mr-2" />
              {sortBy === 'date' ? 'Date' : 'Amount'} ({sortOrder})
            </Button>
          </div>

          {/* Transactions Table */}
          <div className="space-y-4">
            {filteredTransactions.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                No transactions found
              </div>
            ) : (
              filteredTransactions.map((transaction) => (
                <Card key={transaction.id} className="border-l-4 border-l-blue-500">
                  <CardContent className="p-4">
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-2 md:space-y-0">
                      <div className="flex-1">
                        <div className="font-medium">{transaction.coinName}</div>
                        <div className="text-sm text-gray-600">
                          ID: {transaction.id.substring(0, 8)}...
                        </div>
                        <div className="text-sm text-gray-600">
                          {new Date(transaction.transactionDate).toLocaleDateString()} at{' '}
                          {new Date(transaction.transactionDate).toLocaleTimeString()}
                        </div>
                      </div>
                      
                      <div className="text-right">
                        <div className="font-bold text-lg">
                          {transaction.amount.toFixed(2)} {transaction.currency}
                        </div>
                        <div className="text-sm text-gray-600 mb-2">
                          via {transaction.paymentMethod}
                        </div>
                        {getStatusBadge(transaction.status)}
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

export default PaymentHistory;
