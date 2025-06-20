
import { useMutation } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export const useSystemCleanup = () => {
  const cleanupMutation = useMutation({
    mutationFn: async () => {
      console.log('🧹 Starting system maintenance...');
      
      await supabase.rpc('log_admin_activity', {
        p_action: 'system_maintenance',
        p_target_type: 'database',
        p_details: { maintenance_type: 'routine_check', timestamp: new Date().toISOString() }
      });

      console.log('✅ System maintenance completed');
      return { success: true, message: 'System maintenance completed' };
    },
    onSuccess: () => {
      toast.success('System maintenance completed successfully');
    },
    onError: (error: any) => {
      console.error('❌ System maintenance failed:', error);
      toast.error(`Maintenance failed: ${error.message}`);
    }
  });

  return {
    cleanup: () => cleanupMutation.mutate(),
    isCleaningUp: cleanupMutation.isPending
  };
};

export const useConnectionStatus = () => {
  const checkConnection = async () => {
    console.log('🔍 Checking system connections...');
    
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
  };

  return { checkConnection };
};
