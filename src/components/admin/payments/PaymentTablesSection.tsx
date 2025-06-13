
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CreditCard, DollarSign, Receipt, Calendar, TrendingUp, Users } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

const PaymentTablesSection = () => {
  const paymentTables = [
    {
      name: 'payment_transactions',
      description: 'All payment transaction records',
      records: '8,901',
      status: 'active',
      icon: CreditCard,
      totalValue: '$234,567.89'
    },
    {
      name: 'payment_methods',
      description: 'User payment method configurations',
      records: '1,234',
      status: 'active',
      icon: Receipt,
      totalValue: 'N/A'
    },
    {
      name: 'subscription_plans',
      description: 'Available subscription tiers',
      records: '12',
      status: 'active',
      icon: Calendar,
      totalValue: '$50-$500/mo'
    },
    {
      name: 'invoices',
      description: 'Generated invoice records',
      records: '5,678',
      status: 'active',
      icon: DollarSign,
      totalValue: '$189,234.56'
    }
  ];

  const paymentStats = [
    { label: 'Total Revenue', value: '$423,802.45', icon: DollarSign, color: 'text-green-600' },
    { label: 'Active Subscriptions', value: '342', icon: Users, color: 'text-blue-600' },
    { label: 'Success Rate', value: '98.5%', icon: TrendingUp, color: 'text-emerald-600' },
    { label: 'Avg Transaction', value: '$47.65', icon: Receipt, color: 'text-purple-600' }
  ];

  return (
    <div className="space-y-6">
      {/* Payment Statistics */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {paymentStats.map((stat) => {
          const IconComponent = stat.icon;
          return (
            <Card key={stat.label}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">{stat.label}</CardTitle>
                <IconComponent className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className={`text-2xl font-bold ${stat.color}`}>{stat.value}</div>
                <p className="text-xs text-muted-foreground">Last 30 days</p>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Payment Tables */}
      <div className="grid gap-4 md:grid-cols-2">
        {paymentTables.map((table) => {
          const IconComponent = table.icon;
          return (
            <Card key={table.name} className="hover:shadow-md transition-shadow">
              <CardHeader className="pb-3">
                <div className="flex items-center gap-2">
                  <IconComponent className="h-5 w-5 text-green-600" />
                  <CardTitle className="text-lg">{table.name}</CardTitle>
                  <Badge variant="secondary" className="bg-green-100 text-green-800">
                    {table.status}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-3">{table.description}</p>
                
                <div className="flex justify-between items-center mb-3">
                  <div className="text-sm">
                    <span className="font-medium">{table.records}</span> records
                  </div>
                  <div className="text-sm font-medium text-green-600">
                    {table.totalValue}
                  </div>
                </div>

                <div className="flex gap-2">
                  <Button variant="outline" size="sm" className="flex-1">
                    View Details
                  </Button>
                  <Button variant="outline" size="sm" className="flex-1">
                    Export
                  </Button>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Recent Transactions */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Transactions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {[
              {
                id: 'TXN-001',
                amount: '$125.99',
                type: 'Coin Purchase',
                status: 'completed',
                timestamp: '2 minutes ago',
                user: 'user@example.com'
              },
              {
                id: 'TXN-002',
                amount: '$49.99',
                type: 'Subscription',
                status: 'completed',
                timestamp: '15 minutes ago',
                user: 'dealer@example.com'
              },
              {
                id: 'TXN-003',
                amount: '$299.99',
                type: 'Auction Bid',
                status: 'pending',
                timestamp: '1 hour ago',
                user: 'collector@example.com'
              }
            ].map((transaction) => (
              <div key={transaction.id} className="flex items-center justify-between p-3 border rounded-lg">
                <div className="flex items-center gap-3">
                  <div className={`w-2 h-2 rounded-full ${
                    transaction.status === 'completed' ? 'bg-green-500' :
                    transaction.status === 'pending' ? 'bg-yellow-500' : 'bg-red-500'
                  }`} />
                  <div>
                    <p className="font-medium">{transaction.id} • {transaction.type}</p>
                    <p className="text-sm text-muted-foreground">{transaction.user}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-medium text-green-600">{transaction.amount}</p>
                  <p className="text-sm text-muted-foreground">{transaction.timestamp}</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default PaymentTablesSection;
