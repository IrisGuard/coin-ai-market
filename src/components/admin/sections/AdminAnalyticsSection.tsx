
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart3, TrendingUp, Users, Eye, Search, Activity } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

const AdminAnalyticsSection = () => {
  const analyticsTables = [
    {
      name: 'analytics_events',
      description: 'User interaction and system events',
      records: '125,678',
      status: 'active',
      icon: Activity,
      growth: '+12%'
    },
    {
      name: 'user_analytics',
      description: 'User behavior and engagement metrics',
      records: '45,234',
      status: 'active',
      icon: Users,
      growth: '+8%'
    },
    {
      name: 'search_analytics',
      description: 'Search queries and result analytics',
      records: '23,456',
      status: 'active',
      icon: Search,
      growth: '+15%'
    },
    {
      name: 'market_analytics',
      description: 'Market trends and pricing data',
      records: '12,345',
      status: 'active',
      icon: TrendingUp,
      growth: '+22%'
    },
    {
      name: 'page_views',
      description: 'Page view tracking and statistics',
      records: '89,123',
      status: 'active',
      icon: Eye,
      growth: '+5%'
    },
    {
      name: 'performance_metrics',
      description: 'System performance monitoring',
      records: '67,890',
      status: 'active',
      icon: BarChart3,
      growth: '+3%'
    }
  ];

  const analyticsStats = [
    { label: 'Total Events', value: '363,726', icon: Activity, color: 'text-blue-600' },
    { label: 'Active Users', value: '2,347', icon: Users, color: 'text-green-600' },
    { label: 'Page Views', value: '89,123', icon: Eye, color: 'text-purple-600' },
    { label: 'Search Queries', value: '23,456', icon: Search, color: 'text-orange-600' }
  ];

  return (
    <div className="space-y-6">
      {/* Analytics Statistics */}
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
                <p className="text-xs text-muted-foreground">Analytics data</p>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Analytics Tables */}
      <div className="grid gap-4 md:grid-cols-2">
        {analyticsTables.map((table) => {
          const IconComponent = table.icon;
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
                    <span className="font-medium">{table.records}</span> records
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
        })}
      </div>

      {/* Top Analytics Insights */}
      <Card>
        <CardHeader>
          <CardTitle>Top Analytics Insights</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {[
              {
                insight: 'Peak Usage Hours',
                description: 'Highest activity between 2PM-4PM EST',
                metric: '45% increase',
                trend: 'up'
              },
              {
                insight: 'Popular Search Terms',
                description: 'Morgan Silver Dollar searches up 23%',
                metric: '23% growth',
                trend: 'up'
              },
              {
                insight: 'User Engagement',
                description: 'Average session time increased to 8.5 minutes',
                metric: '+2.3 min',
                trend: 'up'
              },
              {
                insight: 'Mobile Traffic',
                description: 'Mobile users now represent 67% of traffic',
                metric: '67% mobile',
                trend: 'stable'
              }
            ].map((insight, index) => (
              <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                <div className="flex items-center gap-3">
                  <TrendingUp className={`h-4 w-4 ${
                    insight.trend === 'up' ? 'text-green-500' : 'text-blue-500'
                  }`} />
                  <div>
                    <p className="font-medium">{insight.insight}</p>
                    <p className="text-sm text-muted-foreground">{insight.description}</p>
                  </div>
                </div>
                <div className="text-sm font-medium text-green-600">
                  {insight.metric}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminAnalyticsSection;
