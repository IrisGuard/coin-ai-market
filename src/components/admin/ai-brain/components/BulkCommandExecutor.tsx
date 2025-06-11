
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { Progress } from '@/components/ui/progress';
import { Play, Square, CheckCircle, XCircle, Clock } from 'lucide-react';
import { useEnhancedAICommands } from '@/hooks/useEnhancedAICommands';

interface BulkExecutionResult {
  commandId: string;
  commandName: string;
  status: 'pending' | 'running' | 'completed' | 'failed';
  result?: any;
  error?: string;
  startTime?: number;
  endTime?: number;
}

const BulkCommandExecutor = () => {
  const [selectedCommands, setSelectedCommands] = useState<string[]>([]);
  const [isExecuting, setIsExecuting] = useState(false);
  const [executionResults, setExecutionResults] = useState<BulkExecutionResult[]>([]);
  const [currentExecuting, setCurrentExecuting] = useState<string | null>(null);
  
  const { commands, executeCommand } = useEnhancedAICommands();

  const handleSelectCommand = (commandId: string, checked: boolean) => {
    setSelectedCommands(prev => 
      checked 
        ? [...prev, commandId]
        : prev.filter(id => id !== commandId)
    );
  };

  const handleSelectAll = (checked: boolean) => {
    setSelectedCommands(checked ? commands.map(cmd => cmd.id) : []);
  };

  const handleBulkExecute = async () => {
    if (selectedCommands.length === 0) return;

    setIsExecuting(true);
    const results: BulkExecutionResult[] = selectedCommands.map(commandId => {
      const command = commands.find(cmd => cmd.id === commandId);
      return {
        commandId,
        commandName: command?.name || 'Unknown',
        status: 'pending' as const
      };
    });
    
    setExecutionResults(results);

    // Execute commands sequentially
    for (let i = 0; i < selectedCommands.length; i++) {
      const commandId = selectedCommands[i];
      const command = commands.find(cmd => cmd.id === commandId);
      
      if (!command) continue;

      setCurrentExecuting(commandId);
      
      // Update status to running
      setExecutionResults(prev => prev.map(result => 
        result.commandId === commandId 
          ? { ...result, status: 'running', startTime: Date.now() }
          : result
      ));

      try {
        const result = await executeCommand(commandId, {
          bulkExecution: true,
          batchId: Date.now().toString(),
          executionIndex: i
        });

        // Update status to completed
        setExecutionResults(prev => prev.map(r => 
          r.commandId === commandId 
            ? { ...r, status: 'completed', result, endTime: Date.now() }
            : r
        ));

      } catch (error: any) {
        // Update status to failed
        setExecutionResults(prev => prev.map(r => 
          r.commandId === commandId 
            ? { ...r, status: 'failed', error: error.message, endTime: Date.now() }
            : r
        ));
      }

      // Small delay between executions
      if (i < selectedCommands.length - 1) {
        await new Promise(resolve => setTimeout(resolve, 1000));
      }
    }

    setCurrentExecuting(null);
    setIsExecuting(false);
  };

  const handleStopExecution = () => {
    setIsExecuting(false);
    setCurrentExecuting(null);
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending': return <Clock className="h-4 w-4 text-gray-500" />;
      case 'running': return <div className="w-4 h-4 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />;
      case 'completed': return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'failed': return <XCircle className="h-4 w-4 text-red-500" />;
      default: return null;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-gray-100 text-gray-800';
      case 'running': return 'bg-blue-100 text-blue-800';
      case 'completed': return 'bg-green-100 text-green-800';
      case 'failed': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const completedCount = executionResults.filter(r => r.status === 'completed').length;
  const failedCount = executionResults.filter(r => r.status === 'failed').length;
  const totalCount = executionResults.length;
  const progress = totalCount > 0 ? ((completedCount + failedCount) / totalCount) * 100 : 0;

  return (
    <div className="space-y-6">
      {/* Control Panel */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>Bulk Command Execution</span>
            <div className="flex items-center gap-2">
              <Badge variant="outline">{selectedCommands.length} selected</Badge>
              {isExecuting && (
                <Badge className="bg-blue-100 text-blue-800">
                  {completedCount + failedCount}/{totalCount} completed
                </Badge>
              )}
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-4 mb-4">
            <Checkbox
              checked={selectedCommands.length === commands.length && commands.length > 0}
              onCheckedChange={handleSelectAll}
            />
            <span className="text-sm font-medium">Select All Commands</span>
          </div>

          {isExecuting && (
            <div className="space-y-2 mb-4">
              <div className="flex items-center justify-between text-sm">
                <span>Execution Progress</span>
                <span>{Math.round(progress)}%</span>
              </div>
              <Progress value={progress} className="w-full" />
            </div>
          )}

          <div className="flex gap-2">
            <Button
              onClick={handleBulkExecute}
              disabled={selectedCommands.length === 0 || isExecuting}
              className="flex-1"
            >
              <Play className="h-4 w-4 mr-2" />
              Execute Selected ({selectedCommands.length})
            </Button>
            
            {isExecuting && (
              <Button
                variant="destructive"
                onClick={handleStopExecution}
              >
                <Square className="h-4 w-4 mr-2" />
                Stop
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Command Selection */}
      <Card>
        <CardHeader>
          <CardTitle>Available Commands</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-2 max-h-96 overflow-y-auto">
            {commands.map((command) => (
              <div key={command.id} className="flex items-center gap-3 p-2 border rounded hover:bg-gray-50">
                <Checkbox
                  checked={selectedCommands.includes(command.id)}
                  onCheckedChange={(checked) => handleSelectCommand(command.id, checked as boolean)}
                />
                <div className="flex-1">
                  <div className="text-sm font-medium">
                    {command.name.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
                  </div>
                  <div className="text-xs text-muted-foreground">
                    {command.category} • Priority {command.priority}
                  </div>
                </div>
                <Badge variant="outline" className="text-xs">
                  {Math.round(command.execution_timeout / 1000)}s
                </Badge>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Execution Results */}
      {executionResults.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>Execution Results</span>
              <div className="flex items-center gap-2 text-sm">
                <Badge className="bg-green-100 text-green-800">{completedCount} completed</Badge>
                <Badge className="bg-red-100 text-red-800">{failedCount} failed</Badge>
              </div>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2 max-h-96 overflow-y-auto">
              {executionResults.map((result) => (
                <div key={result.commandId} className="flex items-center gap-3 p-3 border rounded">
                  {getStatusIcon(result.status)}
                  <div className="flex-1">
                    <div className="text-sm font-medium">
                      {result.commandName.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
                    </div>
                    {result.error && (
                      <div className="text-xs text-red-600 mt-1">
                        Error: {result.error}
                      </div>
                    )}
                    {result.startTime && result.endTime && (
                      <div className="text-xs text-muted-foreground mt-1">
                        Execution time: {result.endTime - result.startTime}ms
                      </div>
                    )}
                  </div>
                  <Badge className={getStatusColor(result.status)}>
                    {result.status}
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default BulkCommandExecutor;
