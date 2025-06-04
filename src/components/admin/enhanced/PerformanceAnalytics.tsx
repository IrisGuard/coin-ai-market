import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Activity, TrendingUp, TrendingDown, AlertCircle, CheckCircle2 } from 'lucide-react';

interface PerformanceAnalyticsProps {
  data?: unknown[];
}

const PerformanceAnalytics: React.FC<PerformanceAnalyticsProps> = ({ data = [] }) => {
  // Calculate basic metrics from data
  const totalSources = data.length;
  const activeSources = data.filter((item: unknown) => 
    (item as { status?: string }).status === 'active'
  ).length;
  
  const metrics = [
    {
      title: "Total Sources",
      value: totalSources.toString(),
      change: "0%",
      trend: "stable" as const,
      icon: Activity,
      color: "blue"
    },
    {
      title: "Active Sources", 
      value: activeSources.toString(),
      change: "0%",
      trend: "stable" as const,
      icon: CheckCircle2,
      color: "green"
    },
    {
      title: "Response Rate",
      value: totalSources > 0 ? `${Math.round((activeSources / totalSources) * 100)}%` : "0%",
      change: "0%", 
      trend: "stable" as const,
      icon: TrendingUp,
      color: "purple"
    },
    {
      title: "Error Rate",
      value: totalSources > 0 ? `${Math.round(((totalSources - activeSources) / totalSources) * 100)}%` : "0%",
      change: "0%",
      trend: "stable" as const,
      icon: AlertCircle,
      color: "red"
    }
  ];

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'up':
        return <TrendingUp className="h-4 w-4 text-green-600" />;
      case 'down':
        return <TrendingDown className="h-4 w-4 text-red-600" />;
      default:
        return <div className="h-4 w-4" />;
    }
  };

  const getColorClasses = (color: string) => {
    const colorMap = {
      blue: 'text-blue-600 bg-blue-50',
      green: 'text-green-600 bg-green-50',
      purple: 'text-purple-600 bg-purple-50',
      red: 'text-red-600 bg-red-50',
      orange: 'text-orange-600 bg-orange-50'
    };
    return colorMap[color as keyof typeof colorMap] || 'text-gray-600 bg-gray-50';
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold">Performance Analytics</h3>
        <p className="text-sm text-muted-foreground">
          Real-time monitoring and performance metrics
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {metrics.map((metric, index) => {
          const IconComponent = metric.icon;
          return (
            <Card key={index}>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div className={`p-2 rounded-lg ${getColorClasses(metric.color)}`}>
                    <IconComponent className="h-5 w-5" />
                  </div>
                  {getTrendIcon(metric.trend)}
                </div>
                <div className="mt-4">
                  <div className="text-2xl font-bold">{metric.value}</div>
                  <div className="text-sm text-muted-foreground">{metric.title}</div>
                </div>
                <div className="mt-2 flex items-center gap-1">
                  <Badge variant="outline" className="text-xs">
                    {metric.change}
                  </Badge>
                  <span className="text-xs text-muted-foreground">vs last month</span>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {data.length === 0 && (
        <Card>
          <CardContent className="text-center py-8">
            <div className="text-muted-foreground">
              No performance data available
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default PerformanceAnalytics;
