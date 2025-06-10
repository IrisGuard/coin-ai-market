
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Store, BarChart3, Activity, Settings } from 'lucide-react';
import { useEnhancedStoreData, useStorePerformanceMetrics, useStoreActivityLogs } from '@/hooks/admin/useEnhancedStores';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

const AdminStoreManagementTab = () => {
  const { data: stores, isLoading } = useEnhancedStoreData();
  const { data: performanceMetrics } = useStorePerformanceMetrics();
  const { data: activityLogs } = useStoreActivityLogs();

  if (isLoading) {
    return (
      <Card>
        <CardContent className="text-center py-12">
          <div className="animate-spin h-8 w-8 border-b-2 border-purple-600 mx-auto mb-4"></div>
          <p>Loading store management...</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Store className="w-5 h-5" />
            Enhanced Store Management
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="stores" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="stores" className="flex items-center gap-2">
                <Store className="w-4 h-4" />
                Store Overview
              </TabsTrigger>
              <TabsTrigger value="performance" className="flex items-center gap-2">
                <BarChart3 className="w-4 h-4" />
                Performance Metrics
              </TabsTrigger>
              <TabsTrigger value="activity" className="flex items-center gap-2">
                <Activity className="w-4 h-4" />
                Activity Logs
              </TabsTrigger>
            </TabsList>

            <TabsContent value="stores" className="mt-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {stores?.map((store) => (
                  <Card key={store.id}>
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between mb-3">
                        <h3 className="font-medium">{store.name}</h3>
                        <div className="flex gap-2">
                          <Badge variant={store.verified ? 'default' : 'secondary'}>
                            {store.verified ? 'Verified' : 'Unverified'}
                          </Badge>
                          <Badge variant={store.is_active ? 'default' : 'destructive'}>
                            {store.is_active ? 'Active' : 'Inactive'}
                          </Badge>
                        </div>
                      </div>
                      
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-gray-600">Owner:</span>
                          <span>{store.profiles?.full_name || 'Unknown'}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Items:</span>
                          <span>{store.coins?.length || 0}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Rating:</span>
                          <span>{store.profiles?.rating || 'N/A'}</span>
                        </div>
                      </div>

                      <div className="flex gap-2 mt-4">
                        <Button size="sm" variant="outline">View Details</Button>
                        {!store.verified && (
                          <Button size="sm" variant="outline">Verify</Button>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="performance" className="mt-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                <Card>
                  <CardContent className="p-4">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-blue-600">
                        {stores?.length || 0}
                      </div>
                      <div className="text-sm text-gray-600">Total Stores</div>
                    </div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardContent className="p-4">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-green-600">
                        {stores?.filter(s => s.verified).length || 0}
                      </div>
                      <div className="text-sm text-gray-600">Verified Stores</div>
                    </div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardContent className="p-4">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-purple-600">
                        {performanceMetrics?.reduce((sum, m) => sum + m.total_listings, 0) || 0}
                      </div>
                      <div className="text-sm text-gray-600">Total Listings</div>
                    </div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardContent className="p-4">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-orange-600">
                        ${performanceMetrics?.reduce((sum, m) => sum + m.total_revenue, 0).toFixed(0) || 0}
                      </div>
                      <div className="text-sm text-gray-600">Total Revenue</div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              <Card>
                <CardHeader>
                  <CardTitle>Store Performance Details</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b">
                          <th className="text-left p-2">Store</th>
                          <th className="text-right p-2">Listings</th>
                          <th className="text-right p-2">Sold</th>
                          <th className="text-right p-2">Revenue</th>
                          <th className="text-right p-2">Conv. Rate</th>
                        </tr>
                      </thead>
                      <tbody>
                        {performanceMetrics?.map((metric) => (
                          <tr key={metric.store_id} className="border-b hover:bg-gray-50">
                            <td className="p-2 font-medium">{metric.store_name}</td>
                            <td className="p-2 text-right">{metric.total_listings}</td>
                            <td className="p-2 text-right">{metric.sold_items}</td>
                            <td className="p-2 text-right">${metric.total_revenue.toFixed(2)}</td>
                            <td className="p-2 text-right">{metric.conversion_rate.toFixed(1)}%</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="activity" className="mt-6">
              <Card>
                <CardHeader>
                  <CardTitle>Recent Store Activity</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {activityLogs?.map((log) => (
                      <div key={log.id} className="p-3 border rounded-lg">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <Activity className="w-4 h-4 text-blue-600" />
                            <span className="font-medium">{log.activity_type}</span>
                          </div>
                          <span className="text-xs text-gray-500">
                            {new Date(log.created_at).toLocaleString()}
                          </span>
                        </div>
                        <div className="text-sm text-gray-600 mt-1">
                          Store: {log.stores?.name}
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminStoreManagementTab;
