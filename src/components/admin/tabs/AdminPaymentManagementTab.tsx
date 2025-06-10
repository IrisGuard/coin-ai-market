
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { 
  CreditCard, 
  DollarSign, 
  AlertTriangle, 
  CheckCircle, 
  Clock, 
  RefreshCw,
  TrendingUp,
  Users,
  Globe,
  Shield
} from 'lucide-react';

const AdminPaymentManagementTab = () => {
  const [paymentFilter, setPaymentFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  // Mock data - in real app this would come from hooks
  const paymentTransactions = [
    {
      id: '1',
      user_id: 'user-1',
      amount: 250.00,
      currency: 'USD',
      status: 'completed',
      payment_method: 'credit_card',
      transak_order_id: 'TXN-001',
      created_at: new Date().toISOString(),
      user_email: 'buyer@example.com',
      coin_name: '1921 Morgan Silver Dollar'
    },
    {
      id: '2',
      user_id: 'user-2',
      amount: 1500.00,
      currency: 'EUR',
      status: 'pending',
      payment_method: 'bank_transfer',
      transak_order_id: 'TXN-002',
      created_at: new Date().toISOString(),
      user_email: 'collector@example.com',
      coin_name: 'Rare Gold Coin Collection'
    }
  ];

  const paymentStats = {
    totalVolume: 45750.00,
    totalTransactions: 156,
    successRate: 94.2,
    pendingPayments: 12,
    completedToday: 8,
    refundsProcessed: 3
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'failed': return 'bg-red-100 text-red-800';
      case 'refunded': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed': return <CheckCircle className="w-4 h-4" />;
      case 'pending': return <Clock className="w-4 h-4" />;
      case 'failed': return <AlertTriangle className="w-4 h-4" />;
      default: return <RefreshCw className="w-4 h-4" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Payment Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-6 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <DollarSign className="w-5 h-5 text-green-600" />
              <div>
                <p className="text-sm text-gray-600">Total Volume</p>
                <p className="text-xl font-bold">${paymentStats.totalVolume.toLocaleString()}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <CreditCard className="w-5 h-5 text-blue-600" />
              <div>
                <p className="text-sm text-gray-600">Transactions</p>
                <p className="text-xl font-bold">{paymentStats.totalTransactions}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-green-600" />
              <div>
                <p className="text-sm text-gray-600">Success Rate</p>
                <p className="text-xl font-bold">{paymentStats.successRate}%</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Clock className="w-5 h-5 text-orange-600" />
              <div>
                <p className="text-sm text-gray-600">Pending</p>
                <p className="text-xl font-bold text-orange-600">{paymentStats.pendingPayments}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <CheckCircle className="w-5 h-5 text-green-600" />
              <div>
                <p className="text-sm text-gray-600">Today</p>
                <p className="text-xl font-bold">{paymentStats.completedToday}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <RefreshCw className="w-5 h-5 text-blue-600" />
              <div>
                <p className="text-sm text-gray-600">Refunds</p>
                <p className="text-xl font-bold">{paymentStats.refundsProcessed}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Transak Integration Status */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="w-5 h-5" />
            Transak Integration Status
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="flex items-center gap-3 p-4 border rounded-lg">
              <div className="w-3 h-3 bg-green-500 rounded-full"></div>
              <div>
                <p className="font-medium">API Connection</p>
                <p className="text-sm text-gray-600">Connected & Operational</p>
              </div>
            </div>
            <div className="flex items-center gap-3 p-4 border rounded-lg">
              <div className="w-3 h-3 bg-green-500 rounded-full"></div>
              <div>
                <p className="font-medium">Webhook Status</p>
                <p className="text-sm text-gray-600">Receiving Updates</p>
              </div>
            </div>
            <div className="flex items-center gap-3 p-4 border rounded-lg">
              <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
              <div>
                <p className="font-medium">Rate Limits</p>
                <p className="text-sm text-gray-600">75% of Daily Limit</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Payment Transactions Management */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <CreditCard className="h-5 w-5" />
              Payment Transactions
            </CardTitle>
            <div className="flex gap-2">
              <Button variant="outline">
                <RefreshCw className="w-4 h-4 mr-2" />
                Sync with Transak
              </Button>
              <Button>
                <DollarSign className="w-4 h-4 mr-2" />
                Process Refund
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4 mb-6">
            <div className="flex-1">
              <Input
                placeholder="Search by user email, transaction ID, or coin..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full"
              />
            </div>
            <Select value={paymentFilter} onValueChange={setPaymentFilter}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Payments</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="failed">Failed</SelectItem>
                <SelectItem value="refunded">Refunded</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="border rounded-lg">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Transaction</TableHead>
                  <TableHead>User</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Method</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Coin</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {paymentTransactions.map((payment) => (
                  <TableRow key={payment.id}>
                    <TableCell>
                      <div>
                        <div className="font-mono text-xs">{payment.transak_order_id}</div>
                        <div className="text-xs text-gray-500">ID: {payment.id}</div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Users className="w-4 h-4 text-gray-400" />
                        <div>
                          <div className="font-medium text-sm">{payment.user_email}</div>
                          <div className="text-xs text-gray-500">ID: {payment.user_id}</div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div>
                        <div className="font-medium">${payment.amount.toFixed(2)}</div>
                        <div className="text-xs text-gray-500">{payment.currency}</div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline">
                        {payment.payment_method.replace('_', ' ')}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs ${getStatusColor(payment.status)}`}>
                        {getStatusIcon(payment.status)}
                        {payment.status}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="max-w-32 truncate text-sm" title={payment.coin_name}>
                        {payment.coin_name}
                      </div>
                    </TableCell>
                    <TableCell className="text-sm">
                      {new Date(payment.created_at).toLocaleDateString()}
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-1">
                        <Button size="sm" variant="outline">View</Button>
                        {payment.status === 'completed' && (
                          <Button size="sm" variant="outline">Refund</Button>
                        )}
                        {payment.status === 'pending' && (
                          <Button size="sm" variant="outline">Process</Button>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Payment Actions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Button className="flex items-center gap-2 h-16">
              <RefreshCw className="w-5 h-5" />
              <div className="text-left">
                <div className="font-medium">Sync Payments</div>
                <div className="text-xs opacity-80">Update from Transak</div>
              </div>
            </Button>
            <Button variant="outline" className="flex items-center gap-2 h-16">
              <DollarSign className="w-5 h-5" />
              <div className="text-left">
                <div className="font-medium">Process Refunds</div>
                <div className="text-xs opacity-80">Handle pending refunds</div>
              </div>
            </Button>
            <Button variant="outline" className="flex items-center gap-2 h-16">
              <Globe className="w-5 h-5" />
              <div className="text-left">
                <div className="font-medium">Export Report</div>
                <div className="text-xs opacity-80">Financial report</div>
              </div>
            </Button>
            <Button variant="outline" className="flex items-center gap-2 h-16">
              <Shield className="w-5 h-5" />
              <div className="text-left">
                <div className="font-medium">Security Check</div>
                <div className="text-xs opacity-80">Verify transactions</div>
              </div>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminPaymentManagementTab;
