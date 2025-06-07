
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useDataSources, useScrapingJobs } from '@/hooks/useDataSources';
import { Database, Globe, Zap, Clock } from 'lucide-react';

const AdminDataSourcesSection = () => {
  const { data: dataSources = [], isLoading: sourcesLoading } = useDataSources();
  const { data: scrapingJobs = [], isLoading: jobsLoading } = useScrapingJobs();

  if (sourcesLoading || jobsLoading) {
    return (
      <Card>
        <CardContent className="text-center py-12">
          <div className="animate-spin h-8 w-8 border-b-2 border-purple-600 mx-auto mb-4"></div>
          <p>Loading data sources...</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Database className="h-5 w-5" />
            Data Sources
          </CardTitle>
          <CardDescription>Manage external data sources and web scraping</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {dataSources.map((source) => (
              <div key={source.id} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-center space-x-4">
                  <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                    <Globe className="h-5 w-5 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold">{source.name}</h3>
                    <p className="text-sm text-gray-600">{source.url}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <Badge variant={source.is_active ? "default" : "secondary"}>
                    {source.is_active ? "Active" : "Inactive"}
                  </Badge>
                  <Badge variant="outline">
                    Priority: {source.priority}
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Zap className="h-5 w-5" />
            Recent Scraping Jobs
          </CardTitle>
          <CardDescription>Monitor web scraping activity</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {scrapingJobs.slice(0, 5).map((job) => (
              <div key={job.id} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-center space-x-4">
                  <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                    <Clock className="h-5 w-5 text-green-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold">{job.job_type}</h3>
                    <p className="text-sm text-gray-600">{job.target_url}</p>
                  </div>
                </div>
                <Badge variant={
                  job.status === 'completed' ? "default" : 
                  job.status === 'failed' ? "destructive" : "secondary"
                }>
                  {job.status}
                </Badge>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminDataSourcesSection;
