
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Users, Coins, DollarSign, Activity, TrendingUp, Shield } from 'lucide-react';
import { useOptimizedDashboardStats } from '@/hooks/useOptimizedAdminData';

const OptimizedAdminDashboard = () => {
  const { data: stats, isLoading, error } = useOptimizedDashboardStats();

  if (isLoading) {
    return (
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {[...Array(8)].map((_, i) => (
          <Card key={i} className="animate-pulse">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <div className="h-4 bg-gray-200 rounded w-24"></div>
              <div className="h-4 w-4 bg-gray-200 rounded"></div>
            </CardHeader>
            <CardContent>
              <div className="h-8 bg-gray-200 rounded w-16 mb-2"></div>
              <div className="h-3 bg-gray-200 rounded w-32"></div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <Card>
        <CardContent className="pt-6">
          <div className="text-center text-red-600">
            <Shield className="h-8 w-8 mx-auto mb-2" />
            <p>Failed to load dashboard: {error.message}</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!stats) {
    return null;
  }

  const formatNumber = (num: number) => {
    return new Intl.NumberFormat().format(num);
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Optimized Admin Dashboard</h2>
        <div className="flex items-center text-sm text-green-600">
          <TrendingUp className="h-4 w-4 mr-1" />
          Performance Optimized
        </div>
      </div>
      
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {/* Users Stats */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Users</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatNumber(stats.users?.total || 0)}</div>
            <p className="text-xs text-muted-foreground">
              {formatNumber(stats.users?.dealers || 0)} dealers, {formatNumber(stats.users?.verified_dealers || 0)} verified
            </p>
          </CardContent>
        </Card>

        {/* Coins Stats */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Coins</CardTitle>
            <Coins className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatNumber(stats.coins?.total || 0)}</div>
            <p className="text-xs text-muted-foreground">
              {formatNumber(stats.coins?.featured || 0)} featured, {formatNumber(stats.coins?.live_auctions || 0)} live auctions
            </p>
          </CardContent>
        </Card>

        {/* Transactions Stats */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Transactions</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatNumber(stats.transactions?.completed || 0)}</div>
            <p className="text-xs text-muted-foreground">
              {formatCurrency(stats.transactions?.revenue || 0)} total revenue
            </p>
          </CardContent>
        </Card>

        {/* System Health */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">System Health</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatNumber(stats.system?.errors_24h || 0)}</div>
            <p className="text-xs text-muted-foreground">
              errors in 24h, {formatNumber(stats.system?.ai_commands || 0)} AI commands active
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="text-xs text-muted-foreground text-center">
        Last updated: {stats.last_updated ? new Date(stats.last_updated).toLocaleString() : 'Unknown'}
        <span className="ml-2 text-green-600">• Optimized Performance</span>
      </div>
    </div>
  );
};

export default OptimizedAdminDashboard;
