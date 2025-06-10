
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Pause, Play } from 'lucide-react';
import { ScrapingJob } from './types';

interface ActiveJobsSectionProps {
  jobs: ScrapingJob[];
}

const ActiveJobsSection: React.FC<ActiveJobsSectionProps> = ({ jobs }) => {
  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'running':
        return <Badge className="bg-blue-100 text-blue-800">Running</Badge>;
      case 'scheduled':
        return <Badge className="bg-yellow-100 text-yellow-800">Scheduled</Badge>;
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
        <CardTitle>Currently Running Jobs</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {jobs.map((job) => (
            <div key={job.id} className="border rounded-lg p-4 space-y-3">
              <div className="flex justify-between items-start">
                <div>
                  <h4 className="font-medium">{job.name}</h4>
                  <p className="text-sm text-gray-600">
                    Started {job.startTime} • {job.recordsProcessed}/{job.totalRecords} records
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  {getStatusBadge(job.status)}
                  <Button variant="outline" size="sm">
                    {job.status === 'running' ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                  </Button>
                </div>
              </div>
              
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Progress</span>
                  <span>{job.progress}%</span>
                </div>
                <Progress value={job.progress} className="h-2" />
              </div>
              
              <div className="grid grid-cols-3 gap-4 text-sm">
                <div>
                  <span className="text-gray-600">Success Rate:</span>
                  <span className="ml-1 font-medium">{job.successRate}%</span>
                </div>
                <div>
                  <span className="text-gray-600">ETA:</span>
                  <span className="ml-1 font-medium">{job.estimatedCompletion}</span>
                </div>
                <div>
                  <span className="text-gray-600">Status:</span>
                  <span className="ml-1 font-medium capitalize">{job.status}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default ActiveJobsSection;
