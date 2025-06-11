
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Database, Globe, Activity, CheckCircle } from 'lucide-react';

interface SourceStats {
  totalDataSources: number;
  activeDataSources: number;
  totalExternalSources: number;
  activeExternalSources: number;
  totalScrapingJobs: number;
  jobsLast24h: number;
}

interface DataSourcesStatsCardsProps {
  sourceStats?: SourceStats;
  dataSources: any[];
}

const DataSourcesStatsCards: React.FC<DataSourcesStatsCardsProps> = ({
  sourceStats,
  dataSources
}) => {
  return (
    <div className="grid gap-4 md:grid-cols-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Data Sources</CardTitle>
          <Database className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{sourceStats?.activeDataSources || 0}</div>
          <p className="text-xs text-muted-foreground">
            of {sourceStats?.totalDataSources || 0} total
          </p>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">External Sources</CardTitle>
          <Globe className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{sourceStats?.activeExternalSources || 0}</div>
          <p className="text-xs text-muted-foreground">
            of {sourceStats?.totalExternalSources || 0} total
          </p>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Scraping Jobs</CardTitle>
          <Activity className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{sourceStats?.totalScrapingJobs || 0}</div>
          <p className="text-xs text-muted-foreground">
            {sourceStats?.jobsLast24h || 0} in last 24h
          </p>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Success Rate</CardTitle>
          <CheckCircle className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            {dataSources.length > 0 
              ? ((dataSources.filter(s => (s.success_rate || 0) > 0.8).length / dataSources.length) * 100).toFixed(1)
              : 0}%
          </div>
          <Progress 
            value={dataSources.length > 0 
              ? (dataSources.filter(s => (s.success_rate || 0) > 0.8).length / dataSources.length) * 100 
              : 0} 
            className="mt-2" 
          />
        </CardContent>
      </Card>
    </div>
  );
};

export default DataSourcesStatsCards;
