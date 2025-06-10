
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Brain, Play, Square, Clock, CheckCircle, AlertTriangle } from 'lucide-react';
import { useAICommands, useExecuteAICommand, useAICommandExecutions } from '@/hooks/admin/useAdvancedAIBrain';

const AIBrainControlPanel = () => {
  const [selectedCommand, setSelectedCommand] = useState<string>('');
  const [inputData, setInputData] = useState<string>('');
  
  const { data: commands, isLoading: commandsLoading } = useAICommands();
  const { data: executions, isLoading: executionsLoading } = useAICommandExecutions();
  const executeCommand = useExecuteAICommand();

  const handleExecuteCommand = async () => {
    if (!selectedCommand) return;
    
    try {
      const parsedInput = inputData ? JSON.parse(inputData) : {};
      await executeCommand.mutateAsync({
        commandId: selectedCommand,
        inputData: parsedInput
      });
      setInputData('');
    } catch (error) {
      console.error('Failed to execute command:', error);
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'running':
        return <Clock className="w-4 h-4 text-blue-500 animate-spin" />;
      case 'failed':
        return <AlertTriangle className="w-4 h-4 text-red-500" />;
      default:
        return <Clock className="w-4 h-4 text-gray-400" />;
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Brain className="w-5 h-5" />
            AI Brain Control Panel
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Command Selection */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Select AI Command</label>
            <select 
              value={selectedCommand}
              onChange={(e) => setSelectedCommand(e.target.value)}
              className="w-full p-2 border rounded-md"
              disabled={commandsLoading}
            >
              <option value="">Choose a command...</option>
              {commands?.map((command) => (
                <option key={command.id} value={command.id}>
                  {command.name} ({command.category})
                </option>
              ))}
            </select>
          </div>

          {/* Input Data */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Input Data (JSON)</label>
            <Textarea
              value={inputData}
              onChange={(e) => setInputData(e.target.value)}
              placeholder='{"parameter": "value"}'
              rows={3}
            />
          </div>

          {/* Execute Button */}
          <Button 
            onClick={handleExecuteCommand}
            disabled={!selectedCommand || executeCommand.isPending}
            className="w-full"
          >
            {executeCommand.isPending ? (
              <>
                <Square className="w-4 h-4 mr-2" />
                Executing...
              </>
            ) : (
              <>
                <Play className="w-4 h-4 mr-2" />
                Execute Command
              </>
            )}
          </Button>
        </CardContent>
      </Card>

      {/* Available Commands */}
      <Card>
        <CardHeader>
          <CardTitle>Available AI Commands</CardTitle>
        </CardHeader>
        <CardContent>
          {commandsLoading ? (
            <div className="text-center py-4">Loading commands...</div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {commands?.map((command) => (
                <div key={command.id} className="p-4 border rounded-lg hover:bg-gray-50">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-medium">{command.name}</h3>
                    <Badge variant="outline">{command.category}</Badge>
                  </div>
                  <p className="text-sm text-gray-600 mb-2">{command.description}</p>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => setSelectedCommand(command.id)}
                    className="w-full"
                  >
                    Select
                  </Button>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Recent Executions */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Executions</CardTitle>
        </CardHeader>
        <CardContent>
          {executionsLoading ? (
            <div className="text-center py-4">Loading executions...</div>
          ) : (
            <div className="space-y-3">
              {executions?.slice(0, 10).map((execution) => (
                <div key={execution.id} className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center gap-3">
                    {getStatusIcon(execution.execution_status)}
                    <div>
                      <div className="font-medium">{execution.ai_commands?.name}</div>
                      <div className="text-sm text-gray-500">
                        {new Date(execution.created_at).toLocaleString()}
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <Badge variant={
                      execution.execution_status === 'completed' ? 'default' :
                      execution.execution_status === 'failed' ? 'destructive' : 'secondary'
                    }>
                      {execution.execution_status}
                    </Badge>
                    {execution.execution_time_ms && (
                      <div className="text-xs text-gray-500 mt-1">
                        {execution.execution_time_ms}ms
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default AIBrainControlPanel;
