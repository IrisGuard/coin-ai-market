
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Coins, Eye, DollarSign, Users } from 'lucide-react';
import { useAdminCoins } from '@/hooks/useAdminCoins';

const AdminCoinsManagement = () => {
  const { data: coins, isLoading, error } = useAdminCoins();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin h-8 w-8 border-b-2 border-electric-blue"></div>
      </div>
    );
  }

  if (error) {
    return (
      <Card>
        <CardContent className="p-8 text-center">
          <p className="text-red-600">Error loading coins: {error.message}</p>
        </CardContent>
      </Card>
    );
  }

  const totalCoins = coins?.length || 0;
  const totalValue = coins?.reduce((sum, coin) => sum + (coin.price || 0), 0) || 0;
  const verifiedCoins = coins?.filter(coin => coin.authentication_status === 'verified')?.length || 0;
  const totalViews = coins?.reduce((sum, coin) => sum + (coin.views || 0), 0) || 0;

  return (
    <div className="space-y-6">
      {/* Coins Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Coins className="w-5 h-5 text-electric-blue" />
              <div>
                <p className="text-sm text-gray-600">Total Coins</p>
                <p className="text-2xl font-bold">{totalCoins}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <DollarSign className="w-5 h-5 text-electric-green" />
              <div>
                <p className="text-sm text-gray-600">Total Value</p>
                <p className="text-2xl font-bold">${totalValue.toLocaleString()}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Eye className="w-5 h-5 text-electric-purple" />
              <div>
                <p className="text-sm text-gray-600">Total Views</p>
                <p className="text-2xl font-bold">{totalViews.toLocaleString()}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Users className="w-5 h-5 text-electric-orange" />
              <div>
                <p className="text-sm text-gray-600">Verified</p>
                <p className="text-2xl font-bold">{verifiedCoins}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Coins Table */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Coins className="w-5 h-5" />
            All Coins ({totalCoins})
          </CardTitle>
        </CardHeader>
        <CardContent>
          {totalCoins === 0 ? (
            <div className="text-center py-8">
              <Coins className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No Coins Found</h3>
              <p className="text-gray-600">No coins have been uploaded to the system yet.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left p-2">Coin</th>
                    <th className="text-left p-2">Owner</th>
                    <th className="text-left p-2">Price</th>
                    <th className="text-left p-2">Views</th>
                    <th className="text-left p-2">Status</th>
                    <th className="text-left p-2">Created</th>
                    <th className="text-left p-2">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {coins.map((coin) => (
                    <tr key={coin.id} className="border-b hover:bg-gray-50">
                      <td className="p-2">
                        <div className="flex items-center gap-3">
                          <div className="w-12 h-12 bg-gray-200 rounded flex items-center justify-center">
                            {coin.image ? (
                              <img src={coin.image} alt={coin.name} className="w-full h-full object-cover rounded" />
                            ) : (
                              <Coins className="w-6 h-6 text-gray-400" />
                            )}
                          </div>
                          <div>
                            <p className="font-medium">{coin.name}</p>
                            <p className="text-sm text-gray-600">{coin.year} • {coin.country}</p>
                          </div>
                        </div>
                      </td>
                      <td className="p-2">
                        <div>
                          <p className="font-medium">{coin.profiles?.name || 'Unknown'}</p>
                          <p className="text-sm text-gray-600">{coin.profiles?.email || 'No email'}</p>
                        </div>
                      </td>
                      <td className="p-2 font-medium">${coin.price}</td>
                      <td className="p-2">{coin.views || 0}</td>
                      <td className="p-2">
                        <Badge variant={
                          coin.authentication_status === 'verified' ? 'default' :
                          coin.authentication_status === 'pending' ? 'secondary' : 'destructive'
                        }>
                          {coin.authentication_status || 'pending'}
                        </Badge>
                      </td>
                      <td className="p-2 text-sm text-gray-600">
                        {new Date(coin.created_at).toLocaleDateString()}
                      </td>
                      <td className="p-2">
                        <div className="flex gap-2">
                          <Button variant="outline" size="sm">View</Button>
                          <Button variant="outline" size="sm">Edit</Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminCoinsManagement;
