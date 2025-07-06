
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Database, Globe, Activity, CheckCircle } from 'lucide-react';

interface SourceStats {
  totalDataSources: number;
  activeDataSources: number;
  totalExternalSources: number;
  activeExternalSources: number;
  totalGlobalSources: number;
  activeGlobalSources: number;
  totalScrapingJobs: number;
  jobsLast24h: number;
}

interface DataSourcesStatsCardsProps {
  sourceStats?: SourceStats;
  dataSources: any[];
  globalCoinSources: any[];
}

const DataSourcesStatsCards: React.FC<DataSourcesStatsCardsProps> = ({
  sourceStats,
  dataSources,
  globalCoinSources
}) => {
  const totalGlobalSources = sourceStats?.totalGlobalSources || 0;
  const activeGlobalSources = sourceStats?.activeGlobalSources || 0;
  const globalSuccessRate = globalCoinSources.length > 0 
    ? globalCoinSources.reduce((sum, source) => sum + (source.success_rate || 0), 0) / globalCoinSources.length * 100
    : 0;

  return (
    <div className="grid gap-4 md:grid-cols-5">
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
          <CardTitle className="text-sm font-medium">Premium Global</CardTitle>
          <Globe className="h-4 w-4 text-orange-500" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-orange-600">{activeGlobalSources}</div>
          <p className="text-xs text-muted-foreground">
            of {totalGlobalSources} premium sources
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
          <CardTitle className="text-sm font-medium">Global Success Rate</CardTitle>
          <CheckCircle className="h-4 w-4 text-green-500" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-green-600">
            {globalSuccessRate.toFixed(1)}%
          </div>
          <Progress 
            value={globalSuccessRate} 
            className="mt-2" 
          />
        </CardContent>
      </Card>
    </div>
  );
};

export default DataSourcesStatsCards;
