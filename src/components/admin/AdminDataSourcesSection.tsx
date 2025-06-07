
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useDataSources, useScrapingJobs } from '@/hooks/useDataSources';
import { useExternalPriceSources } from '@/hooks/useEnhancedDataSources';
import { Database, Activity, Settings, RefreshCw } from 'lucide-react';

const AdminDataSourcesSection = () => {
  const { data: dataSources = [] } = useDataSources();
  const { data: externalSources = [] } = useExternalPriceSources();
  const { data: scrapingJobs = [] } = useScrapingJobs();
  const [refreshing, setRefreshing] = useState(false);

  const handleRefreshSources = async () => {
    setRefreshing(true);
    // Simulate refresh operation
    setTimeout(() => {
      setRefreshing(false);
    }, 2000);
  };

  const getStatusColor = (isActive: boolean) => {
    return isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800';
  };

  const getJobStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-800';
      case 'running': return 'bg-blue-100 text-blue-800';
      case 'failed': return 'bg-red-100 text-red-800';
      default: return 'bg-yellow-100 text-yellow-800';
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Database className="h-5 w-5" />
              Data Sources Management
            </div>
            <Button
              onClick={handleRefreshSources}
              disabled={refreshing}
              size="sm"
              variant="outline"
            >
              <RefreshCw className={`w-4 h-4 mr-2 ${refreshing ? 'animate-spin' : ''}`} />
              Refresh
            </Button>
          </CardTitle>
          <CardDescription>Monitor and manage external data sources</CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="sources" className="space-y-4">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="sources">Data Sources</TabsTrigger>
              <TabsTrigger value="external">External APIs</TabsTrigger>
              <TabsTrigger value="jobs">Scraping Jobs</TabsTrigger>
            </TabsList>

            <TabsContent value="sources" className="space-y-4">
              {dataSources.map((source) => (
                <div key={source.id} className="flex items-center justify-between p-4 border rounded-lg">
                  <div>
                    <h4 className="font-medium">{source.name}</h4>
                    <p className="text-sm text-gray-600">{source.url}</p>
                    <p className="text-xs text-gray-500">
                      Priority: {source.priority} • Success Rate: {(source.success_rate * 100).toFixed(1)}%
                    </p>
                  </div>
                  <div className="flex items-center gap-3">
                    <Badge className={getStatusColor(source.is_active)}>
                      {source.is_active ? 'Active' : 'Inactive'}
                    </Badge>
                    <Button size="sm" variant="outline">
                      <Settings className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </TabsContent>

            <TabsContent value="external" className="space-y-4">
              {externalSources.map((source) => (
                <div key={source.id} className="flex items-center justify-between p-4 border rounded-lg">
                  <div>
                    <h4 className="font-medium">{source.source_name}</h4>
                    <p className="text-sm text-gray-600">{source.base_url}</p>
                    <p className="text-xs text-gray-500">
                      Type: {source.source_type} • Priority: {source.priority_score}
                    </p>
                  </div>
                  <div className="flex items-center gap-3">
                    <Badge className={getStatusColor(source.is_active)}>
                      {source.is_active ? 'Active' : 'Inactive'}
                    </Badge>
                    <Badge variant="outline">
                      {source.rate_limit_per_hour}/hr
                    </Badge>
                  </div>
                </div>
              ))}
            </TabsContent>

            <TabsContent value="jobs" className="space-y-4">
              {scrapingJobs.slice(0, 10).map((job) => (
                <div key={job.id} className="flex items-center justify-between p-4 border rounded-lg">
                  <div>
                    <h4 className="font-medium">{job.job_type}</h4>
                    <p className="text-sm text-gray-600">{job.target_url}</p>
                    <p className="text-xs text-gray-500">
                      Created: {new Date(job.created_at).toLocaleString()}
                    </p>
                  </div>
                  <div className="flex items-center gap-3">
                    <Badge className={getJobStatusColor(job.status)}>
                      {job.status}
                    </Badge>
                    <Button size="sm" variant="outline">
                      <Activity className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminDataSourcesSection;
