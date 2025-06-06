
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  TrendingUp, 
  DollarSign, 
  Coins, 
  Clock 
} from 'lucide-react';

interface DashboardStatsGridProps {
  stats: {
    totalValue: number;
    profitPercentage: number;
    totalProfit: number;
    totalCoins: number;
  };
  activeBidsCount?: number;
}

const DashboardStatsGrid: React.FC<DashboardStatsGridProps> = ({ 
  stats, 
  activeBidsCount = 0 
}) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Portfolio Value</CardTitle>
          <DollarSign className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">${stats.totalValue.toLocaleString()}</div>
          <p className={`text-xs flex items-center gap-1 ${stats.profitPercentage >= 0 ? 'text-green-600' : 'text-red-600'}`}>
            {stats.profitPercentage >= 0 ? <TrendingUp className="h-3 w-3" /> : <TrendingUp className="h-3 w-3 rotate-180" />}
            {stats.profitPercentage >= 0 ? '+' : ''}{stats.profitPercentage.toFixed(2)}%
          </p>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Profit/Loss</CardTitle>
          {stats.totalProfit >= 0 ? 
            <TrendingUp className="h-4 w-4 text-green-600" /> : 
            <TrendingUp className="h-4 w-4 text-red-600 rotate-180" />
          }
        </CardHeader>
        <CardContent>
          <div className={`text-2xl font-bold ${stats.totalProfit >= 0 ? 'text-green-600' : 'text-red-600'}`}>
            {stats.totalProfit >= 0 ? '+' : ''}${Math.abs(stats.totalProfit).toLocaleString()}
          </div>
          <p className="text-xs text-muted-foreground">
            Total portfolio gain/loss
          </p>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Coins Owned</CardTitle>
          <Coins className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats.totalCoins}</div>
          <p className="text-xs text-muted-foreground">
            In your portfolio
          </p>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Active Bids</CardTitle>
          <Clock className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{activeBidsCount}</div>
          <p className="text-xs text-muted-foreground">
            Auctions in progress
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default DashboardStatsGrid;
