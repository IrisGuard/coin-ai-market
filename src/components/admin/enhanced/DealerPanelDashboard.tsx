
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Store, Package, TrendingUp, DollarSign, 
  Users, Star, BarChart3, Upload
} from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, BarChart, Bar } from 'recharts';

const DealerPanelDashboard = () => {
  const { data: dealerStats, isLoading } = useQuery({
    queryKey: ['dealer-stats'],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return null;

      const [storeResult, coinsResult, salesResult] = await Promise.all([
        supabase.from('stores').select('*').eq('user_id', user.id).single(),
        supabase.from('coins').select('*', { count: 'exact' }).eq('user_id', user.id),
        supabase.from('coins').select('*').eq('user_id', user.id).eq('sold', true)
      ]);

      const totalCoins = coinsResult.count || 0;
      const totalSales = salesResult.data?.length || 0;
      const totalRevenue = salesResult.data?.reduce((sum, coin) => sum + (coin.price || 0), 0) || 0;

      return {
        store: storeResult.data,
        totalCoins,
        totalSales,
        totalRevenue,
        activeListings: totalCoins - totalSales,
        averagePrice: totalCoins > 0 ? totalRevenue / totalSales || 0 : 0
      };
    },
  });

  const dealerMetrics = [
    {
      title: 'Total Inventory',
      value: dealerStats?.totalCoins || 0,
      icon: Package,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50'
    },
    {
      title: 'Active Listings',
      value: dealerStats?.activeListings || 0,
      icon: Store,
      color: 'text-green-600',
      bgColor: 'bg-green-50'
    },
    {
      title: 'Total Sales',
      value: dealerStats?.totalSales || 0,
      icon: TrendingUp,
      color: 'text-purple-600',
      bgColor: 'bg-purple-50'
    },
    {
      title: 'Total Revenue',
      value: `$${(dealerStats?.totalRevenue || 0).toLocaleString()}`,
      icon: DollarSign,
      color: 'text-amber-600',
      bgColor: 'bg-amber-50'
    },
    {
      title: 'Average Price',
      value: `$${Math.round(dealerStats?.averagePrice || 0)}`,
      icon: BarChart3,
      color: 'text-rose-600',
      bgColor: 'bg-rose-50'
    },
    {
      title: 'Store Rating',
      value: '4.8',
      icon: Star,
      color: 'text-yellow-600',
      bgColor: 'bg-yellow-50'
    }
  ];

  if (isLoading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="text-center">Loading dealer dashboard...</div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Store Header */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Store className="w-5 h-5" />
            {dealerStats?.store?.name || 'Your Store'} - Dealer Dashboard
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-600">
            {dealerStats?.store?.description || 'Welcome to your dealer dashboard'}
          </p>
        </CardContent>
      </Card>

      {/* Dealer Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {dealerMetrics.map((metric, index) => {
          const Icon = metric.icon;
          return (
            <Card key={index}>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">{metric.title}</p>
                    <p className="text-2xl font-bold text-gray-900">{metric.value}</p>
                  </div>
                  <div className={`p-3 rounded-lg ${metric.bgColor}`}>
                    <Icon className={`w-6 h-6 ${metric.color}`} />
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Dealer Management Tabs */}
      <Tabs defaultValue="inventory" className="space-y-4">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="inventory">Inventory</TabsTrigger>
          <TabsTrigger value="sales">Sales Analytics</TabsTrigger>
          <TabsTrigger value="upload">Upload Coins</TabsTrigger>
          <TabsTrigger value="store">Store Settings</TabsTrigger>
        </TabsList>

        <TabsContent value="inventory">
          <Card>
            <CardHeader>
              <CardTitle>Inventory Management</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center py-12">
                <Package className="w-16 h-16 mx-auto text-gray-400 mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  Inventory Overview
                </h3>
                <p className="text-gray-600 max-w-md mx-auto">
                  View and manage your coin inventory. Track quantities, prices, and performance metrics.
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="sales">
          <Card>
            <CardHeader>
              <CardTitle>Sales Performance</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={[]}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="sales" fill="#8884d8" />
                  <Bar dataKey="revenue" fill="#82ca9d" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="upload">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Upload className="w-5 h-5" />
                Upload New Coins
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center py-12">
                <Upload className="w-16 h-16 mx-auto text-gray-400 mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  Coin Upload Center
                </h3>
                <p className="text-gray-600 max-w-md mx-auto">
                  Upload new coins to your inventory with AI-powered analysis and automatic categorization.
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="store">
          <Card>
            <CardHeader>
              <CardTitle>Store Configuration</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center py-12">
                <Store className="w-16 h-16 mx-auto text-gray-400 mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  Store Settings
                </h3>
                <p className="text-gray-600 max-w-md mx-auto">
                  Manage your store profile, payment settings, and business information.
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default DealerPanelDashboard;
