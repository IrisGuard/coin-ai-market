
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Search, Activity, CheckCircle, XCircle, Clock } from 'lucide-react';

interface CommandExecutionMonitorProps {
  executionLogs: any[];
  commands: any[];
}

const CommandExecutionMonitor: React.FC<CommandExecutionMonitorProps> = ({
  executionLogs,
  commands
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  const filteredLogs = executionLogs.filter(log => {
    const matchesSearch = log.ai_commands?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         log.ai_commands?.category?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || 
                         (statusFilter === 'success' && log.success) ||
                         (statusFilter === 'failed' && !log.success);
    
    return matchesSearch && matchesStatus;
  });

  const getStatusIcon = (success: boolean) => {
    return success ? (
      <CheckCircle className="h-4 w-4 text-green-600" />
    ) : (
      <XCircle className="h-4 w-4 text-red-600" />
    );
  };

  const getStatusBadge = (success: boolean) => {
    return (
      <Badge className={success ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}>
        {success ? 'Success' : 'Failed'}
      </Badge>
    );
  };

  const getExecutionTimeColor = (timeMs: number) => {
    if (timeMs < 1000) return 'text-green-600';
    if (timeMs < 5000) return 'text-yellow-600';
    return 'text-red-600';
  };

  return (
    <div className="space-y-6">
      {/* Monitor Controls */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Activity className="h-5 w-5 text-blue-600" />
            Command Execution Monitor
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Search executions by command name or category..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-md bg-white"
            >
              <option value="all">All Status</option>
              <option value="success">Success Only</option>
              <option value="failed">Failed Only</option>
            </select>
          </div>
        </CardContent>
      </Card>

      {/* Execution Logs */}
      <Card>
        <CardHeader>
          <CardTitle>Execution History ({filteredLogs.length} entries)</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {filteredLogs.map((log) => (
              <div key={log.id} className="p-4 border rounded-lg hover:bg-gray-50">
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-3">
                    {getStatusIcon(log.success)}
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h4 className="font-medium text-sm">
                          {log.ai_commands?.name?.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase()) || 'Unknown Command'}
                        </h4>
                        {getStatusBadge(log.success)}
                      </div>
                      
                      <div className="flex items-center gap-4 text-xs text-muted-foreground mb-2">
                        <span>Category: {log.ai_commands?.category || 'Unknown'}</span>
                        <span>Type: {log.ai_commands?.command_type || 'Unknown'}</span>
                        <span className={`flex items-center gap-1 ${getExecutionTimeColor(log.execution_time_ms || 0)}`}>
                          <Clock className="h-3 w-3" />
                          {log.execution_time_ms || 0}ms
                        </span>
                      </div>
                      
                      {log.performance_score && (
                        <div className="text-xs text-muted-foreground">
                          Performance Score: {Math.round(log.performance_score * 100)}%
                        </div>
                      )}
                      
                      {log.error_message && (
                        <div className="text-xs text-red-600 mt-1 p-2 bg-red-50 rounded">
                          Error: {log.error_message}
                        </div>
                      )}
                    </div>
                  </div>
                  
                  <div className="text-right text-xs text-muted-foreground">
                    <div>{new Date(log.created_at).toLocaleDateString()}</div>
                    <div>{new Date(log.created_at).toLocaleTimeString()}</div>
                  </div>
                </div>
              </div>
            ))}
            
            {filteredLogs.length === 0 && (
              <div className="text-center py-8">
                <Activity className="h-12 w-12 mx-auto mb-4 text-gray-400" />
                <p className="text-muted-foreground">No execution logs found matching your criteria.</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default CommandExecutionMonitor;
