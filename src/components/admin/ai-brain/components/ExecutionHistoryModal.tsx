
import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { supabase } from '@/integrations/supabase/client';
import { formatDistanceToNow } from 'date-fns';
import { RefreshCw, Clock, CheckCircle, XCircle, AlertCircle } from 'lucide-react';

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
      const { data, error } = await supabase
        .from('ai_command_executions')
        .select('id, execution_status, execution_time_ms, error_message, created_at, input_data, output_data')
        .eq('command_id', commandId)
        .order('created_at', { ascending: false })
        .limit(50);

      if (error) throw error;
      setExecutions(data || []);
    } catch (error) {
      console.error('Error fetching executions:', error);
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
      default:
        return <Clock className="w-4 h-4 text-yellow-600" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-800';
      case 'failed': return 'bg-red-100 text-red-800';
      case 'running': return 'bg-blue-100 text-blue-800';
      default: return 'bg-yellow-100 text-yellow-800';
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[80vh]">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <DialogTitle>Execution History: {commandName}</DialogTitle>
            <Button variant="outline" size="sm" onClick={fetchExecutions} disabled={loading}>
              <RefreshCw className={`w-4 h-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
              Refresh
            </Button>
          </div>
        </DialogHeader>
        
        <ScrollArea className="h-[500px] pr-4">
          {loading ? (
            <div className="flex items-center justify-center h-32">
              <RefreshCw className="w-6 h-6 animate-spin text-muted-foreground" />
            </div>
          ) : executions.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <AlertCircle className="w-12 h-12 mx-auto mb-4 opacity-50" />
              <p>No execution history found for this command.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {executions.map((execution) => (
                <div key={execution.id} className="border rounded-lg p-4 space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      {getStatusIcon(execution.execution_status)}
                      <Badge className={getStatusColor(execution.execution_status)}>
                        {execution.execution_status.toUpperCase()}
                      </Badge>
                      <span className="text-sm text-muted-foreground">
                        {formatDistanceToNow(new Date(execution.created_at), { addSuffix: true })}
                      </span>
                    </div>
                    {execution.execution_time_ms > 0 && (
                      <span className="text-sm text-muted-foreground">
                        {execution.execution_time_ms}ms
                      </span>
                    )}
                  </div>

                  {execution.error_message && (
                    <div className="bg-red-50 border border-red-200 rounded p-3">
                      <div className="font-medium text-red-800 mb-1">Error:</div>
                      <div className="text-sm text-red-700">{execution.error_message}</div>
                    </div>
                  )}

                  {execution.output_data && Object.keys(execution.output_data).length > 0 && (
                    <div className="bg-gray-50 border rounded p-3">
                      <div className="font-medium text-gray-800 mb-2">Output:</div>
                      <pre className="text-sm text-gray-700 overflow-x-auto">
                        {JSON.stringify(execution.output_data, null, 2)}
                      </pre>
                    </div>
                  )}

                  {execution.input_data && Object.keys(execution.input_data).length > 0 && (
                    <details className="bg-gray-50 border rounded p-3">
                      <summary className="font-medium text-gray-800 cursor-pointer">
                        Input Data
                      </summary>
                      <pre className="text-sm text-gray-700 mt-2 overflow-x-auto">
                        {JSON.stringify(execution.input_data, null, 2)}
                      </pre>
                    </details>
                  )}

                  <div className="text-xs text-muted-foreground pt-2 border-t">
                    Started: {new Date(execution.created_at).toLocaleString()}
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
