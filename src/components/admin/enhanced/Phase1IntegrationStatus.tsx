import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { 
  CheckCircle, 
  Clock, 
  Zap, 
  Brain, 
  Database, 
  Eye, 
  Target,
  ArrowRight,
  Activity
} from 'lucide-react';

interface PhaseStatus {
  id: string;
  name: string;
  description: string;
  status: 'completed' | 'in_progress' | 'pending';
  progress: number;
  components: string[];
}

const Phase1IntegrationStatus = () => {
  const phases: PhaseStatus[] = [
    {
      id: 'enhanced_recognition',
      name: 'Enhanced AI Recognition Engine',
      description: 'Coinoscope-style multi-provider analysis system',
      status: 'completed',
      progress: 100,
      components: [
        'CoinoscopeStyleAnalyzer.tsx',
        'Enhanced useEnhancedCoinRecognition hook',
        'Multi-stage analysis pipeline',
        'Confidence scoring system'
      ]
    },
    {
      id: 'realtime_connection',
      name: 'Real-Time Admin-Dealer Connection',
      description: 'Live monitoring and validation system',
      status: 'completed',
      progress: 100,
      components: [
        'RealTimeAdminConnection.tsx',
        'WebSocket-based activity monitoring',
        'Live dealer activity feed',
        'Admin quick actions panel'
      ]
    },
    {
      id: 'data_integration',
      name: 'Comprehensive Data Integration',
      description: 'Enhanced database and market intelligence',
      status: 'in_progress',
      progress: 60,
      components: [
        'Market intelligence APIs',
        'Error coin detection system',
        'Cross-referenced coin database',
        'Automated category suggestions'
      ]
    },
    {
      id: 'ux_implementation',
      name: 'Coinoscope-Style UX Implementation',
      description: 'Progressive upload and smart auto-fill',
      status: 'pending',
      progress: 0,
      components: [
        'Progressive image upload interface',
        'Smart auto-fill system',
        'Visual confidence indicators',
        'Advanced filtering capabilities'
      ]
    },
    {
      id: 'production_optimization',
      name: 'Production-Ready Optimizations',
      description: 'Performance, security, and analytics',
      status: 'pending',
      progress: 0,
      components: [
        'Bulk processing optimization',
        'Error handling & fallbacks',
        'Security enhancements',
        'Analytics & reporting system'
      ]
    }
  ];

  const getStatusIcon = (status: PhaseStatus['status']) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case 'in_progress':
        return <Clock className="h-5 w-5 text-blue-500 animate-pulse" />;
      default:
        return <Target className="h-5 w-5 text-gray-400" />;
    }
  };

  const getStatusBadge = (status: PhaseStatus['status']) => {
    switch (status) {
      case 'completed':
        return <Badge className="bg-green-100 text-green-800">Completed</Badge>;
      case 'in_progress':
        return <Badge className="bg-blue-100 text-blue-800">In Progress</Badge>;
      default:
        return <Badge variant="outline">Pending</Badge>;
    }
  };

  const overallProgress = phases.reduce((sum, phase) => sum + phase.progress, 0) / phases.length;
  const completedPhases = phases.filter(p => p.status === 'completed').length;

  return (
    <div className="space-y-6">
      {/* Overall Status */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Brain className="h-6 w-6 text-primary" />
              Phase 1: Enhanced AI Recognition Integration
            </div>
            <Badge className="bg-primary text-white">
              {Math.round(overallProgress)}% Complete
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <div className="flex justify-between text-sm mb-2">
                <span>Overall Progress</span>
                <span>{completedPhases}/{phases.length} phases completed</span>
              </div>
              <Progress value={overallProgress} className="h-3" />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="text-center p-3 bg-green-50 rounded-lg">
                <CheckCircle className="h-6 w-6 mx-auto mb-2 text-green-600" />
                <p className="font-semibold text-green-600">{completedPhases}</p>
                <p className="text-sm text-green-600">Completed</p>
              </div>
              
              <div className="text-center p-3 bg-blue-50 rounded-lg">
                <Clock className="h-6 w-6 mx-auto mb-2 text-blue-600" />
                <p className="font-semibold text-blue-600">
                  {phases.filter(p => p.status === 'in_progress').length}
                </p>
                <p className="text-sm text-blue-600">In Progress</p>
              </div>
              
              <div className="text-center p-3 bg-gray-50 rounded-lg">
                <Target className="h-6 w-6 mx-auto mb-2 text-gray-600" />
                <p className="font-semibold text-gray-600">
                  {phases.filter(p => p.status === 'pending').length}
                </p>
                <p className="text-sm text-gray-600">Pending</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Phase Details */}
      <div className="space-y-4">
        {phases.map((phase, index) => (
          <Card key={phase.id}>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  {getStatusIcon(phase.status)}
                  <div>
                    <h3 className="font-semibold">{phase.name}</h3>
                    <p className="text-sm text-muted-foreground">{phase.description}</p>
                  </div>
                </div>
                {getStatusBadge(phase.status)}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {phase.progress > 0 && (
                  <div>
                    <div className="flex justify-between text-sm mb-2">
                      <span>Progress</span>
                      <span>{phase.progress}%</span>
                    </div>
                    <Progress value={phase.progress} className="h-2" />
                  </div>
                )}
                
                <div>
                  <h4 className="font-medium text-sm mb-2">Components:</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                    {phase.components.map((component, idx) => (
                      <div key={idx} className="flex items-center gap-2 text-sm">
                        {phase.status === 'completed' ? (
                          <CheckCircle className="h-3 w-3 text-green-500" />
                        ) : phase.status === 'in_progress' ? (
                          <Clock className="h-3 w-3 text-blue-500" />
                        ) : (
                          <div className="h-3 w-3 rounded-full border border-gray-300" />
                        )}
                        <span className={phase.status === 'completed' ? 'text-green-700' : ''}>
                          {component}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Next Phase Trigger */}
      <Card className="border-primary/20 bg-primary/5">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Zap className="h-5 w-5 text-primary" />
            Ready for Phase 2?
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">Phase 1 Components Delivered:</p>
              <p className="text-sm text-muted-foreground">
                Enhanced AI Recognition Engine with Coinoscope-style analysis
              </p>
              <p className="text-sm text-muted-foreground">
                Real-time Admin-Dealer connection system
              </p>
            </div>
            <Button 
              className="flex items-center gap-2"
              disabled={overallProgress < 60}
            >
              Approve Phase 2
              <ArrowRight className="h-4 w-4" />
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Phase1IntegrationStatus;