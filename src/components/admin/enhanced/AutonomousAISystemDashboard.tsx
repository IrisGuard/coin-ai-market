
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useAutonomousAISystem } from '@/hooks/useAutonomousAISystem';
import { Brain, Search, Zap, Globe, TrendingUp, Activity, Database, Cpu } from 'lucide-react';

const AutonomousAISystemDashboard = () => {
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

  const stats = systemStats.data;

  return (
    <div className="space-y-6">
      {/* System Overview Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Autonomous AI System</h2>
          <p className="text-muted-foreground">
            Global intelligence network with real-time learning capabilities
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <Badge variant={isSystemReady ? "default" : "secondary"}>
            {isSystemReady ? "ACTIVE" : "INITIALIZING"}
          </Badge>
          <Badge variant="outline">
            Health: {systemHealthScore}%
          </Badge>
        </div>
      </div>

      {/* System Health & Capabilities */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Sources</CardTitle>
            <Database className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.total_sources || 0}</div>
            <p className="text-xs text-muted-foreground">
              Multi-category enabled: {stats?.multi_category_sources || 0}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Auto-Discovered</CardTitle>
            <Search className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.auto_discovered_sources || 0}</div>
            <p className="text-xs text-muted-foreground">
              Discovery rate: {stats ? Math.round((stats.auto_discovered_sources / stats.total_sources) * 100) : 0}%
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Learning Sessions</CardTitle>
            <Brain className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.learning_sessions_active || 0}</div>
            <p className="text-xs text-muted-foreground">
              Accuracy: +{stats?.ai_accuracy_improvement || 0}%
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Intelligence Score</CardTitle>
            <Cpu className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {Math.round((stats?.global_intelligence_score || 0) * 100)}%
            </div>
            <Progress value={Math.round((stats?.global_intelligence_score || 0) * 100)} className="mt-2" />
          </CardContent>
        </Card>
      </div>

      {/* Control Panel */}
      <Card>
        <CardHeader>
          <CardTitle>Autonomous Operations Control</CardTitle>
          <CardDescription>
            Execute autonomous AI operations across the global intelligence network
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-3">
            <Button
              onClick={() => executeSourceDiscovery.mutate()}
              disabled={isDiscovering}
              className="h-20 flex-col space-y-2"
            >
              <Search className="h-6 w-6" />
              <span>{isDiscovering ? 'Discovering...' : 'Source Discovery'}</span>
            </Button>

            <Button
              onClick={() => executeAILearning.mutate()}
              disabled={isLearning}
              className="h-20 flex-col space-y-2"
              variant="outline"
            >
              <Brain className="h-6 w-6" />
              <span>{isLearning ? 'Learning...' : 'AI Learning'}</span>
            </Button>

            <Button
              onClick={() => executeGlobalIntelligence.mutate('analyze')}
              disabled={isAnalyzing}
              className="h-20 flex-col space-y-2"
              variant="outline"
            >
              <Globe className="h-6 w-6" />
              <span>{isAnalyzing ? 'Analyzing...' : 'Global Analysis'}</span>
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Detailed Analytics */}
      <Tabs defaultValue="discovery" className="space-y-4">
        <TabsList>
          <TabsTrigger value="discovery">Source Discovery</TabsTrigger>
          <TabsTrigger value="learning">AI Learning</TabsTrigger>
          <TabsTrigger value="intelligence">Global Intelligence</TabsTrigger>
        </TabsList>

        <TabsContent value="discovery" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Discovery Configuration</CardTitle>
              <CardDescription>
                Autonomous source discovery patterns and results
              </CardDescription>
            </CardHeader>
            <CardContent>
              {discoveryConfigs.data && discoveryConfigs.data.length > 0 ? (
                <div className="space-y-4">
                  {discoveryConfigs.data.map((config: any, index: number) => (
                    <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                      <div>
                        <h4 className="font-medium">Discovery Event {index + 1}</h4>
                        <p className="text-sm text-muted-foreground">
                          {new Date(config.timestamp).toLocaleString()}
                        </p>
                      </div>
                      <Badge variant="outline">Active</Badge>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  <Search className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>Discovery configurations will appear after running source discovery</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="learning" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Learning Performance</CardTitle>
              <CardDescription>
                AI learning sessions and accuracy improvements
              </CardDescription>
            </CardHeader>
            <CardContent>
              {learningPerformance.data && learningPerformance.data.length > 0 ? (
                <div className="space-y-4">
                  {learningPerformance.data.map((session: any) => (
                    <div key={session.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div>
                        <h4 className="font-medium">Learning Session</h4>
                        <p className="text-sm text-muted-foreground">
                          Category: {session.category || 'General'}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          Sessions: {session.total_learning_sessions || 'N/A'}
                        </p>
                      </div>
                      <div className="text-right">
                        <div className="text-sm font-medium">
                          Accuracy: {Math.round((session.accuracy_score || 0) * 100)}%
                        </div>
                        <div className="text-sm text-muted-foreground">
                          Confidence: {Math.round((session.confidence_score_avg || 0) * 100)}%
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  <Brain className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>Learning performance data will appear after AI learning sessions</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="intelligence" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Global Source Intelligence</CardTitle>
              <CardDescription>
                Intelligence network data and geographic distribution
              </CardDescription>
            </CardHeader>
            <CardContent>
              {sourceIntelligence.data && sourceIntelligence.data.length > 0 ? (
                <div className="space-y-4">
                  {sourceIntelligence.data.map((intel: any) => (
                    <div key={intel.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div>
                        <h4 className="font-medium">{intel.name || 'Intelligence Source'}</h4>
                        <p className="text-sm text-muted-foreground">
                          Type: {intel.type || 'Unknown'}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          Region: {intel.geographic_region || 'Global'}
                        </p>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Badge variant={intel.is_active ? "default" : "secondary"}>
                          {intel.is_active ? 'Active' : 'Inactive'}
                        </Badge>
                        <div className="text-sm">
                          {Math.round((intel.success_rate || 0) * 100)}%
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  <Globe className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>Global intelligence data will appear after running intelligence analysis</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* System Capabilities */}
      <Card>
        <CardHeader>
          <CardTitle>Autonomous Capabilities</CardTitle>
          <CardDescription>
            Real-time system capabilities and status
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {Object.entries(autonomousCapabilities).map(([key, enabled]) => (
              <div key={key} className="flex items-center space-x-2">
                <div className={`w-2 h-2 rounded-full ${enabled ? 'bg-green-500' : 'bg-gray-300'}`} />
                <span className="text-sm capitalize">
                  {key.replace(/_/g, ' ')}
                </span>
                {enabled && <Badge variant="outline" className="text-xs">ACTIVE</Badge>}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AutonomousAISystemDashboard;
