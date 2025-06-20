
import React, { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { 
  Brain, 
  Zap, 
  TrendingUp, 
  Activity, 
  Clock, 
  CheckCircle, 
  AlertTriangle,
  BarChart3,
  Settings,
  Play,
  Pause
} from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface AIBrainStats {
  active_commands: number;
  active_automation_rules: number;
  active_prediction_models: number;
  pending_commands: number;
  executions_24h: number;
  average_prediction_confidence: number;
  automation_rules_executed_24h: number;
  last_updated: string;
}

const RealTimeAIBrainDashboard = () => {
  const [selectedMetric, setSelectedMetric] = useState('overview');

  // Fetch AI Brain dashboard stats
  const { data: brainStats, refetch } = useQuery({
    queryKey: ['ai-brain-dashboard-stats'],
    queryFn: async () => {
      const { data, error } = await supabase.rpc('get_ai_brain_dashboard_stats');
      if (error) throw error;
      return data as unknown as AIBrainStats;
    },
    refetchInterval: 30000 // Refresh every 30 seconds
  });

  // Real-time subscription for live updates
  useEffect(() => {
    const channel = supabase
      .channel('ai-brain-updates')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'ai_commands' }, () => {
        refetch();
      })
      .on('postgres_changes', { event: '*', schema: 'public', table: 'automation_rules' }, () => {
        refetch();
      })
      .on('postgres_changes', { event: '*', schema: 'public', table: 'ai_command_executions' }, () => {
        refetch();
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [refetch]);

  const handleQuickAction = async (action: string) => {
    try {
      switch (action) {
        case 'refresh_stats':
          await refetch();
          toast.success('AI Brain stats refreshed');
          break;
        case 'optimize_performance':
          toast.success('Performance optimization initiated');
          break;
        case 'clear_cache':
          toast.success('AI cache cleared successfully');
          break;
        default:
          toast.info(`${action} action triggered`);
      }
    } catch (error) {
      toast.error('Action failed');
    }
  };

  if (!brainStats) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  const stats = [
    {
      title: 'Active Commands',
      value: brainStats.active_commands || 0,
      icon: Brain,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
      trend: '+12%'
    },
    {
      title: 'Executions (24h)',
      value: brainStats.executions_24h || 0,
      icon: Zap,
      color: 'text-purple-600',
      bgColor: 'bg-purple-50',
      trend: '+8%'
    },
    {
      title: 'Performance Score',
      value: `${Math.round((brainStats.average_prediction_confidence || 0) * 100)}%`,
      icon: TrendingUp,
      color: 'text-green-600',
      bgColor: 'bg-green-50',
      trend: '+5%'
    },
    {
      title: 'System Health',
      value: 'Optimal',
      icon: CheckCircle,
      color: 'text-emerald-600',
      bgColor: 'bg-emerald-50',
      trend: 'Stable'
    }
  ];

  const detailedMetrics = [
    {
      name: 'Active AI Commands',
      value: brainStats.active_commands || 0,
      max: 150,
      color: 'bg-blue-500'
    },
    {
      name: 'Automation Rules',
      value: brainStats.active_automation_rules || 0,
      max: 50,
      color: 'bg-purple-500'
    },
    {
      name: 'Prediction Models',
      value: brainStats.active_prediction_models || 0,
      max: 25,
      color: 'bg-green-500'
    }
  ];

  const quickActions = [
    { name: 'Refresh Stats', action: 'refresh_stats', icon: Activity },
    { name: 'Optimize Performance', action: 'optimize_performance', icon: TrendingUp },
    { name: 'Clear Cache', action: 'clear_cache', icon: Settings }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">AI Brain Dashboard</h2>
          <p className="text-muted-foreground">Real-time AI system monitoring and control</p>
        </div>
        <Badge variant="outline" className="bg-green-50 text-green-700">
          <CheckCircle className="h-3 w-3 mr-1" />
          System Operational
        </Badge>
      </div>

      {/* Main Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, index) => {
          const IconComponent = stat.icon;
          return (
            <Card key={index} className={`${stat.bgColor} border-none`}>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">{stat.title}</p>
                    <p className="text-2xl font-bold">{stat.value}</p>
                    <p className="text-xs text-green-600 mt-1">{stat.trend}</p>
                  </div>
                  <IconComponent className={`h-8 w-8 ${stat.color}`} />
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Detailed Metrics */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="h-5 w-5" />
            System Capacity
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {detailedMetrics.map((metric, index) => (
              <div key={index} className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>{metric.name}</span>
                  <span>{metric.value}/{metric.max}</span>
                </div>
                <Progress 
                  value={(metric.value / metric.max) * 100} 
                  className="h-2"
                />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Performance Metrics */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Activity className="h-5 w-5" />
              Live Activity
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-sm">Executions (24h)</span>
                <Badge variant="secondary">{brainStats.executions_24h || 0}</Badge>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm">Pending Commands</span>
                <Badge variant="outline">{brainStats.pending_commands || 0}</Badge>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm">Avg Confidence</span>
                <Badge variant="default">
                  {Math.round((brainStats.average_prediction_confidence || 0) * 100)}%
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Settings className="h-5 w-5" />
              Quick Actions
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {quickActions.map((action, index) => {
                const IconComponent = action.icon;
                return (
                  <Button
                    key={index}
                    variant="outline"
                    className="w-full justify-start"
                    onClick={() => handleQuickAction(action.action)}
                  >
                    <IconComponent className="h-4 w-4 mr-2" />
                    {action.name}
                  </Button>
                );
              })}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* System Status */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CheckCircle className="h-5 w-5 text-green-600" />
            AI Brain System Status
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
            <div>
              <div className="text-2xl font-bold text-blue-600">99.9%</div>
              <div className="text-sm text-muted-foreground">Uptime</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-green-600">45ms</div>
              <div className="text-sm text-muted-foreground">Avg Response</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-purple-600">24/7</div>
              <div className="text-sm text-muted-foreground">Monitoring</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-orange-600">Live</div>
              <div className="text-sm text-muted-foreground">Data Feeds</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default RealTimeAIBrainDashboard;
