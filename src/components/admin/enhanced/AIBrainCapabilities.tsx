
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { 
  Brain, 
  Zap, 
  Database, 
  Globe, 
  Settings,
  Activity,
  CheckCircle,
  AlertCircle
} from 'lucide-react';

const AIBrainCapabilities = () => {
  const capabilities = [
    {
      name: 'Coin Recognition',
      status: 'active',
      accuracy: 94,
      icon: Brain,
      description: 'Advanced AI-powered coin identification and authentication'
    },
    {
      name: 'Price Prediction',
      status: 'active',
      accuracy: 87,
      icon: Zap,
      description: 'Market analysis and price trend prediction algorithms'
    },
    {
      name: 'Data Aggregation',
      status: 'active',
      accuracy: 96,
      icon: Database,
      description: 'Multi-source data collection and processing'
    },
    {
      name: 'Global Sources',
      status: 'active',
      accuracy: 92,
      icon: Globe,
      description: 'Worldwide coin market data integration'
    }
  ];

  const systemMetrics = {
    totalProcessed: 15847,
    dailyProcessing: 342,
    averageResponseTime: '1.2s',
    systemLoad: 23,
    activeConnections: 156
  };

  return (
    <div className="space-y-6">
      {/* AI Brain Status Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Processed</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{systemMetrics.totalProcessed.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">+12% from last month</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Daily Processing</CardTitle>
            <Zap className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{systemMetrics.dailyProcessing}</div>
            <p className="text-xs text-muted-foreground">coins per day</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Response Time</CardTitle>
            <Brain className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{systemMetrics.averageResponseTime}</div>
            <p className="text-xs text-muted-foreground">average response</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">System Load</CardTitle>
            <Settings className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{systemMetrics.systemLoad}%</div>
            <Progress value={systemMetrics.systemLoad} className="mt-2" />
          </CardContent>
        </Card>
      </div>

      {/* AI Capabilities Grid */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Brain className="h-5 w-5" />
            AI Brain Capabilities
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {capabilities.map((capability) => (
              <div key={capability.name} className="border rounded-lg p-4">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-blue-100 rounded-lg">
                      <capability.icon className="h-5 w-5 text-blue-600" />
                    </div>
                    <div>
                      <h3 className="font-medium">{capability.name}</h3>
                      <p className="text-sm text-muted-foreground">{capability.description}</p>
                    </div>
                  </div>
                  <Badge variant={capability.status === 'active' ? 'default' : 'secondary'}>
                    {capability.status === 'active' ? (
                      <CheckCircle className="h-3 w-3 mr-1" />
                    ) : (
                      <AlertCircle className="h-3 w-3 mr-1" />
                    )}
                    {capability.status}
                  </Badge>
                </div>
                
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Accuracy Rate</span>
                    <span className="font-medium">{capability.accuracy}%</span>
                  </div>
                  <Progress value={capability.accuracy} className="h-2" />
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* AI Brain Controls */}
      <Card>
        <CardHeader>
          <CardTitle>AI Brain Management</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Button variant="outline" className="h-20 flex flex-col gap-2">
              <Settings className="h-6 w-6" />
              <span>Configure Models</span>
            </Button>
            <Button variant="outline" className="h-20 flex flex-col gap-2">
              <Database className="h-6 w-6" />
              <span>Training Data</span>
            </Button>
            <Button variant="outline" className="h-20 flex flex-col gap-2">
              <Activity className="h-6 w-6" />
              <span>Performance Analytics</span>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AIBrainCapabilities;
