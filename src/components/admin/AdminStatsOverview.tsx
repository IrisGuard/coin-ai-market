
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Coins, Users, DollarSign, TrendingUp, Database, Settings, Activity } from 'lucide-react';
import { useRealTimeStats } from '@/hooks/admin/useRealTimeStats';
import AdminDataValidator from './AdminDataValidator';

const AdminStatsOverview = () => {
  const { stats, lastUpdate, isRealTime } = useRealTimeStats();

  const statsCards = [
    {
      title: "Total Coins",
      value: stats?.total?.toString() || "0",
      icon: <Coins className="w-6 h-6" />,
      color: "text-blue-600",
      bgColor: "bg-blue-50"
    },
    {
      title: "Active Auctions", 
      value: stats?.auctions?.toString() || "0",
      icon: <TrendingUp className="w-6 h-6" />,
      color: "text-green-600",
      bgColor: "bg-green-50"
    },
    {
      title: "Featured Coins",
      value: stats?.featured?.toString() || "0",
      icon: <Database className="w-6 h-6" />,
      color: "text-purple-600",
      bgColor: "bg-purple-50"
    },
    {
      title: "Total Value",
      value: `€${stats?.totalValue?.toLocaleString() || 0}`,
      icon: <DollarSign className="w-6 h-6" />,
      color: "text-amber-600",
      bgColor: "bg-amber-50"
    },
    {
      title: "Active Users",
      value: stats?.activeUsers?.toString() || "0",
      icon: <Users className="w-6 h-6" />,
      color: "text-rose-600",
      bgColor: "bg-rose-50"
    },
    {
      title: "Transactions",
      value: stats?.totalTransactions?.toString() || "0",
      icon: <Activity className="w-6 h-6" />,
      color: "text-cyan-600",
      bgColor: "bg-cyan-50"
    }
  ];

  return (
    <div className="space-y-6">
      {/* Real-time indicator */}
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900">Admin Dashboard</h2>
        <div className="flex items-center gap-2">
          <Badge variant="outline" className="flex items-center gap-1">
            <div className={`w-2 h-2 rounded-full ${isRealTime ? 'bg-green-500 animate-pulse' : 'bg-gray-400'}`} />
            {isRealTime ? 'Live Data' : 'Static Data'}
          </Badge>
          <span className="text-sm text-gray-500">
            Last updated: {lastUpdate.toLocaleTimeString()}
          </span>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
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
      
      {/* Data Validator */}
      <AdminDataValidator />
    </div>
  );
};

export default AdminStatsOverview;
