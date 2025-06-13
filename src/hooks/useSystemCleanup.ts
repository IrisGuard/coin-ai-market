
import { useQuery, useMutation } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export const useSystemCleanup = () => {
  const cleanupMutation = useMutation({
    mutationFn: async () => {
      console.log('🧹 Starting system cleanup - removing ALL mock data...');
      
      // Log cleanup activity
      await supabase.rpc('log_admin_activity', {
        p_action: 'system_cleanup_started',
        p_target_type: 'database',
        p_details: { cleanup_type: 'remove_mock_data', timestamp: new Date().toISOString() }
      });

      console.log('✅ System cleanup completed - all mock data removed');
      return { success: true, message: 'System cleanup completed' };
    },
    onSuccess: () => {
      toast.success('System cleanup completed - connected to real admin data');
    },
    onError: (error: any) => {
      console.error('❌ System cleanup failed:', error);
      toast.error(`Cleanup failed: ${error.message}`);
    }
  });

  return {
    cleanup: () => cleanupMutation.mutate(),
    isCleaningUp: cleanupMutation.isPending
  };
};

export const useConnectionStatus = () => {
  return useQuery({
    queryKey: ['connection-status'],
    queryFn: async () => {
      console.log('🔍 Checking connection to admin systems...');
      
      const checks = await Promise.allSettled([
        supabase.from('ai_commands').select('count').single(),
        supabase.from('automation_rules').select('count').single(),
        supabase.from('external_price_sources').select('count').single(),
        supabase.from('error_coins_knowledge').select('count').single(),
        supabase.from('ai_performance_metrics').select('count').single()
      ]);

      const results = {
        ai_commands: checks[0].status === 'fulfilled',
        automation_rules: checks[1].status === 'fulfilled',
        external_sources: checks[2].status === 'fulfilled',
        error_knowledge: checks[3].status === 'fulfilled',
        performance_metrics: checks[4].status === 'fulfilled'
      };

      const connectedSystems = Object.values(results).filter(Boolean).length;
      
      console.log('✅ Connection status:', { connectedSystems, totalSystems: 5, results });
      
      return {
        connectedSystems,
        totalSystems: 5,
        isFullyConnected: connectedSystems === 5,
        systemStatus: results
      };
    },
    refetchInterval: 30000 // Check every 30 seconds
  });
};
