
import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { BarChart3, Users, Coins, TrendingUp, Activity, Monitor, Zap } from 'lucide-react';
import AdvancedAnalyticsDashboard from '../enhanced/AdvancedAnalyticsDashboard';
import PerformanceAnalytics from '../enhanced/PerformanceAnalytics';

const AdminAnalyticsTab = () => {
  // Basic analytics without charts
  const basicStats = [
    {
      title: "Total Users",
      value: "1,247",
      icon: Users,
      color: "blue",
      change: "+12%"
    },
    {
      title: "Total Coins",
      value: "8,943", 
      icon: Coins,
      color: "green",
      change: "+8%"
    },
    {
      title: "Active Sources",
      value: "24",
      icon: Activity,
      color: "purple", 
      change: "+3%"
    },
    {
      title: "Data Quality",
      value: "94.2%",
      icon: BarChart3,
      color: "orange",
      change: "+2%"
    }
  ];

  const getColorClasses = (color: string) => {
    const colorMap = {
      blue: 'text-blue-600 bg-blue-50',
      green: 'text-green-600 bg-green-50',
      purple: 'text-purple-600 bg-purple-50',
      orange: 'text-orange-600 bg-orange-50'
    };
    return colorMap[color as keyof typeof colorMap] || 'text-gray-600 bg-gray-50';
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold">Advanced Analytics Dashboard</h3>
        <p className="text-sm text-muted-foreground">
          Comprehensive performance metrics, real-time monitoring, and system insights
        </p>
      </div>

      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview" className="flex items-center gap-2">
            <BarChart3 className="w-4 h-4" />
            Overview
          </TabsTrigger>
          <TabsTrigger value="real-time" className="flex items-center gap-2">
            <Monitor className="w-4 h-4" />
            Real-time
          </TabsTrigger>
          <TabsTrigger value="performance" className="flex items-center gap-2">
            <Zap className="w-4 h-4" />
            Performance
          </TabsTrigger>
          <TabsTrigger value="insights" className="flex items-center gap-2">
            <TrendingUp className="w-4 h-4" />
            Insights
          </TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {basicStats.map((stat, index) => {
              const IconComponent = stat.icon;
              return (
                <Card key={index}>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div className={`p-2 rounded-lg ${getColorClasses(stat.color)}`}>
                        <IconComponent className="h-5 w-5" />
                      </div>
                      <TrendingUp className="h-4 w-4 text-green-600" />
                    </div>
                    <div className="mt-4">
                      <div className="text-2xl font-bold">{stat.value}</div>
                      <div className="text-sm text-muted-foreground">{stat.title}</div>
                    </div>
                    <div className="mt-2">
                      <Badge variant="outline" className="text-xs">
                        {stat.change} vs last month
                      </Badge>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          {/* Placeholder for future charts */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>User Activity Trends</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-64 flex items-center justify-center text-muted-foreground">
                  Chart integration coming soon
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Data Source Performance</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-64 flex items-center justify-center text-muted-foreground">
                  Chart integration coming soon
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="real-time">
          <AdvancedAnalyticsDashboard />
        </TabsContent>

        <TabsContent value="performance">
          <PerformanceAnalytics />
        </TabsContent>

        <TabsContent value="insights" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>AI-Powered Insights</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                  <h4 className="font-medium text-blue-800 mb-2">Performance Optimization</h4>
                  <p className="text-sm text-blue-700">
                    System performance has improved by 23% this month. Database optimization 
                    contributed to 65% of this improvement.
                  </p>
                </div>

                <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                  <h4 className="font-medium text-green-800 mb-2">User Engagement</h4>
                  <p className="text-sm text-green-700">
                    User session duration increased by 18%. The new AI-powered search features 
                    are driving higher engagement rates.
                  </p>
                </div>

                <div className="p-4 bg-purple-50 border border-purple-200 rounded-lg">
                  <h4 className="font-medium text-purple-800 mb-2">Data Quality</h4>
                  <p className="text-sm text-purple-700">
                    Data accuracy has reached 94.2%. Automated validation processes have 
                    reduced manual intervention by 40%.
                  </p>
                </div>

                <div className="p-4 bg-orange-50 border border-orange-200 rounded-lg">
                  <h4 className="font-medium text-orange-800 mb-2">Resource Utilization</h4>
                  <p className="text-sm text-orange-700">
                    Server resources are optimally utilized. Consider scaling up during 
                    peak hours (12-4 PM) for better performance.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AdminAnalyticsTab;
