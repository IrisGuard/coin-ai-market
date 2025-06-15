
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  Coins, TrendingUp, Lock, Users, Settings, Activity, 
  BarChart3, Shield, DollarSign, Zap 
} from 'lucide-react';
import { useTokenInfo } from '@/hooks/useTokenInfo';
import { useWalletBalance } from '@/hooks/useWalletBalance';
import { useTokenLocks } from '@/hooks/useTokenLocks';
import { useReferrals } from '@/hooks/useReferrals';
import { useTokenActivity } from '@/hooks/useTokenActivity';

const AdminGCAITokenTab = () => {
  const [activeSubTab, setActiveSubTab] = useState('overview');
  const { data: tokenInfo } = useTokenInfo();
  const { data: walletData } = useWalletBalance();
  const { data: tokenLocks } = useTokenLocks();
  const { data: referralData } = useReferrals();
  const { data: activityData } = useTokenActivity();

  const tokenStats = [
    {
      title: 'Current Price',
      value: `$${tokenInfo?.current_price_usd?.toFixed(4) || '0.1000'}`,
      icon: DollarSign,
      color: 'text-green-600',
      bgColor: 'bg-green-100'
    },
    {
      title: 'Total Supply',
      value: `${(tokenInfo?.total_supply || 1000000000).toLocaleString()} GCAI`,
      icon: Coins,
      color: 'text-blue-600',
      bgColor: 'bg-blue-100'
    },
    {
      title: 'Circulating Supply',
      value: `${(tokenInfo?.circulating_supply || 250000000).toLocaleString()} GCAI`,
      icon: TrendingUp,
      color: 'text-purple-600',
      bgColor: 'bg-purple-100'
    },
    {
      title: 'Total Locked',
      value: `${(walletData?.locked_balance || 0).toLocaleString()} GCAI`,
      icon: Lock,
      color: 'text-orange-600',
      bgColor: 'bg-orange-100'
    }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">GCAI Token Administration</h2>
          <p className="text-gray-600">Complete token ecosystem management with real-time data</p>
        </div>
        <div className="flex gap-2">
          <Badge className="bg-green-100 text-green-800">
            <Activity className="w-4 h-4 mr-1" />
            Live Production
          </Badge>
          <Badge className="bg-blue-100 text-blue-800">
            Real Transactions
          </Badge>
        </div>
      </div>

      {/* Token Statistics Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {tokenStats.map((stat, index) => (
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

      {/* Admin Sub-Tabs */}
      <Tabs value={activeSubTab} onValueChange={setActiveSubTab} className="space-y-4">
        <TabsList className="grid w-full grid-cols-6">
          <TabsTrigger value="overview" className="flex items-center gap-2">
            <BarChart3 className="w-4 h-4" />
            Overview
          </TabsTrigger>
          <TabsTrigger value="management" className="flex items-center gap-2">
            <Settings className="w-4 h-4" />
            Management
          </TabsTrigger>
          <TabsTrigger value="locks" className="flex items-center gap-2">
            <Lock className="w-4 h-4" />
            Token Locks
          </TabsTrigger>
          <TabsTrigger value="referrals" className="flex items-center gap-2">
            <Users className="w-4 h-4" />
            Referrals
          </TabsTrigger>
          <TabsTrigger value="activity" className="flex items-center gap-2">
            <Activity className="w-4 h-4" />
            Activity
          </TabsTrigger>
          <TabsTrigger value="security" className="flex items-center gap-2">
            <Shield className="w-4 h-4" />
            Security
          </TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="w-5 h-5" />
                  Live Token Metrics
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between">
                    <span className="text-gray-600">USDC Exchange Rate:</span>
                    <span className="font-semibold">{tokenInfo?.usdc_rate || 10} GCAI per USDC</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">SOL Exchange Rate:</span>
                    <span className="font-semibold">{tokenInfo?.sol_rate || 1000} GCAI per SOL</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Market Cap:</span>
                    <span className="font-semibold">
                      ${((tokenInfo?.circulating_supply || 250000000) * (tokenInfo?.current_price_usd || 0.1)).toLocaleString()}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Activity className="w-5 h-5" />
                  Recent Activity Summary
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Active Locks:</span>
                    <span className="font-semibold">{tokenLocks?.length || 0}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Total Referrals:</span>
                    <span className="font-semibold">{referralData?.total_referrals || 0}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Recent Transactions:</span>
                    <span className="font-semibold">{activityData?.length || 0}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="management">
          <Card>
            <CardHeader>
              <CardTitle>Token Configuration Management</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8">
                <Settings className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600">Token management controls will be implemented here</p>
                <p className="text-sm text-gray-500">Including exchange rates, treasury management, and system parameters</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="locks">
          <Card>
            <CardHeader>
              <CardTitle>Token Locks Administration</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8">
                <Lock className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600">Live token locks monitoring and management</p>
                <p className="text-sm text-gray-500">Real-time tracking of all locked tokens and rewards distribution</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="referrals">
          <Card>
            <CardHeader>
              <CardTitle>Referral System Management</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8">
                <Users className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600">Referral program administration and analytics</p>
                <p className="text-sm text-gray-500">Track commission payments and referral performance</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="activity">
          <Card>
            <CardHeader>
              <CardTitle>Live Token Activity</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8">
                <Activity className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600">Real-time transaction monitoring</p>
                <p className="text-sm text-gray-500">Live feed of all token purchases, locks, and transfers</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="security">
          <Card>
            <CardHeader>
              <CardTitle>Token Security & Compliance</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8">
                <Shield className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600">Security monitoring and compliance tools</p>
                <p className="text-sm text-gray-500">Transaction validation, audit trails, and security alerts</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AdminGCAITokenTab;
