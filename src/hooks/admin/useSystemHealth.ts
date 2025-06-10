
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

interface SystemHealthData {
  status: string;
  uptime: string;
  serverStatus: string;
  databaseStatus: string;
  apiResponseTime: number;
  lastChecked: Date;
  total_users?: number;
  total_coins?: number;
  total_transactions?: number;
  errors_24h?: number;
  active_users?: number;
  live_auctions?: number;
  featured_coins?: number;
  total_value?: number;
  error?: string;
}

export const useSystemHealth = () => {
  return useQuery({
    queryKey: ['system-health'],
    queryFn: async (): Promise<SystemHealthData> => {
      try {
        // Test database connection
        const { data, error } = await supabase.rpc('get_dashboard_stats');
        
        if (error) throw error;

        // Test API response time
        const startTime = Date.now();
        await supabase.from('profiles').select('id').limit(1);
        const apiResponseTime = Date.now() - startTime;

        const baseHealthData: SystemHealthData = {
          status: 'healthy',
          uptime: '99.9%',
          serverStatus: 'online',
          databaseStatus: 'connected',
          apiResponseTime,
          lastChecked: new Date()
        };

        // Only spread data if it exists and is an object
        return data && typeof data === 'object' 
          ? { ...baseHealthData, ...data }
          : baseHealthData;
      } catch (error) {
        return {
          status: 'error',
          uptime: '0%',
          serverStatus: 'offline',
          databaseStatus: 'disconnected',
          apiResponseTime: 0,
          lastChecked: new Date(),
          error: error instanceof Error ? error.message : 'Unknown error'
        };
      }
    },
    refetchInterval: 30000, // Refresh every 30 seconds
  });
};
