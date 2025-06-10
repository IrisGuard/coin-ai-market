
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Clock, Play, Square, RotateCcw, Trash2 } from 'lucide-react';

const CommandQueueMonitor = () => {
  // Mock command queue data
  const queuedCommands = [
    {
      id: '1',
      command_name: 'Market Data Sync',
      status: 'pending',
      priority: 1,
      scheduled_at: new Date(Date.now() + 5 * 60 * 1000), // 5 minutes from now
      retry_count: 0,
      created_by: 'System',
      input_data: { source: 'external_api', type: 'price_update' }
    },
    {
      id: '2',
      command_name: 'User Analytics Report',
      status: 'running',
      priority: 2,
      scheduled_at: new Date(Date.now() - 2 * 60 * 1000), // 2 minutes ago
      retry_count: 0,
      created_by: 'Admin',
      input_data: { period: '24h', format: 'json' }
    },
    {
      id: '3',
      command_name: 'Image Processing Batch',
      status: 'failed',
      priority: 3,
      scheduled_at: new Date(Date.now() - 10 * 60 * 1000), // 10 minutes ago
      retry_count: 2,
      created_by: 'System',
      input_data: { batch_size: 50, resize: true }
    },
    {
      id: '4',
      command_name: 'Email Notification Batch',
      status: 'completed',
      priority: 2,
      scheduled_at: new Date(Date.now() - 30 * 60 * 1000), // 30 minutes ago
      retry_count: 0,
      created_by: 'System',
      input_data: { template: 'price_alert', recipients: 145 }
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-blue-100 text-blue-800';
      case 'running': return 'bg-yellow-100 text-yellow-800';
      case 'completed': return 'bg-green-100 text-green-800';
      case 'failed': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending': return <Clock className="w-4 h-4" />;
      case 'running': return <Play className="w-4 h-4 animate-spin" />;
      case 'completed': return <Square className="w-4 h-4" />;
      case 'failed': return <RotateCcw className="w-4 h-4" />;
      default: return <Clock className="w-4 h-4" />;
    }
  };

  const getPriorityColor = (priority: number) => {
    switch (priority) {
      case 1: return 'bg-red-100 text-red-800';
      case 2: return 'bg-yellow-100 text-yellow-800';
      case 3: return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const handleRetryCommand = (commandId: string) => {
    console.log('Retrying command:', commandId);
  };

  const handleCancelCommand = (commandId: string) => {
    console.log('Canceling command:', commandId);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold">Command Queue Monitor</h3>
          <p className="text-sm text-gray-600">Monitor and manage queued AI commands</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            Clear Completed
          </Button>
          <Button>
            Pause Queue
          </Button>
        </div>
      </div>

      {/* Queue Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">
                {queuedCommands.filter(c => c.status === 'pending').length}
              </div>
              <div className="text-sm text-gray-600">Pending</div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-yellow-600">
                {queuedCommands.filter(c => c.status === 'running').length}
              </div>
              <div className="text-sm text-gray-600">Running</div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">
                {queuedCommands.filter(c => c.status === 'completed').length}
              </div>
              <div className="text-sm text-gray-600">Completed</div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-red-600">
                {queuedCommands.filter(c => c.status === 'failed').length}
              </div>
              <div className="text-sm text-gray-600">Failed</div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Command Queue List */}
      <Card>
        <CardHeader>
          <CardTitle>Queued Commands</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {queuedCommands.map((command) => (
              <div key={command.id} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-center gap-4 flex-1">
                  <div className="flex items-center gap-2">
                    {getStatusIcon(command.status)}
                    <Badge className={getStatusColor(command.status)}>
                      {command.status}
                    </Badge>
                  </div>
                  
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-1">
                      <h4 className="font-medium">{command.command_name}</h4>
                      <Badge className={getPriorityColor(command.priority)}>
                        Priority {command.priority}
                      </Badge>
                      {command.retry_count > 0 && (
                        <Badge variant="outline">
                          Retry {command.retry_count}
                        </Badge>
                      )}
                    </div>
                    <div className="text-sm text-gray-600">
                      Scheduled: {command.scheduled_at.toLocaleString()} | 
                      Created by: {command.created_by}
                    </div>
                  </div>
                </div>
                
                <div className="flex gap-2">
                  {command.status === 'failed' && (
                    <Button size="sm" variant="outline" onClick={() => handleRetryCommand(command.id)}>
                      <RotateCcw className="w-4 h-4" />
                    </Button>
                  )}
                  {(command.status === 'pending' || command.status === 'running') && (
                    <Button size="sm" variant="outline" onClick={() => handleCancelCommand(command.id)}>
                      <Square className="w-4 h-4" />
                    </Button>
                  )}
                  <Button size="sm" variant="outline">
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default CommandQueueMonitor;
