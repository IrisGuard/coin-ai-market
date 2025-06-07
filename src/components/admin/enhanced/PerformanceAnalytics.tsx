
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { 
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent 
} from '@/components/ui/chart';
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  ResponsiveContainer,
  AreaChart,
  Area,
  BarChart,
  Bar
} from 'recharts';
import { 
  Clock, 
  Database, 
  Cpu, 
  TrendingUp, 
  AlertTriangle,
  CheckCircle,
  Zap
} from 'lucide-react';

const PerformanceAnalytics = () => {
  // Mock performance data over time
  const performanceData = [
    { time: '00:00', apiResponse: 150, dbResponse: 25, aiProcessing: 1200, throughput: 250 },
    { time: '04:00', apiResponse: 145, dbResponse: 23, aiProcessing: 1180, throughput: 280 },
    { time: '08:00', apiResponse: 165, dbResponse: 28, aiProcessing: 1350, throughput: 320 },
    { time: '12:00', apiResponse: 180, dbResponse: 32, aiProcessing: 1500, throughput: 400 },
    { time: '16:00', apiResponse: 175, dbResponse: 30, aiProcessing: 1450, throughput: 380 },
    { time: '20:00', apiResponse: 155, dbResponse: 26, aiProcessing: 1250, throughput: 310 }
  ];

  const errorRateData = [
    { time: '00:00', errorRate: 0.5, successRate: 99.5 },
    { time: '04:00', errorRate: 0.3, successRate: 99.7 },
    { time: '08:00', errorRate: 0.8, successRate: 99.2 },
    { time: '12:00', errorRate: 1.2, successRate: 98.8 },
    { time: '16:00', errorRate: 0.9, successRate: 99.1 },
    { time: '20:00', errorRate: 0.6, successRate: 99.4 }
  ];

  const performanceMetrics = [
    {
      title: "API Response Time",
      current: 175,
      target: 200,
      status: "good",
      icon: Clock,
      unit: "ms",
      trend: "+5ms",
      color: "text-blue-600"
    },
    {
      title: "Database Queries",
      current: 30,
      target: 50,
      status: "excellent",
      icon: Database,
      unit: "ms",
      trend: "-2ms",
      color: "text-green-600"
    },
    {
      title: "AI Processing",
      current: 1450,
      target: 2000,
      status: "warning",
      icon: Cpu,
      unit: "ms",
      trend: "+150ms",
      color: "text-orange-600"
    },
    {
      title: "Throughput",
      current: 380,
      target: 500,
      status: "good",
      icon: Zap,
      unit: "req/min",
      trend: "+50",
      color: "text-purple-600"
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'excellent': return 'text-green-600 bg-green-50 border-green-200';
      case 'good': return 'text-blue-600 bg-blue-50 border-blue-200';
      case 'warning': return 'text-orange-600 bg-orange-50 border-orange-200';
      case 'critical': return 'text-red-600 bg-red-50 border-red-200';
      default: return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'excellent':
      case 'good': 
        return <CheckCircle className="w-4 h-4" />;
      case 'warning':
      case 'critical': 
        return <AlertTriangle className="w-4 h-4" />;
      default: 
        return <CheckCircle className="w-4 h-4" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Performance Metrics Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {performanceMetrics.map((metric, index) => {
          const IconComponent = metric.icon;
          const progressValue = (metric.current / metric.target) * 100;
          
          return (
            <Card key={index} className={`border ${getStatusColor(metric.status)}`}>
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <IconComponent className={`w-5 h-5 ${metric.color}`} />
                    <span className="font-medium text-sm">{metric.title}</span>
                  </div>
                  {getStatusIcon(metric.status)}
                </div>
                
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-2xl font-bold">{metric.current}</span>
                    <span className="text-sm text-gray-500">{metric.unit}</span>
                  </div>
                  
                  <Progress value={Math.min(progressValue, 100)} className="h-2" />
                  
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-gray-500">Target: {metric.target}{metric.unit}</span>
                    <Badge variant="outline" className="text-xs">
                      {metric.trend}
                    </Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Performance Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Response Times Chart */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="w-5 h-5" />
              Response Times (24h)
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ChartContainer config={{
              apiResponse: { label: "API Response", color: "#3B82F6" },
              dbResponse: { label: "DB Response", color: "#10B981" },
              aiProcessing: { label: "AI Processing", color: "#8B5CF6" }
            }} className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={performanceData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis dataKey="time" className="text-xs" />
                  <YAxis className="text-xs" />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Line 
                    type="monotone" 
                    dataKey="apiResponse" 
                    stroke="#3B82F6" 
                    strokeWidth={2}
                    dot={{ fill: '#3B82F6', strokeWidth: 2, r: 4 }}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="dbResponse" 
                    stroke="#10B981" 
                    strokeWidth={2}
                    dot={{ fill: '#10B981', strokeWidth: 2, r: 4 }}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="aiProcessing" 
                    stroke="#8B5CF6" 
                    strokeWidth={2}
                    dot={{ fill: '#8B5CF6', strokeWidth: 2, r: 4 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </ChartContainer>
          </CardContent>
        </Card>

        {/* Error Rate Chart */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5" />
              Success vs Error Rate (24h)
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ChartContainer config={{
              successRate: { label: "Success Rate", color: "#10B981" },
              errorRate: { label: "Error Rate", color: "#EF4444" }
            }} className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={errorRateData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis dataKey="time" className="text-xs" />
                  <YAxis className="text-xs" />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Area
                    type="monotone"
                    dataKey="successRate"
                    stackId="1"
                    stroke="#10B981"
                    fill="#10B981"
                    fillOpacity={0.3}
                  />
                  <Area
                    type="monotone"
                    dataKey="errorRate"
                    stackId="2"
                    stroke="#EF4444"
                    fill="#EF4444"
                    fillOpacity={0.3}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </ChartContainer>
          </CardContent>
        </Card>

        {/* Throughput Chart */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Zap className="w-5 h-5" />
              System Throughput (24h)
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ChartContainer config={{
              throughput: { label: "Requests/Min", color: "#8B5CF6" }
            }} className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={performanceData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis dataKey="time" className="text-xs" />
                  <YAxis className="text-xs" />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Bar 
                    dataKey="throughput" 
                    fill="#8B5CF6" 
                    radius={[4, 4, 0, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            </ChartContainer>
          </CardContent>
        </Card>
      </div>

      {/* Performance Insights */}
      <Card>
        <CardHeader>
          <CardTitle>Performance Insights</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <CheckCircle className="w-4 h-4 text-green-600" />
                <span className="font-medium text-green-800">Optimized</span>
              </div>
              <p className="text-sm text-green-700">
                Database queries are performing 15% faster than last week
              </p>
            </div>

            <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <AlertTriangle className="w-4 h-4 text-yellow-600" />
                <span className="font-medium text-yellow-800">Attention Needed</span>
              </div>
              <p className="text-sm text-yellow-700">
                AI processing times have increased during peak hours
              </p>
            </div>

            <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <TrendingUp className="w-4 h-4 text-blue-600" />
                <span className="font-medium text-blue-800">Trending Up</span>
              </div>
              <p className="text-sm text-blue-700">
                System throughput has improved by 25% this month
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default PerformanceAnalytics;
