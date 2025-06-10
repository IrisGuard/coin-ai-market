
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  List, Play, Pause, CheckCircle, AlertTriangle, 
  Clock, Zap, RotateCcw, X
} from 'lucide-react';
import { useCommandQueue } from '@/hooks/admin/useEnhancedAIBrain';

const CommandQueueMonitor = () => {
  const [filterStatus, setFilterStatus] = useState<string>('all');
  
  const { data: queueItems, isLoading } = useCommandQueue();

  const filteredItems = queueItems?.filter(item => {
    return filterStatus === 'all' || item.status === filterStatus;
  }) || [];

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending': return <Clock className="w-4 h-4 text-yellow-500" />;
      case 'running': return <Zap className="w-4 h-4 text-blue-500 animate-pulse" />;
      case 'completed': return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'failed': return <AlertTriangle className="w-4 h-4 text-red-500" />;
      case 'cancelled': return <X className="w-4 h-4 text-gray-500" />;
      default: return <Clock className="w-4 h-4 text-gray-400" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'running': return 'bg-blue-100 text-blue-800';
      case 'completed': return 'bg-green-100 text-green-800';
      case 'failed': return 'bg-red-100 text-red-800';
      case 'cancelled': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getPriorityColor = (priority: number) => {
    if (priority >= 3) return 'text-red-600 font-bold';
    if (priority >= 2) return 'text-yellow-600 font-medium';
    return 'text-gray-600';
  };

  const getExecutionTime = (item: any) => {
    if (!item.execution_started) return 'Not started';
    if (!item.execution_completed) return 'Running...';
    
    const start = new Date(item.execution_started).getTime();
    const end = new Date(item.execution_completed).getTime();
    const duration = end - start;
    
    return `${Math.round(duration / 1000)}s`;
  };

  if (isLoading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="text-center">Loading command queue...</div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span className="flex items-center gap-2">
              <List className="w-5 h-5" />
              Command Queue Monitor
            </span>
            <div className="flex items-center gap-2">
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="px-3 py-1 border rounded-md text-sm"
              >
                <option value="all">All Status</option>
                <option value="pending">Pending</option>
                <option value="running">Running</option>
                <option value="completed">Completed</option>
                <option value="failed">Failed</option>
                <option value="cancelled">Cancelled</option>
              </select>
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {filteredItems.map((item) => (
              <Card key={item.id} className="border-l-4 border-l-blue-500">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-3">
                      {getStatusIcon(item.status)}
                      <div>
                        <h4 className="font-medium">
                          {item.ai_commands?.name || 'Unknown Command'}
                        </h4>
                        <p className="text-sm text-gray-600">
                          {item.ai_commands?.category || 'General'}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge className={getStatusColor(item.status)}>
                        {item.status}
                      </Badge>
                      <span className={`text-sm ${getPriorityColor(item.priority)}`}>
                        P{item.priority}
                      </span>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-xs">
                    <div>
                      <span className="text-gray-500">Scheduled:</span>
                      <div className="font-medium">
                        {new Date(item.scheduled_at).toLocaleString()}
                      </div>
                    </div>
                    <div>
                      <span className="text-gray-500">Execution Time:</span>
                      <div className="font-medium">{getExecutionTime(item)}</div>
                    </div>
                    <div>
                      <span className="text-gray-500">Retries:</span>
                      <div className="font-medium">
                        {item.retry_count}/{item.max_retries}
                      </div>
                    </div>
                    <div>
                      <span className="text-gray-500">Created:</span>
                      <div className="font-medium">
                        {new Date(item.created_at).toLocaleString()}
                      </div>
                    </div>
                  </div>

                  {item.error_message && (
                    <div className="mt-3 p-2 bg-red-50 border border-red-200 rounded text-sm">
                      <span className="text-red-600 font-medium">Error: </span>
                      {item.error_message}
                    </div>
                  )}

                  {item.result_data && (
                    <div className="mt-3 p-2 bg-green-50 border border-green-200 rounded text-sm">
                      <span className="text-green-600 font-medium">Result: </span>
                      <pre className="mt-1 text-xs overflow-x-auto">
                        {JSON.stringify(item.result_data, null, 2)}
                      </pre>
                    </div>
                  )}

                  <div className="flex items-center gap-2 mt-3 pt-3 border-t">
                    {item.status === 'pending' && (
                      <Button size="sm" variant="outline">
                        <Play className="w-3 h-3 mr-1" />
                        Execute Now
                      </Button>
                    )}
                    {item.status === 'running' && (
                      <Button size="sm" variant="outline">
                        <Pause className="w-3 h-3 mr-1" />
                        Cancel
                      </Button>
                    )}
                    {item.status === 'failed' && (
                      <Button size="sm" variant="outline">
                        <RotateCcw className="w-3 h-3 mr-1" />
                        Retry
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}

            {filteredItems.length === 0 && (
              <div className="text-center py-8 text-gray-500">
                No commands found in the queue.
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Queue Statistics */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-yellow-600">
              {queueItems?.filter(i => i.status === 'pending').length || 0}
            </div>
            <div className="text-sm text-gray-600">Pending</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-blue-600">
              {queueItems?.filter(i => i.status === 'running').length || 0}
            </div>
            <div className="text-sm text-gray-600">Running</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-green-600">
              {queueItems?.filter(i => i.status === 'completed').length || 0}
            </div>
            <div className="text-sm text-gray-600">Completed</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-red-600">
              {queueItems?.filter(i => i.status === 'failed').length || 0}
            </div>
            <div className="text-sm text-gray-600">Failed</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-purple-600">
              {queueItems?.length || 0}
            </div>
            <div className="text-sm text-gray-600">Total</div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default CommandQueueMonitor;
