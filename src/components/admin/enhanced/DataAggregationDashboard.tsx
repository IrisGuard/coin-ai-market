
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from 'recharts';
import { Database, Activity, TrendingUp, RefreshCw, Search, CheckCircle } from 'lucide-react';
import { useExternalSourcesManagement, useDataAggregation } from '@/hooks/admin/useExternalSourcesManagement';
import { useAggregatedPrices, useProxyRotationLogs } from '@/hooks/useEnhancedDataSources';

const DataAggregationDashboard = () => {
  const { data: sources = [] } = useExternalSourcesManagement();
  const { data: aggregatedPrices = [] } = useAggregatedPrices();
  const { data: proxyLogs = [] } = useProxyRotationLogs();
  const dataAggregationMutation = useDataAggregation();
  
  const [testCoin, setTestCoin] = useState('');

  const activeSources = sources.filter(s => s.is_active);
  const totalSources = sources.length;
  const reliabilityAvg = sources.reduce((acc, s) => acc + (s.reliability_score || 0), 0) / sources.length;

  // Mock real-time data flow metrics
  const dataFlowMetrics = [
    { name: 'Heritage', requests: 245, success: 98, errors: 2 },
    { name: 'eBay', requests: 189, success: 92, errors: 8 },
    { name: 'PCGS', requests: 156, success: 100, errors: 0 },
    { name: 'Numista', requests: 134, success: 87, errors: 13 },
    { name: 'CoinAPI', requests: 98, success: 95, errors: 5 }
  ];

  const performanceData = [
    { time: '00:00', response: 245, throughput: 1200 },
    { time: '04:00', response: 198, throughput: 1350 },
    { time: '08:00', response: 267, throughput: 1100 },
    { time: '12:00', response: 234, throughput: 1250 },
    { time: '16:00', response: 189, throughput: 1400 },
    { time: '20:00', response: 223, throughput: 1180 }
  ];

  const handleTestAggregation = async () => {
    if (!testCoin.trim()) return;
    
    try {
      await dataAggregationMutation.mutateAsync(testCoin);
    } catch (error) {
      console.error('Aggregation test failed:', error);
    }
  };

  return (
    <div className="space-y-6">
      {/* Overview Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Active Sources</p>
                <p className="text-2xl font-bold">{activeSources.length}/{totalSources}</p>
              </div>
              <Database className="h-8 w-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Avg Reliability</p>
                <p className="text-2xl font-bold">{Math.round(reliabilityAvg * 100)}%</p>
              </div>
              <CheckCircle className="h-8 w-8 text-green-500" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Data Points</p>
                <p className="text-2xl font-bold">{aggregatedPrices.length}</p>
              </div>
              <TrendingUp className="h-8 w-8 text-purple-500" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Proxy Rotations</p>
                <p className="text-2xl font-bold">{proxyLogs.length}</p>
              </div>
              <Activity className="h-8 w-8 text-orange-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Test Aggregation */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Search className="w-5 h-5" />
            Test Data Aggregation
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4">
            <Input
              value={testCoin}
              onChange={(e) => setTestCoin(e.target.value)}
              placeholder="Enter coin identifier (e.g., 1909-S VDB Lincoln Cent)"
              className="flex-1"
            />
            <Button
              onClick={handleTestAggregation}
              disabled={dataAggregationMutation.isPending || !testCoin.trim()}
              className="flex items-center gap-2"
            >
              <RefreshCw className={`w-4 h-4 ${dataAggregationMutation.isPending ? 'animate-spin' : ''}`} />
              Test Aggregation
            </Button>
          </div>
          {dataAggregationMutation.isPending && (
            <div className="mt-4">
              <p className="text-sm text-gray-600 mb-2">Aggregating data from sources...</p>
              <Progress value={65} className="w-full" />
            </div>
          )}
        </CardContent>
      </Card>

      {/* Data Flow Metrics */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Source Performance</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={dataFlowMetrics}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="success" fill="#10b981" />
                <Bar dataKey="errors" fill="#ef4444" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>System Performance</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={performanceData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="time" />
                <YAxis />
                <Tooltip />
                <Line type="monotone" dataKey="response" stroke="#8884d8" strokeWidth={2} />
                <Line type="monotone" dataKey="throughput" stroke="#82ca9d" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Source Status Grid */}
      <Card>
        <CardHeader>
          <CardTitle>Source Status Overview</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {sources.map((source) => (
              <div key={source.id} className="p-4 border rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-medium">{source.source_name}</h4>
                  <Badge variant={source.is_active ? 'default' : 'secondary'}>
                    {source.is_active ? 'Active' : 'Inactive'}
                  </Badge>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Reliability</span>
                    <span>{Math.round((source.reliability_score || 0) * 100)}%</span>
                  </div>
                  <Progress value={(source.reliability_score || 0) * 100} className="h-2" />
                  <div className="flex justify-between text-xs text-gray-500">
                    <span>Rate: {source.rate_limit_per_hour}/hr</span>
                    <span>Priority: {(source.priority_score || 0) * 100}%</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default DataAggregationDashboard;
