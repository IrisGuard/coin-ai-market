
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Coins, CheckCircle, XCircle, Clock } from 'lucide-react';
import { useAdminCoins, useUpdateCoinStatus } from '@/hooks/useAdminData';

const AdminCoinsTab = () => {
  const { data: coins = [], isLoading } = useAdminCoins();
  const updateCoinStatus = useUpdateCoinStatus();

  const handleUpdateStatus = (coinId: string, status: string) => {
    updateCoinStatus.mutate({ coinId, status });
  };

  if (isLoading) {
    return <div className="p-4">Loading coins...</div>;
  }

  const stats = {
    total: coins.length,
    verified: coins.filter(c => c.authentication_status === 'verified').length,
    pending: coins.filter(c => c.authentication_status === 'pending').length,
    rejected: coins.filter(c => c.authentication_status === 'rejected').length,
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'verified':
        return <Badge className="bg-green-100 text-green-800">Verified</Badge>;
      case 'rejected':
        return <Badge className="bg-red-100 text-red-800">Rejected</Badge>;
      default:
        return <Badge className="bg-yellow-100 text-yellow-800">Pending</Badge>;
    }
  };

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Coins</CardTitle>
            <Coins className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.total}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Verified</CardTitle>
            <CheckCircle className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{stats.verified}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending</CardTitle>
            <Clock className="h-4 w-4 text-orange-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">{stats.pending}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Rejected</CardTitle>
            <XCircle className="h-4 w-4 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{stats.rejected}</div>
          </CardContent>
        </Card>
      </div>

      {/* Coins Table */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Coins className="h-5 w-5" />
            Coin Authentication
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Coin</TableHead>
                <TableHead>Owner</TableHead>
                <TableHead>Year</TableHead>
                <TableHead>Price</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Submitted</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {coins.map((coin) => (
                <TableRow key={coin.id}>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <img 
                        src={coin.image} 
                        alt={coin.name}
                        className="h-10 w-10 rounded-full object-cover"
                      />
                      <div>
                        <div className="font-medium">{coin.name}</div>
                        <div className="text-sm text-gray-500">{coin.grade}</div>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div>
                      <div className="font-medium">{coin.profiles?.name || 'Unknown'}</div>
                      <div className="text-sm text-gray-500">{coin.profiles?.email}</div>
                    </div>
                  </TableCell>
                  <TableCell>{coin.year}</TableCell>
                  <TableCell>${coin.price}</TableCell>
                  <TableCell>{getStatusBadge(coin.authentication_status || 'pending')}</TableCell>
                  <TableCell>
                    {coin.created_at ? new Date(coin.created_at).toLocaleDateString() : 'N/A'}
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      {coin.authentication_status !== 'verified' && (
                        <Button
                          size="sm"
                          onClick={() => handleUpdateStatus(coin.id, 'verified')}
                          disabled={updateCoinStatus.isPending}
                        >
                          Verify
                        </Button>
                      )}
                      {coin.authentication_status !== 'rejected' && (
                        <Button
                          size="sm"
                          variant="destructive"
                          onClick={() => handleUpdateStatus(coin.id, 'rejected')}
                          disabled={updateCoinStatus.isPending}
                        >
                          Reject
                        </Button>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminCoinsTab;
