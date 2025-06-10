
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Globe, Settings, BarChart3, Zap } from 'lucide-react';
import { useExternalSourcesManagement } from '@/hooks/admin/useExternalSourcesManagement';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';

const AdminExternalSourcesTab = () => {
  const { data: sources, isLoading } = useExternalSourcesManagement();

  if (isLoading) {
    return (
      <Card>
        <CardContent className="text-center py-12">
          <div className="animate-spin h-8 w-8 border-b-2 border-purple-600 mx-auto mb-4"></div>
          <p>Loading external sources...</p>
        </CardContent>
      </Card>
    );
  }

  const activeSources = sources?.filter(s => s.is_active) || [];
  const avgReliability = sources?.reduce((acc, s) => acc + (s.reliability_score || 0), 0) / (sources?.length || 1);

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Globe className="w-5 h-5" />
            External Sources Management
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="overview" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="overview" className="flex items-center gap-2">
                <Globe className="w-4 h-4" />
                Source Overview
              </TabsTrigger>
              <TabsTrigger value="performance" className="flex items-center gap-2">
                <BarChart3 className="w-4 h-4" />
                Performance
              </TabsTrigger>
              <TabsTrigger value="settings" className="flex items-center gap-2">
                <Settings className="w-4 h-4" />
                Configuration
              </TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="mt-6">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                <Card>
                  <CardContent className="p-4">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-blue-600">
                        {sources?.length || 0}
                      </div>
                      <div className="text-sm text-gray-600">Total Sources</div>
                    </div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardContent className="p-4">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-green-600">
                        {activeSources.length}
                      </div>
                      <div className="text-sm text-gray-600">Active Sources</div>
                    </div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardContent className="p-4">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-purple-600">
                        {Math.round(avgReliability * 100)}%
                      </div>
                      <div className="text-sm text-gray-600">Avg Reliability</div>
                    </div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardContent className="p-4">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-orange-600">
                        {sources?.reduce((sum, s) => sum + (s.rate_limit_per_hour || 0), 0) || 0}
                      </div>
                      <div className="text-sm text-gray-600">Total Rate Limit/hr</div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {sources?.map((source) => (
                  <Card key={source.id}>
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between mb-3">
                        <h3 className="font-medium">{source.source_name}</h3>
                        <Badge variant={source.is_active ? 'default' : 'secondary'}>
                          {source.is_active ? 'Active' : 'Inactive'}
                        </Badge>
                      </div>
                      
                      <div className="space-y-3">
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-600">Reliability:</span>
                          <span>{Math.round((source.reliability_score || 0) * 100)}%</span>
                        </div>
                        <Progress value={(source.reliability_score || 0) * 100} className="h-2" />
                        
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-600">Rate Limit:</span>
                          <span>{source.rate_limit_per_hour}/hr</span>
                        </div>
                        
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-600">Priority:</span>
                          <span>{Math.round((source.priority_score || 0) * 100)}%</span>
                        </div>
                      </div>

                      <div className="flex gap-2 mt-4">
                        <Button size="sm" variant="outline">
                          <Zap className="w-3 h-3 mr-1" />
                          Test
                        </Button>
                        <Button size="sm" variant="outline">Configure</Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="performance" className="mt-6">
              <Card>
                <CardHeader>
                  <CardTitle>Source Performance Metrics</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b">
                          <th className="text-left p-2">Source</th>
                          <th className="text-right p-2">Reliability</th>
                          <th className="text-right p-2">Rate Limit</th>
                          <th className="text-right p-2">Priority</th>
                          <th className="text-center p-2">Status</th>
                        </tr>
                      </thead>
                      <tbody>
                        {sources?.map((source) => (
                          <tr key={source.id} className="border-b hover:bg-gray-50">
                            <td className="p-2 font-medium">{source.source_name}</td>
                            <td className="p-2 text-right">{Math.round((source.reliability_score || 0) * 100)}%</td>
                            <td className="p-2 text-right">{source.rate_limit_per_hour}</td>
                            <td className="p-2 text-right">{Math.round((source.priority_score || 0) * 100)}%</td>
                            <td className="p-2 text-center">
                              <Badge variant={source.is_active ? 'default' : 'secondary'}>
                                {source.is_active ? 'Active' : 'Inactive'}
                              </Badge>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="settings" className="mt-6">
              <Card>
                <CardHeader>
                  <CardTitle>Global Source Configuration</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="p-4 border rounded-lg">
                      <h4 className="font-medium mb-2">Auto-Discovery Settings</h4>
                      <p className="text-sm text-gray-600">Configure automatic source discovery and validation.</p>
                    </div>
                    
                    <div className="p-4 border rounded-lg">
                      <h4 className="font-medium mb-2">Rate Limiting</h4>
                      <p className="text-sm text-gray-600">Global rate limiting configuration for all external sources.</p>
                    </div>
                    
                    <div className="p-4 border rounded-lg">
                      <h4 className="font-medium mb-2">Reliability Thresholds</h4>
                      <p className="text-sm text-gray-600">Set minimum reliability scores for source activation.</p>
                    </div>
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

export default AdminExternalSourcesTab;
