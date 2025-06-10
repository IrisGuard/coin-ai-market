
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  TrendingUp, Users, Search, DollarSign, 
  Activity, AlertTriangle, BarChart3, Map
} from 'lucide-react';
import { useAdvancedAnalyticsDashboard, useUserAnalytics, useMarketAnalytics, useRevenueForecasts } from '@/hooks/admin/useAdvancedAnalytics';
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, BarChart, Bar, PieChart, Pie, Cell } from 'recharts';

interface DashboardData {
  active_users_24h: number;
  searches_24h: number;
  revenue_24h: number;
  avg_session_time: number;
  new_listings_24h: number;
  avg_data_quality: number;
}

const AdvancedAnalyticsDashboard = () => {
  const { data: dashboardData, isLoading: dashboardLoading } = useAdvancedAnalyticsDashboard();
  const { data: userAnalytics } = useUserAnalytics();
  const { data: marketAnalytics } = useMarketAnalytics();
  const { data: revenueForecasts } = useRevenueForecasts();

  // Safely type cast the dashboard data
  const typedDashboardData = (dashboardData as unknown) as DashboardData;

  const dashboardMetrics = [
    {
      title: 'Active Users (24h)',
      value: typedDashboardData?.active_users_24h || 0,
      icon: Users,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50'
    },
    {
      title: 'Searches (24h)',
      value: typedDashboardData?.searches_24h || 0,
      icon: Search,
      color: 'text-green-600',
      bgColor: 'bg-green-50'
    },
    {
      title: 'Revenue (24h)',
      value: `$${(typedDashboardData?.revenue_24h || 0).toLocaleString()}`,
      icon: DollarSign,
      color: 'text-purple-600',
      bgColor: 'bg-purple-50'
    },
    {
      title: 'Avg Session Time',
      value: `${Math.round(typedDashboardData?.avg_session_time || 0)}m`,
      icon: Activity,
      color: 'text-orange-600',
      bgColor: 'bg-orange-50'
    },
    {
      title: 'New Listings (24h)',
      value: typedDashboardData?.new_listings_24h || 0,
      icon: TrendingUp,
      color: 'text-teal-600',
      bgColor: 'bg-teal-50'
    },
    {
      title: 'Data Quality Score',
      value: `${Math.round((typedDashboardData?.avg_data_quality || 0) * 100)}%`,
      icon: BarChart3,
      color: 'text-indigo-600',
      bgColor: 'bg-indigo-50'
    }
  ];

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8', '#82CA9D'];

  if (dashboardLoading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="text-center">Loading advanced analytics...</div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Dashboard Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {dashboardMetrics.map((metric, index) => {
          const Icon = metric.icon;
          return (
            <Card key={index}>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">{metric.title}</p>
                    <p className="text-2xl font-bold text-gray-900">{metric.value}</p>
                  </div>
                  <div className={`p-3 rounded-lg ${metric.bgColor}`}>
                    <Icon className={`w-6 h-6 ${metric.color}`} />
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Advanced Analytics Tabs */}
      <Tabs defaultValue="user-behavior" className="space-y-4">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="user-behavior">User Behavior</TabsTrigger>
          <TabsTrigger value="market-trends">Market Trends</TabsTrigger>
          <TabsTrigger value="revenue-forecast">Revenue Forecast</TabsTrigger>
          <TabsTrigger value="geographic">Geographic Data</TabsTrigger>
        </TabsList>

        <TabsContent value="user-behavior">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Session Duration Trends</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={userAnalytics?.slice(-10) || []}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="created_at" />
                    <YAxis />
                    <Tooltip />
                    <Line type="monotone" dataKey="time_spent_minutes" stroke="#8884d8" />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Page Views Distribution</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={userAnalytics?.slice(-10) || []}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="session_id" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="page_views" fill="#82ca9d" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="market-trends">
          <Card>
            <CardHeader>
              <CardTitle>Market Analytics Overview</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={marketAnalytics || []}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="recorded_at" />
                    <YAxis />
                    <Tooltip />
                    <Line type="monotone" dataKey="metric_value" stroke="#8884d8" />
                  </LineChart>
                </ResponsiveContainer>

                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={marketAnalytics?.slice(0, 6) || []}
                      cx="50%"
                      cy="50%"
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="metric_value"
                      label
                    >
                      {(marketAnalytics || []).slice(0, 6).map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="revenue-forecast">
          <Card>
            <CardHeader>
              <CardTitle>Revenue Forecasting</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={400}>
                <LineChart data={revenueForecasts || []}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="forecast_period" />
                  <YAxis />
                  <Tooltip />
                  <Line 
                    type="monotone" 
                    dataKey="predicted_revenue" 
                    stroke="#8884d8" 
                    strokeWidth={2}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="confidence_score" 
                    stroke="#82ca9d" 
                    strokeWidth={2}
                  />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="geographic">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Map className="w-5 h-5" />
                Geographic Distribution
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center py-12">
                <Map className="w-16 h-16 mx-auto text-gray-400 mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  Geographic Analytics
                </h3>
                <p className="text-gray-600 max-w-md mx-auto">
                  Interactive geographic distribution maps and regional analytics 
                  will be displayed here with user distribution and market data.
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AdvancedAnalyticsDashboard;
