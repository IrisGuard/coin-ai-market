import React from 'react';
import { TableRow, TableCell } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Eye, RotateCcw } from 'lucide-react';

interface ScrapingJob {
  id: string;
  job_type: string;
  target_url: string;
  status: string;
  started_at?: string;
  completed_at?: string;
  created_at: string;
  data_sources?: { name: string };
  vpn_proxies?: { name: string; country_code: string };
  [key: string]: unknown;
}

interface ScrapingJobRowProps {
  job: ScrapingJob;
  onViewResult: (job: ScrapingJob) => void;
  onRetry: (id: string) => void;
}

const ScrapingJobRow = ({ job, onViewResult, onRetry }: ScrapingJobRowProps) => {
  const getStatusBadge = (status: string) => {
    const statusColors = {
      'completed': 'bg-green-100 text-green-800',
      'failed': 'bg-red-100 text-red-800',
      'running': 'bg-blue-100 text-blue-800',
      'pending': 'bg-yellow-100 text-yellow-800'
    };
    
    return (
      <Badge className={statusColors[status as keyof typeof statusColors] || 'bg-gray-100 text-gray-800'}>
        {status}
      </Badge>
    );
  };

  const calculateDuration = () => {
    if (!job.started_at || !job.completed_at) return 'N/A';
    const start = new Date(job.started_at);
    const end = new Date(job.completed_at);
    const diffMs = end.getTime() - start.getTime();
    return `${(diffMs / 1000).toFixed(1)}s`;
  };

  return (
    <TableRow>
      <TableCell>
        <div>
          <div className="font-medium">{job.job_type}</div>
          <div className="text-sm text-muted-foreground truncate max-w-[200px]">
            {job.target_url}
          </div>
        </div>
      </TableCell>
      <TableCell>{getStatusBadge(job.status)}</TableCell>
      <TableCell>{job.data_sources?.name || 'N/A'}</TableCell>
      <TableCell>
        {job.vpn_proxies ? `${job.vpn_proxies.name} (${job.vpn_proxies.country_code})` : 'N/A'}
      </TableCell>
      <TableCell>{calculateDuration()}</TableCell>
      <TableCell>
        {job.started_at ? new Date(job.started_at).toLocaleString() : 'Not started'}
      </TableCell>
      <TableCell>
        <div className="flex gap-2">
          <Button size="sm" variant="outline" onClick={() => onViewResult(job)}>
            <Eye className="h-3 w-3" />
          </Button>
          {job.status === 'failed' && (
            <Button size="sm" variant="outline" onClick={() => onRetry(job.id)}>
              <RotateCcw className="h-3 w-3" />
            </Button>
          )}
        </div>
      </TableCell>
    </TableRow>
  );
};

export default ScrapingJobRow;
