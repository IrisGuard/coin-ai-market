
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Bot, Play, Pause, Settings, Activity } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

const EnhancedAdminScrapingTab = () => {
  const { data: scrapingStats, isLoading } = useQuery({
    queryKey: ['scraping-stats'],
    queryFn: async () => {
      const [jobsResult, sourcesResult] = await Promise.all([
        supabase.from('scraping_jobs').select('*').order('created_at', { ascending: false }).limit(10),
        supabase.from('external_price_sources').select('*')
      ]);

      return {
        recent_jobs: jobsResult.data || [],
        total_sources: sourcesResult.data?.length || 0,
        active_sources: sourcesResult.data?.filter(s => s.is_active)?.length || 0
      };
    },
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin h-8 w-8 border-b-2 border-coin-purple"></div>
      </div>
    );
  }

  const data = scrapingStats || {
    recent_jobs: [],
    total_sources: 0,
    active_sources: 0
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold">Enhanced Web Scraping</h3>
          <p className="text-sm text-muted-foreground">Advanced web scraping management and automation</p>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Sources</CardTitle>
            <Bot className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{data.total_sources}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Sources</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{data.active_sources}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Recent Jobs</CardTitle>
            <Settings className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{data.recent_jobs.length}</div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Recent Scraping Jobs</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {data.recent_jobs.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                No scraping jobs found
              </div>
            ) : (
              data.recent_jobs.map((job) => (
                <div key={job.id} className="flex items-center justify-between p-4 border rounded-lg">
                  <div>
                    <div className="font-medium">{job.job_type}</div>
                    <div className="text-sm text-muted-foreground">{job.target_url}</div>
                    <div className="text-xs text-muted-foreground">
                      {new Date(job.created_at).toLocaleString()}
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant={job.status === 'completed' ? 'default' : job.status === 'pending' ? 'secondary' : 'destructive'}>
                      {job.status}
                    </Badge>
                    <Button size="sm" variant="outline">
                      <Play className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default EnhancedAdminScrapingTab;
