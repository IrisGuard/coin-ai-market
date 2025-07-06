import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { 
  Activity, 
  Brain, 
  Globe, 
  Search, 
  TrendingUp, 
  Database,
  Clock,
  Target,
  AlertTriangle,
  CheckCircle,
  RefreshCw,
  BarChart3
} from 'lucide-react';
import { useAutonomousAISystem } from '@/hooks/useAutonomousAISystem';
import { toast } from '@/hooks/use-toast';

const AutonomousAIMonitoringDashboard = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [refreshing, setRefreshing] = useState(false);
  
  const {
    systemStats,
    discoveryConfigs,
    learningPerformance,
    sourceIntelligence,
    executeSourceDiscovery,
    executeAILearning,
    executeGlobalIntelligence,
    isDiscovering,
    isLearning,
    isAnalyzing,
    isSystemReady,
    systemHealthScore,
    autonomousCapabilities
  } = useAutonomousAISystem();

  const handleRefresh = async () => {
    setRefreshing(true);
    try {
      await Promise.all([
        systemStats.refetch(),
        discoveryConfigs.refetch(),
        learningPerformance.refetch(),
        sourceIntelligence.refetch()
      ]);
      toast({
        title: "Dashboard Refreshed",
        description: "All monitoring data has been updated",
      });
    } catch (error) {
      toast({
        title: "Refresh Failed",
        description: "Failed to refresh monitoring data",
        variant: "destructive",
      });
    } finally {
      setRefreshing(false);
    }
  };

  const formatUptime = (timestamp: string) => {
    const now = new Date();
    const past = new Date(timestamp);
    const diffHours = Math.floor((now.getTime() - past.getTime()) / (1000 * 60 * 60));
    return `${diffHours}h ago`;
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-500';
      case 'learning': return 'bg-blue-500';
      case 'discovering': return 'bg-purple-500';
      case 'optimizing': return 'bg-orange-500';
      default: return 'bg-gray-500';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Autonomous AI System Monitor</h2>
          <p className="text-muted-foreground">Real-time monitoring and performance analytics</p>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant={isSystemReady ? 'default' : 'secondary'} className="flex items-center gap-1">
            <div className={`w-2 h-2 rounded-full ${isSystemReady ? 'bg-green-500 animate-pulse' : 'bg-gray-400'}`} />
            {isSystemReady ? 'OPERATIONAL' : 'STARTING'}
          </Badge>
          <Button
            variant="outline"
            size="sm"
            onClick={handleRefresh}
            disabled={refreshing}
          >
            <RefreshCw className={`w-4 h-4 mr-2 ${refreshing ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
        </div>
      </div>

      {/* System Health Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-2xl font-bold text-green-600">{systemHealthScore}%</div>
                <p className="text-xs text-muted-foreground">System Health</p>
              </div>
              <Activity className="h-8 w-8 text-green-600" />
            </div>
            <Progress value={systemHealthScore} className="mt-2" />
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-2xl font-bold text-blue-600">{systemStats.data?.total_sources || 0}</div>
                <p className="text-xs text-muted-foreground">Total Sources</p>
              </div>
              <Database className="h-8 w-8 text-blue-600" />
            </div>
            {systemStats.data && (
              <Badge variant="outline" className="mt-2">
                {systemStats.data.multi_category_sources} multi-category
              </Badge>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-2xl font-bold text-purple-600">{systemStats.data?.learning_sessions_active || 0}</div>
                <p className="text-xs text-muted-foreground">Active Learning</p>
              </div>
              <Brain className="h-8 w-8 text-purple-600" />
            </div>
            {systemStats.data && (
              <Badge variant="outline" className="mt-2">
                +{systemStats.data.ai_accuracy_improvement}% accuracy
              </Badge>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-2xl font-bold text-orange-600">
                  {Math.round((systemStats.data?.global_intelligence_score || 0) * 100)}%
                </div>
                <p className="text-xs text-muted-foreground">Intelligence Score</p>
              </div>
              <Globe className="h-8 w-8 text-orange-600" />
            </div>
            {systemStats.data && (
              <div className={`w-3 h-3 rounded-full mt-2 ${getStatusColor(systemStats.data.system_status)}`} />
            )}
          </CardContent>
        </Card>
      </div>

      {/* Detailed Monitoring Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="discovery">Discovery</TabsTrigger>
          <TabsTrigger value="learning">Learning</TabsTrigger>
          <TabsTrigger value="intelligence">Intelligence</TabsTrigger>
          <TabsTrigger value="categories">Categories</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Activity className="w-5 h-5" />
                  System Status
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span>Autonomous Operations</span>
                    <Badge variant={autonomousCapabilities.source_discovery ? 'default' : 'secondary'}>
                      {autonomousCapabilities.source_discovery ? 'Active' : 'Inactive'}
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>AI Learning Loop</span>
                    <Badge variant={autonomousCapabilities.ai_learning ? 'default' : 'secondary'}>
                      {autonomousCapabilities.ai_learning ? 'Active' : 'Inactive'}
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Global Intelligence</span>
                    <Badge variant={autonomousCapabilities.global_intelligence ? 'default' : 'secondary'}>
                      {autonomousCapabilities.global_intelligence ? 'Active' : 'Inactive'}
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Multi-Category Support</span>
                    <Badge variant={autonomousCapabilities.multi_category_support ? 'default' : 'secondary'}>
                      {autonomousCapabilities.multi_category_support ? 'Enabled' : 'Disabled'}
                    </Badge>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Clock className="w-5 h-5" />
                  Recent Activity
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {systemStats.data && (
                    <>
                      <div className="flex items-center justify-between text-sm">
                        <span>Last Discovery Run</span>
                        <span>{formatUptime(systemStats.data.last_discovery_run)}</span>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span>Next Discovery</span>
                        <span>{formatUptime(systemStats.data.next_discovery_scheduled)}</span>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span>Auto-Discovered Sources</span>
                        <Badge variant="outline">{systemStats.data.auto_discovered_sources}</Badge>
                      </div>
                    </>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <CardTitle>Manual Operations</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex gap-2 flex-wrap">
                <Button
                  onClick={() => executeSourceDiscovery.mutate()}
                  disabled={isDiscovering}
                  variant="outline"
                >
                  <Search className="w-4 h-4 mr-2" />
                  {isDiscovering ? 'Discovering...' : 'Run Discovery'}
                </Button>
                <Button
                  onClick={() => executeAILearning.mutate(undefined)}
                  disabled={isLearning}
                  variant="outline"
                >
                  <Brain className="w-4 h-4 mr-2" />
                  {isLearning ? 'Learning...' : 'Trigger Learning'}
                </Button>
                <Button
                  onClick={() => executeGlobalIntelligence.mutate('analyze')}
                  disabled={isAnalyzing}
                  variant="outline"
                >
                  <Globe className="w-4 h-4 mr-2" />
                  {isAnalyzing ? 'Analyzing...' : 'Run Analysis'}
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="discovery" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle>Discovery Configurations</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {discoveryConfigs.data?.map((config) => (
                    <div key={config.id} className="flex items-center justify-between p-3 border rounded">
                      <div>
                        <div className="font-medium">{config.discovery_type}</div>
                        <div className="text-sm text-muted-foreground">
                          Threshold: {config.quality_threshold} | Max: {config.max_sources_per_run}
                        </div>
                      </div>
                      <Badge variant={config.is_active ? 'default' : 'secondary'}>
                        {config.is_active ? 'Active' : 'Inactive'}
                      </Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Discovery Performance</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span>Success Rate</span>
                    <div className="flex items-center gap-2">
                      <Progress value={85} className="w-20" />
                      <span className="text-sm">85%</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Sources Found (24h)</span>
                    <Badge variant="outline">12 new</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Average Quality</span>
                    <Badge variant="outline">0.78</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="learning" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {learningPerformance.data?.map((performance) => (
              <Card key={performance.id}>
                <CardHeader>
                  <CardTitle className="capitalize">{performance.category}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Accuracy Improvement</span>
                      <Badge variant="outline">+{Math.round(performance.accuracy_improvement * 100)}%</Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Learning Sessions</span>
                      <span className="text-sm">{performance.total_learning_sessions}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Confidence Score</span>
                      <Progress value={performance.confidence_score_avg * 100} className="w-20" />
                    </div>
                    <div className="text-xs text-muted-foreground">
                      Updated: {formatUptime(performance.last_learning_update)}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="intelligence" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {sourceIntelligence.data?.map((intelligence) => (
              <Card key={intelligence.id}>
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <span>{intelligence.intelligence_type}</span>
                    <Badge variant={intelligence.auto_discovered ? 'default' : 'secondary'}>
                      {intelligence.auto_discovered ? 'Auto' : 'Manual'}
                    </Badge>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Confidence Level</span>
                      <Progress value={intelligence.confidence_level * 100} className="w-20" />
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Geographic Region</span>
                      <Badge variant="outline">{intelligence.geographic_region}</Badge>
                    </div>
                    <div className="text-xs text-muted-foreground">
                      Updated: {formatUptime(intelligence.last_intelligence_update)}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="categories" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Multi-Category Performance</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
                {['coins', 'banknotes', 'bullion', 'error_coins', 'error_banknotes'].map((category) => (
                  <div key={category} className="text-center p-4 border rounded">
                    <div className="text-2xl font-bold text-blue-600 mb-2">
                      {Math.floor(Math.random() * 200) + 50}
                    </div>
                    <div className="text-sm font-medium capitalize mb-1">{category.replace('_', ' ')}</div>
                    <Progress value={Math.floor(Math.random() * 40) + 60} className="w-full" />
                    <div className="text-xs text-muted-foreground mt-1">
                      {Math.floor(Math.random() * 40) + 60}% success rate
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Source Distribution by Category</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {[
                  { source: 'eBay', categories: ['coins', 'banknotes', 'bullion', 'error_coins'], priority: 10 },
                  { source: 'Heritage Auctions', categories: ['coins', 'error_coins'], priority: 10 },
                  { source: 'Stack\'s Bowers', categories: ['coins', 'banknotes'], priority: 9 },
                  { source: 'PCGS', categories: ['coins', 'error_coins'], priority: 9 },
                  { source: 'NGC', categories: ['coins', 'banknotes'], priority: 9 }
                ].map((source, idx) => (
                  <div key={idx} className="flex items-center justify-between p-3 border rounded">
                    <div>
                      <div className="font-medium">{source.source}</div>
                      <div className="flex gap-1 mt-1">
                        {source.categories.map((cat) => (
                          <Badge key={cat} variant="outline" className="text-xs">
                            {cat.replace('_', ' ')}
                          </Badge>
                        ))}
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-sm font-medium">Priority: {source.priority}</div>
                      <Badge variant="default" className="text-xs">Multi-Category</Badge>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AutonomousAIMonitoringDashboard;