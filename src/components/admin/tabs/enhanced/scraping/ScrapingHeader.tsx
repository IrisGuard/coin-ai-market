
import React from 'react';
import { Button } from '@/components/ui/button';
import { Bot, Calendar, Settings } from 'lucide-react';
import { ScrapingStats } from './types';

interface ScrapingHeaderProps {
  stats: ScrapingStats;
  onCreateJob: () => void;
}

const ScrapingHeader: React.FC<ScrapingHeaderProps> = ({ stats, onCreateJob }) => {
  return (
    <div className="flex items-center justify-between">
      <div>
        <h3 className="text-lg font-semibold">Advanced Scraping Management</h3>
        <p className="text-sm text-muted-foreground">
          Intelligent data collection from {stats.totalJobs} configured sources
        </p>
      </div>
      <div className="flex items-center gap-2">
        <Button 
          variant="outline" 
          size="sm"
          onClick={onCreateJob}
        >
          <Bot className="h-4 w-4 mr-2" />
          New Job
        </Button>
        <Button variant="outline" size="sm">
          <Calendar className="h-4 w-4 mr-2" />
          Schedule
        </Button>
        <Button variant="outline" size="sm">
          <Settings className="h-4 w-4 mr-2" />
          Settings
        </Button>
      </div>
    </div>
  );
};

export default ScrapingHeader;
