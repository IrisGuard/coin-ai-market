
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { LineChart, Line, AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { TrendingUp, Users, DollarSign, Activity } from 'lucide-react';

const mockData = {
  userGrowth: [
    { month: 'Jan', users: 120, newUsers: 45 },
    { month: 'Feb', users: 150, newUsers: 30 },
    { month: 'Mar', users: 180, newUsers: 30 },
    { month: 'Apr', users: 220, newUsers: 40 },
    { month: 'May', users: 280, newUsers: 60 },
    { month: 'Jun', users: 320, newUsers: 40 }
  ],
  revenue: [
    { month: 'Jan', revenue: 15000, transactions: 45 },
    { month: 'Feb', revenue: 18000, transactions: 52 },
    { month: 'Mar', revenue: 22000, transactions: 61 },
    { month: 'Apr', revenue: 25000, transactions: 70 },
    { month: 'May', revenue: 28000, transactions: 78 },
    { month: 'Jun', revenue: 32000, transactions: 85 }
  ],
  categories: [
    { name: 'Ancient Coins', value: 35, color: '#8884d8' },
    { name: 'Modern Coins', value: 25, color: '#82ca9d' },
    { name: 'Rare Coins', value: 20, color: '#ffc658' },
    { name: 'Error Coins', value: 15, color: '#ff7300' },
    { name: 'Other', value: 5, color: '#0088fe' }
  ],
  performance: [
    { time: '00:00', response: 120, errors: 2 },
    { time: '04:00', response: 110, errors: 1 },
    { time: '08:00', response: 180, errors: 5 },
    { time: '12:00', response: 250, errors: 8 },
    { time: '16:00', response: 200, errors: 3 },
    { time: '20:00', response: 150, errors: 2 }
  ]
};

const AdvancedAdminCharts = () => {
  return (
    <div className="space-y-6">
      {/* User Growth Chart */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="w-5 h-5" />
              User Growth Trend
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={mockData.userGrowth}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Area 
                  type="monotone" 
                  dataKey="users" 
                  stackId="1" 
                  stroke="#8884d8" 
                  fill="#8884d8" 
                  fillOpacity={0.6}
                />
                <Area 
                  type="monotone" 
                  dataKey="newUsers" 
                  stackId="2" 
                  stroke="#82ca9d" 
                  fill="#82ca9d" 
                  fillOpacity={0.6}
                />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <DollarSign className="w-5 h-5" />
              Revenue Analytics
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={mockData.revenue}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip formatter={(value, name) => [`€${value}`, name]} />
                <Legend />
                <Line 
                  type="monotone" 
                  dataKey="revenue" 
                  stroke="#8884d8" 
                  strokeWidth={3}
                  dot={{ fill: '#8884d8', strokeWidth: 2, r: 6 }}
                />
                <Line 
                  type="monotone" 
                  dataKey="transactions" 
                  stroke="#82ca9d" 
                  strokeWidth={2}
                  yAxisId="right"
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Category Distribution and Performance */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5" />
              Category Distribution
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={mockData.categories}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {mockData.categories.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Activity className="w-5 h-5" />
              System Performance
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={mockData.performance}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="time" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="response" fill="#8884d8" name="Response Time (ms)" />
                <Bar dataKey="errors" fill="#ff7300" name="Error Count" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AdvancedAdminCharts;
