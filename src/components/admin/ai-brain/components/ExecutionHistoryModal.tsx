import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { supabase } from '@/integrations/supabase/client';
import { formatDistanceToNow } from 'date-fns';
import { RefreshCw, Clock, CheckCircle, XCircle, AlertCircle, Play, User, Calendar } from 'lucide-react';

interface ExecutionHistoryModalProps {
  commandId: string | null;
  commandName: string;
  open: boolean;
  onClose: () => void;
}

interface ExecutionRecord {
  id: string;
  execution_status: string;
  execution_time_ms: number;
  error_message: string | null;
  created_at: string;
  input_data: any;
  output_data: any;
  user_id: string | null;
  completed_at?: string | null;
}

const ExecutionHistoryModal: React.FC<ExecutionHistoryModalProps> = ({
  commandId,
  commandName,
  open,
  onClose
}) => {
  const [executions, setExecutions] = useState<ExecutionRecord[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchExecutions = async () => {
    if (!commandId) return;
    
    setLoading(true);
    try {
      console.log('📜 Fetching execution history for command:', commandId);
      
      const { data, error } = await supabase
        .from('ai_command_executions')
        .select('*')
        .eq('command_id', commandId)
        .order('created_at', { ascending: false })
        .limit(50);

      if (error) {
        console.error('❌ Error fetching executions:', error);
        throw error;
      }
      
      console.log('✅ Execution history fetched:', data?.length || 0, 'records');
      // Map the data to ensure completed_at field exists
      const mappedData = (data || []).map(item => ({
        ...item,
        completed_at: item.completed_at || null
      }));
      setExecutions(mappedData);
    } catch (error) {
      console.error('❌ Failed to fetch execution history:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (open && commandId) {
      fetchExecutions();
    }
  }, [open, commandId]);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="w-4 h-4 text-green-600" />;
      case 'failed':
        return <XCircle className="w-4 h-4 text-red-600" />;
      case 'running':
        return <RefreshCw className="w-4 h-4 text-blue-600 animate-spin" />;
      case 'pending':
        return <Clock className="w-4 h-4 text-yellow-600" />;
      default:
        return <AlertCircle className="w-4 h-4 text-gray-600" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-800 border-green-200';
      case 'failed': return 'bg-red-100 text-red-800 border-red-200';
      case 'running': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'pending': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const formatExecutionTime = (timeMs: number) => {
    if (timeMs < 1000) return `${timeMs}ms`;
    if (timeMs < 60000) return `${(timeMs / 1000).toFixed(1)}s`;
    return `${(timeMs / 60000).toFixed(1)}m`;
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-5xl max-h-[85vh]">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <DialogTitle className="flex items-center gap-2">
              <Play className="w-5 h-5" />
              Execution History: {commandName}
              {executions.length > 0 && (
                <Badge variant="secondary">{executions.length} executions</Badge>
              )}
            </DialogTitle>
            <Button variant="outline" size="sm" onClick={fetchExecutions} disabled={loading}>
              <RefreshCw className={`w-4 h-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
              Refresh
            </Button>
          </div>
        </DialogHeader>
        
        <ScrollArea className="h-[60vh] pr-4">
          {loading ? (
            <div className="flex items-center justify-center h-32">
              <div className="flex items-center gap-3">
                <RefreshCw className="w-6 h-6 animate-spin text-muted-foreground" />
                <span className="text-muted-foreground">Loading execution history...</span>
              </div>
            </div>
          ) : executions.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">
              <AlertCircle className="w-12 h-12 mx-auto mb-4 opacity-50" />
              <p className="text-lg font-medium mb-2">No execution history found</p>
              <p className="text-sm">This command hasn't been executed yet.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {executions.map((execution) => (
                <div key={execution.id} className="border rounded-lg p-4 space-y-4 hover:bg-muted/30 transition-colors">
                  {/* Header with status and timing */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      {getStatusIcon(execution.execution_status)}
                      <Badge className={getStatusColor(execution.execution_status)}>
                        {execution.execution_status.toUpperCase()}
                      </Badge>
                      <div className="flex items-center gap-1 text-sm text-muted-foreground">
                        <Calendar className="w-3 h-3" />
                        {formatDistanceToNow(new Date(execution.created_at), { addSuffix: true })}
                      </div>
                      {execution.user_id && (
                        <div className="flex items-center gap-1 text-sm text-muted-foreground">
                          <User className="w-3 h-3" />
                          <span className="font-mono text-xs">{execution.user_id.slice(0, 8)}...</span>
                        </div>
                      )}
                    </div>
                    <div className="flex items-center gap-3 text-sm text-muted-foreground">
                      {execution.execution_time_ms > 0 && (
                        <div className="flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {formatExecutionTime(execution.execution_time_ms)}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Error message */}
                  {execution.error_message && (
                    <div className="bg-red-50 border border-red-200 rounded p-3">
                      <div className="flex items-center gap-2 font-medium text-red-800 mb-1">
                        <XCircle className="w-4 h-4" />
                        Error Details:
                      </div>
                      <div className="text-sm text-red-700 font-mono whitespace-pre-wrap">
                        {execution.error_message}
                      </div>
                    </div>
                  )}

                  {/* Output data */}
                  {execution.output_data && Object.keys(execution.output_data).length > 0 && (
                    <div className="bg-green-50 border border-green-200 rounded p-3">
                      <div className="flex items-center gap-2 font-medium text-green-800 mb-2">
                        <CheckCircle className="w-4 h-4" />
                        Execution Output:
                      </div>
                      <pre className="text-sm text-green-700 font-mono overflow-x-auto whitespace-pre-wrap bg-white p-2 rounded border">
                        {JSON.stringify(execution.output_data, null, 2)}
                      </pre>
                    </div>
                  )}

                  {/* Input data (collapsible) */}
                  {execution.input_data && Object.keys(execution.input_data).length > 0 && (
                    <details className="bg-blue-50 border border-blue-200 rounded p-3">
                      <summary className="font-medium text-blue-800 cursor-pointer hover:text-blue-900">
                        📥 Input Data (click to expand)
                      </summary>
                      <pre className="text-sm text-blue-700 font-mono mt-2 overflow-x-auto whitespace-pre-wrap bg-white p-2 rounded border">
                        {JSON.stringify(execution.input_data, null, 2)}
                      </pre>
                    </details>
                  )}

                  {/* Execution timeline */}
                  <div className="text-xs text-muted-foreground pt-2 border-t bg-muted/20 p-2 rounded">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      <div>
                        <strong>Started:</strong> {new Date(execution.created_at).toLocaleString()}
                      </div>
                      {execution.completed_at && (
                        <div>
                          <strong>Completed:</strong> {new Date(execution.completed_at).toLocaleString()}
                        </div>
                      )}
                    </div>
                    <div className="mt-1">
                      <strong>Execution ID:</strong> <span className="font-mono">{execution.id}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
};

export default ExecutionHistoryModal;
