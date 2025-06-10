
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { Users, Smartphone, Monitor, Tablet, TrendingUp, TrendingDown } from 'lucide-react';
import { useUserBehaviorAnalytics } from '@/hooks/admin/useUserBehaviorAnalytics';

const UserBehaviorDashboard = () => {
  const { data: behaviorData, isLoading } = useUserBehaviorAnalytics();

  const deviceColors = ['#8884d8', '#82ca9d', '#ffc658'];

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'up': return <TrendingUp className="w-4 h-4 text-green-500" />;
      case 'down': return <TrendingDown className="w-4 h-4 text-red-500" />;
      default: return <div className="w-4 h-4 bg-gray-400 rounded-full" />;
    }
  };

  const getDeviceIcon = (device: string) => {
    switch (device.toLowerCase()) {
      case 'desktop': return <Monitor className="w-4 h-4" />;
      case 'mobile': return <Smartphone className="w-4 h-4" />;
      case 'tablet': return <Tablet className="w-4 h-4" />;
      default: return <Monitor className="w-4 h-4" />;
    }
  };

  if (isLoading) {
    return (
      <Card>
        <CardContent className="text-center py-12">
          <div className="animate-spin h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p>Loading user behavior analytics...</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* User Journey Funnel */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="w-5 h-5" />
            User Journey Conversion Funnel
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {behaviorData?.userJourney.map((step, index) => (
              <div key={step.step} className="flex items-center gap-4">
                <div className="w-24 text-sm font-medium">{step.step}</div>
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm">{step.users.toLocaleString()} users</span>
                    <span className="text-sm font-medium">{step.conversionRate.toFixed(1)}%</span>
                  </div>
                  <Progress value={step.conversionRate} className="h-2" />
                </div>
                {index > 0 && (
                  <Badge variant="outline" className="text-xs">
                    -{(100 - step.conversionRate).toFixed(1)}% drop
                  </Badge>
                )}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Device Analytics & Engagement Metrics */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Device Usage Distribution</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64 mb-4">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={behaviorData?.deviceAnalytics}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ device, percentage }) => `${device} ${percentage}%`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="users"
                  >
                    {behaviorData?.deviceAnalytics.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={deviceColors[index % deviceColors.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="space-y-2">
              {behaviorData?.deviceAnalytics.map((device, index) => (
                <div key={device.device} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    {getDeviceIcon(device.device)}
                    <span className="text-sm">{device.device}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium">{device.users}</span>
                    <Badge variant="outline">{device.percentage}%</Badge>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Engagement Metrics</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              <div>
                <div className="flex justify-between mb-2">
                  <span className="text-sm font-medium">Average Session Duration</span>
                  <span className="text-lg font-bold text-blue-600">
                    {behaviorData?.engagementMetrics.avgSessionDuration.toFixed(1)}m
                  </span>
                </div>
                <Progress 
                  value={(behaviorData?.engagementMetrics.avgSessionDuration || 0) * 10} 
                  className="h-2" 
                />
              </div>

              <div>
                <div className="flex justify-between mb-2">
                  <span className="text-sm font-medium">Bounce Rate</span>
                  <span className="text-lg font-bold text-red-600">
                    {behaviorData?.engagementMetrics.bounceRate.toFixed(1)}%
                  </span>
                </div>
                <Progress 
                  value={behaviorData?.engagementMetrics.bounceRate || 0} 
                  className="h-2" 
                />
              </div>

              <div>
                <div className="flex justify-between mb-2">
                  <span className="text-sm font-medium">Pages per Session</span>
                  <span className="text-lg font-bold text-green-600">
                    {behaviorData?.engagementMetrics.pagesPerSession.toFixed(1)}
                  </span>
                </div>
                <Progress 
                  value={(behaviorData?.engagementMetrics.pagesPerSession || 0) * 20} 
                  className="h-2" 
                />
              </div>

              <div>
                <div className="flex justify-between mb-2">
                  <span className="text-sm font-medium">Return User Rate</span>
                  <span className="text-lg font-bold text-purple-600">
                    {behaviorData?.engagementMetrics.returnUserRate.toFixed(1)}%
                  </span>
                </div>
                <Progress 
                  value={behaviorData?.engagementMetrics.returnUserRate || 0} 
                  className="h-2" 
                />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Top User Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Top User Actions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={behaviorData?.topActions}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="action" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="count" fill="#8884d8" />
              </BarChart>
            </ResponsiveContainer>
          </div>
          <div className="mt-4 space-y-2">
            {behaviorData?.topActions.map((action, index) => (
              <div key={action.action} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium">{action.action}</span>
                  {getTrendIcon(action.trend)}
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-sm">{action.count.toLocaleString()}</span>
                  <Badge variant="outline" className="text-xs">
                    {action.trend}
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default UserBehaviorDashboard;
