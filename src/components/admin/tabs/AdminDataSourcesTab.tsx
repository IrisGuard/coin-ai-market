
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Database, Globe, Activity, Settings } from 'lucide-react';
import DataAggregationDashboard from '../enhanced/DataAggregationDashboard';
import { useEnhancedDataSources, useDataSourceMetrics } from '@/hooks/useEnhancedDataSources';

const AdminDataSourcesTab = () => {
  const { data: dataSources } = useEnhancedDataSources();
  const { data: metrics } = useDataSourceMetrics();

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Database className="w-5 h-5" />
            Enhanced Data Sources Management
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="aggregation" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="aggregation" className="flex items-center gap-2">
                <Activity className="w-4 h-4" />
                Data Aggregation
              </TabsTrigger>
              <TabsTrigger value="sources" className="flex items-center gap-2">
                <Database className="w-4 h-4" />
                Source Management
              </TabsTrigger>
              <TabsTrigger value="metrics" className="flex items-center gap-2">
                <Globe className="w-4 h-4" />
                Performance Metrics
              </TabsTrigger>
            </TabsList>

            <TabsContent value="aggregation" className="mt-6">
              <DataAggregationDashboard />
            </TabsContent>

            <TabsContent value="sources" className="mt-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {dataSources?.map((source) => (
                  <Card key={source.id}>
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between mb-3">
                        <h3 className="font-medium">{source.name}</h3>
                        <div className={`w-3 h-3 rounded-full ${
                          source.is_active ? 'bg-green-500' : 'bg-red-500'
                        }`}></div>
                      </div>
                      
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-gray-600">Type:</span>
                          <span>{source.source_type}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Priority:</span>
                          <span>{source.priority_score}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Rate Limit:</span>
                          <span>{source.rate_limit_per_hour}/hr</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="metrics" className="mt-6">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <Card>
                  <CardContent className="p-4">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-blue-600">
                        {metrics?.total_sources || 0}
                      </div>
                      <div className="text-sm text-gray-600">Total Sources</div>
                    </div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardContent className="p-4">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-green-600">
                        {metrics?.active_sources || 0}
                      </div>
                      <div className="text-sm text-gray-600">Active Sources</div>
                    </div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardContent className="p-4">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-purple-600">
                        {metrics?.avg_response_time || 0}ms
                      </div>
                      <div className="text-sm text-gray-600">Avg Response</div>
                    </div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardContent className="p-4">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-orange-600">
                        {metrics?.success_rate || 0}%
                      </div>
                      <div className="text-sm text-gray-600">Success Rate</div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminDataSourcesTab;
