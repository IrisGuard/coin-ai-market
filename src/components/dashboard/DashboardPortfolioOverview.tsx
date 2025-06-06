
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Coins } from 'lucide-react';

interface DashboardPortfolioOverviewProps {
  portfolioItems?: any[];
  stats: {
    totalCoins: number;
    totalValue: number;
  };
}

const DashboardPortfolioOverview: React.FC<DashboardPortfolioOverviewProps> = ({ 
  portfolioItems, 
  stats 
}) => {
  const uniqueCountries = portfolioItems 
    ? new Set(portfolioItems.map(item => item.coins?.country).filter(Boolean)).size
    : 0;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Portfolio Overview</CardTitle>
        <CardDescription>Your collection at a glance</CardDescription>
      </CardHeader>
      <CardContent>
        {portfolioItems && portfolioItems.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-brand-primary">{stats.totalCoins}</div>
              <p className="text-sm text-gray-600">Total Coins</p>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">${stats.totalValue.toLocaleString()}</div>
              <p className="text-sm text-gray-600">Total Value</p>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-amber-600">{uniqueCountries}</div>
              <p className="text-sm text-gray-600">Countries</p>
            </div>
          </div>
        ) : (
          <div className="text-center py-8">
            <Coins className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600">No coins in your portfolio yet</p>
            <p className="text-sm text-gray-500">Start collecting to see your portfolio overview</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default DashboardPortfolioOverview;
