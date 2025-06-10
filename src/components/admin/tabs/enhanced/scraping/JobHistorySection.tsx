
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { JobHistory } from './types';

interface JobHistorySectionProps {
  history: JobHistory[];
}

const JobHistorySection: React.FC<JobHistorySectionProps> = ({ history }) => {
  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'completed':
        return <Badge className="bg-green-100 text-green-800">Completed</Badge>;
      case 'failed':
        return <Badge className="bg-red-100 text-red-800">Failed</Badge>;
      default:
        return <Badge variant="secondary">Unknown</Badge>;
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Execution History</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {history.map((job, index) => (
            <div key={index} className="flex justify-between items-center p-3 border rounded">
              <div>
                <h4 className="font-medium">{job.name}</h4>
                <p className="text-sm text-gray-600">
                  {job.startTime} • Duration: {job.duration}
                </p>
              </div>
              <div className="text-right">
                <div className="flex items-center gap-2 mb-1">
                  {getStatusBadge(job.status)}
                  {job.errors > 0 && (
                    <Badge variant="destructive">{job.errors} errors</Badge>
                  )}
                </div>
                <p className="text-sm text-gray-600">
                  {job.recordsCollected.toLocaleString()} records
                </p>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default JobHistorySection;
