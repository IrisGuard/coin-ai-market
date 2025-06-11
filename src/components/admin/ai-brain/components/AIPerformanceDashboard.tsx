
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { TrendingUp, Clock, CheckCircle, AlertTriangle } from 'lucide-react';

interface AIPerformanceDashboardProps {
  performanceData: any[];
  executionLogs: any[];
}

const AIPerformanceDashboard: React.FC<AIPerformanceDashboardProps> = ({
  performanceData,
  executionLogs
}) => {
  const performanceStats = {
    totalExecutions: executionLogs.length,
    successfulExecutions: executionLogs.filter(log => log.success).length,
    averageExecutionTime: executionLogs.length > 0
      ? Math.round(executionLogs.reduce((sum, log) => sum + (log.execution_time_ms || 0), 0) / executionLogs.length)
      : 0,
    averagePerformanceScore: executionLogs.length > 0
      ? Math.round((executionLogs.reduce((sum, log) => sum + (log.performance_score || 0), 0) / executionLogs.length) * 100)
      : 0
  };

  const recentExecutions = executionLogs.slice(0, 10);

  return (
    <div className="space-y-6">
      {/* Performance Overview */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Executions</CardTitle>
            <TrendingUp className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{performanceStats.totalExecutions}</div>
            <p className="text-xs text-muted-foreground">All time</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Success Rate</CardTitle>
            <CheckCircle className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {performanceStats.totalExecutions > 0 
                ? Math.round((performanceStats.successfulExecutions / performanceStats.totalExecutions) * 100)
                : 0}%
            </div>
            <p className="text-xs text-muted-foreground">
              {performanceStats.successfulExecutions} successful
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg Response Time</CardTitle>
            <Clock className="h-4 w-4 text-yellow-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{performanceStats.averageExecutionTime}ms</div>
            <p className="text-xs text-muted-foreground">Average execution</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Performance Score</CardTitle>
            <AlertTriangle className="h-4 w-4 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{performanceStats.averagePerformanceScore}%</div>
            <p className="text-xs text-muted-foreground">Average quality</p>
          </CardContent>
        </Card>
      </div>

      {/* Recent Executions */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Command Executions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {recentExecutions.map((execution) => (
              <div key={execution.id} className="flex items-center justify-between p-3 border rounded-lg">
                <div className="flex items-center gap-3">
                  <div className={`w-3 h-3 rounded-full ${execution.success ? 'bg-green-500' : 'bg-red-500'}`} />
                  <div>
                    <div className="font-medium text-sm">
                      {execution.ai_commands?.name || 'Unknown Command'}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {execution.ai_commands?.category} • {execution.execution_time_ms}ms
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-sm font-medium">
                    {execution.performance_score ? Math.round(execution.performance_score * 100) + '%' : 'N/A'}
                  </div>
                  <div className="text-xs text-muted-foreground">
                    {new Date(execution.created_at).toLocaleTimeString()}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AIPerformanceDashboard;
