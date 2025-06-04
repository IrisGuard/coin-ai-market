
import React from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { useAdminCoins, useUpdateCoinStatus } from '@/hooks/useAdminData';

const AdminCoinsTab = () => {
  const { data: coins = [], isLoading } = useAdminCoins();
  const updateStatus = useUpdateCoinStatus();

  const handleStatusUpdate = (coinId: string, status: string) => {
    updateStatus.mutate({ coinId, status });
  };

  if (isLoading) {
    return <div>Loading coins...</div>;
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold">Coin Management</h3>
        <div className="text-sm text-muted-foreground">
          Total: {coins.length} coins
        </div>
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Image</TableHead>
            <TableHead>Name</TableHead>
            <TableHead>Year</TableHead>
            <TableHead>Grade</TableHead>
            <TableHead>Price</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Owner</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {coins.map((coin) => (
            <TableRow key={coin.id}>
              <TableCell>
                <img 
                  src={coin.image} 
                  alt={coin.name}
                  className="w-12 h-12 object-cover rounded"
                />
              </TableCell>
              <TableCell className="font-medium">{coin.name}</TableCell>
              <TableCell>{coin.year}</TableCell>
              <TableCell>{coin.grade}</TableCell>
              <TableCell>${coin.price}</TableCell>
              <TableCell>
                <Badge 
                  variant={
                    coin.authentication_status === 'approved' ? 'default' :
                    coin.authentication_status === 'rejected' ? 'destructive' : 'secondary'
                  }
                >
                  {coin.authentication_status}
                </Badge>
              </TableCell>
              <TableCell>
                <div>
                  <div className="font-medium">
                    {coin.profiles && typeof coin.profiles === 'object' && 'name' in coin.profiles 
                      ? coin.profiles.name 
                      : 'Unknown User'}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    {coin.profiles && typeof coin.profiles === 'object' && 'email' in coin.profiles 
                      ? coin.profiles.email 
                      : 'No email'}
                  </div>
                </div>
              </TableCell>
              <TableCell>
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleStatusUpdate(coin.id, 'approved')}
                    disabled={updateStatus.isPending}
                  >
                    Approve
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleStatusUpdate(coin.id, 'rejected')}
                    disabled={updateStatus.isPending}
                  >
                    Reject
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default AdminCoinsTab;
