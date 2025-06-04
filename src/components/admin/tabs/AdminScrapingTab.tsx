
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Play, Pause, RotateCcw, Activity } from 'lucide-react';
import { useScrapingJobs } from '@/hooks/useAdminData';
import ScrapingJobRow from '../components/ScrapingJobRow';

const AdminScrapingTab = () => {
  const { data: jobs = [], isLoading } = useScrapingJobs();
  const [selectedJob, setSelectedJob] = useState<any>(null);
  const [showResultDialog, setShowResultDialog] = useState(false);

  const handleViewResult = (job: any) => {
    setSelectedJob(job);
    setShowResultDialog(true);
  };

  const handleRetryJob = (jobId: string) => {
    console.log('Retry job:', jobId);
  };

  const stats = {
    total: jobs.length,
    completed: jobs.filter(j => j.status === 'completed').length,
    failed: jobs.filter(j => j.status === 'failed').length,
    running: jobs.filter(j => j.status === 'running').length,
  };

  if (isLoading) {
    return <div className="p-4">Loading scraping jobs...</div>;
  }

  return (
    <div className="space-y-6">
      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Jobs</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.total}</div>
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
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold text-blue-600">{stats.running}</div>
            <p className="text-xs text-muted-foreground">Running</p>
          </CardContent>
        </Card>
      </div>

      {/* Jobs Table */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>Scraping Jobs</span>
            <div className="flex gap-2">
              <Button size="sm" variant="outline">
                <Play className="h-3 w-3 mr-1" />
                Start All
              </Button>
              <Button size="sm" variant="outline">
                <Pause className="h-3 w-3 mr-1" />
                Pause All
              </Button>
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Job Details</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Source</TableHead>
                <TableHead>Proxy</TableHead>
                <TableHead>Duration</TableHead>
                <TableHead>Started At</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {jobs.map((job) => (
                <ScrapingJobRow
                  key={job.id}
                  job={job}
                  onViewResult={handleViewResult}
                  onRetry={handleRetryJob}
                />
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Result Dialog */}
      <Dialog open={showResultDialog} onOpenChange={setShowResultDialog}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Job Result</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            {selectedJob && (
              <>
                <div>
                  <h4 className="font-medium">Job Details</h4>
                  <p className="text-sm text-muted-foreground">Type: {selectedJob.job_type}</p>
                  <p className="text-sm text-muted-foreground">URL: {selectedJob.target_url}</p>
                </div>
                <div>
                  <h4 className="font-medium">Result</h4>
                  <pre className="bg-muted p-3 rounded text-xs overflow-auto max-h-[300px]">
                    {JSON.stringify(selectedJob.result, null, 2)}
                  </pre>
                </div>
              </>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminScrapingTab;
