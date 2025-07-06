
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  Brain, 
  Globe, 
  Zap, 
  TrendingUp, 
  Database,
  Activity,
  CheckCircle,
  AlertCircle,
  Loader2,
  Play,
  BarChart3
} from 'lucide-react';
import { useAutonomousAISystem } from '@/hooks/useAutonomousAISystem';

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

  const handleSourceDiscovery = () => {
    executeSourceDiscovery.mutate();
  };

  const handleAILearning = () => {
    executeAILearning.mutate({ category: 'coins', auto_learn: true });
  };

  const handleGlobalIntelligence = () => {
    executeGlobalIntelligence.mutate('analyze');
  };

  return (
    <div className="space-y-6">
      {/* System Overview Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold text-gray-900">Autonomous AI System</h2>
          <p className="text-gray-600 mt-1">Global intelligence network with real-time learning capabilities</p>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant={isSystemReady ? "default" : "secondary"} className="px-3 py-1">
            {isSystemReady ? (
              <>
                <CheckCircle className="w-4 h-4 mr-2" />
                System Ready
              </>
            ) : (
              <>
                <AlertCircle className="w-4 h-4 mr-2" />
                Initializing
              </>
            )}
          </Badge>
          <div className="text-right">
            <div className="text-sm text-gray-500">System Health</div>
            <div className="text-2xl font-bold text-green-600">{systemHealthScore}%</div>
          </div>
        </div>
      </div>

      {/* System Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Sources</CardTitle>
            <Database className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{systemStats.data?.total_sources || 0}</div>
            <p className="text-xs text-muted-foreground">
              Active data sources
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Multi-Category</CardTitle>
            <Globe className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{systemStats.data?.multi_category_sources || 0}</div>
            <p className="text-xs text-muted-foreground">
              Cross-category sources
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Auto-Discovered</CardTitle>
            <Brain className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{systemStats.data?.auto_discovered_sources || 0}</div>
            <p className="text-xs text-muted-foreground">
              AI-found sources
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">AI Accuracy</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{systemStats.data?.ai_accuracy_improvement || 0}%</div>
            <p className="text-xs text-muted-foreground">
              Improvement rate
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Control Panel */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Activity className="w-5 h-5" />
            Autonomous Operations Control
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Button
              onClick={handleSourceDiscovery}
              disabled={isDiscovering}
              className="h-20 flex flex-col items-center justify-center space-y-2"
            >
              {isDiscovering ? (
                <Loader2 className="w-6 h-6 animate-spin" />
              ) : (
                <Database className="w-6 h-6" />
              )}
              <span className="text-sm">
                {isDiscovering ? 'Discovering...' : 'Execute Source Discovery'}
              </span>
            </Button>

            <Button
              onClick={handleAILearning}
              disabled={isLearning}
              className="h-20 flex flex-col items-center justify-center space-y-2"
              variant="outline"
            >
              {isLearning ? (
                <Loader2 className="w-6 h-6 animate-spin" />
              ) : (
                <Brain className="w-6 h-6" />
              )}
              <span className="text-sm">
                {isLearning ? 'Learning...' : 'Execute AI Learning'}
              </span>
            </Button>

            <Button
              onClick={handleGlobalIntelligence}
              disabled={isAnalyzing}
              className="h-20 flex flex-col items-center justify-center space-y-2"
              variant="secondary"
            >
              {isAnalyzing ? (
                <Loader2 className="w-6 h-6 animate-spin" />
              ) : (
                <Globe className="w-6 h-6" />
              )}
              <span className="text-sm">
                {isAnalyzing ? 'Analyzing...' : 'Global Intelligence'}
              </span>
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* System Capabilities */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Autonomous Capabilities</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {Object.entries(autonomousCapabilities || {}).map(([key, enabled]) => (
              <div key={key} className="flex items-center justify-between">
                <span className="text-sm capitalize">{key.replace(/_/g, ' ')}</span>
                <Badge variant={enabled ? "default" : "secondary"}>
                  {enabled ? 'Active' : 'Inactive'}
                </Badge>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>System Performance</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <div className="flex justify-between text-sm mb-2">
                <span>Learning Sessions Active</span>
                <span>{systemStats.data?.learning_sessions_active || 0}</span>
              </div>
              <Progress value={(systemStats.data?.learning_sessions_active || 0) * 10} />
            </div>
            
            <div>
              <div className="flex justify-between text-sm mb-2">
                <span>Global Intelligence Score</span>
                <span>{Math.round((systemStats.data?.global_intelligence_score || 0) * 100)}%</span>
              </div>
              <Progress value={(systemStats.data?.global_intelligence_score || 0) * 100} />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Learning Performance Data */}
      {learningPerformance.data && learningPerformance.data.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="w-5 h-5" />
              AI Learning Performance
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {learningPerformance.data.slice(0, 5).map((performance: any, index: number) => (
                <div key={performance.id || index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div>
                    <div className="font-medium">{performance.category || 'General'}</div>
                    <div className="text-sm text-gray-600">
                      Sessions: {performance.total_learning_sessions || 0}
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-medium text-green-600">
                      +{Math.round((performance.accuracy_improvement || 0) * 100)}%
                    </div>
                    <div className="text-sm text-gray-600">
                      Confidence: {Math.round((performance.confidence_score_avg || 0) * 100)}%
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Source Intelligence Network */}
      {sourceIntelligence.data && sourceIntelligence.data.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Globe className="w-5 h-5" />
              Global Source Intelligence
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {sourceIntelligence.data.slice(0, 5).map((source: any, index: number) => (
                <div key={source.id || index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div>
                    <div className="font-medium">{source.intelligence_type || 'General Intelligence'}</div>
                    <div className="text-sm text-gray-600">
                      Region: {source.geographic_region || 'Global'}
                    </div>
                  </div>
                  <div className="text-right">
                    <Badge variant={source.auto_discovered ? "default" : "secondary"}>
                      {source.auto_discovered ? 'Auto-Discovered' : 'Manual'}
                    </Badge>
                    <div className="text-sm text-gray-600 mt-1">
                      Confidence: {Math.round((source.confidence_level || 0) * 100)}%
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* System Status Footer */}
      <div className="text-center text-sm text-gray-500 py-4">
        Next discovery scheduled: {systemStats.data?.next_discovery_scheduled || 'In 24 hours'} | 
        Last run: {systemStats.data?.last_discovery_run ? new Date(systemStats.data.last_discovery_run).toLocaleString() : 'Never'}
      </div>
    </div>
  );
};

export default AutonomousAISystemDashboard;
