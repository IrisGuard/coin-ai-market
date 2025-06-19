
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { 
  Bot, 
  Play, 
  TrendingUp, 
  Clock,
  Database,
  RefreshCw
} from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

interface ScrapingStatsCardsProps {
  stats?: {
    totalJobs: number;
    activeJobs: number;
    successRate: number;
    avgDuration: number;
    dataCollected: number;
    lastRun: string;
  };
}

interface JobMetadata {
  status?: string;
  duration_ms?: number;
  records_collected?: number;
  [key: string]: any;
}

const ScrapingStatsCards: React.FC<ScrapingStatsCardsProps> = ({ stats: providedStats }) => {
  // Fetch real scraping statistics from data sources
  const { data: scrapingStats, isLoading } = useQuery({
    queryKey: ['scraping-stats'],
    queryFn: async () => {
      const { data: dataSources, error: dsError } = await supabase
        .from('data_sources')
        .select('*');
      
      if (dsError) throw dsError;

      const { data: recentJobs, error: jobsError } = await supabase
        .from('analytics_events')
        .select('*')
        .ilike('event_type', '%scraping%')
        .order('timestamp', { ascending: false })
        .limit(100);
      
      if (jobsError) throw jobsError;

      const totalJobs = dataSources?.length || 0;
      const activeJobs = dataSources?.filter(ds => ds.is_active)?.length || 0;
      const recentJobsCount = recentJobs?.length || 0;
      
      // Calculate success rate from recent jobs
      const successfulJobs = recentJobs?.filter(job => {
        const metadata = job.metadata as JobMetadata;
        return metadata?.status === 'success' || 
               job.event_type.includes('complete');
      })?.length || 0;
      
      const successRate = recentJobsCount > 0 ? 
        Math.round((successfulJobs / recentJobsCount) * 100) : 100;

      // Calculate average duration from metadata
      const jobsWithDuration = recentJobs?.filter(job => {
        const metadata = job.metadata as JobMetadata;
        return metadata?.duration_ms;
      }) || [];
      
      const avgDuration = jobsWithDuration.length > 0 ?
        Math.round(
          jobsWithDuration.reduce((sum, job) => {
            const metadata = job.metadata as JobMetadata;
            return sum + ((metadata.duration_ms || 0) / 60000);
          }, 0) / jobsWithDuration.length
        ) : 5;

      // Estimate data collected
      const dataCollected = recentJobs?.reduce((sum, job) => {
        const metadata = job.metadata as JobMetadata;
        return sum + (metadata?.records_collected || 10);
      }, 0) || 0;

      // Get last run time
      const lastRun = recentJobs?.[0]?.timestamp ? 
        new Date(recentJobs[0].timestamp).toLocaleString() : 
        'Not available';

      return {
        totalJobs,
        activeJobs,
        successRate,
        avgDuration,
        dataCollected,
        lastRun
      };
    },
    refetchInterval: 60000 // Refresh every minute
  });

  const stats = providedStats || scrapingStats || {
    totalJobs: 0,
    activeJobs: 0,
    successRate: 0,
    avgDuration: 0,
    dataCollected: 0,
    lastRun: 'Loading...'
  };

  if (isLoading && !providedStats) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-6 gap-4">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <Card key={i}>
            <CardContent className="p-4">
              <div className="animate-pulse space-y-2">
                <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                <div className="h-6 bg-gray-200 rounded w-3/4"></div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-6 gap-4">
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center gap-2">
            <Bot className="w-4 h-4 text-blue-600" />
            <div>
              <p className="text-xs text-gray-600">Total Jobs</p>
              <p className="text-xl font-bold">{stats.totalJobs}</p>
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
              <p className="text-xl font-bold">{stats.activeJobs}</p>
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
              <p className="text-xl font-bold">{stats.successRate}%</p>
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
              <p className="text-xl font-bold">{stats.avgDuration}m</p>
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
              <p className="text-xl font-bold">{stats.dataCollected.toLocaleString()}</p>
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
              <p className="text-xs font-medium">{stats.lastRun}</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ScrapingStatsCards;
