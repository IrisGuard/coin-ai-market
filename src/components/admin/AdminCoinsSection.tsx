
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useAdminCoins, useUpdateCoinStatus } from '@/hooks/useAdminData';
import { Coins, CheckCircle, XCircle, Eye } from 'lucide-react';

const AdminCoinsSection = () => {
  const { data: coins = [], isLoading } = useAdminCoins();
  const updateCoinStatus = useUpdateCoinStatus();

  const handleUpdateStatus = (coinId: string, status: string) => {
    updateCoinStatus.mutate({ coinId, status });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'verified': return 'bg-green-100 text-green-800';
      case 'rejected': return 'bg-red-100 text-red-800';
      default: return 'bg-yellow-100 text-yellow-800';
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
        <CardDescription>Manage coin listings and authentication status</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {coins.slice(0, 10).map((coin) => (
            <div key={coin.id} className="flex items-center justify-between p-4 border rounded-lg">
              <div className="flex items-center gap-4">
                <img 
                  src={coin.image} 
                  alt={coin.name}
                  className="w-12 h-12 rounded-lg object-cover"
                />
                <div>
                  <h4 className="font-medium">{coin.name}</h4>
                  <p className="text-sm text-gray-600">
                    {coin.year} • {coin.country} • €{coin.price}
                  </p>
                  <p className="text-xs text-gray-500">
                    Owner: {coin.profiles?.name || 'Unknown'}
                  </p>
                </div>
              </div>
              
              <div className="flex items-center gap-3">
                <Badge className={getStatusColor(coin.authentication_status || 'pending')}>
                  {coin.authentication_status || 'pending'}
                </Badge>
                
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleUpdateStatus(coin.id, 'verified')}
                    disabled={updateCoinStatus.isPending}
                  >
                    <CheckCircle className="w-4 h-4" />
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleUpdateStatus(coin.id, 'rejected')}
                    disabled={updateCoinStatus.isPending}
                  >
                    <XCircle className="w-4 h-4" />
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => window.open(`/coin/${coin.id}`, '_blank')}
                  >
                    <Eye className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </div>
          ))}
          
          {coins.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              No coins found
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default AdminCoinsSection;
