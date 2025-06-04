import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { BarChart3, Users, Coins, TrendingUp, Activity } from 'lucide-react';

const AdminAnalyticsTab = () => {
  // Basic analytics without charts
  const basicStats = [
    {
      title: "Total Users",
      value: "0",
      icon: Users,
      color: "blue",
      change: "+0%"
    },
    {
      title: "Total Coins",
      value: "0", 
      icon: Coins,
      color: "green",
      change: "+0%"
    },
    {
      title: "Active Sources",
      value: "0",
      icon: Activity,
      color: "purple", 
      change: "+0%"
    },
    {
      title: "Data Quality",
      value: "0%",
      icon: BarChart3,
      color: "orange",
      change: "+0%"
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
        <h3 className="text-lg font-semibold">Analytics Dashboard</h3>
        <p className="text-sm text-muted-foreground">
          Key performance metrics and system insights
        </p>
      </div>

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
    </div>
  );
};

export default AdminAnalyticsTab;
