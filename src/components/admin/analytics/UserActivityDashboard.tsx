import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  Users, 
  UserPlus, 
  Activity, 
  Clock, 
  TrendingUp,
  TrendingDown,
  Globe,
  Smartphone,
  Monitor,
  Tablet,
  Download
} from 'lucide-react';
import { useUserActivityAnalytics } from '@/hooks/useUserActivityAnalytics';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell } from 'recharts';

const UserActivityDashboard = () => {
  const [timeframe, setTimeframe] = useState<'7d' | '30d' | '90d'>('30d');
  const { data: activityData, isLoading } = useUserActivityAnalytics(timeframe);

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8'];

  if (isLoading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="text-center">Loading user activity analytics...</div>
        </CardContent>
      </Card>
    );
  }

  if (!activityData) return null;

  const getDeviceIcon = (device: string) => {
    switch (device.toLowerCase()) {
      case 'desktop': return <Monitor className="h-4 w-4" />;
      case 'mobile': return <Smartphone className="h-4 w-4" />;
      case 'tablet': return <Tablet className="h-4 w-4" />;
      default: return <Monitor className="h-4 w-4" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">User Activity Analytics</h2>
          <p className="text-muted-foreground">Detailed insights into user behavior and engagement</p>
        </div>
        <div className="flex items-center gap-3">
          <Select value={timeframe} onValueChange={(value: '7d' | '30d' | '90d') => setTimeframe(value)}>
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="7d">Last 7 days</SelectItem>
              <SelectItem value="30d">Last 30 days</SelectItem>
              <SelectItem value="90d">Last 90 days</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline">
            <Download className="h-4 w-4 mr-2" />
            Export Report
          </Button>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Users className="h-5 w-5 text-blue-600" />
                <span className="text-sm font-medium">Total Users</span>
              </div>
            </div>
            <div className="mt-2">
              <div className="text-2xl font-bold">{activityData.totalUsers.toLocaleString()}</div>
              <p className="text-xs text-muted-foreground">Registered users</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Activity className="h-5 w-5 text-green-600" />
                <span className="text-sm font-medium">Active Users</span>
              </div>
              <Badge className={activityData.userGrowthRate >= 0 ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}>
                {activityData.userGrowthRate >= 0 ? <TrendingUp className="h-3 w-3 mr-1" /> : <TrendingDown className="h-3 w-3 mr-1" />}
                {Math.abs(activityData.userGrowthRate).toFixed(1)}%
              </Badge>
            </div>
            <div className="mt-2">
              <div className="text-2xl font-bold">{activityData.activeUsers.toLocaleString()}</div>
              <p className="text-xs text-muted-foreground">In selected period</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-2 mb-2">
              <UserPlus className="h-5 w-5 text-purple-600" />
              <span className="text-sm font-medium">New Users</span>
            </div>
            <div className="text-2xl font-bold">{activityData.newUsers.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">In selected period</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-2 mb-2">
              <Clock className="h-5 w-5 text-orange-600" />
              <span className="text-sm font-medium">Avg Session</span>
            </div>
            <div className="text-2xl font-bold">{Math.floor(activityData.averageSessionDuration / 60)}m {activityData.averageSessionDuration % 60}s</div>
            <p className="text-xs text-muted-foreground">Duration</p>
          </CardContent>
        </Card>
      </div>

      {/* Engagement Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-2 mb-2">
              <Activity className="h-5 w-5 text-blue-600" />
              <span className="text-sm font-medium">Pages per Session</span>
            </div>
            <div className="text-2xl font-bold">{activityData.pageViewsPerSession.toFixed(1)}</div>
            <p className="text-xs text-muted-foreground">Average</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-2 mb-2">
              <TrendingDown className="h-5 w-5 text-red-600" />
              <span className="text-sm font-medium">Bounce Rate</span>
            </div>
            <div className="text-2xl font-bold">{activityData.bounceRate.toFixed(1)}%</div>
            <p className="text-xs text-muted-foreground">Single page visits</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-2 mb-2">
              <TrendingUp className="h-5 w-5 text-green-600" />
              <span className="text-sm font-medium">Retention Rate</span>
            </div>
            <div className="text-2xl font-bold">{activityData.retentionRate.toFixed(1)}%</div>
            <p className="text-xs text-muted-foreground">Returning users</p>
          </CardContent>
        </Card>
      </div>

      {/* Detailed Analytics */}
      <Tabs defaultValue="engagement" className="space-y-6">
        <TabsList>
          <TabsTrigger value="engagement">User Engagement</TabsTrigger>
          <TabsTrigger value="pages">Top Pages</TabsTrigger>
          <TabsTrigger value="devices">Devices</TabsTrigger>
          <TabsTrigger value="geography">Geography</TabsTrigger>
        </TabsList>

        <TabsContent value="engagement" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Daily User Engagement</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={activityData.userEngagement}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip />
                  <Line type="monotone" dataKey="activeUsers" stroke="#8884d8" name="Active Users" />
                  <Line type="monotone" dataKey="newUsers" stroke="#82ca9d" name="New Users" />
                  <Line type="monotone" dataKey="returnUsers" stroke="#ffc658" name="Returning Users" />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="pages" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Most Popular Pages</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {activityData.topPages.map((page, index) => (
                  <div key={page.page} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center gap-3">
                      <Badge className="w-6 h-6 rounded-full flex items-center justify-center text-xs">
                        {index + 1}
                      </Badge>
                      <div>
                        <div className="font-medium">{page.page}</div>
                        <div className="text-sm text-muted-foreground">{page.uniqueVisitors} unique visitors</div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-bold">{page.views.toLocaleString()}</div>
                      <div className="text-sm text-muted-foreground">Page views</div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="devices" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Device Distribution</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={activityData.deviceStats}
                      cx="50%"
                      cy="50%"
                      outerRadius={100}
                      fill="#8884d8"
                      dataKey="users"
                      label={({ device, percentage }) => `${device}: ${percentage}%`}
                    >
                      {activityData.deviceStats.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value) => [Number(value).toLocaleString(), 'Users']} />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Device Breakdown</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {activityData.deviceStats.map((device, index) => (
                    <div key={device.device} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-center gap-3">
                        {getDeviceIcon(device.device)}
                        <div>
                          <div className="font-medium">{device.device}</div>
                          <div className="text-sm text-muted-foreground">{device.percentage}% of users</div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="font-bold">{device.users.toLocaleString()}</div>
                        <div className="text-sm text-muted-foreground">Users</div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="geography" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Globe className="h-5 w-5" />
                Geographic Distribution
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {activityData.geographicData.map((country, index) => (
                  <div key={country.country} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">{country.country}</span>
                      <span className="text-sm font-bold">{country.users.toLocaleString()} users</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className="h-2 rounded-full" 
                        style={{ 
                          width: `${country.percentage}%`,
                          backgroundColor: COLORS[index % COLORS.length]
                        }}
                      />
                    </div>
                    <div className="text-xs text-muted-foreground">{country.percentage}% of total users</div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default UserActivityDashboard;