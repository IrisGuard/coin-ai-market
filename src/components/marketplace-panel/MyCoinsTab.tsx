
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Coins, Eye, Heart, DollarSign } from 'lucide-react';
import { useUserOwnCoins } from '@/hooks/useUserOwnCoins';

const MyCoinsTab = () => {
  const { data: coins, isLoading, error } = useUserOwnCoins();

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

  if (!coins || coins.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Coins className="w-5 h-5" />
            My Coins
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <Coins className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No Coins Found</h3>
            <p className="text-gray-600 mb-4">You haven't uploaded any coins yet.</p>
            <Button>Upload First Coin</Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Coins className="w-5 h-5 text-electric-blue" />
              <div>
                <p className="text-sm text-gray-600">Total Coins</p>
                <p className="text-2xl font-bold">{coins.length}</p>
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
                <p className="text-2xl font-bold">
                  ${coins.reduce((sum, coin) => sum + (coin.price || 0), 0).toLocaleString()}
                </p>
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
                <p className="text-2xl font-bold">
                  {coins.reduce((sum, coin) => sum + (coin.views || 0), 0)}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Coins className="w-5 h-5" />
            My Coins ({coins.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {coins.map((coin) => (
              <Card key={coin.id} className="overflow-hidden">
                <div className="aspect-square bg-gray-100 flex items-center justify-center">
                  {coin.image ? (
                    <img 
                      src={coin.image} 
                      alt={coin.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <Coins className="w-12 h-12 text-gray-400" />
                  )}
                </div>
                <CardContent className="p-4">
                  <h3 className="font-medium mb-2">{coin.name}</h3>
                  <div className="space-y-1 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Year:</span>
                      <span>{coin.year}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Price:</span>
                      <span className="font-medium">${coin.price}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Condition:</span>
                      <Badge variant="outline" className="text-xs">{coin.condition}</Badge>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Rarity:</span>
                      <Badge variant="outline" className="text-xs">{coin.rarity}</Badge>
                    </div>
                  </div>
                  <div className="flex items-center justify-between mt-3 pt-3 border-t">
                    <div className="flex items-center gap-3 text-xs text-gray-500">
                      <span className="flex items-center gap-1">
                        <Eye className="w-3 h-3" />
                        {coin.views || 0}
                      </span>
                      <span className="flex items-center gap-1">
                        <Heart className="w-3 h-3" />
                        {coin.favorites || 0}
                      </span>
                    </div>
                    <Button variant="outline" size="sm">View</Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default MyCoinsTab;
