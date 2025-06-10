
import React from 'react';
import { TableRow, TableCell } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Eye, RotateCcw } from 'lucide-react';

interface ScrapingJob {
  id: string;
  job_type: string;
  target_url: string;
  status: string;
  result?: any;
  created_at: string;
  started_at?: string;
  completed_at?: string;
  source_id?: string;
  proxy_id?: string;
}

interface ScrapingJobRowProps {
  job: ScrapingJob;
  onViewResult: (job: ScrapingJob) => void;
  onRetry: (jobId: string) => void;
}

const ScrapingJobRow: React.FC<ScrapingJobRowProps> = ({ job, onViewResult, onRetry }) => {
  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'completed':
        return <Badge className="bg-green-100 text-green-800">Completed</Badge>;
      case 'running':
        return <Badge className="bg-blue-100 text-blue-800">Running</Badge>;
      case 'failed':
        return <Badge className="bg-red-100 text-red-800">Failed</Badge>;
      case 'pending':
        return <Badge className="bg-yellow-100 text-yellow-800">Pending</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const getDuration = () => {
    if (!job.started_at) return '-';
    const start = new Date(job.started_at);
    const end = job.completed_at ? new Date(job.completed_at) : new Date();
    const diff = end.getTime() - start.getTime();
    return `${Math.floor(diff / 1000)}s`;
  };

  return (
    <TableRow>
      <TableCell>
        <div>
          <div className="font-medium">{job.job_type}</div>
          <div className="text-sm text-muted-foreground truncate max-w-xs">
            {job.target_url}
          </div>
        </div>
      </TableCell>
      <TableCell>{getStatusBadge(job.status)}</TableCell>
      <TableCell>
        <Badge variant="outline">
          {job.source_id ? `Source: ${job.source_id.slice(0, 8)}...` : 'N/A'}
        </Badge>
      </TableCell>
      <TableCell>
        <Badge variant="outline">
          {job.proxy_id ? `Proxy: ${job.proxy_id.slice(0, 8)}...` : 'Direct'}
        </Badge>
      </TableCell>
      <TableCell>{getDuration()}</TableCell>
      <TableCell>
        {job.started_at ? new Date(job.started_at).toLocaleString() : '-'}
      </TableCell>
      <TableCell>
        <div className="flex gap-1">
          <Button
            variant="outline"
            size="sm"
            onClick={() => onViewResult(job)}
            disabled={!job.result}
          >
            <Eye className="h-3 w-3" />
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => onRetry(job.id)}
            disabled={job.status === 'running'}
          >
            <RotateCcw className="h-3 w-3" />
          </Button>
        </div>
      </TableCell>
    </TableRow>
  );
};

export default ScrapingJobRow;
