
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { TrendingUp, TrendingDown, AlertTriangle, Bug } from 'lucide-react';
import { useErrorAnalytics } from '@/hooks/admin/useErrorAnalytics';

const ErrorTrendAnalytics = () => {
  const { data: analytics, isLoading } = useErrorAnalytics();

  if (isLoading) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center h-64">
          <div className="animate-spin h-8 w-8 border-b-2 border-purple-600"></div>
        </CardContent>
      </Card>
    );
  }

  const getTrendIcon = (change: number) => {
    if (change > 0) return <TrendingUp className="w-4 h-4 text-red-500" />;
    if (change < 0) return <TrendingDown className="w-4 h-4 text-green-500" />;
    return <div className="w-4 h-4 bg-gray-300 rounded-full" />;
  };

  const getTrendColor = (change: number) => {
    if (change > 0) return 'text-red-600';
    if (change < 0) return 'text-green-600';
    return 'text-gray-600';
  };

  return (
    <div className="space-y-6">
      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Errors (30d)</CardTitle>
            <Bug className="h-4 w-4 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{analytics?.totalErrors || 0}</div>
            <div className="flex items-center mt-2">
              {getTrendIcon(analytics?.errorTrends.percentageChange || 0)}
              <span className={`text-xs ml-1 ${getTrendColor(analytics?.errorTrends.percentageChange || 0)}`}>
                {Math.abs(analytics?.errorTrends.percentageChange || 0).toFixed(1)}% from last week
              </span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">This Week</CardTitle>
            <AlertTriangle className="h-4 w-4 text-orange-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{analytics?.errorTrends.thisWeek || 0}</div>
            <p className="text-xs text-muted-foreground">
              vs {analytics?.errorTrends.lastWeek || 0} last week
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Error Types</CardTitle>
            <div className="w-4 h-4 bg-blue-600 rounded" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{analytics?.errorsByType.length || 0}</div>
            <p className="text-xs text-muted-foreground">
              Different error categories
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Error Types Breakdown */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Bug className="w-5 h-5" />
            Error Types Breakdown
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {analytics?.errorsByType.slice(0, 10).map((errorType, index) => (
              <div key={errorType.type} className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 rounded-full bg-red-500" />
                  <span className="text-sm font-medium">{errorType.type}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant="outline">{errorType.count}</Badge>
                  <div className="w-20 h-2 bg-gray-200 rounded-full">
                    <div 
                      className="h-full bg-red-500 rounded-full"
                      style={{ 
                        width: `${(errorType.count / (analytics?.totalErrors || 1)) * 100}%` 
                      }}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Top Error Pages */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertTriangle className="w-5 h-5" />
            Most Problematic Pages
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {analytics?.topErrorPages.slice(0, 5).map((page, index) => (
              <div key={page.page} className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold text-white ${
                    index === 0 ? 'bg-red-500' : 
                    index === 1 ? 'bg-orange-500' : 
                    index === 2 ? 'bg-yellow-500' : 'bg-gray-500'
                  }`}>
                    {index + 1}
                  </div>
                  <span className="text-sm font-mono truncate max-w-xs">{page.page}</span>
                </div>
                <Badge variant="destructive">{page.count} errors</Badge>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ErrorTrendAnalytics;
