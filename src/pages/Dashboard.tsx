
import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import ShippingOptionsManager from '@/components/dashboard/ShippingOptionsManager';
import { Plus, Store, Coins, TrendingUp, Star } from 'lucide-react';
import { Link } from 'react-router-dom';

const Dashboard = () => {
  const { user } = useAuth();

  // Fetch user's coins
  const { data: userCoins = [] } = useQuery({
    queryKey: ['user-coins', user?.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('coins')
        .select('*')
        .eq('user_id', user?.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data;
    },
    enabled: !!user?.id,
  });

  // Fetch user's store
  const { data: userStore } = useQuery({
    queryKey: ['user-store', user?.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('stores')
        .select('*')
        .eq('user_id', user?.id)
        .single();

      if (error && error.code !== 'PGRST116') throw error;
      return data;
    },
    enabled: !!user?.id,
  });

  // Fetch user stats
  const stats = {
    totalCoins: userCoins.length,
    activeAuctions: userCoins.filter(coin => coin.is_auction && coin.auction_end && new Date(coin.auction_end) > new Date()).length,
    totalSales: userCoins.filter(coin => coin.sold).length,
    totalRevenue: userCoins.filter(coin => coin.sold).reduce((sum, coin) => sum + coin.price, 0)
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <div className="pt-20 pb-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-4">Dashboard</h1>
            <p className="text-gray-600">Manage your coins, store, and sales</p>
          </div>

          {/* Stats Overview */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center gap-3">
                  <Coins className="w-8 h-8 text-blue-500" />
                  <div>
                    <p className="text-2xl font-bold">{stats.totalCoins}</p>
                    <p className="text-gray-600 text-sm">Total Coins</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center gap-3">
                  <TrendingUp className="w-8 h-8 text-green-500" />
                  <div>
                    <p className="text-2xl font-bold">{stats.activeAuctions}</p>
                    <p className="text-gray-600 text-sm">Active Auctions</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center gap-3">
                  <Star className="w-8 h-8 text-yellow-500" />
                  <div>
                    <p className="text-2xl font-bold">{stats.totalSales}</p>
                    <p className="text-gray-600 text-sm">Total Sales</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center gap-3">
                  <Store className="w-8 h-8 text-purple-500" />
                  <div>
                    <p className="text-2xl font-bold">${stats.totalRevenue}</p>
                    <p className="text-gray-600 text-sm">Total Revenue</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Main Content */}
          <Tabs defaultValue="coins" className="space-y-6">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="coins">My Coins</TabsTrigger>
              <TabsTrigger value="store">Store Settings</TabsTrigger>
              <TabsTrigger value="shipping">Shipping</TabsTrigger>
              <TabsTrigger value="analytics">Analytics</TabsTrigger>
            </TabsList>

            {/* My Coins Tab */}
            <TabsContent value="coins">
              <Card>
                <CardHeader>
                  <div className="flex justify-between items-center">
                    <CardTitle>My Coin Collection</CardTitle>
                    <Link to="/upload">
                      <Button>
                        <Plus className="w-4 h-4 mr-2" />
                        Add Coin
                      </Button>
                    </Link>
                  </div>
                </CardHeader>
                <CardContent>
                  {userCoins.length === 0 ? (
                    <div className="text-center py-8">
                      <Coins className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                      <h3 className="text-lg font-medium text-gray-900 mb-2">No coins yet</h3>
                      <p className="text-gray-600 mb-4">Start building your collection by adding your first coin</p>
                      <Link to="/upload">
                        <Button>Add Your First Coin</Button>
                      </Link>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {userCoins.map((coin) => (
                        <div key={coin.id} className="border rounded-lg p-4">
                          <img 
                            src={coin.image} 
                            alt={coin.name}
                            className="w-full h-32 object-cover rounded mb-3"
                          />
                          <h4 className="font-medium mb-1">{coin.name}</h4>
                          <p className="text-sm text-gray-600 mb-2">{coin.year} • {coin.category}</p>
                          <div className="flex justify-between items-center">
                            <span className="font-bold text-green-600">${coin.price}</span>
                            <span className={`text-xs px-2 py-1 rounded ${
                              coin.authentication_status === 'verified' 
                                ? 'bg-green-100 text-green-700'
                                : coin.authentication_status === 'pending'
                                ? 'bg-yellow-100 text-yellow-700'
                                : 'bg-red-100 text-red-700'
                            }`}>
                              {coin.authentication_status}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            {/* Store Settings Tab */}
            <TabsContent value="store">
              <Card>
                <CardHeader>
                  <CardTitle>Store Information</CardTitle>
                </CardHeader>
                <CardContent>
                  {userStore ? (
                    <div className="space-y-4">
                      <div>
                        <h3 className="font-medium mb-2">Store Name</h3>
                        <p className="text-gray-600">{userStore.name}</p>
                      </div>
                      <div>
                        <h3 className="font-medium mb-2">Description</h3>
                        <p className="text-gray-600">{userStore.description || 'No description provided'}</p>
                      </div>
                      <div>
                        <h3 className="font-medium mb-2">Status</h3>
                        <span className={`px-3 py-1 rounded-full text-sm ${
                          userStore.verified 
                            ? 'bg-green-100 text-green-700'
                            : 'bg-yellow-100 text-yellow-700'
                        }`}>
                          {userStore.verified ? 'Verified' : 'Pending Verification'}
                        </span>
                      </div>
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <Store className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                      <h3 className="text-lg font-medium text-gray-900 mb-2">No store created</h3>
                      <p className="text-gray-600 mb-4">Create a store to start selling your coins</p>
                      <Button>Create Store</Button>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            {/* Shipping Tab */}
            <TabsContent value="shipping">
              {userStore ? (
                <ShippingOptionsManager 
                  storeId={userStore.id}
                  currentOptions={userStore.shipping_options || []}
                />
              ) : (
                <Card>
                  <CardContent className="text-center py-8">
                    <h3 className="text-lg font-medium text-gray-900 mb-2">Store Required</h3>
                    <p className="text-gray-600 mb-4">You need to create a store first to configure shipping options</p>
                    <Button>Create Store</Button>
                  </CardContent>
                </Card>
              )}
            </TabsContent>

            {/* Analytics Tab */}
            <TabsContent value="analytics">
              <Card>
                <CardHeader>
                  <CardTitle>Sales Analytics</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <h3 className="font-medium mb-4">Performance Overview</h3>
                      <div className="space-y-3">
                        <div className="flex justify-between">
                          <span>Total Views:</span>
                          <span className="font-medium">
                            {userCoins.reduce((sum, coin) => sum + (coin.views || 0), 0)}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span>Average Price:</span>
                          <span className="font-medium">
                            ${userCoins.length > 0 ? (userCoins.reduce((sum, coin) => sum + coin.price, 0) / userCoins.length).toFixed(2) : '0.00'}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span>Conversion Rate:</span>
                          <span className="font-medium">
                            {userCoins.length > 0 ? ((stats.totalSales / userCoins.length) * 100).toFixed(1) : '0.0'}%
                          </span>
                        </div>
                      </div>
                    </div>
                    <div>
                      <h3 className="font-medium mb-4">Category Distribution</h3>
                      <div className="space-y-2">
                        {Object.entries(
                          userCoins.reduce((acc, coin) => {
                            acc[coin.category || 'unclassified'] = (acc[coin.category || 'unclassified'] || 0) + 1;
                            return acc;
                          }, {} as Record<string, number>)
                        ).map(([category, count]) => (
                          <div key={category} className="flex justify-between">
                            <span className="capitalize">{category.replace('_', ' ')}:</span>
                            <span className="font-medium">{count}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default Dashboard;
