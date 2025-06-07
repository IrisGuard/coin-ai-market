
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useAdminCoins, useUpdateCoinStatus } from '@/hooks/useAdminData';
import { Coins, CheckCircle, XCircle, Clock } from 'lucide-react';

const AdminCoinsSection = () => {
  const { data: coins = [], isLoading } = useAdminCoins();
  const updateCoinStatus = useUpdateCoinStatus();

  const handleUpdateStatus = (coinId: string, status: string) => {
    updateCoinStatus.mutate({ coinId, status });
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'verified':
        return <Badge className="bg-green-100 text-green-800">Verified</Badge>;
      case 'rejected':
        return <Badge variant="destructive">Rejected</Badge>;
      default:
        return <Badge variant="secondary">Pending</Badge>;
    }
  };

  if (isLoading) {
    return (
      <Card>
        <CardContent className="text-center py-12">
          <div className="animate-spin h-8 w-8 border-b-2 border-purple-600 mx-auto mb-4"></div>
          <p>Loading coins...</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Coins className="h-5 w-5" />
          Coin Management
        </CardTitle>
        <CardDescription>Review and manage coin listings</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {coins.map((coin) => (
            <div key={coin.id} className="flex items-center justify-between p-4 border rounded-lg">
              <div className="flex items-center space-x-4">
                {coin.image && (
                  <img 
                    src={coin.image} 
                    alt={coin.name} 
                    className="w-16 h-16 object-cover rounded-lg"
                  />
                )}
                <div>
                  <h3 className="font-semibold">{coin.name}</h3>
                  <p className="text-sm text-gray-600">
                    Owner: {coin.profiles?.name || 'Unknown'}
                  </p>
                  <p className="text-sm text-gray-500">
                    Price: ${coin.price}
                  </p>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                {getStatusBadge(coin.authentication_status)}
                {coin.authentication_status === 'pending' && (
                  <div className="flex space-x-1">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleUpdateStatus(coin.id, 'verified')}
                      disabled={updateCoinStatus.isPending}
                    >
                      <CheckCircle className="h-4 w-4 mr-1" />
                      Verify
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleUpdateStatus(coin.id, 'rejected')}
                      disabled={updateCoinStatus.isPending}
                    >
                      <XCircle className="h-4 w-4 mr-1" />
                      Reject
                    </Button>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default AdminCoinsSection;
