
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { 
  Bot, 
  Play, 
  Pause, 
  Settings, 
  RefreshCw, 
  Calendar,
  Clock,
  AlertCircle,
  CheckCircle,
  TrendingUp,
  Database
} from 'lucide-react';

const EnhancedAdminScrapingTab = () => {
  const [selectedJob, setSelectedJob] = useState<string | null>(null);
  const [isCreatingJob, setIsCreatingJob] = useState(false);

  const scrapingStats = {
    totalJobs: 24,
    activeJobs: 8,
    successRate: 94.2,
    avgDuration: 45,
    dataCollected: 15420,
    lastRun: new Date().toLocaleString()
  };

  const activeJobs = [
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
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold">Advanced Scraping Management</h3>
          <p className="text-sm text-muted-foreground">
            Intelligent data collection from {scrapingStats.totalJobs} configured sources
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => setIsCreatingJob(true)}
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

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-6 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Bot className="w-4 h-4 text-blue-600" />
              <div>
                <p className="text-xs text-gray-600">Total Jobs</p>
                <p className="text-xl font-bold">{scrapingStats.totalJobs}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Play className="w-4 h-4 text-green-600" />
              <div>
                <p className="text-xs text-gray-600">Active</p>
                <p className="text-xl font-bold">{scrapingStats.activeJobs}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-purple-600" />
              <div>
                <p className="text-xs text-gray-600">Success Rate</p>
                <p className="text-xl font-bold">{scrapingStats.successRate}%</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-orange-600" />
              <div>
                <p className="text-xs text-gray-600">Avg Duration</p>
                <p className="text-xl font-bold">{scrapingStats.avgDuration}m</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Database className="w-4 h-4 text-cyan-600" />
              <div>
                <p className="text-xs text-gray-600">Data Collected</p>
                <p className="text-xl font-bold">{scrapingStats.dataCollected.toLocaleString()}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <RefreshCw className="w-4 h-4 text-indigo-600" />
              <div>
                <p className="text-xs text-gray-600">Last Run</p>
                <p className="text-xs font-medium">{scrapingStats.lastRun}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <Tabs defaultValue="active" className="space-y-4">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="active">Active Jobs</TabsTrigger>
          <TabsTrigger value="scheduled">Scheduled</TabsTrigger>
          <TabsTrigger value="history">History</TabsTrigger>
          <TabsTrigger value="sources">Sources</TabsTrigger>
        </TabsList>

        <TabsContent value="active" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Currently Running Jobs</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {activeJobs.map((job) => (
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
        </TabsContent>

        <TabsContent value="scheduled" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Scheduled Scraping Jobs</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Job Name</TableHead>
                    <TableHead>Schedule</TableHead>
                    <TableHead>Next Run</TableHead>
                    <TableHead>Target</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {[
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
                  ].map((job, index) => (
                    <TableRow key={index}>
                      <TableCell className="font-medium">{job.name}</TableCell>
                      <TableCell>{job.schedule}</TableCell>
                      <TableCell>{job.nextRun}</TableCell>
                      <TableCell>{job.target}</TableCell>
                      <TableCell>
                        {getStatusBadge(job.status)}
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          <Button variant="outline" size="sm">Edit</Button>
                          <Button variant="outline" size="sm">Run Now</Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="history" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Execution History</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[
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
                ].map((job, index) => (
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
        </TabsContent>

        <TabsContent value="sources" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Scraping Sources Configuration</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {[
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
                ].map((source) => (
                  <Card key={source.name}>
                    <CardContent className="p-4">
                      <div className="space-y-3">
                        <div className="flex justify-between items-start">
                          <div>
                            <h4 className="font-medium">{source.name}</h4>
                            <p className="text-sm text-gray-600">{source.url}</p>
                          </div>
                          {getStatusBadge(source.status)}
                        </div>
                        
                        <div className="space-y-2 text-sm">
                          <div className="flex justify-between">
                            <span>Success Rate:</span>
                            <span className="font-medium">{source.successRate}%</span>
                          </div>
                          <div className="flex justify-between">
                            <span>Data Points:</span>
                            <span className="font-medium">{source.dataPoints.toLocaleString()}</span>
                          </div>
                          <div className="flex justify-between">
                            <span>Last Scrape:</span>
                            <span className="font-medium">{source.lastScrape}</span>
                          </div>
                        </div>
                        
                        <div className="flex gap-2">
                          <Button variant="outline" size="sm" className="flex-1">
                            Configure
                          </Button>
                          <Button variant="outline" size="sm" className="flex-1">
                            Test
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default EnhancedAdminScrapingTab;
