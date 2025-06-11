
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { CheckCircle, AlertTriangle, Activity, Clock } from 'lucide-react';

interface ScrapingJobsTableProps {
  scrapingJobs: any[];
  searchTerm: string;
}

const ScrapingJobsTable: React.FC<ScrapingJobsTableProps> = ({
  scrapingJobs,
  searchTerm
}) => {
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

  const filteredScrapingJobs = scrapingJobs.filter(job =>
    job.job_type?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    job.target_url?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
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
  );
};

export default ScrapingJobsTable;
