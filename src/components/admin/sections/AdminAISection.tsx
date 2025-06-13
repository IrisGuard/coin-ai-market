
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Brain, Zap, Settings, Activity, TrendingUp, Database } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

const AdminAISection = () => {
  const aiTables = [
    {
      name: 'ai_commands',
      description: 'AI command definitions and configurations',
      records: '47',
      status: 'active',
      icon: Brain,
      category: 'core'
    },
    {
      name: 'ai_command_executions',
      description: 'Execution history and results',
      records: '1,234',
      status: 'active',
      icon: Activity,
      category: 'execution'
    },
    {
      name: 'ai_configuration',
      description: 'System AI configuration settings',
      records: '1',
      status: 'active',
      icon: Settings,
      category: 'config'
    },
    {
      name: 'ai_performance_metrics',
      description: 'Performance tracking and analytics',
      records: '5,678',
      status: 'active',
      icon: TrendingUp,
      category: 'analytics'
    },
    {
      name: 'ai_predictions',
      description: 'AI prediction results and accuracy',
      records: '2,345',
      status: 'active',
      icon: Database,
      category: 'predictions'
    },
    {
      name: 'automation_rules',
      description: 'Automated workflow configurations',
      records: '23',
      status: 'active',
      icon: Zap,
      category: 'automation'
    }
  ];

  const aiStats = [
    { label: 'Active Commands', value: '47', icon: Brain, color: 'text-purple-600' },
    { label: 'Daily Executions', value: '1,234', icon: Activity, color: 'text-blue-600' },
    { label: 'Success Rate', value: '98.5%', icon: TrendingUp, color: 'text-green-600' },
    { label: 'Automation Rules', value: '23', icon: Zap, color: 'text-orange-600' }
  ];

  return (
    <div className="space-y-6">
      {/* AI System Statistics */}
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
                <p className="text-xs text-muted-foreground">AI System metrics</p>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* AI Tables Grid */}
      <div className="grid gap-4 md:grid-cols-2">
        {aiTables.map((table) => {
          const IconComponent = table.icon;
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
                    <span className="font-medium">{table.records}</span> records
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
        })}
      </div>

      {/* AI System Health */}
      <Card>
        <CardHeader>
          <CardTitle>AI System Health</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {[
              { metric: 'Response Time', value: '245ms', status: 'excellent', color: 'text-green-600' },
              { metric: 'Error Rate', value: '0.2%', status: 'good', color: 'text-green-600' },
              { metric: 'Queue Length', value: '3', status: 'normal', color: 'text-blue-600' },
              { metric: 'Resource Usage', value: '67%', status: 'normal', color: 'text-yellow-600' }
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
