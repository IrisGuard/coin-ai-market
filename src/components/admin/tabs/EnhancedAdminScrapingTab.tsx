
import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import ScrapingHeader from './enhanced/scraping/ScrapingHeader';
import ScrapingStatsCards from './enhanced/scraping/ScrapingStatsCards';
import ActiveJobsSection from './enhanced/scraping/ActiveJobsSection';
import ScheduledJobsSection from './enhanced/scraping/ScheduledJobsSection';
import JobHistorySection from './enhanced/scraping/JobHistorySection';
import ScrapingSourcesSection from './enhanced/scraping/ScrapingSourcesSection';
import { ScrapingStats, ScrapingJob, ScheduledJob, JobHistory, ScrapingSource } from './enhanced/scraping/types';

const EnhancedAdminScrapingTab = () => {
  const [isCreatingJob, setIsCreatingJob] = useState(false);

  const scrapingStats: ScrapingStats = {
    totalJobs: 24,
    activeJobs: 8,
    successRate: 94.2,
    avgDuration: 45,
    dataCollected: 15420,
    lastRun: new Date().toLocaleString()
  };

  const activeJobs: ScrapingJob[] = [
    {
      id: '1',
      name: 'Heritage Auctions Daily Prices',
      status: 'running',
      progress: 65,
      startTime: '2 hours ago',
      estimatedCompletion: '45 minutes',
      recordsProcessed: 1250,
      totalRecords: 1920,
      successRate: 98.2
    },
    {
      id: '2',
      name: 'eBay Sold Listings Scraper',
      status: 'scheduled',
      progress: 0,
      startTime: 'In 30 minutes',
      estimatedCompletion: '2 hours',
      recordsProcessed: 0,
      totalRecords: 5000,
      successRate: 92.5
    },
    {
      id: '3',
      name: 'PCGS Population Data',
      status: 'completed',
      progress: 100,
      startTime: '4 hours ago',
      estimatedCompletion: 'Completed',
      recordsProcessed: 850,
      totalRecords: 850,
      successRate: 100
    }
  ];

  const scheduledJobs: ScheduledJob[] = [
    {
      name: 'Daily PCGS Updates',
      schedule: 'Daily at 6:00 AM',
      nextRun: 'Tomorrow 6:00 AM',
      target: 'pcgs.com',
      status: 'active'
    },
    {
      name: 'Weekly Heritage Catalog',
      schedule: 'Weekly on Sunday',
      nextRun: 'Sunday 2:00 PM',
      target: 'ha.com',
      status: 'active'
    },
    {
      name: 'eBay Price Monitor',
      schedule: 'Every 6 hours',
      nextRun: 'In 3 hours',
      target: 'ebay.com',
      status: 'paused'
    }
  ];

  const jobHistory: JobHistory[] = [
    {
      name: 'Heritage Auctions Daily Prices',
      startTime: '2 hours ago',
      duration: '42 minutes',
      status: 'completed',
      recordsCollected: 1920,
      errors: 0
    },
    {
      name: 'PCGS Population Data',
      startTime: '6 hours ago',
      duration: '18 minutes',
      status: 'completed',
      recordsCollected: 850,
      errors: 0
    },
    {
      name: 'eBay Sold Listings',
      startTime: '12 hours ago',
      duration: '1h 23m',
      status: 'completed',
      recordsCollected: 4750,
      errors: 12
    }
  ];

  const scrapingSources: ScrapingSource[] = [
    {
      name: 'Heritage Auctions',
      url: 'ha.com',
      status: 'active',
      lastScrape: '2 hours ago',
      successRate: 98.5,
      dataPoints: 15000
    },
    {
      name: 'PCGS Price Guide',
      url: 'pcgs.com',
      status: 'active',
      lastScrape: '6 hours ago',
      successRate: 99.2,
      dataPoints: 8500
    },
    {
      name: 'eBay Sold Listings',
      url: 'ebay.com',
      status: 'limited',
      lastScrape: '12 hours ago',
      successRate: 89.3,
      dataPoints: 25000
    }
  ];

  const handleCreateJob = () => {
    setIsCreatingJob(true);
  };

  return (
    <div className="space-y-6">
      <ScrapingHeader 
        stats={scrapingStats}
        onCreateJob={handleCreateJob}
      />

      <ScrapingStatsCards stats={scrapingStats} />

      <Tabs defaultValue="active" className="space-y-4">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="active">Active Jobs</TabsTrigger>
          <TabsTrigger value="scheduled">Scheduled</TabsTrigger>
          <TabsTrigger value="history">History</TabsTrigger>
          <TabsTrigger value="sources">Sources</TabsTrigger>
        </TabsList>

        <TabsContent value="active" className="space-y-4">
          <ActiveJobsSection jobs={activeJobs} />
        </TabsContent>

        <TabsContent value="scheduled" className="space-y-4">
          <ScheduledJobsSection jobs={scheduledJobs} />
        </TabsContent>

        <TabsContent value="history" className="space-y-4">
          <JobHistorySection history={jobHistory} />
        </TabsContent>

        <TabsContent value="sources" className="space-y-4">
          <ScrapingSourcesSection sources={scrapingSources} />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default EnhancedAdminScrapingTab;
