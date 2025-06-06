
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  Clock, 
  CheckCircle, 
  XCircle, 
  ArrowUpRight, 
  ArrowDownLeft, 
  TrendingUp,
  Eye,
  CreditCard
} from 'lucide-react';
import { Transaction } from '@/hooks/useTransactions';
import { toast } from 'sonner';

interface TransactionTableProps {
  transactions: Transaction[];
  loading: boolean;
}

export const TransactionTable = ({ transactions, loading }: TransactionTableProps) => {
  const getTransactionIcon = (type: string, status: string) => {
    if (status === 'pending') return <Clock className="w-5 h-5 text-yellow-600" />;
    if (status === 'failed' || status === 'cancelled') return <XCircle className="w-5 h-5 text-red-600" />;
    if (status === 'completed') {
      switch (type) {
        case 'purchase':
        case 'deposit':
          return <ArrowDownLeft className="w-5 h-5 text-green-600" />;
        case 'sale':
        case 'withdrawal':
          return <ArrowUpRight className="w-5 h-5 text-blue-600" />;
        case 'bid':
          return <TrendingUp className="w-5 h-5 text-purple-600" />;
        default:
          return <CheckCircle className="w-5 h-5 text-green-600" />;
      }
    }
    return <CheckCircle className="w-5 h-5 text-green-600" />;
  };

  const getStatusVariant = (status: string) => {
    switch (status) {
      case 'completed': return 'default';
      case 'pending': return 'secondary';
      case 'failed': return 'destructive';
      case 'cancelled': return 'outline';
      default: return 'secondary';
    }
  };

  const getTypeVariant = (type: string) => {
    switch (type) {
      case 'purchase': return 'default';
      case 'sale': return 'secondary';
      case 'bid': return 'outline';
      default: return 'secondary';
    }
  };

  if (loading) {
    return (
      <Card>
        <CardContent className="p-12 text-center">
          <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading transactions...</p>
        </CardContent>
      </Card>
    );
  }

  if (transactions.length === 0) {
    return (
      <Card>
        <CardContent className="p-12 text-center">
          <CreditCard className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-xl font-semibold mb-2">No Transactions Found</h3>
          <p className="text-muted-foreground">
            Your transaction history will appear here once you start trading
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardContent className="p-0">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-muted/50">
              <tr>
                <th className="px-6 py-4 text-left text-sm font-medium text-muted-foreground">Transaction</th>
                <th className="px-6 py-4 text-left text-sm font-medium text-muted-foreground">Type</th>
                <th className="px-6 py-4 text-left text-sm font-medium text-muted-foreground">Status</th>
                <th className="px-6 py-4 text-left text-sm font-medium text-muted-foreground">Amount</th>
                <th className="px-6 py-4 text-left text-sm font-medium text-muted-foreground">Fees</th>
                <th className="px-6 py-4 text-left text-sm font-medium text-muted-foreground">Date</th>
                <th className="px-6 py-4 text-left text-sm font-medium text-muted-foreground">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {transactions.map((transaction) => (
                <tr key={transaction.id} className="hover:bg-muted/50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      {getTransactionIcon(transaction.type, transaction.status)}
                      <div>
                        <p className="font-medium">
                          {transaction.coins?.name || transaction.description}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          {transaction.transaction_hash ? 
                            `Hash: ${transaction.transaction_hash.slice(0, 10)}...` : 
                            'System'
                          }
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <Badge variant={getTypeVariant(transaction.type)}>
                      {transaction.type.charAt(0).toUpperCase() + transaction.type.slice(1)}
                    </Badge>
                  </td>
                  <td className="px-6 py-4">
                    <Badge variant={getStatusVariant(transaction.status)}>
                      {transaction.status.charAt(0).toUpperCase() + transaction.status.slice(1)}
                    </Badge>
                  </td>
                  <td className="px-6 py-4">
                    <p className="font-medium">
                      ${Number(transaction.amount).toLocaleString()}
                    </p>
                    <p className="text-sm text-muted-foreground">{transaction.currency}</p>
                  </td>
                  <td className="px-6 py-4">
                    <p className="text-muted-foreground">
                      ${Number(transaction.fees || 0).toFixed(2)}
                    </p>
                  </td>
                  <td className="px-6 py-4">
                    <p className="font-medium">
                      {new Date(transaction.created_at).toLocaleDateString()}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {new Date(transaction.created_at).toLocaleTimeString()}
                    </p>
                  </td>
                  <td className="px-6 py-4">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => {
                        if (transaction.transaction_hash) {
                          window.open(`https://etherscan.io/tx/${transaction.transaction_hash}`, '_blank');
                        } else {
                          toast.info('Transaction details not available');
                        }
                      }}
                    >
                      <Eye className="w-4 h-4 mr-2" />
                      View
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  );
};
