import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useAdminCoins, useUpdateCoinStatus } from '@/hooks/admin/useAdminCoins';

interface Coin {
  id: string;
  name: string;
  year: number;
  grade: string;
  price: number;
  image: string;
  authentication_status: string;
  profiles?: {
    id: string;
    name: string;
    email: string;
  };
}

const AdminCoinsTab = () => {
  const { data: coins = [], isLoading } = useAdminCoins();
  const updateCoinStatus = useUpdateCoinStatus();

  const handleStatusUpdate = (coinId: string, status: string) => {
    updateCoinStatus.mutate({ coinId, status });
  };

  if (isLoading) return <div>Loading coins...</div>;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h3 className="text-lg font-semibold">Coin Management</h3>
        <p className="text-sm text-muted-foreground">
          Manage listed coins and their authentication status
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Coin Management</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="border-b">
                  <th className="text-left p-2">Image</th>
                  <th className="text-left p-2">Name</th>
                  <th className="text-left p-2">Year</th>
                  <th className="text-left p-2">Grade</th>
                  <th className="text-left p-2">Price</th>
                  <th className="text-left p-2">Owner</th>
                  <th className="text-left p-2">Status</th>
                  <th className="text-left p-2">Actions</th>
                </tr>
              </thead>
              <tbody>
                {coins.map((coin) => (
                  <tr key={coin.id} className="border-b">
                    <td className="p-2">
                      <img 
                        src={coin.image} 
                        alt={coin.name}
                        className="w-12 h-12 object-cover rounded"
                      />
                    </td>
                    <td className="p-2 font-medium">{coin.name}</td>
                    <td className="p-2">{coin.year}</td>
                    <td className="p-2">{coin.grade}</td>
                    <td className="p-2">${coin.price}</td>
                    <td className="p-2">
                      <div>
                        <div className="font-medium">{coin.profiles?.name || 'Unknown'}</div>
                        <div className="text-sm text-muted-foreground">{coin.profiles?.email || 'No email'}</div>
                      </div>
                    </td>
                    <td className="p-2">
                      <Badge variant={
                        coin.authentication_status === 'verified' ? 'default' :
                        coin.authentication_status === 'rejected' ? 'destructive' : 'secondary'
                      }>
                        {coin.authentication_status}
                      </Badge>
                    </td>
                    <td className="p-2">
                      <Select
                        value={coin.authentication_status || 'pending'}
                        onValueChange={(value) => handleStatusUpdate(coin.id, value)}
                      >
                        <SelectTrigger className="w-32">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="pending">Pending</SelectItem>
                          <SelectItem value="verified">Verified</SelectItem>
                          <SelectItem value="rejected">Rejected</SelectItem>
                        </SelectContent>
                      </Select>
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

export default AdminCoinsTab;
