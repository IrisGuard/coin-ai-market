
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { useTransactions } from '@/hooks/useAdminData';
import { DollarSign } from 'lucide-react';

const AdminTransactionsTab = () => {
  const { data: transactions = [], isLoading } = useTransactions();

  if (isLoading) {
    return <div>Loading transactions...</div>;
  }

  const totalVolume = transactions.reduce((sum, tx) => sum + Number(tx.amount), 0);

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold flex items-center gap-2">
          <DollarSign className="h-5 w-5" />
          Transactions
        </h3>
        <div className="text-sm text-muted-foreground">
          Total Volume: ${totalVolume.toFixed(2)}
        </div>
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Amount</TableHead>
            <TableHead>Type</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Seller</TableHead>
            <TableHead>Buyer</TableHead>
            <TableHead>Coin</TableHead>
            <TableHead>Date</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {transactions.map((transaction) => (
            <TableRow key={transaction.id}>
              <TableCell className="font-medium">
                ${Number(transaction.amount).toFixed(2)}
              </TableCell>
              <TableCell>
                <Badge variant="outline">{transaction.transaction_type}</Badge>
              </TableCell>
              <TableCell>
                <Badge variant={transaction.status === 'completed' ? 'default' : 'secondary'}>
                  {transaction.status}
                </Badge>
              </TableCell>
              <TableCell>
                <div>
                  <div className="font-medium">
                    {transaction.seller && typeof transaction.seller === 'object' && 'name' in transaction.seller 
                      ? transaction.seller.name 
                      : 'Unknown Seller'}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    {transaction.seller && typeof transaction.seller === 'object' && 'email' in transaction.seller 
                      ? transaction.seller.email 
                      : 'No email'}
                  </div>
                </div>
              </TableCell>
              <TableCell>
                <div>
                  <div className="font-medium">
                    {transaction.buyer && typeof transaction.buyer === 'object' && 'name' in transaction.buyer 
                      ? transaction.buyer.name 
                      : 'Unknown Buyer'}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    {transaction.buyer && typeof transaction.buyer === 'object' && 'email' in transaction.buyer 
                      ? transaction.buyer.email 
                      : 'No email'}
                  </div>
                </div>
              </TableCell>
              <TableCell>
                {transaction.coins ? 
                  <div className="flex items-center gap-2">
                    {transaction.coins.image && (
                      <img 
                        src={transaction.coins.image} 
                        alt={transaction.coins.name}
                        className="w-8 h-8 object-cover rounded"
                      />
                    )}
                    <span className="text-sm">{transaction.coins.name}</span>
                  </div>
                  : 'Unknown Coin'
                }
              </TableCell>
              <TableCell>
                {new Date(transaction.created_at).toLocaleDateString()}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default AdminTransactionsTab;
