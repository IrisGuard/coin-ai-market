
export interface ScrapingStats {
  totalJobs: number;
  activeJobs: number;
  successRate: number;
  avgDuration: number;
  dataCollected: number;
  lastRun: string;
}

export interface ScrapingJob {
  id: string;
  name: string;
  status: 'running' | 'scheduled' | 'completed' | 'failed';
  progress: number;
  startTime: string;
  estimatedCompletion: string;
  recordsProcessed: number;
  totalRecords: number;
  successRate: number;
}

export interface ScheduledJob {
  name: string;
  schedule: string;
  nextRun: string;
  target: string;
  status: 'active' | 'paused';
}

export interface JobHistory {
  name: string;
  startTime: string;
  duration: string;
  status: 'completed' | 'failed';
  recordsCollected: number;
  errors: number;
}

export interface ScrapingSource {
  name: string;
  url: string;
  status: 'active' | 'limited' | 'inactive';
  lastScrape: string;
  successRate: number;
  dataPoints: number;
}
