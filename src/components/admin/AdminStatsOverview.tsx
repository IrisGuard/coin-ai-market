
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Coins, Users, DollarSign, TrendingUp, Database, Settings } from 'lucide-react';
import { useMarketplaceStats } from '@/hooks/useMarketplaceStats';
import SampleDataSetup from './SampleDataSetup';

const AdminStatsOverview = () => {
  const { stats, loading } = useMarketplaceStats();

  const statsCards = [
    {
      title: "Total Coins",
      value: loading ? "..." : stats.total.toString(),
      icon: <Coins className="w-6 h-6" />,
      color: "text-blue-600"
    },
    {
      title: "Active Auctions", 
      value: loading ? "..." : stats.auctions.toString(),
      icon: <TrendingUp className="w-6 h-6" />,
      color: "text-green-600"
    },
    {
      title: "Featured Coins",
      value: loading ? "..." : stats.featured.toString(),
      icon: <Database className="w-6 h-6" />,
      color: "text-purple-600"
    },
    {
      title: "Total Value",
      value: loading ? "..." : `$${stats.totalValue.toLocaleString()}`,
      icon: <DollarSign className="w-6 h-6" />,
      color: "text-amber-600"
    },
    {
      title: "Active Users",
      value: loading ? "..." : stats.activeUsers.toString(),
      icon: <Users className="w-6 h-6" />,
      color: "text-rose-600"
    },
    {
      title: "System Status",
      value: "Operational",
      icon: <Settings className="w-6 h-6" />,
      color: "text-emerald-600"
    }
  ];

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {statsCards.map((stat) => (
          <Card key={stat.title}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                {stat.title}
              </CardTitle>
              <div className={stat.color}>
                {stat.icon}
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
            </CardContent>
          </Card>
        ))}
      </div>
      
      {/* Sample Data Setup */}
      <SampleDataSetup />
    </div>
  );
};

export default AdminStatsOverview;
