
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
    onSuccess: (_, { coinIds, status }) => {
      queryClient.invalidateQueries({ queryKey: ['admin-coins'] });
      queryClient.invalidateQueries({ queryKey: ['admin-coin-analytics'] });
      toast({
        title: "Bulk Update Successful",
        description: `Updated ${coinIds.length} coins to ${status}`,
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Bulk Update Failed",
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
    onSuccess: (_, { coinIds, featured }) => {
      queryClient.invalidateQueries({ queryKey: ['admin-coins'] });
      queryClient.invalidateQueries({ queryKey: ['admin-coin-analytics'] });
      toast({
        title: "Bulk Feature Update",
        description: `${featured ? 'Featured' : 'Unfeatured'} ${coinIds.length} coins`,
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Bulk Feature Update Failed",
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
    onSuccess: (_, { coinIds }) => {
      queryClient.invalidateQueries({ queryKey: ['admin-coins'] });
      queryClient.invalidateQueries({ queryKey: ['admin-coin-analytics'] });
      toast({
        title: "Bulk Delete Successful",
        description: `Deleted ${coinIds.length} coins`,
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Bulk Delete Failed",
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
