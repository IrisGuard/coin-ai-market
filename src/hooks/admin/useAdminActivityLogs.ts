
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';

export const useAdminActivityLogs = () => {
  return useQuery({
    queryKey: ['admin-activity-logs'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('admin_activity_logs')
        .select(`
          *,
          profiles!admin_activity_logs_admin_user_id_fkey(name, email)
        `)
        .order('created_at', { ascending: false })
        .limit(100);
      
      if (error) throw error;
      return data || [];
    },
  });
};

export const useLogAdminActivity = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ 
      action, 
      targetType, 
      targetId, 
      details 
    }: { 
      action: string; 
      targetType: string; 
      targetId?: string; 
      details?: any 
    }) => {
      const { error } = await supabase.rpc('log_admin_activity', {
        p_action: action,
        p_target_type: targetType,
        p_target_id: targetId || null,
        p_details: details || {}
      });
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-activity-logs'] });
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: `Failed to log activity: ${error.message}`,
        variant: "destructive",
      });
    },
  });
};
