
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';

export const useBulkOperations = () => {
  return useQuery({
    queryKey: ['bulk-operations'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('bulk_operations')
        .select('*')
        .order('started_at', { ascending: false });
      
      if (error) throw error;
      return data || [];
    },
  });
};

export const useExecuteBulkOperation = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (operationData: {
      operation_type: string;
      operation_name: string;
      target_table: string;
      operation_parameters: any;
    }) => {
      const { data, error } = await supabase.rpc('execute_bulk_operation', operationData);
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['bulk-operations'] });
      toast({
        title: "Bulk Operation Started",
        description: "Bulk operation has been queued for processing.",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: `Failed to start bulk operation: ${error.message}`,
        variant: "destructive",
      });
    },
  });
};

export const useUpdateBulkOperationStatus = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ 
      operationId, 
      status, 
      processedRecords, 
      failedRecords,
      errorLog 
    }: {
      operationId: string;
      status: string;
      processedRecords?: number;
      failedRecords?: number;
      errorLog?: any;
    }) => {
      const updateData: any = { status };
      
      if (processedRecords !== undefined) updateData.processed_records = processedRecords;
      if (failedRecords !== undefined) updateData.failed_records = failedRecords;
      if (errorLog !== undefined) updateData.error_log = errorLog;
      if (status === 'completed' || status === 'failed') {
        updateData.completed_at = new Date().toISOString();
      }

      const { data, error } = await supabase
        .from('bulk_operations')
        .update(updateData)
        .eq('id', operationId)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['bulk-operations'] });
    },
  });
};
