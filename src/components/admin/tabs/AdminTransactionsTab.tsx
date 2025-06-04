import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useAdminTransactions } from '@/hooks/useAdminData';

const AdminTransactionsTab = () => {
  const { data: transactions = [], isLoading } = useAdminTransactions();

  if (isLoading) return <div>Loading transactions...</div>;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold">Recent Transactions</h3>
          <p className="text-sm text-muted-foreground">
            Monitor recent transactions and identify potential issues
          </p>
        </div>
        {/* Add any additional header elements here if needed */}
      </div>

      {/* Stats Overview (Example) */}
      {/* You can add a component here to display transaction statistics */}

      <Card>
        <CardHeader>
          <CardTitle>Recent Transactions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="border-b">
                  <th className="text-left p-2">Transaction ID</th>
                  <th className="text-left p-2">Coin</th>
                  <th className="text-left p-2">Seller</th>
                  <th className="text-left p-2">Buyer</th>
                  <th className="text-left p-2">Amount</th>
                  <th className="text-left p-2">Status</th>
                  <th className="text-left p-2">Date</th>
                </tr>
              </thead>
              <tbody>
                {transactions.map((transaction) => (
                  <tr key={transaction.id} className="border-b">
                    <td className="p-2 font-mono text-sm">
                      {transaction.id.slice(0, 8)}...
                    </td>
                    <td className="p-2">
                      <div className="flex items-center gap-2">
                        {transaction.coins?.image && (
                          <img 
                            src={transaction.coins.image} 
                            alt={transaction.coins?.name || 'Coin'}
                            className="w-8 h-8 object-cover rounded"
                          />
                        )}
                        <span>{transaction.coins?.name || 'Unknown Coin'}</span>
                      </div>
                    </td>
                    <td className="p-2">
                      <div>
                        <div className="font-medium">{transaction.seller?.name || 'Unknown'}</div>
                        <div className="text-sm text-muted-foreground">{transaction.seller?.email || 'No email'}</div>
                      </div>
                    </td>
                    <td className="p-2">
                      <div>
                        <div className="font-medium">{transaction.buyer?.name || 'Unknown'}</div>
                        <div className="text-sm text-muted-foreground">{transaction.buyer?.email || 'No email'}</div>
                      </div>
                    </td>
                    <td className="p-2 font-semibold">
                      ${transaction.amount}
                    </td>
                    <td className="p-2">
                      <Badge variant={transaction.status === 'completed' ? 'default' : 'secondary'}>
                        {transaction.status}
                      </Badge>
                    </td>
                    <td className="p-2 text-sm text-muted-foreground">
                      {new Date(transaction.created_at).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminTransactionsTab;
