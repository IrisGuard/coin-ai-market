
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useTokenInfo } from '@/hooks/useTokenInfo';
import { DollarSign, Coins, TrendingUp, Users } from 'lucide-react';

export const TokenStats = () => {
  const { data: tokenInfo, isLoading } = useTokenInfo();

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        {[...Array(4)].map((_, i) => (
          <Card key={i} className="animate-pulse">
            <CardContent className="p-6">
              <div className="h-16 bg-gray-200 rounded"></div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  const stats = [
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
      title: 'Market Cap',
      value: `$${((tokenInfo?.circulating_supply || 250000000) * (tokenInfo?.current_price_usd || 0.1)).toLocaleString()}`,
      icon: Users,
      color: 'text-orange-600',
      bgColor: 'bg-orange-100'
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
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
  );
};
