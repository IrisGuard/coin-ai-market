import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart3, TrendingUp, Users, Eye, Search, Activity } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useAnalyticsStats } from '@/hooks/useAnalyticsStats';

const AdminAnalyticsSection = () => {
  const { data: analyticsData, isLoading } = useAnalyticsStats();

  // Icon mapping for dynamic rendering
  const iconMap = {
    'Activity': Activity,
    'Users': Users,
    'Search': Search,
    'TrendingUp': TrendingUp,
    'Eye': Eye,
    'BarChart3': BarChart3
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <Card key={i} className="animate-pulse">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <div className="h-4 bg-gray-200 rounded w-20"></div>
                <div className="h-4 w-4 bg-gray-200 rounded"></div>
              </CardHeader>
              <CardContent>
                <div className="h-8 bg-gray-200 rounded w-16 mb-2"></div>
                <div className="h-3 bg-gray-200 rounded w-24"></div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  const analyticsStats = [
    { 
      label: 'Total Events', 
      value: analyticsData?.totalEvents?.toLocaleString() || '0', 
      icon: Activity, 
      color: 'text-blue-600' 
    },
    { 
      label: 'Active Users', 
      value: analyticsData?.activeUsers?.toLocaleString() || '0', 
      icon: Users, 
      color: 'text-green-600' 
    },
    { 
      label: 'Page Views', 
      value: analyticsData?.pageViews?.toLocaleString() || '0', 
      icon: Eye, 
      color: 'text-purple-600' 
    },
    { 
      label: 'Search Queries', 
      value: analyticsData?.searchQueries?.toLocaleString() || '0', 
      icon: Search, 
      color: 'text-orange-600' 
    }
  ];

  return (
    <div className="space-y-6">
      {/* Analytics Statistics - REAL DATA */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {analyticsStats.map((stat) => {
          const IconComponent = stat.icon;
          return (
            <Card key={stat.label}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">{stat.label}</CardTitle>
                <IconComponent className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className={`text-2xl font-bold ${stat.color}`}>{stat.value}</div>
                <p className="text-xs text-muted-foreground">Real analytics data</p>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Analytics Tables - REAL DATA */}
      <div className="grid gap-4 md:grid-cols-2">
        {analyticsData?.tables?.map((table) => {
          const IconComponent = iconMap[table.icon as keyof typeof iconMap] || Activity;
          return (
            <Card key={table.name} className="hover:shadow-md transition-shadow">
              <CardHeader className="pb-3">
                <div className="flex items-center gap-2">
                  <IconComponent className="h-5 w-5 text-indigo-600" />
                  <CardTitle className="text-lg">{table.name}</CardTitle>
                  <Badge variant="secondary" className="bg-indigo-100 text-indigo-800">
                    {table.status}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-3">{table.description}</p>
                
                <div className="flex justify-between items-center mb-3">
                  <div className="text-sm">
                    <span className="font-medium text-lg text-indigo-600">
                      {table.records.toLocaleString()}
                    </span> records
                  </div>
                  <div className="text-sm font-medium text-green-600">
                    {table.growth} growth
                  </div>
                </div>

                <div className="flex gap-2">
                  <Button variant="outline" size="sm" className="flex-1">
                    View Analytics
                  </Button>
                  <Button variant="outline" size="sm" className="flex-1">
                    Export
                  </Button>
                </div>
              </CardContent>
            </Card>
          );
        }) || []}
      </div>

      {/* Top Analytics Insights - REAL DATA */}
      <Card>
        <CardHeader>
          <CardTitle>Real-Time Analytics Insights</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {analyticsData?.insights?.map((insight, index) => (
              <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                <div className="flex items-center gap-3">
                  <TrendingUp className={`h-4 w-4 ${
                    insight.trend > 0 ? 'text-green-500' : 
                    insight.trend < 0 ? 'text-red-500' : 'text-blue-500'
                  }`} />
                  <div>
                    <p className="font-medium">{insight.insight}</p>
                    <p className="text-sm text-muted-foreground">{insight.description}</p>
                  </div>
                </div>
                <div className={`text-sm font-medium ${
                  insight.trend > 0 ? 'text-green-600' : 
                  insight.trend < 0 ? 'text-red-600' : 'text-blue-600'
                }`}>
                  {insight.metric}
                </div>
              </div>
            )) || []}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminAnalyticsSection;
