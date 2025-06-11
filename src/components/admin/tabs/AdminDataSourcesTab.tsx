import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Progress } from '@/components/ui/progress';
import { Database, Activity, Settings, RefreshCw, Search, Globe, Clock, CheckCircle, AlertTriangle, Play, Pause } from 'lucide-react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';

const AdminDataSourcesTab = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const queryClient = useQueryClient();

  const { data: dataSources = [], isLoading: sourcesLoading } = useQuery({
    queryKey: ['admin-data-sources'],
    queryFn: async () => {
      console.log('🔍 Fetching data sources...');
      const { data, error } = await supabase
        .from('data_sources')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) {
        console.error('❌ Error fetching data sources:', error);
        throw error;
      }
      console.log('✅ Data sources loaded:', data?.length || 0);
      return data || [];
    },
  });

  const { data: externalSources = [] } = useQuery({
    queryKey: ['admin-external-sources'],
    queryFn: async () => {
      console.log('🔍 Fetching external sources...');
      const { data, error } = await supabase
        .from('external_price_sources')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) {
        console.error('❌ Error fetching external sources:', error);
        throw error;
      }
      console.log('✅ External sources loaded:', data?.length || 0);
      return data || [];
    },
  });

  const { data: scrapingJobs = [] } = useQuery({
    queryKey: ['admin-scraping-jobs'],
    queryFn: async () => {
      console.log('🔍 Fetching scraping jobs...');
      const { data, error } = await supabase
        .from('scraping_jobs')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(100);
      
      if (error) {
        console.error('❌ Error fetching scraping jobs:', error);
        throw error;
      }
      console.log('✅ Scraping jobs loaded:', data?.length || 0);
      return data || [];
    },
  });

  const { data: sourceStats } = useQuery({
    queryKey: ['admin-source-stats'],
    queryFn: async () => {
      console.log('🔍 Fetching source stats...');
      try {
        const [
          totalDataSources,
          activeDataSources,
          totalExternalSources,
          activeExternalSources,
          totalScrapingJobs,
          recentJobs
        ] = await Promise.all([
          supabase.from('data_sources').select('id', { count: 'exact', head: true }),
          supabase.from('data_sources').select('id', { count: 'exact', head: true }).eq('is_active', true),
          supabase.from('external_price_sources').select('id', { count: 'exact', head: true }),
          supabase.from('external_price_sources').select('id', { count: 'exact', head: true }).eq('is_active', true),
          supabase.from('scraping_jobs').select('id', { count: 'exact', head: true }),
          supabase.from('scraping_jobs')
            .select('status')
            .gte('created_at', new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString())
        ]);

        const stats = {
          totalDataSources: totalDataSources.count || 0,
          activeDataSources: activeDataSources.count || 0,
          totalExternalSources: totalExternalSources.count || 0,
          activeExternalSources: activeExternalSources.count || 0,
          totalScrapingJobs: totalScrapingJobs.count || 0,
          jobsLast24h: recentJobs.count || 0,
        };
        
        console.log('✅ Source stats loaded:', stats);
        return stats;
      } catch (error) {
        console.error('❌ Error fetching source stats:', error);
        return {
          totalDataSources: 0,
          activeDataSources: 0,
          totalExternalSources: 0,
          activeExternalSources: 0,
          totalScrapingJobs: 0,
          jobsLast24h: 0,
        };
      }
    },
  });

  const updateDataSourceMutation = useMutation({
    mutationFn: async ({ sourceId, updates, tableType }: { sourceId: string; updates: Record<string, any>; tableType: 'data_sources' | 'external_price_sources' }) => {
      console.log(`🔄 Updating ${tableType} with ID ${sourceId}:`, updates);
      
      if (tableType === 'data_sources') {
        const { error } = await supabase
          .from('data_sources')
          .update(updates)
          .eq('id', sourceId);
        if (error) {
          console.error('❌ Error updating data source:', error);
          throw error;
        }
      } else if (tableType === 'external_price_sources') {
        const { error } = await supabase
          .from('external_price_sources')
          .update(updates)
          .eq('id', sourceId);
        if (error) {
          console.error('❌ Error updating external source:', error);
          throw error;
        }
      }
      
      console.log('✅ Source updated successfully');
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-data-sources'] });
      queryClient.invalidateQueries({ queryKey: ['admin-external-sources'] });
      queryClient.invalidateQueries({ queryKey: ['admin-source-stats'] });
      toast({
        title: "Success",
        description: "Data source updated successfully.",
      });
    },
    onError: (error: any) => {
      console.error('❌ Update failed:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to update data source",
        variant: "destructive",
      });
    },
  });

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

  const getJobStatusIcon = (status: string) => {
    switch (status) {
      case 'completed': return <CheckCircle className="h-4 w-4" />;
      case 'running': return <Activity className="h-4 w-4" />;
      case 'failed': return <AlertTriangle className="h-4 w-4" />;
      default: return <Clock className="h-4 w-4" />;
    }
  };

  const filteredDataSources = dataSources.filter(source =>
    source.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    source.url?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredExternalSources = externalSources.filter(source =>
    source.source_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    source.base_url?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredScrapingJobs = scrapingJobs.filter(job =>
    job.job_type?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    job.target_url?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Statistics Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Data Sources</CardTitle>
            <Database className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{sourceStats?.activeDataSources || 0}</div>
            <p className="text-xs text-muted-foreground">
              of {sourceStats?.totalDataSources || 0} total
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">External Sources</CardTitle>
            <Globe className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{sourceStats?.activeExternalSources || 0}</div>
            <p className="text-xs text-muted-foreground">
              of {sourceStats?.totalExternalSources || 0} total
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Scraping Jobs</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{sourceStats?.totalScrapingJobs || 0}</div>
            <p className="text-xs text-muted-foreground">
              {sourceStats?.jobsLast24h || 0} in last 24h
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Success Rate</CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {dataSources.length > 0 
                ? ((dataSources.filter(s => (s.success_rate || 0) > 0.8).length / dataSources.length) * 100).toFixed(1)
                : 0}%
            </div>
            <Progress 
              value={dataSources.length > 0 
                ? (dataSources.filter(s => (s.success_rate || 0) > 0.8).length / dataSources.length) * 100 
                : 0} 
              className="mt-2" 
            />
          </CardContent>
        </Card>
      </div>

      {/* Tabs for different sections */}
      <Tabs defaultValue="data-sources" className="space-y-4">
        <TabsList>
          <TabsTrigger value="data-sources">Data Sources</TabsTrigger>
          <TabsTrigger value="external-sources">External Sources</TabsTrigger>
          <TabsTrigger value="scraping-jobs">Scraping Jobs</TabsTrigger>
        </TabsList>

        <TabsContent value="data-sources" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Data Sources Management</CardTitle>
              <CardDescription>Monitor and manage internal data sources</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center space-x-2 mb-4">
                <Search className="h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search data sources..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="max-w-sm"
                />
              </div>
              
              {sourcesLoading ? (
                <div className="text-center py-8">Loading data sources...</div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Name</TableHead>
                      <TableHead>URL</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Success Rate</TableHead>
                      <TableHead>Priority</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredDataSources.map((source) => (
                      <TableRow key={source.id}>
                        <TableCell>
                          <div className="font-medium">{source.name}</div>
                        </TableCell>
                        <TableCell>
                          <div className="text-sm text-blue-600 hover:underline">
                            <a href={source.url} target="_blank" rel="noopener noreferrer">
                              {source.url}
                            </a>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline">{source.type}</Badge>
                        </TableCell>
                        <TableCell>
                          <Badge className={getStatusColor(source.is_active)}>
                            {source.is_active ? 'Active' : 'Inactive'}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center space-x-2">
                            <span>{((source.success_rate || 0) * 100).toFixed(1)}%</span>
                            <Progress value={(source.success_rate || 0) * 100} className="w-16" />
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant="secondary">{source.priority}</Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Dialog>
                              <DialogTrigger asChild>
                                <Button variant="outline" size="sm">
                                  <Settings className="h-4 w-4" />
                                </Button>
                              </DialogTrigger>
                              <DialogContent>
                                <DialogHeader>
                                  <DialogTitle>Configure: {source.name}</DialogTitle>
                                  <DialogDescription>
                                    Manage data source settings and status
                                  </DialogDescription>
                                </DialogHeader>
                                <div className="space-y-4">
                                  <div className="flex items-center space-x-2">
                                    <Switch
                                      checked={source.is_active}
                                      onCheckedChange={(checked) => 
                                        updateDataSourceMutation.mutate({
                                          sourceId: source.id,
                                          updates: { is_active: checked },
                                          tableType: 'data_sources'
                                        })
                                      }
                                    />
                                    <Label>Active Status</Label>
                                  </div>
                                  <div>
                                    <Label>Last Used</Label>
                                    <p className="text-sm text-gray-600">
                                      {source.last_used ? new Date(source.last_used).toLocaleString() : 'Never'}
                                    </p>
                                  </div>
                                  <div>
                                    <Label>Rate Limit</Label>
                                    <p className="text-sm text-gray-600">{source.rate_limit} requests/hour</p>
                                  </div>
                                </div>
                              </DialogContent>
                            </Dialog>
                            
                            <Button
                              variant={source.is_active ? "destructive" : "default"}
                              size="sm"
                              onClick={() => 
                                updateDataSourceMutation.mutate({
                                  sourceId: source.id,
                                  updates: { is_active: !source.is_active },
                                  tableType: 'data_sources'
                                })
                              }
                              disabled={updateDataSourceMutation.isPending}
                            >
                              {source.is_active ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="external-sources" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>External Price Sources</CardTitle>
              <CardDescription>Manage external price data sources and API integrations</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Source Name</TableHead>
                    <TableHead>Base URL</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Rate Limit</TableHead>
                    <TableHead>Priority</TableHead>
                    <TableHead>Reliability</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredExternalSources.map((source) => (
                    <TableRow key={source.id}>
                      <TableCell>
                        <div className="font-medium">{source.source_name}</div>
                      </TableCell>
                      <TableCell>
                        <div className="text-sm text-blue-600">{source.base_url}</div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline">{source.source_type}</Badge>
                      </TableCell>
                      <TableCell>
                        <Badge className={getStatusColor(source.is_active)}>
                          {source.is_active ? 'Active' : 'Inactive'}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        {source.rate_limit_per_hour}/hr
                      </TableCell>
                      <TableCell>
                        <Badge variant="secondary">{source.priority_score}</Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-2">
                          <span>{((source.reliability_score || 0) * 100).toFixed(1)}%</span>
                          <Progress value={(source.reliability_score || 0) * 100} className="w-16" />
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="scraping-jobs" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Scraping Jobs</CardTitle>
              <CardDescription>Monitor scraping job execution and results</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Job Type</TableHead>
                    <TableHead>Target URL</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Created</TableHead>
                    <TableHead>Started</TableHead>
                    <TableHead>Completed</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredScrapingJobs.map((job) => (
                    <TableRow key={job.id}>
                      <TableCell>
                        <Badge variant="outline">{job.job_type}</Badge>
                      </TableCell>
                      <TableCell>
                        <div className="text-sm text-blue-600 max-w-xs truncate">
                          {job.target_url}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          {getJobStatusIcon(job.status)}
                          <Badge className={getJobStatusColor(job.status)}>
                            {job.status}
                          </Badge>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="text-sm">
                          {new Date(job.created_at).toLocaleDateString()}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="text-sm">
                          {job.started_at ? new Date(job.started_at).toLocaleDateString() : 'N/A'}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="text-sm">
                          {job.completed_at ? new Date(job.completed_at).toLocaleDateString() : 'N/A'}
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AdminDataSourcesTab;
