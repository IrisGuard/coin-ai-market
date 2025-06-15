
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  Coins, DollarSign, TrendingUp, Users, Lock, Activity,
  Settings, AlertCircle, CheckCircle, Zap, Shield
} from 'lucide-react';
import { useAdminTokenStats } from '@/hooks/useAdminTokenData';

export const TokenManagementOverview = () => {
  const { data: tokenData, isLoading } = useAdminTokenStats();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  const stats = [
    {
      title: 'Total Supply',
      value: `${(tokenData?.tokenInfo?.total_supply || 1000000000).toLocaleString()} GCAI`,
      icon: Coins,
      color: 'text-blue-600',
      bgColor: 'bg-blue-100'
    },
    {
      title: 'Circulating Supply',
      value: `${tokenData?.stats?.totalCirculating?.toLocaleString() || '0'} GCAI`,
      icon: TrendingUp,
      color: 'text-green-600',
      bgColor: 'bg-green-100'
    },
    {
      title: 'Total Locked',
      value: `${tokenData?.stats?.totalLocked?.toLocaleString() || '0'} GCAI`,
      icon: Lock,
      color: 'text-orange-600',
      bgColor: 'bg-orange-100'
    },
    {
      title: 'Current Price',
      value: `$${tokenData?.tokenInfo?.current_price_usd?.toFixed(4) || '0.1000'}`,
      icon: DollarSign,
      color: 'text-purple-600',
      bgColor: 'bg-purple-100'
    }
  ];

  return (
    <div className="space-y-6">
      {/* Status Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">GCAI Token Management</h2>
          <p className="text-gray-600">Complete token ecosystem administration</p>
        </div>
        <div className="flex gap-2">
          <Badge className="bg-green-100 text-green-800">
            <CheckCircle className="w-4 h-4 mr-1" />
            System Online
          </Badge>
          <Badge className="bg-blue-100 text-blue-800">
            <Activity className="w-4 h-4 mr-1" />
            Real-time Data
          </Badge>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <Card key={index} className="hover:shadow-lg transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                  <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                </div>
                <div className={`p-3 rounded-full ${stat.bgColor}`}>
                  <stat.icon className={`w-6 h-6 ${stat.color}`} />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Zap className="w-5 h-5" />
            Quick Actions
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Button className="bg-blue-600 hover:bg-blue-700 text-white">
              <Settings className="w-4 h-4 mr-2" />
              Update Exchange Rates
            </Button>
            <Button variant="outline" className="border-orange-600 text-orange-600 hover:bg-orange-50">
              <Lock className="w-4 h-4 mr-2" />
              Manage Token Locks
            </Button>
            <Button variant="outline" className="border-green-600 text-green-600 hover:bg-green-50">
              <Shield className="w-4 h-4 mr-2" />
              Security Dashboard
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Live System Status */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Exchange Rates</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-600">USDC Rate:</span>
                <span className="font-semibold">{tokenData?.tokenInfo?.usdc_rate || 10} GCAI per USDC</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">SOL Rate:</span>
                <span className="font-semibold">{tokenData?.tokenInfo?.sol_rate || 1000} GCAI per SOL</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Market Cap:</span>
                <span className="font-semibold">
                  ${((tokenData?.tokenInfo?.circulating_supply || 250000000) * (tokenData?.tokenInfo?.current_price_usd || 0.1)).toLocaleString()}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Activity Summary</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-600">Active Locks:</span>
                <span className="font-semibold">{tokenData?.stats?.activeLocks || 0}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Total Referrals:</span>
                <span className="font-semibold">{tokenData?.stats?.totalReferrals || 0}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Recent Activity:</span>
                <span className="font-semibold">{tokenData?.stats?.recentActivity || 0}</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
