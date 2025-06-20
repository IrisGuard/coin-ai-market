
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Store, Upload, TrendingUp, Eye, Activity, Coins } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import StoreManagerRefactored from './store/StoreManagerRefactored';
import CategoryNavigationFromDatabase from '@/components/marketplace/CategoryNavigationFromDatabase';

const OriginalDealerPanel = () => {
  const { user } = useAuth();
  const [selectedStoreId, setSelectedStoreId] = useState('');
  const [activeTab, setActiveTab] = useState('overview');

  // Fetch user's stores
  const { data: userStores = [], isLoading: storesLoading } = useQuery({
    queryKey: ['user-stores', user?.id],
    queryFn: async () => {
      if (!user?.id) return [];
      
      const { data, error } = await supabase
        .from('stores')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      console.log(`✅ User has ${data?.length || 0} stores:`, data);
      return data || [];
    },
    enabled: !!user?.id,
  });

  // Fetch user's coins
  const { data: userCoins = [], isLoading: coinsLoading } = useQuery({
    queryKey: ['user-coins', user?.id],
    queryFn: async () => {
      if (!user?.id) return [];
      
      console.log('Fetching coins for user:', user.id);
      
      const { data, error } = await supabase
        .from('coins')
        .select(`
          *,
          profiles!coins_user_id_fkey(
            id,
            name,
            full_name,
            username
          )
        `)
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching user coins:', error);
        throw error;
      }

      console.log(`✅ User has ${data?.length || 0} coins:`, data);
      return data || [];
    },
    enabled: !!user?.id,
  });

  // Get coin statistics
  const coinStats = React.useMemo(() => {
    const total = userCoins.length;
    const featured = userCoins.filter(coin => coin.featured).length;
    const sold = userCoins.filter(coin => coin.sold).length;
    const auctions = userCoins.filter(coin => coin.is_auction).length;
    const totalValue = userCoins.reduce((sum, coin) => sum + (coin.price || 0), 0);
    
    return { total, featured, sold, auctions, totalValue };
  }, [userCoins]);

  const handleStoreSelect = (storeId: string) => {
    setSelectedStoreId(storeId);
    console.log('Selected store:', storeId);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-50 to-purple-50 p-6 rounded-lg border border-blue-200">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-blue-800 mb-2">
              🏪 DEALER PANEL - LIVE PRODUCTION
            </h2>
            <p className="text-blue-600">
              Complete store and coin management • Real-time Supabase data • 30 Categories Available
            </p>
          </div>
          <div className="space-y-2">
            <div className="flex gap-2">
              <Badge className="bg-green-600 text-white">
                {userStores.length} Stores
              </Badge>
              <Badge className="bg-blue-600 text-white">
                {userCoins.length} Coins
              </Badge>
              <Badge className="bg-purple-600 text-white">
                LIVE DATA
              </Badge>
            </div>
          </div>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="overview" className="flex items-center gap-2">
            <TrendingUp className="w-4 h-4" />
            Overview
          </TabsTrigger>
          <TabsTrigger value="stores" className="flex items-center gap-2">
            <Store className="w-4 h-4" />
            My Stores
          </TabsTrigger>
          <TabsTrigger value="coins" className="flex items-center gap-2">
            <Coins className="w-4 h-4" />
            My Coins
          </TabsTrigger>
          <TabsTrigger value="categories" className="flex items-center gap-2">
            <Eye className="w-4 h-4" />
            30 Categories
          </TabsTrigger>
          <TabsTrigger value="upload" className="flex items-center gap-2">
            <Upload className="w-4 h-4" />
            Upload Coin
          </TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          {/* Quick Stats */}
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            <Card>
              <CardContent className="p-4 text-center">
                <div className="text-2xl font-bold text-blue-600">{userStores.length}</div>
                <p className="text-sm text-gray-600">My Stores</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4 text-center">
                <div className="text-2xl font-bold text-green-600">{coinStats.total}</div>
                <p className="text-sm text-gray-600">Total Coins</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4 text-center">
                <div className="text-2xl font-bold text-purple-600">{coinStats.featured}</div>
                <p className="text-sm text-gray-600">Featured</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4 text-center">
                <div className="text-2xl font-bold text-orange-600">{coinStats.sold}</div>
                <p className="text-sm text-gray-600">Sold</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4 text-center">
                <div className="text-2xl font-bold text-red-600">€{coinStats.totalValue.toFixed(2)}</div>
                <p className="text-sm text-gray-600">Total Value</p>
              </CardContent>
            </Card>
          </div>

          {/* Recent Activity */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Activity className="w-5 h-5" />
                Recent Activity
              </CardTitle>
            </CardHeader>
            <CardContent>
              {userCoins.length === 0 ? (
                <div className="text-center py-8">
                  <Coins className="w-12 h-12 mx-auto text-gray-400 mb-4" />
                  <p className="text-gray-600">No coins uploaded yet</p>
                  <Button className="mt-4" onClick={() => setActiveTab('upload')}>
                    Upload Your First Coin
                  </Button>
                </div>
              ) : (
                <div className="space-y-3">
                  {userCoins.slice(0, 5).map((coin) => (
                    <div key={coin.id} className="flex items-center gap-3 p-3 border rounded">
                      <img 
                        src={coin.image} 
                        alt={coin.name}
                        className="w-12 h-12 rounded object-cover"
                      />
                      <div className="flex-1">
                        <h4 className="font-medium">{coin.name}</h4>
                        <p className="text-sm text-gray-600">{coin.year} • {coin.grade}</p>
                      </div>
                      <div className="text-right">
                        <div className="font-bold">€{coin.price}</div>
                        <div className="text-sm text-gray-500">
                          {new Date(coin.created_at).toLocaleDateString()}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="stores">
          <StoreManagerRefactored
            onStoreSelect={handleStoreSelect}
            selectedStoreId={selectedStoreId}
          />
        </TabsContent>

        <TabsContent value="coins">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Coins className="w-5 h-5" />
                My Coins ({userCoins.length})
              </CardTitle>
            </CardHeader>
            <CardContent>
              {coinsLoading ? (
                <div className="text-center py-8">
                  <div className="animate-spin h-8 w-8 border-4 border-blue-600 border-t-transparent rounded-full mx-auto mb-4"></div>
                  <p>Loading your coins...</p>
                </div>
              ) : userCoins.length === 0 ? (
                <div className="text-center py-8">
                  <Coins className="w-16 h-16 mx-auto text-gray-400 mb-4" />
                  <h3 className="text-lg font-semibold text-gray-700 mb-2">No coins yet</h3>
                  <p className="text-gray-500 mb-4">Start building your collection!</p>
                  <Button onClick={() => setActiveTab('upload')}>
                    Upload Your First Coin
                  </Button>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {userCoins.map((coin) => (
                    <Card key={coin.id} className="hover:shadow-lg transition-shadow">
                      <CardContent className="p-4">
                        <img 
                          src={coin.image} 
                          alt={coin.name}
                          className="w-full h-32 object-cover rounded mb-3"
                        />
                        <h3 className="font-semibold mb-1">{coin.name}</h3>
                        <p className="text-sm text-gray-600 mb-2">{coin.year} • {coin.grade}</p>
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-lg">€{coin.price}</span>
                          <div className="flex gap-1">
                            {coin.featured && (
                              <Badge className="bg-yellow-100 text-yellow-800">Featured</Badge>
                            )}
                            {coin.sold && (
                              <Badge className="bg-green-100 text-green-800">Sold</Badge>
                            )}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="categories">
          <Card>
            <CardHeader>
              <CardTitle>30 Coin Categories - Live from Supabase</CardTitle>
            </CardHeader>
            <CardContent>
              <CategoryNavigationFromDatabase />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="upload">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Upload className="w-5 h-5" />
                Upload New Coin
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8">
                <Upload className="w-16 h-16 mx-auto text-gray-400 mb-4" />
                <h3 className="text-lg font-semibold text-gray-700 mb-2">Coin Upload Coming Soon</h3>
                <p className="text-gray-500 mb-4">Advanced AI-powered coin analysis and automatic form filling</p>
                <Button disabled>
                  Upload Coin (Coming Soon)
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default OriginalDealerPanel;
