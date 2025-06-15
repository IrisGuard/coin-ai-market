
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Legend, Tooltip } from 'recharts';
import { useTokenInfo } from '@/hooks/useTokenInfo';
import { useTokenLocks } from '@/hooks/useTokenLocks';
import { Loader2 } from 'lucide-react';

const COLORS = ['#007AFF', '#5856D6', '#34C759', '#FF9500', '#FF3B30'];

export const TokenomicsSection = () => {
  const { data: tokenInfo, isLoading: tokenLoading } = useTokenInfo();
  const { data: tokenLocks, isLoading: locksLoading } = useTokenLocks();

  const isLoading = tokenLoading || locksLoading;

  // Calculate real distribution data when token exists
  const getDistributionData = () => {
    if (!tokenInfo?.total_supply) {
      return [
        { name: 'Public Sale', value: 40, amount: 'TBD' },
        { name: 'Team & Advisors', value: 20, amount: 'TBD' },
        { name: 'Development', value: 15, amount: 'TBD' },
        { name: 'Marketing', value: 15, amount: 'TBD' },
        { name: 'Liquidity', value: 10, amount: 'TBD' },
      ];
    }

    const totalSupply = tokenInfo.total_supply;
    return [
      { name: 'Public Sale', value: 40, amount: (totalSupply * 0.4).toLocaleString() },
      { name: 'Team & Advisors', value: 20, amount: (totalSupply * 0.2).toLocaleString() },
      { name: 'Development', value: 15, amount: (totalSupply * 0.15).toLocaleString() },
      { name: 'Marketing', value: 15, amount: (totalSupply * 0.15).toLocaleString() },
      { name: 'Liquidity', value: 10, amount: (totalSupply * 0.1).toLocaleString() },
    ];
  };

  // Calculate real locking data from actual locks
  const getLockingData = () => {
    const lockPeriods = [
      { period: '3M', apy: 15, periodMonths: 3 },
      { period: '6M', apy: 25, periodMonths: 6 },
      { period: '12M', apy: 40, periodMonths: 12 },
      { period: '18M', apy: 55, periodMonths: 18 },
      { period: '24M', apy: 70, periodMonths: 24 },
      { period: '36M', apy: 100, periodMonths: 36 },
    ];

    return lockPeriods.map(period => {
      let lockedAmount = 0;
      
      if (tokenLocks && Array.isArray(tokenLocks)) {
        lockedAmount = tokenLocks
          .filter(lock => {
            // Safely access duration_months property
            const duration = lock?.duration_months || (lock as any)?.lock_options?.duration_months;
            return duration === period.periodMonths;
          })
          .reduce((sum, lock) => sum + (Number(lock?.amount) || 0), 0);
      }

      return {
        ...period,
        locked: lockedAmount
      };
    });
  };

  const pieData = getDistributionData();
  const lockingData = getLockingData();

  if (isLoading) {
    return (
      <section className="py-16 px-4 bg-bg-secondary">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-text-primary mb-4">
              GCAI Tokenomics
            </h2>
            <div className="flex justify-center">
              <Loader2 className="w-8 h-8 animate-spin text-brand-primary" />
            </div>
          </div>
        </div>
      </section>
    );
  }

  const totalLocked = tokenLocks?.reduce((sum, lock) => sum + (Number(lock?.amount) || 0), 0) || 0;

  return (
    <section className="py-16 px-4 bg-bg-secondary">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-text-primary mb-4">
            GCAI Tokenomics
          </h2>
          <p className="text-xl text-text-secondary">
            {tokenInfo ? "Live token distribution and locking statistics" : "Planned token distribution and locking rewards"}
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
                  <Tooltip formatter={(value, name) => [
                    `${value}%`, 
                    `${name}: ${pieData.find(d => d.name === name)?.amount} GCAI`
                  ]} />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Locking APY Chart */}
          <Card>
            <CardHeader>
              <CardTitle>Lock Duration Rewards & Current Locks</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={lockingData}>
                  <XAxis dataKey="period" />
                  <YAxis />
                  <Tooltip formatter={(value, name) => [
                    name === 'apy' ? `${value}%` : `${value} GCAI`,
                    name === 'apy' ? 'Reward %' : 'Currently Locked'
                  ]} />
                  <Bar dataKey="apy" fill="#007AFF" name="apy" />
                  <Bar dataKey="locked" fill="#34C759" name="locked" />
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
                {tokenInfo?.total_supply?.toLocaleString() || 'TBD'}
              </div>
              <div className="text-text-secondary">Total Supply</div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6 text-center">
              <div className="text-2xl font-bold text-text-primary">
                {tokenInfo?.circulating_supply?.toLocaleString() || '0'}
              </div>
              <div className="text-text-secondary">Circulating</div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6 text-center">
              <div className="text-2xl font-bold text-text-primary">
                {totalLocked.toLocaleString()}
              </div>
              <div className="text-text-secondary">Total Locked</div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6 text-center">
              <div className="text-2xl font-bold text-text-primary">
                {tokenInfo?.circulating_supply && tokenInfo?.current_price_usd 
                  ? `$${(tokenInfo.circulating_supply * tokenInfo.current_price_usd).toLocaleString()}`
                  : 'Not Available'}
              </div>
              <div className="text-text-secondary">Market Cap</div>
            </CardContent>
          </Card>
        </div>

        {!tokenInfo && (
          <div className="mt-8 p-4 bg-brand-warning/10 border border-brand-warning/20 rounded-lg text-center">
            <p className="text-brand-warning font-semibold">
              Live tokenomics data will be available when the GCAI token is deployed.
            </p>
          </div>
        )}
      </div>
    </section>
  );
};
