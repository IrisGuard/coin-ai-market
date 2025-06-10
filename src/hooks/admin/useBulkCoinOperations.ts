
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';

export const useBulkCoinOperations = () => {
  const queryClient = useQueryClient();

  const bulkUpdateStatus = useMutation({
    mutationFn: async ({ coinIds, status }: { coinIds: string[]; status: string }) => {
      const { error } = await supabase
        .from('coins')
        .update({ authentication_status: status })
        .in('id', coinIds);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-coins'] });
      toast({
        title: "Success",
        description: "Coins updated successfully.",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const bulkToggleFeature = useMutation({
    mutationFn: async ({ coinIds, featured }: { coinIds: string[]; featured: boolean }) => {
      const { error } = await supabase
        .from('coins')
        .update({ featured })
        .in('id', coinIds);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-coins'] });
      toast({
        title: "Success",
        description: "Coins featured status updated successfully.",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const bulkDelete = useMutation({
    mutationFn: async ({ coinIds }: { coinIds: string[] }) => {
      const { error } = await supabase
        .from('coins')
        .delete()
        .in('id', coinIds);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-coins'] });
      toast({
        title: "Success",
        description: "Coins deleted successfully.",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  return {
    bulkUpdateStatus,
    bulkToggleFeature,
    bulkDelete
  };
};
