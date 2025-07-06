import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  Brain, 
  Globe, 
  TrendingUp, 
  Zap, 
  Search, 
  Database,
  Activity,
  Target,
  Cpu,
  Network,
  BarChart3,
  Settings,
  AlertCircle
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
    systemHealthScore,
    autonomousCapabilities
  } = useAutonomousAISystem();

  const stats = systemStats.data;
  const configs = discoveryConfigs.data || [];
  const performance = learningPerformance.data || [];
  const intelligence = sourceIntelligence.data || [];

  return (
    <div className="space-y-6">
      {/* System Status Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold flex items-center gap-3">
            <Brain className="w-8 h-8 text-blue-600" />
            Autonomous AI System
          </h2>
          <p className="text-muted-foreground mt-1">
            Global Intelligence Network - Self-Learning & Discovery
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Badge variant={stats?.system_status === 'active' ? 'default' : 'secondary'} className="flex items-center gap-2">
            <Activity className="w-4 h-4" />
            {stats?.system_status || 'Initializing'}
          </Badge>
          <Badge variant="outline" className="flex items-center gap-2">
            <Target className="w-4 h-4" />
            Health: {systemHealthScore}%
          </Badge>
        </div>
      </div>

      {/* System Health Overview */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Cpu className="w-5 h-5" />
            System Health & Performance
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">{stats?.total_sources || 0}</div>
              <div className="text-sm text-muted-foreground">Total Sources</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">{stats?.multi_category_sources || 0}</div>
              <div className="text-sm text-muted-foreground">Multi-Category</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-600">{stats?.auto_discovered_sources || 0}</div>
              <div className="text-sm text-muted-foreground">Auto-Discovered</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-orange-600">{stats?.learning_sessions_active || 0}</div>
              <div className="text-sm text-muted-foreground">Learning Sessions</div>
            </div>
          </div>
          
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">System Health Score</span>
              <span className="text-sm text-muted-foreground">{systemHealthScore}%</span>
            </div>
            <Progress value={systemHealthScore} className="h-2" />
          </div>
        </CardContent>
      </Card>

      {/* Autonomous Capabilities Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Source Discovery */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Search className="w-5 h-5 text-blue-600" />
              Source Discovery
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm">Active Configs</span>
              <Badge variant="outline">{configs.length}</Badge>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm">Discovery Status</span>
              <Badge variant={isDiscovering ? 'default' : 'secondary'}>
                {isDiscovering ? 'Running' : 'Ready'}
              </Badge>
            </div>
            <Button 
              onClick={() => executeSourceDiscovery.mutate()}
              disabled={isDiscovering}
              className="w-full"
              size="sm"
            >
              {isDiscovering ? (
                <>
                  <Activity className="w-4 h-4 mr-2 animate-spin" />
                  Discovering...
                </>
              ) : (
                <>
                  <Search className="w-4 h-4 mr-2" />
                  Execute Discovery
                </>
              )}
            </Button>
          </CardContent>
        </Card>

        {/* AI Learning Engine */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Brain className="w-5 h-5 text-green-600" />
              AI Learning Engine
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm">Accuracy Improvement</span>
              <Badge variant="outline">+{stats?.ai_accuracy_improvement || 0}%</Badge>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm">Learning Status</span>
              <Badge variant={isLearning ? 'default' : 'secondary'}>
                {isLearning ? 'Learning' : 'Ready'}
              </Badge>
            </div>
            <Button 
              onClick={() => executeAILearning.mutate()}
              disabled={isLearning}
              className="w-full"
              size="sm"
            >
              {isLearning ? (
                <>
                  <Activity className="w-4 h-4 mr-2 animate-spin" />
                  Learning...
                </>
              ) : (
                <>
                  <Brain className="w-4 h-4 mr-2" />
                  Execute Learning
                </>
              )}
            </Button>
          </CardContent>
        </Card>

        {/* Global Intelligence */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Globe className="w-5 h-5 text-purple-600" />
              Global Intelligence
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm">Intelligence Score</span>
              <Badge variant="outline">{Math.round((stats?.global_intelligence_score || 0) * 100)}%</Badge>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm">Analysis Status</span>
              <Badge variant={isAnalyzing ? 'default' : 'secondary'}>
                {isAnalyzing ? 'Analyzing' : 'Ready'}
              </Badge>
            </div>
            <Button 
              onClick={() => executeGlobalIntelligence.mutate('analyze')}
              disabled={isAnalyzing}
              className="w-full"
              size="sm"
            >
              {isAnalyzing ? (
                <>
                  <Activity className="w-4 h-4 mr-2 animate-spin" />
                  Analyzing...
                </>
              ) : (
                <>
                  <Globe className="w-4 h-4 mr-2" />
                  Execute Analysis
                </>
              )}
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Detailed Analytics */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Learning Performance */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5" />
              AI Learning Performance
            </CardTitle>
          </CardHeader>
          <CardContent>
            {performance.length > 0 ? (
              <div className="space-y-4">
                {performance.slice(0, 5).map((perf, index) => (
                  <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                    <div>
                      <div className="font-medium">{perf.category}</div>
                      <div className="text-sm text-muted-foreground">
                        {perf.total_learning_sessions} sessions
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-medium text-green-600">
                        +{Math.round(perf.accuracy_improvement * 100)}%
                      </div>
                      <div className="text-sm text-muted-foreground">
                        {Math.round(perf.confidence_score_avg * 100)}% confidence
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                No learning performance data available
              </div>
            )}
          </CardContent>
        </Card>

        {/* Global Intelligence Insights */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Network className="w-5 h-5" />
              Intelligence Network
            </CardTitle>
          </CardHeader>
          <CardContent>
            {intelligence.length > 0 ? (
              <div className="space-y-4">
                {intelligence.slice(0, 5).map((intel, index) => (
                  <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                    <div>
                      <div className="font-medium">{intel.intelligence_type}</div>
                      <div className="text-sm text-muted-foreground">
                        {intel.geographic_region}
                      </div>
                    </div>
                    <div className="text-right">
                      <Badge variant={intel.auto_discovered ? 'default' : 'secondary'}>
                        {intel.auto_discovered ? 'Auto' : 'Manual'}
                      </Badge>
                      <div className="text-sm text-muted-foreground mt-1">
                        {Math.round(intel.confidence_level * 100)}% confidence
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                No intelligence data available
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* System Capabilities Status */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Settings className="w-5 h-5" />
            Autonomous Capabilities
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            {Object.entries(autonomousCapabilities).map(([capability, enabled]) => (
              <div key={capability} className="flex items-center gap-2">
                <div className={`w-3 h-3 rounded-full ${enabled ? 'bg-green-500' : 'bg-gray-300'}`} />
                <span className="text-sm capitalize">
                  {capability.replace(/_/g, ' ')}
                </span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* System Status Alert */}
      {systemHealthScore < 70 && (
        <Alert>
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            System health is below optimal levels. Consider running discovery and learning operations to improve performance.
          </AlertDescription>
        </Alert>
      )}
    </div>
  );
};

export default AutonomousAISystemDashboard;