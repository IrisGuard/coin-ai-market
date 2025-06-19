
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Activity, Database, Users, TrendingUp, Bot } from 'lucide-react';

const LiveSystemMetrics = () => {
  // Mock data for system metrics
  const systemData = {
    scrapingJobs: 12,
    aiCommands: 45,
    automationRules: 23,
    activeUsers: 156,
    totalCoins: 2847,
    liveAuctions: 34,
    lastUpdated: new Date()
  };

  const isHealthy = systemData.scrapingJobs > 0 && systemData.aiCommands > 0;

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4">
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-2xl font-bold text-blue-600">{systemData.scrapingJobs}</div>
              <p className="text-xs text-muted-foreground">Active Scrapers</p>
            </div>
            <Bot className="h-8 w-8 text-blue-600" />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-2xl font-bold text-green-600">{systemData.aiCommands}</div>
              <p className="text-xs text-muted-foreground">AI Commands</p>
            </div>
            <Activity className="h-8 w-8 text-green-600" />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-2xl font-bold text-purple-600">{systemData.automationRules}</div>
              <p className="text-xs text-muted-foreground">Auto Rules</p>
            </div>
            <Database className="h-8 w-8 text-purple-600" />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-2xl font-bold text-orange-600">{systemData.activeUsers}</div>
              <p className="text-xs text-muted-foreground">Active Users</p>
            </div>
            <Users className="h-8 w-8 text-orange-600" />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-2xl font-bold text-indigo-600">{systemData.totalCoins}</div>
              <p className="text-xs text-muted-foreground">Total Coins</p>
            </div>
            <Database className="h-8 w-8 text-indigo-600" />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-2xl font-bold text-red-600">{systemData.liveAuctions}</div>
              <p className="text-xs text-muted-foreground">Live Auctions</p>
            </div>
            <TrendingUp className="h-8 w-8 text-red-600" />
          </div>
        </CardContent>
      </Card>

      <Card className="md:col-span-3 lg:col-span-6">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Activity className="h-5 w-5" />
            System Health Status
            <Badge className={isHealthy ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}>
              {isHealthy ? 'OPERATIONAL' : 'DEGRADED'}
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-sm text-muted-foreground">
            Last updated: {systemData.lastUpdated.toLocaleTimeString()}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default LiveSystemMetrics;
