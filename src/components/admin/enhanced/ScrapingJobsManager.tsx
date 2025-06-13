
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Bot, Play, Pause, Settings, RefreshCw, Plus, Eye } from 'lucide-react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

const ScrapingJobsManager = () => {
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [newJob, setNewJob] = useState({
    job_type: '',
    target_url: '',
    priority: 1,
    config: {}
  });

  const queryClient = useQueryClient();

  const { data: scrapingJobs, isLoading } = useQuery({
    queryKey: ['scraping-jobs'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('scraping_jobs')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) {
        console.error('❌ Error fetching scraping jobs:', error);
        throw error;
      }
      
      console.log('✅ Scraping jobs loaded:', data?.length);
      return data || [];
    }
  });

  const createJobMutation = useMutation({
    mutationFn: async (jobData: any) => {
      const { data, error } = await supabase
        .from('scraping_jobs')
        .insert(jobData)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['scraping-jobs'] });
      setIsCreateDialogOpen(false);
      setNewJob({
        job_type: '',
        target_url: '',
        priority: 1,
        config: {}
      });
    }
  });

  const triggerJobMutation = useMutation({
    mutationFn: async (jobId: string) => {
      // Trigger the advanced-web-scraper Edge Function
      const { data, error } = await supabase.functions.invoke('advanced-web-scraper', {
        body: { 
          jobId,
          commandType: 'manual_trigger',
          targetUrl: scrapingJobs?.find(j => j.id === jobId)?.target_url
        }
      });
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['scraping-jobs'] });
    }
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-800';
      case 'running': return 'bg-blue-100 text-blue-800';
      case 'failed': return 'bg-red-100 text-red-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getPriorityColor = (priority: number) => {
    if (priority >= 8) return 'bg-red-100 text-red-800';
    if (priority >= 5) return 'bg-orange-100 text-orange-800';
    return 'bg-green-100 text-green-800';
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  const stats = {
    total: scrapingJobs?.length || 0,
    running: scrapingJobs?.filter(j => j.status === 'running').length || 0,
    completed: scrapingJobs?.filter(j => j.status === 'completed').length || 0,
    failed: scrapingJobs?.filter(j => j.status === 'failed').length || 0
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold">{stats.total}</div>
            <p className="text-xs text-muted-foreground">Total Jobs</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold text-blue-600">{stats.running}</div>
            <p className="text-xs text-muted-foreground">Running</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold text-green-600">{stats.completed}</div>
            <p className="text-xs text-muted-foreground">Completed</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold text-red-600">{stats.failed}</div>
            <p className="text-xs text-muted-foreground">Failed</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Bot className="h-6 w-6 text-blue-600" />
              Web Scraping Jobs Management
            </CardTitle>
            <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  Create Job
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Create New Scraping Job</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Job Type</label>
                    <Select onValueChange={(value) => setNewJob({...newJob, job_type: value})}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select job type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="coin_ebay_scraper">eBay Coin Prices</SelectItem>
                        <SelectItem value="coin_heritage_monitor">Heritage Auctions</SelectItem>
                        <SelectItem value="coin_pcgs_lookup">PCGS Database</SelectItem>
                        <SelectItem value="coin_ngc_lookup">NGC Database</SelectItem>
                        <SelectItem value="coin_greysheet_prices">Greysheet Prices</SelectItem>
                        <SelectItem value="coin_market_sentiment">Market Sentiment</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Target URL</label>
                    <Input
                      value={newJob.target_url}
                      onChange={(e) => setNewJob({...newJob, target_url: e.target.value})}
                      placeholder="https://www.ebay.com/sch/i.html?_nkw=morgan+silver+dollar"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Priority (1-10)</label>
                    <Input
                      type="number"
                      min="1"
                      max="10"
                      value={newJob.priority}
                      onChange={(e) => setNewJob({...newJob, priority: parseInt(e.target.value)})}
                    />
                  </div>
                </div>
                <div className="flex justify-end gap-2">
                  <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
                    Cancel
                  </Button>
                  <Button onClick={() => createJobMutation.mutate(newJob)}>
                    Create Job
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Job Type</TableHead>
                <TableHead>Target URL</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Priority</TableHead>
                <TableHead>Progress</TableHead>
                <TableHead>Created</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {scrapingJobs?.map((job) => (
                <TableRow key={job.id}>
                  <TableCell>
                    <div className="font-medium">{job.job_type}</div>
                  </TableCell>
                  <TableCell>
                    <div className="max-w-xs truncate text-sm text-muted-foreground">
                      {job.target_url}
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge className={getStatusColor(job.status)}>
                      {job.status}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge className={getPriorityColor(job.priority)}>
                      {job.priority}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <div className="text-sm">{job.progress_percentage || 0}%</div>
                      <div className="w-16 bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-blue-600 h-2 rounded-full" 
                          style={{width: `${job.progress_percentage || 0}%`}}
                        ></div>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="text-sm">
                      {new Date(job.created_at).toLocaleDateString()}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => triggerJobMutation.mutate(job.id)}
                        disabled={job.status === 'running'}
                      >
                        <Play className="h-4 w-4" />
                      </Button>
                      <Button variant="outline" size="sm">
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button variant="outline" size="sm">
                        <Settings className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

export default ScrapingJobsManager;
