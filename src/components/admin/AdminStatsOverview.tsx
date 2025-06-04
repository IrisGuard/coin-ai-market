
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Users, Coins, TrendingUp, Database } from 'lucide-react';
import { useAdminUsers, useMarketplaceStats } from '@/hooks/useAdminData';

const AdminStatsOverview = () => {
  const { data: users } = useAdminUsers();
  const { data: stats } = useMarketplaceStats();

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Users</CardTitle>
          <Users className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats?.registered_users || 0}</div>
          <p className="text-xs text-muted-foreground">
            +{users?.filter(u => new Date(u.created_at) > new Date(Date.now() - 7*24*60*60*1000)).length || 0} this week
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Listed Coins</CardTitle>
          <Coins className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats?.listed_coins || 0}</div>
          <p className="text-xs text-muted-foreground">
            {stats?.active_auctions || 0} active auctions
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Volume</CardTitle>
          <TrendingUp className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">${stats?.total_volume || 0}</div>
          <p className="text-xs text-muted-foreground">
            {stats?.weekly_transactions || 0} transactions this week
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">External Sources</CardTitle>
          <Database className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">8</div>
          <p className="text-xs text-muted-foreground">
            Active data streams
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminStatsOverview;
