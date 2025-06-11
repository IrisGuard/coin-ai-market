
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { 
  Bot, 
  Play, 
  Pause, 
  Eye, 
  RotateCcw,
  Activity,
  CheckCircle,
  AlertCircle,
  Clock,
  Database,
  Shield
} from 'lucide-react';

const EnhancedAdminScrapingTab = () => {
  const [selectedJob, setSelectedJob] = useState<any>(null);

  // Mock scraping jobs
  const mockJobs = [
    {
      id: '1',
      job_type: 'coin_price_scraping',
      target_url: 'https://www.pcgs.com/prices',
      status: 'completed',
      source_id: 'src_001',
      proxy_id: 'proxy_001',
      created_at: new Date(Date.now() - 30 * 60 * 1000).toISOString(),
      started_at: new Date(Date.now() - 28 * 60 * 1000).toISOString(),
      completed_at: new Date(Date.now() - 25 * 60 * 1000).toISOString(),
      duration: 180,
      items_scraped: 1247
    },
    {
      id: '2',
      job_type: 'auction_monitoring',
      target_url: 'https://api.ha.com/auctions',
      status: 'running',
      source_id: 'src_002',
      proxy_id: null,
      created_at: new Date(Date.now() - 15 * 60 * 1000).toISOString(),
      started_at: new Date(Date.now() - 10 * 60 * 1000).toISOString(),
      completed_at: null,
      duration: null,
      items_scraped: 89
    },
    {
      id: '3',
      job_type: 'market_data_collection',
      target_url: 'https://www.ebay.com/sch/coins',
      status: 'failed',
      source_id: 'src_003',
      proxy_id: 'proxy_002',
      created_at: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
      started_at: new Date(Date.now() - 115 * 60 * 1000).toISOString(),
      completed_at: new Date(Date.now() - 110 * 60 * 1000).toISOString(),
      duration: 300,
      items_scraped: 0,
      error: 'Rate limit exceeded'
    },
    {
      id: '4',
      job_type: 'certification_sync',
      target_url: 'https://www.ngccoin.com/registry',
      status: 'pending',
      source_id: 'src_004',
      proxy_id: 'proxy_003',
      created_at: new Date(Date.now() - 5 * 60 * 1000).toISOString(),
      started_at: null,
      completed_at: null,
      duration: null,
      items_scraped: 0
    }
  ];

  // Mock proxies
  const mockProxies = [
    {
      id: 'proxy_001',
      name: 'US Residential Proxy 1',
      type: 'residential',
      country_code: 'US',
      is_active: true,
      success_rate: 94.5,
      last_used: new Date(Date.now() - 25 * 60 * 1000).toISOString()
    },
    {
      id: 'proxy_002',
      name: 'EU Datacenter Proxy',
      type: 'datacenter',
      country_code: 'DE',
      is_active: true,
      success_rate: 87.2,
      last_used: new Date(Date.now() - 110 * 60 * 1000).toISOString()
    },
    {
      id: 'proxy_003',
      name: 'Asia Pacific Proxy',
      type: 'residential',
      country_code: 'SG',
      is_active: true,
      success_rate: 91.8,
      last_used: new Date().toISOString()
    }
  ];

  const scrapingStats = {
    total_jobs: mockJobs.length,
    running_jobs: mockJobs.filter(j => j.status === 'running').length,
    completed_jobs: mockJobs.filter(j => j.status === 'completed').length,
    failed_jobs: mockJobs.filter(j => j.status === 'failed').length,
    success_rate: 75.0,
    items_scraped_24h: 3421
  };

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

  const getTimeAgo = (timestamp: string | null) => {
    if (!timestamp) return '-';
    const now = new Date();
    const time = new Date(timestamp);
    const diff = now.getTime() - time.getTime();
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(minutes / 60);

    if (hours > 0) return `${hours}h ago`;
    return `${minutes}m ago`;
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold">Advanced Web Scraping Management</h3>
          <p className="text-sm text-muted-foreground">Monitor and manage automated data collection</p>
        </div>
        <Button>
          <Play className="h-4 w-4 mr-2" />
          Start New Job
        </Button>
      </div>

      {/* Scraping Statistics */}
      <div className="grid gap-4 md:grid-cols-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Jobs</CardTitle>
            <Bot className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{scrapingStats.total_jobs}</div>
            <p className="text-xs text-muted-foreground">all time</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Running</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{scrapingStats.running_jobs}</div>
            <p className="text-xs text-muted-foreground">active jobs</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Completed</CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{scrapingStats.completed_jobs}</div>
            <p className="text-xs text-muted-foreground">successful</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Failed</CardTitle>
            <AlertCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{scrapingStats.failed_jobs}</div>
            <p className="text-xs text-muted-foreground">with errors</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Success Rate</CardTitle>
            <Database className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{scrapingStats.success_rate}%</div>
            <p className="text-xs text-muted-foreground">overall rate</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Items (24h)</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{scrapingStats.items_scraped_24h.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">items collected</p>
          </CardContent>
        </Card>
      </div>

      {/* Scraping Jobs */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Scraping Jobs</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {mockJobs.map((job) => (
              <div key={job.id} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <span className="font-medium">{job.job_type.replace('_', ' ')}</span>
                    {getStatusBadge(job.status)}
                    {job.proxy_id && (
                      <Badge variant="outline">
                        Proxy: {job.proxy_id.slice(-3)}
                      </Badge>
                    )}
                  </div>
                  <div className="text-sm text-muted-foreground truncate max-w-md">
                    {job.target_url}
                  </div>
                  <div className="flex gap-4 text-xs text-muted-foreground mt-1">
                    <span>Created: {getTimeAgo(job.created_at)}</span>
                    {job.duration && <span>Duration: {job.duration}s</span>}
                    <span>Items: {job.items_scraped}</span>
                    {job.error && <span className="text-red-600">Error: {job.error}</span>}
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Button variant="outline" size="sm" onClick={() => setSelectedJob(job)}>
                    <Eye className="h-4 w-4" />
                  </Button>
                  <Button variant="outline" size="sm">
                    <RotateCcw className="h-4 w-4" />
                  </Button>
                  {job.status === 'running' ? (
                    <Button variant="outline" size="sm">
                      <Pause className="h-4 w-4" />
                    </Button>
                  ) : (
                    <Button variant="outline" size="sm">
                      <Play className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Proxy Management */}
      <Card>
        <CardHeader>
          <CardTitle>Proxy Management</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {mockProxies.map((proxy) => (
              <div key={proxy.id} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-center gap-4">
                  <div className="p-2 bg-muted rounded-lg">
                    <Shield className="h-4 w-4" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-medium">{proxy.name}</span>
                      <Badge variant={proxy.is_active ? 'default' : 'secondary'}>
                        {proxy.is_active ? 'Active' : 'Inactive'}
                      </Badge>
                      <Badge variant="outline">{proxy.type}</Badge>
                      <Badge variant="outline">{proxy.country_code}</Badge>
                    </div>
                    <div className="text-xs text-muted-foreground mt-1">
                      Success rate: {proxy.success_rate}% • Last used: {getTimeAgo(proxy.last_used)}
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Button variant="outline" size="sm">
                    <Play className="h-4 w-4" />
                    Test
                  </Button>
                  <Button variant="outline" size="sm">
                    Edit
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default EnhancedAdminScrapingTab;
