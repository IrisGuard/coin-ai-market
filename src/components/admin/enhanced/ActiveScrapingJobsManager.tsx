
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Bot, Play, Pause, Settings, RefreshCw, Plus, Eye, Trash2 } from 'lucide-react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';

const ActiveScrapingJobsManager = () => {
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [newJob, setNewJob] = useState({
    job_type: '',
    target_url: '',
    config: {}
  });

  const queryClient = useQueryClient();

  const { data: scrapingJobs, isLoading } = useQuery({
    queryKey: ['active-scraping-jobs'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('scraping_jobs')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
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
      queryClient.invalidateQueries({ queryKey: ['active-scraping-jobs'] });
      setIsCreateDialogOpen(false);
      setNewJob({ job_type: '', target_url: '', config: {} });
      toast({
        title: "Success",
        description: "Scraping job created successfully",
      });
    }
  });

  const triggerJobMutation = useMutation({
    mutationFn: async (jobId: string) => {
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
      queryClient.invalidateQueries({ queryKey: ['active-scraping-jobs'] });
      toast({
        title: "Success",
        description: "Scraping job triggered successfully",
      });
    }
  });

  const deleteJobMutation = useMutation({
    mutationFn: async (jobId: string) => {
      const { error } = await supabase
        .from('scraping_jobs')
        .delete()
        .eq('id', jobId);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['active-scraping-jobs'] });
      toast({
        title: "Success",
        description: "Scraping job deleted successfully",
      });
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
              Active Scraping Jobs Management
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
                        <SelectItem value="ebay_coin_scraper">eBay Coin Prices</SelectItem>
                        <SelectItem value="heritage_auction_monitor">Heritage Auctions</SelectItem>
                        <SelectItem value="pcgs_price_guide">PCGS Price Guide</SelectItem>
                        <SelectItem value="ngc_price_guide">NGC Price Guide</SelectItem>
                        <SelectItem value="greysheet_prices">Greysheet Prices</SelectItem>
                        <SelectItem value="coin_world_news">Coin World News</SelectItem>
                        <SelectItem value="usa_coin_book">USA Coin Book</SelectItem>
                        <SelectItem value="coin_facts_pcgs">PCGS CoinFacts</SelectItem>
                        <SelectItem value="numista_database">Numista Database</SelectItem>
                        <SelectItem value="coinflation_melt">Coinflation Melt Values</SelectItem>
                        <SelectItem value="coin_community_forum">Coin Community Forum</SelectItem>
                        <SelectItem value="live_coin_prices">Live Coin Prices</SelectItem>
                        <SelectItem value="coin_price_tracker">Coin Price Tracker</SelectItem>
                        <SelectItem value="auction_prices_realized">Auction Prices Realized</SelectItem>
                        <SelectItem value="coin_market_cap">Coin Market Cap</SelectItem>
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
                <TableHead>Started</TableHead>
                <TableHead>Completed</TableHead>
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
                    <div className="text-sm">
                      {job.started_at ? new Date(job.started_at).toLocaleDateString() : 'Not started'}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="text-sm">
                      {job.completed_at ? new Date(job.completed_at).toLocaleDateString() : 'Not completed'}
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
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => deleteJobMutation.mutate(job.id)}
                      >
                        <Trash2 className="h-4 w-4" />
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

export default ActiveScrapingJobsManager;
