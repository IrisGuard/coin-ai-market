
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { DollarSign, TrendingUp, CreditCard, BarChart3, Download, Filter } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

const AdminRevenueTab = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');

  // Revenue Statistics
  const { data: revenueStats } = useQuery({
    queryKey: ['admin-revenue-stats'],
    queryFn: async () => {
      const { data: transactions } = await supabase
        .from('payment_transactions')
        .select('*');
      
      const totalRevenue = transactions?.reduce((sum, t) => 
        t.status === 'completed' ? sum + Number(t.amount) : sum, 0) || 0;
      
      const completedTransactions = transactions?.filter(t => t.status === 'completed').length || 0;
      const pendingTransactions = transactions?.filter(t => t.status === 'pending').length || 0;
      
      return {
        totalRevenue,
        completedTransactions,
        pendingTransactions,
        totalTransactions: transactions?.length || 0
      };
    }
  });

  // Payment Transactions
  const { data: transactions = [] } = useQuery({
    queryKey: ['admin-payment-transactions'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('payment_transactions')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data || [];
    }
  });

  // Revenue Forecasts
  const { data: forecasts = [] } = useQuery({
    queryKey: ['admin-revenue-forecasts'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('revenue_forecasts')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data || [];
    }
  });

  const filteredTransactions = transactions.filter(transaction => {
    const matchesSearch = transaction.id?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         transaction.user_id?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === 'all' || transaction.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-6">
      {/* Revenue Statistics Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${revenueStats?.totalRevenue?.toFixed(2) || '0.00'}</div>
            <p className="text-xs text-muted-foreground">All time revenue</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Completed Transactions</CardTitle>
            <CreditCard className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{revenueStats?.completedTransactions || 0}</div>
            <p className="text-xs text-muted-foreground">Successful payments</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Transactions</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{revenueStats?.pendingTransactions || 0}</div>
            <p className="text-xs text-muted-foreground">Awaiting completion</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Transactions</CardTitle>
            <BarChart3 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{revenueStats?.totalTransactions || 0}</div>
            <p className="text-xs text-muted-foreground">All transactions</p>
          </CardContent>
        </Card>
      </div>

      {/* Revenue Management Tabs */}
      <Tabs defaultValue="transactions" className="space-y-4">
        <TabsList>
          <TabsTrigger value="transactions">Payment Transactions</TabsTrigger>
          <TabsTrigger value="forecasts">Revenue Forecasts</TabsTrigger>
        </TabsList>

        <TabsContent value="transactions" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Payment Transactions</CardTitle>
              <CardDescription>Manage and monitor payment transactions</CardDescription>
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
                  </select>
                </div>
                <Button variant="outline" size="sm">
                  <Download className="h-4 w-4 mr-2" />
                  Export
                </Button>
              </div>
              
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Transaction ID</TableHead>
                    <TableHead>User ID</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead>Currency</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Payment Method</TableHead>
                    <TableHead>Created</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredTransactions.map((transaction) => (
                    <TableRow key={transaction.id}>
                      <TableCell className="font-mono text-sm">
                        {transaction.id.substring(0, 8)}...
                      </TableCell>
                      <TableCell className="font-mono text-sm">
                        {transaction.user_id?.substring(0, 8)}...
                      </TableCell>
                      <TableCell className="font-bold">
                        ${Number(transaction.amount).toFixed(2)}
                      </TableCell>
                      <TableCell>{transaction.currency}</TableCell>
                      <TableCell>
                        <Badge variant={
                          transaction.status === 'completed' ? 'default' :
                          transaction.status === 'pending' ? 'secondary' : 'destructive'
                        }>
                          {transaction.status}
                        </Badge>
                      </TableCell>
                      <TableCell>{transaction.payment_method || 'N/A'}</TableCell>
                      <TableCell>
                        {new Date(transaction.created_at).toLocaleDateString()}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="forecasts" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Revenue Forecasts</CardTitle>
              <CardDescription>AI-generated revenue predictions and forecasts</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Forecast Type</TableHead>
                    <TableHead>Period</TableHead>
                    <TableHead>Predicted Revenue</TableHead>
                    <TableHead>Confidence</TableHead>
                    <TableHead>Created</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {forecasts.map((forecast) => (
                    <TableRow key={forecast.id}>
                      <TableCell>
                        <Badge variant="outline">{forecast.forecast_type}</Badge>
                      </TableCell>
                      <TableCell>{forecast.forecast_period}</TableCell>
                      <TableCell className="font-bold">
                        ${Number(forecast.predicted_revenue).toFixed(2)}
                      </TableCell>
                      <TableCell>
                        <Badge variant={
                          forecast.confidence_score > 0.8 ? 'default' :
                          forecast.confidence_score > 0.6 ? 'secondary' : 'destructive'
                        }>
                          {(forecast.confidence_score * 100).toFixed(1)}%
                        </Badge>
                      </TableCell>
                      <TableCell>
                        {new Date(forecast.created_at).toLocaleDateString()}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AdminRevenueTab;
