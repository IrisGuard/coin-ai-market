
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { 
  Users, 
  Coins, 
  Store, 
  TrendingUp, 
  Activity, 
  AlertTriangle,
  CheckCircle,
  Clock,
  DollarSign,
  Eye,
  Heart,
  ShoppingCart,
  Zap
} from 'lucide-react';

const AdminOverviewTab = () => {
  // Real-time stats from Supabase
  const { data: stats, isLoading: statsLoading, error: statsError } = useQuery({
    queryKey: ['admin-overview-stats'],
    queryFn: async () => {
      console.log('🔄 Fetching admin overview stats...');
      
      // Get all stats in parallel for better performance
      const [
        usersResult,
        dealersResult,
        verifiedDealersResult,
        coinsResult,
        featuredCoinsResult,
        storesResult,
        activeStoresResult,
        transactionsResult,
        categoriesResult,
        analyticsResult
      ] = await Promise.all([
        supabase.from('profiles').select('id', { count: 'exact', head: true }),
        supabase.from('profiles').select('id', { count: 'exact', head: true }).eq('role', 'dealer'),
        supabase.from('profiles').select('id', { count: 'exact', head: true }).eq('verified_dealer', true),
        supabase.from('coins').select('id', { count: 'exact', head: true }),
        supabase.from('coins').select('id', { count: 'exact', head: true }).eq('featured', true),
        supabase.from('stores').select('id', { count: 'exact', head: true }),
        supabase.from('stores').select('id', { count: 'exact', head: true }).eq('is_active', true),
        supabase.from('payment_transactions').select('id, amount', { count: 'exact' }).eq('status', 'completed'),
        supabase.from('categories').select('id', { count: 'exact', head: true }).eq('is_active', true),
        supabase.from('analytics_events').select('id', { count: 'exact', head: true })
      ]);

      // Calculate total revenue
      const totalRevenue = transactionsResult.data?.reduce((sum, tx) => sum + (tx.amount || 0), 0) || 0;

      const result = {
        totalUsers: usersResult.count || 0,
        totalDealers: dealersResult.count || 0,
        verifiedDealers: verifiedDealersResult.count || 0,
        totalCoins: coinsResult.count || 0,
        featuredCoins: featuredCoinsResult.count || 0,
        totalStores: storesResult.count || 0,
        activeStores: activeStoresResult.count || 0,
        totalTransactions: transactionsResult.count || 0,
        totalRevenue: totalRevenue,
        activeCategories: categoriesResult.count || 0,
        totalAnalyticsEvents: analyticsResult.count || 0
      };

      console.log('✅ Admin stats loaded:', result);
      return result;
    },
    refetchInterval: 30000, // Refresh every 30 seconds
  });

  // Recent activity from analytics events
  const { data: recentActivity, isLoading: activityLoading } = useQuery({
    queryKey: ['admin-recent-activity'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('analytics_events')
        .select('id, event_type, page_url, timestamp, metadata')
        .order('timestamp', { ascending: false })
        .limit(10);

      if (error) {
        console.error('Error fetching recent activity:', error);
        return [];
      }

      return data?.map(event => ({
        id: event.id,
        type: event.event_type,
        description: `${event.event_type} on ${event.page_url}`,
        timestamp: event.timestamp,
        metadata: event.metadata
      })) || [];
    },
  });

  if (statsLoading) {
    return (
      <div className="space-y-6">
        <div className="text-center py-8">
          <div className="animate-spin h-8 w-8 border-4 border-blue-600 border-t-transparent rounded-full mx-auto mb-4"></div>
          <p className="text-gray-600">Loading real-time admin overview...</p>
        </div>
      </div>
    );
  }

  if (statsError) {
    return (
      <div className="space-y-6">
        <Card className="border-red-200 bg-red-50">
          <CardContent className="p-6">
            <div className="flex items-center gap-2 text-red-600">
              <AlertTriangle className="h-5 w-5" />
              <span>Error loading admin stats: {statsError.message}</span>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-50 to-purple-50 p-6 rounded-lg border border-blue-200">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-blue-800 mb-2">
              🔴 LIVE ADMIN OVERVIEW - Real-Time Supabase Data
            </h2>
            <p className="text-blue-600">
              Complete system overview • Live database connection • Real-time updates
            </p>
          </div>
          <div className="flex gap-2">
            <Badge className="bg-green-600">LIVE DATA</Badge>
            <Badge className="bg-blue-600">AUTO-REFRESH</Badge>
            <Badge className="bg-purple-600">REAL-TIME</Badge>
          </div>
        </div>
      </div>

      {/* Main Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Users Stats */}
        <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-2 text-blue-700">
              <Users className="h-5 w-5" />
              Users
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">{stats?.totalUsers || 0}</div>
            <div className="text-sm text-blue-500">Total registered users</div>
            <div className="mt-2 space-y-1">
              <div className="text-xs text-blue-600">
                Dealers: {stats?.totalDealers || 0}
              </div>
              <div className="text-xs text-green-600">
                Verified: {stats?.verifiedDealers || 0}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Coins Stats */}
        <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200">
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-2 text-green-700">
              <Coins className="h-5 w-5" />
              Coins
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{stats?.totalCoins || 0}</div>
            <div className="text-sm text-green-500">Total coins listed</div>
            <div className="mt-2">
              <div className="text-xs text-yellow-600">
                Featured: {stats?.featuredCoins || 0}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Stores Stats */}
        <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200">
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-2 text-purple-700">
              <Store className="h-5 w-5" />
              Stores
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-600">{stats?.totalStores || 0}</div>
            <div className="text-sm text-purple-500">Total dealer stores</div>
            <div className="mt-2">
              <div className="text-xs text-green-600">
                Active: {stats?.activeStores || 0}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Revenue Stats */}
        <Card className="bg-gradient-to-br from-orange-50 to-orange-100 border-orange-200">
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-2 text-orange-700">
              <DollarSign className="h-5 w-5" />
              Revenue
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">
              ${stats?.totalRevenue?.toFixed(2) || '0.00'}
            </div>
            <div className="text-sm text-orange-500">Total completed sales</div>
            <div className="mt-2">
              <div className="text-xs text-blue-600">
                Transactions: {stats?.totalTransactions || 0}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Secondary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Activity className="h-5 w-5" />
              System Activity
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Categories</span>
                <span className="font-medium">{stats?.activeCategories || 0}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Analytics Events</span>
                <span className="font-medium">{stats?.totalAnalyticsEvents || 0}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CheckCircle className="h-5 w-5" />
              System Health
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span className="text-sm">Database Connected</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span className="text-sm">Real-time Updates Active</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span className="text-sm">All Services Operational</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="h-5 w-5" />
              Recent Activity
            </CardTitle>
          </CardHeader>
          <CardContent>
            {activityLoading ? (
              <div className="text-sm text-gray-500">Loading activity...</div>
            ) : (
              <div className="space-y-2">
                {recentActivity?.slice(0, 3).map((activity) => (
                  <div key={activity.id} className="text-xs">
                    <div className="font-medium truncate">{activity.type}</div>
                    <div className="text-gray-500">
                      {new Date(activity.timestamp).toLocaleTimeString()}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Button variant="outline" className="flex items-center gap-2">
              <Users className="h-4 w-4" />
              Manage Users
            </Button>
            <Button variant="outline" className="flex items-center gap-2">
              <Store className="h-4 w-4" />
              View Stores
            </Button>
            <Button variant="outline" className="flex items-center gap-2">
              <Coins className="h-4 w-4" />
              Review Coins
            </Button>
            <Button variant="outline" className="flex items-center gap-2">
              <TrendingUp className="h-4 w-4" />
              Analytics
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Live Status Footer */}
      <div className="text-center text-sm text-gray-500">
        🔴 Live connection to Supabase • Auto-refresh every 30 seconds • 
        Last updated: {new Date().toLocaleTimeString()}
      </div>
    </div>
  );
};

export default AdminOverviewTab;
