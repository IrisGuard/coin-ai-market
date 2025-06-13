
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Users, Coins, DollarSign, Activity, TrendingUp, Shield, Zap } from 'lucide-react';
import { useOptimizedDashboardStats, usePerformanceMonitoring } from '@/hooks/useOptimizedAdminData';

interface DashboardStats {
  users?: {
    total?: number;
    dealers?: number;
    verified_dealers?: number;
  };
  coins?: {
    total?: number;
    featured?: number;
    live_auctions?: number;
  };
  transactions?: {
    completed?: number;
    revenue?: number;
  };
  system?: {
    errors_24h?: number;
    ai_commands?: number;
  };
  optimization_metrics?: {
    optimization_status?: string;
    query_time_ms?: number;
    performance_improvement?: string;
    indexes_optimized?: number;
    policies_cleaned?: number;
  };
  last_updated?: string;
}

interface PerformanceData {
  optimization_status?: string;
  query_time_ms?: number;
  performance_improvement?: string;
  indexes_optimized?: number;
  policies_cleaned?: number;
  tested_at?: string;
}

const PerformanceOptimizedDashboard = () => {
  const { data: rawStats, isLoading, error } = useOptimizedDashboardStats();
  const { data: performanceData } = usePerformanceMonitoring();

  if (isLoading) {
    return (
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {[...Array(4)].map((_, i) => (
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
            <p>Failed to load optimized dashboard: {error.message}</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  // Type guard and safe parsing of stats
  const stats: DashboardStats = (() => {
    if (!rawStats) return {};
    if (typeof rawStats === 'object' && rawStats !== null) {
      return rawStats as DashboardStats;
    }
    try {
      return typeof rawStats === 'string' ? JSON.parse(rawStats) : {};
    } catch {
      return {};
    }
  })();

  // Type guard for performance data
  const safePerformanceData: PerformanceData = (() => {
    if (!performanceData) return {};
    if (typeof performanceData === 'object' && performanceData !== null) {
      return performanceData as PerformanceData;
    }
    return {};
  })();

  const formatNumber = (num?: number) => {
    return new Intl.NumberFormat().format(num || 0);
  };

  const formatCurrency = (amount?: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount || 0);
  };

  const getPerformanceColor = (improvement?: string) => {
    switch (improvement) {
      case 'excellent': return 'text-green-600';
      case 'good': return 'text-blue-600';
      default: return 'text-yellow-600';
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Performance Optimized Dashboard</h2>
        <div className="flex items-center gap-2">
          <Zap className="h-4 w-4 text-green-600" />
          <span className="text-sm text-green-600 font-medium">
            Query Time: {stats.optimization_metrics?.query_time_ms?.toFixed(0) || '0'}ms
          </span>
        </div>
      </div>

      {/* Performance Metrics Card */}
      {stats.optimization_metrics && (
        <Card className="border-green-200 bg-green-50">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-green-800">Optimization Status</CardTitle>
            <TrendingUp className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-900">
              {stats.optimization_metrics.optimization_status === 'targeted_complete' ? 'OPTIMIZED' : 'PROCESSING'}
            </div>
            <p className={`text-xs ${getPerformanceColor(stats.optimization_metrics.performance_improvement)}`}>
              Performance: {stats.optimization_metrics.performance_improvement || 'measuring...'} | 
              Indexes: {stats.optimization_metrics.indexes_optimized || 0} optimized | 
              Policies: {stats.optimization_metrics.policies_cleaned || 0} cleaned
            </p>
          </CardContent>
        </Card>
      )}
      
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {/* Users Stats */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Users</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatNumber(stats.users?.total)}</div>
            <p className="text-xs text-muted-foreground">
              {formatNumber(stats.users?.dealers)} dealers, {formatNumber(stats.users?.verified_dealers)} verified
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
            <div className="text-2xl font-bold">{formatNumber(stats.coins?.total)}</div>
            <p className="text-xs text-muted-foreground">
              {formatNumber(stats.coins?.featured)} featured, {formatNumber(stats.coins?.live_auctions)} live auctions
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
            <div className="text-2xl font-bold">{formatNumber(stats.transactions?.completed)}</div>
            <p className="text-xs text-muted-foreground">
              {formatCurrency(stats.transactions?.revenue)} total revenue
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
            <div className="text-2xl font-bold">{formatNumber(stats.system?.errors_24h)}</div>
            <p className="text-xs text-muted-foreground">
              errors in 24h, {formatNumber(stats.system?.ai_commands)} AI commands active
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="text-xs text-muted-foreground text-center">
        Last updated: {stats.last_updated ? new Date(stats.last_updated).toLocaleString() : 'Unknown'}
        <span className="ml-2 text-green-600">• Performance Optimized</span>
        {safePerformanceData.query_time_ms && (
          <span className="ml-2 text-blue-600">
            • Live Monitoring: {safePerformanceData.query_time_ms.toFixed(0)}ms
          </span>
        )}
      </div>
    </div>
  );
};

export default PerformanceOptimizedDashboard;
