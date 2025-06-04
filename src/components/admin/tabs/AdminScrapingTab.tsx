
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Progress } from '@/components/ui/progress';
import { useScrapingJobs } from '@/hooks/useDataSources';
import { Clock, CheckCircle, XCircle, AlertCircle, Eye } from 'lucide-react';

const AdminScrapingTab = () => {
  const { data: scrapingJobs, isLoading } = useScrapingJobs();
  
  if (isLoading) {
    return <div>Loading scraping jobs...</div>;
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'failed':
        return <XCircle className="h-4 w-4 text-red-500" />;
      case 'running':
        return <Clock className="h-4 w-4 text-blue-500" />;
      default:
        return <AlertCircle className="h-4 w-4 text-yellow-500" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'default';
      case 'failed':
        return 'destructive';
      case 'running':
        return 'secondary';
      default:
        return 'outline';
    }
  };

  const completedJobs = scrapingJobs?.filter(job => job.status === 'completed').length || 0;
  const runningJobs = scrapingJobs?.filter(job => job.status === 'running').length || 0;
  const failedJobs = scrapingJobs?.filter(job => job.status === 'failed').length || 0;
  const totalJobs = scrapingJobs?.length || 0;

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Jobs</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalJobs}</div>
            <p className="text-xs text-muted-foreground">
              All time
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Completed</CardTitle>
            <CheckCircle className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{completedJobs}</div>
            <p className="text-xs text-muted-foreground">
              Success rate: {totalJobs > 0 ? Math.round((completedJobs / totalJobs) * 100) : 0}%
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Running</CardTitle>
            <Clock className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{runningJobs}</div>
            <p className="text-xs text-muted-foreground">
              Currently active
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Failed</CardTitle>
            <XCircle className="h-4 w-4 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{failedJobs}</div>
            <p className="text-xs text-muted-foreground">
              Need attention
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Progress Overview */}
      <Card>
        <CardHeader>
          <CardTitle>Scraping Progress</CardTitle>
          <CardDescription>
            Overall progress of data collection activities
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <div className="flex justify-between text-sm mb-2">
                <span>Completed Jobs</span>
                <span>{completedJobs}/{totalJobs}</span>
              </div>
              <Progress value={totalJobs > 0 ? (completedJobs / totalJobs) * 100 : 0} />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Scraping Jobs Table */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Scraping Jobs</CardTitle>
          <CardDescription>
            Monitor your web scraping activities and their results
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Status</TableHead>
                <TableHead>Job Type</TableHead>
                <TableHead>Target URL</TableHead>
                <TableHead>Source</TableHead>
                <TableHead>VPN/Proxy</TableHead>
                <TableHead>Started</TableHead>
                <TableHead>Duration</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {scrapingJobs?.map((job) => (
                <TableRow key={job.id}>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      {getStatusIcon(job.status)}
                      <Badge variant={getStatusColor(job.status)}>
                        {job.status}
                      </Badge>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline">{job.job_type}</Badge>
                  </TableCell>
                  <TableCell className="max-w-xs truncate">
                    <span title={job.target_url}>{job.target_url}</span>
                  </TableCell>
                  <TableCell>{job.data_sources?.name || 'Unknown'}</TableCell>
                  <TableCell>
                    {job.vpn_proxies ? 
                      `${job.vpn_proxies.name} (${job.vpn_proxies.country_code})` : 
                      'None'
                    }
                  </TableCell>
                  <TableCell>
                    {job.started_at ? 
                      new Date(job.started_at).toLocaleString() : 
                      'Not started'
                    }
                  </TableCell>
                  <TableCell>
                    {job.started_at && job.completed_at ? 
                      `${Math.round((new Date(job.completed_at).getTime() - new Date(job.started_at).getTime()) / 1000)}s` :
                      job.started_at ? 'Running...' : '-'
                    }
                  </TableCell>
                  <TableCell>
                    <Button variant="outline" size="sm">
                      <Eye className="h-4 w-4" />
                    </Button>
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

export default AdminScrapingTab;
