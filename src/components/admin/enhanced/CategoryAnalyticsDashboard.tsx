
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useCategoryUsageStats, useUpdateCategoryUsageStats } from '@/hooks/admin/useEnhancedCategories';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { TrendingUp, RefreshCw, Eye, Coins } from 'lucide-react';

const CategoryAnalyticsDashboard = () => {
  const { data: categoryStats, isLoading } = useCategoryUsageStats();
  const updateStatsMutation = useUpdateCategoryUsageStats();

  const handleRefreshStats = () => {
    updateStatsMutation.mutate();
  };

  if (isLoading) {
    return (
      <Card>
        <CardContent className="text-center py-12">
          <div className="animate-spin h-8 w-8 border-b-2 border-purple-600 mx-auto mb-4"></div>
          <p>Loading category analytics...</p>
        </CardContent>
      </Card>
    );
  }

  // Prepare data for charts
  const chartData = categoryStats?.map(stat => ({
    name: stat.categories?.name || 'Unknown',
    coins: stat.coins_count || 0,
    views: stat.views_count || 0,
    icon: stat.categories?.icon
  })) || [];

  const totalCoins = chartData.reduce((sum, item) => sum + item.coins, 0);
  const totalViews = chartData.reduce((sum, item) => sum + item.views, 0);

  // Colors for pie chart
  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8', '#82CA9D', '#FFC658', '#FF7300'];

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Categories</p>
                <p className="text-3xl font-bold">{categoryStats?.length || 0}</p>
              </div>
              <TrendingUp className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Coins</p>
                <p className="text-3xl font-bold">{totalCoins}</p>
              </div>
              <Coins className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Views</p>
                <p className="text-3xl font-bold">{totalViews}</p>
              </div>
              <Eye className="h-8 w-8 text-purple-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Bar Chart - Coins per Category */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Coins per Category</CardTitle>
              <Button
                variant="outline"
                size="sm"
                onClick={handleRefreshStats}
                disabled={updateStatsMutation.isPending}
              >
                <RefreshCw className={`h-4 w-4 mr-1 ${updateStatsMutation.isPending ? 'animate-spin' : ''}`} />
                Refresh
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis 
                  dataKey="name" 
                  angle={-45}
                  textAnchor="end"
                  height={100}
                  fontSize={12}
                />
                <YAxis />
                <Tooltip />
                <Bar dataKey="coins" fill="#8884d8" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Pie Chart - Distribution */}
        <Card>
          <CardHeader>
            <CardTitle>Category Distribution</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={chartData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, value }) => `${name}: ${value}`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="coins"
                >
                  {chartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Detailed Table */}
      <Card>
        <CardHeader>
          <CardTitle>Detailed Category Statistics</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left p-2">Category</th>
                  <th className="text-left p-2">Icon</th>
                  <th className="text-right p-2">Coins</th>
                  <th className="text-right p-2">Views</th>
                  <th className="text-right p-2">Avg Views/Coin</th>
                  <th className="text-left p-2">Last Updated</th>
                </tr>
              </thead>
              <tbody>
                {categoryStats?.map((stat) => {
                  const avgViews = stat.coins_count > 0 ? (stat.views_count / stat.coins_count).toFixed(1) : '0';
                  return (
                    <tr key={stat.id} className="border-b hover:bg-gray-50">
                      <td className="p-2 font-medium">{stat.categories?.name || 'Unknown'}</td>
                      <td className="p-2">{stat.categories?.icon || '-'}</td>
                      <td className="p-2 text-right">{stat.coins_count}</td>
                      <td className="p-2 text-right">{stat.views_count}</td>
                      <td className="p-2 text-right">{avgViews}</td>
                      <td className="p-2 text-sm text-gray-600">
                        {stat.last_updated ? new Date(stat.last_updated).toLocaleDateString() : 'Never'}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default CategoryAnalyticsDashboard;
