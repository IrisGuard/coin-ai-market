
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { BarChart3, Users, Coins, DollarSign, TrendingUp, Activity } from 'lucide-react';
import { mockApi } from '@/lib/mockApi';
import { toast } from '@/hooks/use-toast';

interface Stats {
  listed_coins: number;
  active_auctions: number;
  registered_users: number;
  total_volume: number;
  weekly_transactions: number;
}

const AdminAnalyticsTab = () => {
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchStats = async () => {
    try {
      // Mock stats data
      const mockStats = {
        listed_coins: 1245,
        active_auctions: 126,
        registered_users: 45729,
        total_volume: 1200000,
        weekly_transactions: 342
      };
      
      setStats(mockStats);
    } catch (error) {
      console.error('Error fetching stats:', error);
      toast({
        title: "Error",
        description: "Failed to load analytics data",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  if (loading) {
    return <div className="p-4">Loading analytics...</div>;
  }

  if (!stats) {
    return <div className="p-4">Failed to load analytics data.</div>;
  }

  const statCards = [
    {
      title: 'Total Users',
      value: stats.registered_users.toLocaleString(),
      icon: Users,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50'
    },
    {
      title: 'Listed Coins',
      value: stats.listed_coins.toLocaleString(),
      icon: Coins,
      color: 'text-yellow-600',
      bgColor: 'bg-yellow-50'
    },
    {
      title: 'Active Auctions',
      value: stats.active_auctions.toLocaleString(),
      icon: Activity,
      color: 'text-green-600',
      bgColor: 'bg-green-50'
    },
    {
      title: 'Total Volume',
      value: `$${stats.total_volume.toLocaleString()}`,
      icon: DollarSign,
      color: 'text-purple-600',
      bgColor: 'bg-purple-50'
    },
    {
      title: 'Weekly Transactions',
      value: stats.weekly_transactions.toLocaleString(),
      icon: TrendingUp,
      color: 'text-red-600',
      bgColor: 'bg-red-50'
    }
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2 mb-6">
        <BarChart3 className="h-6 w-6 text-blue-600" />
        <h3 className="text-lg font-semibold">Platform Analytics</h3>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {statCards.map((stat, index) => (
          <Card key={index}>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                  <p className="text-2xl font-bold text-gray-900 mt-1">{stat.value}</p>
                </div>
                <div className={`p-3 rounded-full ${stat.bgColor}`}>
                  <stat.icon className={`h-6 w-6 ${stat.color}`} />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Platform Health</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Active Users (24h)</span>
              <Badge variant="default" className="bg-green-100 text-green-800">
                {Math.floor(stats.registered_users * 0.1).toLocaleString()}
              </Badge>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Average Transaction Value</span>
              <Badge variant="outline">
                ${Math.floor(stats.total_volume / Math.max(stats.weekly_transactions * 52, 1)).toLocaleString()}
              </Badge>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Auction Success Rate</span>
              <Badge variant="default" className="bg-blue-100 text-blue-800">
                85%
              </Badge>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">User Retention Rate</span>
              <Badge variant="default" className="bg-purple-100 text-purple-800">
                72%
              </Badge>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="p-3 border rounded-lg">
              <div className="text-sm font-medium">Featured Coins</div>
              <div className="text-xs text-gray-500 mt-1">
                Manage and promote high-value coins
              </div>
            </div>
            <div className="p-3 border rounded-lg">
              <div className="text-sm font-medium">User Verification</div>
              <div className="text-xs text-gray-500 mt-1">
                Review pending user verifications
              </div>
            </div>
            <div className="p-3 border rounded-lg">
              <div className="text-sm font-medium">Transaction Monitoring</div>
              <div className="text-xs text-gray-500 mt-1">
                Monitor suspicious activities
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AdminAnalyticsTab;
