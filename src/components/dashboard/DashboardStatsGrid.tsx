
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface DashboardStatsGridProps {
  stats: any;
}

const DashboardStatsGrid: React.FC<DashboardStatsGridProps> = ({ stats }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
      <Card>
        <CardHeader>
          <CardTitle>Total Coins</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats?.totalCoins || 0}</div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Total Value</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">${stats?.totalValue || 0}</div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Watchlist</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats?.watchlistItems || 0}</div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Recent Activity</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats?.recentActivity || 0}</div>
        </CardContent>
      </Card>
    </div>
  );
};

export default DashboardStatsGrid;
