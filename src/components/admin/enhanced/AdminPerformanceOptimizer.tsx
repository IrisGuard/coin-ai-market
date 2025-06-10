
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { 
  Zap, 
  Database, 
  Globe, 
  HardDrive, 
  Cpu, 
  CheckCircle, 
  AlertTriangle,
  TrendingUp
} from 'lucide-react';

const AdminPerformanceOptimizer = () => {
  const [isOptimizing, setIsOptimizing] = useState(false);
  const [optimizationProgress, setOptimizationProgress] = useState(0);
  const [performanceScore, setPerformanceScore] = useState(85);

  const performanceMetrics = [
    {
      name: 'Database Queries',
      current: 245,
      target: 180,
      unit: 'ms',
      status: 'warning',
      icon: Database,
      improvement: 'Optimize query indexes'
    },
    {
      name: 'API Response Time',
      current: 120,
      target: 100,
      unit: 'ms',
      status: 'good',
      icon: Globe,
      improvement: 'Good performance'
    },
    {
      name: 'Memory Usage',
      current: 65,
      target: 70,
      unit: '%',
      status: 'good',
      icon: Cpu,
      improvement: 'Within limits'
    },
    {
      name: 'Storage I/O',
      current: 89,
      target: 95,
      unit: 'MB/s',
      status: 'excellent',
      icon: HardDrive,
      improvement: 'Excellent throughput'
    }
  ];

  const optimizations = [
    { id: 1, name: 'Database Index Optimization', completed: true },
    { id: 2, name: 'Query Result Caching', completed: true },
    { id: 3, name: 'Asset Compression', completed: false },
    { id: 4, name: 'API Response Caching', completed: false },
    { id: 5, name: 'Background Job Optimization', completed: false }
  ];

  const runOptimization = async () => {
    setIsOptimizing(true);
    setOptimizationProgress(0);

    // Simulate optimization process
    for (let i = 0; i <= 100; i += 10) {
      await new Promise(resolve => setTimeout(resolve, 300));
      setOptimizationProgress(i);
    }

    setPerformanceScore(Math.min(performanceScore + 5, 100));
    setIsOptimizing(false);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'excellent': return 'bg-green-500';
      case 'good': return 'bg-blue-500';
      case 'warning': return 'bg-yellow-500';
      case 'critical': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'excellent': return <Badge className="bg-green-100 text-green-800">Excellent</Badge>;
      case 'good': return <Badge className="bg-blue-100 text-blue-800">Good</Badge>;
      case 'warning': return <Badge className="bg-yellow-100 text-yellow-800">Warning</Badge>;
      case 'critical': return <Badge className="bg-red-100 text-red-800">Critical</Badge>;
      default: return <Badge variant="secondary">Unknown</Badge>;
    }
  };

  return (
    <div className="space-y-6">
      {/* Performance Score */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="w-5 h-5" />
            System Performance Score
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between mb-4">
            <div>
              <div className="text-4xl font-bold text-green-600">{performanceScore}%</div>
              <p className="text-sm text-muted-foreground">Overall Performance</p>
            </div>
            <Button 
              onClick={runOptimization} 
              disabled={isOptimizing}
              className="flex items-center gap-2"
            >
              <Zap className="w-4 h-4" />
              {isOptimizing ? 'Optimizing...' : 'Run Optimization'}
            </Button>
          </div>
          
          {isOptimizing && (
            <div className="space-y-2">
              <Progress value={optimizationProgress} className="h-2" />
              <p className="text-sm text-center text-muted-foreground">
                Optimizing system performance... {optimizationProgress}%
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Performance Metrics */}
      <Card>
        <CardHeader>
          <CardTitle>Performance Metrics</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {performanceMetrics.map((metric, index) => (
              <div key={index} className="border rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <metric.icon className="w-4 h-4" />
                    <span className="font-medium">{metric.name}</span>
                  </div>
                  {getStatusBadge(metric.status)}
                </div>
                
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Current: {metric.current}{metric.unit}</span>
                    <span>Target: {metric.target}{metric.unit}</span>
                  </div>
                  
                  <Progress 
                    value={(metric.current / metric.target) * 100} 
                    className="h-2"
                  />
                  
                  <p className="text-xs text-muted-foreground">{metric.improvement}</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Optimization Tasks */}
      <Card>
        <CardHeader>
          <CardTitle>Optimization Tasks</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {optimizations.map((task) => (
              <div key={task.id} className="flex items-center justify-between p-3 border rounded">
                <div className="flex items-center gap-3">
                  {task.completed ? (
                    <CheckCircle className="w-5 h-5 text-green-500" />
                  ) : (
                    <AlertTriangle className="w-5 h-5 text-yellow-500" />
                  )}
                  <span className={task.completed ? 'line-through text-muted-foreground' : ''}>
                    {task.name}
                  </span>
                </div>
                <Badge variant={task.completed ? 'default' : 'secondary'}>
                  {task.completed ? 'Completed' : 'Pending'}
                </Badge>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminPerformanceOptimizer;
