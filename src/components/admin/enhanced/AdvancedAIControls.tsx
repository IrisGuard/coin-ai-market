
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Brain, 
  Zap, 
  Settings, 
  TrendingUp, 
  Database, 
  Shield, 
  ChevronRight,
  Play,
  Pause,
  RotateCcw,
  AlertTriangle,
  CheckCircle,
  Clock,
  Activity
} from 'lucide-react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

const AdvancedAIControls = () => {
  const [activeSystem, setActiveSystem] = useState('error_detection');
  const [systemStatus, setSystemStatus] = useState({
    error_detection: 'active',
    market_analysis: 'active',
    price_prediction: 'active',
    image_processing: 'active'
  });

  const queryClient = useQueryClient();

  // AI System Control Mutations
  const controlSystemMutation = useMutation({
    mutationFn: async ({ system, action }: { system: string; action: string }) => {
      const { error } = await supabase
        .from('analytics_events')
        .insert({
          event_type: 'ai_system_control',
          page_url: '/admin/ai-controls',
          metadata: {
            system,
            action,
            timestamp: new Date().toISOString(),
            admin_user: 'system'
          }
        });

      if (error) throw error;

      // Simulate system state change
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      return { system, action };
    },
    onSuccess: ({ system, action }) => {
      setSystemStatus(prev => ({
        ...prev,
        [system]: action === 'start' ? 'active' : action === 'stop' ? 'inactive' : 'restarting'
      }));
      
      toast.success(`AI System ${action} completed for ${system.replace('_', ' ')}`);
      queryClient.invalidateQueries({ queryKey: ['ai-system-status'] });
    },
    onError: (error: any) => {
      toast.error(`Failed to control AI system: ${error.message}`);
    }
  });

  // Performance Optimization Mutation
  const optimizePerformanceMutation = useMutation({
    mutationFn: async () => {
      const { error } = await supabase
        .from('analytics_events')
        .insert({
          event_type: 'ai_performance_optimization',
          page_url: '/admin/ai-controls',
          metadata: {
            optimization_type: 'comprehensive',
            systems_optimized: Object.keys(systemStatus),
            timestamp: new Date().toISOString()
          }
        });

      if (error) throw error;
      
      await new Promise(resolve => setTimeout(resolve, 3000));
      return { optimized: true };
    },
    onSuccess: () => {
      toast.success('AI Performance optimization completed');
      queryClient.invalidateQueries({ queryKey: ['ai-performance-metrics'] });
    },
    onError: (error: any) => {
      toast.error(`Optimization failed: ${error.message}`);
    }
  });

  const aiSystems = [
    {
      id: 'error_detection',
      name: 'Error Detection AI',
      description: 'Advanced coin error pattern recognition',
      status: systemStatus.error_detection,
      accuracy: 98.7,
      performance: 95,
      icon: AlertTriangle,
      color: 'text-orange-600'
    },
    {
      id: 'market_analysis',
      name: 'Market Analysis Engine',
      description: 'Real-time market intelligence and pricing',
      status: systemStatus.market_analysis,
      accuracy: 94.2,
      performance: 88,
      icon: TrendingUp,
      color: 'text-green-600'
    },
    {
      id: 'price_prediction',
      name: 'Price Prediction Model',
      description: 'AI-powered value estimation algorithms',
      status: systemStatus.price_prediction,
      accuracy: 92.5,
      performance: 91,
      icon: Brain,
      color: 'text-purple-600'
    },
    {
      id: 'image_processing',
      name: 'Image Processing AI',
      description: 'Visual analysis and enhancement systems',
      status: systemStatus.image_processing,
      accuracy: 96.8,
      performance: 93,
      icon: Zap,
      color: 'text-blue-600'
    }
  ];

  const performanceMetrics = {
    cpu_usage: 45,
    memory_usage: 67,
    gpu_usage: 78,
    network_throughput: 85,
    queue_size: 12,
    processing_speed: 1247
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'text-green-600 bg-green-100';
      case 'inactive': return 'text-red-600 bg-red-100';
      case 'restarting': return 'text-yellow-600 bg-yellow-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active': return CheckCircle;
      case 'inactive': return AlertTriangle;
      case 'restarting': return Clock;
      default: return Activity;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Advanced AI Controls</h2>
          <p className="text-muted-foreground">Manage and monitor AI systems performance</p>
        </div>
        <Button
          onClick={() => optimizePerformanceMutation.mutate()}
          disabled={optimizePerformanceMutation.isPending}
          className="flex items-center gap-2"
        >
          <Settings className="h-4 w-4" />
          {optimizePerformanceMutation.isPending ? 'Optimizing...' : 'Optimize All Systems'}
        </Button>
      </div>

      {/* System Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {aiSystems.map((system) => {
          const StatusIcon = getStatusIcon(system.status);
          const SystemIcon = system.icon;
          
          return (
            <Card key={system.id} className="hover:shadow-md transition-shadow">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <SystemIcon className={`h-6 w-6 ${system.color}`} />
                  <Badge className={getStatusColor(system.status)}>
                    <StatusIcon className="h-3 w-3 mr-1" />
                    {system.status}
                  </Badge>
                </div>
                <CardTitle className="text-lg">{system.name}</CardTitle>
                <p className="text-sm text-muted-foreground">{system.description}</p>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Accuracy</span>
                    <span className="font-medium">{system.accuracy}%</span>
                  </div>
                  <Progress value={system.accuracy} className="h-2" />
                </div>
                
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Performance</span>
                    <span className="font-medium">{system.performance}%</span>
                  </div>
                  <Progress value={system.performance} className="h-2" />
                </div>

                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => controlSystemMutation.mutate({ 
                      system: system.id, 
                      action: system.status === 'active' ? 'stop' : 'start' 
                    })}
                    disabled={controlSystemMutation.isPending}
                    className="flex-1"
                  >
                    {system.status === 'active' ? (
                      <>
                        <Pause className="h-3 w-3 mr-1" />
                        Stop
                      </>
                    ) : (
                      <>
                        <Play className="h-3 w-3 mr-1" />
                        Start
                      </>
                    )}
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => controlSystemMutation.mutate({ 
                      system: system.id, 
                      action: 'restart' 
                    })}
                    disabled={controlSystemMutation.isPending}
                  >
                    <RotateCcw className="h-3 w-3" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Detailed Controls */}
      <Tabs value={activeSystem} onValueChange={setActiveSystem}>
        <TabsList className="grid grid-cols-4 w-full">
          {aiSystems.map((system) => (
            <TabsTrigger key={system.id} value={system.id} className="text-xs">
              {system.name.split(' ')[0]}
            </TabsTrigger>
          ))}
        </TabsList>

        {aiSystems.map((system) => (
          <TabsContent key={system.id} value={system.id} className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <system.icon className={`h-5 w-5 ${system.color}`} />
                  {system.name} Configuration
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* System-specific configuration would go here */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-blue-600">
                      {system.id === 'error_detection' ? '1,247' : 
                       system.id === 'market_analysis' ? '89,234' :
                       system.id === 'price_prediction' ? '45,123' : '67,890'}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {system.id === 'error_detection' ? 'Patterns Detected' : 
                       system.id === 'market_analysis' ? 'Data Points' :
                       system.id === 'price_prediction' ? 'Predictions Made' : 'Images Processed'}
                    </div>
                  </div>
                  
                  <div className="text-center">
                    <div className="text-2xl font-bold text-green-600">
                      {system.id === 'error_detection' ? '34ms' : 
                       system.id === 'market_analysis' ? '156ms' :
                       system.id === 'price_prediction' ? '89ms' : '67ms'}
                    </div>
                    <div className="text-sm text-muted-foreground">Avg Response Time</div>
                  </div>
                  
                  <div className="text-center">
                    <div className="text-2xl font-bold text-purple-600">
                      {system.accuracy}%
                    </div>
                    <div className="text-sm text-muted-foreground">Current Accuracy</div>
                  </div>
                  
                  <div className="text-center">
                    <div className="text-2xl font-bold text-orange-600">
                      {system.id === 'error_detection' ? '24/7' : 
                       system.id === 'market_analysis' ? '99.9%' :
                       system.id === 'price_prediction' ? '98.7%' : '99.2%'}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {system.id === 'error_detection' ? 'Uptime' : 'Reliability'}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        ))}
      </Tabs>

      {/* Performance Metrics */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Activity className="h-5 w-5" />
            System Performance Metrics
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>CPU Usage</span>
                <span className="font-medium">{performanceMetrics.cpu_usage}%</span>
              </div>
              <Progress value={performanceMetrics.cpu_usage} className="h-2" />
            </div>
            
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Memory</span>
                <span className="font-medium">{performanceMetrics.memory_usage}%</span>
              </div>
              <Progress value={performanceMetrics.memory_usage} className="h-2" />
            </div>
            
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>GPU Usage</span>
                <span className="font-medium">{performanceMetrics.gpu_usage}%</span>
              </div>
              <Progress value={performanceMetrics.gpu_usage} className="h-2" />
            </div>
            
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Network</span>
                <span className="font-medium">{performanceMetrics.network_throughput}%</span>
              </div>
              <Progress value={performanceMetrics.network_throughput} className="h-2" />
            </div>
            
            <div className="text-center">
              <div className="text-xl font-bold text-blue-600">{performanceMetrics.queue_size}</div>
              <div className="text-xs text-muted-foreground">Queue Size</div>
            </div>
            
            <div className="text-center">
              <div className="text-xl font-bold text-green-600">{performanceMetrics.processing_speed}</div>
              <div className="text-xs text-muted-foreground">Ops/sec</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdvancedAIControls;
