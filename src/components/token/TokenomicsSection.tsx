
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Legend } from 'recharts';
import { useTokenInfo } from '@/hooks/useTokenInfo';

const COLORS = ['#007AFF', '#5856D6', '#34C759', '#FF9500', '#FF3B30'];

export const TokenomicsSection = () => {
  const { data: tokenInfo } = useTokenInfo();

  const pieData = [
    { name: 'Public Sale', value: 40, amount: 400000000 },
    { name: 'Team & Advisors', value: 20, amount: 200000000 },
    { name: 'Development', value: 15, amount: 150000000 },
    { name: 'Marketing', value: 15, amount: 150000000 },
    { name: 'Liquidity', value: 10, amount: 100000000 },
  ];

  const lockingData = [
    { period: '3M', apy: 15, locked: 50000000 },
    { period: '6M', apy: 25, locked: 75000000 },
    { period: '12M', apy: 40, locked: 120000000 },
    { period: '18M', apy: 55, locked: 85000000 },
    { period: '24M', apy: 70, locked: 60000000 },
    { period: '36M', apy: 100, locked: 45000000 },
  ];

  return (
    <section className="py-16 px-4 bg-bg-secondary">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-text-primary mb-4">
            GCAI Tokenomics
          </h2>
          <p className="text-xl text-text-secondary">
            Transparent token distribution and locking statistics
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
          {/* Token Distribution Pie Chart */}
          <Card>
            <CardHeader>
              <CardTitle>Token Distribution</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={pieData}
                    cx="50%"
                    cy="50%"
                    outerRadius={100}
                    dataKey="value"
                    label={({ name, value }) => `${name}: ${value}%`}
                  >
                    {pieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Locking Statistics */}
          <Card>
            <CardHeader>
              <CardTitle>Locking Statistics</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={lockingData}>
                  <XAxis dataKey="period" />
                  <YAxis />
                  <Bar dataKey="locked" fill="#007AFF" />
                  <Legend />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>

        {/* Token Details */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card>
            <CardContent className="p-6 text-center">
              <div className="text-2xl font-bold text-text-primary">
                {tokenInfo?.total_supply?.toLocaleString() || '1,000,000,000'}
              </div>
              <div className="text-text-secondary">Total Supply</div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6 text-center">
              <div className="text-2xl font-bold text-text-primary">
                {tokenInfo?.circulating_supply?.toLocaleString() || '250,000,000'}
              </div>
              <div className="text-text-secondary">Circulating</div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6 text-center">
              <div className="text-2xl font-bold text-text-primary">
                435,000,000
              </div>
              <div className="text-text-secondary">Total Locked</div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6 text-center">
              <div className="text-2xl font-bold text-text-primary">
                ${((tokenInfo?.circulating_supply || 250000000) * (tokenInfo?.current_price_usd || 0.1)).toLocaleString()}
              </div>
              <div className="text-text-secondary">Market Cap</div>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
};
