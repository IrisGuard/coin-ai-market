
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useTokenInfo } from '@/hooks/useTokenInfo';
import { DollarSign, Coins, TrendingUp, Users, Loader2 } from 'lucide-react';

export const TokenStats = () => {
  const { data: tokenInfo, isLoading, error } = useTokenInfo();

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        {[...Array(4)].map((_, i) => (
          <Card key={i} className="animate-pulse">
            <CardContent className="p-6">
              <div className="flex items-center justify-center h-16">
                <Loader2 className="w-6 h-6 animate-spin text-brand-primary" />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <Card className="col-span-full">
          <CardContent className="p-6 text-center">
            <p className="text-text-secondary">Token data will be available when the crypto token is deployed.</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  const stats = [
    {
      title: 'Current Price',
      value: tokenInfo?.current_price_usd ? `$${tokenInfo.current_price_usd.toFixed(4)}` : 'Not yet deployed',
      icon: DollarSign,
      color: 'text-green-600',
      bgColor: 'bg-green-100'
    },
    {
      title: 'Total Supply',
      value: tokenInfo?.total_supply ? `${tokenInfo.total_supply.toLocaleString()} GCAI` : 'TBD',
      icon: Coins,
      color: 'text-blue-600',
      bgColor: 'bg-blue-100'
    },
    {
      title: 'Circulating Supply',
      value: tokenInfo?.circulating_supply ? `${tokenInfo.circulating_supply.toLocaleString()} GCAI` : '0 GCAI',
      icon: TrendingUp,
      color: 'text-purple-600',
      bgColor: 'bg-purple-100'
    },
    {
      title: 'Market Cap',
      value: tokenInfo?.circulating_supply && tokenInfo?.current_price_usd 
        ? `$${(tokenInfo.circulating_supply * tokenInfo.current_price_usd).toLocaleString()}`
        : 'Not available',
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
