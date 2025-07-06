
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Activity, Users, Coins, TrendingUp } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

const AdminOverviewTab = () => {
  // Fetch basic system stats
  const { data: stats } = useQuery({
    queryKey: ['admin-overview-stats'],
    queryFn: async () => {
      const [coinsResult, banknotesResult, bullionResult, usersResult, analyticsResult] = await Promise.all([
        supabase.from('coins').select('id', { count: 'exact', head: true }),
        supabase.from('banknotes').select('id', { count: 'exact', head: true }),
        supabase.from('bullion_bars').select('id', { count: 'exact', head: true }),
        supabase.from('profiles').select('id', { count: 'exact', head: true }),
        supabase.from('analytics_events').select('id', { count: 'exact', head: true })
      ]);

      return {
        totalCoins: coinsResult.count || 0,
        totalBanknotes: banknotesResult.count || 0,
        totalBullion: bullionResult.count || 0,
        totalUsers: usersResult.count || 0,
        totalEvents: analyticsResult.count || 0,
        totalListings: (coinsResult.count || 0) + (banknotesResult.count || 0) + (bullionResult.count || 0)
      };
    },
    refetchInterval: 30000,
  });

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-6 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Listings</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">{stats?.totalListings || 0}</div>
            <p className="text-xs text-muted-foreground">All categories</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Coins</CardTitle>
            <Coins className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.totalCoins || 0}</div>
            <p className="text-xs text-muted-foreground">Coin listings</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Banknotes</CardTitle>
            <div className="h-4 w-4 bg-green-600 rounded"></div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{stats?.totalBanknotes || 0}</div>
            <p className="text-xs text-muted-foreground">Banknote listings</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Bullion</CardTitle>
            <div className="h-4 w-4 bg-yellow-600 rounded"></div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">{stats?.totalBullion || 0}</div>
            <p className="text-xs text-muted-foreground">Precious metals</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Users</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.totalUsers || 0}</div>
            <p className="text-xs text-muted-foreground">Registered users</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">System Status</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">Live</div>
            <p className="text-xs text-muted-foreground">Multi-category</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>System Overview</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-3 border rounded-lg">
              <span>Multi-Category AI System</span>
              <Badge variant="default">Active</Badge>
            </div>
            
            <div className="flex items-center justify-between p-3 border rounded-lg">
              <span>Coins, Banknotes & Bullion</span>
              <Badge variant="default">Operational</Badge>
            </div>
            
            <div className="flex items-center justify-between p-3 border rounded-lg">
              <span>Security Monitoring</span>
              <Badge variant="default">Protected</Badge>
            </div>
            
            <div className="flex items-center justify-between p-3 border rounded-lg">
              <span>Performance Optimization</span>
              <Badge variant="default">Optimized</Badge>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminOverviewTab;
