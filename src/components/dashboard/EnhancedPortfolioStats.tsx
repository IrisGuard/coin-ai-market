
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { TrendingUp, TrendingDown, DollarSign, Coins, Activity } from 'lucide-react';

interface PortfolioStatsProps {
  stats: {
    totalCoins: number;
    totalValue: number;
    totalProfit: number;
    profitPercentage: number;
    portfolioItems: any[];
  };
  loading?: boolean;
}

const EnhancedPortfolioStats: React.FC<PortfolioStatsProps> = ({ stats, loading = false }) => {
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
    }).format(price);
  };

  const getTopPerformingCoins = () => {
    return stats.portfolioItems
      .map(item => ({
        ...item,
        currentValue: (item.coins?.price || item.purchase_price || 0) * item.quantity,
        profit: ((item.coins?.price || item.purchase_price || 0) - (item.purchase_price || 0)) * item.quantity,
        profitPercentage: item.purchase_price > 0 
          ? (((item.coins?.price || item.purchase_price || 0) - item.purchase_price) / item.purchase_price) * 100 
          : 0
      }))
      .sort((a, b) => b.profitPercentage - a.profitPercentage)
      .slice(0, 3);
  };

  const topCoins = getTopPerformingCoins();

  if (loading) {
    return (
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="animate-pulse">
          <CardContent className="p-6">
            <div className="h-32 bg-gray-200 rounded"></div>
          </CardContent>
        </Card>
        <Card className="animate-pulse">
          <CardContent className="p-6">
            <div className="h-32 bg-gray-200 rounded"></div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Activity className="h-5 w-5" />
            Portfolio Performance
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Value</p>
                <p className="text-2xl font-bold">{formatPrice(stats.totalValue)}</p>
              </div>
              <DollarSign className="h-8 w-8 text-green-600" />
            </div>
            
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Profit/Loss</p>
                <p className={`text-xl font-bold ${stats.totalProfit >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                  {stats.totalProfit >= 0 ? '+' : ''}{formatPrice(stats.totalProfit)}
                </p>
              </div>
              {stats.totalProfit >= 0 ? 
                <TrendingUp className="h-6 w-6 text-green-600" /> : 
                <TrendingDown className="h-6 w-6 text-red-600" />
              }
            </div>

            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Performance</p>
                <p className={`text-lg font-semibold ${stats.profitPercentage >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                  {stats.profitPercentage >= 0 ? '+' : ''}{stats.profitPercentage.toFixed(2)}%
                </p>
              </div>
              <Badge variant={stats.profitPercentage >= 0 ? "default" : "destructive"}>
                {stats.profitPercentage >= 0 ? 'Profit' : 'Loss'}
              </Badge>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Coins className="h-5 w-5" />
            Top Performing Coins
          </CardTitle>
        </CardHeader>
        <CardContent>
          {topCoins.length === 0 ? (
            <div className="text-center py-8">
              <Coins className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600">No coins in your portfolio yet</p>
            </div>
          ) : (
            <div className="space-y-3">
              {topCoins.map((coin, index) => (
                <div key={coin.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="flex items-center justify-center w-6 h-6 bg-brand-primary/20 rounded-full text-brand-primary font-bold text-xs">
                      {index + 1}
                    </div>
                    <div>
                      <p className="font-medium">{coin.coins?.name || 'Unknown Coin'}</p>
                      <p className="text-sm text-gray-600">Qty: {coin.quantity}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold">{formatPrice(coin.currentValue)}</p>
                    <p className={`text-sm ${coin.profitPercentage >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                      {coin.profitPercentage >= 0 ? '+' : ''}{coin.profitPercentage.toFixed(1)}%
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default EnhancedPortfolioStats;
