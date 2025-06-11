
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Coins, Users, DollarSign, TrendingUp, Database, Settings, Activity, AlertTriangle } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

const AdminStatsOverview = () => {
  const { data: stats, isLoading, error } = useQuery({
    queryKey: ['admin-dashboard-stats'],
    queryFn: async () => {
      try {
        console.log('🔍 Fetching admin dashboard stats...');
        
        // Get comprehensive stats from all tables
        const [
          usersResult,
          coinsResult,
          dealersResult,
          transactionsResult,
          storesResult,
          aiCommandsResult,
          errorLogsResult,
          auctionsResult
        ] = await Promise.all([
          supabase.from('profiles').select('id', { count: 'exact', head: true }),
          supabase.from('coins').select('id, price', { count: 'exact' }),
          supabase.from('profiles').select('id', { count: 'exact', head: true }).eq('verified_dealer', true),
          supabase.from('payment_transactions').select('id, amount', { count: 'exact' }),
          supabase.from('stores').select('id', { count: 'exact', head: true }).eq('is_active', true),
          supabase.from('ai_commands').select('id', { count: 'exact', head: true }).eq('is_active', true),
          supabase.from('error_logs').select('id', { count: 'exact', head: true }).gte('created_at', new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString()),
          supabase.from('coins').select('id', { count: 'exact', head: true }).eq('is_auction', true).gte('auction_end', new Date().toISOString())
        ]);

        // Calculate total value safely
        let totalValue = 0;
        if (coinsResult.data && coinsResult.data.length > 0) {
          totalValue = coinsResult.data.reduce((sum, coin) => sum + (Number(coin.price) || 0), 0);
        }

        // Calculate transaction total safely
        let transactionTotal = 0;
        if (transactionsResult.data && transactionsResult.data.length > 0) {
          transactionTotal = transactionsResult.data
            .filter(t => t.amount)
            .reduce((sum, t) => sum + (Number(t.amount) || 0), 0);
        }

        const result = {
          totalUsers: usersResult.count || 0,
          totalCoins: coinsResult.count || 0,
          verifiedDealers: dealersResult.count || 0,
          totalTransactions: transactionsResult.count || 0,
          activeStores: storesResult.count || 0,
          activeAICommands: aiCommandsResult.count || 0,
          errors24h: errorLogsResult.count || 0,
          liveAuctions: auctionsResult.count || 0,
          totalValue,
          transactionTotal
        };

        console.log('✅ Admin dashboard stats loaded:', result);
        return result;
      } catch (error) {
        console.error('❌ Error fetching admin stats:', error);
        throw error;
      }
    },
    retry: 3,
    retryDelay: 1000,
  });

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold text-gray-900">Admin Dashboard</h2>
          <Badge variant="outline" className="flex items-center gap-1">
            <div className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" />
            Loading...
          </Badge>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
            <Card key={i} className="animate-pulse">
              <CardContent className="p-6">
                <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                <div className="h-8 bg-gray-200 rounded w-1/2"></div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold text-gray-900">Admin Dashboard</h2>
          <Badge variant="destructive" className="flex items-center gap-1">
            <AlertTriangle className="w-3 h-3" />
            Error Loading
          </Badge>
        </div>
        <Card className="border-red-200 bg-red-50">
          <CardContent className="p-6">
            <div className="text-center text-red-600">
              <AlertTriangle className="w-8 h-8 mx-auto mb-2" />
              <p className="font-medium">Failed to load dashboard statistics</p>
              <p className="text-sm mt-1">{error?.message || 'Unknown error'}</p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  const statsCards = [
    {
      title: "Total Users",
      value: stats?.totalUsers?.toString() || "0",
      icon: <Users className="w-6 h-6" />,
      color: "text-blue-600",
      bgColor: "bg-blue-50"
    },
    {
      title: "Total Coins",
      value: stats?.totalCoins?.toString() || "0",
      icon: <Coins className="w-6 h-6" />,
      color: "text-green-600",
      bgColor: "bg-green-50"
    },
    {
      title: "Verified Dealers", 
      value: stats?.verifiedDealers?.toString() || "0",
      icon: <Users className="w-6 h-6" />,
      color: "text-purple-600",
      bgColor: "bg-purple-50"
    },
    {
      title: "Active Stores",
      value: stats?.activeStores?.toString() || "0",
      icon: <Database className="w-6 h-6" />,
      color: "text-indigo-600",
      bgColor: "bg-indigo-50"
    },
    {
      title: "Live Auctions",
      value: stats?.liveAuctions?.toString() || "0",
      icon: <TrendingUp className="w-6 h-6" />,
      color: "text-orange-600",
      bgColor: "bg-orange-50"
    },
    {
      title: "AI Commands",
      value: stats?.activeAICommands?.toString() || "0",
      icon: <Settings className="w-6 h-6" />,
      color: "text-cyan-600",
      bgColor: "bg-cyan-50"
    },
    {
      title: "Total Value",
      value: `€${stats?.totalValue?.toLocaleString() || 0}`,
      icon: <DollarSign className="w-6 h-6" />,
      color: "text-amber-600",
      bgColor: "bg-amber-50"
    },
    {
      title: "Errors (24h)",
      value: stats?.errors24h?.toString() || "0",
      icon: <AlertTriangle className="w-6 h-6" />,
      color: stats?.errors24h && stats.errors24h > 5 ? "text-red-600" : "text-gray-600",
      bgColor: stats?.errors24h && stats.errors24h > 5 ? "bg-red-50" : "bg-gray-50"
    }
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900">Admin Dashboard</h2>
        <div className="flex items-center gap-2">
          <Badge variant="outline" className="flex items-center gap-1">
            <div className="w-2 h-2 rounded-full bg-green-500" />
            Live Data
          </Badge>
          <span className="text-sm text-gray-500">
            Last updated: {new Date().toLocaleTimeString()}
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statsCards.map((stat) => (
          <Card key={stat.title} className="hover:shadow-lg transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">
                {stat.title}
              </CardTitle>
              <div className={`p-2 rounded-lg ${stat.bgColor} ${stat.color}`}>
                {stat.icon}
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-gray-900">{stat.value}</div>
              <p className="text-xs text-gray-500 mt-1">
                Real-time data from database
              </p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default AdminStatsOverview;
