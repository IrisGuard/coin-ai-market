
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Clock, CheckCircle, XCircle, AlertCircle, Globe } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

interface ExecutionHistoryModalProps {
  commandId: string | null;
  commandName?: string;
  open: boolean;
  onClose: () => void;
}

interface ExecutionRecord {
  id: string;
  execution_status: string;
  input_data: any;
  output_data: any;
  execution_time_ms: number | null;
  error_message: string | null;
  created_at: string;
  user_id: string;
}

const ExecutionHistoryModal: React.FC<ExecutionHistoryModalProps> = ({
  commandId,
  commandName,
  open,
  onClose
}) => {
  const { data: executions = [], isLoading } = useQuery({
    queryKey: ['ai-command-executions', commandId],
    queryFn: async () => {
      if (!commandId) return [];
      
      console.log('🔍 Fetching execution history for command:', commandId);
      
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
      
      console.log('✅ Executions fetched:', data?.length || 0);
      return (data as ExecutionRecord[]) || [];
    },
    enabled: !!commandId && open,
  });

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'failed':
        return <XCircle className="w-4 h-4 text-red-500" />;
      case 'running':
        return <AlertCircle className="w-4 h-4 text-yellow-500" />;
      default:
        return <Clock className="w-4 h-4 text-gray-500" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'failed':
        return 'bg-red-100 text-red-800';
      case 'running':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const formatDuration = (ms: number | null) => {
    if (!ms) return 'N/A';
    if (ms < 1000) return `${ms}ms`;
    return `${(ms / 1000).toFixed(2)}s`;
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString();
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-hidden">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Clock className="w-5 h-5" />
            Execution History: {commandName || 'AI Command'}
          </DialogTitle>
        </DialogHeader>
        
        <ScrollArea className="max-h-[70vh] pr-4">
          {isLoading ? (
            <div className="flex items-center justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
              <span className="ml-2">Loading execution history...</span>
            </div>
          ) : executions.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <AlertCircle className="w-12 h-12 mx-auto mb-4 opacity-50" />
              <p>No execution history found for this command.</p>
              <p className="text-sm">Execute the command to see its history here.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {executions.map((execution) => (
                <div
                  key={execution.id}
                  className="border rounded-lg p-4 bg-card hover:bg-accent/50 transition-colors"
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-2">
                      {getStatusIcon(execution.execution_status)}
                      <Badge className={getStatusColor(execution.execution_status)}>
                        {execution.execution_status.toUpperCase()}
                      </Badge>
                      <span className="text-sm text-muted-foreground">
                        {formatDate(execution.created_at)}
                      </span>
                    </div>
                    <div className="text-sm text-muted-foreground">
                      Duration: {formatDuration(execution.execution_time_ms)}
                    </div>
                  </div>

                  {execution.input_data && Object.keys(execution.input_data).length > 0 && (
                    <div className="mb-3">
                      <h4 className="text-sm font-medium mb-1 flex items-center gap-1">
                        <Globe className="w-3 h-3" />
                        Input Data:
                      </h4>
                      <div className="bg-muted p-2 rounded text-xs font-mono max-h-20 overflow-auto">
                        {JSON.stringify(execution.input_data, null, 2)}
                      </div>
                    </div>
                  )}

                  {execution.output_data && (
                    <div className="mb-3">
                      <h4 className="text-sm font-medium mb-1">Output:</h4>
                      <div className="bg-muted p-2 rounded text-xs font-mono max-h-32 overflow-auto">
                        {typeof execution.output_data === 'string'
                          ? execution.output_data
                          : JSON.stringify(execution.output_data, null, 2)}
                      </div>
                    </div>
                  )}

                  {execution.error_message && (
                    <div className="mb-3">
                      <h4 className="text-sm font-medium mb-1 text-red-600">Error:</h4>
                      <div className="bg-red-50 border border-red-200 p-2 rounded text-xs text-red-800">
                        {execution.error_message}
                      </div>
                    </div>
                  )}
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
