
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Zap, Database, Brain, Shield, TrendingUp, 
  MonitorSpeaker, Settings, AlertTriangle
} from 'lucide-react';

// Import unified components
import UnifiedDataManager from './UnifiedDataManager';
import RealTimeSystemMonitor from '../RealTimeSystemMonitor';
import AIBrainControlPanel from './AIBrainControlPanel';
import { useEnhancedRealTimeData } from '@/hooks/admin/useEnhancedRealTimeData';

const SuperSystemIntegration = () => {
  const { 
    systemHealth, 
    monitoring, 
    dashboardStats, 
    securityStatus, 
    isLoading,
    error 
  } = useEnhancedRealTimeData();

  const systemModules = [
    {
      id: 'database',
      name: 'Database Management',
      icon: Database,
      status: systemHealth?.databaseStatus === 'connected' ? 'active' : 'inactive',
      description: 'Unified data management across all tables',
      metrics: {
        tables: 56,
        records: dashboardStats?.total_users + dashboardStats?.total_coins + dashboardStats?.total_transactions || 0,
        health: systemHealth?.status || 'unknown'
      }
    },
    {
      id: 'ai-brain',
      name: 'AI Brain System',
      icon: Brain,
      status: 'active',
      description: 'Advanced AI command processing and automation',
      metrics: {
        commands: 12,
        executions: 245,
        success_rate: 98.5
      }
    },
    {
      id: 'security',
      name: 'Security Suite',
      icon: Shield,
      status: securityStatus?.every((s: any) => s.resolved) ? 'active' : 'warning',
      description: 'Comprehensive security monitoring and protection',
      metrics: {
        otp: 'Secure (10min)',
        passwords: 'Protected',
        functions: 'Hardened'
      }
    },
    {
      id: 'monitoring',
      name: 'Real-time Monitoring',
      icon: MonitorSpeaker,
      status: monitoring?.isConnected ? 'active' : 'inactive',
      description: 'Live system performance and health monitoring',
      metrics: {
        active_users: monitoring?.metrics?.activeUsers || 0,
        system_load: monitoring?.metrics?.systemLoad?.toFixed(1) + '%' || 'N/A',
        response_time: monitoring?.metrics?.responseTime?.toFixed(0) + 'ms' || 'N/A'
      }
    },
    {
      id: 'analytics',
      name: 'Advanced Analytics',
      icon: TrendingUp,
      status: 'active',
      description: 'Deep insights and predictive analytics',
      metrics: {
        events: '50K+',
        insights: 'Real-time',
        predictions: 'ML-powered'
      }
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-500';
      case 'warning': return 'bg-yellow-500';
      case 'inactive': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  const getStatusVariant = (status: string) => {
    switch (status) {
      case 'active': return 'default';
      case 'warning': return 'secondary';
      case 'inactive': return 'destructive';
      default: return 'outline';
    }
  };

  if (error) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center gap-2 text-red-600">
            <AlertTriangle className="w-5 h-5" />
            <span>Error loading super system: {error}</span>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* System Overview */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Zap className="w-5 h-5" />
            Super System Integration
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {systemModules.map((module) => {
              const Icon = module.icon;
              return (
                <div key={module.id} className="p-4 border rounded-lg hover:shadow-md transition-shadow">
                  <div className="flex items-center justify-between mb-3">
                    <Icon className="w-6 h-6 text-blue-600" />
                    <div className="flex items-center gap-2">
                      <div className={`w-2 h-2 rounded-full ${getStatusColor(module.status)}`} />
                      <Badge variant={getStatusVariant(module.status)}>
                        {module.status}
                      </Badge>
                    </div>
                  </div>
                  
                  <h3 className="font-semibold mb-2">{module.name}</h3>
                  <p className="text-sm text-gray-600 mb-3">{module.description}</p>
                  
                  <div className="space-y-1">
                    {Object.entries(module.metrics).map(([key, value]) => (
                      <div key={key} className="flex justify-between text-xs">
                        <span className="text-gray-500 capitalize">{key.replace('_', ' ')}:</span>
                        <span className="font-medium">{value}</span>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Integrated Tools */}
      <Tabs defaultValue="data-manager" className="space-y-4">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="data-manager">Data Manager</TabsTrigger>
          <TabsTrigger value="monitoring">Live Monitoring</TabsTrigger>
          <TabsTrigger value="ai-brain">AI Brain</TabsTrigger>
          <TabsTrigger value="system-config">System Config</TabsTrigger>
        </TabsList>

        <TabsContent value="data-manager">
          <UnifiedDataManager />
        </TabsContent>

        <TabsContent value="monitoring">
          <RealTimeSystemMonitor />
        </TabsContent>

        <TabsContent value="ai-brain">
          <AIBrainControlPanel />
        </TabsContent>

        <TabsContent value="system-config">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Settings className="w-5 h-5" />
                System Configuration
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <h3 className="font-semibold">Security Settings</h3>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span>OTP Expiry:</span>
                      <Badge>10 minutes</Badge>
                    </div>
                    <div className="flex justify-between">
                      <span>Password Protection:</span>
                      <Badge>HIBP Enabled</Badge>
                    </div>
                    <div className="flex justify-between">
                      <span>Function Security:</span>
                      <Badge>Hardened</Badge>
                    </div>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <h3 className="font-semibold">Performance Settings</h3>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span>Real-time Updates:</span>
                      <Badge>30s interval</Badge>
                    </div>
                    <div className="flex justify-between">
                      <span>Cache Duration:</span>
                      <Badge>5 minutes</Badge>
                    </div>
                    <div className="flex justify-between">
                      <span>Query Timeout:</span>
                      <Badge>30 seconds</Badge>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default SuperSystemIntegration;
