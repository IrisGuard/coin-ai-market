import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Brain, Zap, Settings, Activity, TrendingUp, Database, BookOpen, Cpu, Network, Layers } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useAIStats } from '@/hooks/useAIStats';

const AdminAISection = () => {
  const { data: aiData, isLoading } = useAIStats();

  // Icon mapping for dynamic rendering
  const iconMap = {
    'Brain': Brain,
    'Activity': Activity,
    'Database': Database,
    'Zap': Zap,
    'BookOpen': BookOpen,
    'Cpu': Cpu,
    'Network': Network,
    'Layers': Layers,
    'TrendingUp': TrendingUp,
    'Settings': Settings
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <Card key={i} className="animate-pulse">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <div className="h-4 bg-gray-200 rounded w-20"></div>
                <div className="h-4 w-4 bg-gray-200 rounded"></div>
              </CardHeader>
              <CardContent>
                <div className="h-8 bg-gray-200 rounded w-16 mb-2"></div>
                <div className="h-3 bg-gray-200 rounded w-24"></div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  const aiStats = [
    { 
      label: 'Active Commands', 
      value: aiData?.activeCommands?.toLocaleString() || '0', 
      icon: Brain, 
      color: 'text-purple-600' 
    },
    { 
      label: 'Daily Executions', 
      value: aiData?.dailyExecutions?.toLocaleString() || '0', 
      icon: Activity, 
      color: 'text-blue-600' 
    },
    { 
      label: 'Success Rate', 
      value: `${aiData?.successRate || 0}%`, 
      icon: TrendingUp, 
      color: 'text-green-600' 
    },
    { 
      label: 'Automation Rules', 
      value: aiData?.automationRules?.toLocaleString() || '0', 
      icon: Zap, 
      color: 'text-orange-600' 
    }
  ];

  return (
    <div className="space-y-6">
      {/* AI System Statistics - REAL DATA */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {aiStats.map((stat) => {
          const IconComponent = stat.icon;
          return (
            <Card key={stat.label}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">{stat.label}</CardTitle>
                <IconComponent className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className={`text-2xl font-bold ${stat.color}`}>{stat.value}</div>
                <p className="text-xs text-muted-foreground">Real AI System metrics</p>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* THOUSANDS OF AI FUNCTIONS - SPECIAL HIGHLIGHT */}
      <Card className="border-2 border-purple-200 bg-gradient-to-r from-purple-50 to-indigo-50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-purple-700">
            <Brain className="h-6 w-6" />
            AI BRAIN - THOUSANDS OF FUNCTIONS ACTIVE
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center">
            <div className="text-5xl font-bold text-purple-600 mb-2">
              {(aiData?.tables?.reduce((sum, table) => sum + table.records, 0) || 0).toLocaleString()}
            </div>
            <p className="text-lg text-gray-600">Total AI Functions & Records</p>
          </div>
        </CardContent>
      </Card>

      {/* AI Tables Grid - REAL DATA */}
      <div className="grid gap-4 md:grid-cols-2">
        {aiData?.tables?.map((table) => {
          const IconComponent = iconMap[table.icon as keyof typeof iconMap] || Brain;
          return (
            <Card key={table.name} className="hover:shadow-md transition-shadow">
              <CardHeader className="pb-3">
                <div className="flex items-center gap-2">
                  <IconComponent className="h-5 w-5 text-purple-600" />
                  <CardTitle className="text-lg">{table.name}</CardTitle>
                  <Badge variant="secondary" className="bg-purple-100 text-purple-800">
                    {table.status}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-3">{table.description}</p>
                
                <div className="flex justify-between items-center mb-3">
                  <div className="text-sm">
                    <span className="font-medium text-lg text-purple-600">
                      {table.records.toLocaleString()}
                    </span> records
                  </div>
                  <Badge variant="outline" className="text-xs">
                    {table.category}
                  </Badge>
                </div>

                <div className="flex gap-2">
                  <Button variant="outline" size="sm" className="flex-1">
                    View Data
                  </Button>
                  <Button variant="outline" size="sm" className="flex-1">
                    Manage
                  </Button>
                </div>
              </CardContent>
            </Card>
          );
        }) || []}
      </div>

      {/* AI System Health - REAL DATA */}
      <Card>
        <CardHeader>
          <CardTitle>AI System Health - Real-Time Metrics</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {[
              { 
                metric: 'Response Time', 
                value: `${aiData?.health?.responseTime || 0}ms`, 
                status: aiData?.health?.responseTime && aiData.health.responseTime < 500 ? 'excellent' : 'normal', 
                color: aiData?.health?.responseTime && aiData.health.responseTime < 500 ? 'text-green-600' : 'text-yellow-600' 
              },
              { 
                metric: 'Error Rate', 
                value: `${aiData?.health?.errorRate || 0}%`, 
                status: aiData?.health?.errorRate && aiData.health.errorRate < 1 ? 'excellent' : 'normal', 
                color: aiData?.health?.errorRate && aiData.health.errorRate < 1 ? 'text-green-600' : 'text-yellow-600' 
              },
              { 
                metric: 'Queue Length', 
                value: `${aiData?.health?.queueLength || 0}`, 
                status: 'normal', 
                color: 'text-blue-600' 
              },
              { 
                metric: 'Resource Usage', 
                value: `${aiData?.health?.resourceUsage || 0}%`, 
                status: aiData?.health?.resourceUsage && aiData.health.resourceUsage < 80 ? 'normal' : 'high', 
                color: aiData?.health?.resourceUsage && aiData.health.resourceUsage < 80 ? 'text-blue-600' : 'text-orange-600' 
              }
            ].map((health) => (
              <div key={health.metric} className="flex items-center justify-between p-3 border rounded-lg">
                <div>
                  <p className="font-medium">{health.metric}</p>
                  <p className="text-sm text-muted-foreground">Status: {health.status}</p>
                </div>
                <div className={`text-lg font-bold ${health.color}`}>
                  {health.value}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminAISection;
