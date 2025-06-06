
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Heart, Eye, Activity } from 'lucide-react';

interface DashboardSecondaryStatsProps {
  stats: {
    favoriteCoins: number;
    completedTransactions: number;
  };
  watchlistCount?: number;
}

const DashboardSecondaryStats: React.FC<DashboardSecondaryStatsProps> = ({ 
  stats, 
  watchlistCount = 0 
}) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Favorites</CardTitle>
          <Heart className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-xl font-bold">{stats.favoriteCoins}</div>
          <p className="text-xs text-muted-foreground">Coins you love</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Watchlist</CardTitle>
          <Eye className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-xl font-bold">{watchlistCount}</div>
          <p className="text-xs text-muted-foreground">Items being watched</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Transactions</CardTitle>
          <Activity className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-xl font-bold">{stats.completedTransactions}</div>
          <p className="text-xs text-muted-foreground">Completed deals</p>
        </CardContent>
      </Card>
    </div>
  );
};

export default DashboardSecondaryStats;
