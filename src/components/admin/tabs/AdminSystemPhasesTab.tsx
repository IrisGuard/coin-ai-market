
// 📊 SYSTEM PHASES MONITORING TAB
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { 
  CheckCircle, Clock, AlertTriangle, PlayCircle, 
  Settings, Rocket, Database, Users, Coins, Brain
} from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

interface SystemPhase {
  id: string;
  phase_number: number;
  phase_name: string;
  phase_description: string;
  status: 'pending' | 'in_progress' | 'completed' | 'failed';
  completion_percentage: number;
  required_components: string[];
  completed_components: string[];
  missing_components: string[];
  dependencies: any;
  start_date: string;
  completion_date: string;
  created_at: string;
  updated_at: string;
}

const AdminSystemPhasesTab = () => {
  const [phases, setPhases] = useState<SystemPhase[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadPhases();
  }, []);

  const loadPhases = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('system_phases')
        .select('*')
        .order('phase_number');

      if (!error && data) {
        setPhases(data);
      }
    } catch (error) {
      console.error('Error loading phases:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="h-5 w-5 text-green-600" />;
      case 'in_progress':
        return <PlayCircle className="h-5 w-5 text-blue-600" />;
      case 'failed':
        return <AlertTriangle className="h-5 w-5 text-red-600" />;
      default:
        return <Clock className="h-5 w-5 text-gray-400" />;
    }
  };

  const getStatusBadge = (status: string) => {
    const variants = {
      completed: 'default',
      in_progress: 'secondary',
      failed: 'destructive',
      pending: 'outline'
    } as const;

    return (
      <Badge variant={variants[status as keyof typeof variants] || 'outline'}>
        {status.replace('_', ' ').toUpperCase()}
      </Badge>
    );
  };

  const getPhaseIcon = (phaseNumber: number) => {
    const icons = [
      Settings, Database, Users, Coins, Brain, 
      Rocket, Settings, Database, Users, Brain,
      Settings, Database, Users, Coins, Rocket
    ];
    const IconComponent = icons[phaseNumber - 1] || Settings;
    return <IconComponent className="h-6 w-6" />;
  };

  const overallProgress = phases.length > 0 
    ? Math.round(phases.reduce((sum, phase) => sum + phase.completion_percentage, 0) / phases.length)
    : 0;

  const completedPhases = phases.filter(p => p.status === 'completed').length;
  const inProgressPhases = phases.filter(p => p.status === 'in_progress').length;
  const failedPhases = phases.filter(p => p.status === 'failed').length;

  return (
    <div className="space-y-6">
      {/* 📊 OVERALL PROGRESS */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-3">
            <Rocket className="h-6 w-6 text-blue-600" />
            System Development Progress
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-lg font-semibold">Overall Completion</span>
              <span className="text-2xl font-bold text-blue-600">{overallProgress}%</span>
            </div>
            
            <Progress value={overallProgress} className="h-3" />
            
            <div className="grid grid-cols-4 gap-4 mt-6">
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">{completedPhases}</div>
                <div className="text-sm text-muted-foreground">Completed</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">{inProgressPhases}</div>
                <div className="text-sm text-muted-foreground">In Progress</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-red-600">{failedPhases}</div>
                <div className="text-sm text-muted-foreground">Failed</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-gray-600">{phases.length}</div>
                <div className="text-sm text-muted-foreground">Total Phases</div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 🎯 PHASES LIST */}
      <div className="space-y-4">
        {phases.map((phase) => (
          <Card key={phase.id} className={`
            ${phase.status === 'completed' ? 'border-green-200 bg-green-50' : ''}
            ${phase.status === 'in_progress' ? 'border-blue-200 bg-blue-50' : ''}
            ${phase.status === 'failed' ? 'border-red-200 bg-red-50' : ''}
          `}>
            <CardContent className="pt-6">
              <div className="flex items-start justify-between">
                <div className="flex items-start gap-4 flex-1">
                  <div className="flex-shrink-0">
                    {getPhaseIcon(phase.phase_number)}
                  </div>
                  
                  <div className="flex-1 space-y-2">
                    <div className="flex items-center gap-3">
                      <h3 className="text-lg font-semibold">
                        Phase {phase.phase_number}: {phase.phase_name}
                      </h3>
                      {getStatusIcon(phase.status)}
                      {getStatusBadge(phase.status)}
                    </div>
                    
                    <p className="text-muted-foreground">
                      {phase.phase_description}
                    </p>
                    
                    {phase.completion_percentage > 0 && (
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span>Progress</span>
                          <span>{phase.completion_percentage}%</span>
                        </div>
                        <Progress value={phase.completion_percentage} className="h-2" />
                      </div>
                    )}
                    
                    {/* COMPLETED COMPONENTS */}
                    {phase.completed_components && phase.completed_components.length > 0 && (
                      <div className="space-y-2">
                        <div className="text-sm font-medium text-green-600">
                          ✅ Completed Components:
                        </div>
                        <div className="flex flex-wrap gap-1">
                          {phase.completed_components.map((component, index) => (
                            <Badge key={index} variant="default" className="text-xs">
                              {component}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )}
                    
                    {/* MISSING COMPONENTS */}
                    {phase.missing_components && phase.missing_components.length > 0 && (
                      <div className="space-y-2">
                        <div className="text-sm font-medium text-red-600">
                          ❌ Missing Components:
                        </div>
                        <div className="flex flex-wrap gap-1">
                          {phase.missing_components.map((component, index) => (
                            <Badge key={index} variant="destructive" className="text-xs">
                              {component}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
                
                <div className="flex flex-col items-end gap-2 ml-4">
                  {phase.start_date && (
                    <div className="text-xs text-muted-foreground">
                      Started: {new Date(phase.start_date).toLocaleDateString()}
                    </div>
                  )}
                  {phase.completion_date && (
                    <div className="text-xs text-muted-foreground">
                      Completed: {new Date(phase.completion_date).toLocaleDateString()}
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default AdminSystemPhasesTab;
